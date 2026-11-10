import { createHash } from 'node:crypto'
import { mkdir, readFile, stat, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { readSpeechEntries, makeSsml } from './speech-catalog.mjs'

const ROOT = process.cwd()
const INDEX_FILE = path.join(ROOT, 'src/data/audio-index.json')
const VOICES = {
  aigul: 'kk-KZ-AigulNeural',
  daulet: 'kk-KZ-DauletNeural'
}
const args = new Set(process.argv.slice(2))
const planOnly = args.has('--plan')
const maxClips = Number(process.env.AUDIO_MAX_NEW_CLIPS || '80')
if (!Number.isSafeInteger(maxClips) || maxClips < 1 || maxClips > 500) {
  throw new Error('AUDIO_MAX_NEW_CLIPS must be an integer between 1 and 500')
}

function filenameFor(key, voice) {
  const label = key.replace(/[^a-zA-Z0-9-]/g, '-').slice(0, 70)
  const suffix = createHash('sha256').update(key).digest('hex').slice(0, 12)
  return `audio/kk-KZ/${voice}/${label}-${suffix}.mp3`
}

async function existsWithAudio(relativePath) {
  try {
    return (await stat(path.join(ROOT, 'public', relativePath))).size > 100
  } catch {
    return false
  }
}

async function loadIndex() {
  try {
    const data = JSON.parse(await readFile(INDEX_FILE, 'utf8'))
    return data && !Array.isArray(data) && typeof data === 'object' ? data : {}
  } catch (error) {
    if (error?.code === 'ENOENT') return {}
    throw error
  }
}

function regionEndpoint(region) {
  if (!/^[a-z0-9-]+$/.test(region)) throw new Error('Invalid Azure region identifier')
  return `https://${region}.tts.speech.microsoft.com/cognitiveservices/v1`
}

async function synthesize(text, voice, region, key) {
  const endpoint = regionEndpoint(region)
  const ssml = makeSsml(text, voice)
  for (let attempt = 0; attempt < 3; attempt++) {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Ocp-Apim-Subscription-Key': key,
        'Content-Type': 'application/ssml+xml',
        'X-Microsoft-OutputFormat': 'audio-24khz-48kbitrate-mono-mp3',
        'User-Agent': 'Soz-Kazakh-Learning-AudioGenerator'
      },
      body: ssml,
      signal: AbortSignal.timeout(30000)
    })
    if (response.ok) {
      const bytes = Buffer.from(await response.arrayBuffer())
      if (bytes.length < 100) throw new Error('Azure returned an unexpectedly short audio file')
      return bytes
    }
    if ((response.status === 429 || response.status >= 500) && attempt < 2) {
      await new Promise(resolve => setTimeout(resolve, 1500 * (attempt + 1)))
      continue
    }
    // Do not print response body, headers, or credentials.
    throw new Error('Azure Speech request failed (HTTP ' + response.status + '). Check subscription, region and quota.')
  }
  throw new Error('Azure Speech could not generate an audio file')
}

const entries = await readSpeechEntries()
const index = await loadIndex()
const tasks = []
for (const entry of entries) {
  const record = index[entry.key]
  for (const [voice, azureName] of Object.entries(VOICES)) {
    const relativePath = filenameFor(entry.key, voice)
    if (record?.text === entry.text &&
        record?.voices?.[voice] === relativePath &&
        await existsWithAudio(relativePath)) continue
    tasks.push({ ...entry, voice, azureName, relativePath })
  }
}
const charCount = tasks.reduce((sum, task) => sum + task.text.length, 0)
console.log(`СӨЗ audio: ${entries.length} narration segments, ${tasks.length} MP3 missing/outdated, ${charCount} characters to synthesize.`)
if (planOnly) {
  console.log('Dry run: no API requests, no file changes.')
} else if (!tasks.length) {
  console.log('Everything is up to date; nothing to generate.')
} else {
  const key = process.env.AZURE_SPEECH_KEY
  const region = process.env.AZURE_SPEECH_REGION
  if (!key || !region) throw new Error('Set AZURE_SPEECH_KEY and AZURE_SPEECH_REGION as GitHub Actions secrets.')
  const selected = tasks.slice(0, maxClips)
  let generated = 0
  for (const task of selected) {
    const bytes = await synthesize(task.text, task.azureName, region, key)
    const fullPath = path.join(ROOT, 'public', task.relativePath)
    await mkdir(path.dirname(fullPath), { recursive: true })
    await writeFile(fullPath, bytes)
    const old = index[task.key]
    const sameText = old?.text === task.text
    index[task.key] = {
      text: task.text,
      voices: {
        ...(sameText ? old.voices : {}),
        [task.voice]: task.relativePath
      }
    }
    generated++
    console.log(`Created ${generated}/${selected.length}: ${task.key} (${task.voice})`)
  }
  // Removes references to deleted cards. Old MP3 files can be pruned separately after review.
  const liveKeys = new Set(entries.map(entry => entry.key))
  for (const key of Object.keys(index)) if (!liveKeys.has(key)) delete index[key]
  await mkdir(path.dirname(INDEX_FILE), { recursive: true })
  await writeFile(INDEX_FILE, JSON.stringify(index, null, 2) + '\n')
  console.log(`Saved ${generated} files; ${tasks.length - selected.length} still pending. Recordings are committed by GitHub Actions.`)
}
