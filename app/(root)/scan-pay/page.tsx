'use client'
import React, { useState } from 'react'
import { useAppContext } from '@/lib/context/AppContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useRouter } from 'next/navigation'

const ScanPay = () => {
  const router = useRouter()
  const { bankAccounts, creditCards, userProfile, addTransaction } = useAppContext()
  
  const [step, setStep] = useState<'scan' | 'verify' | 'pin'>('scan')
  const [upiString, setUpiString] = useState('')
  const [parsedData, setParsedData] = useState<{ pa: string, pn: string, mcc?: string } | null>(null)
  const [amount, setAmount] = useState('')
  const [selectedSource, setSelectedSource] = useState('')
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')

  // 1. Verify UPI ID
  const verifyUpi = () => {
    // Basic parser for "upi://pay?pa=..." or just "user@upi"
    const params = new URLSearchParams(upiString.replace('upi://pay?', ''))
    const pa = params.get('pa') || upiString
    const pn = params.get('pn') || "Unknown Receiver"
    const mcc = params.get('mc') || params.get('mcc') // Merchant Code

    if (!pa.includes('@')) {
      setError("Invalid UPI ID format")
      return
    }
    
    setParsedData({ pa, pn, mcc: mcc || undefined })
    setError('')
    setStep('verify')
  }

  // 2. Logic: Is this a merchant?
  const isMerchant = parsedData?.mcc && parsedData.mcc !== '0000'

  // 3. Logic: Filter available payment sources
  const availableBanks = bankAccounts.map(b => ({
    id: b.id,
    label: `${b.bankName} - ₹${b.balance}`,
    type: 'bank' as const
  }))

  const availableCards = isMerchant 
    ? creditCards
        .filter(c => c.cardNetwork === 'rupay') // ONLY Rupay allowed
        .map(c => ({
          id: c.id,
          label: `${c.cardName} (Rupay) - Avail: ₹${c.limit - c.balance}`,
          type: 'credit-card' as const
        }))
    : [] // No cards if not merchant

  const allSources = [...availableBanks, ...availableCards]

  // 4. Process Payment
  const handlePay = () => {
    if (pin !== userProfile.upiPin) {
      setError('Incorrect UPI PIN')
      return
    }

    const source = allSources.find(s => s.id === selectedSource)
    if (!source || !parsedData) return

    addTransaction({
      id: Math.random().toString(36).substr(2, 9),
      amount: parseFloat(amount),
      type: 'debit',
      category: isMerchant ? 'Shopping' : 'Transfer',
      description: `Paid to ${parsedData.pn}`,
      date: new Date().toISOString(),
      paymentMethod: source.type,
      sourceId: source.id,
      status: 'success',
      isMerchantPayment: !!isMerchant
    })

    router.push('/transaction-history')
  }

  return (
    <div className="max-w-xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-blue-900">Scan & Pay</h1>

      {/* Step 1: Input UPI */}
      {step === 'scan' && (
        <Card>
          <CardHeader><CardTitle>Enter Recipient Details</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <Input 
              placeholder="UPI ID (e.g., shop@sbi or user@okhdfc)" 
              value={upiString} 
              onChange={e => setUpiString(e.target.value)} 
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <div className="text-xs text-gray-500">
               <p>Tip: Add <code>&mcc=1234</code> to string to test Merchant mode.</p>
            </div>
            <Button className="w-full" onClick={verifyUpi}>Verify</Button>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Amount & Source */}
      {step === 'verify' && parsedData && (
        <Card>
          <CardHeader>
            <CardTitle>Payment Details</CardTitle>
            <p className="text-sm text-gray-500">Paying: <span className="font-bold text-black">{parsedData.pn}</span> ({parsedData.pa})</p>
            {isMerchant 
              ? <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded w-fit">Merchant Payment</span>
              : <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded w-fit">Personal Transfer</span>
            }
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Amount</label>
              <Input type="number" placeholder="0.00" value={amount} onChange={e => setAmount(e.target.value)} className="text-2xl font-bold" />
            </div>

            <div>
              <label className="text-sm font-medium">Pay From</label>
              <Select onValueChange={setSelectedSource}>
                <SelectTrigger><SelectValue placeholder="Select Account" /></SelectTrigger>
                <SelectContent>
                  {allSources.map(s => <SelectItem key={s.id} value={s.id}>{s.label}</SelectItem>)}
                </SelectContent>
              </Select>
              {!isMerchant && <p className="text-xs text-gray-400 mt-1">Credit cards disabled for non-merchants.</p>}
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep('scan')} className="flex-1">Back</Button>
              <Button onClick={() => setStep('pin')} disabled={!amount || !selectedSource} className="flex-1">Proceed</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: PIN */}
      {step === 'pin' && (
        <Card>
          <CardHeader><CardTitle>Enter UPI PIN</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <Input 
              type="password" 
              placeholder="Enter 4-digit PIN" 
              maxLength={4} 
              className="text-center text-3xl tracking-widest"
              value={pin}
              onChange={e => setPin(e.target.value)}
            />
            {error && <p className="text-red-500 text-center">{error}</p>}
            <Button className="w-full mt-4" onClick={handlePay}>Confirm Payment</Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default ScanPay