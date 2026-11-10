import type {
  WordPost, PhrasePost, ReadingPost, ExercisePost, GrammarPost
} from '../types/content'
import appleImage from '../assets/illustrations/apple.svg'
import bookImage from '../assets/illustrations/book.svg'
import helloImage from '../assets/illustrations/hello.svg'
import thanksImage from '../assets/illustrations/thanks.svg'
import catImage from '../assets/illustrations/cat.svg'

export const words: WordPost[] = [
  {
    id: 'word-salem', kind: 'word', level: 'A1', tags: ['Приветствие'],
    word: 'Сәлем', translation: 'Привет', transcription: 'сә-лем',
    partOfSpeech: 'Междометие', image: helloImage, imageAlt: 'Два человека приветствуют друг друга',
    examples: [{ kk: 'Сәлем, Айдана!', ru: 'Привет, Айдана!' }]
  },
  {
    id: 'word-rahmet', kind: 'word', level: 'A1', tags: ['Вежливость'],
    word: 'Рақмет', translation: 'Спасибо', transcription: 'рақ-мет',
    partOfSpeech: 'Междометие', image: thanksImage, imageAlt: 'Букет цветов — знак благодарности',
    examples: [{ kk: 'Көмегіңізге рақмет!', ru: 'Спасибо за вашу помощь!' }]
  },
  {
    id: 'word-kitap', kind: 'word', level: 'A1', tags: ['Предметы'],
    word: 'Кітап', translation: 'Книга', transcription: 'кі-тап',
    partOfSpeech: 'Существительное', image: bookImage, imageAlt: 'Открытая книга на столе',
    examples: [{ kk: 'Бұл қызық кітап.', ru: 'Это интересная книга.' }]
  },
  {
    id: 'word-alma', kind: 'word', level: 'A1', tags: ['Еда', 'Фрукты'],
    word: 'Алма', translation: 'Яблоко', transcription: 'ал-ма',
    partOfSpeech: 'Существительное', image: appleImage, imageAlt: 'Красное яблоко с зелёным листом',
    examples: [{ kk: 'Бұл қызыл алма.', ru: 'Это красное яблоко.' }]
  },
  {
    id: 'word-mysyk', kind: 'word', level: 'A1', tags: ['Животные'],
    word: 'Мысық', translation: 'Кошка', transcription: 'мы-сық',
    partOfSpeech: 'Существительное', image: catImage, imageAlt: 'Рыжая кошка',
    examples: [{ kk: 'Менің мысығым бар.', ru: 'У меня есть кошка.' }]
  }
]

export const phrases: PhrasePost[] = [
  {
    id: 'phrase-how-are-you', kind: 'phrase', level: 'A1', tags: ['Общение'],
    phrase: 'Қалыңыз қалай?', translation: 'Как у вас дела?',
    situation: 'Вежливое обращение к одному человеку',
    breakdown: [
      { kk: 'Қалыңыз', ru: 'Ваше состояние / ваши дела' },
      { kk: 'қалай?', ru: 'как?' }
    ],
    related: 'Неформально: «Қалың қалай?»'
  },
  {
    id: 'phrase-learning', kind: 'phrase', level: 'A1', tags: ['Знакомство'],
    phrase: 'Мен қазақ тілін үйреніп жүрмін.',
    translation: 'Я изучаю казахский язык.',
    situation: 'Расскажите собеседнику о себе',
    breakdown: [
      { kk: 'Мен', ru: 'я' },
      { kk: 'қазақ тілін', ru: 'казахский язык (дополнение)' },
      { kk: 'үйреніп жүрмін', ru: 'изучаю (процесс продолжается)' }
    ]
  }
]

export const readings: ReadingPost[] = [
  {
    id: 'reading-my-day', kind: 'reading', level: 'A1',
    tags: ['Повседневная жизнь', 'Рассказ'],
    title: 'Менің күнім', summary: 'Небольшой рассказ о распорядке дня',
    readingMinutes: 2,
    paragraphs: [
      { kk: 'Менің атым Айдана. Мен Алматыда тұрамын.', ru: 'Меня зовут Айдана. Я живу в Алматы.' },
      { kk: 'Таңертең сағат жетіде тұрамын. Таңғы ас ішемін.', ru: 'Утром я встаю в семь часов. Завтракаю.' },
      { kk: 'Кешке кітап оқимын немесе музыка тыңдаймын.', ru: 'Вечером я читаю книгу или слушаю музыку.' }
    ],
    vocabulary: [
      { kk: 'таңертең', ru: 'утром' },
      { kk: 'кешке', ru: 'вечером' },
      { kk: 'тұрамын', ru: 'живу / встаю (по контексту)' }
    ]
  }
]

