'use client'

import { useState, useEffect } from 'react'
import { getLeadStats, getLeads } from '@/lib/leadService'
import { LeadScoringEngine } from '@/utils/leadScoring'
import {
  UserGroupIcon,
  BuildingOfficeIcon,
  ChartBarIcon,
  CheckCircleIcon,
  StarIcon,
  FireIcon,
  CurrencyEuroIcon,
  ClockIcon,
  RocketLaunchIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline'

// Einheitliche Formatierungsfunktion für Zahlen
const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('de-DE').format(num)
}

const formatCurrency = (num: number): string => {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(num)
}

export default function StatsCards() {
  const [stats, setStats] = useState<any>({ total: 0, by_business_type: {} })
  const [leads, setLeads] = useState<any[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Only run on client side to avoid hydration mismatch
    const loadData = () => {
      const loadedStats = getLeadStats()
      const loadedLeads = getLeads()
      setStats(loadedStats)
      setLeads(loadedLeads)
      setIsLoaded(true)
    }

    loadData()
  }, [])

  // Berechne Deep Research Statistiken
  const deepResearchLeads = leads.filter(lead => lead.deep_research_completed)
  const totalRevenuePotential = leads.reduce((sum, lead) => sum + (lead.revenue_potential || 0), 0)
  const avgRevenuePotential = totalRevenuePotential / leads.length
  const criticalLeads = leads.filter(lead => (lead.revenue_potential || 0) > 100000).length
  const highPriorityLeads = leads.filter(lead => (lead.revenue_potential || 0) >= 50000 && (lead.revenue_potential || 0) <= 100000).length
  const readyToContactLeads = leads.filter(lead => lead.ready_to_contact).length
  const avgROIPayback = leads.reduce((sum, lead) => sum + (lead.roi_payback_months || 0), 0) / leads.length

  // Berechne Scoring-Statistiken
  const leadsWithScores = leads.map(lead => {
    const score = LeadScoringEngine.calculateLeadScore(lead)
    const category = LeadScoringEngine.categorizeLeadByScore(score)
    return { ...lead, calculatedScore: score, scoreCategory: category }
  })

  const hotLeads = leadsWithScores.filter(lead => lead.scoreCategory.category === 'hot').length
  const warmLeads = leadsWithScores.filter(lead => lead.scoreCategory.category === 'warm').length

  const cards = [
    {
      title: 'Total Revenue Potential',
      value: `€${(totalRevenuePotential / 1000000).toFixed(1)}M`,
      icon: CurrencyEuroIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      change: `${formatCurrency(Math.round(avgRevenuePotential))} avg`,
      changeType: 'positive',
      priority: 1
    },
    {
      title: 'Critical Priority Leads',
      value: criticalLeads.toString(),
      icon: RocketLaunchIcon,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      change: '>€100k Revenue',
      changeType: 'positive',
      priority: 2
    },
    {
      title: 'High Priority Leads',
      value: highPriorityLeads.toString(),
      icon: FireIcon,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      change: '€50k-100k Revenue',
      changeType: 'positive',
      priority: 3
    },
    {
      title: 'Ready to Contact',
      value: readyToContactLeads.toString(),
      icon: CheckCircleIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      change: 'Immediate Action',
      changeType: 'positive',
      priority: 4
    },
    {
      title: 'Deep Research Complete',
      value: deepResearchLeads.length.toString(),
      icon: MagnifyingGlassIcon,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      change: `${Math.round((deepResearchLeads.length / leads.length) * 100)}% analyzed`,
      changeType: 'positive',
      priority: 5
    },
    {
      title: 'Avg ROI Payback',
      value: `${avgROIPayback.toFixed(1)}mo`,
      icon: ClockIcon,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      change: 'Fast Return',
      changeType: 'positive',
      priority: 6
    },
    {
      title: 'Total Leads',
      value: formatNumber(stats.total),
      icon: UserGroupIcon,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
      change: '100% Success Rate',
      changeType: 'positive',
      priority: 7
    },
    {
      title: 'Business Types',
      value: Object.keys(stats.by_business_type).length,
      icon: BuildingOfficeIcon,
      color: 'text-slate-600',
      bgColor: 'bg-slate-50',
      change: 'Diverse Portfolio',
      changeType: 'neutral',
      priority: 8
    }
  ]

  // Sortiere nach Priorität
  const sortedCards = cards.sort((a, b) => a.priority - b.priority)

  // Show loading state during hydration
  if (!isLoaded) {
    return (
      <div className="space-y-6">
        {/* Loading Priority Revenue Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-gray-300 animate-pulse">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
                  <div className="h-6 bg-gray-200 rounded w-20"></div>
                </div>
                <div className="p-4 rounded-xl bg-gray-100">
                  <div className="h-8 w-8 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Loading Secondary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, index) => (
            <div key={index + 4} className="bg-white rounded-lg shadow-sm p-4 border border-gray-200 animate-pulse">
              <div className="flex items-center">
                <div className="p-2 rounded-lg bg-gray-100">
                  <div className="h-5 w-5 bg-gray-200 rounded"></div>
                </div>
                <div className="ml-3 flex-1">
                  <div className="h-3 bg-gray-200 rounded w-16 mb-1"></div>
                  <div className="h-5 bg-gray-200 rounded w-12 mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-20"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Priority Revenue Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {sortedCards.slice(0, 4).map((card, index) => (
          <div key={index} className={`bg-white rounded-xl shadow-lg p-6 border-l-4 ${
            card.priority === 1 ? 'border-green-500' :
            card.priority === 2 ? 'border-red-500' :
            card.priority === 3 ? 'border-orange-500' : 'border-blue-500'
          } hover:shadow-xl transition-shadow duration-200`}>
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-1">{card.title}</p>
                <p className="text-3xl font-bold text-gray-900 mb-2" suppressHydrationWarning>{card.value}</p>
                <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                  card.changeType === 'positive' ? 'bg-green-100 text-green-700' :
                  card.changeType === 'negative' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                }`}>
                  {card.change}
                </span>
              </div>
              <div className={`p-4 rounded-xl ${card.bgColor}`}>
                <card.icon className={`h-8 w-8 ${card.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {sortedCards.slice(4).map((card, index) => (
          <div key={index + 4} className="bg-white rounded-lg shadow-sm p-4 border border-gray-200 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center">
              <div className={`p-2 rounded-lg ${card.bgColor}`}>
                <card.icon className={`h-5 w-5 ${card.color}`} />
              </div>
              <div className="ml-3 flex-1">
                <p className="text-xs font-medium text-gray-600">{card.title}</p>
                <p className="text-lg font-bold text-gray-900" suppressHydrationWarning>{card.value}</p>
                <span className="text-xs text-gray-500">{card.change}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
