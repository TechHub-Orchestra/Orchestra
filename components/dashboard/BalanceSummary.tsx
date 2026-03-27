'use client'
import { useEffect, useState } from 'react'
import { toNaira } from '@/utils/format'
import { fetchWithAuth } from '@/lib/fetch-utils'

interface SummaryData {
  total: number
  active: number
  cardCount: number
}

export default function BalanceSummary() {
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
      
      <div className="bg-[#1A1A2E] rounded-2xl p-6 text-white relative overflow-hidden ring-1 ring-blue-500/30">
        {/* Ultimate Card Visual Style */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1A1A2E] via-[#16213E] to-[#1A1A2E] opacity-100" />
        <div className="absolute inset-0 opacity-40 pointer-events-none overflow-hidden">
          <svg width="100%" height="100%" viewBox="0 0 200 150">
            <path d="M0 60 H50 L80 30 H150 L180 60 H200" stroke="#4F46E5" fill="none" strokeWidth="1" />
            <path d="M0 90 H60 L90 120 H160 L190 90 H200" stroke="#4F46E5" fill="none" strokeWidth="1" />
            <circle cx="80" cy="30" r="2" fill="#60A5FA" />
            <circle cx="150" cy="30" r="2" fill="#60A5FA" />
          </svg>
        </div>
        
        <div className="relative z-10 h-full flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-5 h-5 rounded-full border-2 border-white/30 flex items-center justify-center p-0.5">
                <div className="w-full h-full border border-white/20 rounded-full" />
              </div>
              <span className="text-white font-bold text-xs tracking-tight">Orchestra Ultimate</span>
            </div>
            <p className="text-white/80 text-xs font-medium">Programmable Routing</p>
          </div>
          <div className="mt-4">
            <p className="text-xl font-bold">Active Engine</p>
            <p className="text-white/60 text-[10px] uppercase tracking-widest mt-1">Multi-Bank Unified</p>
          </div>
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
