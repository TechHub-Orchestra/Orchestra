import type { Metadata } from 'next'
import { Inter, Geist } from 'next/font/google'
import './globals.css'
import ToastProvider from '@/components/shared/ToastProvider'
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'Orchestra — Your Financial OS',
  description: 'Programmable ATM card orchestration platform. Unify all your Nigerian bank cards, set smart routing rules, and spend intelligently.',
  keywords: ['ATM card', 'Nigeria', 'fintech', 'Interswitch', 'card management', 'routing'],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={cn("h-full", "antialiased", inter.variable, "font-sans", geist.variable)}>
      <body className="min-h-full bg-gray-50 text-gray-900">
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  )
}
