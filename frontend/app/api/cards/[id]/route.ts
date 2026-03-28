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
  return NextResponse.json({ success: true, card })
}

export async function PATCH(req: Request, context: any) {
  const user = await verifyAuth(req)
  if (!user) return NextResponse.json({ success: false }, { status: 401 })

  const params = await context.params
  const id = params.id
  const body = await req.json()
  const { action } = body

  let status = '1' // Active
  if (action === 'block') status = '2' // Blocked
  else if (action === 'unblock') status = '1'

  let updatedCard: any = null
  db.update('cards', (cards) => cards.map(c => {
    if (c._id === id && c.userId === user._id) {
      updatedCard = { ...c, cardStatus: status, ...body }
      delete updatedCard.action // remove helper field
      return updatedCard
    }
    return c
  }))

  if (!updatedCard) return NextResponse.json({ success: false, message: 'Card not found' }, { status: 404 })
  return NextResponse.json({ success: true, card: updatedCard })
}

export async function DELETE(req: Request, context: any) {
  const user = await verifyAuth(req)
  if (!user) return NextResponse.json({ success: false }, { status: 401 })

  const params = await context.params
  const id = params.id
  db.update('cards', (cards) => cards.filter(c => !(c._id === id && c.userId === user._id)))
  return NextResponse.json({ success: true, message: 'Card removed' })
}
