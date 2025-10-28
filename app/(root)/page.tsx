'use client'

import HeaderBox from '@/components/HeaderBox'
import RecentTransactions from '@/components/RecentTransactions';
import RightSidebar from '@/components/RightSidebar';
import TotalBalanceBox from '@/components/TotalBalanceBox';
import BankCard from '@/components/BankCard';


import AnimatedCounter from '@/components/AnimatedCounter';
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X, Eye, EyeOff } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'
import { useAppContext } from '@/lib/context/AppContext'
import Link from 'next/link'

const Home = ({ searchParams: { id, page } }: SearchParamProps) => {
  const currentPage = Number(page as string) || 1;
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [showCardModal, setShowCardModal] = useState(false);
  const [currentCardPage, setCurrentCardPage] = useState(0);
  const [showBalance, setShowBalance] = useState(false);
  const [showPinDialog, setShowPinDialog] = useState(false);
  const [upiPin, setUpiPin] = useState('');
  const [pinError, setPinError] = useState('');
  const [showCreditBalance, setShowCreditBalance] = useState(false);
  const [showCreditPinDialog, setShowCreditPinDialog] = useState(false);
  const [creditUpiPin, setCreditUpiPin] = useState('');
  const [creditPinError, setCreditPinError] = useState('');

  const { bankAccounts, creditCards, transactions, loading } = useAppContext()

  // Get logged in user from MongoDB
  const [loggedInUser, setLoggedInUser] = useState<any>(null);

  useEffect(() => {
    const getUser = async () => {
      try {
        const { getLoggedInUser } = await import('@/lib/actions/user.actions');
        const user = await getLoggedInUser();
        setLoggedInUser(user);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };
    getUser();
  }, []);

  // Since layout handles authentication, user should always be available
  const mockUser = loggedInUser || {
    $id: "guest",
    userId: "guest",
    firstName: "Guest",
    lastName: "User",
    email: "",
    name: "Guest User",
    dwollaCustomerUrl: "",
    dwollaCustomerId: "",
    address1: "",
    city: "",
    state: "",
    postalCode: "",
    dateOfBirth: "",
    panNumber: "",
    upiPin: "",
    tpin: "",
  };

  const accountsData = bankAccounts;
  const appwriteItemId = (id as string) || accountsData[0]?.appwriteItemId;

  // Use transactions from context instead of local state
  const account = {
    data: accountsData[0] || null,
    transactions: transactions,
  };

  const cardsPerPage = 16;
  const totalCardPages = Math.ceil(creditCards.length / cardsPerPage);

  const getCurrentPageCards = () => {
    const start = currentCardPage * cardsPerPage;
    return creditCards.slice(start, start + cardsPerPage);
  };

  const handleBalanceToggle = () => {
    if (!showBalance) {
      setShowPinDialog(true);
    } else {
      setShowBalance(false);
    }
  };

  const handlePinSubmit = async () => {
    try {
      const { getUserUpiPin } = await import('@/lib/actions/user.actions');
      const storedPin = await getUserUpiPin(mockUser.userId);

      if (upiPin === storedPin) {
        setShowBalance(true);
        setShowPinDialog(false);
        setUpiPin('');
        setPinError('');
      } else {
        setPinError('Incorrect UPI PIN. Please try again.');
      }
    } catch (error) {
      setPinError('Error verifying PIN. Please try again.');
    }
  };

  const handleCreditBalanceToggle = () => {
    if (!showCreditBalance) {
      setShowCreditPinDialog(true);
    } else {
      setShowCreditBalance(false);
    }
  };

  const handleCreditPinSubmit = async () => {
    try {
      const { getUserTpin } = await import('@/lib/actions/user.actions');
      const storedPin = await getUserTpin(mockUser.userId);

      if (creditUpiPin === storedPin) {
        setShowCreditBalance(true);
        setShowCreditPinDialog(false);
        setCreditUpiPin('');
        setCreditPinError('');
      } else {
        setCreditPinError('Incorrect TPIN. Please try again.');
      }
    } catch (error) {
      setCreditPinError('Error verifying PIN. Please try again.');
    }
  };

  return (
    <section className="home min-h-screen">
      <div className="home-content">
        <header className="home-header">
          <HeaderBox
            type="greeting"
            title="Welcome"
            user={mockUser?.firstName || 'Guest'}
            subtext="Access and manage your account and transactions efficiently."
          />

          <div className="flex flex-col lg:flex-row gap-4">
            <div className="total-balance">
              <div className="total-balance-chart">
                <div className="flex-center bg-gradient-to-br from-blue-500 to-blue-700 rounded-full w-16 h-16 lg:w-24 lg:h-24">
                  <span className="text-xl lg:text-2xl">🏦</span>
                </div>
              </div>

              <div className="flex flex-col gap-4 lg:gap-6">
                <div className="flex items-center justify-between">
                  <h2 className="header-2 text-lg lg:text-xl">
                    Bank Accounts
                  </h2>
                  <button
                    onClick={handleBalanceToggle}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    title={showBalance ? "Hide balance" : "Show balance"}
                  >
                    {showBalance ? <EyeOff className="w-4 h-4 lg:w-5 lg:h-5" /> : <Eye className="w-4 h-4 lg:w-5 lg:h-5" />}
                  </button>
                </div>
                <div className="flex flex-col gap-2">
                  <p className="total-balance-label text-sm lg:text-base">
                    Total Balance
                  </p>

                  <div className="total-balance-amount flex-center gap-2">
                    <span className="rupee-symbol text-lg lg:text-xl">₹</span>
                    {showBalance ? (
                      <AnimatedCounter amount={accountsData.reduce((total, acc) => total + acc.currentBalance, 0)} />
                    ) : (
                      <span className="text-lg lg:text-xl">****</span>
                    )}
                  </div>
                  <div className="mt-4">
                    <Link href="/my-banks">
                      <Button variant="outline" size="sm" className="text-xs lg:text-sm">
                        View All Banks
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Credit Cards Balance */}
            <div className="total-balance">
              <div className="total-balance-chart">
                <div className="flex-center bg-gradient-to-br from-purple-500 to-pink-500 rounded-full w-16 h-16 lg:w-24 lg:h-24">
                  <span className="text-xl lg:text-2xl">💳</span>
                </div>
              </div>

              <div className="flex flex-col gap-4 lg:gap-6">
                <div className="flex items-center justify-between">
                  <h2 className="header-2 text-lg lg:text-xl">
                    Credit Cards
                  </h2>
                  <button
                    onClick={handleCreditBalanceToggle}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    title={showCreditBalance ? "Hide balance" : "Show balance"}
                  >
                    {showCreditBalance ? <EyeOff className="w-4 h-4 lg:w-5 lg:h-5" /> : <Eye className="w-4 h-4 lg:w-5 lg:h-5" />}
                  </button>
                </div>
                <div className="flex flex-col gap-2">
                  <p className="total-balance-label text-sm lg:text-base">
                    Total Available Credit
                  </p>

                  <div className="total-balance-amount flex-center gap-2">
                    <span className="rupee-symbol text-lg lg:text-xl">₹</span>
                    {showCreditBalance ? (
                      <AnimatedCounter amount={creditCards.reduce((total, card) => total + card.balance, 0)} />
                    ) : (
                      <span className="text-lg lg:text-xl">****</span>
                    )}
                  </div>
                  {creditCards.length === 0 && (
                    <p className="text-xs text-gray-500 mt-1">No credit cards added yet</p>
                  )}
                  <div className="mt-4">
                    <Link href="/credit-cards">
                      <Button variant="outline" size="sm" className="text-xs lg:text-sm">
                        View All Cards
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>



        <RecentTransactions
          accounts={accountsData}
          transactions={account?.transactions}
          appwriteItemId={appwriteItemId}
          page={currentPage}
        />

        {/* My Banks Section */}
        <div className="my-banks-section mt-8">
          <div className="flex flex-col gap-6">
            <div className="header-box">
              <h2 className="header-2 text-xl lg:text-2xl">My Banks</h2>
              <p className="text-14 font-normal text-gray-600 text-sm lg:text-base">
                {account?.data ? "Your connected bank accounts" : "No bank accounts connected"}
              </p>
            </div>

            {accountsData.length > 0 && (
              <div className="relative flex flex-col items-center justify-center gap-2">
                <div className="relative z-10">
                  <BankCard
                    account={accountsData[0]}
                    userName={mockUser.firstName}
                    showBalance={showBalance}
                  />
                </div>
                {accountsData[1] && (
                  <div className="absolute right-2 lg:right-4 top-8 z-0 w-[85%] lg:w-[90%]">
                    <BankCard
                      account={accountsData[1]}
                      userName={mockUser.firstName}
                      showBalance={false}
                    />
                  </div>
                )}
              </div>
            )}
            {accountsData.length === 0 && (
              <div className="text-center py-8">
                <Link href="/connect-bank">
                  <Button className="text-sm lg:text-base">
                    Connect Your First Bank
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Desktop Right Sidebar - Hidden on mobile */}
      <div className="hidden lg:block">
        <RightSidebar
          user={mockUser}
          transactions={account?.transactions}
          banks={accountsData?.slice(0, 2) as any}
        />
      </div>

      {/* UPI PIN Dialog for Bank Balance */}
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

      {/* TPIN Dialog for Credit Cards */}
      <Dialog open={showCreditPinDialog} onOpenChange={setShowCreditPinDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Enter TPIN</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="credit-upi-pin" className="text-right">
                TPIN
              </Label>
              <Input
                id="credit-upi-pin"
                type="password"
                value={creditUpiPin}
                onChange={(e) => setCreditUpiPin(e.target.value)}
                className="col-span-3"
                placeholder="Enter 4-digit PIN"
                maxLength={4}
              />
            </div>
            {creditPinError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{creditPinError}</AlertDescription>
              </Alert>
            )}
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowCreditPinDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreditPinSubmit}>Submit</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Credit Cards Modal */}
      {showCardModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[80vh] overflow-hidden">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">All Credit Cards</h2>
              <button
                onClick={() => setShowCardModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
                title="Close modal"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-4 gap-4 mb-6 overflow-y-auto max-h-[60vh]">
              {getCurrentPageCards().map((card, index) => (
                <div
                  key={card.id}
                  className={`relative p-4 rounded-lg bg-gradient-to-br ${card.color} text-white shadow-lg transform transition-all duration-500 hover:scale-105 animate-fade-in`}
                  style={{
                    animationDelay: `${index * 100}ms`,
                    animation: 'float 3s ease-in-out infinite'
                  }}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="text-sm font-medium">{card.name}</div>
                    <div className="text-xs opacity-80">
                      {card.type === 'visa' ? 'VISA' : 'MASTERCARD'}
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="text-xs opacity-80 mb-1">Available Credit</div>
                    <div className="text-lg font-bold">₹{card.balance.toLocaleString()}</div>
                  </div>

                  <div className="text-xs opacity-80">
                    Limit: ₹{card.limit.toLocaleString()}
                  </div>

                  {/* Card number pattern */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex justify-between text-xs opacity-60">
                      <span>****</span>
                      <span>****</span>
                      <span>****</span>
                      <span>{card.id.slice(-4)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {totalCardPages > 1 && (
              <div className="flex justify-center items-center gap-4">
                <button
                  onClick={() => setCurrentCardPage(Math.max(0, currentCardPage - 1))}
                  disabled={currentCardPage === 0}
                  className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Previous page"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <span className="text-sm text-gray-600">
                  Page {currentCardPage + 1} of {totalCardPages}
                </span>

                <button
                  onClick={() => setCurrentCardPage(Math.min(totalCardPages - 1, currentCardPage + 1))}
                  disabled={currentCardPage === totalCardPages - 1}
                  className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Next page"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }

        @keyframes fade-in {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
      `}</style>
    </section>
  )
}

export default Home
