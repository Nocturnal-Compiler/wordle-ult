'use client'

import { motion } from 'framer-motion'
import { LetterState } from '@/types'
import { cn } from '@/lib/utils'

interface TileProps {
  letter: string
  state: LetterState
  position: number
  isRevealing: boolean
  isCurrentRow: boolean
  shouldBounce: boolean
}

const stateColors: Record<LetterState, string> = {
  correct: 'bg-wordle-green border-wordle-green',
  present: 'bg-wordle-yellow border-wordle-yellow',
  absent: 'bg-wordle-gray border-wordle-gray',
  empty: 'bg-transparent border-wordle-border',
  tbd: 'bg-transparent border-gray-500',
}

export default function Tile({
  letter,
  state,
  position,
  isRevealing,
  isCurrentRow,
  shouldBounce,
}: TileProps) {
  const hasLetter = letter !== ''
  const revealDelay = position * 0.3
  
  return (
    <motion.div
      className={cn(
        'w-14 h-14 sm:w-16 sm:h-16 border-2 flex items-center justify-center text-2xl sm:text-3xl font-bold uppercase',
        'transition-colors duration-200',
        stateColors[state],
        hasLetter && state === 'tbd' && 'border-gray-400'
      )}
      initial={false}
      animate={
        isRevealing && state !== 'tbd' && state !== 'empty'
          ? {
              rotateX: [0, -90, 0],
              transition: {
                duration: 0.6,
                delay: revealDelay,
                times: [0, 0.5, 1],
              },
            }
          : shouldBounce
          ? {
              y: [0, -30, 0],
              transition: {
                duration: 0.5,
                delay: position * 0.1,
                ease: 'easeOut',
              },
            }
          : hasLetter && isCurrentRow
          ? {
              scale: [1, 1.1, 1],
              transition: { duration: 0.1 },
            }
          : {}
      }
      style={{
        perspective: '1000px',
        transformStyle: 'preserve-3d',
      }}
    >
      <motion.span
        className="text-white drop-shadow-lg"
        initial={false}
        animate={
          isRevealing && state !== 'tbd' && state !== 'empty'
            ? {
                opacity: [1, 0, 1],
                transition: {
                  duration: 0.6,
                  delay: revealDelay,
                  times: [0, 0.5, 1],
                },
              }
            : {}
        }
      >
        {letter}
      </motion.span>
    </motion.div>
  )
}
