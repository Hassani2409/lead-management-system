'use client'

import { useState, useEffect } from 'react'
import { getLeads } from '@/lib/leadService'
import { LeadScoringEngine } from '@/utils/leadScoring'

export default function DeepResearchStatus() {
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
  
  // Berechne echte Statistiken
  const deepResearchLeads = leads.filter(lead => lead.deep_research_completed)
  const totalRevenuePotential = leads.reduce((sum, lead) => sum + (lead.revenue_potential || 0), 0)
  const criticalLeads = leads.filter(lead => (lead.revenue_potential || 0) > 100000).length
  const readyToContactLeads = leads.filter(lead => lead.ready_to_contact).length
  const avgROIPayback = leads.reduce((sum, lead) => sum + (lead.roi_payback_months || 0), 0) / leads.length
  
  // Berechne Scoring-Statistiken
  const leadsWithScores = leads.map(lead => {
    const score = LeadScoringEngine.calculateLeadScore(lead)
    const category = LeadScoringEngine.categorizeLeadByScore(score)
    return { ...lead, calculatedScore: score, scoreCategory: category }
  })
  
  const hotLeads = leadsWithScores.filter(lead => lead.scoreCategory.category === 'hot').length
  const successRate = leads.length > 0 ? ((deepResearchLeads.length / leads.length) * 100) : 0
  
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
      <div className="space-y-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="flex justify-between items-center">
            <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
            <div className="h-6 bg-gray-200 rounded w-16 animate-pulse"></div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-gray-600">Total Revenue Pipeline</span>
        <span className="font-semibold text-2xl text-green-600">
          {formatCurrency(totalRevenuePotential)}
        </span>
      </div>
      
      <div className="flex justify-between items-center">
        <span className="text-gray-600">Research Success Rate</span>
        <span className="font-semibold text-2xl text-green-600">
          {successRate.toFixed(1)}%
        </span>
      </div>
      
      <div className="flex justify-between items-center">
        <span className="text-gray-600">Critical Priority Leads</span>
        <span className="font-semibold text-2xl text-red-600">
          {criticalLeads}
        </span>
      </div>
      
      <div className="flex justify-between items-center">
        <span className="text-gray-600">Hot Leads (Score ≥80)</span>
        <span className="font-semibold text-2xl text-orange-600">
          {hotLeads}
        </span>
      </div>
      
      <div className="flex justify-between items-center">
        <span className="text-gray-600">Ready to Contact</span>
        <span className="font-semibold text-green-600">
          ✅ {readyToContactLeads}
        </span>
      </div>
      
      <div className="flex justify-between items-center">
        <span className="text-gray-600">Avg ROI Payback</span>
        <span className="font-semibold text-blue-600">
          {avgROIPayback.toFixed(1)} months
        </span>
      </div>
      
      <div className="flex justify-between items-center">
        <span className="text-gray-600">Deep Research Status</span>
        <span className="font-semibold text-green-600">
          🔬 {deepResearchLeads.length} Complete
        </span>
      </div>
      
      <div className="flex justify-between items-center">
        <span className="text-gray-600">Total Active Leads</span>
        <span className="font-semibold text-blue-600">
          📊 {leads.length}
        </span>
      </div>
    </div>
  )
}
