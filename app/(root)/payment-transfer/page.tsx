'use client'

import HeaderBox from '@/components/HeaderBox'
import PaymentTransferForm from '@/components/PaymentTransferForm'
import { useAppContext } from '@/lib/context/AppContext'
import { getLoggedInUser } from '@/lib/actions/user.actions';
import { redirect } from 'next/navigation';
import React, { useEffect, useState } from 'react'

const Transfer = () => {
  const { bankAccounts, loading } = useAppContext()
  const [loggedIn, setLoggedIn] = useState<any>(null)

  useEffect(() => {
    const getUser = async () => {
      const user = await getLoggedInUser()
      if (!user) {
        redirect('/signin')
      }
      setLoggedIn(user)
    }
    getUser()
  }, [])

  if (loading || !loggedIn) {
    return (
      <section className="payment-transfer">
        <div className="flex justify-center items-center min-h-[400px]">
          <div>Loading...</div>
        </div>
      </section>
    )
  }

  return (
    <section className="payment-transfer">
      <HeaderBox
        title="Payment Transfer"
        subtext="Please provide any specific details or notes related to the payment transfer"
      />

      <section className="size-full pt-5">
        <PaymentTransferForm accounts={bankAccounts} />
      </section>
    </section>
  )
}

export default Transfer