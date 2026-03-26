'use client'
import { Search, Filter, ArrowUpRight, ArrowDownLeft, CreditCard } from 'lucide-react'
import { toNaira } from '@/utils/format'
import { useState } from 'react'
import { cn } from '@/utils/cn'

const MOCK_TRANSACTIONS = [
  { id: 1, date: '2025-03-26T04:15:00Z', merchant: 'Shoprite Lekki', category: 'shopping', amount: -1520000, card: 'GTBank Salary', status: 'completed' },
  { id: 2, date: '2025-03-25T20:50:00Z', merchant: 'Netflix Subscription', category: 'subscriptions', amount: -370000, card: 'Orchestra Ultimate', status: 'completed' },
  { id: 3, date: '2025-03-25T14:30:00Z', merchant: 'Uber Nigeria', category: 'transport', amount: -450000, card: 'Access Main', status: 'completed' },
  { id: 4, date: '2025-03-21T09:00:00Z', merchant: 'Salary Credit', category: 'income', amount: 85000000, card: 'GTBank Salary', status: 'completed' },
  { id: 5, date: '2025-03-20T18:20:00Z', merchant: 'Interswitch Power', category: 'utilities', amount: -1200000, card: 'Zenith Business', status: 'completed' },
  { id: 6, date: '2025-03-19T13:45:00Z', merchant: 'Amazon.com', category: 'shopping', amount: -2450000, card: 'Orchestra Ultimate', status: 'completed' },
  { id: 7, date: '2025-03-18T10:15:00Z', merchant: 'Bolt Nigeria', category: 'transport', amount: -320000, card: 'GTBank Salary', status: 'completed' },
  { id: 8, date: '2025-03-17T15:55:00Z', merchant: 'Apple Services', category: 'subscriptions', amount: -150000, card: 'Orchestra Ultimate', status: 'completed' },
  { id: 9, date: '2025-03-16T12:00:00Z', merchant: 'Cowry Wise Transfer', category: 'savings', amount: -5000000, card: 'Access Main', status: 'completed' },
  { id: 10, date: '2025-03-15T11:30:00Z', merchant: 'Foodies Restaurant', category: 'food', amount: -850000, card: 'GTBank Salary', status: 'completed' },
]

export default function TransactionTable() {
  const [query, setQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const filtered = MOCK_TRANSACTIONS.filter(t => {
    const matchesQuery = t.merchant.toLowerCase().includes(query.toLowerCase()) || 
                         t.card.toLowerCase().includes(query.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || t.category === selectedCategory
    return matchesQuery && matchesCategory
  })

  return (
    <div className="bg-white rounded-2xl border shadow-sm flex flex-col min-h-[500px]">
      {/* Header / Search Area */}
      <div className="p-6 border-b flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search transactions..." 
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="pl-10 pr-4 py-2 bg-gray-50 border rounded-xl text-sm focus:ring-2 focus:ring-[#E94560] outline-none w-full md:w-64 transition-all"
          />
        </div>
        
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {['all', 'shopping', 'subscriptions', 'transport', 'income', 'utilities'].map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                "px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all",
                selectedCategory === cat 
                  ? "bg-[#E94560] text-white" 
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              )}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Table Area */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50">
              <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Transaction</th>
              <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Method/Card</th>
              <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest text-right">Amount</th>
              <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filtered.map((t) => (
              <tr key={t.id} className="hover:bg-gray-50/50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center text-lg shadow-sm border",
                      t.amount > 0 ? "bg-green-50 border-green-100 text-green-600" : "bg-white border-gray-100 text-[#1A1A2E]"
                    )}>
                      {t.amount > 0 ? <ArrowUpRight size={20} /> : <ArrowDownLeft size={20} />}
                    </div>
                    <div>
                      <p className="font-bold text-[#1A1A2E] text-sm group-hover:text-[#E94560] transition-colors">{t.merchant}</p>
                      <p className="text-xs text-gray-400 flex items-center gap-1.5 capitalize">
                        {t.category} · {new Date(t.date).toLocaleDateString('en-NG', { month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-5 rounded bg-gray-900 flex items-center justify-center text-[10px] text-white font-bold italic p-0.5">
                      <CreditCard size={12} className="opacity-70" />
                    </div>
                    <span className="text-xs font-semibold text-gray-600">{t.card}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <p className={cn(
                    "font-bold text-sm",
                    t.amount > 0 ? "text-green-600" : "text-[#1A1A2E]"
                  )}>
                    {t.amount > 0 ? '+' : ''}{toNaira(t.amount)}
                  </p>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-green-50 text-green-700 border border-green-100">
                    {t.status.toUpperCase()}
                  </span>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-20 text-center">
                  <div className="flex flex-col items-center gap-2 opacity-50">
                    <Search size={32} />
                    <p className="font-medium">No transactions found</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Footer / Pagination shim */}
      <div className="mt-auto p-4 border-t bg-gray-50/30 text-center">
        <p className="text-xs text-gray-400 font-medium">Showing {filtered.length} of {MOCK_TRANSACTIONS.length} results</p>
      </div>
    </div>
  )
}
