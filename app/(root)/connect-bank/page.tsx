'use client'

import HeaderBox from '@/components/HeaderBox'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle, CheckCircle, Loader2, Plus, Banknote } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useAppContext } from '@/lib/context/AppContext'
import Link from 'next/link'

interface ConnectedBank {
  id: string
  name: string
  accountNumber: string
  ifscCode: string
  status: 'connected' | 'connecting' | 'error'
}

const ConnectBank = () => {
  const { connectedBanks, setConnectedBanks, bankAccounts, setBankAccounts } = useAppContext()

  const [showAddForm, setShowAddForm] = useState(false)
  const [selectedBank, setSelectedBank] = useState('')
  const [accountNumber, setAccountNumber] = useState('')
  const [ifscCode, setIfscCode] = useState('')
  const [customerId, setCustomerId] = useState('')
  const [password, setPassword] = useState('')
  const [upiPin, setUpiPin] = useState('')
  const [isConnecting, setIsConnecting] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const indianBanks = [
    { id: 'sbi', name: 'State Bank of India', logo: '🏦' },
    { id: 'hdfc', name: 'HDFC Bank', logo: '🏦' },
    { id: 'icici', name: 'ICICI Bank', logo: '🏦' },
    { id: 'axis', name: 'Axis Bank', logo: '🏦' },
    { id: 'pnb', name: 'Punjab National Bank', logo: '🏦' },
    { id: 'bob', name: 'Bank of Baroda', logo: '🏦' },
    { id: 'canara', name: 'Canara Bank', logo: '🏦' },
    { id: 'union', name: 'Union Bank of India', logo: '🏦' },
    { id: 'idbi', name: 'IDBI Bank', logo: '🏦' },
    { id: 'kotak', name: 'Kotak Mahindra Bank', logo: '🏦' },
    { id: 'indusind', name: 'IndusInd Bank', logo: '🏦' },
    { id: 'yes', name: 'Yes Bank', logo: '🏦' },
    { id: 'federal', name: 'Federal Bank', logo: '🏦' },
    { id: 'rbl', name: 'RBL Bank', logo: '🏦' },
    { id: 'bandhan', name: 'Bandhan Bank', logo: '🏦' },
    { id: 'idfc', name: 'IDFC First Bank', logo: '🏦' },
  ]

  const handleConnect = async () => {
    if (!selectedBank || !accountNumber || !ifscCode || !customerId || !password || !upiPin) {
      setConnectionStatus('error')
      setErrorMessage('Please fill in all required fields')
      return
    }

    setIsConnecting(true)
    setConnectionStatus('idle')
    setErrorMessage('')

    try {
      // Get logged in user
      const { getLoggedInUser, createBankAccount } = await import('@/lib/actions/user.actions');

      const user = await getLoggedInUser();
      if (!user) {
        setConnectionStatus('error')
        setErrorMessage('Please log in to connect a bank account.')
        return
      }

      // Create bank account in MongoDB
      const bankName = indianBanks.find(bank => bank.id === selectedBank)?.name || 'Unknown Bank'
      const newBank = await createBankAccount({
        userId: user.userId,
        bankId: selectedBank,
        accountId: accountNumber,
        accessToken: 'mock-access-token', // Will be updated with real integration
        fundingSourceUrl: 'https://mock-funding-url.com',
        shareableId: `shareable-${Date.now()}`,
        cardType: 'rupay',
        upiPin: user.upiPin, // Use user's UPI PIN
      });

      if (newBank) {
        setConnectionStatus('success')

        // Add the new bank to connected banks
        const newConnectedBank: ConnectedBank = {
          id: newBank._id,
          name: bankName,
          accountNumber: `****${accountNumber.slice(-4)}`,
          ifscCode: ifscCode,
          status: 'connected'
        }
        setConnectedBanks([...connectedBanks, newConnectedBank])

        // Also add to bank accounts for my-banks page
        const newBankAccount = {
          id: newBank.accountId,
          availableBalance: 0, // Will be updated when real integration is added
          currentBalance: 0, // Will be updated when real integration is added
          institutionId: newBank.bankId,
          name: `${bankName} Account`,
          officialName: bankName,
          mask: accountNumber.slice(-4),
          type: 'checking',
          subtype: 'checking',
          appwriteItemId: newBank._id,
          shareableId: newBank.shareableId,
          cardType: newBank.cardType,
        }
        setBankAccounts([...bankAccounts, newBankAccount])

        resetForm()
        setShowAddForm(false)
      } else {
        setConnectionStatus('error')
        setErrorMessage('Failed to connect bank account. Please try again.')
      }
    } catch (error) {
      setConnectionStatus('error')
      setErrorMessage('Failed to connect to bank. Please check your credentials.')
    } finally {
      setIsConnecting(false)
    }
  }

  const resetForm = () => {
    setSelectedBank('')
    setAccountNumber('')
    setIfscCode('')
    setCustomerId('')
    setPassword('')
    setUpiPin('')
    setConnectionStatus('idle')
    setErrorMessage('')
  }

  return (
    <section className="connect-bank px-4 lg:px-6 min-h-screen">
      <div className="connect-bank-content">
        <HeaderBox
          title="Connect Your Bank"
          subtext="Securely link your bank account to access all features"
        />

        <div className="mt-8 space-y-6 lg:space-y-8">
          {/* Connected Banks Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Banknote className="w-5 h-5" />
                  Connected Banks
                </div>
                <Button
                  onClick={() => setShowAddForm(!showAddForm)}
                  variant="outline"
                  size="sm"
                  className="w-full sm:w-auto"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Bank
                </Button>
              </CardTitle>
              <CardDescription>
                Your linked bank accounts
              </CardDescription>
            </CardHeader>
            <CardContent>
              {connectedBanks.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Banknote className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No banks connected yet</p>
                  <p className="text-sm">Click "Add Bank" to get started</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {connectedBanks.map((bank) => (
                    <div
                      key={bank.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-lg">🏦</span>
                        </div>
                        <div>
                          <h3 className="font-medium">{bank.name}</h3>
                          <p className="text-sm text-gray-500">
                            {bank.accountNumber} • {bank.ifscCode}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          bank.status === 'connected'
                            ? 'bg-green-100 text-green-800'
                            : bank.status === 'connecting'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {bank.status === 'connected' ? 'Connected' :
                           bank.status === 'connecting' ? 'Connecting...' : 'Error'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Add Bank Form */}
          {showAddForm && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span>🏦</span>
                  Add New Bank Account
                </CardTitle>
                <CardDescription>
                  Enter your bank credentials to establish a secure connection
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Bank Selection */}
                <div className="space-y-2">
                  <Label htmlFor="bank-select">Select Your Bank</Label>
                  <Select value={selectedBank} onValueChange={setSelectedBank}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose your bank" />
                    </SelectTrigger>
                    <SelectContent>
                      {indianBanks.map((bank) => (
                        <SelectItem key={bank.id} value={bank.id}>
                          <div className="flex items-center gap-2">
                            <span>{bank.logo}</span>
                            {bank.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Account Number */}
                <div className="space-y-2">
                  <Label htmlFor="account-number">Account Number</Label>
                  <Input
                    id="account-number"
                    type="text"
                    placeholder="Enter your account number"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    maxLength={18}
                  />
                </div>

                {/* IFSC Code */}
                <div className="space-y-2">
                  <Label htmlFor="ifsc-code">IFSC Code</Label>
                  <Input
                    id="ifsc-code"
                    type="text"
                    placeholder="e.g., SBIN0001234"
                    value={ifscCode}
                    onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
                    maxLength={11}
                  />
                </div>

                {/* Customer ID */}
                <div className="space-y-2">
                  <Label htmlFor="customer-id">Customer ID / User ID</Label>
                  <Input
                    id="customer-id"
                    type="text"
                    placeholder="Enter your customer ID"
                    value={customerId}
                    onChange={(e) => setCustomerId(e.target.value)}
                  />
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="password">Password / PIN</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                {/* UPI PIN */}
                <div className="space-y-2">
                  <Label htmlFor="upi-pin">UPI PIN</Label>
                  <Input
                    id="upi-pin"
                    type="password"
                    placeholder="Enter 4-digit UPI PIN"
                    value={upiPin}
                    onChange={(e) => setUpiPin(e.target.value)}
                    maxLength={4}
                  />
                </div>

                {/* Status Messages */}
                {connectionStatus === 'error' && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{errorMessage}</AlertDescription>
                  </Alert>
                )}

                {connectionStatus === 'success' && (
                  <Alert className="border-green-200 bg-green-50">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">
                      Bank connected successfully! You can now access your account.
                    </AlertDescription>
                  </Alert>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button
                    onClick={handleConnect}
                    disabled={isConnecting}
                    className="flex-1"
                  >
                    {isConnecting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Connecting...
                      </>
                    ) : (
                      'Connect Bank'
                    )}
                  </Button>

                  <Button variant="outline" onClick={() => setShowAddForm(false)} className="w-full sm:w-auto">
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Security Notice */}
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-start gap-3">
              <div className="text-blue-600 mt-0.5">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-medium text-blue-800">Secure Connection</h3>
                <p className="text-sm text-blue-700 mt-1">
                  Your bank credentials are encrypted and never stored on our servers.
                  We use "bank-grade" security protocols to ensure your data remains safe.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ConnectBank
