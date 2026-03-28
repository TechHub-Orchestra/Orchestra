import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyAuth } from '@/lib/auth-utils'

export async function PATCH(req: Request, context: any) {
  const user = await verifyAuth(req)
  if (!user || user.role !== 'business') return NextResponse.json({ success: false }, { status: 403 })

  const params = await context.params
  const id = params.id
  const { status } = await req.json()
  let updatedCard: any = null

  db.update('businessCards', (cards) => cards.map(c => {
    if (c._id === id && (c.businessUserId === user._id)) {
      updatedCard = { ...c, status }
      return updatedCard
    }
    return c
  }))

  if (!updatedCard) return NextResponse.json({ success: false, message: 'Not found' }, { status: 404 })
  return NextResponse.json({ success: true, card: updatedCard })
}
