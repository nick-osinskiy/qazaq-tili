import { describe, expect, it } from 'vitest'
import { words, phrases, readings, exercises, grammar, contentCount } from '../src/data/content'

describe('content catalogue', () => {
  it('has unique stable identifiers across all five post types', () => {
    const all = [...words, ...phrases, ...readings, ...exercises, ...grammar]
    expect(new Set(all.map(item => item.id)).size).toBe(all.length)
    expect(contentCount).toBe(all.length)
  })

  it('has examples and translated paragraphs where expected', () => {
    expect(words.every(word => word.examples.length > 0 && word.translation)).toBe(true)
    expect(phrases.every(phrase => phrase.breakdown.length > 0)).toBe(true)
    expect(readings.every(post => post.paragraphs.every(paragraph => paragraph.kk && paragraph.ru))).toBe(true)
    expect(grammar.every(post => post.examples.length >= 2)).toBe(true)
  })

  it('supports each of the four exercise formats', () => {
    expect(new Set(exercises.map(item => item.format))).toEqual(new Set(['choice', 'fill', 'ordering', 'matching']))
  })

  it('uses valid answer indices in choice and ordering exercises', () => {
    for (const exercise of exercises) {
      if (exercise.format === 'choice') {
        expect(exercise.options[exercise.answerIndex]).toBeTruthy()
      } else if (exercise.format === 'ordering') {
        expect([...exercise.answer].sort((a, b) => a - b)).toEqual(exercise.tokens.map((_, index) => index))
      }
    }
  })
})
