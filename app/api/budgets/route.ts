import { NextRequest, NextResponse } from 'next/server'
import { getBudgets, createBudget, updateBudget, deleteBudget } from '@/lib/actions/budget.actions'

export async function GET() {
  try {
    const budgets = await getBudgets()
    return NextResponse.json({ budgets })
  } catch (error) {
    console.error('Error fetching budgets:', error)
    return NextResponse.json({ error: 'Failed to fetch budgets' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { category, monthlyLimit, alertThreshold } = body

    if (!category || !monthlyLimit) {
      return NextResponse.json({ error: 'Category and monthly limit are required' }, { status: 400 })
    }

    const budget = await createBudget({
      category,
      monthlyLimit: parseFloat(monthlyLimit),
      alertThreshold: parseInt(alertThreshold) || 90,
    })

    return NextResponse.json({ budget }, { status: 201 })
  } catch (error) {
    console.error('Error creating budget:', error)
    return NextResponse.json({ error: 'Failed to create budget' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, category, monthlyLimit, alertThreshold } = body

    if (!id) {
      return NextResponse.json({ error: 'Budget ID is required' }, { status: 400 })
    }

    const budget = await updateBudget(id, {
      category,
      monthlyLimit: monthlyLimit ? parseFloat(monthlyLimit) : undefined,
      alertThreshold: alertThreshold ? parseInt(alertThreshold) : undefined,
    })

    return NextResponse.json({ budget })
  } catch (error) {
    console.error('Error updating budget:', error)
    return NextResponse.json({ error: 'Failed to update budget' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Budget ID is required' }, { status: 400 })
    }

    const budget = await deleteBudget(id)
    return NextResponse.json({ budget })
  } catch (error) {
    console.error('Error deleting budget:', error)
    return NextResponse.json({ error: 'Failed to delete budget' }, { status: 500 })
  }
}
