'use client'
import React, { useState } from 'react'
import { useAppContext, BankAccount } from '@/lib/context/AppContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Trash2, Plus, CreditCard } from 'lucide-react'

const MyBanks = () => {
  const { bankAccounts, addBankAccount, removeBankAccount } = useAppContext()
  const [newBank, setNewBank] = useState({ name: '', acct: '', ifsc: '' })

  const handleAdd = () => {
    if (!newBank.name || !newBank.acct) return
    const account: BankAccount = {
      id: Math.random().toString(36).substr(2, 9),
      bankName: newBank.name,
      accountName: 'Savings',
      accountNumber: newBank.acct,
      ifscCode: newBank.ifsc || 'SBIN0001234',
      balance: 10000, 
      type: 'savings',
      status: 'active'
    }
    addBankAccount(account)
    setNewBank({ name: '', acct: '', ifsc: '' })
  }

  return (
    <div className="p-8 space-y-8 bg-black min-h-full text-white">
      <header>
        <h1 className="text-3xl font-bold">My Bank Accounts</h1>
        <p className="text-zinc-400 mt-1">Manage your linked savings and current accounts.</p>
      </header>

      {/* Grid for Accounts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bankAccounts.map((bank) => (
          // CARD STYLE: Dark Zinc with Blue Gradient Border Effect
          <Card key={bank.id} className="relative overflow-hidden bg-zinc-900 border-zinc-800 text-white shadow-xl group hover:border-blue-500/50 transition-all duration-300">
            {/* Subtle Gradient Overlay */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 blur-[50px] rounded-full -mr-10 -mt-10 pointer-events-none"></div>

            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold tracking-tight">{bank.bankName}</CardTitle>
                <p className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">Savings Account</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
                <CreditCard size={20} />
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="mt-4 space-y-1">
                <p className="text-sm text-zinc-400">Available Balance</p>
                <div className="text-2xl font-bold text-white tracking-tight">₹ {bank.balance.toLocaleString()}</div>
              </div>
              
              <div className="mt-6 pt-4 border-t border-zinc-800 flex justify-between items-center">
                 <p className="text-xs text-zinc-500 font-mono">**** {bank.accountNumber.slice(-4)}</p>
                 <p className="text-xs text-zinc-500 font-mono">{bank.ifscCode}</p>
              </div>

              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute top-3 right-3 text-zinc-600 hover:text-red-500 hover:bg-red-500/10 transition-colors"
                onClick={() => removeBankAccount(bank.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </CardContent>
          </Card>
        ))}

        {/* Add New Bank Card (Empty State Style) */}
        <Card className="bg-zinc-900/50 border border-dashed border-zinc-800 flex flex-col items-center justify-center text-zinc-500 p-6 min-h-[200px] hover:bg-zinc-900 hover:border-zinc-700 transition-all cursor-pointer group" onClick={() => document.getElementById('add-bank-form')?.focus()}>
            <div className="h-12 w-12 rounded-full bg-zinc-800 flex items-center justify-center mb-3 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Plus size={24} />
            </div>
            <p className="font-medium">Link New Account</p>
        </Card>
      </div>

      {/* Form Section */}
      <div id="add-bank-form" className="max-w-xl">
        <h3 className="text-xl font-bold mb-4">Link a new account</h3>
        <Card className="bg-zinc-900 border-zinc-800 p-6">
            <div className="space-y-4">
            
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-xs font-medium text-zinc-400 ml-1">Bank Name</label>
                    <Input 
                        placeholder="e.g. HDFC Bank" 
                        value={newBank.name} 
                        onChange={e => setNewBank({ ...newBank, name: e.target.value })} 
                        className="bg-black border-zinc-700 text-white placeholder:text-zinc-600 focus-visible:ring-blue-600"
                    />
                </div>
                 <div className="space-y-2">
                    <label className="text-xs font-medium text-zinc-400 ml-1">IFSC Code</label>
                    <Input 
                        placeholder="e.g. HDFC000123" 
                        value={newBank.ifsc} 
                        onChange={e => setNewBank({ ...newBank, ifsc: e.target.value })} 
                        className="bg-black border-zinc-700 text-white placeholder:text-zinc-600 focus-visible:ring-blue-600"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-xs font-medium text-zinc-400 ml-1">Account Number</label>
                <Input 
                    placeholder="Enter full account number" 
                    value={newBank.acct} 
                    onChange={e => setNewBank({ ...newBank, acct: e.target.value })} 
                    className="bg-black border-zinc-700 text-white placeholder:text-zinc-600 focus-visible:ring-blue-600"
                />
            </div>

            <Button onClick={handleAdd} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-6 mt-2">
                Verify & Add Account
            </Button>
            </div>
        </Card>
      </div>
    </div>
  )
}

export default MyBanks