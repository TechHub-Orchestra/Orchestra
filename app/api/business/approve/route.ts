import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyAuth } from '@/lib/auth-utils'

export async function POST(req: Request) {
  const user = await verifyAuth(req)
  if (!user || user.role !== 'business') return NextResponse.json({ success: false }, { status: 403 })

  const { requestId, action, note } = await req.json()
  let result: any = null

  db.update('expenseRequests', (reqs) => reqs.map(r => {
    if (r._id === requestId && r.businessUserId === user._id) {
      result = { ...r, status: action === 'approve' ? 'approved' : 'rejected', note, processedAt: new Date().toISOString() }
      return result
    }
    return r
  }))

  if (!result) return NextResponse.json({ success: false, message: 'Request not found' }, { status: 404 })
  return NextResponse.json({ success: true, processedRequest: result })
}
