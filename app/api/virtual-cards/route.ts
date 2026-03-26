import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyAuth } from '@/lib/auth-utils'

export async function GET(req: Request) {
  const user = await verifyAuth(req)
  if (!user) return NextResponse.json({ success: false }, { status: 401 })

  const vCards = db.get('virtualCards')
  const userVCards = vCards.filter(c => c.userId === user._id)

  return NextResponse.json({
    success: true,
    cards: userVCards
  })
}

export async function POST(req: Request) {
  const user = await verifyAuth(req)
  if (!user) return NextResponse.json({ success: false }, { status: 401 })

  const body = await req.json()
  const newVCard = {
    ...body,
    _id: 'v' + Math.random().toString(36).substr(2, 9),
    userId: user._id,
    amountSpent: 0,
    paused: false,
    pan: '424242******' + Math.floor(1000 + Math.random() * 9000),
    expiryDate: '12/28',
    createdAt: new Date().toISOString()
  }

  db.update('virtualCards', (cards) => [...cards, newVCard])

  return NextResponse.json({ success: true, card: newVCard })
}
