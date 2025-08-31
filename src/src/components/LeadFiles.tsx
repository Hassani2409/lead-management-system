'use client'

import { useState } from 'react'
import {
  FolderIcon,
  DocumentTextIcon,
  CodeBracketIcon,
  PhotoIcon,
  CogIcon,
  RocketLaunchIcon,
  CircleStackIcon,
  ChartBarIcon,
  EyeIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline'
import { Lead } from '@/lib/leadService'
import DocumentViewer from './DocumentViewer'

interface LeadFilesProps {
  lead: Lead
}

export default function LeadFiles({ lead }: LeadFilesProps) {
  const [viewerOpen, setViewerOpen] = useState(false)
  const [selectedFolder, setSelectedFolder] = useState<any>(null)

  const folders = [
    {
      name: '01_CURSOR_PROMPTS',
      title: 'Cursor Prompts',
      description: 'AI-optimized development prompts ready for Cursor IDE',
      icon: CodeBracketIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      files: ['cursor_prompt.md', 'development_guide.md', 'ai_instructions.txt', 'setup_guide.md'],
      size: '4 files'
    },
    {
      name: '02_PROJECT_PROPOSALS',
      title: 'Project Proposals',
      description: 'Client-ready proposals and implementation plans',
      icon: DocumentTextIcon,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      files: ['project_proposal.md', 'implementation_plan.pdf', 'cost_breakdown.json', 'timeline.md', 'contract_template.pdf'],
      size: '5 files'
    },
    {
      name: '03_DEEP_RESEARCH',
      title: 'Deep Research',
      description: 'Comprehensive business analysis and market insights',
      icon: ChartBarIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      files: ['business_analysis.json', 'market_research.md', 'competitor_analysis.json', 'target_audience.md', 'swot_analysis.pdf'],
      size: '5 files'
    },
    {
      name: '04_UNSPLASH_IMAGES',
      title: 'Unsplash Images',
      description: 'Professional image collections for website integration',
      icon: PhotoIcon,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      files: ['image_collection.json', 'hero_images/', 'gallery/'],
      size: '15+ images'
    },
    {
      name: '05_TECH_SPECIFICATIONS',
      title: 'Tech Specifications',
      description: 'Detailed technical requirements and framework choices',
      icon: CogIcon,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
      files: ['tech_stack.md', 'requirements.json'],
      size: '2 files'
    },
    {
      name: '06_PROTOTYPES',
      title: 'Prototypes',
      description: 'Website prototypes and deployment-ready packages',
      icon: RocketLaunchIcon,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      files: ['prototype/', 'deployment_guide.md'],
      size: '1 package'
    },
    {
      name: '07_SUPABASE_DATA',
      title: 'Supabase Data',
      description: 'CRM data and lead intelligence from Supabase',
      icon: CircleStackIcon,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      files: ['crm_data.json', 'lead_history.json'],
      size: '2 files'
    }
  ]

  const handleFolderClick = (folder: any) => {
    setSelectedFolder(folder)
    setViewerOpen(true)
  }

  const handleFileDownload = (fileName: string, folderName: string) => {
    // In a real app, this would download the file
    console.log(`Downloading ${fileName} from ${folderName}`)

    // Create a mock download
    const element = document.createElement('a')
    const file = new Blob([`Mock content for ${fileName}`], { type: 'text/plain' })
    element.href = URL.createObjectURL(file)
    element.download = fileName
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  const handleDownloadAll = () => {
    // Mock download all functionality
    alert(`Downloading all files for ${lead.name}...`)
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Project Files & Materials
        </h3>
        <div className="flex items-center text-sm text-gray-600">
          <FolderIcon className="h-4 w-4 mr-1" />
          <span>7 folders available</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {folders.map((folder, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start space-x-3">
              <div className={`p-2 rounded-lg ${folder.bgColor}`}>
                <folder.icon className={`h-5 w-5 ${folder.color}`} />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-gray-900 truncate">
                    {folder.title}
                  </h4>
                  <span className="text-xs text-gray-500 ml-2">
                    {folder.size}
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                  {folder.description}
                </p>
                
                <div className="mt-3">
                  <div className="text-xs text-gray-500 mb-2">Sample files:</div>
                  <div className="space-y-1">
                    {folder.files.slice(0, 2).map((file, fileIndex) => (
                      <button
                        key={fileIndex}
                        onClick={(e) => {
                          e.stopPropagation()
                          handleFileDownload(file, folder.name)
                        }}
                        className="block text-xs text-blue-600 hover:text-blue-700 transition-colors"
                      >
                        📄 {file}
                      </button>
                    ))}
                    {folder.files.length > 2 && (
                      <div className="text-xs text-gray-400">
                        +{folder.files.length - 2} more files
                      </div>
                    )}
                  </div>

                  <div className="mt-3 flex items-center space-x-2">
                    <button
                      onClick={() => handleFolderClick(folder)}
                      className="flex items-center space-x-1 px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded hover:bg-blue-100 transition-colors"
                    >
                      <EyeIcon className="h-3 w-3" />
                      <span>Öffnen</span>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDownloadAll()
                      }}
                      className="flex items-center space-x-1 px-2 py-1 text-xs bg-gray-50 text-gray-700 rounded hover:bg-gray-100 transition-colors"
                    >
                      <ArrowDownTrayIcon className="h-3 w-3" />
                      <span>Download</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-medium text-gray-900">
              Complete Lead Package
            </h4>
            <p className="text-sm text-gray-600 mt-1">
              All materials are organized and ready for immediate use
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success-100 text-success-800">
              ✅ Complete
            </span>
            <button
              onClick={handleDownloadAll}
              className="flex items-center space-x-2 px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
            >
              <ArrowDownTrayIcon className="h-4 w-4" />
              <span>Download All</span>
            </button>
          </div>
        </div>
      </div>

      {/* Document Viewer Modal */}
      {selectedFolder && (
        <DocumentViewer
          isOpen={viewerOpen}
          onClose={() => setViewerOpen(false)}
          folderName={selectedFolder.name}
          folderTitle={selectedFolder.title}
          leadName={lead.name}
          files={selectedFolder.files}
          leadData={lead}
        />
      )}
    </div>
  )
}
