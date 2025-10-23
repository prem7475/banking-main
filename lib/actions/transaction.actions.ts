"use server";

import connectToDatabase from '../mongodb';
import Transaction from '../models/Transaction';
import { parseStringify } from "../utils";

export const createTransaction = async (transaction: CreateTransactionProps) => {
  try {
    await connectToDatabase();

    const newTransaction = new Transaction({
      channel: 'online',
      category: 'Transfer',
      type: transaction.amount > 0 ? 'credit' : 'debit',
      paymentChannel: 'online',
      pending: false,
      date: new Date(),
      image: '',
      ...transaction
    });

    await newTransaction.save();

    return parseStringify(newTransaction);
  } catch (error) {
    console.log(error);
  }
}

export const getTransactionsByBankId = async ({bankId}: getTransactionsByBankIdProps) => {
  try {
    await connectToDatabase();

    const senderTransactions = await Transaction.find({ senderBankId: bankId });
    const receiverTransactions = await Transaction.find({ receiverBankId: bankId });

    const transactions = {
      total: senderTransactions.length + receiverTransactions.length,
      documents: [
        ...senderTransactions,
        ...receiverTransactions,
      ]
    }

    return parseStringify(transactions);
  } catch (error) {
    console.log(error);
  }
}

// New function to get all transactions from all banks
export const getAllTransactions = async () => {
  try {
    await connectToDatabase();

    const transactions = await Transaction.find({})
      .sort({ createdAt: -1 }) // Sort by newest first
      .limit(50); // Limit to recent 50 transactions

    return parseStringify({
      total: transactions.length,
      documents: transactions
    });
  } catch (error) {
    console.log(error);
  }
}

// Get transactions by user ID
export const getTransactions = async ({ userId }: { userId: string }) => {
  try {
    await connectToDatabase();

    const transactions = await Transaction.find({ userId })
      .sort({ createdAt: -1 }) // Sort by newest first
      .limit(50); // Limit to recent 50 transactions

    return parseStringify(transactions);
  } catch (error) {
    console.log(error);
  }
}
