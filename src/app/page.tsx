'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import Header from '@/components/Header'
import Board from '@/components/Board'
import Keyboard from '@/components/Keyboard'
import { useGame } from '@/context/GameContext'
import { motion, AnimatePresence } from 'framer-motion'

// Dynamically import background components to avoid SSR issues
const ParticleField = dynamic(() => import('@/components/Background/ParticleField'), { ssr: false })
const AsciiTornado = dynamic(() => import('@/components/Background/AsciiTornado'), { ssr: false })

export default function Home() {
  const { state } = useGame()
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  
  // Show toast for invalid words
  useEffect(() => {
    if (state.shakeRow) {
      setToastMessage('Not in word list')
      setShowToast(true)
      const timer = setTimeout(() => setShowToast(false), 2000)
      return () => clearTimeout(timer)
    }
  }, [state.shakeRow])
  
  // Show toast for game end
  useEffect(() => {
    if (state.gameStatus === 'won') {
      const messages = ['Genius!', 'Magnificent!', 'Impressive!', 'Splendid!', 'Great!', 'Phew!']
      setToastMessage(messages[Math.min(state.guesses.length - 1, 5)])
      setShowToast(true)
    } else if (state.gameStatus === 'lost') {
      setToastMessage(state.targetWord.toUpperCase())
      setShowToast(true)
    }
  }, [state.gameStatus, state.guesses.length, state.targetWord])
  
  return (
    <main className="h-[100dvh] bg-abyss flex flex-col relative overflow-hidden">
      {/* Background Effects */}
      <ParticleField />
      <AsciiTornado />
      
      {/* Content */}
      <div className="relative z-10 flex flex-col h-full w-full max-w-lg mx-auto">
        <Header />
        
        {/* Toast Notification */}
        <AnimatePresence>
          {showToast && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-white text-black font-bold rounded-md shadow-lg"
            >
              {toastMessage}
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Game Area */}
        <div className="flex-1 flex flex-col items-center justify-center px-4 py-2 min-h-0">
          <Board />
        </div>
        
        {/* Keyboard */}
        <div className="pb-4 shrink-0">
          <Keyboard />
        </div>
      </div>
      
      {/* Win Celebration */}
      <AnimatePresence>
        {state.gameStatus === 'won' && !state.isRevealing && (
          <WinCelebration />
        )}
      </AnimatePresence>
    </main>
  )
}

function WinCelebration() {
  const particles = Array.from({ length: 50 })
  
  return (
    <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
      {particles.map((_, i) => (
        <motion.div
          key={i}
          initial={{
            x: Math.random() * window.innerWidth,
            y: window.innerHeight + 20,
            rotate: 0,
            scale: Math.random() * 0.5 + 0.5,
          }}
          animate={{
            y: -100,
            rotate: Math.random() * 720 - 360,
            transition: {
              duration: Math.random() * 2 + 2,
              delay: Math.random() * 0.5,
              ease: 'easeOut',
            },
          }}
          exit={{ opacity: 0 }}
          className="absolute"
          style={{
            left: `${Math.random() * 100}%`,
          }}
        >
          <div
            className="w-3 h-3 rounded-sm"
            style={{
              backgroundColor: ['#538d4e', '#b59f3b', '#ffffff', '#3a3a3c'][Math.floor(Math.random() * 4)],
            }}
          />
        </motion.div>
      ))}
    </div>
  )
}
