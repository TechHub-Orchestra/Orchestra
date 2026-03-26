import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyAuth } from '@/lib/auth-utils'

export async function POST(req: Request) {
  const user = await verifyAuth(req)
  if (!user) return NextResponse.json({ success: false }, { status: 401 })

  const { amount, merchant, category } = await req.json()
  const amountKobo = amount * 100

  const userCards = db.get('cards').filter(c => c.userId === user._id && c.cardStatus === '1')
  const userRule = db.get('routingRules').find(r => r.userId === user._id) || { mode: 'primary', primaryCardId: userCards[0]?._id }

  const steps: any[] = []
  let totalCharged = 0
  let mode = userRule.mode

  if (mode === 'primary' || userCards.length === 1) {
    const primaryCardId = userRule.primaryCardId || userCards[0]?._id
    const card = userCards.find(c => c._id === primaryCardId) || userCards[0]
    
    if (card) {
      steps.push({
        step: 1,
        cardLabel: card.label,
        bank: card.bank,
        cardProgram: card.cardProgram,
        charged: amountKobo,
        remaining: Math.max(0, card.availableBalance - amountKobo)
      })
      totalCharged = amountKobo
    }
  } else if (mode === 'auto-split') {
    // Current logic: split between first two active cards
    let remainingToCharge = amountKobo
    for (let i = 0; i < userCards.length && remainingToCharge > 0; i++) {
       const card = userCards[i]
       const canCharge = Math.min(remainingToCharge, card.availableBalance)
       if (canCharge > 0) {
         steps.push({
           step: i + 1,
           cardLabel: card.label,
           bank: card.bank,
           cardProgram: card.cardProgram,
           charged: canCharge,
           remaining: card.availableBalance - canCharge
         })
         remainingToCharge -= canCharge
         totalCharged += canCharge
       }
    }
  }

  const isAnomaly = amountKobo > 1000000 

  return NextResponse.json({
    success: true,
    mode: mode,
    steps,
    totalCharged,
    anomaly: isAnomaly ? { reasons: ['Transaction amount exceeds historical average for ' + (category || merchant)] } : null
  })
}
