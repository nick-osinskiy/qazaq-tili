<script setup lang="ts">
import { computed, ref } from 'vue'
import type { ExercisePost } from '../types/content'
import { useLearningStore } from '../stores/learning'
import CardFrame from './CardFrame.vue'
import FavoriteButton from './FavoriteButton.vue'

const props = defineProps<{ item: ExercisePost }>()
const store = useLearningStore()
const selectedChoice = ref<number | null>(null)
const typedAnswer = ref('')
const orderedIndexes = ref<number[]>([])
const selectedLeft = ref<string | null>(null)
const matchedIds = ref<string[]>([])
const submitted = ref<boolean | null>(null)
const feedback = ref('')

const rightPairs = computed(() => props.item.format === 'matching' ? [...props.item.pairs].reverse() : [])
const availableTokens = computed(() => props.item.format === 'ordering'
  ? props.item.tokens.map((word, index) => ({ word, index })).filter(entry => !orderedIndexes.value.includes(entry.index))
  : [])
const answerText = computed(() => {
  const item = props.item
  switch (item.format) {
    case 'choice': return item.options[item.answerIndex]
    case 'fill': return item.acceptedAnswers[0]
    case 'ordering': return item.answer.map(index => item.tokens[index]).join(' ')
    case 'matching': return item.pairs.map(pair => pair.kk + ' — ' + pair.ru).join('; ')
  }
})
const normalize = (value: string) => value.normalize('NFC').trim().toLocaleLowerCase('kk-KZ').replace(/\s+/g, ' ')

function submit() {
  const item = props.item
  let correct: boolean
  switch (item.format) {
    case 'choice':
      if (selectedChoice.value === null) {
        feedback.value = 'Сначала выбери ответ.'
        return
      }
      correct = selectedChoice.value === item.answerIndex
      break
    case 'fill':
      if (!typedAnswer.value.trim()) {
        feedback.value = 'Введи пропущенное слово.'
        return
      }
      correct = item.acceptedAnswers.some(answer => normalize(answer) === normalize(typedAnswer.value))
      break
    case 'ordering':
      if (orderedIndexes.value.length !== item.tokens.length) {
        feedback.value = 'Сначала используй все слова.'
        return
      }
      correct = item.answer.every((index, position) => orderedIndexes.value[position] === index)
      break
    case 'matching':
      return
  }

  submitted.value = correct
  feedback.value = correct ? 'Верно! Отличная работа.' : 'Пока не совсем так. Посмотри правильный ответ и попробуй ещё раз.'
  store.recordExercise(item.id, correct)
}

function matchRight(id: string) {
  if (props.item.format !== 'matching' || matchedIds.value.includes(id)) return
  if (!selectedLeft.value) {
    feedback.value = 'Сначала выбери слово слева.'
    return
  }
  if (selectedLeft.value === id) {
    matchedIds.value = [...matchedIds.value, id]
    feedback.value = 'Пара найдена!'
    if (matchedIds.value.length === props.item.pairs.length) {
      submitted.value = true
      feedback.value = 'Все пары найдены! Отличная работа.'
      store.recordExercise(props.item.id, true)
    }
  } else {
    feedback.value = 'Не совпало. Попробуй другую пару.'
  }
  selectedLeft.value = null
}

function reset() {
  selectedChoice.value = null
  typedAnswer.value = ''
  orderedIndexes.value = []
  matchedIds.value = []
  selectedLeft.value = null
  submitted.value = null
  feedback.value = ''
}

function addToken(index: number) {
  if (!orderedIndexes.value.includes(index)) orderedIndexes.value.push(index)
}
function removeToken(index: number) {
  orderedIndexes.value = orderedIndexes.value.filter(value => value !== index)
}
</script>

