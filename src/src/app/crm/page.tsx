'use client'

import { useState } from 'react'
import CRMDashboard from '@/components/CRMDashboard'
import AdvancedLeadManagement from '@/components/AdvancedLeadManagement'
import DeepResearchCRM from '@/components/DeepResearchCRM'
import ProjectManagement from '@/components/ProjectManagement'
import {
  HomeIcon,
  UserGroupIcon,
  SparklesIcon,
  FolderIcon,
  ChartBarIcon,
  CogIcon,
  DocumentTextIcon,
  BellIcon
} from '@heroicons/react/24/outline'

type CRMView = 'dashboard' | 'leads' | 'deep-research' | 'projects' | 'campaigns' | 'reports' | 'settings'

export default function CRMPage() {
  const [activeView, setActiveView] = useState<CRMView>('dashboard')

  const navigationItems = [
    {
      id: 'dashboard' as CRMView,
      name: 'Dashboard',
      icon: HomeIcon,
      description: 'Overview & KPIs'
    },
    {
      id: 'leads' as CRMView,
      name: 'Lead Management',
      icon: UserGroupIcon,
      description: 'Manage all leads'
    },
    {
      id: 'deep-research' as CRMView,
      name: 'Deep Research',
      icon: SparklesIcon,
      description: 'AI-powered analysis'
    },
    {
      id: 'projects' as CRMView,
      name: 'Projects',
      icon: FolderIcon,
      description: 'Project management'
    },
    {
      id: 'campaigns' as CRMView,
      name: 'Campaigns',
      icon: DocumentTextIcon,
      description: 'Marketing campaigns'
    },
    {
      id: 'reports' as CRMView,
      name: 'Reports',
      icon: ChartBarIcon,
      description: 'Analytics & reports'
    },
    {
      id: 'settings' as CRMView,
      name: 'Settings',
      icon: CogIcon,
      description: 'System configuration'
    }
  ]

  const renderActiveView = () => {
    switch (activeView) {
      case 'dashboard':
        return <CRMDashboard />
      case 'leads':
        return <AdvancedLeadManagement />
      case 'deep-research':
        return <DeepResearchCRM />
      case 'projects':
        return <ProjectManagement />
      case 'campaigns':
        return <CampaignManagement />
      case 'reports':
        return <ReportsAndAnalytics />
      case 'settings':
        return <CRMSettings />
      default:
        return <CRMDashboard />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo & Title */}
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-gray-900">HubSpot-like CRM</h1>
              </div>
            </div>

            {/* Right Navigation */}
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <BellIcon className="w-5 h-5" />
              </button>
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-gray-700">U</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <nav className="space-y-2">
                {navigationItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveView(item.id)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      activeView === item.id
                        ? 'bg-primary-50 text-primary-700 border border-primary-200'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className={`w-5 h-5 ${
                        activeView === item.id ? 'text-primary-600' : 'text-gray-400'
                      }`} />
                      <div>
                        <div className="font-medium">{item.name}</div>
                        <div className="text-xs text-gray-500">{item.description}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </nav>

              {/* Quick Stats */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Quick Stats</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total Leads</span>
                    <span className="font-medium text-gray-900">402</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Hot Leads</span>
                    <span className="font-medium text-red-600">7</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Active Projects</span>
                    <span className="font-medium text-blue-600">12</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Conversion Rate</span>
                    <span className="font-medium text-green-600">23.5%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-4">
            {renderActiveView()}
          </div>
        </div>
      </div>
    </div>
  )
}

// Placeholder components for missing views
function CampaignManagement() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
      <DocumentTextIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">Campaign Management</h3>
      <p className="text-gray-600">Marketing campaign management coming soon...</p>
    </div>
  )
}

function ReportsAndAnalytics() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
      <ChartBarIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">Reports & Analytics</h3>
      <p className="text-gray-600">Advanced reporting and analytics coming soon...</p>
    </div>
  )
}

function CRMSettings() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
      <CogIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">CRM Settings</h3>
      <p className="text-gray-600">System configuration and settings coming soon...</p>
    </div>
  )
}
