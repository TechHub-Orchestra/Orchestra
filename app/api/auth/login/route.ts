import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { generateToken } from '@/lib/auth-utils'

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()

    const users = db.get('users')
    const user = users.find(u => u.email === email)

    if (!user) {
      return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 })
    }

    const isValid = Buffer.from(password).toString('base64') === user.password
    if (!isValid) {
      return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 })
    }

    const token = generateToken(user)
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({ success: true, token, user: userWithoutPassword })
  } catch (err) {
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 })
  }
}
