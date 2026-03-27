'use client'
import { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { toNaira } from '@/utils/format'
import { fetchWithAuth } from '@/lib/fetch-utils'

interface SpendingDataPoint {
  month: string
  amount: number
}

export default function SpendingChart() {
  const [data, setData] = useState<SpendingDataPoint[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const r = await fetchWithAuth('/api/insights')
        const d = await r.json()
        if (r.ok && d.insights?.spendingByMonth) {
          setData(d.insights.spendingByMonth)
          return
        }
      } catch { /* fallthrough */ }

      // Fallback: build from real transactions
      try {
        const txRes = await fetchWithAuth('/api/transactions?limit=200')
        const txData = await txRes.json()
        const txs: any[] = txData.transactions || []
        
        const monthlySet: Record<string, number> = {}
        txs.forEach(tx => {
           if (tx.amount < 0) {
               const date = new Date(tx.date || tx.transactionDate || Date.now())
               const month = date.toLocaleString('default', { month: 'short' })
               monthlySet[month] = (monthlySet[month] || 0) + Math.abs(tx.amount)
           }
        })
        
        if (Object.keys(monthlySet).length === 0) {
           // Provide an empty array rather than mock data if no transactions
           setData([])
        } else {
           const mapArr = Object.entries(monthlySet).map(([month, amount]) => ({ month, amount: amount as number }))
           setData(mapArr.reverse()) // Just a simple ordering fix for the chart
        }
      } catch {
         setData([])
      } finally {
         setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return <div className="bg-gray-200 rounded-2xl h-48 animate-pulse" />
  }

  return (
    <div className="bg-white rounded-2xl border p-6">
      <h3 className="font-bold text-[#1A1A2E] mb-4">Monthly Spending</h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
          <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
          <YAxis tickFormatter={v => `₦${(v / 100000).toFixed(0)}k`} tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
          <Tooltip formatter={(v: any) => [toNaira(v), 'Spent']} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }} />
          <Bar dataKey="amount" fill="#E94560" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

