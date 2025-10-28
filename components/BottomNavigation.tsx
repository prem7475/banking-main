'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Users, Target, Wallet } from 'lucide-react'
import { cn } from '@/lib/utils'

const BottomNavigation = () => {
  const pathname = usePathname()

  const navItems = [
    {
      icon: Home,
      label: 'Home',
      route: '/',
      active: pathname === '/'
    },
    {
      icon: Users,
      label: 'Splits',
      route: '/udhari',
      active: pathname === '/udhari' || pathname.startsWith('/udhari/')
    },
    {
      icon: Target,
      label: 'Budgets',
      route: '/budgets',
      active: pathname === '/budgets' || pathname.startsWith('/budgets/')
    },
    {
      icon: Wallet,
      label: 'Wallet',
      route: '/my-banks',
      active: pathname === '/my-banks' || pathname.startsWith('/my-banks/')
    }
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-sm border-t border-slate-700 z-50 md:hidden">
      <div className="flex justify-around items-center py-2 px-4">
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.route}
              href={item.route}
              className={cn(
                "flex flex-col items-center justify-center py-2 px-3 rounded-lg transition-all duration-200 min-w-0 flex-1",
                item.active
                  ? "bg-emerald-500/20 text-emerald-400"
                  : "text-slate-400 hover:text-slate-300 hover:bg-slate-800/50"
              )}
            >
              <Icon className="w-5 h-5 mb-1" />
              <span className="text-xs font-medium truncate">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

export default BottomNavigation
