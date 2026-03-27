'use client'
import { Bell } from 'lucide-react'
import AnomalyBadge from '@/components/dashboard/AnomalyBadge'
import { useEffect, useState } from 'react'
import { tokenStorage } from '@/utils/tokenStorage'

function parseInitial(): string {
  try {
    const token = tokenStorage.getToken()
    if (!token) return 'U'
    const payload = JSON.parse(atob(token.split('.')[1]))
    const name: string = payload?.name || payload?.email || 'User'
    return name.charAt(0).toUpperCase()
  } catch {
    return 'U'
  }
}

export default function Navbar() {
  const [initial, setInitial] = useState('U')

  useEffect(() => {
    setInitial(parseInitial())
  }, [])

  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center px-6 gap-4 flex-shrink-0">
      <div className="ml-auto flex items-center gap-3">
        <AnomalyBadge />

        <button className="relative p-2 rounded-xl hover:bg-gray-50 transition">
          <Bell size={18} className="text-gray-600" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#E94560] rounded-full" />
        </button>

        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#E94560] to-[#1A1A2E] flex items-center justify-center text-white font-bold text-sm select-none">
          {initial}
        </div>
      </div>
    </header>
  )
}

