'use client'
import { useEffect, useState } from 'react'
import { fetchWithAuth } from '@/lib/fetch-utils'

interface Insights {
  summary: string
  insights: string[]
  recommendations: string[]
  savingsOpportunity: number
}

export default function AIInsightsPanel() {
  const [data, setData] = useState<Insights | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchWithAuth('/api/insights')
      .then(r => r.json())
      .then(d => { setData(d.insights); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  if (loading) return <InsightsSkeleton />
  if (!data) return null

  return (
    <div className="space-y-6">
      {/* AI Summary */}
      <div className="bg-[#1A1A2E] text-white rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[#E94560]">✦</span>
          <p className="text-sm text-white/60 font-medium">AI Financial Summary</p>
        </div>
        <p className="text-lg leading-relaxed">{data.summary}</p>
      </div>

      {/* Insights + Recommendations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl p-5 border">
          <h3 className="font-bold text-[#1A1A2E] mb-4">Spending Insights</h3>
          <div className="space-y-3">
            {data.insights.map((insight, i) => (
              <div key={i} className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs flex items-center justify-center font-bold flex-shrink-0 mt-0.5">
                  {i + 1}
                </div>
                <p className="text-sm text-gray-700">{insight}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border">
          <h3 className="font-bold text-[#1A1A2E] mb-4">Recommendations</h3>
          <div className="space-y-3">
            {data.recommendations.map((rec, i) => (
              <div key={i} className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 text-xs flex items-center justify-center flex-shrink-0 mt-0.5">✓</div>
                <p className="text-sm text-gray-700">{rec}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Savings callout */}
      {data.savingsOpportunity > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-5">
          <p className="text-green-700 font-bold text-lg">
            ₦{data.savingsOpportunity.toLocaleString('en-NG')} potential monthly savings
          </p>
          <p className="text-green-600 text-sm mt-1">If you follow all {data.recommendations.length} recommendations above</p>
        </div>
      )}
    </div>
  )
}

function InsightsSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="bg-gray-800 rounded-2xl h-32" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-200 rounded-2xl h-48" />
        <div className="bg-gray-200 rounded-2xl h-48" />
      </div>
    </div>
  )
}
