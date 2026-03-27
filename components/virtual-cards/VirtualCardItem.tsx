'use client'
import ModernVirtualCard from './ModernVirtualCard'

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
  onRefresh: () => void
}

export default function VirtualCardItem({ card, onPause, onResume, onDelete, onRefresh }: VirtualCardItemProps) {
  return (
    <ModernVirtualCard 
      card={card} 
      onPause={onPause}
      onResume={onResume}
      onDelete={onDelete}
      onTopUp={onRefresh}
    />
  )
}
