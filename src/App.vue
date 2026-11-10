<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { navigation } from './router'
import { useLearningStore } from './stores/learning'

const route = useRoute()
const progress = useLearningStore()
const currentPage = computed(() => navigation.find(page => page.path === route.path)?.name || 'Главная')
</script>

<template>
  <div class="app-shell">
    <header class="topbar">
      <RouterLink to="/" class="brand" aria-label="СӨЗ — на главную">
        <span class="brand-mark" lang="kk">Ө</span>
        <span class="brand-text">СӨЗ<small>Қазақ тілін үйренеміз</small></span>
      </RouterLink>
      <div class="topbar-meta"><span class="status-dot"></span> Уровень A1</div>
    </header>

    <main>
      <section class="hero">
        <div class="hero-content">
          <p class="hero-eyebrow">КАЗАХСКИЙ КАЖДЫЙ ДЕНЬ</p>
          <h1>{{ currentPage === 'Главная' ? 'Тіл үйрену — қызық!' : currentPage }}</h1>
          <p class="hero-description">
            {{ currentPage === 'Главная'
              ? 'Открывай слова и фразы, читай короткие тексты и закрепляй знания в упражнениях.'
              : 'Изучай материал в удобном темпе. Результаты сохраняются на этом устройстве.' }}
          </p>
          <div class="hero-stats">
            <span>✦ Материалы A1</span>
            <span>✓ {{ progress.completedCount }} выполнено</span>
            <span>♡ {{ progress.favorites.length }} сохранено</span>
          </div>
        </div>
        <div class="hero-decor" aria-hidden="true">ә<br>ң ө ү</div>
      </section>

      <nav class="section-nav" aria-label="Разделы обучения">
        <RouterLink
          v-for="page in navigation"
          :key="page.path"
          :to="page.path"
          class="section-tab"
          exact-active-class="section-tab--active"
        >{{ page.name }}</RouterLink>
      </nav>

      <RouterView />
    </main>

    <footer class="site-footer">
      <span>СӨЗ • v0.2.0</span>
      <span>Учимся говорить по-казахски уверенно.</span>
    </footer>
  </div>
</template>
