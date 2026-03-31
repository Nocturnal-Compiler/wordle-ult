'use client'

import { motion } from 'framer-motion'
import { useGame } from '@/context/GameContext'
import Tile from './Tile'
import { LetterState } from '@/types'
import { useEffect } from 'react'

const WORD_LENGTH = 5
const MAX_GUESSES = 6

export default function Board() {
  const { state, setRevealing, setShake, updateStats } = useGame()
  const { guesses, currentGuess, evaluations, currentRow, isRevealing, shakeRow, gameStatus } = state
  
  // Handle reveal animation completion
  useEffect(() => {
    if (isRevealing) {
      const timer = setTimeout(() => {
        setRevealing(false)
        
        // Update stats after reveal
        if (gameStatus === 'won' || gameStatus === 'lost') {
          updateStats(gameStatus === 'won', guesses.length)
        }
      }, WORD_LENGTH * 300 + 500)
      
      return () => clearTimeout(timer)
    }
  }, [isRevealing, setRevealing, gameStatus, guesses.length, updateStats])
  
  // Handle shake animation
  useEffect(() => {
    if (shakeRow) {
      const timer = setTimeout(() => {
        setShake(false)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [shakeRow, setShake])
  
  // Create the grid rows
  const rows = []
  
  for (let i = 0; i < MAX_GUESSES; i++) {
    const isCurrentRowIndex = i === currentRow
    const guess = guesses[i] || (isCurrentRowIndex ? currentGuess : '')
    const evaluation = evaluations[i] || []
    const isRevealingRow = isRevealing && i === currentRow - 1
    const isWinningRow = gameStatus === 'won' && i === guesses.length - 1
    
    const tiles = []
    
    for (let j = 0; j < WORD_LENGTH; j++) {
      const letter = guess[j] || ''
      let tileState: LetterState = 'empty'
      
      if (evaluation[j]) {
        tileState = evaluation[j]
      } else if (letter) {
        tileState = 'tbd'
      }
      
      tiles.push(
        <Tile
          key={j}
          letter={letter}
          state={tileState}
          position={j}
          isRevealing={isRevealingRow}
          isCurrentRow={isCurrentRowIndex}
          shouldBounce={isWinningRow && !isRevealing}
        />
      )
    }
    
    rows.push(
      <motion.div
        key={i}
        className="flex gap-1.5"
        animate={shakeRow && isCurrentRowIndex ? { x: [-5, 5, -5, 5, 0] } : {}}
        transition={{ duration: 0.5 }}
      >
        {tiles}
      </motion.div>
    )
  }
  
  return (
    <div className="flex flex-col gap-1.5 p-4">
      {rows}
    </div>
  )
}
