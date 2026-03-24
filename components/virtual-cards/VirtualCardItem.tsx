'use client'
import { percentUsed, toNaira } from '@/utils/format'

interface VirtualCard {
  _id: string
  label: string
  merchant?: string
  amountSpent: number
  spendLimit: number
  paused?: boolean
  autoRenew?: boolean
}

interface VirtualCardItemProps {
  card: VirtualCard
  onPause: (id: string) => void
  onResume: (id: string) => void
  onDelete: (id: string) => void
}

export default function VirtualCardItem({ card, onPause, onResume, onDelete }: VirtualCardItemProps) {
  const pct = percentUsed(card.amountSpent, card.spendLimit)

  return (
    <div className={`rounded-2xl border bg-white p-5 transition ${card.paused ? 'opacity-60' : ''}`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">Virtual</span>
          <h3 className="font-bold text-[#1A1A2E] mt-2">{card.label}</h3>
          {card.merchant && <p className="text-xs text-gray-400">{card.merchant}</p>}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => card.paused ? onResume(card._id) : onPause(card._id)}
            className={`text-xs px-3 py-1.5 rounded-lg font-medium transition ${
              card.paused
                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
            }`}
          >
            {card.paused ? 'Resume' : 'Pause'}
          </button>
          <button
            onClick={() => onDelete(card._id)}
            className="text-xs px-3 py-1.5 rounded-lg font-medium bg-red-100 text-red-700 hover:bg-red-200 transition"
          >
            Delete
          </button>
        </div>
      </div>

      {/* Spend progress */}
      <div className="mb-2">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>{toNaira(card.amountSpent)} spent</span>
          <span>Limit: {toNaira(card.spendLimit)}</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              pct >= 90 ? 'bg-red-500' : pct >= 70 ? 'bg-amber-400' : 'bg-green-500'
            }`}
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-400 mt-0.5">
          <span>{pct}% used</span>
          <span>{toNaira(card.spendLimit - card.amountSpent)} left</span>
        </div>
      </div>

      <p className="text-xs text-gray-400">
        Auto-renew: {card.autoRenew ? '✓ On' : '✗ Off'} ·{' '}
        Status: <span className={card.paused ? 'text-amber-600' : 'text-green-600'}>{card.paused ? 'Paused' : 'Active'}</span>
      </p>
    </div>
  )
}
