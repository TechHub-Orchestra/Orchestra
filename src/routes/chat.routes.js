import { Router } from 'express'
import { protect }  from '../middleware/auth.middleware.js'
import { handleChat, getChatHistory, clearChat } from '../controllers/chat.controller.js'

const router = Router()
router.use(protect)

router.get('/',      getChatHistory)
router.post('/',     handleChat)
router.delete('/',   clearChat)

export default router
