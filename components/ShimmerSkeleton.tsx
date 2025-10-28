'use client'

import React from 'react'
import { motion } from 'framer-motion'

interface ShimmerSkeletonProps {
  className?: string
  lines?: number
  height?: string
}

const ShimmerSkeleton = ({
  className = '',
  lines = 1,
  height = 'h-4'
}: ShimmerSkeletonProps) => {
  if (lines === 1) {
    return (
      <div className={`shimmer bg-[var(--card-bg)] rounded ${height} ${className}`}>
        <div className="bg-gradient-to-r from-transparent via-white/10 to-transparent h-full rounded animate-pulse"></div>
      </div>
    )
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className={`shimmer bg-[var(--card-bg)] rounded ${height}`}
        >
          <div className="bg-gradient-to-r from-transparent via-white/10 to-transparent h-full rounded animate-pulse"></div>
        </motion.div>
      ))}
    </div>
  )
}

export default ShimmerSkeleton
