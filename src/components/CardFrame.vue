<script setup lang="ts">
defineProps<{
  kind: 'word' | 'phrase' | 'reading' | 'exercise' | 'grammar'
  label: string
  level: string
}>()
</script>

<template>
  <article class="learning-card" :data-kind="kind">
    <header class="card-toolbar">
      <div class="card-tags">
        <span class="type-pill">{{ label }}</span>
        <span class="level-pill">{{ level }}</span>
      </div>
      <div class="card-actions"><slot name="actions" /></div>
    </header>
    <div class="card-content"><slot /></div>
    <footer v-if="$slots.footer" class="card-footer"><slot name="footer" /></footer>
  </article>
</template>
