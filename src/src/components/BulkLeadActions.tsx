'use client'

import { useState } from 'react'
import { Lead, deleteMultipleLeads, bulkUpdateLeads } from '@/lib/leadService'
import {
  TrashIcon,
  PencilIcon,
  XMarkIcon,
  CheckIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'

interface BulkLeadActionsProps {
  leads: Lead[]
  selectedLeads: string[]
  setSelectedLeads: (leads: string[]) => void
  setLeads: (leads: Lead[]) => void
}

export default function BulkLeadActions({ leads, selectedLeads, setSelectedLeads, setLeads }: BulkLeadActionsProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [isBulkEditing, setIsBulkEditing] = useState(false)
  const [bulkEditData, setBulkEditData] = useState({
    business_type: '',
    status: '',
    location: ''
  })

  // Get selected lead objects from IDs
  const selectedLeadObjects = leads.filter(lead => selectedLeads.includes(lead.id))

  if (selectedLeads.length === 0) {
    return null
  }

  const handleBulkDelete = () => {
    setIsDeleting(true)
  }

  const confirmBulkDelete = () => {
    const leadIds = selectedLeadObjects.map(lead => lead.id)
    const deletedCount = deleteMultipleLeads(leadIds)

    if (deletedCount > 0) {
      // Update leads state by removing deleted leads
      const updatedLeads = leads.filter(lead => !leadIds.includes(lead.id))
      setLeads(updatedLeads)
      setSelectedLeads([])
    }
    
    setIsDeleting(false)
  }

  const cancelBulkDelete = () => {
    setIsDeleting(false)
  }

  const handleBulkEdit = () => {
    setIsBulkEditing(true)
  }

  const saveBulkEdit = () => {
    const leadIds = selectedLeadObjects.map(lead => lead.id)
    const updates: any = {}

    if (bulkEditData.business_type) {
      updates.business_type = bulkEditData.business_type
    }
    if (bulkEditData.status) {
      updates.status = bulkEditData.status
    }
    if (bulkEditData.location) {
      updates.location = bulkEditData.location
    }
    
    if (Object.keys(updates).length > 0) {
      const updatedCount = bulkUpdateLeads(leadIds, updates)

      if (updatedCount > 0) {
        // Update leads state with the updated leads
        const updatedLeadsState = leads.map(lead => {
          if (leadIds.includes(lead.id)) {
            return { ...lead, ...updates }
          }
          return lead
        })
        setLeads(updatedLeadsState)
        setSelectedLeads([])
      }
    }

    setIsBulkEditing(false)
    setBulkEditData({ business_type: '', status: '', location: '' })
  }

  const cancelBulkEdit = () => {
    setIsBulkEditing(false)
    setBulkEditData({ business_type: '', status: '', location: '' })
  }

  if (isDeleting) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
          <div className="flex items-center mb-4">
            <ExclamationTriangleIcon className="h-6 w-6 text-red-600 mr-3" />
            <h3 className="text-lg font-semibold text-gray-900">
              Leads löschen
            </h3>
          </div>
          
          <p className="text-gray-600 mb-6">
            Sind Sie sicher, dass Sie <strong>{selectedLeads.length} Leads</strong> löschen möchten?
            Diese Aktion kann nicht rückgängig gemacht werden.
          </p>

          <div className="bg-gray-50 rounded-md p-3 mb-4 max-h-32 overflow-y-auto">
            <p className="text-sm font-medium text-gray-700 mb-2">Zu löschende Leads:</p>
            <ul className="text-sm text-gray-600 space-y-1">
              {selectedLeadObjects.map(lead => (
                <li key={lead.id}>• {lead.name}</li>
              ))}
            </ul>
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              onClick={cancelBulkDelete}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Abbrechen
            </button>
            <button
              onClick={confirmBulkDelete}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <TrashIcon className="h-4 w-4 inline mr-1" />
              {selectedLeads.length} Leads löschen
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (isBulkEditing) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Bulk Edit - {selectedLeads.length} Leads
          </h3>
          
          <p className="text-sm text-gray-600 mb-4">
            Nur ausgefüllte Felder werden für alle ausgewählten Leads aktualisiert.
          </p>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Business Type (optional)
              </label>
              <select
                value={bulkEditData.business_type}
                onChange={(e) => setBulkEditData({ ...bulkEditData, business_type: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-- Nicht ändern --</option>
                <option value="restaurant">Restaurant</option>
                <option value="hotel">Hotel</option>
                <option value="business">Business</option>
                <option value="retail">Retail</option>
                <option value="service">Service</option>
                <option value="healthcare">Healthcare</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status (optional)
              </label>
              <select
                value={bulkEditData.status}
                onChange={(e) => setBulkEditData({ ...bulkEditData, status: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-- Nicht ändern --</option>
                <option value="new">Neu</option>
                <option value="active">Aktiv</option>
                <option value="contacted">Kontaktiert</option>
                <option value="qualified">Qualifiziert</option>
                <option value="proposal">Angebot</option>
                <option value="converted">Gewonnen</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location (optional)
              </label>
              <input
                type="text"
                value={bulkEditData.location}
                onChange={(e) => setBulkEditData({ ...bulkEditData, location: e.target.value })}
                placeholder="Neue Location für alle ausgewählten Leads"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-md p-3 mt-4 max-h-24 overflow-y-auto">
            <p className="text-sm font-medium text-gray-700 mb-1">Ausgewählte Leads:</p>
            <p className="text-xs text-gray-600">
              {selectedLeadObjects.map(lead => lead.name).join(', ')}
            </p>
          </div>
          
          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={cancelBulkEdit}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              <XMarkIcon className="h-4 w-4 inline mr-1" />
              Abbrechen
            </button>
            <button
              onClick={saveBulkEdit}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <CheckIcon className="h-4 w-4 inline mr-1" />
              {selectedLeads.length} Leads aktualisieren
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <CheckCircleIcon className="h-5 w-5 text-blue-600 mr-2" />
          <span className="text-sm font-medium text-blue-900">
            {selectedLeads.length} Lead{selectedLeads.length !== 1 ? 's' : ''} ausgewählt
          </span>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={handleBulkEdit}
            className="text-blue-600 hover:text-blue-900 inline-flex items-center gap-1 text-sm"
          >
            <PencilIcon className="h-4 w-4" />
            Bulk Edit
          </button>
          
          <button
            onClick={handleBulkDelete}
            className="text-red-600 hover:text-red-900 inline-flex items-center gap-1 text-sm"
          >
            <TrashIcon className="h-4 w-4" />
            Alle löschen
          </button>
          
          <button
            onClick={() => setSelectedLeads([])}
            className="text-gray-600 hover:text-gray-900 inline-flex items-center gap-1 text-sm"
          >
            <XMarkIcon className="h-4 w-4" />
            Auswahl aufheben
          </button>
        </div>
      </div>
    </div>
  )
}
