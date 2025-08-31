'use client'

import { useState, useEffect } from 'react'
import { Lead, getLeads, createLead, updateLead, deleteLead, bulkUpdateLeads, deleteMultipleLeads } from '@/lib/leadService'
import AdvancedLeadManagement from '@/components/AdvancedLeadManagement'
import BulkLeadActions from '@/components/BulkLeadActions'
import LeadEditDelete from '@/components/LeadEditDelete'
import {
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowUpTrayIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline'

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedLeads, setSelectedLeads] = useState<string[]>([])
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    loadLeads()
  }, [])

  const loadLeads = () => {
    setLoading(true)
    const allLeads = getLeads()
    setLeads(allLeads)
    setLoading(false)
  }

  const handleCreateLead = (leadData: Omit<Lead, 'id' | 'created_at'>) => {
    const newLead = createLead(leadData)
    setLeads(prev => [newLead, ...prev])
    setShowCreateForm(false)
  }

  const handleUpdateLead = (id: string, updates: Partial<Lead>) => {
    const updatedLead = updateLead(id, updates)
    if (updatedLead) {
      setLeads(prev => prev.map(lead =>
        lead.id === id ? updatedLead : lead
      ))
    }
  }

  const handleDeleteLead = (id: string) => {
    const success = deleteLead(id)
    if (success) {
      setLeads(prev => prev.filter(lead => lead.id !== id))
      setSelectedLeads(prev => prev.filter(selectedId => selectedId !== id))
    }
  }

  const handleBulkUpdate = (ids: string[], updates: Partial<Lead>) => {
    const updatedCount = bulkUpdateLeads(ids, updates)
    if (updatedCount > 0) {
      loadLeads() // Reload to get updated data
      setSelectedLeads([])
    }
  }

  const handleBulkDelete = (ids: string[]) => {
    const deletedCount = deleteMultipleLeads(ids)
    if (deletedCount > 0) {
      setLeads(prev => prev.filter(lead => !ids.includes(lead.id)))
      setSelectedLeads([])
    }
  }

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = !searchTerm ||
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.business_type.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter

    return matchesSearch && matchesStatus
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Lead Management</h1>
              <p className="mt-2 text-gray-600">
                Verwalten Sie Ihre Leads effizient mit erweiterten Funktionen
              </p>
            </div>
            <button
              onClick={() => setShowCreateForm(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Neuer Lead
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 bg-white p-4 rounded-lg shadow">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Leads suchen..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div className="sm:w-48">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Alle Status</option>
                <option value="new">Neu</option>
                <option value="contacted">Kontaktiert</option>
                <option value="qualified">Qualifiziert</option>
                <option value="converted">Konvertiert</option>
              </select>
            </div>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedLeads.length > 0 && (
          <div className="mb-6">
            <BulkLeadActions
              leads={leads}
              selectedLeads={selectedLeads}
              setSelectedLeads={setSelectedLeads}
              setLeads={setLeads}
            />
          </div>
        )}

        {/* Leads Table */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:p-6">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <input
                        type="checkbox"
                        checked={selectedLeads.length === filteredLeads.length && filteredLeads.length > 0}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedLeads(filteredLeads.map(lead => lead.id))
                          } else {
                            setSelectedLeads([])
                          }
                        }}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Geschäftstyp
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Kontakt
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Aktionen
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredLeads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedLeads.includes(lead.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedLeads(prev => [...prev, lead.id])
                            } else {
                              setSelectedLeads(prev => prev.filter(id => id !== lead.id))
                            }
                          }}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{lead.name}</div>
                        <div className="text-sm text-gray-500">{lead.location}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                          {lead.business_type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div>{lead.email}</div>
                        <div>{lead.phone}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          lead.status === 'new' ? 'bg-green-100 text-green-800' :
                          lead.status === 'contacted' ? 'bg-yellow-100 text-yellow-800' :
                          lead.status === 'qualified' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {lead.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <LeadEditDelete
                          lead={lead}
                          onLeadUpdated={(updatedLead) => handleUpdateLead(updatedLead.id, updatedLead)}
                          onLeadDeleted={handleDeleteLead}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-2xl font-bold text-gray-900">{leads.length}</div>
            <div className="text-gray-600">Gesamt Leads</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-2xl font-bold text-green-600">
              {leads.filter(l => l.status === 'new').length}
            </div>
            <div className="text-gray-600">Neue Leads</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-2xl font-bold text-blue-600">
              {leads.filter(l => l.status === 'qualified').length}
            </div>
            <div className="text-gray-600">Qualifizierte</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-2xl font-bold text-purple-600">
              {leads.filter(l => l.status === 'converted').length}
            </div>
            <div className="text-gray-600">Konvertiert</div>
          </div>
        </div>
      </div>
    </div>
  )
}
