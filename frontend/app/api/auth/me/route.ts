import { NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth-utils'

export async function GET(req: Request) {
  const user = await verifyAuth(req)
  if (!user) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
  }
  const { password, ...userWithoutPassword } = user
  return NextResponse.json({ success: true, user: userWithoutPassword })
}
