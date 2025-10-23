'use client'

import HeaderBox from '@/components/HeaderBox'
import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle, CheckCircle, Loader2, QrCode, Camera, Upload, CreditCard } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { QRParser, UPIQRData } from '@/components/QRParser'

const ScanPay = () => {
  const [scanMode, setScanMode] = useState<'camera' | 'upload'>('camera')
  const [isScanning, setIsScanning] = useState(false)
  const [scanResult, setScanResult] = useState<UPIQRData | null>(null)
  const [paymentAmount, setPaymentAmount] = useState('')
  const [selectedAccount, setSelectedAccount] = useState('')
  const [selectedCard, setSelectedCard] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Mock bank accounts and credit cards
  const mockAccounts = [
    { id: 'acc-1', name: 'SBI Savings', balance: 4500, type: 'bank' },
    { id: 'acc-2', name: 'HDFC Current', balance: 3200, type: 'bank' },
    { id: 'acc-3', name: 'ICICI Savings', balance: 6800, type: 'bank' },
  ]

  const mockCards = [
    { id: 'card-1', name: 'HDFC Credit Card', balance: 25000, type: 'credit' },
    { id: 'card-2', name: 'ICICI Credit Card', balance: 18000, type: 'credit' },
  ]

  const handleScan = async () => {
    setIsScanning(true)
    setScanResult(null)

    try {
      const result = await QRParser.scanQRFromCamera()
      if (result) {
        setScanResult(result)
      }
    } catch (error) {
      console.error('Scan failed:', error)
    } finally {
      setIsScanning(false)
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setIsScanning(true)
      setScanResult(null)

      try {
        const result = await QRParser.parseQRFromImage(file)
        if (result) {
          setScanResult(result)
        }
      } catch (error) {
        console.error('File upload scan failed:', error)
      } finally {
        setIsScanning(false)
      }
    }
  }

  const handlePayment = async () => {
    if (!paymentAmount || !scanResult || (!selectedAccount && !selectedCard)) {
      setPaymentStatus('error')
      return
    }

    setIsProcessing(true)
    setPaymentStatus('idle')

    // Simulate payment processing
    try {
      await new Promise(resolve => setTimeout(resolve, 3000))
      setPaymentStatus('success')
    } catch (error) {
      setPaymentStatus('error')
    } finally {
      setIsProcessing(false)
    }
  }

  const resetPayment = () => {
    setScanResult(null)
    setPaymentAmount('')
    setPaymentStatus('idle')
  }

  return (
    <section className="scan-pay">
      <div className="scan-pay-content">
        <HeaderBox
          title="Scan & Pay"
          subtext="Scan QR codes or upload payment QR to make instant payments"
        />

        <div className="mt-8 max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Scan Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <QrCode className="w-5 h-5" />
                  Scan QR Code
                </CardTitle>
                <CardDescription>
                  Use your camera or upload a QR code image to scan
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Scan Mode Toggle */}
                <div className="flex gap-2">
                  <Button
                    variant={scanMode === 'camera' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setScanMode('camera')}
                    className="flex-1"
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    Camera
                  </Button>
                  <Button
                    variant={scanMode === 'upload' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setScanMode('upload')}
                    className="flex-1"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload
                  </Button>
                </div>

                {/* Camera/Upload Area */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  {scanMode === 'camera' ? (
                    <div className="space-y-4">
                      <div className="w-32 h-32 mx-auto bg-gray-100 rounded-lg flex items-center justify-center">
                        <QrCode className="w-16 h-16 text-gray-400" />
                      </div>
                      <p className="text-sm text-gray-600">
                        Position QR code within the camera frame
                      </p>
                      <Button
                        onClick={handleScan}
                        disabled={isScanning}
                        className="w-full"
                      >
                        {isScanning ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Scanning...
                          </>
                        ) : (
                          <>
                            <Camera className="mr-2 h-4 w-4" />
                            Start Scanning
                          </>
                        )}
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Upload className="w-16 h-16 text-gray-400 mx-auto" />
                      <div>
                        <p className="text-sm text-gray-600 mb-2">
                          Upload QR code image
                        </p>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="hidden"
                          aria-label="Upload QR code image"
                        />
                        <Button
                          variant="outline"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={isScanning}
                          className="w-full"
                        >
                          {isScanning ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            <>
                              <Upload className="mr-2 h-4 w-4" />
                              Choose File
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Scan Result */}
                {scanResult && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                      <div>
                        <h3 className="font-medium text-green-800">QR Code Detected</h3>
                        <div className="text-sm text-green-700 mt-1">
                          <p><strong>Merchant:</strong> {scanResult.merchant}</p>
                          <p><strong>UPI ID:</strong> {scanResult.upiId}</p>
                          {scanResult.amount && <p><strong>Amount:</strong> ₹{scanResult.amount.toLocaleString()}</p>}
                          {scanResult.note && <p><strong>Note:</strong> {scanResult.note}</p>}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Payment Section */}
            <Card>
              <CardHeader>
                <CardTitle>Make Payment</CardTitle>
                <CardDescription>
                  Enter payment details to complete the transaction
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {scanResult ? (
                  <>
                    {/* Account Selection */}
                    <div className="space-y-2">
                      <Label htmlFor="payment-method">Payment Method</Label>
                      <Select value={selectedAccount} onValueChange={setSelectedAccount}>
                        <SelectTrigger id="payment-method" aria-label="Select bank account" title="Select bank account">
                          <SelectValue placeholder="Select bank account" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockAccounts.map((account) => (
                            <SelectItem key={account.id} value={account.id}>
                              <div className="flex justify-between items-center w-full">
                                <span>{account.name}</span>
                                <span className="text-sm text-gray-500">₹{account.balance.toLocaleString()}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Credit Card Selection */}
                    <div className="space-y-2">
                      <Label htmlFor="credit-card">Or Pay with Credit Card</Label>
                      <Select value={selectedCard} onValueChange={(value) => {
                        setSelectedCard(value)
                        setSelectedAccount('') // Clear bank selection when card is selected
                      }}>
                        <SelectTrigger id="credit-card" aria-label="Select credit card" title="Select credit card">
                          <SelectValue placeholder="Select credit card (optional)" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockCards.map((card) => (
                            <SelectItem key={card.id} value={card.id}>
                              <div className="flex justify-between items-center w-full">
                                <span>{card.name}</span>
                                <span className="text-sm text-gray-500">₹{card.balance.toLocaleString()}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Amount Input */}
                    <div className="space-y-2">
                      <Label htmlFor="amount">Payment Amount (₹)</Label>
                      <Input
                        id="amount"
                        type="number"
                        placeholder="Enter amount"
                        value={scanResult?.amount ? scanResult.amount.toString() : paymentAmount}
                        onChange={(e) => setPaymentAmount(e.target.value)}
                        min="1"
                      />
                      {scanResult?.amount && (
                        <p className="text-xs text-gray-500">
                          Amount pre-filled from QR code. You can modify if needed.
                        </p>
                      )}
                    </div>

                    {/* Payment Summary */}
                    <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Merchant:</span>
                        <span className="font-medium">{scanResult.merchant}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Payment Method:</span>
                        <span className="font-medium">
                          {selectedAccount ? mockAccounts.find(acc => acc.id === selectedAccount)?.name :
                           selectedCard ? mockCards.find(card => card.id === selectedCard)?.name :
                           'Not selected'}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Amount:</span>
                        <span className="font-medium">₹{paymentAmount || '0'}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Fee:</span>
                        <span className="font-medium">₹0.00</span>
                      </div>
                      <hr className="my-2" />
                      <div className="flex justify-between font-medium">
                        <span>Total:</span>
                        <span>₹{paymentAmount || '0'}</span>
                      </div>
                    </div>

                    {/* Status Messages */}
                    {paymentStatus === 'error' && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>Please enter a valid amount and select a payment method</AlertDescription>
                      </Alert>
                    )}

                    {paymentStatus === 'success' && (
                      <Alert className="border-green-200 bg-green-50">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <AlertDescription className="text-green-800">
                          Payment successful! Transaction completed.
                        </AlertDescription>
                      </Alert>
                    )}

                    {/* Action Buttons */}
                    <div className="space-y-3">
                      <Button
                        onClick={handlePayment}
                        disabled={isProcessing || !paymentAmount || (!selectedAccount && !selectedCard)}
                        className="w-full"
                      >
                        {isProcessing ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processing Payment...
                          </>
                        ) : (
                          'Pay Now'
                        )}
                      </Button>

                      {paymentStatus === 'success' && (
                        <Button
                          variant="outline"
                          onClick={resetPayment}
                          className="w-full"
                        >
                          Scan Another QR
                        </Button>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <QrCode className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Scan a QR code to start payment</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Security Notice */}
          <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-start gap-3">
              <div className="text-blue-600 mt-0.5">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-medium text-blue-800">Secure Payments</h3>
                <p className="text-sm text-blue-700 mt-1">
                  All payments are processed through secure UPI channels with bank-grade encryption.
                  Your financial data remains protected at all times.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ScanPay
