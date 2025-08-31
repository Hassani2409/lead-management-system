'use client'

import {
  EnvelopeIcon,
  PhoneIcon, 
  DocumentTextIcon,
  CodeBracketIcon,
  PhotoIcon,
  CogIcon,
  RocketLaunchIcon,
  FolderOpenIcon
} from '@heroicons/react/24/outline'
import { Lead } from '@/lib/leadService'

interface LeadActionsProps {
  lead: Lead
}

export default function LeadActions({ lead }: LeadActionsProps) {
  const quickActions = [
    {
      icon: EnvelopeIcon,
      label: 'Send Email',
      href: lead.email ? `mailto:${lead.email}` : undefined,
      disabled: !lead.email,
      color: 'bg-blue-50 text-blue-600 hover:bg-blue-100'
    },
    {
      icon: PhoneIcon,
      label: 'Call Lead',
      href: lead.phone ? `tel:${lead.phone}` : undefined,
      disabled: !lead.phone,
      color: 'bg-green-50 text-green-600 hover:bg-green-100'
    },
    {
      icon: DocumentTextIcon,
      label: 'View Proposal',
      href: '#',
      color: 'bg-purple-50 text-purple-600 hover:bg-purple-100'
    },
    {
      icon: FolderOpenIcon,
      label: 'Open Folder',
      href: '#',
      color: 'bg-orange-50 text-orange-600 hover:bg-orange-100'
    }
  ]

  const projectMaterials = [
    {
      icon: CodeBracketIcon,
      title: 'Cursor Prompts',
      description: 'AI-optimized development prompts',
      folder: '01_CURSOR_PROMPTS',
      available: true
    },
    {
      icon: DocumentTextIcon,
      title: 'Project Proposals',
      description: 'Client-ready proposals and plans',
      folder: '02_PROJECT_PROPOSALS',
      available: true
    },
    {
      icon: PhotoIcon,
      title: 'Unsplash Images',
      description: 'Professional image collections',
      folder: '04_UNSPLASH_IMAGES',
      available: true
    },
    {
      icon: CogIcon,
      title: 'Tech Specifications',
      description: 'Technical requirements and specs',
      folder: '05_TECH_SPECIFICATIONS',
      available: true
    },
    {
      icon: RocketLaunchIcon,
      title: 'Prototypes',
      description: 'Website prototypes and demos',
      folder: '06_PROTOTYPES',
      available: true
    }
  ]

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Quick Actions
        </h3>
        
        <div className="space-y-3">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={() => action.href && window.open(action.href, '_blank')}
              disabled={action.disabled}
              className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                action.disabled 
                  ? 'bg-gray-50 text-gray-400 cursor-not-allowed' 
                  : `${action.color} cursor-pointer`
              }`}
            >
              <action.icon className="h-5 w-5" />
              <span className="font-medium">{action.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Project Materials */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Project Materials
        </h3>
        
        <div className="space-y-4">
          {projectMaterials.map((material, index) => (
            <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
              <div className="p-2 rounded-lg bg-primary-50">
                <material.icon className="h-5 w-5 text-primary-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-gray-900">
                    {material.title}
                  </h4>
                  {material.available && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-success-100 text-success-800">
                      Available
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {material.description}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Folder: {material.folder}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lead Status */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Lead Status
        </h3>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Current Status</span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success-100 text-success-800">
              {lead.status}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Contact Available</span>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              lead.email || lead.phone 
                ? 'bg-success-100 text-success-800' 
                : 'bg-warning-100 text-warning-800'
            }`}>
              {lead.email || lead.phone ? 'Yes' : 'Limited'}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Project Ready</span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success-100 text-success-800">
              100%
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
