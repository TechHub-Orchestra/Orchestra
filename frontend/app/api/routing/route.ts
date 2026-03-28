import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyAuth } from '@/lib/auth-utils'

export async function GET(req: Request) {
  const user = await verifyAuth(req)
  if (!user) return NextResponse.json({ success: false }, { status: 401 })

  const rules = db.get('routingRules')
  const userRule = rules.find(r => r.userId === user._id)

  return NextResponse.json({
    success: true,
    rule: userRule || { userId: user._id, mode: 'primary', primaryCardId: null, cardOrder: [] }
  })
}

export async function PUT(req: Request) {
  const user = await verifyAuth(req)
  if (!user) return NextResponse.json({ success: false }, { status: 401 })

  const body = await req.json()
  const updatedRule = { ...body, userId: user._id, updatedAt: new Date().toISOString() }
  
  db.update('routingRules', (rules) => {
    const others = rules.filter(r => r.userId !== user._id)
    return [...others, updatedRule]
  })

  return NextResponse.json({ success: true, rule: updatedRule })
}
