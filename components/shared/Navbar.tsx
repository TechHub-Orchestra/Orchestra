'use client'
import { Bell, Search } from 'lucide-react'
import AnomalyBadge from '@/components/dashboard/AnomalyBadge'

export default function Navbar() {
  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center px-6 gap-4 flex-shrink-0">
      {/* Search */}
      <div className="flex-1 max-w-xs relative">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search cards, transactions…"
          className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E94560]/30"
        />
      </div>

      <div className="ml-auto flex items-center gap-3">
        <AnomalyBadge />

        <button className="relative p-2 rounded-xl hover:bg-gray-50 transition">
          <Bell size={18} className="text-gray-600" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#E94560] rounded-full" />
        </button>

        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#E94560] to-[#1A1A2E] flex items-center justify-center text-white font-bold text-sm">
          D
        </div>
      </div>
    </header>
  )
}
