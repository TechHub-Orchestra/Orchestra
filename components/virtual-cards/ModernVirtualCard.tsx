'use client'
import { motion } from 'framer-motion'
import { toNaira } from '@/utils/format'

interface ModernVirtualCardProps {
  card: {
    _id: string
    label: string
    merchant?: string
    amountSpent: number
    spendLimit: number
    paused?: boolean
    color?: string
    last4?: string
    expiry?: string
    cvv?: string
  }
  isSelected?: boolean
  onClick?: () => void
}

export default function ModernVirtualCard({ card, isSelected, onClick }: ModernVirtualCardProps) {
  const isPaused = card.paused
  const bgColor = card.color || '#0052FF' // Default blue from image

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`relative w-full aspect-[1.6/1] rounded-3xl overflow-hidden cursor-pointer shadow-xl transition-all duration-300
        ${isSelected ? 'ring-4 ring-white ring-offset-4 ring-offset-[#1A1A2E]' : ''}
        ${isPaused ? 'grayscale-[0.8] opacity-70' : ''}`}
      style={{
        background: `linear-gradient(135deg, ${bgColor} 0%, ${adjustColor(bgColor, -30)} 100%)`,
      }}
    >
      {/* Grid Pattern Overlay */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
        }}
      />

      {/* Content Container */}
      <div className="relative h-full w-full p-8 flex flex-col justify-between text-white">
        {/* Top Section */}
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <p className="text-[10px] font-bold tracking-[0.2em] opacity-80 uppercase">
              Virtual Subscription
            </p>
            <h3 className="text-2xl font-bold tracking-tight">
              {card.label || 'New Card'}
            </h3>
          </div>

          {/* Orchestra Logo Badge */}
          <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-full flex items-center gap-2">
            <div className="flex gap-0.5">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-1 bg-white rounded-full" style={{ height: `${i * 4 + 4}px` }} />
              ))}
            </div>
            <span className="text-[10px] font-black tracking-widest uppercase">Orchestra</span>
          </div>
        </div>

        {/* PAN Section */}
        <div className="flex gap-6 items-center">
          <div className="flex gap-2">
            {[1, 2, 3].map(group => (
              <div key={group} className="flex gap-1.5">
                {[1, 2, 3, 4].map(dot => (
                  <div key={dot} className="w-2 h-2 rounded-full bg-white opacity-90 shadow-sm" />
                ))}
              </div>
            ))}
          </div>
          <span className="text-2xl font-mono tracking-wider text-white/90">
            {card.last4 || '1234'}
          </span>
        </div>

        {/* Bottom Section */}
        <div className="flex justify-between items-end">
          <div className="flex gap-8">
            <div className="space-y-1">
              <p className="text-[9px] font-bold tracking-widest opacity-60 uppercase">Expiry</p>
              <p className="text-sm font-bold font-mono tracking-wider">{card.expiry || '12/28'}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[9px] font-bold tracking-widest opacity-60 uppercase">CVV</p>
              <p className="text-sm font-bold font-mono tracking-wider">***</p>
            </div>
          </div>

          {/* Network Logo (Mastercard) */}
          <div className="relative w-12 h-8 flex items-center justify-center bg-white/10 backdrop-blur-sm rounded-lg p-1 px-2 border border-white/10">
            <div className="relative flex -space-x-4">
              <div className="w-6 h-6 rounded-full bg-[#EB001B] opacity-90" />
              <div className="w-6 h-6 rounded-full bg-[#F79E1B] mix-blend-screen" />
            </div>
          </div>
        </div>
      </div>

      {/* Paused Overlay */}
      {isPaused && (
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center">
          <div className="bg-white text-black px-6 py-2 rounded-full text-sm font-bold shadow-2xl flex items-center gap-2">
            <span>PAUSED</span>
          </div>
        </div>
      )}
    </motion.div>
  )
}

// Helper to adjust color for gradient
function adjustColor(hex: string, percent: number) {
  const num = parseInt(hex.replace('#', ''), 16)
  const amt = Math.round(2.55 * percent)
  const R = (num >> 16) + amt
  const G = (num >> 8 & 0x00FF) + amt
  const B = (num & 0x0000FF) + amt
  return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 + (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 + (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1)
}
