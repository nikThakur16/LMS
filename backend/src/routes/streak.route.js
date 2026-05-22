import express from 'express'
import { recordActivity, getStreak, getLeaderboard } from '../controllers/streak.controller.js'
import { protectRoute } from '../middleware/auth.middleware.js'

const router = express.Router()

router.post('/activity',     protectRoute, recordActivity)
router.get('/',              protectRoute, getStreak)
router.get('/leaderboard',   protectRoute, getLeaderboard)

export default router
