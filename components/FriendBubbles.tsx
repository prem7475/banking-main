'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatAmount } from '@/lib/utils'
import { useAppContext } from '@/lib/context/AppContext'

interface Friend {
  id: string
  name: string
  avatar?: string
  oweAmount: number // Positive: they owe you, Negative: you owe them
}

const FriendBubbles = () => {
  const { friends } = useAppContext()
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null)

  // Mock friends data - replace with actual friends from context
  const mockFriends: Friend[] = [
    { id: '1', name: 'Rohan', avatar: '', oweAmount: 2500 },
    { id: '2', name: 'Priya', avatar: '', oweAmount: -800 },
    { id: '3', name: 'Amit', avatar: '', oweAmount: 1200 },
    { id: '4', name: 'Sneha', avatar: '', oweAmount: 0 },
    { id: '5', name: 'Vikram', avatar: '', oweAmount: -1500 },
    { id: '6', name: 'Kavita', avatar: '', oweAmount: 300 },
  ]

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  const getRingColor = (amount: number) => {
    if (amount > 0) return 'ring-emerald-400' // They owe you - green
    if (amount < 0) return 'ring-red-400' // You owe them - red
    return 'ring-slate-400' // Settled - gray
  }

  const getAmountText = (amount: number) => {
    if (amount > 0) return `+₹${formatAmount(amount)}`
    if (amount < 0) return `-₹${formatAmount(Math.abs(amount))}`
    return 'Settled'
  }

  const getAmountColor = (amount: number) => {
    if (amount > 0) return 'text-emerald-400'
    if (amount < 0) return 'text-red-400'
    return 'text-slate-400'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
          Split Bills
        </h1>
        <p className="text-slate-400 mt-2">Your social financial status</p>
      </motion.div>

      {/* Friend Bubbles Grid */}
      <div className="grid grid-cols-3 gap-6 max-w-md mx-auto">
        {mockFriends.map((friend, index) => (
          <motion.div
            key={friend.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="flex flex-col items-center"
            onClick={() => setSelectedFriend(friend)}
          >
            {/* Avatar with Ring */}
            <div className={`relative mb-2 ${getRingColor(friend.oweAmount)} ring-4 rounded-full p-1`}>
              <Avatar className="w-16 h-16">
                <AvatarImage src={friend.avatar} alt={friend.name} />
                <AvatarFallback className="bg-slate-700 text-white">
                  {getInitials(friend.name)}
                </AvatarFallback>
              </Avatar>
            </div>

            {/* Name */}
            <p className="text-sm font-medium text-center mb-1">{friend.name}</p>

            {/* Amount */}
            <p className={`text-xs font-semibold ${getAmountColor(friend.oweAmount)}`}>
              {getAmountText(friend.oweAmount)}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Add Friend Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="flex justify-center mt-8"
      >
        <button className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 rounded-lg font-semibold shadow-lg transition-all duration-300">
          Add Friend
        </button>
      </motion.div>

      {/* Friend Details Modal */}
      {selectedFriend && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedFriend(null)}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-slate-800 rounded-lg p-6 w-full max-w-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center mb-6">
              <div className={`inline-block ${getRingColor(selectedFriend.oweAmount)} ring-4 rounded-full p-1 mb-4`}>
                <Avatar className="w-20 h-20">
                  <AvatarImage src={selectedFriend.avatar} alt={selectedFriend.name} />
                  <AvatarFallback className="bg-slate-700 text-white text-xl">
                    {getInitials(selectedFriend.name)}
                  </AvatarFallback>
                </Avatar>
              </div>
              <h3 className="text-xl font-semibold">{selectedFriend.name}</h3>
              <p className={`text-lg font-bold mt-2 ${getAmountColor(selectedFriend.oweAmount)}`}>
                {getAmountText(selectedFriend.oweAmount)}
              </p>
            </div>

            {/* Transaction History */}
            <div className="space-y-3 mb-6">
              <h4 className="font-semibold text-slate-300">Recent Transactions</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center py-2 border-b border-slate-700">
                  <span className="text-sm">Dinner at CCD</span>
                  <span className="text-sm text-emerald-400">+₹450</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-700">
                  <span className="text-sm">Movie tickets</span>
                  <span className="text-sm text-emerald-400">+₹300</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm">Coffee</span>
                  <span className="text-sm text-red-400">-₹150</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setSelectedFriend(null)}
                className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
              >
                Close
              </button>
              <button className="flex-1 px-4 py-2 bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 rounded-lg font-semibold">
                Settle Up
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}

export default FriendBubbles
