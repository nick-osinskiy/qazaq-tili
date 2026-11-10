export type Level = 'A1' | 'A2' | 'B1' | 'B2' | 'C1'
export type ContentSection = 'all' | 'words' | 'phrases' | 'readings' | 'exercises' | 'grammar'

export interface BasePost {
  id: string
  level: Level
  tags: string[]
}

export interface BilingualExample {
  kk: string
  ru: string
}

export interface WordPost extends BasePost {
  kind: 'word'
  word: string
  translation: string
  transcription?: string
  partOfSpeech: string
  examples: BilingualExample[]
}

export interface PhrasePost extends BasePost {
  kind: 'phrase'
  phrase: string
  translation: string
  situation: string
  breakdown: { kk: string; ru: string }[]
  related?: string
}

export interface ReadingPost extends BasePost {
  kind: 'reading'
  title: string
  summary: string
  readingMinutes: number
  paragraphs: BilingualExample[]
  vocabulary: { kk: string; ru: string }[]
}

interface ExerciseBase extends BasePost {
  kind: 'exercise'
  title: string
  prompt: string
  explanation: string
}

export interface ChoiceExercise extends ExerciseBase {
  format: 'choice'
  options: string[]
  answerIndex: number
}

export interface FillExercise extends ExerciseBase {
  format: 'fill'
  sentenceBefore: string
  sentenceAfter: string
  acceptedAnswers: string[]
  hint?: string
}

export interface OrderingExercise extends ExerciseBase {
  format: 'ordering'
  tokens: string[]
  answer: number[]
}

export interface MatchingExercise extends ExerciseBase {
  format: 'matching'
  pairs: { id: string; kk: string; ru: string }[]
}

export type ExercisePost = ChoiceExercise | FillExercise | OrderingExercise | MatchingExercise

export interface GrammarPost extends BasePost {
  kind: 'grammar'
  title: string
  introduction: string
  formula: string
  explanation: string
  examples: { kk: string; ru: string; note?: string }[]
  important?: string
  relatedExercise?: string
}

export type LearningPost = WordPost | PhrasePost | ReadingPost | ExercisePost | GrammarPost
