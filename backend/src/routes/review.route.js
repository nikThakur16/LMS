import express from 'express'
import { protectRoute } from '../middleware/auth.middleware.js'
import { createOrUpdateReview, getCourseReviews } from '../controllers/review.controller.js'

const router = express.Router()

router.post('/', protectRoute, createOrUpdateReview)
router.get('/:courseId', protectRoute, getCourseReviews)

export default router
