import express from 'express'
import { protectRoute } from '../middleware/auth.middleware.js'
import { markModuleComplete, getCourseProgress, getCertificateData } from '../controllers/progress.controller.js'

const router = express.Router()

router.post('/complete', protectRoute, markModuleComplete)
router.get('/certificate/:courseId', protectRoute, getCertificateData)
router.get('/:courseId', protectRoute, getCourseProgress)

export default router
