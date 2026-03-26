'use client'
import { useState, useMemo } from 'react'
import CardWidget from './CardWidget'
import CardActions from './CardActions'
import EmptyState from '@/components/shared/EmptyState'
import AddCardModal from './AddCardModal'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  horizontalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

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
  isUltimate?: boolean
}

function SortableCard({ id, card, balance, isSelected, onClick, onBlock, onUnblock, onDelete }: any) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ 
    id,
    disabled: card.isUltimate // Disable dragging for Ultimate card
  })
  
  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 0,
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="flex-shrink-0 snap-center">
      <CardWidget
        card={card}
        balance={balance}
        isSelected={isSelected}
        onClick={onClick}
        onBlock={onBlock}
        onUnblock={onUnblock}
        onDelete={onDelete}
        isDraggable={!card.isUltimate}
      />
    </div>
  )
}

interface CardGridProps {
  cards: Card[]
  onRefresh: () => void
}

export default function CardGrid({ cards, onRefresh }: CardGridProps) {
  // Split localCards into ultimate and physical
  const ultimateCardData = useMemo(() => {
    return {
      _id: 'ultimate_card_001',
      label: 'Orchestra Ultimate',
      cardStatus: '1',
      isUltimate: true,
      availableBalance: cards.reduce((acc, c) => acc + (c.availableBalance || 0), 0)
    }
  }, [cards])

  const [physicalCards, setPhysicalCards] = useState<Card[]>(cards)
  const [selectedId, setSelectedId] = useState<string | null>(ultimateCardData._id)
  const [showAdd, setShowAdd] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const selectedCard = selectedId === ultimateCardData._id 
    ? ultimateCardData 
    : physicalCards.find(c => c._id === selectedId)

  function handleStatusChange(cardId: string, newStatus: string) {
    if (cardId === 'ultimate_card_001') return // Manage ultimate status separately if needed
    setPhysicalCards(cs => cs.map(c => c._id === cardId ? { ...c, cardStatus: newStatus } : c))
  }

  function handleBlock(id: string) {
    handleStatusChange(id, '2')
  }

  function handleUnblock(id: string) {
    handleStatusChange(id, '1')
  }

  function handleDelete(id: string) {
    if (!confirm('Are you sure you want to remove this card?')) return
    setPhysicalCards(cs => cs.filter(c => c._id !== id))
    if (selectedId === id) setSelectedId(null)
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (over && active.id !== over.id) {
      setPhysicalCards((items) => {
        const oldIndex = items.findIndex(i => i._id === active.id)
        const newIndex = items.findIndex(i => i._id === over.id)
        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }

  return (
    <div className="space-y-8">
      {/* Top Section: Ultimate Card */}
      <section className="flex flex-col items-center">
        <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 self-start">Master Orchestration</h2>
        <div className="w-full max-w-lg">
          <CardWidget
            card={ultimateCardData}
            balance={ultimateCardData.availableBalance}
            isSelected={selectedId === ultimateCardData._id}
            onClick={() => setSelectedId(ultimateCardData._id)}
            onBlock={() => {}}
            onUnblock={() => {}}
            onDelete={() => {}}
            isDraggable={false}
          />
        </div>
      </section>

      <div className="h-px bg-gray-100 mx-[-20px]" />

      {/* Bottom Section: Physical Cards */}
      <section className="pt-2">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Physical Cards</h2>
          <span className="text-xs font-medium text-gray-400">{physicalCards.length} Cards Connected</span>
        </div>
        
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <div className="flex gap-6 overflow-x-auto pb-6 snap-x snap-mandatory scrollbar-hide">
            <SortableContext items={physicalCards.map(c => c._id)} strategy={horizontalListSortingStrategy}>
              {physicalCards.map(card => (
                <SortableCard
                  key={card._id}
                  id={card._id}
                  card={card}
                  balance={card.availableBalance}
                  isSelected={selectedId === card._id}
                  onClick={() => setSelectedId(card._id)}
                  onBlock={handleBlock}
                  onUnblock={handleUnblock}
                  onDelete={handleDelete}
                />
              ))}
            </SortableContext>

            <button
              onClick={() => setShowAdd(true)}
              className="flex-shrink-0 snap-center rounded-[24px] border-2 border-dashed border-gray-300 flex flex-col items-center justify-center gap-2 text-gray-400 hover:border-[#E94560] hover:text-[#E94560] transition bg-gray-50/50"
              style={{ height: '215px', width: '215px' }}
            >
              <div className="w-14 h-14 rounded-full bg-gray-200/50 flex items-center justify-center text-3xl font-light">+</div>
              <p className="text-sm font-bold tracking-tight">Add New Card</p>
            </button>
          </div>
        </DndContext>
      </section>

      {/* Selected card actions */}
      {selectedCard && (
        <div className="bg-white rounded-2xl border p-5">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="font-bold text-[#1A1A2E]">{selectedCard.label || selectedCard.nameOnCard}</h3>
              <p className="text-gray-500 text-sm">{selectedCard.isUltimate ? 'Master Card' : `${selectedCard.bank} · ${selectedCard.cardProgram}`}</p>
            </div>
          </div>
          {!selectedCard.isUltimate && (
            <CardActions
              cardId={selectedCard._id}
              cardStatus={selectedCard.cardStatus}
              onStatusChange={s => handleStatusChange(selectedCard._id, s)}
            />
          )}
          {selectedCard.isUltimate && (
            <div className="bg-blue-50 p-4 rounded-xl flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">✨</div>
              <div>
                <p className="text-sm font-bold text-blue-900">Ultimate Orchestration Active</p>
                <p className="text-xs text-blue-700">This card automatically routes transactions to your prioritized physical cards.</p>
              </div>
            </div>
          )}
        </div>
      )}

      <AddCardModal open={showAdd} onClose={() => setShowAdd(false)} onAdded={onRefresh} />
    </div>
  )
}
