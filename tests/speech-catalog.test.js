import { describe, expect, it } from 'vitest'
import { readSpeechEntries, extractSpeechEntries, escapeXml, makeSsml } from '../scripts/speech-catalog.mjs'

describe('Kazakh speech generation catalogue', () => {
  it('extracts all word, phrase, story and grammar narration segments', async () => {
    const entries = await readSpeechEntries()
    expect(entries.length).toBeGreaterThanOrEqual(20)
    expect(new Set(entries.map(entry => entry.key)).size).toBe(entries.length)
    expect(entries.some(entry => entry.key === 'word:word-alma:main' && entry.text === 'Алма')).toBe(true)
    expect(entries.some(entry => entry.key === 'phrase:phrase-how-are-you:main')).toBe(true)
    expect(entries.some(entry => entry.key.startsWith('reading:'))).toBe(true)
    expect(entries.some(entry => entry.key.startsWith('grammar:'))).toBe(true)
  })
  it('preserves Kazakh characters and escapes unsafe SSML', () => {
    expect(escapeXml('Әлия & <Айдана>')).toBe('Әлия &amp; &lt;Айдана&gt;')
    const xml = makeSsml('Қалыңыз қалай? &', 'kk-KZ-AigulNeural')
    expect(xml).toContain('kk-KZ-AigulNeural')
    expect(xml).toContain('Қалыңыз қалай? &amp;')
    expect(() => makeSsml('Сәлем', 'en-US-AriaNeural')).toThrow()
  })
  it('rejects duplicate audio IDs instead of accidentally overwriting files', () => {
    const snippet = `export const words = [
      {id: 'same', word: 'бір', examples: []},
      {id: 'same', word: 'екі', examples: []}
    ]
    export const phrases = []
    export const readings = []
    export const grammar = []`
    expect(() => extractSpeechEntries(snippet)).toThrow(/Duplicate/)
  })
})
