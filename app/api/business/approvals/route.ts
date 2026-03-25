import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    requests: [
      {
        _id: 'a1',
        amount: 4500000,
        merchant: 'Uber Nigeria',
        requestedBy: 'Field Sales Team',
        reason: 'Monthly transport allowance'
      },
      {
        _id: 'a2',
        amount: 1520000,
        merchant: 'Interswitch Store',
        requestedBy: 'Technical Ops',
        reason: 'Office equipment purchase'
      }
    ]
  })
}
