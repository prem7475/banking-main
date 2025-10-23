'use client'

import { formatAmount } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'
import Copy from './Copy'
import { Eye, EyeOff } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'

const BankCard = ({ account, userName, showBalance = false }: CreditCardProps) => {
  const [showBalanceState, setShowBalanceState] = useState(showBalance)
  const [showPinDialog, setShowPinDialog] = useState(false)
  const [upiPin, setUpiPin] = useState('')
  const [pinError, setPinError] = useState('')

  const handleBalanceToggle = () => {
    if (!showBalanceState) {
      setShowPinDialog(true)
    } else {
      setShowBalanceState(false)
    }
  }

  const handlePinSubmit = () => {
    if (upiPin === '1234') { // Mock UPI PIN
      setShowBalanceState(true)
      setShowPinDialog(false)
      setUpiPin('')
      setPinError('')
    } else {
      setPinError('Incorrect UPI PIN. Please try again.')
    }
  }

  console.log(account);
  return (
    <div className="flex flex-col">
      <div className="relative">
        <Link href={`/transaction-history/?id=${account.appwriteItemId}`} className="bank-card">
          <div className="bank-card_content">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-16 font-semibold text-white">
                  {account.name}
                </h1>
                <p className="font-ibm-plex-serif font-black text-white">
                  {showBalanceState ? formatAmount(account.currentBalance) : '****'}
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.preventDefault()
                  handleBalanceToggle()
                }}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
                title={showBalanceState ? "Hide balance" : "Show balance"}
              >
                {showBalanceState ? <EyeOff className="w-4 h-4 text-white" /> : <Eye className="w-4 h-4 text-white" />}
              </button>
            </div>

            <article className="flex flex-col gap-2">
              <div className="flex justify-between">
                <h1 className="text-12 font-semibold text-white">
                  {userName}
                </h1>
                <h2 className="text-12 font-semibold text-white">
                ●● / ●●
                </h2>
              </div>
              <p className="text-14 font-semibold tracking-[1.1px] text-white">
                {showBalanceState ? (
                  `**** **** **** ${account?.mask}`
                ) : (
                  '●●●● ●●●● ●●●● ****'
                )}
              </p>
            </article>
          </div>

          <div className="bank-card_icon">
            <Image
              src="/icons/Paypass.svg"
              width={20}
              height={24}
              alt="pay"
            />
            <Image
              src="/icons/mastercard.svg"
              width={45}
              height={32}
              alt="mastercard"
              className="ml-5"
            />
          </div>

          <Image
            src="/icons/lines.png"
            width={316}
            height={190}
            alt="lines"
            className="absolute top-0 left-0"
          />
        </Link>
      </div>

      {showBalanceState && <Copy title={account?.shareableId} />}

      {/* UPI PIN Dialog */}
      <Dialog open={showPinDialog} onOpenChange={setShowPinDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Enter UPI PIN</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="upi-pin" className="text-right">
                UPI PIN
              </Label>
              <Input
                id="upi-pin"
                type="password"
                value={upiPin}
                onChange={(e) => setUpiPin(e.target.value)}
                className="col-span-3"
                placeholder="Enter 4-digit PIN"
                maxLength={4}
              />
            </div>
            {pinError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{pinError}</AlertDescription>
              </Alert>
            )}
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowPinDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handlePinSubmit}>Submit</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default BankCard