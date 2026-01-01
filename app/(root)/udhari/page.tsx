'use client'
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Trash2 } from 'lucide-react'

// Simple local state for this page example
type Debt = { id: string, name: string, amount: number, type: 'given' | 'taken' }

const Udhari = () => {
  const [debts, setDebts] = useState<Debt[]>([
    { id: '1', name: 'Raju Store', amount: 500, type: 'taken' }
  ])
  const [newName, setNewName] = useState('')
  const [newAmount, setNewAmount] = useState('')

  const addDebt = (type: 'given' | 'taken') => {
    if(!newName || !newAmount) return
    setDebts([...debts, { id: Date.now().toString(), name: newName, amount: parseFloat(newAmount), type }])
    setNewName('')
    setNewAmount('')
  }

  const removeDebt = (id: string) => setDebts(debts.filter(d => d.id !== id))

  return (
    <div className="p-8 space-y-8 bg-black min-h-full text-white">
        <h1 className="text-3xl font-bold">Udhari Tracker</h1>

        {/* Input Area */}
        <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 space-y-4 max-w-2xl">
            <h3 className="font-semibold text-lg">Add New Record</h3>
            <div className="flex gap-4">
                <Input placeholder="Name" value={newName} onChange={e => setNewName(e.target.value)} className="bg-black border-zinc-700" />
                <Input type="number" placeholder="Amount" value={newAmount} onChange={e => setNewAmount(e.target.value)} className="bg-black border-zinc-700" />
            </div>
            <div className="flex gap-4">
                <Button onClick={() => addDebt('given')} className="flex-1 bg-green-600 hover:bg-green-700">I Gave (Lend)</Button>
                <Button onClick={() => addDebt('taken')} className="flex-1 bg-red-600 hover:bg-red-700">I Took (Borrow)</Button>
            </div>
        </div>

        {/* List */}
        <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
            <Table>
                <TableHeader className="bg-zinc-950">
                    <TableRow className="border-zinc-800">
                        <TableHead className="text-zinc-400">Person</TableHead>
                        <TableHead className="text-zinc-400">Type</TableHead>
                        <TableHead className="text-right text-zinc-400">Amount</TableHead>
                        <TableHead className="text-right text-zinc-400">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {debts.map(d => (
                        <TableRow key={d.id} className="border-zinc-800">
                            <TableCell className="text-white">{d.name}</TableCell>
                            <TableCell>
                                <span className={`px-2 py-1 rounded text-xs ${d.type === 'given' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                                    {d.type === 'given' ? 'You Lent' : 'You Borrowed'}
                                </span>
                            </TableCell>
                            <TableCell className="text-right font-bold text-white">₹{d.amount}</TableCell>
                            <TableCell className="text-right">
                                <Button variant="ghost" size="sm" onClick={() => removeDebt(d.id)} className="text-red-500 hover:bg-red-500/10"><Trash2 size={16}/></Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    </div>
  )
}

export default Udhari