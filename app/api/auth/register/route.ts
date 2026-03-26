import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { generateToken } from '@/lib/auth-utils'

export async function POST(req: Request) {
  try {
    const { name, email, password, role, businessName } = await req.json()

    const users = db.get('users')
    if (users.find(u => u.email === email)) {
      return NextResponse.json({ success: false, message: 'User already exists' }, { status: 400 })
    }

    const newUser = {
      _id: Math.random().toString(36).substr(2, 9),
      name,
      email,
      password: Buffer.from(password).toString('base64'),
      role: role || 'individual',
      businessName: role === 'business' ? businessName : undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    db.update('users', (u) => [...u, newUser])

    const token = generateToken(newUser)
    
    // Omitting password from return user object
    const { password: _, ...userWithoutPassword } = newUser

    return NextResponse.json({ success: true, token, user: userWithoutPassword }, { status: 201 })
  } catch (err) {
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 })
  }
}
