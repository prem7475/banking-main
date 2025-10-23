import { NextRequest, NextResponse } from 'next/server';
import { signIn } from '@/lib/actions/user.actions';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    const user = await signIn({ email, password });

    return NextResponse.json({ success: true, user });
  } catch (error: any) {
    console.error('Signin error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
