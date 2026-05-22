import mongoose from 'mongoose'

const badgeSchema = new mongoose.Schema({
  id:       { type: String, required: true },
  name:     { type: String, required: true },
  earnedAt: { type: Date, default: Date.now },
}, { _id: false })

const streakSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  currentStreak:    { type: Number, default: 0 },
  longestStreak:    { type: Number, default: 0 },
  lastActiveDate:   { type: String, default: null },  // 'YYYY-MM-DD'
  totalXP:          { type: Number, default: 0 },
  modulesCompleted: { type: Number, default: 0 },
  badges:           { type: [badgeSchema], default: [] },
}, { timestamps: true })

export const Streak = mongoose.model('Streak', streakSchema)
