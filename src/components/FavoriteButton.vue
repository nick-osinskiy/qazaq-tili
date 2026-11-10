<script setup lang="ts">
import { useLearningStore } from '../stores/learning'

defineProps<{ id: string }>()
const store = useLearningStore()
</script>

<template>
  <button
    type="button"
    class="icon-button favorite-button"
    :class="{ 'is-favorite': store.isFavorite(id) }"
    :aria-pressed="store.isFavorite(id)"
    :aria-label="store.isFavorite(id) ? 'Убрать из избранного' : 'Добавить в избранное'"
    @click="store.toggleFavorite(id)"
  >
    <span aria-hidden="true">{{ store.isFavorite(id) ? '♥' : '♡' }}</span>
  </button>
</template>
