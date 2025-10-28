'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Plus, Receipt, Wallet } from 'lucide-react'

interface EmptyStateProps {
  icon?: 'wallet' | 'receipt' | 'plus'
  title: string
  description: string
  actionText?: string
  onAction?: () => void
}

const EmptyState = ({
  icon = 'wallet',
  title,
  description,
  actionText,
  onAction
}: EmptyStateProps) => {
  const getIcon = () => {
    switch (icon) {
      case 'wallet':
        return <Wallet className="w-16 h-16 text-[var(--text-secondary)] opacity-50" />
      case 'receipt':
        return <Receipt className="w-16 h-16 text-[var(--text-secondary)] opacity-50" />
      case 'plus':
        return <Plus className="w-16 h-16 text-[var(--text-secondary)] opacity-50" />
      default:
        return <Wallet className="w-16 h-16 text-[var(--text-secondary)] opacity-50" />
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="flex flex-col items-center justify-center min-h-[400px] text-center px-6"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mb-6"
      >
        {getIcon()}
      </motion.div>

      <motion.h3
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="text-xl font-semibold text-[var(--text-primary)] mb-3"
      >
        {title}
      </motion.h3>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="text-[var(--text-secondary)] mb-8 max-w-sm leading-relaxed"
      >
        {description}
      </motion.p>

      {actionText && onAction && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <Button
            onClick={onAction}
            className="bg-gradient-to-r from-[var(--accent)] to-[var(--positive)] hover:from-[var(--accent-hover)] hover:to-[var(--positive)] text-[var(--text-on-accent)] font-semibold px-6 py-3"
          >
            {actionText}
          </Button>
        </motion.div>
      )}
    </motion.div>
  )
}

export default EmptyState
