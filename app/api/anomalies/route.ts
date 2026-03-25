import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    anomalies: [
      {
        merchant: 'Unauthorised Store Inc',
        anomalyReason: 'Large transaction for new merchant',
        severity: 'high'
      },
      {
        merchant: 'Apple Services',
        anomalyReason: 'Duplicate transaction within 30 seconds',
        severity: 'medium'
      }
    ]
  })
}
