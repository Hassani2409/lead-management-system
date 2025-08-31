'use client'

import { useState } from 'react'
import { Lead, deleteLead, updateLead } from '@/lib/leadService'
import {
  TrashIcon,
  PencilIcon,
  XMarkIcon,
  CheckIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'

interface LeadEditDeleteProps {
  lead: Lead
  onLeadUpdated?: (updatedLead: Lead) => void
  onLeadDeleted?: (deletedLeadId: string) => void
}

export default function LeadEditDelete({ lead, onLeadUpdated, onLeadDeleted }: LeadEditDeleteProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [editData, setEditData] = useState({
    name: lead.name,
    business_type: lead.business_type,
    email: lead.email,
    phone: lead.phone,
    website: lead.website,
    location: lead.location,
    status: lead.status
  })

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleSave = () => {
    const updatedLead = updateLead(lead.id, editData)
    if (updatedLead && onLeadUpdated) {
      onLeadUpdated(updatedLead)
    }
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditData({
      name: lead.name,
      business_type: lead.business_type,
      email: lead.email,
      phone: lead.phone,
      website: lead.website,
      location: lead.location,
      status: lead.status
    })
    setIsEditing(false)
  }

  const handleDelete = () => {
    setIsDeleting(true)
  }

  const confirmDelete = () => {
    const success = deleteLead(lead.id)
    if (success && onLeadDeleted) {
      onLeadDeleted(lead.id)
    }
    setIsDeleting(false)
  }

  const cancelDelete = () => {
    setIsDeleting(false)
  }

  if (isEditing) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Lead bearbeiten
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                value={editData.name}
                onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Business Type
              </label>
              <select
                value={editData.business_type}
                onChange={(e) => setEditData({ ...editData, business_type: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
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
                Email
              </label>
              <input
                type="email"
                value={editData.email}
                onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <input
                type="tel"
                value={editData.phone}
                onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Website
              </label>
              <input
                type="url"
                value={editData.website}
                onChange={(e) => setEditData({ ...editData, website: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                type="text"
                value={editData.location}
                onChange={(e) => setEditData({ ...editData, location: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={editData.status}
                onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="new">Neu</option>
                <option value="active">Aktiv</option>
                <option value="contacted">Kontaktiert</option>
                <option value="qualified">Qualifiziert</option>
                <option value="proposal">Angebot</option>
                <option value="converted">Gewonnen</option>
              </select>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              <XMarkIcon className="h-4 w-4 inline mr-1" />
              Abbrechen
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <CheckIcon className="h-4 w-4 inline mr-1" />
              Speichern
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (isDeleting) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
          <div className="flex items-center mb-4">
            <ExclamationTriangleIcon className="h-6 w-6 text-red-600 mr-3" />
            <h3 className="text-lg font-semibold text-gray-900">
              Lead löschen
            </h3>
          </div>
          
          <p className="text-gray-600 mb-6">
            Sind Sie sicher, dass Sie den Lead <strong>{lead.name}</strong> löschen möchten? 
            Diese Aktion kann nicht rückgängig gemacht werden.
          </p>
          
          <div className="flex justify-end space-x-3">
            <button
              onClick={cancelDelete}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Abbrechen
            </button>
            <button
              onClick={confirmDelete}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <TrashIcon className="h-4 w-4 inline mr-1" />
              Löschen
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={handleEdit}
        className="text-blue-600 hover:text-blue-900 inline-flex items-center gap-1 text-xs"
        title="Lead bearbeiten"
      >
        <PencilIcon className="h-3 w-3" />
        Edit
      </button>
      <button
        onClick={handleDelete}
        className="text-red-600 hover:text-red-900 inline-flex items-center gap-1 text-xs"
        title="Lead löschen"
      >
        <TrashIcon className="h-3 w-3" />
        Delete
      </button>
    </div>
  )
}
