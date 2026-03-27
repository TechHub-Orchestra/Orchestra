import { Router } from 'express'
import { protect }  from '../middleware/auth.middleware.js'
import { validate } from '../middleware/validate.middleware.js'
import { createVirtualCardSchema } from '../middleware/schemas.js'
import { getVirtualCards, createVirtualCard, updateVirtualCard }
  from '../controllers/virtualCards.controller.js'

const router = Router()
router.use(protect)

router.get('/',      getVirtualCards)
router.post('/',     validate(createVirtualCardSchema), createVirtualCard)
router.patch('/:id', updateVirtualCard)

export default router
