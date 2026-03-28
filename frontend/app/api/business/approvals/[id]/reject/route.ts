import { NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth-utils'

export async function POST(req: Request) {
  const user = await verifyAuth(req)
  if (!user) return NextResponse.json({ success: false }, { status: 401 })

  return NextResponse.json({ success: true, status: 'rejected' })
}
