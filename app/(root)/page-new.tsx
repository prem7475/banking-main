'use client'

import TodayHubNew from '@/components/TodayHubNew'
import BottomNavigation from '@/components/BottomNavigation'

export default function HomePage() {
  return (
    <div className="pb-20">
      <TodayHubNew />
      <BottomNavigation />
    </div>
  )
}
