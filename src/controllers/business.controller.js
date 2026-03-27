import BusinessCard from '../db/models/BusinessCard.js'
import ApprovalRequest from '../db/models/ApprovalRequest.js'
import Transaction from '../db/models/Transaction.js'
import RoutingRule from '../db/models/RoutingRule.js'
import Card from '../db/models/Card.js'
import CardBalance from '../db/models/CardBalance.js'

export async function getBusinessCards(req, res) {
  const cards = await BusinessCard.find({ businessUserId: req.user._id })
  const withPending = await Promise.all(cards.map(async (card) => {
    const pending = await ApprovalRequest.countDocuments({
      businessCardId: card._id, status: 'pending'
    })
    return { ...card.toObject(), pendingApprovals: pending }
  }))
  res.json({ cards: withPending })
}

export async function getApprovalQueue(req, res) {
  const cards = await BusinessCard.find({ businessUserId: req.user._id }).select('_id')
  const cardIds = cards.map(c => c._id)

  const requests = await ApprovalRequest.find({ businessCardId: { $in: cardIds }, status: 'pending' })
    .populate('businessCardId', 'assignedTo purpose pan')
    .sort({ createdAt: -1 })

  res.json({ approvalQueue: requests })
}

export async function createBusinessCard(req, res) {
  const { assignedTo, purpose, budget, merchantCategories,
          expiresAt, approvalThreshold } = req.body

  const bc = await BusinessCard.create({
    businessUserId:    req.user._id,
    assignedTo,
    purpose,
    budget:            budget * 100,
    merchantCategories,
    expiresAt:         expiresAt ? new Date(expiresAt) : null,
    approvalThreshold: approvalThreshold ? approvalThreshold * 100 : null,
    pan:               `BIZ${Date.now()}`,
  })

  res.status(201).json({ businessCard: bc })
}

export async function updateBusinessCard(req, res) {
  const { status } = req.body   // 'active' | 'suspended'
  const card = await BusinessCard.findOneAndUpdate(
    { _id: req.params.id, businessUserId: req.user._id },
    { status },
    { new: true }
  )
  if (!card) return res.status(404).json({ error: 'Business card not found' })
  res.json({ card })
}

export async function handleApproval(req, res) {
  const { requestId, action, note } = req.body
  // action: 'approve' | 'reject'

  const request = await ApprovalRequest.findById(requestId)
    .populate('businessCardId')
  if (!request) return res.status(404).json({ error: 'Request not found' })

  if (request.businessCardId.businessUserId.toString() !== req.user._id.toString()) {
    return res.status(403).json({ error: 'Forbidden' })
  }

  request.status     = action === 'approve' ? 'approved' : 'rejected'
  request.reviewedBy = req.user._id
  request.reviewedAt = new Date()
  request.reviewNote = note
  await request.save()

  if (action === 'approve') {
    const card = request.businessCardId
    card.amountSpent += request.amount
    if (card.amountSpent >= card.budget) card.status = 'exhausted'
    await card.save()

    // Deduct from business user's primary card balance to maintain demo consistency
    const rule = await RoutingRule.findOne({ userId: req.user._id })
    const primaryCardId = rule?.primaryCardId || await Card.findOne({ userId: req.user._id, isDefault: true }).then(c => c?._id)
    
    if (primaryCardId) {
      const pCard = await Card.findById(primaryCardId)
      if (pCard) {
        await CardBalance.findOneAndUpdate(
          { pan: pCard.pan },
          { $inc: { availableBalance: -request.amount, ledgerBalance: -request.amount }, $set: { fetchedAt: new Date() } },
          { sort: { fetchedAt: -1 } }
        )
      }
    }

    await Transaction.create({
      userId:          req.user._id,
      amount:          request.amount,
      currency:        'NGN',
      category:        'other',
      pan:             card.pan,
      merchant:        request.merchant,
      narration:       request.reason,
      reference:       `APV-${Date.now()}`,
      transactionDate: new Date(),
    })
  }

  res.json({ request })
}
