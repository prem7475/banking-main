'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, TrendingUp, TrendingDown, DollarSign } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { formatAmount } from '@/lib/utils'
import { useAppContext } from '@/lib/context/AppContext'

const TodayHubNew = () => {
  const { bankAccounts, creditCards } = useAppContext()
  const [showQuickAdd, setShowQuickAdd] = useState(false)
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('')
  const [notes, setNotes] = useState('')

  // Calculate spendable balance
  const totalBalance = bankAccounts.reduce((sum, account) => sum + account.currentBalance, 0) +
                      creditCards.reduce((sum, card) => sum + card.balance, 0)
  const upcomingBills = 2500 // Mock upcoming bills
  const spendableBalance = totalBalance - upcomingBills

  // Today's summary (mock data)
  const todaySpent = 350
  const todayTransactions = 3
  const foodBudgetLeft = 500
  const foodBudgetTotal = 1000

  const handleQuickAdd = () => {
    // Handle quick add logic here
    console.log('Adding expense:', { amount, category, notes })
    setShowQuickAdd(false)
    setAmount('')
    setCategory('')
    setNotes('')
  }

  return (
    <div className="min-h-screen bg-[var(--primary-bg)] text-[var(--text-secondary)] p-6">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-32 h-32 bg-[var(--accent)] rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-[var(--positive)] rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-md mx-auto">
        {/* Spendable Balance - The Only Number That Matters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <p className="text-[var(--text-secondary)] text-sm mb-2">Spendable Balance</p>
          <div className="text-4xl font-bold bg-gradient-to-r from-[var(--accent)] to-[var(--positive)] bg-clip-text text-transparent">
            ₹{formatAmount(spendableBalance)}
          </div>
          <p className="text-[var(--text-secondary)] text-xs mt-1">After upcoming bills</p>
        </motion.div>

        {/* Quick Add Button - The Action Hub */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex justify-center mb-8"
        >
          <Button
            onClick={() => setShowQuickAdd(true)}
            className="w-20 h-20 rounded-full bg-gradient-to-r from-[var(--accent)] to-[var(--positive)] hover:from-[var(--accent-hover)] hover:to-[var(--positive)] shadow-2xl hover:shadow-[var(--accent)]/25 transition-all duration-300"
          >
            <Plus className="w-8 h-8" />
          </Button>
        </motion.div>

        {/* Today's Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card className="bg-[var(--card-bg)] backdrop-blur-sm border-slate-700">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4 text-center text-[var(--text-primary)]">Today's Summary</h3>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <TrendingDown className="w-4 h-4 text-[var(--negative)]" />
                    <span className="text-[var(--text-secondary)]">Spent Today</span>
                  </div>
                  <span className="font-semibold text-[var(--negative)]">₹{formatAmount(todaySpent)}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-[var(--text-secondary)]">Transactions</span>
                  <span className="font-semibold text-[var(--text-primary)]">{todayTransactions} items</span>
                </div>

                <div className="pt-2 border-t border-slate-700">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[var(--text-secondary)]">Food Budget Left</span>
                    <span className="font-semibold text-[var(--positive)]">₹{formatAmount(foodBudgetLeft)}</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-[var(--positive)] to-[var(--accent)] h-2 rounded-full transition-all duration-500"
                      style={{ width: `${(foodBudgetLeft / foodBudgetTotal) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-[var(--text-secondary)] mt-1">
                    ₹{formatAmount(foodBudgetLeft)} of ₹{formatAmount(foodBudgetTotal)} remaining
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Quick Add Modal */}
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
            className="bg-[var(--card-bg)] rounded-lg p-6 w-full max-w-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold mb-6 text-center text-[var(--text-primary)]">Quick Add Expense</h3>

            <div className="space-y-4">
              <div>
                <Label htmlFor="amount" className="text-[var(--text-secondary)]">Amount (₹)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="bg-slate-700 border-slate-600 text-[var(--text-primary)] placeholder-slate-400 mt-1"
                />
              </div>

              <div>
                <Label htmlFor="category" className="text-[var(--text-secondary)]">Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-[var(--text-primary)] mt-1">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="bg-[var(--card-bg)] border-slate-600">
                    <SelectItem value="food">🍽️ Food & Dining</SelectItem>
                    <SelectItem value="travel">✈️ Travel</SelectItem>
                    <SelectItem value="entertainment">🎬 Entertainment</SelectItem>
                    <SelectItem value="shopping">🛍️ Shopping</SelectItem>
                    <SelectItem value="utilities">💡 Utilities</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="notes" className="text-[var(--text-secondary)]">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Where did you spend?"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="bg-slate-700 border-slate-600 text-[var(--text-primary)] placeholder-slate-400 mt-1"
                  rows={2}
                />
              </div>

              <div className="flex gap-3 mt-6">
                <Button
                  onClick={() => setShowQuickAdd(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleQuickAdd}
                  className="flex-1 bg-gradient-to-r from-[var(--accent)] to-[var(--positive)] hover:from-[var(--accent-hover)] hover:to-[var(--positive)]"
                  disabled={!amount || !category}
                >
                  Add Expense
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}

export default TodayHubNew
