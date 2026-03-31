'use client'

import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react'
import { GameState, LetterState, UserStats } from '@/types'
import { getDailyWord, getRandomWord, isValidWord, getTodayString } from '@/lib/words'
import { useSession } from 'next-auth/react'

const WORD_LENGTH = 5
const MAX_GUESSES = 6

// Initial state
const createInitialState = (mode: 'daily' | 'unlimited' = 'daily'): GameState => ({
  guesses: [],
  currentGuess: '',
  gameStatus: 'playing',
  targetWord: mode === 'daily' ? getDailyWord() : getRandomWord(),
  evaluations: [],
  keyboardStatus: {},
  currentRow: 0,
  isRevealing: false,
  shakeRow: false,
  gameMode: mode,
})

type GameAction =
  | { type: 'ADD_LETTER'; letter: string }
  | { type: 'DELETE_LETTER' }
  | { type: 'SUBMIT_GUESS' }
  | { type: 'SET_REVEALING'; isRevealing: boolean }
  | { type: 'SET_SHAKE'; shake: boolean }
  | { type: 'SWITCH_MODE'; mode: 'daily' | 'unlimited' }
  | { type: 'NEW_GAME' }
  | { type: 'LOAD_STATE'; state: Partial<GameState> }

// Evaluate guess against target word
function evaluateGuess(guess: string, target: string): LetterState[] {
  const result: LetterState[] = Array(WORD_LENGTH).fill('absent')
  const targetChars = target.split('')
  const guessChars = guess.split('')
  
  // First pass: mark correct letters
  for (let i = 0; i < WORD_LENGTH; i++) {
    if (guessChars[i] === targetChars[i]) {
      result[i] = 'correct'
      targetChars[i] = ''
      guessChars[i] = ''
    }
  }
  
  // Second pass: mark present letters
  for (let i = 0; i < WORD_LENGTH; i++) {
    if (guessChars[i] && targetChars.includes(guessChars[i])) {
      result[i] = 'present'
      targetChars[targetChars.indexOf(guessChars[i])] = ''
    }
  }
  
  return result
}

// Update keyboard status
function updateKeyboardStatus(
  current: Record<string, LetterState>,
  guess: string,
  evaluation: LetterState[]
): Record<string, LetterState> {
  const updated = { ...current }
  
  for (let i = 0; i < guess.length; i++) {
    const letter = guess[i]
    const state = evaluation[i]
    
    // Only upgrade: absent -> present -> correct
    if (updated[letter] === 'correct') continue
    if (updated[letter] === 'present' && state === 'absent') continue
    
    updated[letter] = state
  }
  
  return updated
}

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'ADD_LETTER':
      if (state.gameStatus !== 'playing') return state
      if (state.currentGuess.length >= WORD_LENGTH) return state
      if (state.isRevealing) return state
      return {
        ...state,
        currentGuess: state.currentGuess + action.letter.toLowerCase(),
      }
      
    case 'DELETE_LETTER':
      if (state.gameStatus !== 'playing') return state
      if (state.isRevealing) return state
      return {
        ...state,
        currentGuess: state.currentGuess.slice(0, -1),
      }
      
    case 'SUBMIT_GUESS': {
      if (state.gameStatus !== 'playing') return state
      if (state.currentGuess.length !== WORD_LENGTH) return state
      if (state.isRevealing) return state
      if (!isValidWord(state.currentGuess)) {
        return { ...state, shakeRow: true }
      }
      
      const evaluation = evaluateGuess(state.currentGuess, state.targetWord)
      const newGuesses = [...state.guesses, state.currentGuess]
      const newEvaluations = [...state.evaluations, evaluation]
      const newKeyboardStatus = updateKeyboardStatus(state.keyboardStatus, state.currentGuess, evaluation)
      
      const won = state.currentGuess === state.targetWord
      const lost = !won && newGuesses.length >= MAX_GUESSES
      
      return {
        ...state,
        guesses: newGuesses,
        currentGuess: '',
        evaluations: newEvaluations,
        keyboardStatus: newKeyboardStatus,
        currentRow: state.currentRow + 1,
        gameStatus: won ? 'won' : lost ? 'lost' : 'playing',
        isRevealing: true,
      }
    }
    
    case 'SET_REVEALING':
      return { ...state, isRevealing: action.isRevealing }
      
    case 'SET_SHAKE':
      return { ...state, shakeRow: action.shake }
      
    case 'SWITCH_MODE':
      return createInitialState(action.mode)
      
    case 'NEW_GAME':
      return createInitialState(state.gameMode)
      
    case 'LOAD_STATE':
      return { ...state, ...action.state }
      
    default:
      return state
  }
}

