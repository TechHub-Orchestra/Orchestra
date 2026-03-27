'use client'
import { useEffect, useState } from 'react'
import BalanceSummary from '@/components/dashboard/BalanceSummary'
import QuickStats from '@/components/dashboard/QuickStats'
import SpendingChart from '@/components/dashboard/SpendingChart'
import OnboardingFlow from '@/components/onboarding/OnboardingFlow'
import { fetchWithAuth } from '@/lib/fetch-utils'

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalCards: 3,
    virtualCards: 4,
    monthlySpend: 12450000,
    savedThisMonth: 85000,
  })
  const [showOnboarding, setShowOnboarding] = useState(false)

  useEffect(() => {
    const done = localStorage.getItem('orchestra_onboarded')
    if (!done) setShowOnboarding(true)
  }, [])

  useEffect(() => {
    // Hydrate stats from API
    Promise.all([
      fetchWithAuth('/api/cards').then(r => r.json()),
      fetchWithAuth('/api/virtual-cards').then(r => r.json()),
    ])
      .then(([cardsData, vcData]) => {
        setStats(s => ({
          ...s,
          totalCards: cardsData.cards?.length ?? s.totalCards,
          virtualCards: vcData.cards?.length ?? s.virtualCards,
        }))
      })
      .catch(() => {})
  }, [])

  return (
    <div className="max-w-6xl mx-auto">
      {showOnboarding && (
        <OnboardingFlow onComplete={() => setShowOnboarding(false)} />
      )}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1A1A2E]">Good morning 👋</h1>
        <p className="text-gray-500 text-sm mt-1">Here's your financial overview for today</p>
      </div>

      <BalanceSummary />
      <QuickStats {...stats} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SpendingChart />

        {/* Recent activity placeholder */}
        <div className="bg-white rounded-2xl border p-6">
          <h3 className="font-bold text-[#1A1A2E] mb-4">Recent Transactions</h3>
          <div className="space-y-3">
            {[
              { merchant: 'Shoprite', amount: -1520000, category: 'shopping', time: '2h ago' },
              { merchant: 'Netflix', amount: -370000, category: 'subscriptions', time: '1d ago' },
              { merchant: 'Uber Nigeria', amount: -450000, category: 'transport', time: '2d ago' },
              { merchant: 'Salary Credit', amount: 85000000, category: 'income', time: '5d ago' },
            ].map((tx, i) => (
              <div key={i} className="flex items-center gap-3 py-2 border-b last:border-0">
                <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-500 flex-shrink-0">
                  {tx.merchant[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-[#1A1A2E] truncate">{tx.merchant}</p>
                  <p className="text-xs text-gray-400 capitalize">{tx.category} · {tx.time}</p>
                </div>
                <p className={`font-semibold text-sm ${tx.amount > 0 ? 'text-green-600' : 'text-[#1A1A2E]'}`}>
                  {tx.amount > 0 ? '+' : ''}₦{Math.abs(tx.amount / 100).toLocaleString('en-NG', { minimumFractionDigits: 2 })}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
