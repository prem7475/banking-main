'use client'

import Link from 'next/link'
import TransactionsTable from './TransactionsTable'
import { Pagination } from './Pagination'
import TransactionDetailsModal from './TransactionDetailsModal'
import { useState } from 'react'

const RecentTransactions = ({
  accounts,
  transactions = [],
  appwriteItemId,
  page = 1,
}: RecentTransactionsProps) => {
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Combine all transactions from all accounts and sort by date (newest first)
  const allTransactions = accounts?.flatMap(account =>
    account.transactions || []
  ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) || []

  const rowsPerPage = 10;
  const totalPages = Math.ceil(allTransactions.length / rowsPerPage);

  const indexOfLastTransaction = page * rowsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - rowsPerPage;

  const currentTransactions = allTransactions.slice(
    indexOfFirstTransaction, indexOfLastTransaction
  )

  const handleTransactionClick = (transaction: any) => {
    setSelectedTransaction(transaction)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedTransaction(null)
  }

  return (
    <section className="recent-transactions">
      <header className="flex items-center justify-between">
        <h2 className="recent-transactions-label">Recent transactions</h2>
        <Link
          href={`/transaction-history/?id=${appwriteItemId}`}
          className="view-all-btn"
        >
          View all
        </Link>
      </header>

      {/* Unified Recent Transactions - All Banks Together */}
      <div className="space-y-4">
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <h3 className="text-lg font-semibold mb-4">All Transactions</h3>
          <TransactionsTable
            transactions={currentTransactions}
            onTransactionClick={handleTransactionClick}
          />

          {totalPages > 1 && (
            <div className="my-4 w-full">
              <Pagination totalPages={totalPages} page={page} />
            </div>
          )}
        </div>
      </div>

      {/* Transaction Details Modal */}
      <TransactionDetailsModal
        isOpen={isModalOpen}
        onClose={closeModal}
        transaction={selectedTransaction}
        accounts={accounts}
      />
    </section>
  )
}

export default RecentTransactions
