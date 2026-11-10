import { createPinia, setActivePinia } from 'pinia'
import { describe, it, expect, beforeEach } from 'vitest'
import { useAudioStore, AUDIO_SETTINGS_KEY } from '../src/stores/audio'
import { findAudioPath } from '../src/audio'

beforeEach(() => {
  localStorage.clear()
  setActivePinia(createPinia())
})

describe('audio preferences and static MP3 lookup', () => {
  it('starts with Aigul and normal speed', () => {
    const store = useAudioStore()
    expect(store.voice).toBe('aigul')
    expect(store.rate).toBe(1)
  })
  it('persists selected Daulet voice and slow playback', () => {
    const store = useAudioStore()
    store.setVoice('daulet')
    store.setRate(0.75)
    expect(JSON.parse(localStorage.getItem(AUDIO_SETTINGS_KEY) || '{}')).toEqual({ voice: 'daulet', rate: 0.75 })
  })
  it('refuses an audio recording if the text no longer matches', () => {
    expect(findAudioPath('word:word-alma:main', 'other unrelated text', 'aigul')).toBeNull()
    expect(findAudioPath('word:missing:main', 'Кітап', 'daulet')).toBeNull()
  })
})
