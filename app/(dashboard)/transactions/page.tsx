'use client'
import TransactionTable from '@/components/transactions/TransactionTable'
import { Plus, Download } from 'lucide-react'

export default function TransactionsPage() {
  return (
    <div className="max-w-6xl mx-auto pb-12">
      {/* Header section with actions */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 pt-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#1A1A2E] tracking-tight">Transaction History</h1>
          <p className="text-gray-500 font-medium text-sm mt-1">
            Analyze and manage your spending across all connected physical cards.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 transition-all shadow-sm active:scale-95"
          >
            <Download size={18} />
            Export CSV
          </button>
          <button 
            className="flex items-center gap-2 px-5 py-2.5 bg-[#E94560] rounded-xl text-sm font-bold text-white shadow-lg shadow-[#E94560]/20 hover:bg-[#d63850] transition-all active:scale-95"
          >
            <Plus size={18} />
            New Transaction
          </button>
        </div>
      </div>

      {/* Main Table view */}
      <TransactionTable />
      
      {/* Tips / Insights bottom area */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
        <div className="bg-[#1A1A2E] text-white p-6 rounded-2xl shadow-xl relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/5 rounded-full blur-2xl group-hover:scale-150 transition-all duration-700" />
          <h3 className="text-lg font-bold mb-2">Smart Categorization</h3>
          <p className="text-white/60 text-sm leading-relaxed">
            Orchestra uses AI to automatically categorize your transactions across all cards for 100% tax accuracy.
          </p>
        </div>
        
        <div className="bg-white border p-6 rounded-2xl flex items-start gap-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600 flex-shrink-0">
            📊
          </div>
          <div>
            <h4 className="font-bold text-[#1A1A2E] mb-1">Monthly Analytics</h4>
            <p className="text-gray-500 text-xs leading-relaxed">
              Your spending on <strong>Subscriptions</strong> is up by 12% this month compared to February.
            </p>
          </div>
        </div>

        <div className="bg-white border p-6 rounded-2xl flex items-start gap-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 flex-shrink-0">
            🔗
          </div>
          <div>
            <h4 className="font-bold text-[#1A1A2E] mb-1">Card Optimization</h4>
            <p className="text-gray-500 text-xs leading-relaxed">
              Redirecting <strong>Spotify</strong> to your <em>GTBank Salary</em> card saved you ₦450 in fees.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
