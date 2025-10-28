import { NextRequest, NextResponse } from 'next/server';
import { getLoggedInUser, getBanks } from '@/lib/actions/user.actions';

export async function GET(request: NextRequest) {
  try {
    const user = await getLoggedInUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const banks = await getBanks({ userId: user.userId });

    return NextResponse.json({ banks });
  } catch (error) {
    console.error('Error fetching banks:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
