import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { amount, merchant, category } = await req.json()
  const amountKobo = amount * 100

  // Mock routing logic
  const steps = [
    {
      step: 1,
      cardLabel: 'GTBank Salary',
      bank: 'GTBank',
      cardProgram: 'MASTERCARD',
      charged: Math.min(amountKobo, 5000000),
      remaining: Math.max(0, 5000000 - amountKobo)
    }
  ]
  
  if (amountKobo > 5000000) {
    steps.push({
      step: 2,
      cardLabel: 'Access Main',
      bank: 'Access Bank',
      cardProgram: 'VISA',
      charged: amountKobo - 5000000,
      remaining: 8250000 - (amountKobo - 5000000)
    })
  }

  return NextResponse.json({
    success: true,
    mode: 'auto-split',
    steps,
    totalCharged: amountKobo,
    anomaly: amountKobo > 1000000 ? { reasons: ['Transaction amount exceeds historical average for ' + category] } : null
  })
}