export const exercises: ExercisePost[] = [
  {
    id: 'exercise-choice-salem', kind: 'exercise', format: 'choice', level: 'A1',
    tags: ['Перевод'], title: 'Выбери перевод',
    prompt: 'Что означает слово «Сәлем»?',
    options: ['До свидания', 'Привет', 'Пожалуйста', 'Доброе утро'],
    answerIndex: 1,
    explanation: '«Сәлем» — неформальное приветствие.'
  },
  {
    id: 'exercise-fill-city', kind: 'exercise', format: 'fill', level: 'A1',
    tags: ['Предложения'], title: 'Заполни пропуск',
    prompt: 'Как сказать: «Я живу в Алматы»?',
    sentenceBefore: 'Мен Алматыда',
    sentenceAfter: '.', acceptedAnswers: ['тұрамын'],
    hint: 'Глагол «жить / вставать» в 1-м лице',
    explanation: '«Тұрамын» — форма первого лица: я живу или встаю в зависимости от контекста.'
  },
  {
    id: 'exercise-order-learning', kind: 'exercise', format: 'ordering', level: 'A1',
    tags: ['Порядок слов'], title: 'Составь фразу',
    prompt: 'Собери: «Я изучаю казахский язык».',
    tokens: ['жүрмін.', 'Мен', 'үйреніп', 'қазақ тілін'],
    answer: [1, 3, 2, 0],
    explanation: 'В казахском языке сказуемое часто стоит в конце предложения.'
  },
  {
    id: 'exercise-match-words', kind: 'exercise', format: 'matching', level: 'A1',
    tags: ['Словарь'], title: 'Найди пары',
    prompt: 'Соедини казахские слова с переводами.',
    pairs: [
      { id: 'm1', kk: 'Рақмет', ru: 'Спасибо' },
      { id: 'm2', kk: 'Кітап', ru: 'Книга' },
      { id: 'm3', kk: 'Сәлем', ru: 'Привет' }
    ],
    explanation: 'Ты закрепил три базовых слова.'
  }
]

export const grammar: GrammarPost[] = [
  {
    id: 'grammar-question-particles', kind: 'grammar', level: 'A1',
    tags: ['Вопросы', 'Частицы'], title: 'Вопросительные частицы',
    introduction: 'Как превратить утверждение в вопрос «да или нет»?',
    formula: 'Слово + ма/ме/ба/бе/па/пе + ?',
    explanation: 'Вопросительная частица пишется отдельно. Её форма зависит от звучания предыдущего слова.',
    examples: [
      { kk: 'Бұл кітап па?', ru: 'Это книга?', note: 'После глухого «п» — па' },
      { kk: 'Сен дайынсың ба?', ru: 'Ты готов?', note: 'После звонкого/сонорного звучания — ба' },
      { kk: 'Ол келе ме?', ru: 'Он придёт?', note: 'Здесь используется ме' }
    ],
    important: 'Не присоединяй ма/ме/ба/бе/па/пе к предыдущему слову: это отдельная частица.'
  },
  {
    id: 'grammar-plural', kind: 'grammar', level: 'A1',
    tags: ['Существительные'], title: 'Множественное число',
    introduction: 'В казахском языке есть шесть вариантов суффикса множественного числа.',
    formula: '-лар / -лер / -дар / -дер / -тар / -тер',
    explanation: 'Выбор суффикса зависит от последнего звука слова и гармонии гласных.',
    examples: [
      { kk: 'кітаптар', ru: 'книги', note: 'После п — тар' },
      { kk: 'үйлер', ru: 'дома', note: 'Переднерядный гласный — лер' },
      { kk: 'адамдар', ru: 'люди', note: 'После м — дар' }
    ],
    important: 'После числительных существительное обычно остаётся в единственном числе: үш кітап — три книги.'
  }
]

export const contentCount = words.length + phrases.length + readings.length + exercises.length + grammar.length
