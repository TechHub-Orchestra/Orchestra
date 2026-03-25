import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    cards: [
      {
        _id: '1',
        label: 'GTBank Salary',
        bank: 'GTBank',
        cardProgram: 'MASTERCARD',
        pan: '539940******1234',
        nameOnCard: 'DEMO USER',
        expiryDate: '2612',
        availableBalance: 25430000,
        cardStatus: '1',
        color: 'linear-gradient(135deg, #1A1A2E 0%, #16213E 100%)'
      },
      {
        _id: '2',
        label: 'Access Main',
        bank: 'Access Bank',
        cardProgram: 'VISA',
        pan: '424242******4242',
        nameOnCard: 'DEMO USER',
        expiryDate: '2508',
        availableBalance: 8250000,
        cardStatus: '1',
        color: 'linear-gradient(135deg, #E94560 0%, #c73652 100%)'
      },
      {
        _id: '3',
        label: 'UBA Savings',
        bank: 'UBA',
        cardProgram: 'VERVE',
        pan: '506105******8899',
        nameOnCard: 'DEMO USER',
        expiryDate: '2710',
        availableBalance: 5000000,
        cardStatus: '2',
        color: 'linear-gradient(135deg, #0f3460 0%, #16213E 100%)'
      }
    ]
  })
}

export async function POST(req: Request) {
  const body = await req.json()
  return NextResponse.json({ success: true, card: { ...body, _id: Math.random().toString(36).substr(2, 9), availableBalance: 0, cardStatus: '1' } })
}
