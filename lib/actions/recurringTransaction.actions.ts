'use server'

import connectDB from '@/lib/mongodb'
import RecurringTransaction from '@/lib/models/RecurringTransaction'
import { getLoggedInUser } from './user.actions'

export async function createRecurringTransaction(transactionData: {
  name: string
  amount: number
  category: string
  type: 'credit' | 'debit'
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly'
  startDate: Date
  endDate?: Date
  accountId?: string
  notes?: string
}): Promise<any> {
  try {
    await connectDB()
    const user = await getLoggedInUser()
    if (!user) throw new Error('User not authenticated')

    const nextDueDate = calculateNextDueDate(transactionData.startDate, transactionData.frequency)

    const recurringTransaction = await RecurringTransaction.create({
      userId: user.userId,
      ...transactionData,
      nextDueDate,
      isActive: true,
    })

    return recurringTransaction
  } catch (error) {
    console.error('Error creating recurring transaction:', error)
    throw error
  }
}

export async function getRecurringTransactions(): Promise<any[]> {
  try {
    await connectDB()
    const user = await getLoggedInUser()
    if (!user) throw new Error('User not authenticated')

    const transactions = await RecurringTransaction.find({
      userId: user.userId,
      isActive: true,
    }).sort({ nextDueDate: 1 })

    return transactions
  } catch (error) {
    console.error('Error fetching recurring transactions:', error)
    throw error
  }
}

export async function getDueRecurringTransactions(): Promise<any[]> {
  try {
    await connectDB()
    const user = await getLoggedInUser()
    if (!user) throw new Error('User not authenticated')

    const now = new Date()
    const transactions = await RecurringTransaction.find({
      userId: user.userId,
      isActive: true,
      nextDueDate: { $lte: now },
    }).sort({ nextDueDate: 1 })

    return transactions
  } catch (error) {
    console.error('Error fetching due recurring transactions:', error)
    throw error
  }
}

export async function processRecurringTransaction(transactionId: string): Promise<any> {
  try {
    await connectDB()
    const user = await getLoggedInUser()
    if (!user) throw new Error('User not authenticated')

    const transaction = await RecurringTransaction.findOne({
      _id: transactionId,
      userId: user.userId,
      isActive: true,
    })

    if (!transaction) throw new Error('Recurring transaction not found')

    // Calculate next due date
    const nextDueDate = calculateNextDueDate(transaction.nextDueDate, transaction.frequency)

    // Check if we've reached the end date
    if (transaction.endDate && nextDueDate > transaction.endDate) {
      // Deactivate the recurring transaction
      await RecurringTransaction.findByIdAndUpdate(transactionId, { isActive: false })
      return null
    }

    // Update next due date
    const updatedTransaction = await RecurringTransaction.findByIdAndUpdate(
      transactionId,
      { nextDueDate },
      { new: true }
    )

    return updatedTransaction
  } catch (error) {
    console.error('Error processing recurring transaction:', error)
    throw error
  }
}

export async function updateRecurringTransaction(transactionId: string, updateData: Partial<{
  name: string
  amount: number
  category: string
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly'
  endDate: Date
  accountId: string
  notes: string
  isActive: boolean
}>): Promise<any> {
  try {
    await connectDB()
    const user = await getLoggedInUser()
    if (!user) throw new Error('User not authenticated')

    const transaction = await RecurringTransaction.findOneAndUpdate(
      { _id: transactionId, userId: user.userId },
      updateData,
      { new: true }
    )

    if (!transaction) throw new Error('Recurring transaction not found')
    return transaction
  } catch (error) {
    console.error('Error updating recurring transaction:', error)
    throw error
  }
}

export async function deleteRecurringTransaction(transactionId: string): Promise<any> {
  try {
    await connectDB()
    const user = await getLoggedInUser()
    if (!user) throw new Error('User not authenticated')

    const transaction = await RecurringTransaction.findOneAndUpdate(
      { _id: transactionId, userId: user.userId },
      { isActive: false },
      { new: true }
    )

    if (!transaction) throw new Error('Recurring transaction not found')
    return transaction
  } catch (error) {
    console.error('Error deleting recurring transaction:', error)
    throw error
  }
}

function calculateNextDueDate(currentDate: Date, frequency: string): Date {
  const date = new Date(currentDate)

  switch (frequency) {
    case 'daily':
      date.setDate(date.getDate() + 1)
      break
    case 'weekly':
      date.setDate(date.getDate() + 7)
      break
    case 'monthly':
      date.setMonth(date.getMonth() + 1)
      break
    case 'yearly':
      date.setFullYear(date.getFullYear() + 1)
      break
    default:
      date.setMonth(date.getMonth() + 1) // default to monthly
  }

  return date
}
