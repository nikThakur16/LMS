import express from 'express'
import { protectRoute } from '../middleware/auth.middleware.js'
import { saveNote, getNote } from '../controllers/note.controller.js'

const router = express.Router()

router.post('/', protectRoute, saveNote)
router.get('/:moduleId', protectRoute, getNote)

export default router
