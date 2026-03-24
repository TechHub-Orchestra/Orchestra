'use client'
import { useEffect, useState } from 'react'
import { toNaira } from '@/utils/format'

interface SummaryData {
  total: number
  active: number
  cardCount: number
}

export default function BalanceSummary() {
  const [data, setData] = useState<SummaryData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/cards')
      .then(r => r.json())
      .then(({ cards = [] }) => {
        const total = cards.reduce((s: number, c: { availableBalance?: number }) => s + (c.availableBalance || 0), 0)
        const active = cards.filter((c: { cardStatus: string }) => c.cardStatus === '1').length
        setData({ total, active, cardCount: cards.length })
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) return <BalanceSummarySkeleton />

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <div className="bg-[#1A1A2E] rounded-2xl p-6 text-white col-span-2">
        <p className="text-white/60 text-sm mb-2">Total Balance Across All Cards</p>
        <p className="text-4xl font-bold">{toNaira(data?.total ?? 0)}</p>
        <p className="text-white/60 text-sm mt-2">{data?.active ?? 0} active cards</p>
      </div>
      <div className="bg-[#E94560] rounded-2xl p-6 text-white">
        <p className="text-white/80 text-sm mb-2">Financial OS</p>
        <p className="text-2xl font-bold">{data?.cardCount ?? 0} Banks</p>
        <p className="text-white/80 text-sm mt-2">Unified in Orchestra</p>
      </div>
    </div>
  )
}

function BalanceSummarySkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 animate-pulse">
      <div className="bg-gray-200 rounded-2xl h-32 col-span-2" />
      <div className="bg-gray-200 rounded-2xl h-32" />
    </div>
  )
}
