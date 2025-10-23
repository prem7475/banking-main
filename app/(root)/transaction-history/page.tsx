'use client'

import HeaderBox from '@/components/HeaderBox'
import { Pagination } from '@/components/Pagination';
import TransactionsTable from '@/components/TransactionsTable';
import TransactionDetailsModal from '@/components/TransactionDetailsModal';
import { formatAmount } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import React, { useState } from 'react'

const TransactionHistory = ({ searchParams: { id, page }}:SearchParamProps) => {
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [selectedBank, setSelectedBank] = useState<string>('all');
  const currentPage = Number(page as string) || 1;

  // Mock user data
  const mockUser = {
    $id: "mock-user-id",
    userId: "mock-user-id",
    firstName: "Prem",
    lastName: "Narayani",
    email: "prem.narayani@gmail.com",
    name: "Prem Narayani",
    dwollaCustomerUrl: "",
    dwollaCustomerId: "",
    address1: "",
    city: "",
    state: "",
    postalCode: "",
    dateOfBirth: "",
    ssn: "",
  };

  // Mock accounts data (same as home page and my-banks page)
  const mockAccounts = [
    {
      id: "mock-account-1",
      availableBalance: 4500,
      currentBalance: 4500,
      institutionId: "mock-bank-1",
      name: "State Bank of India Savings",
      officialName: "State Bank of India",
      mask: "1234",
      type: "checking",
      subtype: "checking",
      appwriteItemId: "mock-appwrite-1",
      shareableId: "mock-sharable-1",
    },
    {
      id: "mock-account-2",
      availableBalance: 3200,
      currentBalance: 3200,
      institutionId: "mock-bank-2",
      name: "HDFC Bank Current Account",
      officialName: "HDFC Bank Ltd",
      mask: "5678",
      type: "checking",
      subtype: "checking",
      appwriteItemId: "mock-appwrite-2",
      shareableId: "mock-sharable-2",
    },
    {
      id: "mock-account-3",
      availableBalance: 6800,
      currentBalance: 6800,
      institutionId: "mock-bank-3",
      name: "ICICI Bank Savings Plus",
      officialName: "ICICI Bank Ltd",
      mask: "9012",
      type: "savings",
      subtype: "savings",
      appwriteItemId: "mock-appwrite-3",
      shareableId: "mock-sharable-3",
    },
    {
      id: "mock-account-4",
      availableBalance: 2900,
      currentBalance: 2900,
      institutionId: "mock-bank-4",
      name: "Axis Bank Salary Account",
      officialName: "Axis Bank Ltd",
      mask: "3456",
      type: "checking",
      subtype: "checking",
      appwriteItemId: "mock-appwrite-4",
      shareableId: "mock-sharable-4",
    },
    {
      id: "mock-account-5",
      availableBalance: 5100,
      currentBalance: 5100,
      institutionId: "mock-bank-5",
      name: "Punjab National Bank",
      officialName: "Punjab National Bank",
      mask: "7890",
      type: "checking",
      subtype: "checking",
      appwriteItemId: "mock-appwrite-5",
      shareableId: "mock-sharable-5",
    },
  ];

  const accountsData = mockAccounts;
  const appwriteItemId = (id as string) || accountsData[0]?.appwriteItemId;

  // Mock transactions for all banks
  const allTransactions = [
    // SBI Transactions
    {
      $id: "mock-transaction-1",
      id: "mock-transaction-1",
      name: "Grocery Store",
      paymentChannel: "online",
      channel: "online",
      type: "debit",
      accountId: "mock-account-1",
      amount: -2500,
      pending: false,
      category: "Food and Drink",
      date: new Date().toISOString(),
      $createdAt: new Date().toISOString(),
      image: "",
      senderBankId: "mock-account-1",
      receiverBankId: "external-bank",
    },
    {
      $id: "mock-transaction-2",
      id: "mock-transaction-2",
      name: "Salary Deposit",
      paymentChannel: "online",
      channel: "online",
      type: "credit",
      accountId: "mock-account-1",
      amount: 50000,
      pending: false,
      category: "Income",
      date: new Date().toISOString(),
      $createdAt: new Date().toISOString(),
      image: "",
      senderBankId: "external-bank",
      receiverBankId: "mock-account-1",
    },
    // HDFC Transactions
    {
      $id: "mock-transaction-3",
      id: "mock-transaction-3",
      name: "UPI Payment to Merchant",
      paymentChannel: "online",
      channel: "online",
      type: "debit",
      accountId: "mock-account-2",
      amount: -1500,
      pending: false,
      category: "Transfer",
      date: new Date().toISOString(),
      $createdAt: new Date().toISOString(),
      image: "",
      senderBankId: "mock-account-2",
      receiverBankId: "external-bank",
    },
    {
      $id: "mock-transaction-4",
      id: "mock-transaction-4",
      name: "ATM Withdrawal",
      paymentChannel: "atm",
      channel: "atm",
      type: "debit",
      accountId: "mock-account-2",
      amount: -2000,
      pending: false,
      category: "Cash",
      date: new Date().toISOString(),
      $createdAt: new Date().toISOString(),
      image: "",
      senderBankId: "mock-account-2",
      receiverBankId: "external-bank",
    },
    // ICICI Transactions
    {
      $id: "mock-transaction-5",
      id: "mock-transaction-5",
      name: "Online Shopping",
      paymentChannel: "online",
      channel: "online",
      type: "debit",
      accountId: "mock-account-3",
      amount: -3500,
      pending: false,
      category: "Shopping",
      date: new Date().toISOString(),
      $createdAt: new Date().toISOString(),
      image: "",
      senderBankId: "mock-account-3",
      receiverBankId: "external-bank",
    },
    {
      $id: "mock-transaction-6",
      id: "mock-transaction-6",
      name: "Freelance Payment",
      paymentChannel: "online",
      channel: "online",
      type: "credit",
      accountId: "mock-account-3",
      amount: 8000,
      pending: false,
      category: "Income",
      date: new Date().toISOString(),
      $createdAt: new Date().toISOString(),
      image: "",
      senderBankId: "external-bank",
      receiverBankId: "mock-account-3",
    },
    // Axis Bank Transactions
    {
      $id: "mock-transaction-7",
      id: "mock-transaction-7",
      name: "Electricity Bill Payment",
      paymentChannel: "online",
      channel: "online",
      type: "debit",
      accountId: "mock-account-4",
      amount: -1200,
      pending: false,
      category: "Utilities",
      date: new Date().toISOString(),
      $createdAt: new Date().toISOString(),
      image: "",
      senderBankId: "mock-account-4",
      receiverBankId: "external-bank",
    },
    {
      $id: "mock-transaction-8",
      id: "mock-transaction-8",
      name: "Monthly Salary",
      paymentChannel: "online",
      channel: "online",
      type: "credit",
      accountId: "mock-account-4",
      amount: 45000,
      pending: false,
      category: "Income",
      date: new Date().toISOString(),
      $createdAt: new Date().toISOString(),
      image: "",
      senderBankId: "external-bank",
      receiverBankId: "mock-account-4",
    },
    // Punjab National Bank Transactions
    {
      $id: "mock-transaction-9",
      id: "mock-transaction-9",
      name: "Mobile Recharge",
      paymentChannel: "online",
      channel: "online",
      type: "debit",
      accountId: "mock-account-5",
      amount: -500,
      pending: false,
      category: "Utilities",
      date: new Date().toISOString(),
      $createdAt: new Date().toISOString(),
      image: "",
      senderBankId: "mock-account-5",
      receiverBankId: "external-bank",
    },
    {
      $id: "mock-transaction-10",
      id: "mock-transaction-10",
      name: "Investment Returns",
      paymentChannel: "online",
      channel: "online",
      type: "credit",
      accountId: "mock-account-5",
      amount: 2500,
      pending: false,
      category: "Investment",
      date: new Date().toISOString(),
      $createdAt: new Date().toISOString(),
      image: "",
      senderBankId: "external-bank",
      receiverBankId: "mock-account-5",
    },
  ];

  // Filter transactions based on selected bank
  const filteredTransactions = selectedBank === 'all'
    ? allTransactions
    : allTransactions.filter(t => t.accountId === selectedBank);

  // Calculate spending per bank
  const bankSpending = accountsData.map(account => {
    const accountTransactions = allTransactions.filter(t => t.accountId === account.id);
    const totalSpent = accountTransactions
      .filter(t => t.amount < 0)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
    return {
      ...account,
      totalSpent,
    };
  });

  const rowsPerPage = 10;
  const totalPages = Math.ceil(filteredTransactions.length / rowsPerPage);

  const indexOfLastTransaction = currentPage * rowsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - rowsPerPage;

  const currentTransactions = filteredTransactions.slice(
    indexOfFirstTransaction, indexOfLastTransaction
  )
  return (
    <div className="transactions">
      <div className="transactions-header">
        <HeaderBox 
          title="Transaction History"
          subtext="See your bank details and transactions."
        />
      </div>

      <div className="space-y-6">
        {/* Bank Filter */}
        <Card>
          <CardHeader>
            <CardTitle>Filter by Bank</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={selectedBank} onValueChange={setSelectedBank}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a bank" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Banks</SelectItem>
                {accountsData.map((account) => (
                  <SelectItem key={account.id} value={account.id}>
                    {account.officialName} - ₹{account.totalSpent} spent
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Bank Spending Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {bankSpending.map((bank) => (
            <Card key={bank.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold">{bank.officialName}</h3>
                    <p className="text-sm text-gray-600">Current Balance: ₹{bank.currentBalance}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-red-600">Spent: ₹{bank.totalSpent}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <section className="flex w-full flex-col gap-6">
          <TransactionsTable
            transactions={currentTransactions}
            onTransactionClick={setSelectedTransaction}
          />
            {totalPages > 1 && (
              <div className="my-4 w-full">
                <Pagination totalPages={totalPages} page={currentPage} />
              </div>
            )}
        </section>

        {selectedTransaction && (
          <TransactionDetailsModal
            isOpen={true}
            transaction={selectedTransaction}
            accounts={accountsData}
            onClose={() => setSelectedTransaction(null)}
          />
        )}
      </div>
    </div>
  )
}

export default TransactionHistory