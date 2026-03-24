'use client'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { X } from 'lucide-react'

interface CreateVirtualCardModalProps {
  open: boolean
  onClose: () => void
  onCreated: () => void
}

export default function CreateVirtualCardModal({ open, onClose, onCreated }: CreateVirtualCardModalProps) {
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    label: '',
    merchant: '',
    spendLimit: '',
    autoRenew: true,
  })

  if (!open) return null

  function update(k: string, v: string | boolean) {
    setForm(f => ({ ...f, [k]: v }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/virtual-cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          spendLimit: parseFloat(form.spendLimit) * 100,
        }),
      })
      if (!res.ok) throw new Error()
      toast.success('Virtual card created!')
      onCreated()
      onClose()
    } catch {
      toast.error('Failed to create virtual card')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-lg font-bold text-[#1A1A2E]">Create Virtual Card</h2>
            <p className="text-xs text-gray-500 mt-0.5">Set up in under 30 seconds</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 transition">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Card Label</label>
            <input
              type="text"
              placeholder="e.g. Netflix Subscription"
              value={form.label}
              onChange={e => update('label', e.target.value)}
              required
              className="w-full border rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#E94560] focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs text-gray-500 mb-1 block">Merchant (optional)</label>
            <input
              type="text"
              placeholder="e.g. Netflix"
              value={form.merchant}
              onChange={e => update('merchant', e.target.value)}
              className="w-full border rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#E94560] focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs text-gray-500 mb-1 block">Monthly Spend Limit (NGN)</label>
            <input
              type="number"
              placeholder="e.g. 5000"
              value={form.spendLimit}
              onChange={e => update('spendLimit', e.target.value)}
              required
              className="w-full border rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#E94560] focus:outline-none"
            />
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={form.autoRenew}
              onChange={e => update('autoRenew', e.target.checked)}
              className="w-4 h-4 rounded accent-[#E94560]"
            />
            <span className="text-sm text-gray-700">Auto-renew monthly</span>
          </label>

          <button
            type="submit"
            disabled={loading || !form.label || !form.spendLimit}
            className="w-full bg-[#E94560] text-white py-3 rounded-xl font-semibold hover:bg-[#d63850] transition disabled:opacity-50"
          >
            {loading ? 'Creating…' : 'Create Virtual Card'}
          </button>
        </form>
      </div>
    </div>
  )
}
