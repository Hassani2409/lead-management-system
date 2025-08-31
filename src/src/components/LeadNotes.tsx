'use client'

import { useState, useEffect } from 'react'
import { Lead, updateLead } from '@/lib/leadService'
import {
  ChatBubbleLeftIcon,
  PlusIcon,
  XMarkIcon,
  ClockIcon
} from '@heroicons/react/24/outline'

interface LeadNotesProps {
  lead: Lead
  onNotesUpdated?: (updatedLead: Lead) => void
}

interface Note {
  id: string
  content: string
  createdAt: string
  type: 'note' | 'call' | 'meeting' | 'email'
}

export default function LeadNotes({ lead, onNotesUpdated }: LeadNotesProps) {
  const [notes, setNotes] = useState<Note[]>([])
  const [showAddNote, setShowAddNote] = useState(false)
  const [newNoteContent, setNewNoteContent] = useState('')
  const [newNoteType, setNewNoteType] = useState<Note['type']>('note')

  useEffect(() => {
    // Load existing notes from lead data
    if (lead.notes) {
      try {
        const parsedNotes = JSON.parse(lead.notes)
        setNotes(Array.isArray(parsedNotes) ? parsedNotes : [])
      } catch {
        // If notes is not JSON, treat it as a single note
        if (lead.notes.trim()) {
          setNotes([{
            id: 'legacy-note',
            content: lead.notes,
            createdAt: lead.created_at,
            type: 'note'
          }])
        }
      }
    }
  }, [lead])

  const handleAddNote = () => {
    if (!newNoteContent.trim()) return

    const newNote: Note = {
      id: `note_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      content: newNoteContent.trim(),
      createdAt: new Date().toISOString(),
      type: newNoteType
    }

    const updatedNotes = [...notes, newNote]
    setNotes(updatedNotes)

    // Update lead with new notes
    const updatedLead = updateLead(lead.id, {
      notes: JSON.stringify(updatedNotes)
    })

    if (updatedLead && onNotesUpdated) {
      onNotesUpdated(updatedLead)
    }

    // Reset form
    setNewNoteContent('')
    setNewNoteType('note')
    setShowAddNote(false)
  }

  const handleDeleteNote = (noteId: string) => {
    const updatedNotes = notes.filter(note => note.id !== noteId)
    setNotes(updatedNotes)

    // Update lead with updated notes
    const updatedLead = updateLead(lead.id, {
      notes: JSON.stringify(updatedNotes)
    })

    if (updatedLead && onNotesUpdated) {
      onNotesUpdated(updatedLead)
    }
  }

  const getNoteTypeIcon = (type: Note['type']) => {
    switch (type) {
      case 'call':
        return '📞'
      case 'meeting':
        return '👥'
      case 'email':
        return '✉️'
      default:
        return '📝'
    }
  }

  const getNoteTypeLabel = (type: Note['type']) => {
    switch (type) {
      case 'call':
        return 'Anruf'
      case 'meeting':
        return 'Meeting'
      case 'email':
        return 'E-Mail'
      default:
        return 'Notiz'
    }
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <ChatBubbleLeftIcon className="h-5 w-5 text-gray-400 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Notizen & Aktivitäten</h3>
            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {notes.length}
            </span>
          </div>
          <button
            onClick={() => setShowAddNote(true)}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Notiz hinzufügen
          </button>
        </div>

        {/* Add Note Form */}
        {showAddNote && (
          <div className="mb-6 p-4 border border-gray-200 rounded-md bg-gray-50">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Art der Notiz
                </label>
                <select
                  value={newNoteType}
                  onChange={(e) => setNewNoteType(e.target.value as Note['type'])}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="note">📝 Notiz</option>
                  <option value="call">📞 Anruf</option>
                  <option value="meeting">👥 Meeting</option>
                  <option value="email">✉️ E-Mail</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Inhalt
                </label>
                <textarea
                  value={newNoteContent}
                  onChange={(e) => setNewNoteContent(e.target.value)}
                  rows={3}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Notiz eingeben..."
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowAddNote(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Abbrechen
                </button>
                <button
                  onClick={handleAddNote}
                  disabled={!newNoteContent.trim()}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Speichern
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Notes List */}
        <div className="space-y-4">
          {notes.length === 0 ? (
            <div className="text-center py-8">
              <ChatBubbleLeftIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Keine Notizen</h3>
              <p className="mt-1 text-sm text-gray-500">
                Fügen Sie Ihre erste Notiz hinzu, um den Lead-Verlauf zu dokumentieren.
              </p>
            </div>
          ) : (
            notes
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .map((note) => (
                <div key={note.id} className="flex space-x-3 p-4 border border-gray-200 rounded-lg">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm">
                      {getNoteTypeIcon(note.type)}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-900">
                          {getNoteTypeLabel(note.type)}
                        </span>
                        <span className="text-sm text-gray-500">
                          <ClockIcon className="h-4 w-4 inline mr-1" />
                          {new Date(note.createdAt).toLocaleDateString('de-DE', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                      <button
                        onClick={() => handleDeleteNote(note.id)}
                        className="text-gray-400 hover:text-red-600"
                      >
                        <XMarkIcon className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="mt-2 text-sm text-gray-700 whitespace-pre-wrap">
                      {note.content}
                    </div>
                  </div>
                </div>
              ))
          )}
        </div>
      </div>
    </div>
  )
}