<template>
  <CardFrame kind="exercise" label="Упражнение" :level="item.level">
    <template #actions><FavoriteButton :id="item.id" /></template>
    <p class="card-kicker">{{ item.tags.join(' · ') }}</p>
    <h2 class="post-title">{{ item.title }}</h2>
    <p class="post-lead">{{ item.prompt }}</p>

    <div v-if="store.isExerciseCorrect(item.id)" class="saved-progress">✓ Ранее выполнено</div>

    <div v-if="item.format === 'choice'" class="answer-list" role="group" aria-label="Выбери перевод">
      <button
        v-for="(option, index) in item.options"
        :key="index"
        type="button"
        class="answer-option"
        :class="{ 'answer-option--selected': selectedChoice === index }"
        :aria-pressed="selectedChoice === index"
        @click="selectedChoice = index; submitted = null; feedback = ''"
      >{{ option }}</button>
    </div>

    <div v-else-if="item.format === 'fill'" class="fill-exercise">
      <p class="inline-sentence" lang="kk">
        {{ item.sentenceBefore }}
        <span class="blank-indicator">______</span>{{ item.sentenceAfter }}
      </p>
      <label class="input-label" :for="'fill-' + item.id">Пропущенное слово</label>
      <input
        :id="'fill-' + item.id"
        v-model="typedAnswer"
        class="answer-input"
        type="text"
        lang="kk"
        autocomplete="off"
        spellcheck="false"
        placeholder="Напиши по-казахски"
        @input="submitted = null; feedback = ''"
        @keyup.enter="submit"
      />
      <small v-if="item.hint" class="footnote">Подсказка: {{ item.hint }}</small>
    </div>

    <div v-else-if="item.format === 'ordering'" class="ordering-exercise">
      <p class="input-label">Твоё предложение (нажми слово, чтобы убрать):</p>
      <div class="order-zone" aria-live="polite">
        <button
          v-for="index in orderedIndexes"
          :key="index"
          type="button"
          class="word-token word-token--selected"
          @click="removeToken(index); submitted = null; feedback = ''"
        >{{ item.tokens[index] }} <span aria-hidden="true">×</span></button>
        <span v-if="!orderedIndexes.length" class="footnote">Выбирай слова ниже по порядку</span>
      </div>
      <div class="token-pool" role="group" aria-label="Слова для составления предложения">
        <button
          v-for="entry in availableTokens"
          :key="entry.index"
          type="button"
          class="word-token"
          @click="addToken(entry.index); submitted = null; feedback = ''"
        >{{ entry.word }}</button>
      </div>
    </div>

    <div v-else-if="item.format === 'matching'" class="matching-exercise">
      <p class="input-label">Выбери казахское слово слева, затем перевод справа:</p>
      <div class="match-grid">
        <div class="match-column" role="group" aria-label="Казахские слова">
          <button
            v-for="pair in item.pairs"
            :key="pair.id"
            type="button"
            class="match-option"
            :class="{ 'match-option--selected': selectedLeft === pair.id, 'match-option--done': matchedIds.includes(pair.id) }"
            :disabled="matchedIds.includes(pair.id)"
            :aria-pressed="selectedLeft === pair.id"
            @click="selectedLeft = pair.id; feedback = ''"
          >{{ pair.kk }}</button>
        </div>
        <div class="match-column" role="group" aria-label="Русские переводы">
          <button
            v-for="pair in rightPairs"
            :key="pair.id"
            type="button"
            class="match-option"
            :class="{ 'match-option--done': matchedIds.includes(pair.id) }"
            :disabled="matchedIds.includes(pair.id)"
            @click="matchRight(pair.id)"
          >{{ pair.ru }}</button>
        </div>
      </div>
      <p class="footnote">Найдено пар: {{ matchedIds.length }} из {{ item.pairs.length }}</p>
    </div>

    <div class="exercise-controls">
      <button v-if="item.format !== 'matching'" class="action-button check-button" type="button" @click="submit">Проверить ответ</button>
      <button class="subtle-button" type="button" @click="reset">Начать заново</button>
    </div>
    <div class="exercise-feedback" aria-live="polite" :class="{ 'exercise-feedback--success': submitted === true }">
      <p v-if="feedback">{{ feedback }}</p>
      <p v-if="submitted === false">Правильный ответ: <strong>{{ answerText }}</strong></p>
      <p v-if="submitted === true" class="explanation-text">{{ item.explanation }}</p>
    </div>
  </CardFrame>
</template>
