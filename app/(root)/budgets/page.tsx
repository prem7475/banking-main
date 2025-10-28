'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, Plus, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react'
import HeaderBox from '@/components/HeaderBox'

interface Budget {
  _id: string
  category: string
  monthlyLimit: number
  spent: number
  alertThreshold: number
}

export default function BudgetsPage() {
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [formData, setFormData] = useState({
    category: '',
    monthlyLimit: '',
    alertThreshold: '90',
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    loadBudgets()
  }, [])

  const loadBudgets = async () => {
    try {
      const { getBudgets } = await import('@/lib/actions/budget.actions')
      const budgetsData = await getBudgets()
      setBudgets(budgetsData)
    } catch (error) {
      console.error('Error loading budgets:', error)
      setError('Failed to load budgets')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    try {
      const { createBudget } = await import('@/lib/actions/budget.actions')
      await createBudget({
        category: formData.category,
        monthlyLimit: parseFloat(formData.monthlyLimit),
        alertThreshold: parseInt(formData.alertThreshold),
      })

      setSuccess('Budget created successfully!')
      setFormData({ category: '', monthlyLimit: '', alertThreshold: '90' })
      setShowAddDialog(false)
      loadBudgets()
    } catch (error) {
      console.error('Error creating budget:', error)
      setError('Failed to create budget')
    }
  }

  const getBudgetStatus = (budget: Budget) => {
    const percentage = budget.monthlyLimit > 0 ? (budget.spent / budget.monthlyLimit) * 100 : 0

    if (percentage >= 100) {
      return { status: 'over', color: 'text-red-600', bgColor: 'bg-red-50' }
    } else if (percentage >= budget.alertThreshold) {
      return { status: 'warning', color: 'text-yellow-600', bgColor: 'bg-yellow-50' }
    } else {
      return { status: 'good', color: 'text-green-600', bgColor: 'bg-green-50' }
    }
  }

  const getTotalBudgetInfo = () => {
    const totalLimit = budgets.reduce((sum, budget) => sum + budget.monthlyLimit, 0)
    const totalSpent = budgets.reduce((sum, budget) => sum + budget.spent, 0)
    const percentage = totalLimit > 0 ? (totalSpent / totalLimit) * 100 : 0

    return { totalLimit, totalSpent, percentage }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  const { totalLimit, totalSpent, percentage } = getTotalBudgetInfo()

  return (
    <section className="budgets">
      <div className="budgets-content">
        <header className="budgets-header">
          <HeaderBox
            type="title"
            title="Budgets"
            subtext="Set monthly spending limits and track your expenses"
          />

          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button className="budgets-add-btn">
                <Plus className="w-4 h-4 mr-2" />
                Add Budget
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Budget</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="category" className="text-right">
                    Category *
                  </Label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="col-span-3"
                    placeholder="e.g., Food, Transport, Entertainment"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="limit" className="text-right">
                    Monthly Limit *
                  </Label>
                  <Input
                    id="limit"
                    type="number"
                    value={formData.monthlyLimit}
                    onChange={(e) => setFormData({ ...formData, monthlyLimit: e.target.value })}
                    className="col-span-3"
                    placeholder="5000"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="threshold" className="text-right">
                    Alert at (%)
                  </Label>
                  <Input
                    id="threshold"
                    type="number"
                    value={formData.alertThreshold}
                    onChange={(e) => setFormData({ ...formData, alertThreshold: e.target.value })}
                    className="col-span-3"
                    placeholder="90"
                    min="1"
                    max="100"
                  />
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {success && (
                  <Alert>
                    <AlertDescription className="text-green-600">{success}</AlertDescription>
                  </Alert>
                )}

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setShowAddDialog(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Create Budget</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </header>

        {/* Overall Budget Summary */}
        {budgets.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Monthly Budget Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <p className="text-sm text-gray-600">Total Budget</p>
                  <p className="text-2xl font-bold text-blue-600">₹{totalLimit.toLocaleString()}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Total Spent</p>
                  <p className="text-2xl font-bold text-gray-900">₹{totalSpent.toLocaleString()}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Remaining</p>
                  <p className={`text-2xl font-bold ${totalLimit - totalSpent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ₹{(totalLimit - totalSpent).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{percentage.toFixed(1)}%</span>
                </div>
                <Progress value={Math.min(percentage, 100)} className="h-3" />
              </div>
            </CardContent>
          </Card>
        )}

        <div className="budgets-grid">
          {budgets.length === 0 ? (
            <div className="text-center py-12">
              <TrendingUp className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No budgets set yet</h3>
              <p className="text-gray-500 mb-6">Create budgets to track your monthly spending limits</p>
              <Button onClick={() => setShowAddDialog(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Budget
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {budgets.map((budget) => {
                const percentage = budget.monthlyLimit > 0 ? (budget.spent / budget.monthlyLimit) * 100 : 0
                const status = getBudgetStatus(budget)

                return (
                  <Card key={budget._id} className={`budget-card ${status.bgColor}`}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-lg">{budget.category}</CardTitle>
                      {percentage >= budget.alertThreshold && (
                        <AlertTriangle className="w-5 h-5 text-yellow-500" />
                      )}
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Spent</span>
                          <span className={`font-semibold ${status.color}`}>
                            ₹{budget.spent.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Limit</span>
                          <span className="font-semibold">₹{budget.monthlyLimit.toLocaleString()}</span>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Progress</span>
                            <span className={status.color}>{percentage.toFixed(1)}%</span>
                          </div>
                          <Progress value={Math.min(percentage, 100)} className="h-2" />
                        </div>

                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-600">Remaining</span>
                          <span className={`font-medium ${budget.monthlyLimit - budget.spent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            ₹{(budget.monthlyLimit - budget.spent).toLocaleString()}
                          </span>
                        </div>

                        {percentage >= budget.alertThreshold && (
                          <Alert className="mt-3">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertDescription className="text-sm">
                              {percentage >= 100
                                ? `You've exceeded your ${budget.category} budget!`
                                : `You're approaching your ${budget.category} budget limit.`
                              }
                            </AlertDescription>
                          </Alert>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
