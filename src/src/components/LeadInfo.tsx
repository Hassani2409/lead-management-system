'use client'

import {
  EnvelopeIcon,
  PhoneIcon,
  GlobeAltIcon,
  MapPinIcon,
  CalendarIcon,
  BuildingOfficeIcon,
  StarIcon,
  ChartBarIcon,
  FireIcon
} from '@heroicons/react/24/outline'
import { Lead, BUSINESS_TYPE_LABELS } from '@/lib/leadService'
import { LeadScoringEngine } from '@/utils/leadScoring'

interface LeadInfoProps {
  lead: Lead
}

export default function LeadInfo({ lead }: LeadInfoProps) {
  // Berechne Lead-Score und Analyse
  const leadScore = LeadScoringEngine.calculateLeadScore(lead)
  const scoreCategory = LeadScoringEngine.categorizeLeadByScore(leadScore)
  const scoringAnalysis = LeadScoringEngine.createScoringAnalysis(lead)

  const contactInfo = [
    {
      icon: EnvelopeIcon,
      label: 'Email',
      value: lead.email,
      href: lead.email ? `mailto:${lead.email}` : undefined,
      available: !!lead.email
    },
    {
      icon: PhoneIcon,
      label: 'Phone',
      value: lead.phone,
      href: lead.phone ? `tel:${lead.phone}` : undefined,
      available: !!lead.phone
    },
    {
      icon: GlobeAltIcon,
      label: 'Website',
      value: lead.website,
      href: lead.website,
      available: !!lead.website,
      external: true
    },
    {
      icon: MapPinIcon,
      label: 'Location',
      value: lead.location || 'Not specified',
      available: !!lead.location
    }
  ]

  const businessInfo = [
    {
      icon: BuildingOfficeIcon,
      label: 'Business Type',
      value: BUSINESS_TYPE_LABELS[lead.business_type as keyof typeof BUSINESS_TYPE_LABELS] || lead.business_type
    },
    {
      icon: CalendarIcon,
      label: 'Created',
      value: new Date(lead.created_at).toLocaleDateString('de-DE', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }
  ]

  return (
    <div className="space-y-6">
      {/* Lead Score Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <StarIcon className="w-5 h-5 text-yellow-500" />
          Lead Score & Analysis
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Score Badge */}
          <div className="text-center">
            <div className={`inline-flex items-center px-4 py-2 rounded-full text-lg font-bold ${
              scoreCategory.category === 'hot' ? 'bg-red-100 text-red-800' :
              scoreCategory.category === 'warm' ? 'bg-orange-100 text-orange-800' :
              scoreCategory.category === 'cold' ? 'bg-blue-100 text-blue-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {leadScore}/100
            </div>
            <p className="text-sm text-gray-600 mt-1">{scoreCategory.label}</p>
          </div>

          {/* Priority */}
          <div className="text-center">
            <div className="flex items-center justify-center">
              {scoreCategory.category === 'hot' && <FireIcon className="w-6 h-6 text-red-500" />}
              {scoreCategory.category === 'warm' && <ChartBarIcon className="w-6 h-6 text-orange-500" />}
              {scoreCategory.category === 'cold' && <ChartBarIcon className="w-6 h-6 text-blue-500" />}
              {scoreCategory.category === 'poor' && <ChartBarIcon className="w-6 h-6 text-gray-500" />}
            </div>
            <p className="text-sm text-gray-600 mt-1">Priority {scoreCategory.priority}</p>
          </div>

          {/* Recommendations Count */}
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {scoringAnalysis.recommendations.length}
            </div>
            <p className="text-sm text-gray-600 mt-1">Recommendations</p>
          </div>
        </div>

        {/* Scoring Factors */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-sm font-medium text-gray-900">Completeness</div>
            <div className="text-lg font-bold text-blue-600">{Math.round(scoringAnalysis.factors.completeness)}</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-sm font-medium text-gray-900">Verification</div>
            <div className="text-lg font-bold text-green-600">{Math.round(scoringAnalysis.factors.verification)}</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-sm font-medium text-gray-900">Business Value</div>
            <div className="text-lg font-bold text-purple-600">{Math.round(scoringAnalysis.factors.businessValue)}</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-sm font-medium text-gray-900">Location</div>
            <div className="text-lg font-bold text-orange-600">{Math.round(scoringAnalysis.factors.location)}</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-sm font-medium text-gray-900">Source</div>
            <div className="text-lg font-bold text-indigo-600">{Math.round(scoringAnalysis.factors.source)}</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-sm font-medium text-gray-900">Freshness</div>
            <div className="text-lg font-bold text-teal-600">{Math.round(scoringAnalysis.factors.freshness)}</div>
          </div>
        </div>

        {/* Recommendations */}
        {scoringAnalysis.recommendations.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Recommendations:</h4>
            <ul className="space-y-1">
              {scoringAnalysis.recommendations.map((recommendation, index) => (
                <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  {recommendation}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Contact Information */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Contact Information
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {contactInfo.map((item, index) => (
            <div key={index} className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${item.available ? 'bg-primary-50' : 'bg-gray-50'}`}>
                <item.icon className={`h-5 w-5 ${item.available ? 'text-primary-600' : 'text-gray-400'}`} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{item.label}</p>
                {item.href ? (
                  <a
                    href={item.href}
                    target={item.external ? '_blank' : undefined}
                    rel={item.external ? 'noopener noreferrer' : undefined}
                    className="text-sm text-primary-600 hover:text-primary-700 transition-colors"
                  >
                    {item.value}
                    {item.external && ' ↗'}
                  </a>
                ) : (
                  <p className={`text-sm ${item.available ? 'text-gray-600' : 'text-gray-400'}`}>
                    {item.value}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Business Information */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Business Information
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {businessInfo.map((item, index) => (
            <div key={index} className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-primary-50">
                <item.icon className="h-5 w-5 text-primary-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{item.label}</p>
                <p className="text-sm text-gray-600">{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lead Statistics */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Lead Statistics
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary-600">✅</div>
            <div className="text-sm font-medium text-gray-900">Complete Package</div>
            <div className="text-xs text-gray-600">All materials ready</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-success-600">📊</div>
            <div className="text-sm font-medium text-gray-900">CRM Ready</div>
            <div className="text-xs text-gray-600">Contact info available</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-warning-600">🎯</div>
            <div className="text-sm font-medium text-gray-900">Project Ready</div>
            <div className="text-xs text-gray-600">Proposals prepared</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">🚀</div>
            <div className="text-sm font-medium text-gray-900">Deploy Ready</div>
            <div className="text-xs text-gray-600">Prototypes available</div>
          </div>
        </div>
      </div>
    </div>
  )
}
