import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    cards: [
      {
        _id: 'b1',
        label: 'Q1 Field Sales Trip',
        department: 'Sales',
        cardHolder: 'John Doe',
        availableBalance: 8250000,
        spendLimit: 15000000,
        amountSpent: 6750000,
        cardStatus: '1'
      },
      {
        _id: 'b2',
        label: 'Tech Operations',
        department: 'Engineering',
        cardHolder: 'Jane Smith',
        availableBalance: 12000000,
        spendLimit: 20000000,
        amountSpent: 8000000,
        cardStatus: '1'
      }
    ]
  })
}
