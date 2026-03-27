import { Router } from 'express'
import { getTransactions, getTransaction, createTransaction, getTransactionSummary } from '../controllers/transactions.controller.js'
import { protect } from '../middleware/auth.middleware.js'
import { validate } from '../middleware/validate.middleware.js'
import { createTransactionSchema } from '../middleware/schemas.js'

const router = Router()

router.use(protect)

router.route('/')
  .get(getTransactions)
  .post(validate(createTransactionSchema), createTransaction)

router.get('/summary', getTransactionSummary)

router.get('/:id', getTransaction)

export default router
