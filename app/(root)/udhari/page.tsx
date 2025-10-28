'use client'

import React, { useState, useEffect } from 'react'
import HeaderBox from '@/components/HeaderBox'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { useAppContext } from '@/lib/context/AppContext'
import { formatAmount } from '@/lib/utils'
import { Plus, Minus, TrendingUp, TrendingDown, PieChart, CreditCard, Building2 } from 'lucide-react'

const Udhari = () => {
  const { bankAccounts, creditCards, loading } = useAppContext()
  const [showAddTransaction, setShowAddTransaction] = useState(false)
  const [transactionType, setTransactionType] = useState<'income' | 'expense'>('expense')
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [accountType, setAccountType] = useState<'bank' | 'card'>('bank')
  const [selectedAccount, setSelectedAccount] = useState('')
  const { transactions: contextTransactions } = useAppContext()

  // Use context transactions or fallback to mock data
  const transactions = contextTransactions || []

  // Mock data for expenses and income (fallback)
  const [mockTransactions, setMockTransactions] = useState([
    {
      id: '1',
      name: 'Grocery Shopping',
      amount: -2500,
      category: 'Food & Dining',
      date: new Date('2024-01-15'),
      type: 'expense',
      account: 'State Bank of India Savings',
      accountType: 'bank'
    },
    {
      id: '2',
      name: 'Salary Deposit',
      amount: 50000,
      category: 'Income',
      date: new Date('2024-01-01'),
      type: 'income',
      account: 'HDFC Bank Current Account',
      accountType: 'bank'
    },
    {
      id: '3',
      name: 'Electricity Bill',
      amount: -1200,
      category: 'Utilities',
      date: new Date('2024-01-10'),
      type: 'expense',
      account: 'ICICI Bank Savings Plus',
      accountType: 'bank'
    },
    {
      id: '4',
      name: 'Freelance Payment',
      amount: 15000,
      category: 'Income',
      date: new Date('2024-01-20'),
      type: 'income',
      account: 'HDFC Credit Card',
      accountType: 'card'
    },
    {
      id: '5',
      name: 'Movie Tickets',
      amount: -800,
      category: 'Entertainment',
      date: new Date('2024-01-12'),
      type: 'expense',
      account: 'ICICI Credit Card',
      accountType: 'card'
    },
    {
      id: '6',
      name: 'Internet Bill',
      amount: -1500,
      category: 'Utilities',
      date: new Date('2024-01-08'),
      type: 'expense',
      account: 'Axis Bank Salary Account',
      accountType: 'bank'
    },
    {
      id: '7',
      name: 'Coffee Shop',
      amount: -450,
      category: 'Food & Dining',
      date: new Date('2024-01-18'),
      type: 'expense',
      account: 'SBI Credit Card',
      accountType: 'card'
    },
    {
      id: '8',
      name: 'Investment Returns',
      amount: 8000,
      category: 'Income',
      date: new Date('2024-01-25'),
      type: 'income',
      account: 'Punjab National Bank',
      accountType: 'bank'
    }
  ])

  const expenseCategories = [
    'Food & Dining',
    'Transportation',
    'Entertainment',
    'Utilities',
    'Healthcare',
    'Shopping',
    'Education',
    'Travel',
    'Bills & Payments',
    'Other'
  ]

  const incomeCategories = [
    'Salary',
    'Freelance',
    'Business',
    'Investment',
    'Rental',
    'Gift',
    'Other'
  ]

  const handleAddTransaction = async () => {
    if (!amount || !description || !category || !selectedAccount) return

    try {
      const { createTransaction } = await import('@/lib/actions/transaction.actions')
      const { getLoggedInUser } = await import('@/lib/actions/user.actions')

      const user = await getLoggedInUser()
      if (!user) return

      const newTransaction = await createTransaction({
        userId: user.userId,
        bankId: 'mock-bank-id', // For now, use mock
        name: description,
        amount: transactionType === 'expense' ? -parseFloat(amount) : parseFloat(amount),
        channel: 'online',
        category,
        senderBankId: 'mock-sender',
        receiverBankId: 'mock-receiver',
        type: transactionType === 'expense' ? 'debit' : 'credit',
        paymentChannel: 'online',
        pending: false,
        date: new Date(),
        image: '',
      })

      if (newTransaction) {
        // Note: In a real app, you'd update the context or refetch data
        resetForm()
        setShowAddTransaction(false)
      }
    } catch (error) {
      console.error('Error adding transaction:', error)
    }
  }

  const resetForm = () => {
    setAmount('')
    setDescription('')
    setCategory('')
    setSelectedAccount('')
    setTransactionType('expense')
    setAccountType('bank')
  }

  // Calculate totals from real transactions
  const totalIncome = transactions
    .filter(t => t.type === 'credit')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalExpenses = Math.abs(transactions
    .filter(t => t.type === 'debit')
    .reduce((sum, t) => sum + t.amount, 0))

  const netBalance = totalIncome - totalExpenses

  // Calculate category spending from real transactions
  const categorySpending = transactions
    .filter(t => t.type === 'debit')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + Math.abs(t.amount)
      return acc
    }, {} as Record<string, number>)

  const categoryData = Object.entries(categorySpending).map(([category, amount]) => ({
    category,
    amount,
    percentage: totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0
  })).sort((a, b) => b.amount - a.amount)

  // Colors for chart
  const categoryColors = [
    'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500',
    'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-orange-500'
  ]

  if (loading) {
    return (
      <div className="udhri">
        <div className="udhri-header">
          <HeaderBox
            title="Udhri - Monthly Expenses & Income"
            subtext="Track your monthly spending, income, and financial insights."
          />
        </div>
        <div className="flex justify-center items-center min-h-[400px]">
          <div>Loading...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="udhri">
      <div className="udhri-header">
        <HeaderBox
          title="Udhri - Monthly Expenses & Income"
          subtext="Track your monthly spending, income, and financial insights."
        />
      </div>

      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Income</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">₹{formatAmount(totalIncome)}</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
              <TrendingDown className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">₹{formatAmount(totalExpenses)}</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Net Balance</CardTitle>
              <PieChart className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${netBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ₹{formatAmount(netBalance)}
              </div>
              <p className="text-xs text-muted-foreground">Income - Expenses</p>
            </CardContent>
          </Card>
        </div>



        {/* Spending by Category Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Spending by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {categoryData.map((item, index) => (
                <div key={item.category} className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div className={`w-4 h-4 rounded-full ${categoryColors[index % categoryColors.length]}`}></div>
                    <span className="font-medium">{item.category}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${categoryColors[index % categoryColors.length]}`}
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                    <span className="font-semibold min-w-[80px] text-right">₹{formatAmount(item.amount)}</span>
                    <span className="text-sm text-gray-500 min-w-[50px] text-right">{item.percentage.toFixed(1)}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Add Transaction Button */}
        <div className="flex justify-center">
          <Dialog open={showAddTransaction} onOpenChange={setShowAddTransaction}>
            <DialogTrigger asChild>
              <Button size="lg" className="h-12 px-8 text-base font-semibold">
                <Plus className="w-5 h-5 mr-2" />
                Add Transaction
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold">Add New Transaction</DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                {/* Transaction Type */}
                <div className="space-y-3">
                  <Label className="text-base font-medium">Transaction Type</Label>
                  <div className="flex gap-4">
                    <Button
                      type="button"
                      variant={transactionType === 'expense' ? 'default' : 'outline'}
                      onClick={() => setTransactionType('expense')}
                      className="flex-1 h-12 text-base"
                    >
                      <Minus className="w-4 h-4 mr-2" />
                      Expense
                    </Button>
                    <Button
                      type="button"
                      variant={transactionType === 'income' ? 'default' : 'outline'}
                      onClick={() => setTransactionType('income')}
                      className="flex-1 h-12 text-base"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Income
                    </Button>
                  </div>
                </div>

                {/* Amount */}
                <div className="space-y-3">
                  <Label htmlFor="amount" className="text-base font-medium">Amount (₹)</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="Enter amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="h-12 text-base"
                  />
                </div>

                {/* Description */}
                <div className="space-y-3">
                  <Label htmlFor="description" className="text-base font-medium">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Enter transaction description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="min-h-[80px] text-base"
                  />
                </div>

                {/* Category */}
                <div className="space-y-3">
                  <Label className="text-base font-medium">Category</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger className="h-12 text-base">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {(transactionType === 'expense' ? expenseCategories : incomeCategories).map((cat) => (
                        <SelectItem key={cat} value={cat} className="h-12 text-base">
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Account Type */}
                <div className="space-y-3">
                  <Label className="text-base font-medium">Account Type</Label>
                  <div className="flex gap-4">
                    <Button
                      type="button"
                      variant={accountType === 'bank' ? 'default' : 'outline'}
                      onClick={() => setAccountType('bank')}
                      className="flex-1 h-12 text-base"
                    >
                      <Building2 className="w-4 h-4 mr-2" />
                      Bank Account
                    </Button>
                    <Button
                      type="button"
                      variant={accountType === 'card' ? 'default' : 'outline'}
                      onClick={() => setAccountType('card')}
                      className="flex-1 h-12 text-base"
                    >
                      <CreditCard className="w-4 h-4 mr-2" />
                      Credit Card
                    </Button>
                  </div>
                </div>

                {/* Account Selection */}
                <div className="space-y-3">
                  <Label className="text-base font-medium">
                    Select {accountType === 'bank' ? 'Bank Account' : 'Credit Card'}
                  </Label>
                  <Select value={selectedAccount} onValueChange={setSelectedAccount}>
                    <SelectTrigger className="h-12 text-base">
                      <SelectValue placeholder={`Choose ${accountType === 'bank' ? 'bank account' : 'credit card'}`} />
                    </SelectTrigger>
                    <SelectContent>
                      {(accountType === 'bank' ? bankAccounts : creditCards).map((account) => (
                        <SelectItem key={account.id} value={account.name} className="h-12 text-base">
                          <div className="flex items-center gap-2">
                            {accountType === 'bank' ? (
                              <Building2 className="w-4 h-4" />
                            ) : (
                              <CreditCard className="w-4 h-4" />
                            )}
                            {account.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-4">
                  <Button
                    onClick={handleAddTransaction}
                    disabled={!amount || !description || !category || !selectedAccount}
                    className="flex-1 h-12 text-base font-semibold"
                  >
                    Add Transaction
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      resetForm()
                      setShowAddTransaction(false)
                    }}
                    className="h-12 text-base font-semibold"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {transactions.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No transactions found. Add your first transaction!</p>
              ) : (
                transactions.slice(0, 10).map((transaction) => (
                  <div key={transaction._id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${transaction.type === 'credit' ? 'bg-green-100' : 'bg-red-100'}`}>
                        {transaction.type === 'credit' ? (
                          <Plus className="w-4 h-4 text-green-600" />
                        ) : (
                          <Minus className="w-4 h-4 text-red-600" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{transaction.name}</p>
                        <p className="text-sm text-gray-500">{transaction.category}</p>
                        <p className="text-xs text-gray-400">
                          {new Date(transaction.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className={`font-semibold ${transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                        {transaction.type === 'credit' ? '+' : '-'}₹{formatAmount(Math.abs(transaction.amount))}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Udhari
