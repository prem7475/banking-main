'use server'

import { connectDB } from '@/lib/mongodb'
import UdhariDebt from '@/lib/models/UdhariDebt'
import { getLoggedInUser } from './user.actions'

export async function createUdhariDebt(udhariData: {
  description: string
  totalAmount: number
  whoPaid: string
  splitWith: Array<{
    friendId: string
    friendName: string
    amount: number
  }>
  category?: string
  date?: Date
}) {
  try {
    await connectDB()
    const user = await getLoggedInUser()
    if (!user) throw new Error('User not authenticated')

    const udhariDebt = await UdhariDebt.create({
      userId: user.userId,
      ...udhariData,
      splitWith: udhariData.splitWith.map(split => ({
        ...split,
        settled: false,
        settledDate: null,
      })),
    })

    return udhariDebt
  } catch (error) {
    console.error('Error creating udhari debt:', error)
    throw error
  }
}

export async function getUdhariDebts() {
  try {
    await connectDB()
    const user = await getLoggedInUser()
    if (!user) throw new Error('User not authenticated')

    const debts = await UdhariDebt.find({ userId: user.userId }).sort({ createdAt: -1 })
    return debts
  } catch (error) {
    console.error('Error fetching udhari debts:', error)
    throw error
  }
}

export async function settleUdhariDebt(debtId: string, friendId: string) {
  try {
    await connectDB()
    const user = await getLoggedInUser()
    if (!user) throw new Error('User not authenticated')

    const debt = await UdhariDebt.findOneAndUpdate(
      { _id: debtId, userId: user.userId, 'splitWith.friendId': friendId },
      {
        $set: {
          'splitWith.$.settled': true,
          'splitWith.$.settledDate': new Date(),
        }
      },
      { new: true }
    )

    if (!debt) throw new Error('Debt not found')

    // Check if all splits are settled
    const allSettled = debt.splitWith.every(split => split.settled)
    if (allSettled) {
      debt.status = 'settled'
      await debt.save()
    }

    return debt
  } catch (error) {
    console.error('Error settling udhari debt:', error)
    throw error
  }
}

export async function getUdhariSummary() {
  try {
    await connectDB()
    const user = await getLoggedInUser()
    if (!user) throw new Error('User not authenticated')

    const debts = await UdhariDebt.find({ userId: user.userId })

    let totalYouOwe = 0
    let totalYouAreOwed = 0

    debts.forEach(debt => {
      debt.splitWith.forEach(split => {
        if (split.friendId === 'me') {
          // You paid, others owe you
          if (!split.settled) {
            totalYouAreOwed += split.amount
          }
        } else {
          // Others paid, you owe them
          if (!split.settled) {
            totalYouOwe += split.amount
          }
        }
      })
    })

    return {
      totalYouOwe,
      totalYouAreOwed,
      netBalance: totalYouAreOwed - totalYouOwe,
    }
  } catch (error) {
    console.error('Error getting udhari summary:', error)
    throw error
  }
}

export async function deleteUdhariDebt(debtId: string) {
  try {
    await connectDB()
    const user = await getLoggedInUser()
    if (!user) throw new Error('User not authenticated')

    const debt = await UdhariDebt.findOneAndDelete({
      _id: debtId,
      userId: user.userId,
    })

    if (!debt) throw new Error('Debt not found')
    return debt
  } catch (error) {
    console.error('Error deleting udhari debt:', error)
    throw error
  }
}
