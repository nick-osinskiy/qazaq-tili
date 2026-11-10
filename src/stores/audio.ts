import { defineStore } from 'pinia'

export type KazakhVoice = 'aigul' | 'daulet'
export type PlaybackRate = 1 | 0.75
export const AUDIO_SETTINGS_KEY = 'soz.audio.settings.v1'

function restoreAudioSettings(): { voice: KazakhVoice; rate: PlaybackRate } {
  const fallback = { voice: 'aigul' as KazakhVoice, rate: 1 as PlaybackRate }
  if (typeof localStorage === 'undefined') return fallback
  try {
    const raw = JSON.parse(localStorage.getItem(AUDIO_SETTINGS_KEY) || '{}')
    return {
      voice: raw.voice === 'daulet' ? 'daulet' : 'aigul',
      rate: raw.rate === 0.75 ? 0.75 : 1
    }
  } catch {
    return fallback
  }
}

export const useAudioStore = defineStore('audio', {
  state: restoreAudioSettings,
  actions: {
    setVoice(value: KazakhVoice) {
      this.voice = value
      this.persist()
    },
    setRate(value: PlaybackRate) {
      this.rate = value
      this.persist()
    },
    persist() {
      try {
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem(AUDIO_SETTINGS_KEY, JSON.stringify({
            voice: this.voice, rate: this.rate
          }))
        }
      } catch {
        // The audio preference still works in the current session.
      }
    }
  }
})
