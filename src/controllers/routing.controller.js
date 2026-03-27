import { randomUUID } from 'crypto'
import RoutingRule from '../db/models/RoutingRule.js'
import Transaction from '../db/models/Transaction.js'
import { resolvePayment } from '../services/routing.js'
import { detectAnomalies } from '../services/anomaly.js'

export async function getRule(req, res) {
  const rule = await RoutingRule.findOne({ userId: req.user._id })
    .populate('primaryCardId cardOrder')
  res.json({ rule })
}

export async function updateRule(req, res) {
  const { mode, primaryCardId, cardOrder } = req.body
  const rule = await RoutingRule.findOneAndUpdate(
    { userId: req.user._id },
    { mode, primaryCardId, cardOrder },
    { upsert: true, new: true, runValidators: true }
  )
  res.json({ rule })
}

export async function simulate(req, res) {
  // amount is already in kobo — validated as integer by simulateRoutingSchema
  const { amount, merchant, category, save = false } = req.body

  const result = await resolvePayment(req.user._id, amount)
  if (!result.success) return res.status(400).json(result)

  const anomaly = await detectAnomalies(req.user._id, amount, merchant, category)

  if (save) {
    await Transaction.create({
      userId:          req.user._id,
      amount,
      currency:        'NGN',
      category:        category || 'other',
      merchant,
      narration:       `Simulated: ${merchant}`,
      reference:       randomUUID(),
      transactionDate: new Date(),
      // Map each allocation to the schema shape: [{ cardId, amount }]
      simulatedSplit: result.allocations.map(a => ({
        cardId: a.card._id,
        amount: a.charge,
      }))
    })
  }

  res.json({
    ...result,
    merchant,
    category,
    anomaly,
    steps: result.allocations.map((a, i) => ({
      step:        i + 1,
      cardLabel:   a.card.label,
      bank:        a.card.bank,
      cardProgram: a.card.cardProgram,
      charged:     a.charge,
      remaining:   a.remaining,
    }))
  })
}

// Keep upsertRule around if routes use it
export const upsertRule = updateRule
