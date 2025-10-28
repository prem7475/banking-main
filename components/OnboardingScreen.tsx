'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

const OnboardingScreen = () => {
  const [currentStep, setCurrentStep] = useState(0)

  const steps = [
    {
      title: "Your financial story,\n clearly told.",
      subtitle: "Track expenses, manage budgets, and split bills with friends—all in one elegant app.",
      background: "from-blue-900 via-purple-900 to-indigo-900"
    },
    {
      title: "Smart insights,\n simple actions.",
      subtitle: "Get personalized recommendations to save money and reach your financial goals.",
      background: "from-emerald-900 via-teal-900 to-cyan-900"
    },
    {
      title: "Split bills,\n strengthen bonds.",
      subtitle: "Never argue about money again. Track who owes what and settle up instantly.",
      background: "from-rose-900 via-pink-900 to-purple-900"
    }
  ]

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      // Handle completion - redirect to signup
      console.log('Onboarding complete')
    }
  }

  const currentStepData = steps[currentStep]

  return (
    <div className={`min-h-screen bg-gradient-to-br ${currentStepData.background} flex flex-col items-center justify-center p-6 relative overflow-hidden`}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-white rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 text-center max-w-md mx-auto">
        {/* Logo/Brand */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <div className="text-6xl mb-4">💰</div>
          <h1 className="text-4xl font-bold text-white mb-2">LenDen</h1>
        </motion.div>

        {/* Content */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold text-white mb-4 leading-tight whitespace-pre-line">
            {currentStepData.title}
          </h2>
          <p className="text-lg text-white/80 leading-relaxed">
            {currentStepData.subtitle}
          </p>
        </motion.div>

        {/* Progress Indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex justify-center gap-2 mb-8"
        >
          {steps.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentStep
                  ? 'bg-white w-8'
                  : 'bg-white/40'
              }`}
            />
          ))}
        </motion.div>

        {/* Action Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <Button
            onClick={handleNext}
            className="bg-white text-gray-900 hover:bg-white/90 font-semibold text-lg px-8 py-4 rounded-full shadow-2xl hover:shadow-white/25 transition-all duration-300 group"
          >
            {currentStep === steps.length - 1 ? (
              'Get Started'
            ) : (
              <>
                Next
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </Button>
        </motion.div>

        {/* Skip Option */}
        {currentStep < steps.length - 1 && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="mt-6 text-white/60 hover:text-white/80 transition-colors text-sm"
            onClick={() => setCurrentStep(steps.length - 1)}
          >
            Skip to end
          </motion.button>
        )}
      </div>

      {/* Floating Elements */}
      <motion.div
        animate={{
          y: [0, -10, 0],
          rotate: [0, 5, 0]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-20 right-20 text-4xl opacity-20"
      >
        💳
      </motion.div>

      <motion.div
        animate={{
          y: [0, 10, 0],
          rotate: [0, -5, 0]
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
        className="absolute bottom-32 left-16 text-4xl opacity-20"
      >
        📊
      </motion.div>

      <motion.div
        animate={{
          y: [0, -8, 0],
          x: [0, 5, 0]
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
        className="absolute top-40 left-20 text-4xl opacity-20"
      >
        👥
      </motion.div>
    </div>
  )
}

export default OnboardingScreen
