import { Router } from 'express'
import { protect }  from '../middleware/auth.middleware.js'
import { validate } from '../middleware/validate.middleware.js'
import { chatSchema } from '../middleware/schemas.js'
import { handleChat, getChatHistory, clearChat } from '../controllers/chat.controller.js'

const router = Router()
router.use(protect)

router.get('/',      getChatHistory)
router.post('/',     validate(chatSchema), handleChat)
router.delete('/',   clearChat)

export default router
