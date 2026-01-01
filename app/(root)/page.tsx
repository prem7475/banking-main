'use client'

import React from 'react'
import { useAppContext } from '@/lib/context/AppContext'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Eye, ArrowUpRight, ArrowDownLeft, Wallet, CreditCard } from 'lucide-react'
import Link from 'next/link'

const Dashboard = () => {
  const { userProfile, bankAccounts, creditCards, transactions } = useAppContext()

  const totalBankBalance = bankAccounts.reduce((acc, curr) => acc + curr.balance, 0)
  const totalCreditLimit = creditCards.reduce((acc, curr) => acc + curr.limit, 0)
  const availableCredit = creditCards.reduce((acc, curr) => acc + (curr.limit - curr.balance), 0)
  const recentTransactions = transactions.slice(0, 5)

  return (
    <div className="p-6 md:p-10 space-y-8 bg-black min-h-full">
      
      {/* Header */}
      <header>
        <h1 className="text-3xl font-bold text-white">
          Welcome, <span className="text-blue-500">{userProfile.fullName}</span>
        </h1>
        <p className="text-zinc-400 mt-1">Here is your financial overview.</p>
      </header>

      {/* Cards Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Bank Card */}
        <div className="rounded-2xl bg-zinc-900 p-6 border border-zinc-800 relative overflow-hidden group hover:border-zinc-700 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-blue-500/10 rounded-full text-blue-500">
                <Wallet size={24} />
            </div>
            <Link href="/my-banks">
                <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-white">View All</Button>
            </Link>
          </div>
          <p className="text-zinc-400 text-sm">Total Balance</p>
          <h2 className="text-4xl font-bold text-white mt-1">₹{totalBankBalance.toLocaleString()}</h2>
          <div className="absolute -bottom-6 -right-6 text-zinc-800 opacity-50">
             <Wallet size={120} />
          </div>
        </div>

        {/* Credit Card Box */}
        <div className="rounded-2xl bg-zinc-900 p-6 border border-zinc-800 relative overflow-hidden hover:border-zinc-700 transition-colors">
          <div className="flex justify-between items-start mb-4">
             <div className="p-3 bg-purple-500/10 rounded-full text-purple-500">
                <CreditCard size={24} />
            </div>
            <Link href="/credit-cards">
                <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-white">View All</Button>
            </Link>
          </div>
          <p className="text-zinc-400 text-sm">Available Credit</p>
          <h2 className="text-4xl font-bold text-white mt-1">₹{availableCredit.toLocaleString()}</h2>
          <p className="text-xs text-zinc-500 mt-2">Total Limit: ₹{totalCreditLimit.toLocaleString()}</p>
        </div>
      </div>

      {/* Transactions & Bank List Split */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Left: Transactions */}
        <div className="xl:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Recent Transactions</h2>
            <Link href="/transaction-history" className="text-sm text-blue-400 hover:text-blue-300">View History</Link>
          </div>
          
          <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
            <Table>
              <TableHeader className="bg-zinc-950">
                <TableRow className="border-zinc-800 hover:bg-zinc-950">
                  <TableHead className="text-zinc-400">Transaction</TableHead>
                  <TableHead className="text-zinc-400">Amount</TableHead>
                  <TableHead className="text-zinc-400">Date</TableHead>
                  <TableHead className="text-zinc-400">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentTransactions.length === 0 ? (
                    <TableRow><TableCell colSpan={4} className="text-center py-8 text-zinc-500">No transactions yet</TableCell></TableRow>
                ) : (
                    recentTransactions.map((t) => (
                    <TableRow key={t.id} className="border-zinc-800 hover:bg-zinc-800/50">
                        <TableCell className="text-white font-medium">
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-full ${t.type === 'debit' ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'}`}>
                                    {t.type === 'debit' ? <ArrowUpRight size={16}/> : <ArrowDownLeft size={16}/>}
                                </div>
                                {t.description || t.category}
                            </div>
                        </TableCell>
                        <TableCell className={`font-bold ${t.type === 'debit' ? 'text-white' : 'text-green-500'}`}>
                             {t.type === 'debit' ? '-' : '+'}₹{t.amount.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-zinc-400 text-sm">{new Date(t.date).toLocaleDateString()}</TableCell>
                        <TableCell>
                             <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-500 border border-green-500/20">
                                Success
                             </span>
                        </TableCell>
                    </TableRow>
                    ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Right: Quick Bank List */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
             <h2 className="text-xl font-semibold text-white">My Banks</h2>
             <Link href="/my-banks" className="text-blue-400 text-sm">+ Add</Link>
          </div>

          <div className="space-y-3">
            {bankAccounts.map((bank) => (
                <div key={bank.id} className="bg-zinc-900 p-4 rounded-xl border border-zinc-800 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
                            {bank.bankName.substring(0,2).toUpperCase()}
                        </div>
                        <div>
                            <p className="font-semibold text-white">{bank.bankName}</p>
                            <p className="text-xs text-zinc-500">**** {bank.accountNumber.slice(-4)}</p>
                        </div>
                    </div>
                    <p className="text-white font-medium">₹{bank.balance.toLocaleString()}</p>
                </div>
            ))}
            {bankAccounts.length === 0 && <p className="text-zinc-500 text-sm">No banks linked.</p>}
          </div>
        </div>

      </div>
    </div>
  )
}

export default Dashboard