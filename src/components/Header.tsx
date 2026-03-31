'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import { useGame } from '@/context/GameContext'
import StatsModal from './StatsModal'
import HelpModal from './HelpModal'

export default function Header() {
  const { data: session } = useSession()
  const { state, switchMode } = useGame()
  const [showStats, setShowStats] = useState(false)
  const [showHelp, setShowHelp] = useState(false)
  
  return (
    <>
      <header className="w-full border-b border-gray-700/50 bg-black/30 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          {/* Left: Help button */}
          <button
            onClick={() => setShowHelp(true)}
            className="p-2 hover:bg-gray-800/50 rounded-lg transition-colors"
            aria-label="How to play"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
          
          {/* Center: Title and mode toggle */}
          <div className="flex flex-col items-center">
            <motion.h1 
              className="text-2xl font-bold text-white tracking-wider"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              WORDLE
            </motion.h1>
            
            {/* Mode Toggle */}
            <div className="flex items-center gap-2 mt-1">
              <button
                onClick={(e) => { switchMode('daily'); e.currentTarget.blur(); }}
                className={`text-xs px-2 py-0.5 rounded transition-colors ${
                  state.gameMode === 'daily'
                    ? 'bg-wordle-green text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Daily
              </button>
              <button
                onClick={(e) => { switchMode('unlimited'); e.currentTarget.blur(); }}
                className={`text-xs px-2 py-0.5 rounded transition-colors ${
                  state.gameMode === 'unlimited'
                    ? 'bg-wordle-green text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Unlimited
              </button>
            </div>
          </div>
          
          {/* Right: Stats and Auth */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowStats(true)}
              className="p-2 hover:bg-gray-800/50 rounded-lg transition-colors"
              aria-label="Statistics"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </button>
            
            {session ? (
              <div className="relative group">
                <button className="p-2 hover:bg-gray-800/50 rounded-lg transition-colors">
                  <div className="w-6 h-6 rounded-full bg-wordle-green flex items-center justify-center text-white text-sm font-bold">
                    {session.user?.name?.[0] || session.user?.email?.[0] || 'U'}
                  </div>
                </button>
                <div className="absolute right-0 top-full mt-2 w-48 bg-gray-900 border border-gray-700 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="p-3 border-b border-gray-700">
                    <p className="text-sm text-white font-medium truncate">
                      {session.user?.name || session.user?.email}
                    </p>
                    <p className="text-xs text-gray-400 truncate">{session.user?.email}</p>
                  </div>
                  <button
                    onClick={() => signOut()}
                    className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-gray-800 transition-colors"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            ) : (
              <Link
                href="/auth/login"
                className="p-2 hover:bg-gray-800/50 rounded-lg transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </Link>
            )}
          </div>
        </div>
      </header>
      
      <StatsModal isOpen={showStats} onClose={() => setShowStats(false)} />
      <HelpModal isOpen={showHelp} onClose={() => setShowHelp(false)} />
    </>
  )
}
