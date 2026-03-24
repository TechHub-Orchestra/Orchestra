'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const STEPS = [
  {
    id: 1,
    title: 'Link your first card',
    description: 'Add a physical ATM card from any Nigerian bank to get started',
    emoji: '💳',
    cta: 'Got it, next →',
  },
  {
    id: 2,
    title: 'Set your routing preference',
    description: 'Choose how Orchestra splits payments across your cards automatically',
    emoji: '⚡',
    cta: 'Set it up →',
  },
  {
    id: 3,
    title: 'Create a virtual card',
    description: 'Set up a dedicated subscription card for Netflix, Spotify in 30 seconds',
    emoji: '✦',
    cta: 'Create one →',
  },
  {
    id: 4,
    title: 'Meet your AI advisor',
    description: 'Orchestra analyses your spending and tells you exactly where to save',
    emoji: '🤖',
    cta: 'Let\'s go!',
  },
]

interface OnboardingFlowProps {
  onComplete: () => void
}

export default function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [step, setStep] = useState(1)

  function handleNext() {
    if (step < STEPS.length) {
      setStep(s => s + 1)
    } else {
      localStorage.setItem('orchestra_onboarded', 'true')
      onComplete()
    }
  }

  const current = STEPS[step - 1]

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl"
        >
          {/* Progress */}
          <div className="flex gap-2 mb-8">
            {STEPS.map(s => (
              <div
                key={s.id}
                className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                  s.id <= step ? 'bg-[#E94560]' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>

          {/* Emoji */}
          <div className="w-16 h-16 bg-[#E94560]/10 rounded-2xl flex items-center justify-center text-3xl mb-6">
            {current.emoji}
          </div>

          <p className="text-sm text-gray-400 mb-1">Step {step} of {STEPS.length}</p>
          <h2 className="text-2xl font-bold text-[#1A1A2E] mb-3">{current.title}</h2>
          <p className="text-gray-600 mb-8 leading-relaxed">{current.description}</p>

          <div className="flex gap-3">
            {step > 1 && (
              <button
                onClick={() => setStep(s => s - 1)}
                className="px-4 py-3 rounded-xl border text-gray-600 text-sm font-medium hover:bg-gray-50 transition"
              >
                ← Back
              </button>
            )}
            <button
              onClick={handleNext}
              className="flex-1 bg-[#E94560] text-white py-3 rounded-xl font-semibold hover:bg-[#d63850] transition"
            >
              {current.cta}
            </button>
          </div>

          <button
            onClick={() => {
              localStorage.setItem('orchestra_onboarded', 'true')
              onComplete()
            }}
            className="w-full mt-3 text-sm text-gray-400 hover:text-gray-600 transition"
          >
            Skip tour
          </button>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
