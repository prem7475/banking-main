'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence, PanInfo } from 'framer-motion'
import { ChevronLeft, ChevronRight, Plus, TrendingUp, TrendingDown, Calendar, DollarSign } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatAmount } from '@/lib/utils'
import { useAppContext } from '@/lib/context/AppContext'
import AnimatedCounter from './AnimatedCounter'

interface TimelineCard {
  id: string
  type: 'past' | 'today' | 'future'
  date: string
  title: string
  amount?: number
  description: string
  category?: string
  icon?: React.ReactNode
}

const FinancialTimeline = () => {
  const { bankAccounts, creditCards } = useAppContext()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showQuickAdd, setShowQuickAdd] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Calculate spendable balance (total balance - upcoming bills)
  const totalBalance = bankAccounts.reduce((sum, account) => sum + account.currentBalance, 0) +
                      creditCards.reduce((sum, card) => sum + card.balance, 0)

  // Mock upcoming bills for demo (would come from recurring transactions)
  const upcomingBills = 2500 // Netflix, rent, etc.
  const spendableBalance = totalBalance - upcomingBills

  // Generate timeline cards
  const generateTimelineCards = (): TimelineCard[] => {
    const cards: TimelineCard[] = []

    // Past cards (last 7 days)
    for (let i = 1; i <= 7; i++) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      cards.push({
        id: `past-${i}`,
        type: 'past',
        date: date.toLocaleDateString(),
        title: `Day ${i} Summary`,
        amount: Math.floor(Math.random() * 1000) + 100,
        description: `Spent on ${['Food', 'Travel', 'Entertainment'][Math.floor(Math.random() * 3)]}`,
        icon: <TrendingDown className="w-5 h-5 text-red-400" />
      })
    }

    // Today card
    cards.push({
      id: 'today',
      type: 'today',
      date: 'Today',
      title: 'Spendable Balance',
      amount: spendableBalance,
      description: 'Available after bills',
      icon: <DollarSign className="w-6 h-6 text-emerald-400" />
    })

    // Future cards (next 7 days)
    for (let i = 1; i <= 7; i++) {
      const date = new Date()
      date.setDate(date.getDate() + i)
      cards.push({
        id: `future-${i}`,
        type: 'future',
        date: date.toLocaleDateString(),
        title: i === 1 ? 'Netflix Due' : i === 3 ? 'Rent Split' : `Upcoming Bill ${i}`,
        amount: i === 1 ? 499 : i === 3 ? 4000 : Math.floor(Math.random() * 2000) + 500,
        description: i === 1 ? 'Monthly subscription' : i === 3 ? 'You owe Rohan' : 'Recurring expense',
        icon: <Calendar className="w-5 h-5 text-blue-400" />
      })
    }

    return cards
  }

  const timelineCards = generateTimelineCards()

  const handleDragEnd = (event: any, info: PanInfo) => {
    const swipeThreshold = 50
    if (info.offset.x > swipeThreshold && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    } else if (info.offset.x < -swipeThreshold && currentIndex < timelineCards.length - 1) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  const currentCard = timelineCards[currentIndex]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-32 h-32 bg-emerald-400 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-blue-400 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 p-6">
        {/* Timeline Navigation */}
        <div className="flex justify-between items-center mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
            disabled={currentIndex === 0}
            className="text-slate-400 hover:text-white"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>

          <div className="text-center">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
              Financial Timeline
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              {currentCard?.type === 'past' ? 'Past' : currentCard?.type === 'future' ? 'Future' : 'Today'}
            </p>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentIndex(Math.min(timelineCards.length - 1, currentIndex + 1))}
            disabled={currentIndex === timelineCards.length - 1}
            className="text-slate-400 hover:text-white"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>

        {/* Main Timeline Card */}
        <div className="flex justify-center">
          <motion.div
            ref={containerRef}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={handleDragEnd}
            className="w-full max-w-md"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700 shadow-2xl">
                  <CardContent className="p-8 text-center">
                    {/* Icon */}
                    <div className="flex justify-center mb-4">
                      {currentCard?.icon}
                    </div>

                    {/* Date */}
                    <p className="text-slate-400 text-sm mb-2">{currentCard?.date}</p>

                    {/* Title */}
                    <h2 className="text-xl font-semibold mb-4">{currentCard?.title}</h2>

                    {/* Amount */}
                    {currentCard?.amount && (
                      <div className="mb-4">
                        <AnimatedCounter
                          amount={currentCard.amount}
                          className="text-3xl font-bold text-emerald-400"
                        />
                      </div>
                    )}

                    {/* Description */}
                    <p className="text-slate-300">{currentCard?.description}</p>

                    {/* Quick Add Button for Today */}
                    {currentCard?.type === 'today' && (
                      <Button
                        onClick={() => setShowQuickAdd(true)}
                        className="mt-6 w-full bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white font-semibold py-3 rounded-lg shadow-lg"
                      >
                        <Plus className="w-5 h-5 mr-2" />
                        Quick Add Expense
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Timeline Dots Indicator */}
        <div className="flex justify-center mt-8 space-x-2">
          {timelineCards.slice(0, 15).map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentIndex ? 'bg-emerald-400' : 'bg-slate-600'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Quick Add Modal */}
      <AnimatePresence>
        {showQuickAdd && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowQuickAdd(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-slate-800 rounded-lg p-6 w-full max-w-sm"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold mb-4 text-center">Quick Add Expense</h3>
              {/* Quick add form would go here */}
              <p className="text-slate-400 text-center">Form implementation coming next...</p>
              <Button
                onClick={() => setShowQuickAdd(false)}
                className="w-full mt-4"
                variant="outline"
              >
                Close
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default FinancialTimeline
