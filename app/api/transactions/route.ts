import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyAuth } from '@/lib/auth-utils'

export async function GET(req: Request) {
  const user = await verifyAuth(req)
  if (!user) return NextResponse.json({ success: false }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const cardId = searchParams.get('cardId')
  const category = searchParams.get('category')
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '50')

  let transactions = db.get('transactions').filter(t => t.userId === user._id)
  
  if (cardId) transactions = transactions.filter(t => t.cardId === cardId)
  if (category) transactions = transactions.filter(t => t.category === category)
  
  // Sort by date desc
  transactions.sort((a, b) => new Date(b.transactionDate).getTime() - new Date(a.transactionDate).getTime())

  const total = transactions.length
  const startIndex = (page - 1) * limit
  const paginated = transactions.slice(startIndex, startIndex + limit)

  return NextResponse.json({
    success: true,
    transactions: paginated,
    total,
    page,
    limit
  })
}

export async function POST(req: Request) {
  const user = await verifyAuth(req)
  if (!user) return NextResponse.json({ success: false }, { status: 401 })

  const body = await req.json()
  const { amount, merchant, category, cardId } = body

  // Core "routing logic" simulation: Pick a card
  let selectedCardId = cardId
  const allCards = db.get('cards').filter(c => c.userId === user._id)
  
  if (!selectedCardId) {
    // Basic logic: Select default or first active card
    const activeCards = allCards.filter(c => c.cardStatus === '1')
    if (activeCards.length === 0) return NextResponse.json({ success: false, message: 'No active cards available for transaction' }, { status: 400 })
    selectedCardId = activeCards[0]._id
  }

  const selectedCard = allCards.find(c => c._id === selectedCardId)
  if (!selectedCard) return NextResponse.json({ success: false, message: 'Invalid card selected' }, { status: 400 })

  const isAnomaly = amount > 1000000 // Simple threshold anomaly

  const newTransaction = {
    _id: Math.random().toString(36).substr(2, 9),
    userId: user._id,
    cardId: selectedCardId,
    pan: selectedCard.pan,
    amount,
    currency: 'NGN',
    merchant: merchant || 'Unknown Merchant',
    category: category || 'Misc',
    transactionDate: new Date().toISOString(),
    isAnomaly,
    anomalyReason: isAnomaly ? 'Transaction exceeds usual spend thresholds' : undefined
  }

  db.update('transactions', (ts) => [...ts, newTransaction])
  
  if (isAnomaly) {
    db.update('anomalies', (ans) => [...ans, newTransaction])
  }

  // Update card balance
  db.update('cards', (cs) => cs.map(c => 
    c._id === selectedCardId ? { ...c, availableBalance: (c.availableBalance || 0) - amount } : c
  ))

  return NextResponse.json({ success: true, transaction: newTransaction }, { status: 201 })
}
