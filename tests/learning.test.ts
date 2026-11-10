import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { STORAGE_KEY, useLearningStore } from '../src/stores/learning'

beforeEach(() => {
  localStorage.clear()
  setActivePinia(createPinia())
})

describe('learning progress', () => {
  it('toggles favorites and persists them', () => {
    const store = useLearningStore()
    store.toggleFavorite('word-salem')
    expect(store.isFavorite('word-salem')).toBe(true)
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}').favorites).toContain('word-salem')
    store.toggleFavorite('word-salem')
    expect(store.isFavorite('word-salem')).toBe(false)
  })

  it('keeps prior success when an exercise is retried incorrectly', () => {
    const store = useLearningStore()
    store.recordExercise('exercise-choice-salem', true)
    store.recordExercise('exercise-choice-salem', false)
    expect(store.isExerciseCorrect('exercise-choice-salem')).toBe(true)
  })

  it('recovers gracefully from corrupt stored data', () => {
    localStorage.setItem(STORAGE_KEY, '{invalid')
    setActivePinia(createPinia())
    expect(useLearningStore().favorites).toEqual([])
  })
})
