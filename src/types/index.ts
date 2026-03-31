// Game types
export type LetterState = 'correct' | 'present' | 'absent' | 'empty' | 'tbd'

export interface TileData {
  letter: string
  state: LetterState
}

export interface GameState {
  guesses: string[]
  currentGuess: string
  gameStatus: 'playing' | 'won' | 'lost'
  targetWord: string
  evaluations: LetterState[][]
  keyboardStatus: Record<string, LetterState>
  currentRow: number
  isRevealing: boolean
  shakeRow: boolean
  gameMode: 'daily' | 'unlimited'
}

// User types
export interface UserStats {
  gamesPlayed: number
  gamesWon: number
  currentStreak: number
  maxStreak: number
  guessDistribution: number[]
  averageGuesses: number
  lastPlayedDate: string | null
  lastCompletedDaily: string | null
}

export interface User {
  _id: string
  email: string
  name?: string
  image?: string
  stats: UserStats
  createdAt: Date
  updatedAt: Date
}

// API response types
export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
}

// Toast notification types
export type ToastType = 'success' | 'error' | 'info' | 'warning'

export interface Toast {
  id: string
  message: string
  type: ToastType
  duration?: number
}
