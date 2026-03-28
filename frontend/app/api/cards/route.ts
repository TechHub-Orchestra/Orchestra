import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyAuth } from '@/lib/auth-utils'

export async function GET(req: Request) {
  const user = await verifyAuth(req)
  if (!user) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
  }

  const allCards = db.get('cards')
  const userCards = allCards.filter(c => c.userId === user._id)

  return NextResponse.json({
    success: true,
    cards: userCards
  })
}

export async function POST(req: Request) {
  const user = await verifyAuth(req)
  if (!user) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const newCard = {
    ...body,
    _id: Math.random().toString(36).substr(2, 9),
    userId: user._id,
    availableBalance: body.availableBalance || 0,
    cardStatus: '1', // 1=Active
    createdAt: new Date().toISOString()
  }

  db.update('cards', (cards) => [...cards, newCard])

  return NextResponse.json({ success: true, card: newCard })
}
