import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyAuth } from '@/lib/auth-utils'

export async function GET(req: Request, context: any) {
  const user = await verifyAuth(req)
  if (!user) return NextResponse.json({ success: false }, { status: 401 })

  const params = await context.params
  const id = params.id
  const cards = db.get('cards')
  const card = cards.find(c => c._id === id && c.userId === user._id)
  
  if (!card) return NextResponse.json({ success: false, message: 'Card not found' }, { status: 404 })

  // Mock "fetching" from Card360 live
  const newBalance = card.availableBalance + Math.floor((Math.random() - 0.5) * 1000)
  
  db.update('cards', (cs) => cs.map(c => 
    c._id === id ? { ...c, availableBalance: newBalance } : c
  ))

  return NextResponse.json({ success: true, balance: newBalance })
}
