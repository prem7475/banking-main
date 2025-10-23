'use client'

import HeaderBox from '@/components/HeaderBox'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { AlertCircle, CheckCircle, Loader2, Plus, CreditCard, Eye, EyeOff } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

const CreditCards = () => {
  const [showApplyModal, setShowApplyModal] = useState(false)
  const [selectedCardType, setSelectedCardType] = useState('')
  const [annualIncome, setAnnualIncome] = useState('')
  const [employmentType, setEmploymentType] = useState('')
  const [panNumber, setPanNumber] = useState('')
  const [panData, setPanData] = useState<{ name: string; dob: string; address: string; age: number } | null>(null)
  const [isApplying, setIsApplying] = useState(false)
  const [applicationStatus, setApplicationStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [showCardDetails, setShowCardDetails] = useState<{ [key: string]: boolean }>({})
  const [showPinDialog, setShowPinDialog] = useState(false)
  const [selectedCardId, setSelectedCardId] = useState('')
  const [upiPin, setUpiPin] = useState('')
  const [pinError, setPinError] = useState('')

  // Start with empty array - users must apply for their own cards
  const [existingCards, setExistingCards] = useState([])

  const creditCardTypes = [
    { id: 'visa', name: 'Visa Credit Card', description: 'Accepted worldwide with comprehensive benefits' },
    { id: 'mastercard', name: 'Mastercard Credit Card', description: 'Global acceptance with premium rewards' },
    { id: 'rupay', name: 'RuPay Credit Card', description: 'Indian domestic card with great benefits' },
  ]

  const banks = [
    'HDFC Bank', 'ICICI Bank', 'SBI', 'Axis Bank', 'Kotak Mahindra', 'IDFC First', 'RBL Bank', 'Yes Bank'
  ]

  const handlePanFetch = async () => {
    if (!panNumber || panNumber.length !== 10) {
      return
    }

    // Simulate government PAN API call
    setTimeout(() => {
      // Mock government PAN database response with accurate data
      const mockPanData = {
        'ABCDE1234F': {
          name: 'Rajesh Kumar Sharma',
          dob: '15/08/1995',
          address: '123 MG Road, Bangalore, Karnataka, India',
          age: 29
        },
        'FGHIJ5678K': {
          name: 'Priya Singh Patel',
          dob: '22/03/1988',
          address: '456 Linking Road, Mumbai, Maharashtra, India',
          age: 36
        },
        'LMNOP9012Q': {
          name: 'Amit Kumar Jain',
          dob: '10/11/1992',
          address: '789 Anna Nagar, Chennai, Tamil Nadu, India',
          age: 31
        }
      }

      const panKey = panNumber.toUpperCase()
      const data = mockPanData[panKey as keyof typeof mockPanData]

      if (data) {
        setPanData(data)
      } else {
        // PAN not found in government database
        setPanData(null)
        alert('PAN number not found in government database. Please check the PAN number and try again.')
      }
    }, 1500) // Slightly longer delay to simulate government API
  }

  const handleApply = async () => {
    if (!selectedCardType || !annualIncome || !employmentType || !panNumber || !panData) {
      setApplicationStatus('error')
      return
    }

    const income = parseFloat(annualIncome)
    if (income < 500000) {
      setApplicationStatus('error')
      return
    }

    if (panData.age < 21) {
      setApplicationStatus('error')
      return
    }

    setIsApplying(true)
    setApplicationStatus('idle')

    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 3000))
      setApplicationStatus('success')

      // Add new card to existing cards
      const newCard = {
        id: `card-${existingCards.length + 1}`,
        name: `${banks[Math.floor(Math.random() * banks.length)]} ${selectedCardType.charAt(0).toUpperCase() + selectedCardType.slice(1)} Card`,
        balance: 0,
        limit: income > 1000000 ? 100000 : 50000,
        type: selectedCardType,
        color: selectedCardType === 'visa' ? 'from-blue-500 to-blue-700' :
               selectedCardType === 'mastercard' ? 'from-red-500 to-red-700' :
               'from-green-500 to-green-700',
        status: 'pending',
        number: '**** **** **** ****', // Placeholder until approved
        cvv: '***' // Placeholder until approved
      }
      setExistingCards([...existingCards, newCard])
    } catch (error) {
      setApplicationStatus('error')
    } finally {
      setIsApplying(false)
    }
  }

  const resetApplication = () => {
    setSelectedCardType('')
    setAnnualIncome('')
    setEmploymentType('')
    setPanNumber('')
    setPanData(null)
    setApplicationStatus('idle')
    setShowApplyModal(false)
  }

  const handleCardDetailsToggle = (cardId: string) => {
    if (!showCardDetails[cardId]) {
      setSelectedCardId(cardId)
      setShowPinDialog(true)
    } else {
      setShowCardDetails(prev => ({ ...prev, [cardId]: false }))
    }
  }

  const handlePinSubmit = () => {
    if (upiPin === '1234') { // Mock UPI PIN
      setShowCardDetails(prev => ({ ...prev, [selectedCardId]: true }))
      setShowPinDialog(false)
      setUpiPin('')
      setPinError('')
    } else {
      setPinError('Incorrect UPI PIN. Please try again.')
    }
  }

  return (
    <section className="credit-cards">
      <div className="credit-cards-content">
        <HeaderBox
          title="Credit Cards"
          subtext="Manage your credit cards and apply for new ones"
        />

        <div className="mt-8 space-y-8">
          {/* Apply for New Card Button */}
          <div className="flex justify-center">
            <Dialog open={showApplyModal} onOpenChange={setShowApplyModal}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Apply for New Credit Card
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Apply for Credit Card</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                  {/* Card Type Selection */}
                  <div className="space-y-2">
                    <Label>Card Type</Label>
                    <Select value={selectedCardType} onValueChange={setSelectedCardType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select card type" />
                      </SelectTrigger>
                      <SelectContent>
                        {creditCardTypes.map((type) => (
                          <SelectItem key={type.id} value={type.id}>
                            <div>
                              <div className="font-medium">{type.name}</div>
                              <div className="text-sm text-gray-500">{type.description}</div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Annual Income */}
                  <div className="space-y-2">
                    <Label htmlFor="annual-income">Annual Income (₹)</Label>
                    <Input
                      id="annual-income"
                      type="number"
                      placeholder="Enter your annual income"
                      value={annualIncome}
                      onChange={(e) => setAnnualIncome(e.target.value)}
                    />
                  </div>

                  {/* PAN Number */}
                  <div className="space-y-2">
                    <Label htmlFor="pan-number">PAN Number</Label>
                    <div className="flex gap-2">
                      <Input
                        id="pan-number"
                        type="text"
                        placeholder="Enter PAN number (10 characters)"
                        value={panNumber}
                        onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
                        maxLength={10}
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handlePanFetch}
                        disabled={panNumber.length !== 10}
                      >
                        Fetch Details
                      </Button>
                    </div>
                  </div>

                  {/* PAN Data Display */}
                  {panData && (
                    <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                      <h4 className="font-medium text-sm">PAN Details:</h4>
                      <p className="text-sm"><strong>Name:</strong> {panData.name}</p>
                      <p className="text-sm"><strong>DOB:</strong> {panData.dob}</p>
                      <p className="text-sm"><strong>Age:</strong> {panData.age} years</p>
                      <p className="text-sm"><strong>Address:</strong> {panData.address}</p>
                    </div>
                  )}

                  {/* Employment Type */}
                  <div className="space-y-2">
                    <Label>Employment Type</Label>
                    <Select value={employmentType} onValueChange={setEmploymentType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select employment type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="salaried">Salaried</SelectItem>
                        <SelectItem value="self-employed">Self Employed</SelectItem>
                        <SelectItem value="business">Business Owner</SelectItem>
                        <SelectItem value="student">Student</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Status Messages */}
                  {applicationStatus === 'error' && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        {parseFloat(annualIncome) < 500000 ? 'Annual income must be at least ₹500,000 to apply for a credit card.' :
                         panData && panData.age < 21 ? 'You must be at least 21 years old to apply for a credit card.' :
                         'Please fill in all required fields and ensure PAN details are fetched.'}
                      </AlertDescription>
                    </Alert>
                  )}

                  {applicationStatus === 'success' && (
                    <Alert className="border-green-200 bg-green-50">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <AlertDescription className="text-green-800">
                        Application submitted successfully! We&apos;ll review your application and get back to you soon.
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-4 pt-4">
                    <Button
                      onClick={handleApply}
                      disabled={isApplying}
                      className="flex-1"
                    >
                      {isApplying ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Applying...
                        </>
                      ) : (
                        'Apply Now'
                      )}
                    </Button>

                    {applicationStatus === 'success' && (
                      <Button variant="outline" onClick={resetApplication}>
                        Apply for Another
                      </Button>
                    )}
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Existing Credit Cards */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Your Credit Cards</h2>
            {existingCards.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <CreditCard className="w-16 h-16 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Credit Cards Yet</h3>
                  <p className="text-gray-500 text-center mb-4">
                    Apply for your first credit card to get started with credit building and rewards.
                  </p>
                  <Button onClick={() => setShowApplyModal(true)}>
                    Apply for Credit Card
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {existingCards.map((card, index) => (
                  <div
                    key={card.id}
                    className={`relative p-6 rounded-lg bg-gradient-to-br ${card.color} text-white shadow-lg transform transition-all duration-500 hover:scale-105`}
                    style={{
                      animationDelay: `${index * 100}ms`,
                      animation: 'float 3s ease-in-out infinite'
                    }}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="text-sm font-medium">{card.name}</div>
                      <div className="flex items-center gap-2">
                        <div className="text-xs opacity-80">
                          {card.type === 'visa' ? 'VISA' : card.type === 'mastercard' ? 'MASTERCARD' : 'RUPAY'}
                        </div>
                        <button
                          onClick={() => handleCardDetailsToggle(card.id)}
                          className="p-1 hover:bg-white/20 rounded-full transition-colors"
                          title={showCardDetails[card.id] ? "Hide card details" : "Show card details"}
                        >
                          {showCardDetails[card.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="text-xs opacity-80 mb-1">Available Credit</div>
                      <div className="text-lg font-bold">₹{card.balance.toLocaleString()}</div>
                    </div>

                    <div className="text-xs opacity-80">
                      Limit: ₹{card.limit.toLocaleString()}
                    </div>

                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="flex justify-between text-xs opacity-60">
                        {showCardDetails[card.id] ? (
                          <>
                            <span>{card.number.slice(0, 4)}</span>
                            <span>{card.number.slice(4, 8)}</span>
                            <span>{card.number.slice(8, 12)}</span>
                            <span>{card.number.slice(12)}</span>
                          </>
                        ) : (
                          <>
                            <span>****</span>
                            <span>****</span>
                            <span>****</span>
                            <span>{card.number.slice(-4)}</span>
                          </>
                        )}
                      </div>
                    </div>

                    {showCardDetails[card.id] && (
                      <div className="absolute top-4 left-4 bg-black/50 text-white text-xs px-2 py-1 rounded">
                        CVV: {card.cvv}
                      </div>
                    )}

                    {card.status === 'pending' && (
                      <div className="absolute top-4 right-4 bg-yellow-500 text-black text-xs px-2 py-1 rounded">
                        Pending
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* UPI PIN Dialog */}
      <Dialog open={showPinDialog} onOpenChange={setShowPinDialog}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Enter UPI PIN</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="upi-pin">UPI PIN</Label>
              <Input
                id="upi-pin"
                type="password"
                placeholder="Enter your UPI PIN"
                value={upiPin}
                onChange={(e) => setUpiPin(e.target.value)}
                maxLength={6}
              />
            </div>

            {pinError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{pinError}</AlertDescription>
              </Alert>
            )}

            <div className="flex gap-4 pt-4">
              <Button onClick={handlePinSubmit} className="flex-1">
                Submit
              </Button>
              <Button variant="outline" onClick={() => setShowPinDialog(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </section>
  )
}

export default CreditCards
