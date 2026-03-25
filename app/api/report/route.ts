import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    report: {
      transactions: [
        { date: new Date().toISOString(), merchant: 'Shoprite', category: 'shopping', amount: 1520000, reference: 'TX-12345', flagged: false },
        { date: new Date().toISOString(), merchant: 'Netflix', category: 'subscriptions', amount: 370000, reference: 'TX-67890', flagged: false },
        { date: new Date().toISOString(), merchant: 'Uber Nigeria', category: 'transport', amount: 450000, reference: 'TX-11223', flagged: true },
        { date: new Date().toISOString(), merchant: 'Interswitch Store', category: 'shopping', amount: 12500000, reference: 'TX-44556', flagged: false },
      ]
    }
  })
}
