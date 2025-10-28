import { NextRequest, NextResponse } from 'next/server';
import { getLoggedInUser, getBankByAccountId } from '@/lib/actions/user.actions';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const { accountId, pin } = await request.json();

    if (!accountId || !pin) {
      return NextResponse.json({ error: 'Account ID and PIN are required' }, { status: 400 });
    }

    const user = await getLoggedInUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const bank = await getBankByAccountId({ accountId });
    if (!bank || bank.userId !== user.userId) {
      return NextResponse.json({ error: 'Bank account not found' }, { status: 404 });
    }

    // Compare the entered PIN with the hashed PIN from the bank document
    const isValidPin = await bcrypt.compare(pin, bank.hashedUpiPin);
    if (!isValidPin) {
      return NextResponse.json({ error: 'Invalid PIN' }, { status: 401 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error validating PIN:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
