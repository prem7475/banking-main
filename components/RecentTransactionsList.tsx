'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { formatAmount } from '@/lib/utils'
import EmptyState from './EmptyState'
import ShimmerSkeleton from './ShimmerSkeleton'

interface Transaction {
  id: string
  amount: number
  category: string
  description: string
  date: string
  type: 'income' | 'expense'
}

const RecentTransactionsList = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate API call
    const fetchTransactions = async () => {
      setLoading(true)
      // Mock data
      setTimeout(() => {
        setTransactions([
          {
            id: '1',
            amount: -150,
            category: 'Food & Dining',
            description: 'Lunch at Cafe',
            date: '2024-01-15',
            type: 'expense'
          },
          {
            id: '2',
            amount: -50,
            category: 'Transportation',
            description: 'Uber ride',
            date: '2024-01-15',
            type: 'expense'
          },
          {
            id: '3',
            amount: 5000,
            category: 'Salary',
            description: 'Monthly salary',
            date: '2024-01-14',
            type: 'income'
          }
        ])
        setLoading(false)
      }, 1500)
    }

    fetchTransactions()
  }, [])

  if (loading) {
    return (
      <div className="space-y-4">
        <ShimmerSkeleton lines={3} height="h-16" />
      </div>
    )
  }

  if (transactions.length === 0) {
    return (
      <EmptyState
        icon="receipt"
        title="No transactions yet"
        description="Your financial story begins here. Add your first expense to start tracking your spending."
        actionText="Add First Expense"
        onAction={() => console.log('Add expense')}
      />
    )
  }

  return (
    <div className="space-y-3">
      {transactions.map((transaction, index) => (
        <motion.div
          key={transaction.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            delay: index * 0.1,
            type: "spring",
            stiffness: 100
          }}
          className="stagger-item"
        >
          <Card className="bg-[var(--card-bg)] backdrop-blur-sm border-slate-700 hover:bg-[var(--card-bg)]/80 transition-colors cursor-pointer">
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-[var(--accent)] to-[var(--positive)] rounded-full flex items-center justify-center text-white text-sm font-semibold">
                      {transaction.category.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-[var(--text-primary)]">{transaction.description}</p>
                      <p className="text-sm text-[var(--text-secondary)]">{transaction.category}</p>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${
                    transaction.type === 'income'
                      ? 'text-[var(--positive)]'
                      : 'text-[var(--negative)]'
                  }`}>
                    {transaction.type === 'income' ? '+' : ''}₹{formatAmount(Math.abs(transaction.amount))}
                  </p>
                  <p className="text-xs text-[var(--text-secondary)]">{transaction.date}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}

export default RecentTransactionsList
