'use client'
import { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { toNaira } from '@/utils/format'

interface SpendingDataPoint {
  month: string
  amount: number
}

export default function SpendingChart() {
  const [data, setData] = useState<SpendingDataPoint[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch or derive spending history from transactions
    fetch('/api/insights')
      .then(r => r.json())
      .then(d => {
        // Use mock data derived from insights if no dedicated endpoint
        const spending = d.insights?.spendingByMonth || generateMockData()
        setData(spending)
        setLoading(false)
      })
      .catch(() => {
        setData(generateMockData())
        setLoading(false)
      })
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
          <Tooltip formatter={(v: number) => [toNaira(v), 'Spent']} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }} />
          <Bar dataKey="amount" fill="#E94560" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

function generateMockData(): SpendingDataPoint[] {
  const months = ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb']
  return months.map(month => ({ month, amount: Math.floor(Math.random() * 15000000 + 3000000) }))
}
