'use client'
import { motion } from 'framer-motion'
import { maskPAN, formatExpiry, toNaira } from '@/utils/format'

interface Card {
  _id: string
  pan?: string
  cardStatus: string
  cardProgram?: string
  nameOnCard?: string
  label?: string
  expiryDate?: string
  availableBalance?: number
  color?: string
  bank?: string
}

interface CardWidgetProps {
  card: Card
  balance?: number
  isSelected?: boolean
  onClick?: () => void
}

const NETWORK_LOGOS: Record<string, string> = {
  VERVE: 'VERVE',
  VISA: 'VISA',
  MASTERCARD: '◉◎',
}

export default function CardWidget({ card, balance, isSelected, onClick }: CardWidgetProps) {
  const isBlocked = card.cardStatus === '2'

  return (
    <motion.div
      whileHover={{ scale: isSelected ? 1.0 : 1.03 }}
      whileTap={{ scale: 0.98 }}
      animate={{ rotateY: isSelected ? 3 : 0 }}
      transition={{ duration: 0.3 }}
      onClick={onClick}
      className={`relative rounded-2xl p-6 cursor-pointer transition-all duration-300 select-none
        ${isSelected ? 'ring-4 ring-white ring-offset-2 shadow-2xl' : ''}
        ${isBlocked ? 'opacity-60 grayscale' : ''}`}
      style={{
        background: card.color || 'linear-gradient(135deg, #1A1A2E 0%, #16213E 100%)',
        minHeight: '200px',
        minWidth: '300px',
        maxWidth: '360px',
      }}
    >
      {/* Network */}
      <div className="absolute top-4 right-4 text-white font-bold text-sm opacity-80">
        {card.cardProgram ? (NETWORK_LOGOS[card.cardProgram] ?? card.cardProgram) : 'VERVE'}
      </div>

      {/* Bank label */}
      {card.bank && (
        <div className="absolute top-4 left-6">
          <p className="text-white/50 text-xs font-medium tracking-wider">{card.bank}</p>
        </div>
      )}

      {/* Chip */}
      <div className="w-10 h-7 bg-yellow-400/70 rounded-md mt-8 mb-5" />

      {/* PAN */}
      <p className="text-white font-mono text-base tracking-[0.2em] mb-5">
        {maskPAN(card.pan) ?? 'VIRT-XXXX'}
      </p>

      {/* Name + Expiry */}
      <div className="flex justify-between items-end">
        <div>
          <p className="text-white/50 text-[10px] mb-0.5 uppercase tracking-widest">Card Holder</p>
          <p className="text-white font-semibold text-sm">{card.nameOnCard || card.label || 'YOUR NAME'}</p>
        </div>
        <div className="text-right">
          <p className="text-white/50 text-[10px] mb-0.5 uppercase tracking-widest">Expires</p>
          <p className="text-white font-semibold text-sm">{formatExpiry(card.expiryDate) || '••/••'}</p>
        </div>
      </div>

      {/* Balance overlay */}
      {balance !== undefined && (
        <div className="absolute bottom-4 right-4 text-right">
          <p className="text-white/50 text-[10px]">Available</p>
          <p className="text-white font-bold text-sm">{toNaira(balance)}</p>
        </div>
      )}

      {/* Blocked badge */}
      {isBlocked && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="bg-red-600 text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-lg">
            BLOCKED
          </span>
        </div>
      )}
    </motion.div>
  )
}
