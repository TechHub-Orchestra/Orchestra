'use client'
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
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { toNaira } from '@/utils/format'

interface Card {
  _id: string
  label?: string
  nameOnCard?: string
  bank?: string
  color?: string
  availableBalance?: number
}

function SortableCard({ card }: { card: Card }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: card._id })
  const style = { transform: CSS.Transform.toString(transform), transition }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`flex items-center gap-3 bg-gray-50 rounded-xl p-3.5 border-2 border-transparent
        hover:border-[#E94560]/30 transition cursor-grab active:cursor-grabbing select-none
        ${isDragging ? 'shadow-lg scale-[1.02] bg-white border-[#E94560]/50 z-50' : ''}`}
    >
      <span className="text-gray-400 text-lg leading-none">⠿</span>
      <div
        className="w-3 h-3 rounded-full flex-shrink-0"
        style={{ background: card.color || '#1A1A2E' }}
      />
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm text-[#1A1A2E] truncate">{card.label || card.nameOnCard}</p>
        <p className="text-xs text-gray-400">{card.bank}</p>
      </div>
      <p className="text-sm font-semibold text-[#1A1A2E]">{toNaira(card.availableBalance ?? 0)}</p>
    </div>
  )
}

interface CardPriorityListProps {
  cards: Card[]
  onReorder: (cards: Card[]) => void
}

export default function CardPriorityList({ cards, onReorder }: CardPriorityListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (over && active.id !== over.id) {
      const oldIndex = cards.findIndex(c => c._id === active.id)
      const newIndex = cards.findIndex(c => c._id === over.id)
      onReorder(arrayMove(cards, oldIndex, newIndex))
    }
  }

  if (cards.length === 0) {
    return <p className="text-center text-gray-400 text-sm py-8">No cards to prioritise</p>
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={cards.map(c => c._id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-2">
          {cards.map(card => (
            <SortableCard key={card._id} card={card} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  )
}
