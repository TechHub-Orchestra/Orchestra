'use client'
import { useState } from 'react'
import CardWidget from './CardWidget'
import CardActions from './CardActions'
import EmptyState from '@/components/shared/EmptyState'
import AddCardModal from './AddCardModal'

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

interface CardGridProps {
  cards: Card[]
  onRefresh: () => void
}

export default function CardGrid({ cards, onRefresh }: CardGridProps) {
  const [selectedId, setSelectedId] = useState<string | null>(cards[0]?._id ?? null)
  const [showAdd, setShowAdd] = useState(false)
  const [localCards, setLocalCards] = useState(cards)

  const selectedCard = localCards.find(c => c._id === selectedId)

  function handleStatusChange(cardId: string, newStatus: string) {
    setLocalCards(cs => cs.map(c => c._id === cardId ? { ...c, cardStatus: newStatus } : c))
  }

  if (localCards.length === 0) {
    return (
      <>
        <EmptyState
          title="No cards linked yet"
          description="Link your first ATM card to start using Orchestra's smart routing"
          action={{ label: 'Add a Card', icon: '💳', onClick: () => setShowAdd(true) }}
        />
        <AddCardModal open={showAdd} onClose={() => setShowAdd(false)} onAdded={onRefresh} />
      </>
    )
  }

  return (
    <div>
      {/* Card carousel */}
      <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide mb-6">
        {localCards.map(card => (
          <div key={card._id} className="flex-shrink-0 snap-center">
            <CardWidget
              card={card}
              balance={card.availableBalance}
              isSelected={selectedId === card._id}
              onClick={() => setSelectedId(card._id)}
            />
          </div>
        ))}

        {/* Add card button */}
        <button
          onClick={() => setShowAdd(true)}
          className="flex-shrink-0 snap-center rounded-2xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center gap-2 text-gray-400 hover:border-[#E94560] hover:text-[#E94560] transition"
          style={{ minHeight: '200px', minWidth: '200px' }}
        >
          <span className="text-3xl">+</span>
          <span className="text-sm font-medium">Add Card</span>
        </button>
      </div>

      {/* Selected card actions */}
      {selectedCard && (
        <div className="bg-white rounded-2xl border p-5">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="font-bold text-[#1A1A2E]">{selectedCard.label || selectedCard.nameOnCard}</h3>
              <p className="text-gray-500 text-sm">{selectedCard.bank} · {selectedCard.cardProgram}</p>
            </div>
          </div>
          <CardActions
            cardId={selectedCard._id}
            cardStatus={selectedCard.cardStatus}
            onStatusChange={s => handleStatusChange(selectedCard._id, s)}
          />
        </div>
      )}

      <AddCardModal open={showAdd} onClose={() => setShowAdd(false)} onAdded={onRefresh} />
    </div>
  )
}
