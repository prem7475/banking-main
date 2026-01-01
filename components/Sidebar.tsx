'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Home, 
  Landmark, // for Banks
  History, 
  CreditCard, 
  ScanLine, // for Scan & Pay
  ArrowRightLeft, // for Transfer
  Users, // for Udhari/Friends
  PlusCircle,
  Wallet
} from 'lucide-react'

const sidebarLinks = [
  { imgURL: Home, route: '/', label: 'Home' },
  { imgURL: Landmark, route: '/my-banks', label: 'My Banks' },
  { imgURL: History, route: '/transaction-history', label: 'History' },
  { imgURL: ArrowRightLeft, route: '/payment-transfer', label: 'Transfer Funds' },
  { imgURL: ScanLine, route: '/scan-pay', label: 'Scan & Pay' },
  { imgURL: CreditCard, route: '/credit-cards', label: 'Credit Cards' },
  { imgURL: Users, route: '/udhari', label: 'Udhari' },
]

const Sidebar = () => {
  const pathname = usePathname()

  return (
    <section className="sticky left-0 top-0 flex h-screen w-fit flex-col justify-between border-r border-zinc-800 bg-black pt-8 text-white max-md:hidden sm:p-4 xl:p-6">
      <nav className="flex flex-col gap-4">
        {/* Logo Replacement */}
        <Link href="/" className="mb-8 flex cursor-pointer items-center gap-2 px-4">
          <Wallet className="h-8 w-8 text-blue-500" />
          <h1 className="text-2xl font-bold text-white max-xl:hidden">UdharPay</h1>
        </Link>

        {/* Navigation Links */}
        {sidebarLinks.map((item) => {
          const isActive = pathname === item.route || pathname.startsWith(`${item.route}/`)
          const Icon = item.imgURL

          return (
            <Link
              href={item.route}
              key={item.label}
              className={`flex items-center gap-3 rounded-lg px-4 py-3 transition-all duration-200
                ${isActive ? 'bg-blue-600 text-white shadow-md' : 'text-gray-400 hover:bg-zinc-900 hover:text-white'}
              `}
            >
              <Icon className={`h-6 w-6 ${isActive ? 'text-white' : 'text-gray-400'}`} />
              <p className="font-medium max-xl:hidden">{item.label}</p>
            </Link>
          )
        })}
      </nav>

      {/* Footer / User Info */}
      <div className="mt-auto px-4 py-4 border-t border-zinc-800">
        <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-zinc-800 flex items-center justify-center text-lg font-bold">
                P
            </div>
            <div className="max-xl:hidden">
                <p className="text-sm font-semibold text-white">Prem Narayani</p>
                <p className="text-xs text-gray-500">prem@manor.com</p>
            </div>
        </div>
      </div>
    </section>
  )
}

export default Sidebar