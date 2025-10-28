'use server'

import connectDB from '@/lib/mongodb'
import Budget from '@/lib/models/Budget'
import { getLoggedInUser } from './user.actions'

export async function createBudget(budgetData: {
  category: string
  monthlyLimit: number
  alertThreshold?: number
}): Promise<any> {
  try {
    await connectDB()
    const user = await getLoggedInUser()
    if (!user) throw new Error('User not authenticated')

    const currentMonth = new Date().toISOString().slice(0, 7) // YYYY-MM format

    const budget = await Budget.create({
      userId: user.userId,
      ...budgetData,
      month: currentMonth,
      spent: 0,
      alertThreshold: budgetData.alertThreshold || 90,
      isActive: true,
    })

    return budget
  } catch (error) {
    console.error('Error creating budget:', error)
    throw error
  }
}

export async function getBudgets(month?: string): Promise<any[]> {
  try {
    await connectDB()
    const user = await getLoggedInUser()
    if (!user) throw new Error('User not authenticated')

    const currentMonth = month || new Date().toISOString().slice(0, 7)

    const budgets = await Budget.find({
      userId: user.userId,
      month: currentMonth,
      isActive: true,
    }).sort({ createdAt: -1 })

    return budgets
  } catch (error) {
    console.error('Error fetching budgets:', error)
    throw error
  }
}

export async function updateBudgetSpent(category: string, amount: number, month?: string): Promise<any> {
  try {
    await connectDB()
    const user = await getLoggedInUser()
    if (!user) throw new Error('User not authenticated')

    const currentMonth = month || new Date().toISOString().slice(0, 7)

    const budget = await Budget.findOneAndUpdate(
      { userId: user.userId, category, month: currentMonth },
      { $inc: { spent: amount } },
      { new: true, upsert: true }
    )

    return budget
  } catch (error) {
    console.error('Error updating budget spent:', error)
    throw error
  }
}

export async function updateBudget(budgetId: string, updateData: Partial<{
  monthlyLimit: number
  alertThreshold: number
  isActive: boolean
}>): Promise<any> {
  try {
    await connectDB()
    const user = await getLoggedInUser()
    if (!user) throw new Error('User not authenticated')

    const budget = await Budget.findOneAndUpdate(
      { _id: budgetId, userId: user.userId },
      updateData,
      { new: true }
    )

    if (!budget) throw new Error('Budget not found')
    return budget
  } catch (error) {
    console.error('Error updating budget:', error)
    throw error
  }
}

export async function deleteBudget(budgetId: string): Promise<any> {
  try {
    await connectDB()
    const user = await getLoggedInUser()
    if (!user) throw new Error('User not authenticated')

    const budget = await Budget.findOneAndDelete({
      _id: budgetId,
      userId: user.userId,
    })

    if (!budget) throw new Error('Budget not found')
    return budget
  } catch (error) {
    console.error('Error deleting budget:', error)
    throw error
  }
}

export async function getBudgetAlerts(): Promise<Array<{
  category: string
  spent: number
  limit: number
  percentage: number
  alertThreshold: number
}>> {
  try {
    await connectDB()
    const user = await getLoggedInUser()
    if (!user) throw new Error('User not authenticated')

    const currentMonth = new Date().toISOString().slice(0, 7)
    const budgets = await Budget.find({
      userId: user.userId,
      month: currentMonth,
      isActive: true,
    })

    const alerts = budgets
      .map(budget => {
        const percentage = budget.monthlyLimit > 0 ? (budget.spent / budget.monthlyLimit) * 100 : 0
        return {
          category: budget.category,
          spent: budget.spent,
          limit: budget.monthlyLimit,
          percentage,
          alertThreshold: budget.alertThreshold,
        }
      })
      .filter(alert => alert.percentage >= alert.alertThreshold)

    return alerts
  } catch (error) {
    console.error('Error getting budget alerts:', error)
    throw error
  }
}