interface GameContextType {
  state: GameState
  addLetter: (letter: string) => void
  deleteLetter: () => void
  submitGuess: () => void
  setRevealing: (isRevealing: boolean) => void
  setShake: (shake: boolean) => void
  switchMode: (mode: 'daily' | 'unlimited') => void
  newGame: () => void
  updateStats: (won: boolean, guesses: number) => Promise<void>
}

const GameContext = createContext<GameContextType | null>(null)

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, createInitialState())
  const { data: session } = useSession()
  
  // Load saved daily game state from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined' && state.gameMode === 'daily') {
      const savedState = localStorage.getItem('wordle-daily-state')
      const savedDate = localStorage.getItem('wordle-daily-date')
      const today = getTodayString()
      
      if (savedState && savedDate === today) {
        try {
          const parsed = JSON.parse(savedState)
          dispatch({ type: 'LOAD_STATE', state: parsed })
        } catch (e) {
          console.error('Failed to load saved state:', e)
        }
      } else {
        // New day, reset state
        localStorage.removeItem('wordle-daily-state')
        localStorage.setItem('wordle-daily-date', today)
      }
    }
  }, [state.gameMode])
  
  // Save daily game state to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined' && state.gameMode === 'daily') {
      const stateToSave = {
        guesses: state.guesses,
        evaluations: state.evaluations,
        keyboardStatus: state.keyboardStatus,
        currentRow: state.currentRow,
        gameStatus: state.gameStatus,
        targetWord: state.targetWord,
      }
      localStorage.setItem('wordle-daily-state', JSON.stringify(stateToSave))
    }
  }, [state.guesses, state.gameStatus, state.gameMode])
  
  const addLetter = useCallback((letter: string) => {
    dispatch({ type: 'ADD_LETTER', letter })
  }, [])
  
  const deleteLetter = useCallback(() => {
    dispatch({ type: 'DELETE_LETTER' })
  }, [])
  
  const submitGuess = useCallback(() => {
    dispatch({ type: 'SUBMIT_GUESS' })
  }, [])
  
  const setRevealing = useCallback((isRevealing: boolean) => {
    dispatch({ type: 'SET_REVEALING', isRevealing })
  }, [])
  
  const setShake = useCallback((shake: boolean) => {
    dispatch({ type: 'SET_SHAKE', shake })
  }, [])
  
  const switchMode = useCallback((mode: 'daily' | 'unlimited') => {
    dispatch({ type: 'SWITCH_MODE', mode })
  }, [])
  
  const newGame = useCallback(() => {
    dispatch({ type: 'NEW_GAME' })
  }, [])
  
  const updateStats = useCallback(async (won: boolean, guesses: number) => {
    if (!session?.user?.email) return
    
    try {
      const response = await fetch('/api/stats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          won,
          guesses,
          gameMode: state.gameMode,
        }),
      })
      
      if (!response.ok) {
        console.error('Failed to update stats')
      }
    } catch (error) {
      console.error('Error updating stats:', error)
    }
  }, [session, state.gameMode])
  
  return (
    <GameContext.Provider
      value={{
        state,
        addLetter,
        deleteLetter,
        submitGuess,
        setRevealing,
        setShake,
        switchMode,
        newGame,
        updateStats,
      }}
    >
      {children}
    </GameContext.Provider>
  )
}

export function useGame() {
  const context = useContext(GameContext)
  if (!context) {
    throw new Error('useGame must be used within a GameProvider')
  }
  return context
}
