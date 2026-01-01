'use client'
import React, { useState } from 'react'
import { useAppContext, CreditCard } from '@/lib/context/AppContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from '@/components/ui/card'

const CreditCards = () => {
  const { creditCards, addCreditCard, removeCreditCard } = useAppContext()
  const [form, setForm] = useState({ name: '', num: '', network: 'visa' })

  const handleAdd = () => {
    if (!form.name || !form.num) return
    const card: CreditCard = {
      id: Math.random().toString(36).substr(2, 9),
      cardName: form.name,
      cardNumber: form.num,
      cardNetwork: form.network as 'visa'|'mastercard'|'rupay',
      balance: 0,
      limit: 100000,
      status: 'active',
      expiryDate: '12/28',
      cvv: '123'
    }
    addCreditCard(card)
    setForm({ name: '', num: '', network: 'visa' })
  }

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold">Credit Cards</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {creditCards.map((card) => (
          <Card key={card.id} className={`text-white h-48 flex flex-col justify-between p-6 rounded-xl shadow-lg ${card.cardNetwork === 'rupay' ? 'bg-gradient-to-r from-orange-500 to-red-600' : 'bg-gradient-to-r from-slate-700 to-slate-900'}`}>
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-lg">{card.cardName}</h3>
                <p className="text-xs opacity-80 uppercase">{card.cardNetwork}</p>
              </div>
              <Button variant="ghost" className="text-white hover:bg-white/20 h-8 w-8 p-0" onClick={() => removeCreditCard(card.id)}>✕</Button>
            </div>
            
            <div className="text-2xl tracking-widest font-mono">**** **** **** {card.cardNumber.slice(-4)}</div>
            
            <div className="flex justify-between text-sm">
              <div>
                <p className="opacity-70 text-xs">Used</p>
                <p>₹{card.balance.toLocaleString()}</p>
              </div>
              <div className="text-right">
                <p className="opacity-70 text-xs">Limit</p>
                <p>₹{card.limit.toLocaleString()}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="max-w-md bg-white p-6 rounded-lg shadow border">
        <h3 className="font-semibold mb-4">Add New Card</h3>
        <div className="space-y-3">
          <Input placeholder="Card Name (e.g. SBI SimplyClick)" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          <Input placeholder="Card Number (Last 4 is fine)" maxLength={16} value={form.num} onChange={e => setForm({ ...form, num: e.target.value })} />
          <Select onValueChange={(val) => setForm({ ...form, network: val })} defaultValue="visa">
            <SelectTrigger><SelectValue placeholder="Network" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="visa">Visa</SelectItem>
              <SelectItem value="mastercard">Mastercard</SelectItem>
              <SelectItem value="rupay">Rupay (Enables UPI)</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleAdd} className="w-full mt-2">Add Card</Button>
        </div>
      </div>
    </div>
  )
}

export default CreditCards