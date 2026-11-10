<script setup lang="ts">
import { ref } from 'vue'
import type { ReadingPost } from '../types/content'
import { useLearningStore } from '../stores/learning'
import CardFrame from './CardFrame.vue'
import FavoriteButton from './FavoriteButton.vue'
import SpeakButton from './SpeakButton.vue'

defineProps<{ item: ReadingPost }>()
const store = useLearningStore()
const showTranslation = ref(false)
const showWords = ref(false)
</script>

<template>
  <CardFrame kind="reading" label="Текст / рассказ" :level="item.level">
    <template #actions><FavoriteButton :id="item.id" /></template>
    <p class="card-kicker">{{ item.readingMinutes }} мин · {{ item.tags.join(' · ') }}</p>
    <h2 class="post-title" lang="kk">{{ item.title }}</h2>
    <p class="post-lead">{{ item.summary }}</p>
    <div class="reading-body">
      <div v-for="(paragraph, index) in item.paragraphs" :key="index" class="reading-paragraph">
        <div class="audio-inline"><p lang="kk">{{ paragraph.kk }}</p><SpeakButton :text="paragraph.kk" :audio-key="`reading:${item.id}:paragraph:${index}`" /></div>
        <p v-if="showTranslation" class="translated-paragraph">{{ paragraph.ru }}</p>
      </div>
    </div>
    <div class="button-row">
      <button type="button" class="subtle-button" :aria-expanded="showTranslation" @click="showTranslation = !showTranslation">
        {{ showTranslation ? 'Скрыть перевод' : 'Перевести текст' }}
      </button>
      <button type="button" class="subtle-button" :aria-expanded="showWords" @click="showWords = !showWords">
        {{ showWords ? 'Скрыть словарь' : 'Слова из текста' }}
      </button>
    </div>
    <div v-if="showWords" class="vocab-list">
      <div v-for="word in item.vocabulary" :key="word.kk" class="vocab-item">
        <strong lang="kk">{{ word.kk }}</strong><span>{{ word.ru }}</span>
      </div>
    </div>
    <template #footer>
      <button
        type="button"
        class="action-button"
        :class="{ 'action-button--done': store.isRead(item.id) }"
        :aria-pressed="store.isRead(item.id)"
        @click="store.toggleRead(item.id)"
      >{{ store.isRead(item.id) ? '✓ Текст прочитан' : 'Отметить как прочитанный' }}</button>
    </template>
  </CardFrame>
</template>
