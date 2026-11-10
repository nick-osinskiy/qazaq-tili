import { createRouter, createWebHashHistory } from 'vue-router'
import FeedView from './views/FeedView.vue'
import type { ContentSection } from './types/content'

const pages: { path: string; name: string; section: ContentSection }[] = [
  { path: '/', name: 'Главная', section: 'all' },
  { path: '/words', name: 'Слова', section: 'words' },
  { path: '/phrases', name: 'Фразы', section: 'phrases' },
  { path: '/readings', name: 'Тексты', section: 'readings' },
  { path: '/exercises', name: 'Практика', section: 'exercises' },
  { path: '/grammar', name: 'Грамматика', section: 'grammar' }
]

export const navigation = pages

export default createRouter({
  history: createWebHashHistory(),
  routes: pages.map(page => ({
    path: page.path,
    name: page.name,
    component: FeedView,
    props: { section: page.section }
  })),
  scrollBehavior() {
    return { top: 0 }
  }
})
