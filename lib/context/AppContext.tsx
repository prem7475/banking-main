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

interface Transaction {
  $id: string
  id: string
  name: string
  paymentChannel: string
  channel: string
  type: 'debit' | 'credit'
  accountId: string
  cardId?: string
  amount: number
  pending: boolean
  category: string
  date: string
  $createdAt: string
  image: string
  senderBankId: string
  receiverBankId: string
}

interface AppContextType {
  bankAccounts: BankAccount[]
  setBankAccounts: React.Dispatch<React.SetStateAction<BankAccount[]>>
  connectedBanks: ConnectedBank[]
  setConnectedBanks: React.Dispatch<React.SetStateAction<ConnectedBank[]>>
  creditCards: CreditCard[]
  setCreditCards: React.Dispatch<React.SetStateAction<CreditCard[]>>
  transactions: Transaction[]
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>
  loading: boolean
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
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([])
  const [connectedBanks, setConnectedBanks] = useState<ConnectedBank[]>([])
  const [creditCards, setCreditCards] = useState<CreditCard[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch real data on app initialization
  React.useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true)

        // Fetch banks
        const banksResponse = await fetch('/api/banks')
        if (banksResponse.ok) {
          const banksData = await banksResponse.json()
          if (banksData.banks && banksData.banks.length > 0) {
            const formattedBanks = banksData.banks.map((bank: any) => ({
              id: bank.accountId,
              availableBalance: 0, // Will be updated when real integration is added
              currentBalance: 0, // Will be updated when real integration is added
              institutionId: bank.bankId,
              name: 'Connected Bank Account', // Will be updated with real bank name
              officialName: 'Connected Bank Account', // Will be updated with real bank name
              mask: bank.accountId.slice(-4),
              type: 'checking',
              subtype: 'checking',
              appwriteItemId: bank._id,
              shareableId: bank.shareableId,
              cardType: bank.cardType,
            }))
            setBankAccounts(formattedBanks)
          }
        }

        // Fetch credit cards
        const cardsResponse = await fetch('/api/credit-cards')
        if (cardsResponse.ok) {
          const cardsData = await cardsResponse.json()
          if (cardsData.cards && cardsData.cards.length > 0) {
            const formattedCards = cardsData.cards.map((card: any) => ({
              id: card._id,
              name: card.name,
              balance: card.balance || 0,
              limit: card.limit || 0,
              type: card.cardNetwork || 'visa',
              color: card.cardNetwork === 'visa' ? 'from-blue-500 to-blue-700' :
                     card.cardNetwork === 'mastercard' ? 'from-red-500 to-red-700' :
                     'from-green-500 to-green-700',
              status: card.status || 'active',
              number: card.cardNumber ? `**** **** **** ${card.cardNumber.slice(-4)}` : undefined,
              cvv: card.cvv ? '***' : undefined,
            }))
            setCreditCards(formattedCards)
          }
        }

        // Fetch transactions
        const transactionsResponse = await fetch('/api/transactions')
        if (transactionsResponse.ok) {
          const transactionsData = await transactionsResponse.json()
          if (transactionsData.transactions) {
            setTransactions(transactionsData.transactions)
          }
        }

      } catch (error) {
        console.error('Error fetching initial data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchInitialData()
  }, [])

  return (
    <AppContext.Provider value={{
      bankAccounts,
      setBankAccounts,
      connectedBanks,
      setConnectedBanks,
      creditCards,
      setCreditCards,
      transactions,
      setTransactions,
      loading
    }}>
      {children}
    </AppContext.Provider>
  )
}
