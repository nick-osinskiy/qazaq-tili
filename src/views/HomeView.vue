<script setup lang="ts">
import { computed } from 'vue'
import { useLearningStore } from '../stores/learning'
import { words, phrases, readings, exercises, grammar } from '../data/content'
import WordCard from '../components/WordCard.vue'
import PhraseCard from '../components/PhraseCard.vue'
import ReadingPost from '../components/ReadingPost.vue'
import GrammarPost from '../components/GrammarPost.vue'
import ExerciseCard from '../components/ExerciseCard.vue'
import '../home.css'

const store = useLearningStore()
const featuredWord = words.find(word => word.id === 'word-alma') || words[0]
const featuredPhrase = phrases[0]
const featuredReading = readings[0]
const featuredGrammar = grammar[0]
const featuredExercise = exercises[0]

const completedWords = computed(() => words.filter(word => store.isKnown(word.id)).length)
const completedReadings = computed(() => readings.filter(reading => store.isRead(reading.id)).length)
const completedExercises = computed(() => exercises.filter(exercise => store.isExerciseCorrect(exercise.id)).length)
const progressMaximum = words.length + readings.length + exercises.length
const demoCompleted = computed(() => completedWords.value + completedReadings.value + completedExercises.value)
const progressPercent = computed(() => progressMaximum ? Math.round(demoCompleted.value / progressMaximum * 100) : 0)

