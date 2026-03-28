'use client'
import VirtualCardItem from './VirtualCardItem'
import EmptyState from '@/components/shared/EmptyState'
import { useState } from 'react'
import CreateVirtualCardModal from './CreateVirtualCardModal'
import toast from 'react-hot-toast'
import { fetchWithAuth } from '@/lib/fetch-utils'
import { useEffect } from 'react'

interface VirtualCard {
  _id: string
  label: string
  merchant?: string
  amountSpent: number
  spendLimit: number
  paused?: boolean
  autoRenew?: boolean
}

interface VirtualCardListProps {
  cards: VirtualCard[]
  onRefresh: () => void
}

export default function VirtualCardList({ cards, onRefresh }: VirtualCardListProps) {
  const [showCreate, setShowCreate] = useState(false)
  const [localCards, setLocalCards] = useState(Array.isArray(cards) ? cards : [])
  const [physicalCards, setPhysicalCards] = useState<any[]>([])

  useEffect(() => {
    setLocalCards(Array.isArray(cards) ? cards : [])
  }, [cards])

  useEffect(() => {
    fetchWithAuth('/api/cards')
      .then(r => r.json())
      .then(data => setPhysicalCards(Array.isArray(data.cards) ? data.cards : []))
      .catch(() => {})
  }, [])

  async function handlePause(id: string) {
    const res = await fetchWithAuth(`/api/virtual-cards/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'pause' }),
    })
    if (res.ok) {
      setLocalCards(cs => cs.map(c => c._id === id ? { ...c, paused: true } : c))
      toast.success('Card paused')
    } else toast.error('Failed to pause card')
  }

  async function handleResume(id: string) {
    const res = await fetchWithAuth(`/api/virtual-cards/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'resume' }),
    })
    if (res.ok) {
      setLocalCards(cs => cs.map(c => c._id === id ? { ...c, paused: false } : c))
      toast.success('Card resumed')
    } else toast.error('Failed to resume card')
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this virtual card?')) return
    const res = await fetchWithAuth(`/api/virtual-cards/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'delete' }),
    })
    if (res.ok) {
      setLocalCards(cs => cs.filter(c => c._id !== id))
      toast.success('Card deleted')
    } else toast.error('Failed to delete card')
  }

  if (localCards.length === 0) {
    return (
      <>
        <EmptyState
          title="No virtual cards"
          description="Create a dedicated card for Netflix, Spotify, or any subscription"
          action={{ label: 'Create Virtual Card', icon: '✦', onClick: () => setShowCreate(true) }}
        />
        <CreateVirtualCardModal open={showCreate} onClose={() => setShowCreate(false)} onCreated={onRefresh} />
      </>
    )
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {localCards.map(c => (
          <VirtualCardItem
            key={c._id}
            card={c}
            onPause={handlePause}
            onResume={handleResume}
            onDelete={handleDelete}
            onRefresh={onRefresh}
            physicalCards={physicalCards}
          />
        ))}
      </div>
      <CreateVirtualCardModal open={showCreate} onClose={() => setShowCreate(false)} onCreated={onRefresh} />
    </div>
  )
}
