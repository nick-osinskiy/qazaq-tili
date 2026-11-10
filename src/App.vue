<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { navigation } from './router'
import { useLearningStore } from './stores/learning'

const route = useRoute()
const progress = useLearningStore()
const isHome = computed(() => route.path === '/')
const currentPage = computed(() => navigation.find(page => page.path === route.path)?.name || 'Главная')
</script>

<template>
  <div class="app-shell">
    <header class="topbar">
      <RouterLink to="/" class="brand" aria-label="СӨЗ — на главную">
        <span class="brand-mark" lang="kk">Ө</span>
        <span class="brand-text">СӨЗ<small>Казахский каждый день</small></span>
      </RouterLink>
      <div class="topbar-meta"><span class="status-dot"></span> Уровень A1 <span class="header-progress">· {{ progress.completedCount }} освоено</span></div>
    </header>

    <nav class="section-nav" aria-label="Разделы обучения">
      <RouterLink
        v-for="page in navigation"
        :key="page.path"
        :to="page.path"
        class="section-tab"
        exact-active-class="section-tab--active"
      >{{ page.name }}</RouterLink>
    </nav>

    <main>
      <section v-if="!isHome" class="hero page-hero">
        <div class="hero-content">
          <p class="hero-eyebrow">СӨЗ · САМОУЧИТЕЛЬ КАЗАХСКОГО</p>
          <h1>{{ currentPage }}</h1>
          <p class="hero-description">Учись в своём темпе. Все изменения в упражнениях и карточках сохраняются на этом устройстве.</p>
        </div>
        <div class="hero-decor" aria-hidden="true">ә<br>ң ө ү</div>
      </section>

      <RouterView />
    </main>

    <footer class="site-footer">
      <span>СӨЗ · v0.3.0</span>
      <span>От первого слова до свободной речи.</span>
    </footer>
  </div>
</template>
