import { defineStore } from 'pinia'

export const STORAGE_KEY = 'soz.learning.v1'

interface Progress {
  favorites: string[]
  knownWords: string[]
  readPosts: string[]
  exerciseResults: Record<string, boolean>
}

function readProgress(): Progress {
  const fallback: Progress = {
    favorites: [], knownWords: [], readPosts: [], exerciseResults: {}
  }
  if (typeof localStorage === 'undefined') return fallback

  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') as Partial<Progress>
    const ids = (value: unknown): string[] =>
      Array.isArray(value) ? value.filter((id): id is string => typeof id === 'string') : []
    const results = raw.exerciseResults
    const exerciseResults: Record<string, boolean> = {}
    if (results && typeof results === 'object' && !Array.isArray(results)) {
      for (const [key, value] of Object.entries(results)) {
        if (typeof value === 'boolean') exerciseResults[key] = value
      }
    }
    return {
      favorites: ids(raw.favorites),
      knownWords: ids(raw.knownWords),
      readPosts: ids(raw.readPosts),
      exerciseResults
    }
  } catch {
    return fallback
  }
}

export const useLearningStore = defineStore('learning', {
  state: readProgress,
  getters: {
    isFavorite: state => (id: string) => state.favorites.includes(id),
    isKnown: state => (id: string) => state.knownWords.includes(id),
    isRead: state => (id: string) => state.readPosts.includes(id),
    isExerciseCorrect: state => (id: string) => state.exerciseResults[id] === true,
    completedCount: state =>
      state.knownWords.length + state.readPosts.length +
      Object.values(state.exerciseResults).filter(Boolean).length
  },
  actions: {
    persist() {
      if (typeof localStorage === 'undefined') return
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
          favorites: this.favorites,
          knownWords: this.knownWords,
          readPosts: this.readPosts,
          exerciseResults: this.exerciseResults
        }))
      } catch {
        // Quota or privacy mode: the session remains usable without storage.
      }
    },
    toggleFavorite(id: string) {
      this.favorites = this.favorites.includes(id)
        ? this.favorites.filter(value => value !== id)
        : [...this.favorites, id]
      this.persist()
    },
    toggleKnown(id: string) {
      this.knownWords = this.knownWords.includes(id)
        ? this.knownWords.filter(value => value !== id)
        : [...this.knownWords, id]
      this.persist()
    },
    toggleRead(id: string) {
      this.readPosts = this.readPosts.includes(id)
        ? this.readPosts.filter(value => value !== id)
        : [...this.readPosts, id]
      this.persist()
    },
    recordExercise(id: string, correct: boolean) {
      // A successful attempt is retained even if a later retry is incorrect.
      this.exerciseResults[id] = this.exerciseResults[id] === true || correct
      this.persist()
    }
  }
})
