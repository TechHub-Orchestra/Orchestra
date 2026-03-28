import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyAuth } from '@/lib/auth-utils'

export async function GET(req: Request) {
  const user = await verifyAuth(req)
  if (!user || user.role !== 'business') {
    return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 })
  }

  const bCards = db.get('businessCards')
  const userBCards = bCards.filter(c => c.businessUserId === user._id)
  
  const requests = db.get('expenseRequests')
  const myRequests = requests.filter(r => r.businessUserId === user._id && r.status === 'pending')

  return NextResponse.json({
    success: true,
    cards: userBCards,
    pendingActions: myRequests
  })
}

export async function POST(req: Request) {
  const user = await verifyAuth(req)
  if (!user || user.role !== 'business') {
    return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 })
  }

  const body = await req.json()
  const newBCard = {
    ...body,
    _id: 'b' + Math.random().toString(36).substr(2, 9),
    businessUserId: user._id,
    amountSpent: 0,
    status: 'active',
    pan: '539940******' + Math.floor(1000 + Math.random() * 9000),
    createdAt: new Date().toISOString()
  }

  db.update('businessCards', (cards) => [...cards, newBCard])
  return NextResponse.json({ success: true, card: newBCard }, { status: 201 })
}
