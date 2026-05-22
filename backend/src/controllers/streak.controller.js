import { Streak } from '../models/streak.model.js'

// Badge definitions — checked after every activity record
const BADGE_DEFS = [
  { id: 'first_step',   name: 'First Step',      check: (s) => s.modulesCompleted >= 1   },
  { id: 'five_modules', name: 'Getting Serious',  check: (s) => s.modulesCompleted >= 5   },
  { id: 'ten_modules',  name: 'On a Roll',        check: (s) => s.modulesCompleted >= 10  },
  { id: 'on_fire',      name: 'On Fire',          check: (s) => s.currentStreak  >= 3     },
  { id: 'week_warrior', name: 'Week Warrior',     check: (s) => s.currentStreak  >= 7     },
  { id: 'century',      name: 'Century Club',     check: (s) => s.totalXP        >= 100   },
  { id: 'scholar',      name: 'Scholar',          check: (s) => s.totalXP        >= 500   },
  { id: 'master',       name: 'Master',           check: (s) => s.totalXP        >= 1000  },
]

const todayStr = () => new Date().toISOString().split('T')[0]

const yesterdayStr = () => {
  const d = new Date()
  d.setDate(d.getDate() - 1)
  return d.toISOString().split('T')[0]
}

// POST /api/streak/activity  — call when a module is marked complete
export const recordActivity = async (req, res) => {
  try {
    const userId = req.user._id
    const today  = todayStr()

    let streak = await Streak.findOne({ userId })
    if (!streak) {
      streak = new Streak({ userId })
    }

    const last   = streak.lastActiveDate
    let xpEarned = 10  // base XP per module

    if (last === today) {
      // Already active today — still award module XP but don't touch streak
    } else if (last === yesterdayStr()) {
      // Consecutive day — extend streak
      streak.currentStreak += 1
      xpEarned += 5  // streak bonus
    } else {
      // Missed a day or first ever — reset streak
      streak.currentStreak = 1
    }

    streak.lastActiveDate = today
    if (streak.currentStreak > streak.longestStreak) {
      streak.longestStreak = streak.currentStreak
    }

    streak.totalXP          += xpEarned
    streak.modulesCompleted += 1

    // Check and award new badges
    const earnedIds    = new Set(streak.badges.map((b) => b.id))
    const newlyEarned  = []
    for (const def of BADGE_DEFS) {
      if (!earnedIds.has(def.id) && def.check(streak)) {
        streak.badges.push({ id: def.id, name: def.name })
        newlyEarned.push(def.name)
      }
    }

    await streak.save()

    res.status(200).json({
      streak: streak.currentStreak,
      longestStreak: streak.longestStreak,
      totalXP: streak.totalXP,
      modulesCompleted: streak.modulesCompleted,
      badges: streak.badges,
      xpEarned,
      newBadges: newlyEarned,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// GET /api/streak  — fetch current user's streak data
export const getStreak = async (req, res) => {
  try {
    const userId = req.user._id
    let streak = await Streak.findOne({ userId })

    if (!streak) {
      return res.status(200).json({
        streak: 0,
        longestStreak: 0,
        totalXP: 0,
        modulesCompleted: 0,
        badges: [],
        atRisk: false,
      })
    }

    const today     = todayStr()
    const yesterday = yesterdayStr()
    // "At risk" — user was active yesterday but not yet today
    const atRisk    = streak.lastActiveDate === yesterday

    res.status(200).json({
      streak: streak.currentStreak,
      longestStreak: streak.longestStreak,
      totalXP: streak.totalXP,
      modulesCompleted: streak.modulesCompleted,
      badges: streak.badges,
      atRisk,
      lastActiveDate: streak.lastActiveDate,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getLeaderboard = async (req, res) => {
  try {
    const top = await Streak.find()
      .sort({ totalXP: -1 })
      .limit(20)
      .populate('userId', 'fullName profilePhoto')

    const currentUserId = req.user._id.toString()
    const list = top.map((s, i) => ({
      rank: i + 1,
      userId: s.userId?._id,
      fullName: s.userId?.fullName || 'Unknown',
      profilePhoto: s.userId?.profilePhoto || null,
      totalXP: s.totalXP,
      streak: s.currentStreak,
      modulesCompleted: s.modulesCompleted,
      badgeCount: s.badges?.length || 0,
      isCurrentUser: s.userId?._id?.toString() === currentUserId,
    }))

    let currentUserEntry = null
    const inTop = list.find(e => e.isCurrentUser)
    if (!inTop) {
      const myStreak = await Streak.findOne({ userId: req.user._id })
      if (myStreak) {
        const totalAbove = await Streak.countDocuments({ totalXP: { $gt: myStreak.totalXP } })
        currentUserEntry = {
          rank: totalAbove + 1,
          userId: req.user._id,
          fullName: req.user.fullName,
          profilePhoto: req.user.profilePhoto || null,
          totalXP: myStreak.totalXP,
          streak: myStreak.currentStreak,
          modulesCompleted: myStreak.modulesCompleted,
          badgeCount: myStreak.badges?.length || 0,
          isCurrentUser: true,
        }
      }
    }

    res.status(200).json({ leaderboard: list, currentUserEntry })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
