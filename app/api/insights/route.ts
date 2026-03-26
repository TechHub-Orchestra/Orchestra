import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyAuth } from '@/lib/auth-utils'

export async function GET(req: Request) {
  const user = await verifyAuth(req)
  if (!user) return NextResponse.json({ success: false }, { status: 401 })

  const transactions = db.get('transactions').filter(t => t.userId === user._id)
  
  const byCategory: Record<string, number> = {}
  let totalSpent = 0

  transactions.forEach(t => {
    const cat = t.category || 'misc'
    byCategory[cat] = (byCategory[cat] || 0) + (t.amount || 0)
    totalSpent += (t.amount || 0)
  })

  // Basic insights generation
  const insights = [
     `You spent ₦${(totalSpent/100).toLocaleString()} across ${transactions.length} transactions.`,
     transactions.filter(t => t.isAnomaly).length > 0 ? `${transactions.filter(t => t.isAnomaly).length} anomalous transactions detected.` : "No unusual activity detected this period."
  ]

  const recommendations = [
    "Consider setting spend limits on your top categories.",
    "Review your virtual card recurring subscriptions."
  ]

  return NextResponse.json({
    success: true,
    insights: {
      summary: `You've spent ₦${(totalSpent/100).toLocaleString()} overall.`,
      insights,
      recommendations,
      savingsOpportunity: Math.floor(totalSpent * 0.05 / 100),
      byCategory
    }
  })
}
