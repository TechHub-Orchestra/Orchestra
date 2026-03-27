'use client'
import { useEffect, useState } from 'react'
import AIInsightsPanel from '@/components/insights/AIInsightsPanel'
import SpendingBreakdown from '@/components/insights/SpendingBreakdown'
import SavingsCalculator from '@/components/insights/SavingsCalculator'
import AnomalyFeed from '@/components/insights/AnomalyFeed'
import RecommendationCard from '@/components/insights/RecommendationCard'
import LoadingSpinner from '@/components/shared/LoadingSpinner'
import toast from 'react-hot-toast'
import { fetchWithAuth } from '@/lib/fetch-utils'

interface InsightsData {
  insights: {
    byCategory: Record<string, number>
  }
}

export default function InsightsPage() {
  const [byCategory, setByCategory] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchWithAuth('/api/insights')
      .then(r => r.json())
      .then((d: InsightsData) => {
        setByCategory(d.insights?.byCategory || {})
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  async function downloadReport() {
    try {
      const res = await fetchWithAuth('/api/report?days=30')
      const { report } = await res.json()
      const rows = [
        ['Date', 'Merchant', 'Category', 'Amount (NGN)', 'Reference', 'Flagged'],
        ...(report?.transactions || []).map((t: {
          date: string; merchant: string; category: string;
          amount: number; reference: string; flagged: boolean
        }) => [
          new Date(t.date).toLocaleDateString('en-NG'),
          t.merchant,
          t.category,
          t.amount,
          t.reference,
          t.flagged ? 'Yes' : 'No',
        ])
      ]
      const csv = rows.map(r => r.join(',')).join('\n')
      const blob = new Blob([csv], { type: 'text/csv' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `orchestra-report-${new Date().toISOString().slice(0, 10)}.csv`
      a.click()
      URL.revokeObjectURL(url)
      toast.success('Report downloaded!')
    } catch {
      toast.error('Failed to download report')
    }
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-dark">AI Insights</h1>
          <p className="text-gray-500 text-sm mt-1">Smart analysis of your spending patterns</p>
        </div>
        <button
          onClick={downloadReport}
          className="bg-dark text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-dark-2 transition flex items-center gap-2"
        >
          ↓ Export Report
        </button>
      </div>

      {loading ? (
        <div className="py-16"><LoadingSpinner /></div>
      ) : (
        <div className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <AIInsightsPanel />
            </div>
            <div className="bg-white rounded-2xl border p-5 h-fit">
              <h3 className="font-bold text-gray-400 mb-4 flex items-center gap-2 text-sm uppercase tracking-wider">
                Live Anomaly Feed
              </h3>
              <AnomalyFeed />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <RecommendationCard
              title="Optimize Routing"
              description="You've reached 80% of your GTBank limit. Consider switching to 'Balance Optimized' routing to avoid declined transactions."
              impact="Avoid Declined Payments"
              actionLabel="Switch Mode"
            />
            <RecommendationCard
              title="Virtual Subscriptions"
              description="We detected a recurring Netflix payment on your main card. Moving this to a virtual card could save you 5% in fees."
              impact="₦1,500 monthly fees"
              actionLabel="Move to Virtual"
            />
            <RecommendationCard
              title="Salary Distribution"
              description="Your salary just hit! We suggest distributing 30% to your Access Bank account for better liquidity."
              impact="Better Liquidity"
              actionLabel="Distribute Now"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SpendingBreakdown byCategory={byCategory} />
            <SavingsCalculator byCategory={byCategory} />
          </div>
        </div>
      )}
    </div>
  )
}