function goToPractice() {
  document.getElementById('home-practice')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
</script>

<template>
  <div class="home-view">
    <section class="home-hero" aria-labelledby="home-hero-title">
      <div class="home-hero__copy">
        <span class="hero-pill"><span class="hero-pill__dot"></span> Интерактивный самоучитель · A1</span>
        <h1 id="home-hero-title">Заговорить на казахском <em>проще, чем кажется.</em></h1>
        <p>Учи новые слова, разбирай фразы, читай тексты и закрепляй знания на практике. Начни прямо здесь — без регистрации.</p>
        <div class="home-hero__actions">
          <RouterLink class="home-button home-button--primary" to="/words">
            Начать обучение <span aria-hidden="true">↗</span>
          </RouterLink>
          <button type="button" class="home-button home-button--secondary" @click="goToPractice">
            Попробовать упражнение <span aria-hidden="true">↓</span>
          </button>
        </div>
        <div class="home-hero__trust">
          <span><span aria-hidden="true">✦</span> Реальные примеры</span>
          <span><span aria-hidden="true">◉</span> Практика с проверкой</span>
          <span><span aria-hidden="true">✓</span> Прогресс сохраняется</span>
        </div>
      </div>
      <div class="home-hero__showcase" aria-label="Пример слова на казахском">
        <div class="showcase-decoration showcase-decoration--one" aria-hidden="true">ә</div>
        <div class="showcase-decoration showcase-decoration--two" aria-hidden="true">ң</div>
        <div class="showcase-card">
          <div class="showcase-card__top">
            <span class="showcase-card__marker"><span aria-hidden="true">✺</span> СЛОВО ДНЯ</span>
            <span class="showcase-card__number">01 / 05</span>
          </div>
          <div class="showcase-card__image">
            <img v-if="featuredWord.image" :src="featuredWord.image" :alt="featuredWord.imageAlt || ''" width="260" height="184"/>
            <span v-else lang="kk" class="showcase-card__fallback">{{ featuredWord.word }}</span>
          </div>
          <p class="showcase-card__word" lang="kk">{{ featuredWord.word }}</p>
          <p class="showcase-card__translation">{{ featuredWord.translation }}</p>
          <div class="showcase-card__bottom">
            <span>Казахский без скучных правил</span>
            <span aria-hidden="true">↗</span>
          </div>
        </div>
      </div>
    </section>

    <div class="home-highlights" aria-label="Возможности самоучителя">
      <div><span class="highlight-icon">◈</span><span><strong>5 форматов</strong><small>учимся по-разному</small></span></div>
      <div><span class="highlight-icon">♫</span><span><strong>Озвучивание</strong><small>слушай и повторяй</small></span></div>
      <div><span class="highlight-icon">↗</span><span><strong>От A1 до C1</strong><small>расширяем программу</small></span></div>
    </div>

    <section class="home-section-heading" aria-labelledby="demo-heading">
      <div>
        <p class="home-kicker">ПОЗНАКОМЬСЯ С ВОЗМОЖНОСТЯМИ</p>
        <h2 id="demo-heading">Попробуй СӨЗ в действии</h2>
        <p>Настоящие учебные материалы. Нажимай, открывай переводы и проверяй свои знания.</p>
      </div>
      <span class="home-demo-badge">Живая демонстрация</span>
    </section>

    <div class="home-demo-grid">
      <section class="home-demo-module" aria-labelledby="demo-word-heading">
        <div class="home-demo-module__head">
          <div><span class="home-module-number">01</span><h3 id="demo-word-heading">Словарные карточки</h3></div>
          <RouterLink to="/words">Все слова <span aria-hidden="true">↗</span></RouterLink>
        </div>
        <WordCard :item="featuredWord" />
      </section>

      <section class="home-demo-module" aria-labelledby="demo-phrase-heading">
        <div class="home-demo-module__head">
          <div><span class="home-module-number">02</span><h3 id="demo-phrase-heading">Разговорные фразы</h3></div>
          <RouterLink to="/phrases">Все фразы <span aria-hidden="true">↗</span></RouterLink>
        </div>
        <PhraseCard :item="featuredPhrase" />
      </section>

      <section class="home-demo-module" aria-labelledby="demo-reading-heading">
        <div class="home-demo-module__head">
          <div><span class="home-module-number">03</span><h3 id="demo-reading-heading">Тексты и рассказы</h3></div>
          <RouterLink to="/readings">Все тексты <span aria-hidden="true">↗</span></RouterLink>
        </div>
        <ReadingPost :item="featuredReading" />
      </section>

      <section class="home-demo-module" aria-labelledby="demo-grammar-heading">
        <div class="home-demo-module__head">
          <div><span class="home-module-number">04</span><h3 id="demo-grammar-heading">Грамматика без перегруза</h3></div>
          <RouterLink to="/grammar">Все правила <span aria-hidden="true">↗</span></RouterLink>
        </div>
        <GrammarPost :item="featuredGrammar" />
      </section>
    </div>

    <section id="home-practice" class="home-practice" aria-labelledby="home-practice-heading">
      <div class="home-practice__heading">
        <div>
          <p class="home-kicker">ПРОВЕРЬ СЕБЯ</p>
          <h2 id="home-practice-heading">От теории — к практике</h2>
          <p>Один короткий вопрос, и ты уже делаешь первый шаг к свободной речи.</p>
        </div>
        <RouterLink to="/exercises" class="home-practice__link">Все упражнения <span aria-hidden="true">↗</span></RouterLink>
      </div>
      <div class="home-practice__grid">
        <div class="home-practice__quiz">
          <ExerciseCard :item="featuredExercise" />
        </div>
        <aside class="home-progress-panel" aria-labelledby="home-progress-heading">
          <div class="home-progress-panel__eyebrow">ТВОЙ ПРОГРЕСС</div>
          <div class="home-progress-panel__header">
            <h3 id="home-progress-heading">Каждый шаг считается</h3>
            <span class="home-progress-panel__percent">{{ progressPercent }}%</span>
          </div>
          <div class="home-progress-track" role="progressbar" :aria-valuenow="demoCompleted" :aria-valuemax="progressMaximum" aria-valuemin="0" aria-label="Прогресс по доступным заданиям">
            <div class="home-progress-track__fill" :style="{ width: progressPercent + '%' }"></div>
          </div>
          <p class="home-progress-panel__caption">Освоено {{ demoCompleted }} из {{ progressMaximum }} доступных материалов, учитываемых в прогрессе.</p>
          <div class="home-progress-stats">
            <div><span class="home-progress-stats__symbol">◈</span><span>Выучено слов</span><strong>{{ completedWords }} / {{ words.length }}</strong></div>
            <div><span class="home-progress-stats__symbol">▤</span><span>Прочитано текстов</span><strong>{{ completedReadings }} / {{ readings.length }}</strong></div>
            <div><span class="home-progress-stats__symbol">✓</span><span>Решено упражнений</span><strong>{{ completedExercises }} / {{ exercises.length }}</strong></div>
            <div><span class="home-progress-stats__symbol">♡</span><span>В избранном</span><strong>{{ store.favorites.length }}</strong></div>
          </div>
          <p class="home-progress-panel__foot">Прогресс сохраняется в браузере на этом устройстве. Синхронизация между устройствами появится позднее.</p>
        </aside>
      </div>
    </section>

    <section class="home-last-cta" aria-label="Продолжить обучение">
      <div>
        <span class="home-kicker">ТВОЙ ПУТЬ НАЧИНАЕТСЯ ЗДЕСЬ</span>
        <h2 lang="kk">Бірге үйренейік!</h2>
        <p>Давай учиться вместе. Начни со слов, а дальше двигайся к фразам и целым историям.</p>
      </div>
      <RouterLink class="home-button home-button--primary" to="/words">Открыть словарь <span aria-hidden="true">↗</span></RouterLink>
    </section>
  </div>
</template>
