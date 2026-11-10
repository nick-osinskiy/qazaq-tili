import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia } from 'pinia'
import { mount } from '@vue/test-utils'
import WordCard from '../src/components/WordCard.vue'
import ExerciseCard from '../src/components/ExerciseCard.vue'
import ReadingPost from '../src/components/ReadingPost.vue'
import { words, readings, exercises } from '../src/data/content'

beforeEach(() => localStorage.clear())

describe('interactive learning cards', () => {
  it('reveals a word translation on click', async () => {
    const wrapper = mount(WordCard, { props: { item: words[0] }, global: { plugins: [createPinia()] } })
    expect(wrapper.find('.translation-reveal').isVisible()).toBe(false)
    await wrapper.find('.word-flip').trigger('click')
    expect(wrapper.find('.translation-reveal').isVisible()).toBe(true)
    expect(wrapper.text()).toContain('Привет')
  })

  it('checks a single-choice answer correctly', async () => {
    const item = exercises.find(exercise => exercise.format === 'choice')
    if (!item || item.format !== 'choice') throw Error('Missing choice fixture')
    const wrapper = mount(ExerciseCard, { props: { item }, global: { plugins: [createPinia()] } })
    await wrapper.findAll('.answer-option')[item.answerIndex].trigger('click')
    await wrapper.find('.check-button').trigger('click')
    expect(wrapper.text()).toContain('Верно!')
  })

  it('shows translations in a reading post only after request', async () => {
    const wrapper = mount(ReadingPost, { props: { item: readings[0] }, global: { plugins: [createPinia()] } })
    expect(wrapper.find('.translated-paragraph').exists()).toBe(false)
    await wrapper.findAll('.subtle-button')[0].trigger('click')
    expect(wrapper.find('.translated-paragraph').exists()).toBe(true)
  })
})
