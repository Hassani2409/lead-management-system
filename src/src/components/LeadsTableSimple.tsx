'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getLeads, BUSINESS_TYPE_LABELS, STATUS_LABELS, Lead, resetLeadsToDefault } from '@/lib/leadService'
import { LeadScoringEngine } from '@/utils/leadScoring'
import LeadEditDelete from './LeadEditDelete'
import QuickDocumentViewer from './QuickDocumentViewer'
import BulkLeadActions from './BulkLeadActions'
import {
  EnvelopeIcon,
  PhoneIcon,
  GlobeAltIcon,
  EyeIcon,
  MagnifyingGlassIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'

// Formatierungsfunktionen
const formatCurrency = (num: number): string => {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(num)
}

export default function LeadsTableSimple() {
  const [allLeads, setAllLeads] = useState<Lead[]>([])
  const [selectedLeads, setSelectedLeads] = useState<Lead[]>([])
  const [searchQuery, setSearchQuery] = useState('')

  // Load leads on component mount
  useEffect(() => {
    const leads = getLeads()
    console.log('LeadsTableSimple: Loaded', leads.length, 'leads')
    setAllLeads(leads)
  }, [])

  // Debug function to reset leads
  const handleResetLeads = () => {
    resetLeadsToDefault()
    const leads = getLeads()
    setAllLeads(leads)
    console.log('Reset complete, reloaded', leads.length, 'leads')
  }

  // Lead management handlers
  const handleLeadUpdated = (updatedLead: Lead) => {
    setAllLeads(prevLeads => 
      prevLeads.map(lead => lead.id === updatedLead.id ? updatedLead : lead)
    )
    setSelectedLeads(prevSelected => 
      prevSelected.map(lead => lead.id === updatedLead.id ? updatedLead : lead)
    )
  }

  const handleLeadDeleted = (deletedLeadId: string) => {
    setAllLeads(prevLeads => prevLeads.filter(lead => lead.id !== deletedLeadId))
    setSelectedLeads(prevSelected => prevSelected.filter(lead => lead.id !== deletedLeadId))
  }

  const handleLeadsDeleted = (deletedLeadIds: string[]) => {
    setAllLeads(prevLeads => prevLeads.filter(lead => !deletedLeadIds.includes(lead.id)))
    setSelectedLeads([])
  }

  const handleLeadsUpdated = (updatedLeads: Lead[]) => {
    const updatedLeadIds = updatedLeads.map(lead => lead.id)
    setAllLeads(prevLeads => 
      prevLeads.map(lead => {
        const updatedLead = updatedLeads.find(ul => ul.id === lead.id)
        return updatedLead || lead
      })
    )
    setSelectedLeads([])
  }

  const handleSelectLead = (lead: Lead, isSelected: boolean) => {
    if (isSelected) {
      setSelectedLeads(prev => [...prev, lead])
    } else {
      setSelectedLeads(prev => prev.filter(l => l.id !== lead.id))
    }
  }

  const handleSelectAll = (isSelected: boolean) => {
    if (isSelected) {
      setSelectedLeads([...filteredLeads])
    } else {
      setSelectedLeads([])
    }
  }

  const clearSelection = () => {
    setSelectedLeads([])
  }

  // Search and filter leads
  const filteredLeads = allLeads.filter(lead => {
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      return (
        lead.name.toLowerCase().includes(query) ||
        lead.business_type.toLowerCase().includes(query) ||
        (lead.email && lead.email.toLowerCase().includes(query)) ||
        (lead.phone && lead.phone.includes(query)) ||
        (lead.website && lead.website.toLowerCase().includes(query)) ||
        (lead.location && lead.location.toLowerCase().includes(query))
      )
    }
    return true
  })

  // Calculate lead scores
  const leadsWithScores = filteredLeads.map(lead => {
    const score = LeadScoringEngine.calculateLeadScore(lead)
    const category = LeadScoringEngine.categorizeLeadByScore(score)
    return {
      ...lead,
      calculatedScore: score,
      scoreCategory: category.category
    }
  }).slice(0, 50) // Limit to 50 leads for performance

  const getBusinessTypeBadge = (businessType: string) => {
    const typeClasses = {
      restaurant: 'bg-orange-100 text-orange-800',
      hotel: 'bg-blue-100 text-blue-800',
      business: 'bg-gray-100 text-gray-800',
      retail: 'bg-green-100 text-green-800',
      service: 'bg-purple-100 text-purple-800',
      healthcare: 'bg-red-100 text-red-800'
    }

    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${typeClasses[businessType as keyof typeof typeClasses] || 'bg-gray-100 text-gray-800'}`}>
        {BUSINESS_TYPE_LABELS[businessType as keyof typeof BUSINESS_TYPE_LABELS] || businessType}
      </span>
    )
  }

  const getPriorityBadge = (revenuePotential: number) => {
    if (revenuePotential > 100000) {
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">🚨 Critical</span>
    } else if (revenuePotential >= 50000) {
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">🔥 High</span>
    } else if (revenuePotential >= 30000) {
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">⚡ Medium</span>
    } else {
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">📋 Low</span>
    }
  }

  const getStatusBadge = (status: string, readyToContact: boolean, deepResearch: boolean) => {
    if (readyToContact && deepResearch) {
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">✅ Ready</span>
    } else if (deepResearch) {
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">🔬 Analyzed</span>
    } else {
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">📝 {STATUS_LABELS[status as keyof typeof STATUS_LABELS] || status}</span>
    }
  }

  return (
    <div className="space-y-6">
      {/* Bulk Actions */}
      <BulkLeadActions
        leads={allLeads}
        selectedLeads={selectedLeads.map(lead => lead.id)}
        setSelectedLeads={(ids: string[]) => {
          const selectedLeadObjects = allLeads.filter(lead => ids.includes(lead.id))
          setSelectedLeads(selectedLeadObjects)
        }}
        setLeads={setAllLeads}
      />

      {/* Search Bar */}
      <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
        <div className="relative">
          <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Suche nach Name, Email, Phone, Website, Location... (z.B. 'Hyatt')"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
          )}
        </div>
        {searchQuery && (
          <p className="text-sm text-gray-600 mt-2">
            {filteredLeads.length} Ergebnisse für "{searchQuery}"
          </p>
        )}

        {/* Debug Button - Remove in production */}
        {allLeads.length === 0 && (
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-sm text-yellow-800 mb-2">
              ⚠️ Keine Leads gefunden. Dies könnte ein localStorage Problem sein.
            </p>
            <button
              onClick={handleResetLeads}
              className="px-4 py-2 bg-yellow-600 text-white text-sm rounded-md hover:bg-yellow-700"
            >
              🔄 Leads zurücksetzen
            </button>
          </div>
        )}
      </div>

      {/* Enhanced Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    checked={selectedLeads.length === leadsWithScores.length && leadsWithScores.length > 0}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lead & Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Revenue Potential
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact & Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dokumente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {leadsWithScores.map((lead) => {
                const isSelected = selectedLeads.some(selected => selected.id === lead.id)
                return (
                  <tr key={lead.id} className={`hover:bg-gray-50 transition-colors ${isSelected ? 'bg-blue-50' : ''}`}>
                    {/* Checkbox */}
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => handleSelectLead(lead, e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    
                    {/* Lead & Priority */}
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-900">
                            {lead.name}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {getBusinessTypeBadge(lead.business_type)}
                          </div>
                        </div>
                        <div>
                          {getPriorityBadge((lead as any).revenue_potential || 0)}
                        </div>
                      </div>
                    </td>

                    {/* Revenue Potential */}
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {formatCurrency((lead as any).revenue_potential || 0)}
                      </div>
                      <div className="text-xs text-gray-500">
                        ROI: {(lead as any).roi_payback_months ? `${(lead as any).roi_payback_months} months` : 'TBD'}
                      </div>
                    </td>

                    {/* Contact & Status */}
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2 mb-2">
                        {lead.email && (
                          <a href={`mailto:${lead.email}`} className="text-blue-600 hover:text-blue-900" title={lead.email}>
                            <EnvelopeIcon className="h-4 w-4" />
                          </a>
                        )}
                        {lead.phone && (
                          <a href={`tel:${lead.phone}`} className="text-green-600 hover:text-green-900" title={lead.phone}>
                            <PhoneIcon className="h-4 w-4" />
                          </a>
                        )}
                        {lead.website && (
                          <a href={lead.website} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:text-purple-900" title={lead.website}>
                            <GlobeAltIcon className="h-4 w-4" />
                          </a>
                        )}
                      </div>
                      <div>
                        {getStatusBadge(lead.status, (lead as any).ready_to_contact, (lead as any).deep_research_completed)}
                      </div>
                    </td>

                    {/* Documents */}
                    <td className="px-6 py-4">
                      <QuickDocumentViewer
                        leadName={lead.name}
                        leadId={lead.id}
                        leadData={lead}
                      />
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <Link
                          href={`/leads/${lead.id}`}
                          className="text-blue-600 hover:text-blue-900 inline-flex items-center gap-1 text-xs"
                        >
                          <EyeIcon className="h-3 w-3" />
                          View
                        </Link>
                        <LeadEditDelete
                          lead={lead}
                          onLeadUpdated={handleLeadUpdated}
                          onLeadDeleted={handleLeadDeleted}
                        />
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        
        {/* Table Footer */}
        <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div>
              Showing {leadsWithScores.length} of {filteredLeads.length} leads
              {searchQuery && ` (filtered from ${allLeads.length} total)`}
            </div>
            <div className="flex items-center space-x-4">
              <div>Total Revenue Potential: {formatCurrency(filteredLeads.reduce((sum, lead) => sum + ((lead as any).revenue_potential || 0), 0))}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
