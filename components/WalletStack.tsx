'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Building2, CreditCard, ArrowRightLeft, Scan } from 'lucide-react'
import { useAppContext } from '@/lib/context/AppContext'

interface CardData {
  id: string
  type: 'bank' | 'credit'
  name: string
  balance: number
  lastFour: string
  color: string
  logo: string
}

const WalletStack = () => {
  const { bankAccounts, creditCards } = useAppContext()
  const [selectedCard, setSelectedCard] = useState<CardData | null>(null)

  // Mock card data - replace with actual data
  const mockCards: CardData[] = [
    {
      id: '1',
      type: 'bank',
      name: 'HDFC Bank Savings',
      balance: 25000,
      lastFour: '****1234',
      color: 'from-blue-500 to-blue-600',
      logo: '🏦'
    },
    {
      id: '2',
      type: 'credit',
      name: 'ICICI Credit Card',
      balance: 15000,
      lastFour: '****5678',
      color: 'from-purple-500 to-purple-600',
      logo: '💳'
    },
    {
      id: '3',
      type: 'bank',
      name: 'SBI Current Account',
      balance: 50000,
      lastFour: '****9012',
      color: 'from-green-500 to-green-600',
      logo: '🏦'
    }
  ]

  const handleCardClick = (card: CardData) => {
    setSelectedCard(card)
  }

  const handleTransfer = () => {
    // Handle transfer logic
    console.log('Transfer from:', selectedCard?.name)
  }

  const handleScanPay = () => {
    // Handle scan & pay logic
    console.log('Scan & Pay with:', selectedCard?.name)
  }

  return (
    <div className="min-h-screen bg-[var(--primary-bg)] text-[var(--text-secondary)] p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-2xl font-bold bg-gradient-to-r from-[var(--accent)] to-[var(--positive)] bg-clip-text text-transparent">
          My Wallet
        </h1>
        <p className="text-[var(--text-secondary)] mt-2">Manage your accounts and payments</p>
      </motion.div>

      {/* Card Stack */}
      <div className="relative mb-8">
        {mockCards.map((card, index) => (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 20, rotateY: -10 }}
            animate={{
              opacity: 1,
              y: index * 20,
              rotateY: 0,
              zIndex: mockCards.length - index
            }}
            transition={{
              duration: 0.5,
              delay: index * 0.1,
              type: "spring",
              stiffness: 200
            }}
            className="absolute inset-x-0 cursor-pointer"
            onClick={() => handleCardClick(card)}
            style={{
              transform: `translateY(${index * 20}px)`,
            }}
          >
            <Card className={`bg-gradient-to-br ${card.color} text-white shadow-2xl border-0 overflow-hidden`}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-8">
                  <div className="text-2xl">{card.logo}</div>
                  <div className="text-right">
                    <p className="text-xs opacity-80">Balance</p>
                    <p className="text-lg font-bold">₹{card.balance.toLocaleString()}</p>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm opacity-80">{card.name}</p>
                  <p className="text-lg font-mono">{card.lastFour}</p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {card.type === 'bank' ? (
                      <Building2 className="w-4 h-4" />
                    ) : (
                      <CreditCard className="w-4 h-4" />
                    )}
                    <span className="text-xs opacity-80 capitalize">{card.type} Account</span>
                  </div>
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <ArrowRightLeft className="w-4 h-4" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Action Buttons - Appear when card is selected */}
      {selectedCard && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="space-y-4"
        >
          <div className="text-center mb-6">
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">
              {selectedCard.name}
            </h3>
            <p className="text-[var(--text-secondary)]">
              Available Balance: ₹{selectedCard.balance.toLocaleString()}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button
              onClick={handleTransfer}
              className="h-16 bg-gradient-to-r from-[var(--accent)] to-[var(--positive)] hover:from-[var(--accent-hover)] hover:to-[var(--positive)] text-[var(--text-on-accent)] font-semibold"
            >
              <div className="flex flex-col items-center gap-1">
                <ArrowRightLeft className="w-5 h-5" />
                <span className="text-sm">Transfer</span>
              </div>
            </Button>

            <Button
              onClick={handleScanPay}
              className="h-16 bg-gradient-to-r from-[var(--positive)] to-[var(--accent)] hover:from-[var(--positive)] hover:to-[var(--accent-hover)] text-[var(--text-on-accent)] font-semibold"
            >
              <div className="flex flex-col items-center gap-1">
                <Scan className="w-5 h-5" />
                <span className="text-sm">Scan & Pay</span>
              </div>
            </Button>
          </div>

          <div className="text-center">
            <Button
              onClick={() => setSelectedCard(null)}
              variant="outline"
              className="border-slate-600 text-[var(--text-secondary)] hover:bg-slate-700"
            >
              Close
            </Button>
          </div>
        </motion.div>
      )}

      {/* Account Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="mt-8"
      >
        <Card className="bg-[var(--card-bg)] backdrop-blur-sm border-slate-700">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4 text-center text-[var(--text-primary)]">
              Account Summary
            </h3>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[var(--text-secondary)]">Total Bank Balance</span>
                <span className="font-semibold text-[var(--positive)]">
                  ₹{mockCards.filter(c => c.type === 'bank').reduce((sum, c) => sum + c.balance, 0).toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-[var(--text-secondary)]">Total Credit Limit</span>
                <span className="font-semibold text-[var(--accent)]">
                  ₹{mockCards.filter(c => c.type === 'credit').reduce((sum, c) => sum + c.balance, 0).toLocaleString()}
                </span>
              </div>

              <div className="pt-3 border-t border-slate-700">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-[var(--text-primary)]">Net Available</span>
                  <span className="font-bold text-2xl bg-gradient-to-r from-[var(--accent)] to-[var(--positive)] bg-clip-text text-transparent">
                    ₹{mockCards.reduce((sum, c) => sum + c.balance, 0).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

export default WalletStack
