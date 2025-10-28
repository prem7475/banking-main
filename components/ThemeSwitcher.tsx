'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Palette, Check } from 'lucide-react'

const themes = [
  {
    id: 'default',
    name: 'Premium Dark',
    description: 'Electric Teal',
    colors: ['#0C101B', '#00F5D4', '#33D17E']
  },
  {
    id: 'digital-violet',
    name: 'Digital Violet',
    description: 'Modern Tech',
    colors: ['#10121A', '#9D4EDD', '#20C997']
  },
  {
    id: 'executive-gold',
    name: 'Executive Gold',
    description: 'Luxury Premium',
    colors: ['#121212', '#E0B841', '#50C878']
  },
  {
    id: 'forest-light',
    name: 'Forest Light',
    description: 'Elegant Light',
    colors: ['#F9FAFF', '#0A6156', '#E14A58']
  }
]

const ThemeSwitcher = () => {
  const [currentTheme, setCurrentTheme] = useState('default')
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'default'
    setCurrentTheme(savedTheme)
    document.documentElement.setAttribute('data-theme', savedTheme)
  }, [])

  const handleThemeChange = (themeId: string) => {
    setCurrentTheme(themeId)
    document.documentElement.setAttribute('data-theme', themeId)
    localStorage.setItem('theme', themeId)
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-[var(--card-bg)] rounded-lg border border-slate-600 hover:bg-[var(--card-bg)]/80 transition-colors"
      >
        <Palette className="w-4 h-4 text-[var(--accent)]" />
        <span className="text-sm text-[var(--text-secondary)]">Theme</span>
      </motion.button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          className="absolute top-full mt-2 right-0 w-64 bg-[var(--card-bg)] border border-slate-600 rounded-lg shadow-xl z-50"
        >
          <div className="p-4">
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-3">Choose Theme</h3>
            <div className="space-y-2">
              {themes.map((theme) => (
                <motion.button
                  key={theme.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleThemeChange(theme.id)}
                  className={`w-full p-3 rounded-lg border transition-all ${
                    currentTheme === theme.id
                      ? 'border-[var(--accent)] bg-[var(--accent)]/10'
                      : 'border-slate-600 hover:border-slate-500'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex gap-1">
                        {theme.colors.map((color, index) => (
                          <div
                            key={index}
                            className="w-4 h-4 rounded-full border border-slate-600"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                      <div className="text-left">
                        <p className="font-medium text-[var(--text-primary)]">{theme.name}</p>
                        <p className="text-xs text-[var(--text-secondary)]">{theme.description}</p>
                      </div>
                    </div>
                    {currentTheme === theme.id && (
                      <Check className="w-4 h-4 text-[var(--accent)]" />
                    )}
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default ThemeSwitcher
