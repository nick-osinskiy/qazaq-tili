<script setup lang="ts">
import { ref } from 'vue'
import type { WordPost } from '../types/content'
import { useLearningStore } from '../stores/learning'
import CardFrame from './CardFrame.vue'
import FavoriteButton from './FavoriteButton.vue'
import SpeakButton from './SpeakButton.vue'

defineProps<{ item: WordPost }>()
const store = useLearningStore()
const revealed = ref(false)
</script>

<template>
  <CardFrame kind="word" label="Слово" :level="item.level">
    <template #actions>
      <SpeakButton :text="item.word" />
      <FavoriteButton :id="item.id" />
    </template>
    <p class="card-kicker">{{ item.partOfSpeech }} · {{ item.tags.join(', ') }}</p>
    <button
      type="button"
      class="word-flip"
      :aria-expanded="revealed"
      :aria-controls="'word-translation-' + item.id"
      @click="revealed = !revealed"
    >
      <span class="big-kk" lang="kk">{{ item.word }}</span>
      <span class="transcription">{{ item.transcription || 'Нажми, чтобы открыть перевод' }}</span>
      <span class="reveal-hint">{{ revealed ? 'Скрыть перевод ↑' : 'Показать перевод ↓' }}</span>
    </button>
    <div :id="'word-translation-' + item.id" v-show="revealed" class="translation-reveal">
      <strong>{{ item.translation }}</strong>
      <div v-for="(example, index) in item.examples" :key="index" class="bilingual-example">
        <span lang="kk">{{ example.kk }}</span>
        <span class="muted">{{ example.ru }}</span>
      </div>
    </div>
    <template #footer>
      <button
        class="action-button"
        :class="{ 'action-button--done': store.isKnown(item.id) }"
        type="button"
        :aria-pressed="store.isKnown(item.id)"
        @click="store.toggleKnown(item.id)"
      >{{ store.isKnown(item.id) ? '✓ Слово выучено' : 'Отметить как выученное' }}</button>
    </template>
  </CardFrame>
</template>
