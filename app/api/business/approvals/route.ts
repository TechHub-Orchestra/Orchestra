import { NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth-utils'

export async function GET(req: Request) {
  const user = await verifyAuth(req)
  if (!user) return NextResponse.json({ success: false }, { status: 401 })

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
