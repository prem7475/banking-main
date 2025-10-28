import { NextRequest, NextResponse } from 'next/server'
import {
  categorizeBankTransaction,
  getUncategorizedTransactions,
  autoCategorizeTransaction,
  bulkCategorizeTransactions
} from '@/lib/actions/plaidCategorization.actions'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')

    if (type === 'uncategorized') {
      const transactions = await getUncategorizedTransactions()
      return NextResponse.json({ transactions })
    }

    return NextResponse.json({ error: 'Invalid type parameter' }, { status: 400 })
  } catch (error) {
    console.error('Error fetching uncategorized transactions:', error)
    return NextResponse.json({ error: 'Failed to fetch transactions' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { transactionId, category, bulkCategorizations } = body

    if (bulkCategorizations && Array.isArray(bulkCategorizations)) {
      // Bulk categorization
      const results = await bulkCategorizeTransactions(bulkCategorizations)
      return NextResponse.json({ results })
    }

    if (!transactionId || !category) {
      return NextResponse.json({ error: 'Transaction ID and category are required' }, { status: 400 })
    }

    const transaction = await categorizeBankTransaction(transactionId, category)
    return NextResponse.json({ transaction })
  } catch (error) {
    console.error('Error categorizing transaction:', error)
    return NextResponse.json({ error: 'Failed to categorize transaction' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { transactionName, amount } = body

    if (!transactionName) {
      return NextResponse.json({ error: 'Transaction name is required' }, { status: 400 })
    }

    const suggestedCategory = await autoCategorizeTransaction(transactionName, amount || 0)
    return NextResponse.json({ category: suggestedCategory })
  } catch (error) {
    console.error('Error getting category suggestion:', error)
    return NextResponse.json({ error: 'Failed to get category suggestion' }, { status: 500 })
  }
}
