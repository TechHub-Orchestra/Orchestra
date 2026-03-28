'use client'
import { CheckCircle2, ChevronRight, Sparkles } from 'lucide-react'

interface RecommendationCardProps {
  title: string
  description: string
  impact: string
  actionLabel?: string
  onAction?: () => void
}

export default function RecommendationCard({
  title, description, impact, actionLabel = 'Take Action', onAction
}: RecommendationCardProps) {
  return (
    <div className="bg-white border hover:border-brand/50 transition rounded-2xl p-5 group flex flex-col h-full shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-brand/10 flex items-center justify-center text-brand">
          <Sparkles size={16} />
        </div>
        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">AI Suggestion</span>
      </div>

      <h3 className="font-bold text-dark text-lg mb-2">{title}</h3>
      <p className="text-gray-500 text-sm mb-6 grow leading-relaxed">{description}</p>

      <div className="mt-auto py-3 px-4 bg-green-50 rounded-xl mb-4 flex items-center gap-3">
        <CheckCircle2 size={16} className="text-green-600" />
        <p className="text-xs font-semibold text-green-700">Estimated Impact: {impact}</p>
      </div>

      <button
        onClick={onAction}
        className="w-full flex items-center justify-center gap-2 bg-dark text-white py-3 rounded-xl text-sm font-semibold hover:bg-brand transition-all group-hover:shadow-lg"
      >
        {actionLabel}
        <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  )
}
