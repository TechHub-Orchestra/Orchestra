import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { adjustments } = await req.json()
  const byCategory: Record<string, number> = {
    food: 12000000,
    transport: 4500000,
    shopping: 18000000,
    subscriptions: 3500000,
    utilities: 2000000,
    entertainment: 2500000
  }

  let monthlySavings = 0
  for (const [cat, adj] of Object.entries(adjustments as Record<string, number>)) {
    monthlySavings += (byCategory[cat] || 0) * (1 - adj)
  }

  return NextResponse.json({
    monthlySavings,
    annualSavings: monthlySavings * 12
  })
}
