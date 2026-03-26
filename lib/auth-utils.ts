import { db } from './db'

export async function verifyAuth(req: Request) {
  const authHeader = req.headers.get('authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }
  const token = authHeader.split(' ')[1]
  try {
    const jsonStr = Buffer.from(token, 'base64').toString('utf-8')
    const decoded = JSON.parse(jsonStr)
    const users = db.get('users')
    const user = users.find(u => u._id === decoded.id)
    if (!user) return null
    return user
  } catch (err) {
    return null
  }
}

export function generateToken(user: any) {
  const payload = JSON.stringify({ id: user._id, email: user.email, exp: Date.now() + 7 * 24 * 60 * 60 * 1000 })
  return Buffer.from(payload).toString('base64')
}
