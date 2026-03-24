'use client'
import { useState, useEffect, useCallback } from 'react'
import { toNaira } from '@/utils/format'

const CATEGORIES = ['food', 'transport', 'subscriptions', 'utilities', 'entertainment', 'shopping']

interface SavingsCalculatorProps {
  byCategory: Record<string, number>
}

interface SavingsResult {
  monthlySavings: number
  annualSavings: number
}

export default function SavingsCalculator({ byCategory }: SavingsCalculatorProps) {
  const [adjustments, setAdjustments] = useState<Record<string, number>>(
    Object.fromEntries(CATEGORIES.map(c => [c, 1.0]))
  )
  const [result, setResult] = useState<SavingsResult | null>(null)

  const calculate = useCallback(async () => {
    try {
      const res = await fetch('/api/insights/savings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adjustments }),
      })
      if (res.ok) setResult(await res.json())
      else {
        // Client-side fallback calculation
        const monthly = CATEGORIES.reduce((acc, cat) => {
          const current = byCategory[cat] || 0
          return acc + current * (1 - adjustments[cat])
        }, 0)
        setResult({ monthlySavings: monthly, annualSavings: monthly * 12 })
      }
    } catch {
      const monthly = CATEGORIES.reduce((acc, cat) => {
        const current = byCategory[cat] || 0
        return acc + current * (1 - adjustments[cat])
      }, 0)
      setResult({ monthlySavings: monthly, annualSavings: monthly * 12 })
    }
  }, [adjustments, byCategory])

  useEffect(() => {
    const timer = setTimeout(calculate, 400)
    return () => clearTimeout(timer)
  }, [calculate])

  const activeCategories = CATEGORIES.filter(c => byCategory[c] > 0)

  return (
    <div className="bg-white rounded-2xl border p-6">
      <h3 className="font-bold text-[#1A1A2E] mb-1">What-If Savings Calculator</h3>
      <p className="text-sm text-gray-500 mb-6">Drag sliders to see how much you could save</p>

      <div className="space-y-5">
        {activeCategories.map(cat => (
          <div key={cat}>
            <div className="flex justify-between text-sm mb-1">
              <span className="font-medium capitalize">{cat}</span>
              <span className="text-gray-500">
                {toNaira(byCategory[cat])} → {toNaira(byCategory[cat] * adjustments[cat])}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={adjustments[cat]}
              onChange={e =>
                setAdjustments(prev => ({ ...prev, [cat]: parseFloat(e.target.value) }))
              }
              className="w-full accent-[#E94560]"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-0.5">
              <span>No spend</span>
              <span>{Math.round(adjustments[cat] * 100)}% of current</span>
              <span>Current</span>
            </div>
          </div>
        ))}

        {activeCategories.length === 0 && (
          <p className="text-gray-400 text-sm text-center py-4">No spending data to calculate savings</p>
        )}
      </div>

      {result && result.monthlySavings > 0 && (
        <div className="mt-6 bg-green-50 border border-green-200 rounded-xl p-4">
          <p className="text-green-700 font-bold text-lg">{toNaira(result.monthlySavings)} / month</p>
          <p className="text-green-600 text-sm">{toNaira(result.annualSavings)} / year at this rate</p>
        </div>
      )}

      {result && result.monthlySavings === 0 && activeCategories.length > 0 && (
        <div className="mt-6 bg-gray-50 border rounded-xl p-4 text-center">
          <p className="text-gray-500 text-sm">Adjust sliders below 100% to see potential savings</p>
        </div>
      )}
    </div>
  )
}
