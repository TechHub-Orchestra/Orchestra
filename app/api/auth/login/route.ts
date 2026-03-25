import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { email, password } = await req.json()
  if (email === 'demo@orchestra.ng' && password === 'demo1234') {
    return NextResponse.json({ success: true, user: { name: 'Demo User', email: 'demo@orchestra.ng' } })
  }
  return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 })
}
