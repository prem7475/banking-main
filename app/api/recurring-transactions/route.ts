import { NextRequest, NextResponse } from 'next/server'
import {
  getRecurringTransactions,
  createRecurringTransaction,
  updateRecurringTransaction,
  deleteRecurringTransaction,
  getDueRecurringTransactions,
  processRecurringTransaction
} from '@/lib/actions/recurringTransaction.actions'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')

    if (type === 'due') {
      const transactions = await getDueRecurringTransactions()
      return NextResponse.json({ transactions })
    }

    const transactions = await getRecurringTransactions()
    return NextResponse.json({ transactions })
  } catch (error) {
    console.error('Error fetching recurring transactions:', error)
    return NextResponse.json({ error: 'Failed to fetch recurring transactions' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, amount, category, type, frequency, startDate, endDate, accountId, notes } = body

    if (!name || !amount || !category || !type || !frequency || !startDate) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (!['credit', 'debit'].includes(type)) {
      return NextResponse.json({ error: 'Type must be either credit or debit' }, { status: 400 })
    }

    if (!['daily', 'weekly', 'monthly', 'yearly'].includes(frequency)) {
      return NextResponse.json({ error: 'Invalid frequency' }, { status: 400 })
    }

    const transaction = await createRecurringTransaction({
      name,
      amount: parseFloat(amount),
      category,
      type,
      frequency,
      startDate: new Date(startDate),
      endDate: endDate ? new Date(endDate) : undefined,
      accountId,
      notes,
    })

    return NextResponse.json({ transaction }, { status: 201 })
  } catch (error) {
    console.error('Error creating recurring transaction:', error)
    return NextResponse.json({ error: 'Failed to create recurring transaction' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, action, ...updateData } = body

    if (!id) {
      return NextResponse.json({ error: 'Transaction ID is required' }, { status: 400 })
    }

    if (action === 'process') {
      const transaction = await processRecurringTransaction(id)
      return NextResponse.json({ transaction })
    }

    // Regular update
    const transaction = await updateRecurringTransaction(id, updateData)
    return NextResponse.json({ transaction })
  } catch (error) {
    console.error('Error updating recurring transaction:', error)
    return NextResponse.json({ error: 'Failed to update recurring transaction' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Transaction ID is required' }, { status: 400 })
    }

    const transaction = await deleteRecurringTransaction(id)
    return NextResponse.json({ transaction })
  } catch (error) {
    console.error('Error deleting recurring transaction:', error)
    return NextResponse.json({ error: 'Failed to delete recurring transaction' }, { status: 500 })
  }
}
