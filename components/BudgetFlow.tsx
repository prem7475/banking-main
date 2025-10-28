'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatAmount } from '@/lib/utils'

interface BudgetCategory {
  id: string
  name: string
  spent: number
  budget: number
  color: string
  emoji: string
}

const BudgetFlow = () => {
  const [selectedCategory, setSelectedCategory] = useState<BudgetCategory | null>(null)

  const categories: BudgetCategory[] = [
    {
      id: 'food',
      name: 'Food & Dining',
      spent: 4500,
      budget: 6000,
      color: 'from-orange-400 to-red-500',
      emoji: '🍽️'
    },
    {
      id: 'transport',
      name: 'Transportation',
      spent: 1200,
      budget: 2000,
      color: 'from-blue-400 to-blue-600',
      emoji: '🚗'
    },
    {
      id: 'entertainment',
      name: 'Entertainment',
      spent: 800,
      budget: 1500,
      color: 'from-purple-400 to-pink-500',
      emoji: '🎬'
    },
    {
      id: 'shopping',
      name: 'Shopping',
      spent: 2500,
      budget: 3000,
      color: 'from-green-400 to-teal-500',
      emoji: '🛍️'
    }
  ]

  const totalBudget = categories.reduce((sum, cat) => sum + cat.budget, 0)
  const totalSpent = categories.reduce((sum, cat) => sum + cat.spent, 0)
  const remainingBudget = totalBudget - totalSpent

  const handleCategoryClick = (category: BudgetCategory) => {
    setSelectedCategory(category)
  }

  const handleCloseDetail = () => {
    setSelectedCategory(null)
  }

  if (selectedCategory) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="min-h-screen bg-[var(--primary-bg)] text-[var(--text-secondary)] p-6"
      >
        <div className="max-w-md mx-auto">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-6"
          >
            <div className="text-6xl mb-4">{selectedCategory.emoji}</div>
            <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
              {selectedCategory.name}
            </h2>
            <p className="text-[var(--text-secondary)]">
              ₹{formatAmount(selectedCategory.spent)} of ₹{formatAmount(selectedCategory.budget)} spent
            </p>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="bg-[var(--card-bg)] backdrop-blur-sm border-slate-700 mb-6">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[var(--text-secondary)]">Spent</span>
                    <span className="font-semibold text-[var(--negative)]">
                      ₹{formatAmount(selectedCategory.spent)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[var(--text-secondary)]">Budget</span>
                    <span className="font-semibold text-[var(--text-primary)]">
                      ₹{formatAmount(selectedCategory.budget)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[var(--text-secondary)]">Remaining</span>
                    <span className="font-semibold text-[var(--positive)]">
                      ₹{formatAmount(selectedCategory.budget - selectedCategory.spent)}
                    </span>
                  </div>
                </div>

                <div className="mt-6">
                  <div className="w-full bg-slate-700 rounded-full h-3">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(selectedCategory.spent / selectedCategory.budget) * 100}%` }}
                      transition={{ duration: 1, delay: 0.6 }}
                      className={`bg-gradient-to-r ${selectedCategory.color} h-3 rounded-full`}
                    />
                  </div>
                  <p className="text-xs text-[var(--text-secondary)] mt-2 text-center">
                    {Math.round((selectedCategory.spent / selectedCategory.budget) * 100)}% used
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-center"
          >
            <Button
              onClick={handleCloseDetail}
              variant="outline"
              className="border-slate-600 text-[var(--text-secondary)] hover:bg-slate-700"
            >
              Back to Overview
            </Button>
          </motion.div>
        </div>
      </motion.div>
    )
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
          Budget Flow
        </h1>
        <p className="text-[var(--text-secondary)] mt-2">Track your spending across categories</p>
      </motion.div>

      <div className="max-w-md mx-auto">
        {/* Budget Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <Card className="bg-[var(--card-bg)] backdrop-blur-sm border-slate-700">
            <CardContent className="p-6">
              <div className="text-center mb-4">
                <p className="text-[var(--text-secondary)] text-sm">Total Budget</p>
                <p className="text-2xl font-bold text-[var(--text-primary)]">
                  ₹{formatAmount(totalBudget)}
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[var(--text-secondary)]">Spent</span>
                  <span className="font-semibold text-[var(--negative)]">
                    ₹{formatAmount(totalSpent)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[var(--text-secondary)]">Remaining</span>
                  <span className="font-semibold text-[var(--positive)]">
                    ₹{formatAmount(remainingBudget)}
                  </span>
                </div>
              </div>

              <div className="mt-4">
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(totalSpent / totalBudget) * 100}%` }}
                    transition={{ duration: 1, delay: 0.4 }}
                    className="bg-gradient-to-r from-[var(--accent)] to-[var(--positive)] h-2 rounded-full"
                  />
                </div>
                <p className="text-xs text-[var(--text-secondary)] mt-1 text-center">
                  {Math.round((totalSpent / totalBudget) * 100)}% of budget used
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Category Bubbles */}
        <div className="grid grid-cols-2 gap-4">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.5,
                delay: 0.6 + index * 0.1,
                type: "spring",
                stiffness: 200
              }}
              className="cursor-pointer"
              onClick={() => handleCategoryClick(category)}
            >
              <Card className="bg-[var(--card-bg)] backdrop-blur-sm border-slate-700 hover:bg-[var(--card-bg)]/80 transition-all hover:scale-105">
                <CardContent className="p-4 text-center">
                  <div className="text-3xl mb-2">{category.emoji}</div>
                  <h3 className="font-semibold text-[var(--text-primary)] text-sm mb-1">
                    {category.name}
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)] mb-2">
                    ₹{formatAmount(category.spent)} / ₹{formatAmount(category.budget)}
                  </p>
                  <div className="w-full bg-slate-700 rounded-full h-1">
                    <div
                      className={`bg-gradient-to-r ${category.color} h-1 rounded-full transition-all duration-500`}
                      style={{ width: `${(category.spent / category.budget) * 100}%` }}
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default BudgetFlow
