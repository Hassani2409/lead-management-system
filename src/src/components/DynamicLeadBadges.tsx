'use client'

import { useState, useEffect } from 'react'
import { getLeads } from '@/lib/leadService'

export default function DynamicLeadBadges() {
  const [leads, setLeads] = useState<any[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Only run on client side to avoid hydration mismatch
    const loadLeads = () => {
      const loadedLeads = getLeads()
      setLeads(loadedLeads)
      setIsLoaded(true)
    }

    loadLeads()
  }, [])
  
  const deepResearchLeads = leads.filter(lead => lead.deep_research_completed)
  const totalRevenuePotential = leads.reduce((sum, lead) => sum + (lead.revenue_potential || 0), 0)
  
  const formatCurrency = (num: number): string => {
    if (num >= 1000000) {
      return `€${(num / 1000000).toFixed(1)}M`
    } else if (num >= 1000) {
      return `€${(num / 1000).toFixed(0)}K`
    }
    return `€${num.toFixed(0)}`
  }

  // Show loading state during hydration
  if (!isLoaded) {
    return (
      <>
        <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-500 animate-pulse">
          ✅ Loading...
        </div>
        <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-500 animate-pulse">
          💰 Loading...
        </div>
      </>
    )
  }

  return (
    <>
      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
        ✅ {deepResearchLeads.length} Research Complete
      </span>
      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
        💰 {formatCurrency(totalRevenuePotential)} Revenue Potential
      </span>
    </>
  )
}
