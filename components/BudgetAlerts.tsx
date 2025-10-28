'use client'

import { useEffect, useState } from 'react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertTriangle, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface BudgetAlert {
  category: string
  spent: number
  limit: number
  percentage: number
  alertThreshold: number
}

const BudgetAlerts = () => {
  const [alerts, setAlerts] = useState<BudgetAlert[]>([])
  const [dismissedAlerts, setDismissedAlerts] = useState<Set<string>>(new Set())

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const response = await fetch('/api/budgets/alerts')
        if (response.ok) {
          const data = await response.json()
          setAlerts(data.alerts || [])
        }
      } catch (error) {
        console.error('Error fetching budget alerts:', error)
      }
    }

    fetchAlerts()
    // Refresh alerts every 5 minutes
    const interval = setInterval(fetchAlerts, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  const activeAlerts = alerts.filter(alert => !dismissedAlerts.has(alert.category))

  const dismissAlert = (category: string) => {
    setDismissedAlerts(prev => new Set(prev).add(category))
  }

  if (activeAlerts.length === 0) return null

  return (
    <div className="space-y-2 mb-4">
      {activeAlerts.map((alert) => (
        <Alert key={alert.category} className="border-orange-200 bg-orange-50">
          <AlertTriangle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="flex items-center justify-between">
            <div>
              <span className="font-medium">{alert.category}</span> budget alert:
              You've spent ₹{alert.spent.toLocaleString()} of ₹{alert.limit.toLocaleString()}
              ({alert.percentage.toFixed(1)}%)
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => dismissAlert(alert.category)}
              className="h-6 w-6 p-0 hover:bg-orange-100"
            >
              <X className="h-3 w-3" />
            </Button>
          </AlertDescription>
        </Alert>
      ))}
    </div>
  )
}

export default BudgetAlerts
