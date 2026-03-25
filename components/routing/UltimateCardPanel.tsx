'use client'
import { toNaira } from '@/utils/format'
import { motion } from 'framer-motion'
import { ShieldCheck, Zap, Layers } from 'lucide-react'

interface UltimateCardPanelProps {
  totalLimit: number
  totalAvailable: number
  numCards: number
}

export default function UltimateCardPanel({
  totalLimit,
  totalAvailable,
  numCards
}: UltimateCardPanelProps) {
  const percentSpent = ((totalLimit - totalAvailable) / totalLimit) * 100

  return (
    <div className="bg-dark rounded-3xl p-6 text-white shadow-2xl relative overflow-hidden group">
      {/* Decorative patterns */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-brand/10 rounded-full blur-3xl -mr-24 -mt-12 group-hover:bg-brand/20 transition-all duration-700" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -ml-16 -mb-8" />

      {/* Content */}
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-10">
          <div>
            <h3 className="text-white/60 text-xs font-bold uppercase tracking-widest mb-1.5 flex items-center gap-2">
              <Layers size={14} className="text-brand" />
              Unified Spending Pool
            </h3>
            <p className="text-3xl font-black">{toNaira(totalAvailable)}</p>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-bold text-white/40 uppercase tracking-tighter">Connected Banks</span>
            <div className="flex items-center gap-1.5 justify-end">
              <span className="text-lg font-black">{numCards}</span>
              <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-[11px] font-bold text-white/40 mb-2">
            <span>USED: {toNaira(totalLimit - totalAvailable)}</span>
            <span>TOTAL: {toNaira(totalLimit)}</span>
          </div>
          <div className="h-2.5 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${percentSpent}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="h-full bg-linear-to-r from-brand to-[#FF6B6B] rounded-full"
            />
          </div>
        </div>

        {/* Features Row */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/5 rounded-2xl p-4 border border-white/10 flex flex-col gap-2 hover:bg-white/10 transition-colors">
            <ShieldCheck size={20} className="text-green-400" />
            <p className="font-bold text-sm leading-tight">Fraud Protection</p>
            <p className="text-[10px] text-white/40 leading-snug font-medium">Auto-detection active across all linked wallets</p>
          </div>
          <div className="bg-white/5 rounded-2xl p-4 border border-white/10 flex flex-col gap-2 hover:bg-white/10 transition-colors">
            <Zap size={20} className="text-brand" />
            <p className="font-bold text-sm leading-tight">Instant Routing</p>
            <p className="text-[10px] text-white/40 leading-snug font-medium">Automatic multi-card optimization active</p>
          </div>
        </div>
      </div>
    </div>
  )
}
