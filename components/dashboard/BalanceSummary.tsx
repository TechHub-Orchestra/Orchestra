'use client'
import { useEffect, useState } from 'react'
import { toNaira } from '@/utils/format'
import { fetchWithAuth } from '@/lib/fetch-utils'
import CardWidget from '@/components/cards/CardWidget'
import { useCurrentUser } from '@/hooks/useAuth'

interface SummaryData {
  total: number
  active: number
  cardCount: number
}

export default function BalanceSummary() {
  const { data: user } = useCurrentUser()
  const [data, setData] = useState<SummaryData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchWithAuth('/api/cards')
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
      <div className="bg-[#1A1A2E] rounded-2xl p-6 text-white col-span-2 relative overflow-hidden">
        {/* Background circuit pattern like Ultimate Card */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <svg width="100%" height="100%" viewBox="0 0 400 150">
            <path d="M0 50 H100 L150 20 H250 L300 50 H400" stroke="#4F46E5" fill="none" strokeWidth="1" />
            <path d="M0 100 H120 L170 130 H280 L330 100 H400" stroke="#4F46E5" fill="none" strokeWidth="1" />
          </svg>
        </div>
        <div className="relative z-10">
          <p className="text-white/60 text-sm mb-2">Total Balance Across All Cards</p>
          <p className="text-4xl font-bold">{toNaira(data?.total ?? 0)}</p>
          <p className="text-white/60 text-sm mt-2">{data?.active ?? 0} active cards</p>
        </div>
      </div>
      
      <div className="flex flex-col md:col-span-1">
        <div className="h-full flex flex-col justify-center">
          <CardWidget 
            card={{
              _id: 'ultimate_summary',
              cardStatus: '1',
              isUltimate: true,
              label: 'Orchestra Ultimate',
              nameOnCard: user?.name || 'ORCHESTRA USER'
            }}
            hideBalance={true}
            hideActions={true}
            showRevealOnly={true}
          />
        </div>
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
