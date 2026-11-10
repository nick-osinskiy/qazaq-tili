<script setup lang="ts">
import { computed, ref } from 'vue'
import type { GrammarPost } from '../types/content'
import CardFrame from './CardFrame.vue'
import FavoriteButton from './FavoriteButton.vue'
import SpeakButton from './SpeakButton.vue'

const props = defineProps<{ item: GrammarPost }>()
const expanded = ref(false)
const visibleExamples = computed(() => expanded.value ? props.item.examples : props.item.examples.slice(0, 2))
</script>

<template>
  <CardFrame kind="grammar" label="Грамматика" :level="item.level">
    <template #actions><FavoriteButton :id="item.id" /></template>
    <p class="card-kicker">{{ item.tags.join(' · ') }}</p>
    <h2 class="post-title">{{ item.title }}</h2>
    <p class="post-lead">{{ item.introduction }}</p>
    <div class="grammar-rule">
      <span class="overline">ФОРМУЛА</span>
      <strong>{{ item.formula }}</strong>
    </div>
    <p class="grammar-explanation">{{ item.explanation }}</p>
    <h3 class="small-heading">Примеры</h3>
    <div class="example-list">
      <div v-for="(example, index) in visibleExamples" :key="index" class="example-row">
        <div class="audio-inline"><strong lang="kk">{{ example.kk }}</strong><SpeakButton :text="example.kk" :audio-key="`grammar:${item.id}:example:${index}`" /></div>
        <span>{{ example.ru }}</span>
        <small v-if="example.note">{{ example.note }}</small>
      </div>
    </div>
    <button
      v-if="item.examples.length > 2"
      class="text-button"
      type="button"
      :aria-expanded="expanded"
      @click="expanded = !expanded"
    >{{ expanded ? 'Свернуть примеры' : 'Показать ещё примеры' }}</button>
    <aside v-if="item.important" class="grammar-note"><strong>Запомни:</strong> {{ item.important }}</aside>
    <template #footer>
      <RouterLink v-if="item.relatedExercise" class="action-button" :to="{ path: '/exercises', query: { focus: item.relatedExercise } }">Закрепить упражнением</RouterLink>
      <span v-else class="footnote">Обрати внимание на примеры — они помогут закрепить правило.</span>
    </template>
  </CardFrame>
</template>
