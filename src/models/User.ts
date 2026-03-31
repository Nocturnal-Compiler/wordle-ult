import mongoose, { Schema, Document } from 'mongoose'
import { UserStats } from '@/types'

export interface IUser extends Document {
  email: string
  password?: string
  name?: string
  image?: string
  stats: UserStats
  createdAt: Date
  updatedAt: Date
}

const UserStatsSchema = new Schema({
  gamesPlayed: { type: Number, default: 0 },
  gamesWon: { type: Number, default: 0 },
  currentStreak: { type: Number, default: 0 },
  maxStreak: { type: Number, default: 0 },
  guessDistribution: { type: [Number], default: [0, 0, 0, 0, 0, 0] },
  averageGuesses: { type: Number, default: 0 },
  lastPlayedDate: { type: String, default: null },
  lastCompletedDaily: { type: String, default: null },
})

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      select: false,
    },
    name: {
      type: String,
      trim: true,
    },
    image: {
      type: String,
    },
    stats: {
      type: UserStatsSchema,
      default: () => ({}),
    },
  },
  {
    timestamps: true,
  }
)

// Prevent model recompilation in development
export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema)
