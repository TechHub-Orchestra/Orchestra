import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyAuth } from '@/lib/auth-utils'

export async function PATCH(req: Request, context: any) {
  const user = await verifyAuth(req)
  if (!user) return NextResponse.json({ success: false }, { status: 401 })

  const params = await context.params
  const id = params.id
  const { action } = await req.json()
  let updatedCard: any = null

  if (action === 'delete') {
    db.update('virtualCards', (cards) => cards.filter(c => !(c._id === id && c.userId === user._id)))
    return NextResponse.json({ success: true, message: 'Virtual card deleted' })
  }

  db.update('virtualCards', (cards) => cards.map(c => {
    if (c._id === id && c.userId === user._id) {
      updatedCard = { 
        ...c, 
        paused: action === 'pause' ? true : (action === 'resume' ? false : c.paused)
      }
      return updatedCard
    }
    return c
  }))

  if (!updatedCard) return NextResponse.json({ success: false, message: 'Card not found' }, { status: 404 })
  return NextResponse.json({ success: true, card: updatedCard })
}
