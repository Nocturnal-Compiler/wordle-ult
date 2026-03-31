'use client'

import { useCallback, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useGame } from '@/context/GameContext'
import { LetterState } from '@/types'
import { cn } from '@/lib/utils'

const KEYBOARD_ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACKSPACE'],
]

const stateColors: Record<LetterState | 'unused', string> = {
  correct: 'bg-wordle-green hover:bg-wordle-green/90',
  present: 'bg-wordle-yellow hover:bg-wordle-yellow/90',
  absent: 'bg-wordle-gray hover:bg-wordle-gray/90',
  empty: 'bg-gray-600 hover:bg-gray-500',
  tbd: 'bg-gray-600 hover:bg-gray-500',
  unused: 'bg-gray-600 hover:bg-gray-500',
}

export default function Keyboard() {
  const { state, addLetter, deleteLetter, submitGuess } = useGame()
  const { keyboardStatus, gameStatus, isRevealing } = state
  
  const handleKeyPress = useCallback((key: string) => {
    if (gameStatus !== 'playing' || isRevealing) return
    
    if (key === 'ENTER') {
      submitGuess()
    } else if (key === 'BACKSPACE') {
      deleteLetter()
    } else {
      addLetter(key)
    }
  }, [addLetter, deleteLetter, submitGuess, gameStatus, isRevealing])
  
  // Handle physical keyboard
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return
      
      const key = e.key.toUpperCase()
      
      if (key === 'ENTER') {
        handleKeyPress('ENTER')
      } else if (key === 'BACKSPACE') {
        handleKeyPress('BACKSPACE')
      } else if (/^[A-Z]$/.test(key)) {
        handleKeyPress(key)
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyPress])
  
  return (
    <div className="flex flex-col gap-2 p-2 w-full max-w-lg mx-auto">
      {KEYBOARD_ROWS.map((row, rowIndex) => (
        <div key={rowIndex} className="flex justify-center gap-1.5">
          {row.map((key) => {
            const state = keyboardStatus[key.toLowerCase()] || 'unused'
            const isWide = key === 'ENTER' || key === 'BACKSPACE'
            
            return (
              <motion.button
                key={key}
                onClick={() => handleKeyPress(key)}
                className={cn(
                  'h-14 rounded-md font-bold text-white text-sm transition-all duration-200',
                  'active:scale-95 shadow-lg',
                  stateColors[state],
                  isWide ? 'px-3 min-w-[65px]' : 'w-9 sm:w-11'
                )}
                whileTap={{ scale: 0.9 }}
                disabled={gameStatus !== 'playing' || isRevealing}
              >
                {key === 'BACKSPACE' ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414 6.414a2 2 0 001.414.586H19a2 2 0 002-2V7a2 2 0 00-2-2h-8.172a2 2 0 00-1.414.586L3 12z" />
                  </svg>
                ) : key === 'ENTER' ? (
                  'ENTER'
                ) : (
                  key
                )}
              </motion.button>
            )
          })}
        </div>
      ))}
    </div>
  )
}
