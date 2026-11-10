<script setup lang="ts">
import { useAudioStore, type KazakhVoice, type PlaybackRate } from '../stores/audio'
const settings = useAudioStore()

function updateVoice(event: Event) {
  settings.setVoice((event.target as HTMLSelectElement).value as KazakhVoice)
}

function updateRate(event: Event) {
  settings.setRate(Number((event.target as HTMLSelectElement).value) as PlaybackRate)
}
</script>

<template>
  <div class="audio-settings" aria-label="Настройки казахского произношения">
    <label for="audio-voice" class="audio-settings__label">Голос</label>
    <select id="audio-voice" :value="settings.voice" @change="updateVoice">
      <option value="aigul">Айгүл ♀</option>
      <option value="daulet">Дәулет ♂</option>
    </select>
    <label for="audio-rate" class="audio-settings__label">Скорость</label>
    <select id="audio-rate" :value="settings.rate" @change="updateRate">
      <option :value="1">1×</option>
      <option :value="0.75">0,75×</option>
    </select>
  </div>
</template>
