 'use client'

import BankCard from '@/components/BankCard';
import HeaderBox from '@/components/HeaderBox'
import { useAppContext } from '@/lib/context/AppContext'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

const MyBanks = () => {
  const { bankAccounts } = useAppContext()

  const accounts = { data: bankAccounts };

  return (
    <section className='flex min-h-screen'>
      <div className="my-banks px-4 lg:px-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
          <Link href="/">
            <Button variant="outline" size="sm" className="text-xs lg:text-sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <HeaderBox
            title="My Bank Accounts"
            subtext="Effortlessly manage your banking activities."
          />
        </div>

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <h2 className="header-2 text-lg lg:text-xl">
              Your cards
            </h2>
            <Link href="/connect-bank">
              <Button variant="outline" size="sm" className="text-xs lg:text-sm">
                Add New Bank
              </Button>
            </Link>
          </div>
          <div className="flex flex-wrap gap-4 lg:gap-6">
            {accounts && accounts.data.map((a: Account) => (
              <BankCard
                key={a.id}
                account={a}
                userName="Prem"
              />
            ))}
          </div>
          {accounts && accounts.data.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">No bank accounts connected yet.</p>
              <Link href="/connect-bank">
                <Button>
                  Connect Your First Bank
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default MyBanks
