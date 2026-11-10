<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import type { ContentSection } from '../types/content'
import { words, phrases, readings, exercises, grammar, contentCount } from '../data/content'
import WordCard from '../components/WordCard.vue'
import PhraseCard from '../components/PhraseCard.vue'
import ReadingPost from '../components/ReadingPost.vue'
import ExerciseCard from '../components/ExerciseCard.vue'
import GrammarPost from '../components/GrammarPost.vue'

const props = defineProps<{ section: ContentSection }>()
const route = useRoute()
const visible = (section: Exclude<ContentSection, 'all'>) => props.section === 'all' || props.section === section
const visibleExercises = computed(() => {
  const focus = route.query.focus
  return typeof focus === 'string' && focus.length
    ? exercises.filter(exercise => exercise.id === focus)
    : exercises
})
const currentCount = computed(() => {
  switch (props.section) {
    case 'words': return words.length
    case 'phrases': return phrases.length
    case 'readings': return readings.length
    case 'exercises': return visibleExercises.value.length
    case 'grammar': return grammar.length
    default: return contentCount
  }
})
</script>

<template>
  <div class="feed-view">
    <div class="feed-intro">
      <div>
        <p class="overline">БИБЛИОТЕКА ЗНАНИЙ</p>
        <h2>{{ section === 'all' ? 'Начни с малого' : 'Материалы раздела' }}</h2>
        <p class="feed-intro-text">Все карточки интерактивные. Переводы открываются по нажатию.</p>
      </div>
      <span class="content-count">{{ currentCount }} материалов</span>
    </div>

    <section v-if="visible('words')" class="feed-section" aria-labelledby="section-words">
      <header class="section-heading"><h3 id="section-words">Слова <span lang="kk">· Сөздер</span></h3><span>Учи и повторяй</span></header>
      <div class="post-grid">
        <WordCard v-for="item in words" :key="item.id" :item="item" />
      </div>
    </section>

    <section v-if="visible('phrases')" class="feed-section" aria-labelledby="section-phrases">
      <header class="section-heading"><h3 id="section-phrases">Фразы <span lang="kk">· Сөйлемдер</span></h3><span>Для реальных ситуаций</span></header>
      <div class="post-grid">
        <PhraseCard v-for="item in phrases" :key="item.id" :item="item" />
      </div>
    </section>

    <section v-if="visible('readings')" class="feed-section" aria-labelledby="section-readings">
      <header class="section-heading"><h3 id="section-readings">Чтение <span lang="kk">· Оқу</span></h3><span>Короткие истории</span></header>
      <div class="post-grid post-grid--single">
        <ReadingPost v-for="item in readings" :key="item.id" :item="item" />
      </div>
    </section>

    <section v-if="visible('exercises')" class="feed-section" aria-labelledby="section-exercises">
      <header class="section-heading"><h3 id="section-exercises">Практика <span lang="kk">· Жаттығулар</span></h3><span>Проверь себя</span></header>
      <div class="post-grid">
        <ExerciseCard v-for="item in visibleExercises" :key="item.id" :item="item" />
      </div>
      <p v-if="!visibleExercises.length" class="empty-notice">Упражнение не найдено. <RouterLink to="/exercises">Показать все упражнения</RouterLink>.</p>
    </section>

    <section v-if="visible('grammar')" class="feed-section" aria-labelledby="section-grammar">
      <header class="section-heading"><h3 id="section-grammar">Грамматика <span lang="kk">· Грамматика</span></h3><span>Понятно, с примерами</span></header>
      <div class="post-grid">
        <GrammarPost v-for="item in grammar" :key="item.id" :item="item" />
      </div>
    </section>
  </div>
</template>
