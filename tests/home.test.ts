import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import { createPinia } from 'pinia'
import { createMemoryHistory, createRouter } from 'vue-router'
import HomeView from '../src/views/HomeView.vue'
import { words } from '../src/data/content'

let wrapper: VueWrapper | undefined

async function renderHome() {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', component: HomeView },
      { path: '/words', component: { template: '<div>Слова</div>' } },
      { path: '/phrases', component: { template: '<div>Фразы</div>' } },
      { path: '/readings', component: { template: '<div>Тексты</div>' } },
      { path: '/grammar', component: { template: '<div>Грамматика</div>' } },
      { path: '/exercises', component: { template: '<div>Упражнения</div>' } }
    ]
  })
  await router.push('/')
  await router.isReady()
  wrapper = mount(HomeView, { attachTo: document.body, global: { plugins: [createPinia(), router] } })
  return wrapper
}

beforeEach(() => localStorage.clear())
afterEach(() => {
  wrapper?.unmount()
  wrapper = undefined
  vi.restoreAllMocks()
})

describe('main page demo', () => {
  it('shows all five learning formats on the homepage', async () => {
    const view = await renderHome()
    expect(view.findAll('.home-demo-module')).toHaveLength(4)
    expect(view.find('.home-practice__quiz').exists()).toBe(true)
    expect(view.text()).toContain('Словарные карточки')
    expect(view.text()).toContain('Разговорные фразы')
    expect(view.text()).toContain('Тексты и рассказы')
    expect(view.text()).toContain('Грамматика без перегруза')
    expect(view.text()).toContain('От теории — к практике')
  })

  it('shows an image and can reveal the vocabulary translation', async () => {
    const view = await renderHome()
    const card = view.find('.home-demo-module .learning-card[data-kind="word"]')
    expect(card.find('img.word-illustration__image').attributes('alt')).toContain('яблоко')
    await card.find('.word-flip').trigger('click')
    expect(card.find('.translation-reveal').isVisible()).toBe(true)
  })

  it('updates the progress when a word is marked learned', async () => {
    const view = await renderHome()
    const progress = view.find('.home-progress-panel__caption')
    expect(progress.text()).toContain('Освоено 0')
    await view.find('.home-demo-module .learning-card[data-kind="word"] .action-button').trigger('click')
    expect(progress.text()).toContain('Освоено 1')
    expect(view.find('[role="progressbar"]').attributes('aria-valuenow')).toBe('1')
  })

  it('has real image paths on each starter vocabulary item', () => {
    expect(words.length).toBeGreaterThanOrEqual(5)
    expect(words.every(word => word.image && word.imageAlt)).toBe(true)
  })
})
