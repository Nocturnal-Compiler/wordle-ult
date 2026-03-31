import { clsx, type ClassValue } from 'clsx'

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

// Generate a unique ID
export function generateId(): string {
  return Math.random().toString(36).substring(2, 15)
}

// Sleep utility for animations
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// Format percentage
export function formatPercentage(value: number): string {
  return `${Math.round(value)}%`
}

// Calculate win percentage
export function calculateWinPercentage(gamesWon: number, gamesPlayed: number): number {
  if (gamesPlayed === 0) return 0
  return (gamesWon / gamesPlayed) * 100
}

// Calculate average guesses
export function calculateAverageGuesses(distribution: number[]): number {
  const totalGuesses = distribution.reduce((sum, count, index) => sum + count * (index + 1), 0)
  const totalWins = distribution.reduce((sum, count) => sum + count, 0)
  if (totalWins === 0) return 0
  return totalGuesses / totalWins
}
