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
    
    // For Demo: Use DB lookup first, then fallback to token data
    // This supports newly registered users on read-only environments
    const users = db.get('users')
    let user = users.find(u => u._id === decoded.id)
    
    if (!user && decoded.email) {
      user = decoded
    }
    
    if (!user || (decoded.exp && Date.now() > decoded.exp)) return null
    return user
  } catch (err) {
    return null
  }
}

export function generateToken(user: any) {
  const payload = JSON.stringify({ 
    ...user,
    id: user._id, 
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000 
  })
  return Buffer.from(payload).toString('base64')
}
