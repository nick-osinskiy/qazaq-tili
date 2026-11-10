<script setup lang="ts">
import { ref } from 'vue'
import type { PhrasePost } from '../types/content'
import CardFrame from './CardFrame.vue'
import FavoriteButton from './FavoriteButton.vue'
import SpeakButton from './SpeakButton.vue'

defineProps<{ item: PhrasePost }>()
const revealTranslation = ref(false)
const revealBreakdown = ref(false)
</script>

<template>
  <CardFrame kind="phrase" label="Фраза" :level="item.level">
    <template #actions>
      <SpeakButton :text="item.phrase" :audio-key="`phrase:${item.id}:main`" />
      <FavoriteButton :id="item.id" />
    </template>
    <p class="card-kicker">{{ item.situation }}</p>
    <h2 class="phrase-title" lang="kk">{{ item.phrase }}</h2>
    <div class="button-row">
      <button class="subtle-button" type="button" :aria-expanded="revealTranslation" @click="revealTranslation = !revealTranslation">
        {{ revealTranslation ? 'Скрыть перевод' : 'Показать перевод' }}
      </button>
      <button class="subtle-button" type="button" :aria-expanded="revealBreakdown" @click="revealBreakdown = !revealBreakdown">
        {{ revealBreakdown ? 'Скрыть разбор' : 'Разобрать фразу' }}
      </button>
    </div>
    <p v-if="revealTranslation" class="phrase-translation">{{ item.translation }}</p>
    <div v-if="revealBreakdown" class="phrase-breakdown">
      <div v-for="(part, index) in item.breakdown" :key="index" class="breakdown-line">
        <strong lang="kk">{{ part.kk }}</strong><span>{{ part.ru }}</span>
      </div>
      <p v-if="item.related" class="inline-tip">{{ item.related }}</p>
    </div>
    <template #footer><span class="footnote">Фразы лучше запоминать целиком, а затем разбирать по частям.</span></template>
  </CardFrame>
</template>
