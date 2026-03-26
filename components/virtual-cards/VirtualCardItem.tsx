'use client'
import { useState } from 'react'
import { percentUsed, toNaira } from '@/utils/format'
import ModernVirtualCard from './ModernVirtualCard'
import { Trash2, Pause, Play, Palette } from 'lucide-react'

interface VirtualCard {
  _id: string
  label: string
  merchant?: string
  amountSpent: number
  spendLimit: number
  paused?: boolean
  autoRenew?: boolean
  color?: string
}

interface VirtualCardItemProps {
  card: VirtualCard
  onPause: (id: string) => void
  onResume: (id: string) => void
  onDelete: (id: string) => void
}

const COLORS = ['#0052FF', '#E94560', '#1A1A2E', '#10B981', '#F59E0B', '#6366F1', '#8B5CF6']

export default function VirtualCardItem({ card, onPause, onResume, onDelete }: VirtualCardItemProps) {
  const [currentColor, setCurrentColor] = useState(card.color || COLORS[0])
  const pct = percentUsed(card.amountSpent, card.spendLimit)

  return (
    <div className="flex flex-col gap-4">
      <ModernVirtualCard 
        card={{ ...card, color: currentColor }} 
      />

      <div className="bg-white rounded-2xl border p-4 shadow-sm flex flex-col gap-4">
        {/* Progress & Info */}
        <div className="flex justify-between items-center mb-1">
          <p className="text-xs font-semibold text-gray-500">{toNaira(card.amountSpent)} spent of {toNaira(card.spendLimit)}</p>
          <p className="text-xs font-bold text-[#E94560]">{pct}%</p>
        </div>
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-[#E94560] transition-all duration-500" 
            style={{ width: `${pct}%` }} 
          />
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-gray-50">
          {/* Color Picker */}
          <div className="flex gap-1.5 items-center">
            {COLORS.map(c => (
              <button
                key={c}
                onClick={() => setCurrentColor(c)}
                className={`w-5 h-5 rounded-full border-2 transition-transform hover:scale-125
                  ${currentColor === c ? 'border-gray-400 scale-110' : 'border-transparent'}`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => card.paused ? onResume(card._id) : onPause(card._id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all
                ${card.paused 
                  ? 'bg-green-50 text-green-600 hover:bg-green-100' 
                  : 'bg-amber-50 text-amber-600 hover:bg-amber-100'}`}
            >
              {card.paused ? <Play size={14} /> : <Pause size={14} />}
              {card.paused ? 'Resume' : 'Pause'}
            </button>
            <button
              onClick={() => onDelete(card._id)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-red-50 text-red-600 hover:bg-red-100 transition-all font-mono"
            >
              <Trash2 size={14} />
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
