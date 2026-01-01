'use client'

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react'

// --- Interfaces ---
export interface BankAccount {
  id: string
  accountName: string
  accountNumber: string // Stores real number, mask in UI
  ifscCode: string
  bankName: string
  balance: number
  type: string
  status: 'active' | 'inactive'
}

export interface CreditCard {
  id: string
  cardName: string
  cardNumber: string
  cardNetwork: 'visa' | 'mastercard' | 'rupay'
  balance: number // Amount used
  limit: number
  status: 'active' | 'inactive'
  expiryDate: string
  cvv: string
}

export interface Transaction {
  id: string
  amount: number
  type: 'debit' | 'credit'
  category: string
  description: string // e.g. "Paid to Shop"
  date: string
  paymentMethod: 'bank' | 'credit-card'
  sourceId: string // Which bank/card ID paid for this
  status: 'success' | 'failed'
  isMerchantPayment?: boolean
}

export interface UserProfile {
  upiPin: string
  password: string
  fullName: string
}

interface AppContextType {
  bankAccounts: BankAccount[]
  addBankAccount: (account: BankAccount) => void
  removeBankAccount: (id: string) => void
  
  creditCards: CreditCard[]
  addCreditCard: (card: CreditCard) => void
  removeCreditCard: (id: string) => void
  
  transactions: Transaction[]
  addTransaction: (transaction: Transaction) => void
  
  userProfile: UserProfile
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile>>
  
  loading: boolean
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export const useAppContext = () => {
  const context = useContext(AppContext)
  if (!context) throw new Error('useAppContext must be used within AppProvider')
  return context
}

// --- Provider ---
export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState(true)
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([])
  const [creditCards, setCreditCards] = useState<CreditCard[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [userProfile, setUserProfile] = useState<UserProfile>({
    upiPin: '1234', password: 'admin', fullName: 'Prem Narayani'
  })

  // 1. Load Data
  useEffect(() => {
    try {
      const banks = localStorage.getItem('banking_banks')
      const cards = localStorage.getItem('banking_cards')
      const txs = localStorage.getItem('banking_txs')
      const user = localStorage.getItem('banking_user')

      if (banks) setBankAccounts(JSON.parse(banks))
      else setBankAccounts([{ id: 'b1', accountName: 'Main Account', accountNumber: '1234567890', ifscCode: 'HDFC001', bankName: 'HDFC Bank', balance: 50000, type: 'savings', status: 'active' }])

      if (cards) setCreditCards(JSON.parse(cards))
      if (txs) setTransactions(JSON.parse(txs))
      if (user) setUserProfile(JSON.parse(user))
      
    } catch (e) { console.error(e) } 
    finally { setLoading(false) }
  }, [])

  // 2. Save Data (Auto-save on change)
  useEffect(() => { if (!loading) localStorage.setItem('banking_banks', JSON.stringify(bankAccounts)) }, [bankAccounts, loading])
  useEffect(() => { if (!loading) localStorage.setItem('banking_cards', JSON.stringify(creditCards)) }, [creditCards, loading])
  useEffect(() => { if (!loading) localStorage.setItem('banking_txs', JSON.stringify(transactions)) }, [transactions, loading])
  useEffect(() => { if (!loading) localStorage.setItem('banking_user', JSON.stringify(userProfile)) }, [userProfile, loading])

  // --- Actions ---
  const addBankAccount = (acc: BankAccount) => setBankAccounts(prev => [...prev, acc])
  const removeBankAccount = (id: string) => setBankAccounts(prev => prev.filter(b => b.id !== id))

  const addCreditCard = (card: CreditCard) => setCreditCards(prev => [...prev, card])
  const removeCreditCard = (id: string) => setCreditCards(prev => prev.filter(c => c.id !== id))

  // Smart Transaction Add: Updates Balances automatically
  const addTransaction = (tx: Transaction) => {
    setTransactions(prev => [tx, ...prev])

    if (tx.type === 'debit') {
      if (tx.paymentMethod === 'bank') {
        setBankAccounts(prev => prev.map(b => b.id === tx.sourceId ? { ...b, balance: b.balance - tx.amount } : b))
      } else if (tx.paymentMethod === 'credit-card') {
        setCreditCards(prev => prev.map(c => c.id === tx.sourceId ? { ...c, balance: c.balance + tx.amount } : c)) // Credit card usage increases balance owed
      }
    }
  }

  return (
    <AppContext.Provider value={{ bankAccounts, addBankAccount, removeBankAccount, creditCards, addCreditCard, removeCreditCard, transactions, addTransaction, userProfile, setUserProfile, loading }}>
      {children}
    </AppContext.Provider>
  )
}