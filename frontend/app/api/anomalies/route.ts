import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyAuth } from '@/lib/auth-utils'

export async function GET(req: Request) {
  const user = await verifyAuth(req)
  if (!user) return NextResponse.json({ success: false }, { status: 401 })

  const anomalies = db.get('anomalies').filter(a => a.userId === user._id)

  return NextResponse.json({
    success: true,
    anomalies
  })
}
