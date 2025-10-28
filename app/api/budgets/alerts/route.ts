import { NextResponse } from 'next/server'
import { getBudgetAlerts } from '@/lib/actions/budget.actions'

export async function GET() {
  try {
    const alerts = await getBudgetAlerts()
    return NextResponse.json({ alerts })
  } catch (error) {
    console.error('Error fetching budget alerts:', error)
    return NextResponse.json({ error: 'Failed to fetch budget alerts' }, { status: 500 })
  }
}
