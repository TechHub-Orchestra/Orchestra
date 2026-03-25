import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    cards: [
      {
        _id: 'v1',
        label: 'Netflix Sub',
        merchant: 'Netflix',
        amountSpent: 750000,
        spendLimit: 1000000,
        paused: false,
        autoRenew: true
      },
      {
        _id: 'v2',
        label: 'Spotify Sub',
        merchant: 'Spotify',
        amountSpent: 280000,
        spendLimit: 300000,
        paused: false,
        autoRenew: true
      },
      {
        _id: 'v3',
        label: 'Generic Online',
        amountSpent: 120000,
        spendLimit: 500000,
        paused: true,
        autoRenew: false
      }
    ]
  })
}

export async function POST(req: Request) {
  const body = await req.json()
  return NextResponse.json({ success: true, card: { ...body, _id: 'v' + Math.random().toString(36).substr(2, 9), amountSpent: 0, paused: false } })
}
