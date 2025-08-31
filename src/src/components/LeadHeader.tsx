'use client'

import Link from 'next/link'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import { Lead, BUSINESS_TYPE_LABELS, STATUS_LABELS } from '@/lib/leadService'

interface LeadHeaderProps {
  lead: Lead
}

export default function LeadHeader({ lead }: LeadHeaderProps) {
  const getStatusBadge = (status: string) => {
    const statusClasses = {
      new: 'bg-blue-100 text-blue-800',
      active: 'bg-green-100 text-green-800',
      contacted: 'bg-yellow-100 text-yellow-800',
      qualified: 'bg-green-100 text-green-800',
      proposal: 'bg-yellow-100 text-yellow-800',
      converted: 'bg-green-100 text-green-800'
    }
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusClasses[status as keyof typeof statusClasses] || 'bg-gray-100 text-gray-800'}`}>
        {STATUS_LABELS[status as keyof typeof STATUS_LABELS] || status}
      </span>
    )
  }

  const getBusinessTypeBadge = (type: string) => {
    const typeColors = {
      restaurant: 'bg-red-100 text-red-800',
      bakery: 'bg-yellow-100 text-yellow-800',
      hotel: 'bg-blue-100 text-blue-800',
      cafe: 'bg-orange-100 text-orange-800',
      pharmacy: 'bg-green-100 text-green-800',
      butcher: 'bg-pink-100 text-pink-800',
      business: 'bg-gray-100 text-gray-800'
    }
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${typeColors[type as keyof typeof typeColors] || 'bg-gray-100 text-gray-800'}`}>
        {BUSINESS_TYPE_LABELS[type as keyof typeof BUSINESS_TYPE_LABELS] || type}
      </span>
    )
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link
                href="/"
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeftIcon className="h-5 w-5 mr-2" />
                Back to Dashboard
              </Link>
            </div>
          </div>
          
          <div className="mt-4">
            <div className="flex items-center space-x-3">
              <h1 className="text-2xl font-bold text-gray-900">
                {lead.name}
              </h1>
              {getBusinessTypeBadge(lead.business_type)}
              {getStatusBadge(lead.status)}
            </div>
            
            <div className="mt-2 flex items-center space-x-4 text-sm text-gray-600">
              <span>ID: {lead.id}</span>
              {lead.location && (
                <>
                  <span>•</span>
                  <span>{lead.location}</span>
                </>
              )}
              <span>•</span>
              <span>Created: {new Date(lead.created_at).toLocaleDateString('de-DE')}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
