'use server'

import connectDB from '@/lib/mongodb'
import Transaction from '@/lib/models/Transaction'
import Budget from '@/lib/models/Budget'
import { getLoggedInUser } from './user.actions'
import { updateBudgetSpent } from './budget.actions'

export async function categorizeBankTransaction(transactionId: string, category: string): Promise<any> {
  try {
    await connectDB()
    const user = await getLoggedInUser()
    if (!user) throw new Error('User not authenticated')

    // Update transaction category
    const transaction = await Transaction.findOneAndUpdate(
      { _id: transactionId, userId: user.userId },
      { category },
      { new: true }
    )

    if (!transaction) throw new Error('Transaction not found')

    // Update budget if it's a debit transaction
    if (transaction.type === 'debit') {
      await updateBudgetSpent(category, transaction.amount)
    }

    return transaction
  } catch (error) {
    console.error('Error categorizing transaction:', error)
    throw error
  }
}

export async function getUncategorizedTransactions(): Promise<any[]> {
  try {
    await connectDB()
    const user = await getLoggedInUser()
    if (!user) throw new Error('User not authenticated')

    // Get recent transactions without categories or with default categories
    const transactions = await Transaction.find({
      userId: user.userId,
      $or: [
        { category: { $exists: false } },
        { category: '' },
        { category: 'Other' },
        { category: 'Uncategorized' }
      ],
      type: 'debit', // Only categorize expenses
      date: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } // Last 30 days
    }).sort({ date: -1 }).limit(50)

    return transactions
  } catch (error) {
    console.error('Error fetching uncategorized transactions:', error)
    throw error
  }
}

export async function autoCategorizeTransaction(transactionName: string, amount: number): Promise<string> {
  // Simple rule-based categorization
  const name = transactionName.toLowerCase()

  if (name.includes('swiggy') || name.includes('zomato') || name.includes('food') || name.includes('restaurant') || name.includes('cafe')) {
    return 'Food and Drink'
  }

  if (name.includes('uber') || name.includes('ola') || name.includes('rapido') || name.includes('metro') || name.includes('bus')) {
    return 'Transportation'
  }

  if (name.includes('netflix') || name.includes('prime') || name.includes('hotstar') || name.includes('movie') || name.includes('cinema')) {
    return 'Entertainment'
  }

  if (name.includes('amazon') || name.includes('flipkart') || name.includes('myntra') || name.includes('shopping')) {
    return 'Shopping'
  }

  if (name.includes('electricity') || name.includes('water') || name.includes('gas') || name.includes('internet') || name.includes('phone')) {
    return 'Bills & Utilities'
  }

  if (name.includes('hospital') || name.includes('medical') || name.includes('pharmacy')) {
    return 'Healthcare'
  }

  if (name.includes('school') || name.includes('college') || name.includes('course') || name.includes('book')) {
    return 'Education'
  }

  if (name.includes('hotel') || name.includes('flight') || name.includes('train') || name.includes('travel')) {
    return 'Travel'
  }

  // Default category
  return 'Other'
}

export async function bulkCategorizeTransactions(categorizations: Array<{ transactionId: string, category: string }>): Promise<any[]> {
  try {
    await connectDB()
    const user = await getLoggedInUser()
    if (!user) throw new Error('User not authenticated')

    const results = []

    for (const { transactionId, category } of categorizations) {
      try {
        const transaction = await categorizeBankTransaction(transactionId, category)
        results.push({ transactionId, success: true, transaction })
      } catch (error) {
        results.push({ transactionId, success: false, error: error.message })
      }
    }

    return results
  } catch (error) {
    console.error('Error in bulk categorization:', error)
    throw error
  }
}
