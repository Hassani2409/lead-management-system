'use client'

import { getTopLeads, getLeadsByScoreCategory } from '@/lib/leadService'
import { LeadScoringEngine } from '@/utils/leadScoring'
import Link from 'next/link'
import { 
  FireIcon,
  StarIcon,
  ChartBarIcon,
  EyeIcon,
  EnvelopeIcon,
  PhoneIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline'

export default function TopLeadsPage() {
  const topLeads = getTopLeads(20)
  const hotLeads = getLeadsByScoreCategory('hot')
  const warmLeads = getLeadsByScoreCategory('warm')

  const getScoreIcon = (category: string) => {
    switch (category) {
      case 'hot': return <FireIcon className="w-5 h-5 text-red-500" />
      case 'warm': return <StarIcon className="w-5 h-5 text-orange-500" />
      case 'cold': return <ChartBarIcon className="w-5 h-5 text-blue-500" />
      default: return <ChartBarIcon className="w-5 h-5 text-gray-500" />
    }
  }

  const getScoreColor = (category: string) => {
    switch (category) {
      case 'hot': return 'bg-red-100 text-red-800 border-red-200'
      case 'warm': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'cold': return 'bg-blue-100 text-blue-800 border-blue-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">🏆 Top Leads</h1>
                <p className="text-gray-600 mt-1">Highest scoring leads ready for immediate action</p>
              </div>
              <Link 
                href="/leads" 
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                All Leads
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <FireIcon className="w-8 h-8 text-red-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Hot Leads</p>
                <p className="text-2xl font-bold text-gray-900">{hotLeads.length}</p>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2">Score 80+ • Contact immediately</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <StarIcon className="w-8 h-8 text-orange-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Warm Leads</p>
                <p className="text-2xl font-bold text-gray-900">{warmLeads.length}</p>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2">Score 60-79 • Contact this week</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <ChartBarIcon className="w-8 h-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Score</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round(topLeads.reduce((sum, lead) => sum + (lead.calculated_score || 0), 0) / topLeads.length)}
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2">Top 20 leads average</p>
          </div>
        </div>

        {/* Top Leads List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">🎯 Top 20 Leads by Score</h2>
            <p className="text-sm text-gray-600 mt-1">Prioritized by our intelligent scoring algorithm</p>
          </div>
          
          <div className="divide-y divide-gray-200">
            {topLeads.map((lead, index) => (
              <div key={lead.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {/* Rank */}
                    <div className="flex-shrink-0">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        index < 3 ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {index + 1}
                      </div>
                    </div>
                    
                    {/* Lead Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">
                          {lead.name}
                        </h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getScoreColor(lead.score_category || 'poor')}`}>
                          {getScoreIcon(lead.score_category || 'poor')}
                          <span className="ml-1">{lead.score_label}</span>
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span className="bg-gray-100 px-2 py-1 rounded text-xs">
                          {lead.business_type}
                        </span>
                        {lead.location && (
                          <span>📍 {lead.location}</span>
                        )}
                      </div>
                      
                      {/* Contact Info */}
                      <div className="flex items-center space-x-4 mt-2">
                        {lead.email && (
                          <a href={`mailto:${lead.email}`} className="flex items-center text-sm text-blue-600 hover:text-blue-800">
                            <EnvelopeIcon className="w-4 h-4 mr-1" />
                            Email
                          </a>
                        )}
                        {lead.phone && (
                          <a href={`tel:${lead.phone}`} className="flex items-center text-sm text-blue-600 hover:text-blue-800">
                            <PhoneIcon className="w-4 h-4 mr-1" />
                            Call
                          </a>
                        )}
                        {lead.website && (
                          <a href={lead.website} target="_blank" rel="noopener noreferrer" className="flex items-center text-sm text-blue-600 hover:text-blue-800">
                            <GlobeAltIcon className="w-4 h-4 mr-1" />
                            Website
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Score & Actions */}
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className={`text-2xl font-bold ${
                        (lead.calculated_score || 0) >= 80 ? 'text-red-600' :
                        (lead.calculated_score || 0) >= 60 ? 'text-orange-600' :
                        (lead.calculated_score || 0) >= 40 ? 'text-blue-600' :
                        'text-gray-600'
                      }`}>
                        {lead.calculated_score || 0}
                      </div>
                      <div className="text-xs text-gray-500">Score</div>
                    </div>
                    
                    <Link 
                      href={`/leads/${lead.id}`}
                      className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <EyeIcon className="w-4 h-4 mr-1" />
                      View
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Recommendations */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">🎯 Recommended Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-blue-800 mb-2">🔥 Hot Leads ({hotLeads.length})</h4>
              <p className="text-sm text-blue-700">Contact immediately! These leads have the highest potential for conversion.</p>
            </div>
            <div>
              <h4 className="font-medium text-blue-800 mb-2">🌡️ Warm Leads ({warmLeads.length})</h4>
              <p className="text-sm text-blue-700">Reach out this week. Good potential with proper nurturing.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
