import { NextRequest, NextResponse } from 'next/server';
import { signUp } from '@/lib/actions/user.actions';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, password, upiPin, address1, city, state, postalCode, dateOfBirth, panNumber } = body;

    const userData = {
      firstName,
      lastName,
      email,
      password,
      upiPin,
      address1,
      city,
      state,
      postalCode,
      dateOfBirth,
      panNumber
    };

    const newUser = await signUp(userData);

    return NextResponse.json({ success: true, user: newUser });
  } catch (error: any) {
    console.error('Signup error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
