import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyAuth } from '@/lib/auth-utils'

export async function GET(req: Request) {
  const user = await verifyAuth(req)
  if (!user) return NextResponse.json({ success: false }, { status: 401 })

  const transactions = db.get('transactions').filter(t => t.userId === user._id)
  
  return NextResponse.json({
    success: true,
    report: {
      transactions: transactions.map(t => ({
        date: t.transactionDate,
        merchant: t.merchant,
        category: t.category,
        amount: t.amount,
        reference: t._id,
        flagged: t.isAnomaly
      }))
    }
  })
}
