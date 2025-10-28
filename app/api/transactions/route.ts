import { NextRequest, NextResponse } from 'next/server';
import { getLoggedInUser } from '@/lib/actions/user.actions';
import { getTransactions } from '@/lib/actions/transaction.actions';

export async function GET(request: NextRequest) {
  try {
    const user = await getLoggedInUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const transactions = await getTransactions({ userId: user.userId });

    return NextResponse.json({ transactions });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
