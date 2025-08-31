'use client'

import { useState } from 'react'
import {
  DocumentTextIcon,
  EyeIcon,
  XMarkIcon,
  FolderOpenIcon
} from '@heroicons/react/24/outline'
import DocumentViewer from './DocumentViewer'

interface QuickDocumentViewerProps {
  leadName: string
  leadId: string
  leadData?: any
}

export default function QuickDocumentViewer({ leadName, leadId, leadData }: QuickDocumentViewerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedFolder, setSelectedFolder] = useState<any>(null)
  const [viewerOpen, setViewerOpen] = useState(false)

  // Mock folders for quick access
  const quickFolders = [
    {
      name: '01_CURSOR_PROMPTS',
      title: 'Cursor Prompts',
      files: ['cursor_prompt.md', 'development_guide.md', 'ai_instructions.txt'],
      icon: '🤖'
    },
    {
      name: '02_PROJECT_PROPOSALS',
      title: 'Project Proposals',
      files: ['project_proposal.md', 'implementation_plan.pdf', 'cost_breakdown.json'],
      icon: '📋'
    },
    {
      name: '03_DEEP_RESEARCH',
      title: 'Deep Research',
      files: ['business_analysis.json', 'market_research.md', 'competitor_analysis.json'],
      icon: '🔍'
    }
  ]

  const handleFolderClick = (folder: any) => {
    setSelectedFolder(folder)
    setViewerOpen(true)
    setIsOpen(false)
  }

  return (
    <>
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
          title="Dokumente anzeigen"
        >
          <DocumentTextIcon className="h-4 w-4" />
        </button>

        {isOpen && (
          <>
            <div 
              className="fixed inset-0 z-10" 
              onClick={() => setIsOpen(false)}
            />
            <div className="absolute right-0 top-8 z-20 w-64 bg-white rounded-lg shadow-lg border border-gray-200 p-3">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold text-gray-900">
                  Dokumente für {leadName}
                </h4>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <XMarkIcon className="h-4 w-4 text-gray-400" />
                </button>
              </div>
              
              <div className="space-y-2">
                {quickFolders.map((folder, index) => (
                  <button
                    key={index}
                    onClick={() => handleFolderClick(folder)}
                    className="w-full flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors text-left"
                  >
                    <span className="text-lg">{folder.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {folder.title}
                      </p>
                      <p className="text-xs text-gray-500">
                        {folder.files.length} Dateien
                      </p>
                    </div>
                    <EyeIcon className="h-4 w-4 text-gray-400" />
                  </button>
                ))}
              </div>
              
              <div className="mt-3 pt-3 border-t border-gray-200">
                <button
                  onClick={() => {
                    setIsOpen(false)
                    // Navigate to full lead detail page
                    window.location.href = `/leads/${leadId}`
                  }}
                  className="w-full flex items-center justify-center space-x-2 p-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <FolderOpenIcon className="h-4 w-4" />
                  <span>Alle Dokumente anzeigen</span>
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Document Viewer Modal */}
      {selectedFolder && (
        <DocumentViewer
          isOpen={viewerOpen}
          onClose={() => setViewerOpen(false)}
          folderName={selectedFolder.name}
          folderTitle={selectedFolder.title}
          leadName={leadName}
          files={selectedFolder.files}
          leadData={leadData}
        />
      )}
    </>
  )
}
