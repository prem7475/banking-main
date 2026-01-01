'use client'
import React, { useState } from 'react'
import { useAppContext } from '@/lib/context/AppContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useRouter } from 'next/navigation'

const PaymentTransfer = () => {
  const router = useRouter()
  const { bankAccounts, addTransaction, userProfile } = useAppContext()
  
  const [amount, setAmount] = useState('')
  const [sourceId, setSourceId] = useState('')
  const [recipientName, setRecipientName] = useState('')
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')

  const handleTransfer = () => {
    if(!amount || !sourceId || !recipientName || !pin) return
    
    if(pin !== userProfile.upiPin) {
        setError("Invalid PIN")
        return
    }

    const bank = bankAccounts.find(b => b.id === sourceId)
    if(bank && bank.balance < parseFloat(amount)) {
        setError("Insufficient Balance")
        return
    }

    addTransaction({
        id: Date.now().toString(),
        amount: parseFloat(amount),
        type: 'debit',
        category: 'Transfer',
        description: `Transfer to ${recipientName}`,
        date: new Date().toISOString(),
        paymentMethod: 'bank',
        sourceId: sourceId,
        status: 'success'
    })

    router.push('/transaction-history')
  }

  return (
    <div className="p-8 space-y-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-white">Transfer Funds</h1>

      <Card className="bg-zinc-900 border-zinc-800 text-white">
        <CardHeader>
            <CardTitle>Send Money</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
            
            {/* Source Account */}
            <div className="space-y-2">
                <label className="text-sm text-zinc-400">Debit From</label>
                <Select onValueChange={setSourceId}>
                    <SelectTrigger className="bg-black border-zinc-700 text-white">
                        <SelectValue placeholder="Select Bank Account" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-900 border-zinc-700 text-white">
                        {bankAccounts.map(b => (
                            <SelectItem key={b.id} value={b.id}>{b.bankName} (₹{b.balance})</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Recipient */}
            <div className="space-y-2">
                <label className="text-sm text-zinc-400">Recipient Name / UPI ID</label>
                <Input 
                    className="bg-black border-zinc-700 text-white" 
                    placeholder="e.g. Rahul or rahul@upi"
                    value={recipientName}
                    onChange={e => setRecipientName(e.target.value)}
                />
            </div>

            {/* Amount */}
            <div className="space-y-2">
                <label className="text-sm text-zinc-400">Amount</label>
                <Input 
                    type="number"
                    className="bg-black border-zinc-700 text-white text-lg font-bold" 
                    placeholder="₹ 0.00"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                />
            </div>

            {/* PIN */}
            <div className="space-y-2">
                <label className="text-sm text-zinc-400">Enter UPI PIN</label>
                <Input 
                    type="password"
                    maxLength={4}
                    className="bg-black border-zinc-700 text-white" 
                    placeholder="****"
                    value={pin}
                    onChange={e => setPin(e.target.value)}
                />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <Button onClick={handleTransfer} className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-4">
                Transfer Now
            </Button>
        </CardContent>
      </Card>
    </div>
  )
}

export default PaymentTransfer