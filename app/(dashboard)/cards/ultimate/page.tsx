'use client'
import { useEffect, useState, useCallback } from 'react'
import TransactionSimulator from '@/components/routing/TransactionSimulator'
import RoutingModeSelector from '@/components/routing/RoutingModeSelector'
import CardPriorityList from '@/components/routing/CardPriorityList'
import UltimateCardPanel from '@/components/routing/UltimateCardPanel'
import toast from 'react-hot-toast'

interface Card {
  _id: string
  label?: string
  nameOnCard?: string
  bank?: string
  color?: string
  availableBalance?: number
}

export default function UltimateCardPage() {
  const [cards, setCards] = useState<Card[]>([])
  const [mode, setMode] = useState('auto-split')
  const [orderedCards, setOrderedCards] = useState<Card[]>([])

  const fetchCards = useCallback(async () => {
    try {
      const res = await fetch('/api/cards')
      const data = await res.json()
      const active = (data.cards || []).filter((c: { cardStatus: string }) => c.cardStatus === '1')
      setCards(active)
      setOrderedCards(active)
    } catch {}
  }, [])

  useEffect(() => { fetchCards() }, [fetchCards])

  async function handleModeChange(newMode: string) {
    setMode(newMode)
    try {
      await fetch('/api/routing/mode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: newMode }),
      })
      toast.success(`Routing set to ${newMode.replace('-', ' ')}`)
    } catch {
      toast.error('Failed to save routing mode')
    }
  }

  async function handleReorder(reordered: Card[]) {
    setOrderedCards(reordered)
    try {
      await fetch('/api/routing/priority', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cardIds: reordered.map(c => c._id) }),
      })
      toast.success('Card priority updated')
    } catch {
      toast.error('Failed to save priority')
    }
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-dark">Ultimate Card</h1>
        <p className="text-gray-500 text-sm mt-1">Configure how Orchestra routes your payments across cards</p>
      </div>

      <div className="mb-8">
        <UltimateCardPanel
          totalAvailable={cards.reduce((acc, c) => acc + (c.availableBalance || 0), 0)}
          totalLimit={cards.reduce((acc, c) => acc + (c.availableBalance || 0) + 50000000, 0)} // Mock limit
          numCards={cards.length}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left column */}
        <div className="space-y-6">
          {/* Routing Mode */}
          <div className="bg-white rounded-2xl border p-6">
            <h2 className="font-bold text-dark mb-4">Routing Mode</h2>
            <RoutingModeSelector selected={mode} onChange={handleModeChange} />
          </div>

          {/* Card Priority */}
          <div className="bg-white rounded-2xl border p-6">
            <h2 className="font-bold text-dark mb-1">Card Priority</h2>
            <p className="text-xs text-gray-500 mb-4">Drag to reorder — highest priority first</p>
            <CardPriorityList cards={orderedCards} onReorder={handleReorder} />
          </div>
        </div>

        {/* Right column — Simulator */}
        <TransactionSimulator />
      </div>
    </div>
  )
}
