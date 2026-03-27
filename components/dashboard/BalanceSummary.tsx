'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus, Copy, Check, RefreshCw } from 'lucide-react'
import toast from 'react-hot-toast'
import { toNaira } from '@/utils/format'
import { fetchWithAuth } from '@/lib/fetch-utils'
import CardWidget from '@/components/cards/CardWidget'
import { useCurrentUser } from '@/hooks/useAuth'

interface SummaryData {
  total: number
  active: number
  cardCount: number
  cards: any[]
}

export default function BalanceSummary() {
  const { data: user } = useCurrentUser()
  const [data, setData] = useState<SummaryData | null>(null)
  const [loading, setLoading] = useState(true)
  const [copying, setCopying] = useState<string | null>(null)

  const fetchData = () => {
    setLoading(true)
    fetchWithAuth('/api/cards')
      .then(r => r.json())
      .then(({ cards = [] }) => {
        const total = cards.reduce((s: number, c: { availableBalance?: number }) => s + (c.availableBalance || 0), 0)
        const active = cards.filter((c: { cardStatus: string }) => c.cardStatus === '1').length
        setData({ total, active, cardCount: cards.length, cards })
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }

  useEffect(() => {
    fetchData()
  }, [])

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopying(id)
    setTimeout(() => setCopying(null), 2000)
    toast.success('Account number copied')
  }

  if (loading) return <BalanceSummarySkeleton />

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-[#1A1A2E] rounded-3xl p-8 text-white col-span-1 md:col-span-2 relative overflow-hidden flex flex-col justify-between min-h-[240px]">
        {/* Background circuit pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <svg width="100%" height="100%" viewBox="0 0 400 200">
            <path d="M0 50 H100 L150 20 H250 L300 50 H400" stroke="#4F46E5" fill="none" strokeWidth="1" />
            <path d="M0 150 H120 L170 180 H280 L330 150 H400" stroke="#4F46E5" fill="none" strokeWidth="1" />
            <circle cx="150" cy="20" r="2" fill="#4F46E5" />
            <circle cx="300" cy="50" r="2" fill="#4F46E5" />
          </svg>
        </div>

        <div className="relative z-10 flex justify-between items-start">
          <div>
            <p className="text-white/60 text-sm font-medium mb-1">Total Balance Across All Cards</p>
            <p className="text-5xl font-black tracking-tight">{toNaira(data?.total ?? 0)}</p>
            <p className="text-white/40 text-xs font-bold uppercase tracking-widest mt-2">
              {data?.active ?? 0} Active / {data?.cardCount ?? 0} Total Cards
            </p>
          </div>
          <Link href="/cards" className="w-12 h-12 bg-white/10 hover:bg-white/20 rounded-2xl flex items-center justify-center transition-all group">
            <Plus size={24} className="text-white group-hover:rotate-90 transition-transform duration-300" />
          </Link>
        </div>

        {/* Bank List with Account Numbers */}
        <div className="relative z-10 mt-8 pt-6 border-t border-white/10">
          <div className="flex flex-wrap gap-4">
            {data?.cards?.slice(0, 3).map((card: any) => (
              <div key={card._id} className="flex flex-col gap-1">
                <p className="text-[10px] font-black text-white/40 uppercase tracking-tighter">{card.bank}</p>
                <button 
                  onClick={() => copyToClipboard(card.accountNumber || '0123456789', card._id)}
                  className="flex items-center gap-2 bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg transition-colors group"
                >
                  <span className="text-xs font-mono font-bold text-white/90">
                    {card.accountNumber || '0123456789'}
                  </span>
                  {copying === card._id ? <Check size={12} className="text-green-400" /> : <Copy size={12} className="text-white/30 group-hover:text-white/60" />}
                </button>
              </div>
            ))}
            {data?.cards && data.cards.length > 3 && (
              <Link href="/cards" className="text-[10px] font-black text-[#E94560] uppercase self-end mb-1 hover:underline">
                +{data.cards.length - 3} More
              </Link>
            )}
          </div>
          
          <button 
            onClick={fetchData}
            className="absolute bottom-0 right-0 p-2 text-white/30 hover:text-white transition-colors"
            title="Refresh Balance"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>
      
      <div className="flex flex-col md:col-span-1">
        <div className="h-full flex flex-col">
          <div className="flex-1 flex items-center">
            <CardWidget 
              card={{
                _id: 'ultimate_summary',
                cardStatus: '1',
                isUltimate: true,
                label: 'Orchestra Ultimate',
                nameOnCard: user?.name || 'ORCHESTRA USER',
                pan: '4000123456789010',
                expiryDate: '1299'
              }}
              hideBalance={true}
              hideActions={true}
              showRevealOnly={true}
            />
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
