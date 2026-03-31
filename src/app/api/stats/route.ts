import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import dbConnect from '@/lib/mongodb'
import User from '@/models/User'
import { getTodayString } from '@/lib/words'
import { calculateAverageGuesses } from '@/lib/utils'

// GET - Fetch user stats
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    await dbConnect()
    
    const user = await User.findOne({ email: session.user.email })
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      stats: user.stats,
    })
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json(
      { error: 'An error occurred while fetching stats' },
      { status: 500 }
    )
  }
}

// POST - Update user stats after a game
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    const { won, guesses, gameMode } = await request.json()
    
    await dbConnect()
    
    const user = await User.findOne({ email: session.user.email })
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }
    
    const today = getTodayString()
    
    // For daily mode, check if already completed today
    if (gameMode === 'daily') {
      if (user.stats.lastCompletedDaily === today) {
        return NextResponse.json({
          success: true,
          message: 'Daily already completed',
          stats: user.stats,
        })
      }
      user.stats.lastCompletedDaily = today
    }
    
    // Update stats
    user.stats.gamesPlayed += 1
    user.stats.lastPlayedDate = today
    
    if (won) {
      user.stats.gamesWon += 1
      user.stats.guessDistribution[guesses - 1] += 1
      user.stats.currentStreak += 1
      user.stats.maxStreak = Math.max(user.stats.maxStreak, user.stats.currentStreak)
    } else {
      user.stats.currentStreak = 0
    }
    
    // Recalculate average guesses
    user.stats.averageGuesses = calculateAverageGuesses(user.stats.guessDistribution)
    
    await user.save()
    
    return NextResponse.json({
      success: true,
      stats: user.stats,
    })
  } catch (error) {
    console.error('Error updating stats:', error)
    return NextResponse.json(
      { error: 'An error occurred while updating stats' },
      { status: 500 }
    )
  }
}
