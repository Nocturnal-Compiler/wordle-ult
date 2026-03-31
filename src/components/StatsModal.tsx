'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { motion } from 'framer-motion'
import Modal from './Modal'
import { useGame } from '@/context/GameContext'
import { UserStats } from '@/types'
import { formatPercentage, calculateWinPercentage } from '@/lib/utils'
import Link from 'next/link'

interface StatsModalProps {
  isOpen: boolean
  onClose: () => void
}

const defaultStats: UserStats = {
  gamesPlayed: 0,
  gamesWon: 0,
  currentStreak: 0,
  maxStreak: 0,
  guessDistribution: [0, 0, 0, 0, 0, 0],
  averageGuesses: 0,
  lastPlayedDate: null,
  lastCompletedDaily: null,
}

export default function StatsModal({ isOpen, onClose }: StatsModalProps) {
  const { data: session } = useSession()
  const { state, newGame } = useGame()
  const [stats, setStats] = useState<UserStats>(defaultStats)
  const [loading, setLoading] = useState(false)
  
  useEffect(() => {
    if (isOpen && session?.user?.email) {
      fetchStats()
    }
  }, [isOpen, session])
  
  const fetchStats = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/stats')
      if (response.ok) {
        const data = await response.json()
        setStats(data.stats || defaultStats)
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }
  
  const winPercentage = calculateWinPercentage(stats.gamesWon, stats.gamesPlayed)
  const maxDistribution = Math.max(...stats.guessDistribution, 1)
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Statistics">
      {!session ? (
        <div className="text-center py-8">
          <p className="text-gray-400 mb-4">Sign in to track your stats across devices</p>
          <Link
            href="/auth/login"
            className="inline-block px-6 py-2 bg-wordle-green text-white rounded-lg font-medium hover:bg-wordle-green/90 transition-colors"
          >
            Sign In
          </Link>
        </div>
      ) : loading ? (
        <div className="flex justify-center py-8">
          <div className="w-8 h-8 border-2 border-wordle-green border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            <StatBox value={stats.gamesPlayed} label="Played" />
            <StatBox value={formatPercentage(winPercentage)} label="Win %" />
            <StatBox value={stats.currentStreak} label="Current Streak" />
            <StatBox value={stats.maxStreak} label="Max Streak" />
          </div>
          
          {/* Guess Distribution */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-400 uppercase mb-3">Guess Distribution</h3>
            <div className="space-y-2">
              {stats.guessDistribution.map((count, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="text-white font-bold w-4">{index + 1}</span>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.max((count / maxDistribution) * 100, count > 0 ? 10 : 5)}%` }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className={`h-6 rounded flex items-center justify-end px-2 min-w-[20px] ${
                      count > 0 ? 'bg-wordle-green' : 'bg-gray-700'
                    }`}
                  >
                    <span className="text-white text-sm font-bold">{count}</span>
                  </motion.div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Average Guesses */}
          <div className="text-center mb-6">
            <p className="text-gray-400 text-sm">
              Average guesses per win: <span className="text-white font-bold">{stats.averageGuesses.toFixed(1)}</span>
            </p>
          </div>
          
          {/* Game Status & Actions */}
          {(state.gameStatus === 'won' || state.gameStatus === 'lost') && (
            <div className="border-t border-gray-700 pt-4 mt-4">
              {state.gameStatus === 'won' && (
                <p className="text-center text-wordle-green font-bold mb-4">
                  🎉 Congratulations! You got it in {state.guesses.length} {state.guesses.length === 1 ? 'guess' : 'guesses'}!
                </p>
              )}
              {state.gameStatus === 'lost' && (
                <p className="text-center text-gray-400 mb-4">
                  The word was: <span className="text-white font-bold uppercase">{state.targetWord}</span>
                </p>
              )}
              
              {state.gameMode === 'unlimited' && (
                <button
                  onClick={() => {
                    newGame()
                    onClose()
                  }}
                  className="w-full py-3 bg-wordle-green text-white rounded-lg font-bold hover:bg-wordle-green/90 transition-colors"
                >
                  Play Again
                </button>
              )}
            </div>
          )}
        </>
      )}
    </Modal>
  )
}

function StatBox({ value, label }: { value: string | number; label: string }) {
  return (
    <div className="text-center">
      <motion.p
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="text-3xl font-bold text-white"
      >
        {value}
      </motion.p>
      <p className="text-xs text-gray-400">{label}</p>
    </div>
  )
}
