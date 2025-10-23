"use server";

import {
  ACHClass,
  CountryCode,
  TransferAuthorizationCreateRequest,
  TransferCreateRequest,
  TransferNetwork,
  TransferType,
} from "plaid";

import { plaidClient } from "../plaid";
import { parseStringify } from "../utils";

import { getTransactionsByBankId } from "./transaction.actions";
import { getBanks, getBank } from "./user.actions";
import connectToDatabase from '../mongodb';
import Bank from '../models/Bank';

// Get multiple bank accounts
export const getAccounts = async ({ userId }: getAccountsProps) => {
  try {
    await connectToDatabase();

    const banks = await Bank.find({ userId });

    if (banks && banks.length > 0) {
      const accounts = banks.map((bank: any) => ({
        id: bank.accountId,
        availableBalance: 0, // Will be updated when real integration is added
        currentBalance: 0, // Will be updated when real integration is added
        institutionId: bank.bankId,
        name: 'Connected Bank Account', // Will be updated with real bank name
        officialName: 'Connected Bank Account', // Will be updated with real bank name
        mask: bank.accountId.slice(-4),
        type: 'checking',
        subtype: 'checking',
        appwriteItemId: bank._id,
        shareableId: bank.shareableId,
        cardType: bank.cardType,
      }));

      const totalBanks = accounts.length;
      const totalCurrentBalance = accounts.reduce((total: number, account: any) => {
        return total + account.currentBalance;
      }, 0);

      return parseStringify({ data: accounts, totalBanks, totalCurrentBalance });
    } else {
      // Return empty data if no banks connected
      return parseStringify({ data: [], totalBanks: 0, totalCurrentBalance: 0 });
    }
  } catch (error) {
    console.error("An error occurred while getting the accounts:", error);
  }
};

// Get one bank account
export const getAccount = async ({ appwriteItemId }: getAccountProps) => {
  try {
    await connectToDatabase();

    const bank = await Bank.findById(appwriteItemId);

    if (!bank) {
      throw new Error('Bank account not found');
    }

    // Get transactions for this bank account
    const transactions = await getTransactionsByBankId({ bankId: bank.accountId });

    const account = {
      id: bank.accountId,
      availableBalance: 0, // Will be updated when real integration is added
      currentBalance: 0, // Will be updated when real integration is added
      institutionId: bank.bankId,
      name: 'Connected Bank Account', // Will be updated with real bank name
      officialName: 'Connected Bank Account', // Will be updated with real bank name
      mask: bank.accountId.slice(-4),
      type: 'checking',
      subtype: 'checking',
      appwriteItemId: bank._id,
      shareableId: bank.shareableId,
      cardType: bank.cardType,
    };

    return parseStringify({
      data: account,
      transactions: transactions.documents || [],
    });
  } catch (error) {
    console.error("An error occurred while getting the account:", error);
  }
};

// Get bank info
export const getInstitution = async ({
  institutionId,
}: getInstitutionProps) => {
  try {
    await connectToDatabase();

    // For now, return mock institution data but this should be updated to fetch from MongoDB
    // when real bank integration is implemented
    const mockInstitutions: { [key: string]: any } = {
      'mock-bank-1': {
        institution_id: 'mock-bank-1',
        name: 'State Bank of India',
        logo: null,
        primary_color: '#1e40af'
      },
      'mock-bank-2': {
        institution_id: 'mock-bank-2',
        name: 'HDFC Bank',
        logo: null,
        primary_color: '#dc2626'
      },
      'mock-bank-3': {
        institution_id: 'mock-bank-3',
        name: 'ICICI Bank',
        logo: null,
        primary_color: '#ea580c'
      },
      'mock-bank-4': {
        institution_id: 'mock-bank-4',
        name: 'Axis Bank',
        logo: null,
        primary_color: '#16a34a'
      },
      'mock-bank-5': {
        institution_id: 'mock-bank-5',
        name: 'Punjab National Bank',
        logo: null,
        primary_color: '#7c3aed'
      }
    };

    return parseStringify(mockInstitutions[institutionId] || mockInstitutions['mock-bank-1']);
  } catch (error) {
    console.error("An error occurred while getting the accounts:", error);
  }
};

// Get transactions
export const getTransactions = async ({
  accessToken,
}: getTransactionsProps) => {
  try {
    await connectToDatabase();

    // For now, return mock transactions but this should be updated to fetch from MongoDB
    // when real transaction integration is implemented
    const transactions = [
      {
        id: 'txn-mock-1',
        name: 'Online Purchase',
        paymentChannel: 'online',
        type: 'debit',
        accountId: 'mock-account-1',
        amount: -1200,
        pending: false,
        category: 'Shopping',
        date: '2024-01-12',
        image: null,
      },
      {
        id: 'txn-mock-2',
        name: 'ATM Withdrawal',
        paymentChannel: 'atm',
        type: 'debit',
        accountId: 'mock-account-1',
        amount: -5000,
        pending: false,
        category: 'Cash',
        date: '2024-01-11',
        image: null,
      }
    ];

    return parseStringify(transactions);
  } catch (error) {
    console.error("An error occurred while getting the accounts:", error);
  }
};
