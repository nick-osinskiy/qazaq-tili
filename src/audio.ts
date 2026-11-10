import rawAudioIndex from './data/audio-index.json'
import type { KazakhVoice } from './stores/audio'

export interface AudioRecord {
  text: string
  voices: Partial<Record<KazakhVoice, string>>
}
const index = rawAudioIndex as Record<string, AudioRecord>

/** Only files generated for the exact current Kazakh text are considered valid. */
export function findAudioPath(key: string | undefined, text: string, voice: KazakhVoice): string | null {
  if (!key || !index[key] || index[key].text !== text) return null
  const file = index[key].voices?.[voice]
  if (!file || !/^audio\/kk-KZ\/(aigul|daulet)\/[a-z0-9-]+\.mp3$/i.test(file)) return null
  return `${import.meta.env.BASE_URL}${file}`
}
