'use client'

import { useState } from 'react'
import { Lead, updateLead } from '@/lib/leadService'
import {
  CheckCircleIcon,
  ClockIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  XCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'

interface LeadStatusUpdateProps {
  lead: Lead
  onStatusUpdated?: (updatedLead: Lead) => void
}

const STATUS_OPTIONS = [
  {
    value: 'new',
    label: 'Neu',
    icon: ClockIcon,
    color: 'bg-green-100 text-green-800',
    description: 'Neuer Lead, noch nicht kontaktiert'
  },
  {
    value: 'contacted',
    label: 'Kontaktiert',
    icon: UserGroupIcon,
    color: 'bg-blue-100 text-blue-800',
    description: 'Lead wurde kontaktiert'
  },
  {
    value: 'qualified',
    label: 'Qualifiziert',
    icon: CheckCircleIcon,
    color: 'bg-purple-100 text-purple-800',
    description: 'Lead ist qualifiziert und interessiert'
  },
  {
    value: 'proposal',
    label: 'Angebot',
    icon: CurrencyDollarIcon,
    color: 'bg-yellow-100 text-yellow-800',
    description: 'Angebot wurde versendet'
  },
  {
    value: 'negotiation',
    label: 'Verhandlung',
    icon: ExclamationTriangleIcon,
    color: 'bg-orange-100 text-orange-800',
    description: 'Verhandlung läuft'
  },
  {
    value: 'converted',
    label: 'Konvertiert',
    icon: CheckCircleIcon,
    color: 'bg-green-100 text-green-800',
    description: 'Lead wurde erfolgreich konvertiert'
  },
  {
    value: 'lost',
    label: 'Verloren',
    icon: XCircleIcon,
    color: 'bg-red-100 text-red-800',
    description: 'Lead ist verloren'
  },
  {
    value: 'nurturing',
    label: 'Nurturing',
    icon: ClockIcon,
    color: 'bg-gray-100 text-gray-800',
    description: 'Lead wird gepflegt'
  }
]

export default function LeadStatusUpdate({ lead, onStatusUpdated }: LeadStatusUpdateProps) {
  const [isUpdating, setIsUpdating] = useState(false)
  const [showStatusMenu, setShowStatusMenu] = useState(false)

  const currentStatus = STATUS_OPTIONS.find(option => option.value === lead.status) || STATUS_OPTIONS[0]

  const handleStatusChange = async (newStatus: string) => {
    setIsUpdating(true)
    try {
      const updatedLead = updateLead(lead.id, { status: newStatus })
      if (updatedLead && onStatusUpdated) {
        onStatusUpdated(updatedLead)
      }
    } catch (error) {
      console.error('Error updating lead status:', error)
    } finally {
      setIsUpdating(false)
      setShowStatusMenu(false)
    }
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowStatusMenu(!showStatusMenu)}
        disabled={isUpdating}
        className={`inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium ${
          currentStatus.color
        } hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        <currentStatus.icon className="h-4 w-4 mr-2" />
        {currentStatus.label}
        {isUpdating && (
          <div className="ml-2 animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
        )}
      </button>

      {showStatusMenu && (
        <div className="absolute z-10 mt-2 w-80 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5">
          <div className="py-1">
            {STATUS_OPTIONS.map((option) => {
              const Icon = option.icon
              const isCurrent = option.value === lead.status

              return (
                <button
                  key={option.value}
                  onClick={() => handleStatusChange(option.value)}
                  className={`w-full text-left px-4 py-3 hover:bg-gray-50 focus:outline-none focus:bg-gray-50 ${
                    isCurrent ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-start">
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      isCurrent ? option.color : 'bg-gray-100'
                    }`}>
                      <Icon className={`h-4 w-4 ${isCurrent ? '' : 'text-gray-400'}`} />
                    </div>
                    <div className="ml-3 flex-1">
                      <div className="flex items-center">
                        <span className={`text-sm font-medium ${
                          isCurrent ? 'text-blue-900' : 'text-gray-900'
                        }`}>
                          {option.label}
                        </span>
                        {isCurrent && (
                          <CheckCircleIcon className="ml-2 h-4 w-4 text-blue-600" />
                        )}
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        {option.description}
                      </p>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Click outside to close */}
      {showStatusMenu && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setShowStatusMenu(false)}
        />
      )}
    </div>
  )
}
