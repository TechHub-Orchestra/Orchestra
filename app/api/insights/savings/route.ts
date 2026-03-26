import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyAuth } from '@/lib/auth-utils'

export async function POST(req: Request) {
  const user = await verifyAuth(req)
  if (!user) return NextResponse.json({ success: false }, { status: 401 })

  const { adjustments } = await req.json()
  const transactions = db.get('transactions').filter(t => t.userId === user._id)
  
  const byCategory: Record<string, number> = {}
  transactions.forEach(t => {
    const cat = t.category || 'misc'
    byCategory[cat] = (byCategory[cat] || 0) + (t.amount || 0)
  })

  let monthlySavings = 0
  for (const [cat, adj] of Object.entries(adjustments as Record<string, number>)) {
    monthlySavings += (byCategory[cat] || 0) * (1 - (adj as number))
  }

  return NextResponse.json({
    success: true,
    monthlySavings,
    annualSavings: monthlySavings * 12
  })
}
