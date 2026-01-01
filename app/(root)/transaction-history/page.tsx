'use client'
import React from 'react'
import { useAppContext } from '@/lib/context/AppContext'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const TransactionHistory = () => {
  const { transactions } = useAppContext()

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Transaction History</h1>
      <div className="border rounded-lg overflow-hidden bg-white shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Description</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="text-center py-8 text-gray-500">No transactions found</TableCell></TableRow>
            ) : (
              transactions.map((t) => (
                <TableRow key={t.id}>
                  <TableCell className="font-medium">{t.description}</TableCell>
                  <TableCell className="text-gray-500 text-sm">{new Date(t.date).toLocaleDateString()}</TableCell>
                  <TableCell className="capitalize text-sm">{t.paymentMethod.replace('-', ' ')}</TableCell>
                  <TableCell>
                    <span className="bg-gray-100 px-2 py-1 rounded text-xs">{t.category}</span>
                  </TableCell>
                  <TableCell className={`text-right font-bold ${t.type === 'debit' ? 'text-red-600' : 'text-green-600'}`}>
                    {t.type === 'debit' ? '-' : '+'} ₹{t.amount.toLocaleString()}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export default TransactionHistory