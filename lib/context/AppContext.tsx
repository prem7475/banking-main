'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'

interface BankAccount {
  id: string
  availableBalance: number
  currentBalance: number
  institutionId: string
  name: string
  officialName: string
  mask: string
  type: string
  subtype: string
  appwriteItemId: string
  shareableId: string
}

interface ConnectedBank {
  id: string
  name: string
  accountNumber: string
  ifscCode: string
  status: 'connected' | 'connecting' | 'error'
}

interface CreditCard {
  id: string
  name: string
  balance: number
  limit: number
  type: string
  color: string
  status: string
  number?: string
  cvv?: string
}

interface AppContextType {
  bankAccounts: BankAccount[]
  setBankAccounts: React.Dispatch<React.SetStateAction<BankAccount[]>>
  connectedBanks: ConnectedBank[]
  setConnectedBanks: React.Dispatch<React.SetStateAction<ConnectedBank[]>>
  creditCards: CreditCard[]
  setCreditCards: React.Dispatch<React.SetStateAction<CreditCard[]>>
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export const useAppContext = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider')
  }
  return context
}

interface AppProviderProps {
  children: ReactNode
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  // Start with empty arrays - users must add their own data
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([])
  const [connectedBanks, setConnectedBanks] = useState<ConnectedBank[]>([])
  const [creditCards, setCreditCards] = useState<CreditCard[]>([])

  return (
    <AppContext.Provider value={{
      bankAccounts,
      setBankAccounts,
      connectedBanks,
      setConnectedBanks,
      creditCards,
      setCreditCards
    }}>
      {children}
    </AppContext.Provider>
  )
}
