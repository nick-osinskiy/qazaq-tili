<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{ text: string }>()
const available = computed(() => typeof window !== 'undefined' &&
  typeof window.speechSynthesis !== 'undefined' &&
  typeof SpeechSynthesisUtterance !== 'undefined')

function speak() {
  if (!available.value) return
  const speech = new SpeechSynthesisUtterance(props.text)
  speech.lang = 'kk-KZ'
  speech.rate = 0.85
  window.speechSynthesis.cancel()
  window.speechSynthesis.speak(speech)
}
</script>

<template>
  <button
    type="button"
    class="icon-button"
    :disabled="!available"
    :aria-label="available ? 'Произнести по-казахски' : 'Озвучивание недоступно в браузере'"
    :title="available ? 'Произнести' : 'Нет поддержки озвучивания'"
    @click="speak"
  ><span aria-hidden="true">♫</span></button>
</template>
