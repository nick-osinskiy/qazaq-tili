<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue'
import { useAudioStore } from '../stores/audio'
import { findAudioPath } from '../audio'

const props = defineProps<{ text: string; audioKey?: string }>()
const settings = useAudioStore()
const isPlaying = ref(false)
let player: HTMLAudioElement | null = null
let utterance: SpeechSynthesisUtterance | null = null

const fileUrl = computed(() => findAudioPath(props.audioKey, props.text, settings.voice))
const browserSupported = computed(() => typeof window !== 'undefined' &&
  typeof window.speechSynthesis !== 'undefined' &&
  typeof SpeechSynthesisUtterance !== 'undefined')
const available = computed(() => Boolean(fileUrl.value) || browserSupported.value)

function stop() {
  if (player) {
    player.onended = null
    player.onerror = null
    player.pause()
    player = null
  }
  if (utterance && browserSupported.value) window.speechSynthesis.cancel()
  utterance = null
  isPlaying.value = false
}

function fallback() {
  if (!browserSupported.value) {
    isPlaying.value = false
    return
  }
  const speech = new SpeechSynthesisUtterance(props.text)
  speech.lang = 'kk-KZ'
  speech.rate = settings.rate
  speech.onend = () => { isPlaying.value = false; utterance = null }
  speech.onerror = () => { isPlaying.value = false; utterance = null }
  utterance = speech
  isPlaying.value = true
  window.speechSynthesis.cancel()
  window.speechSynthesis.speak(speech)
}

async function speak() {
  if (isPlaying.value) {
    stop()
    return
  }
  stop()
  if (!fileUrl.value) {
    fallback()
    return
  }

  const audio = new Audio(fileUrl.value)
  player = audio
  audio.playbackRate = settings.rate
  audio.onended = () => { if (player === audio) { player = null; isPlaying.value = false } }
  audio.onerror = () => { if (player === audio) { player = null; fallback() } }
  isPlaying.value = true
  try {
    await audio.play()
  } catch {
    if (player === audio) {
      player = null
      fallback()
    }
  }
}

onBeforeUnmount(stop)
</script>

<template>
  <button
    type="button"
    class="icon-button speak-button"
    :disabled="!available"
    :aria-label="!available ? 'Озвучивание недоступно' : isPlaying ? 'Остановить озвучивание' : 'Прослушать на казахском'"
    :title="fileUrl ? 'MP3 · ' + (settings.voice === 'aigul' ? 'Айгүл' : 'Дәулет') : browserSupported ? 'Озвучить голосом устройства' : 'Аудио пока не загружено'"
    :aria-pressed="isPlaying"
    @click="speak"
  ><span aria-hidden="true">{{ isPlaying ? '■' : '♫' }}</span></button>
</template>
