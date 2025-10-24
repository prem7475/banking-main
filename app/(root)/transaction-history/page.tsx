'use client'

import HeaderBox from '@/components/HeaderBox'
import { Pagination } from '@/components/Pagination';
import TransactionsTable from '@/components/TransactionsTable';
import TransactionDetailsModal from '@/components/TransactionDetailsModal';
import { formatAmount } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import React, { useState } from 'react'
import { useAppContext } from '@/lib/context/AppContext'

const TransactionHistory = ({ searchParams: { id, page }}:SearchParamProps) => {
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [selectedBank, setSelectedBank] = useState<string>('all');
  const currentPage = Number(page as string) || 1;

  const { bankAccounts, creditCards, transactions, setTransactions } = useAppContext()

  // Use real data from context
  const accountsData = bankAccounts

  const appwriteItemId = (id as string) || accountsData[0]?.appwriteItemId;

  // Use real transactions from context
  const allTransactions = transactions

  // Filter transactions based on selected bank
  const filteredTransactions = selectedBank === 'all'
    ? allTransactions
    : allTransactions.filter(t => t.accountId === selectedBank || t.cardId === selectedBank);

  // Calculate spending per bank and card
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

  const cardSpending = creditCards.map(card => {
    const cardTransactions = allTransactions.filter(t => t.cardId === card.id);
    const totalSpent = cardTransactions
      .filter(t => t.amount < 0)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
    return {
      ...card,
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
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-blue-600">{accountsData.length}</h3>
                <p className="text-sm text-gray-600">Total Bank Accounts</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-green-600">{creditCards.length}</h3>
                <p className="text-sm text-gray-600">Total Credit Cards</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-purple-600">{allTransactions.length}</h3>
                <p className="text-sm text-gray-600">Total Transactions</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-red-600">
                  ₹{allTransactions.filter(t => t.amount < 0).reduce((sum, t) => sum + Math.abs(t.amount), 0).toLocaleString()}
                </h3>
                <p className="text-sm text-gray-600">Total Spent</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bank Filter */}
        <Card>
          <CardHeader>
            <CardTitle>Filter by Account/Card</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={selectedBank} onValueChange={setSelectedBank}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select an account or card" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Accounts & Cards</SelectItem>
                {accountsData.map((account) => (
                  <SelectItem key={account.id} value={account.id}>
                    {account.officialName} - ₹{bankSpending.find(b => b.id === account.id)?.totalSpent || 0} spent
                  </SelectItem>
                ))}
                {creditCards.map((card) => (
                  <SelectItem key={card.id} value={card.id}>
                    {card.name} (Card) - ₹{cardSpending.find(c => c.id === card.id)?.totalSpent || 0} spent
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Bank and Card Spending Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {bankSpending.map((bank) => (
            <Card key={bank.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold">{bank.officialName}</h3>
                    <p className="text-sm text-gray-600">Balance: ₹{bank.currentBalance}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-red-600">Spent: ₹{bank.totalSpent}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {cardSpending.map((card) => (
            <Card key={card.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold">{card.name}</h3>
                    <p className="text-sm text-gray-600">Limit: ₹{card.limit}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-red-600">Spent: ₹{card.totalSpent}</p>
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
