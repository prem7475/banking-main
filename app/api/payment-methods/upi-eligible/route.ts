import { NextRequest, NextResponse } from 'next/server';
import { getLoggedInUser } from '@/lib/actions/user.actions';
import Bank from '@/lib/models/Bank';
import CreditCard from '@/lib/models/CreditCard';
import connectToDatabase from '@/lib/mongodb';

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const user = await getLoggedInUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get all bank accounts
    const banks = await Bank.find({ userId: user.userId });

    // Get ONLY Rupay credit cards
    const rupayCards = await CreditCard.find({
      userId: user.userId,
      cardNetwork: 'rupay'
    });

    // Combine them into one list with type field
    const formattedBanks = banks.map(bank => ({
      ...bank.toObject(),
      _id: bank._id.toString(),
      type: 'Bank'
    }));

    const formattedCards = rupayCards.map(card => ({
      ...card.toObject(),
      _id: card._id.toString(),
      type: 'Credit Card'
    }));

    const eligibleMethods = [...formattedBanks, ...formattedCards];

    return NextResponse.json({ methods: eligibleMethods });
  } catch (error) {
    console.error('Error fetching UPI eligible methods:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
