import { NextRequest, NextResponse } from 'next/server'
import {
  getUdhariDebts,
  createUdhariDebt,
  settleUdhariDebt,
  getUdhariSummary,
  deleteUdhariDebt
} from '@/lib/actions/udhari.actions'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')

    if (type === 'summary') {
      const summary = await getUdhariSummary()
      return NextResponse.json({ summary })
    }

    const debts = await getUdhariDebts()
    return NextResponse.json({ debts })
  } catch (error) {
    console.error('Error fetching udhari data:', error)
    return NextResponse.json({ error: 'Failed to fetch udhari data' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { description, totalAmount, whoPaid, splitWith, category, date } = body

    if (!description || !totalAmount || !whoPaid || !splitWith) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const debt = await createUdhariDebt({
      description,
      totalAmount: parseFloat(totalAmount),
      whoPaid,
      splitWith,
      category: category || 'General',
      date: date ? new Date(date) : new Date(),
    })

    return NextResponse.json({ debt }, { status: 201 })
  } catch (error) {
    console.error('Error creating udhari debt:', error)
    return NextResponse.json({ error: 'Failed to create udhari debt' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { debtId, friendId, action } = body

    if (!debtId || !friendId) {
      return NextResponse.json({ error: 'Debt ID and Friend ID are required' }, { status: 400 })
    }

    if (action === 'settle') {
      const debt = await settleUdhariDebt(debtId, friendId)
      return NextResponse.json({ debt })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Error updating udhari debt:', error)
    return NextResponse.json({ error: 'Failed to update udhari debt' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const debtId = searchParams.get('debtId')

    if (!debtId) {
      return NextResponse.json({ error: 'Debt ID is required' }, { status: 400 })
    }

    const debt = await deleteUdhariDebt(debtId)
    return NextResponse.json({ debt })
  } catch (error) {
    console.error('Error deleting udhari debt:', error)
    return NextResponse.json({ error: 'Failed to delete udhari debt' }, { status: 500 })
  }
}
