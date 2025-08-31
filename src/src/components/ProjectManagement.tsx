'use client'

import { useState, useEffect } from 'react'
import { Project, Activity, Lead } from '@/types/crm'
import { crmService } from '@/services/crmService'
import {
  PlusIcon,
  FolderIcon,
  UserGroupIcon,
  CalendarIcon,
  ChartBarIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/react/24/outline'

interface ProjectWithStats extends Project {
  completionRate: number
  activeActivities: number
  overdueTasks: number
}

export default function ProjectManagement() {
  const [projects, setProjects] = useState<ProjectWithStats[]>([])
  const [activities, setActivities] = useState<Activity[]>([])
  const [selectedProject, setSelectedProject] = useState<ProjectWithStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'activities' | 'leads' | 'analytics'>('overview')

  useEffect(() => {
    loadProjects()
    loadActivities()
  }, [])

  const loadProjects = async () => {
    try {
      setLoading(true)
      const projectsData = await crmService.getProjects()
      
      // Add stats to projects
      const projectsWithStats: ProjectWithStats[] = projectsData.map(project => ({
        ...project,
        completionRate: calculateCompletionRate(project),
        activeActivities: project.activities.length,
        overdueTasks: calculateOverdueTasks(project)
      }))
      
      setProjects(projectsWithStats)
    } catch (error) {
      console.error('Error loading projects:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadActivities = async () => {
    try {
      const activitiesData = await crmService.getActivities()
      setActivities(activitiesData)
    } catch (error) {
      console.error('Error loading activities:', error)
    }
  }

  const calculateCompletionRate = (project: Project): number => {
    if (project.activities.length === 0) return 0
    const completedActivities = project.activities.filter(activityId => {
      const activity = activities.find(a => a.id === activityId)
      return activity?.status === 'completed'
    }).length
    return Math.round((completedActivities / project.activities.length) * 100)
  }

  const calculateOverdueTasks = (project: Project): number => {
    const now = new Date()
    return project.activities.filter(activityId => {
      const activity = activities.find(a => a.id === activityId)
      if (!activity || activity.status === 'completed') return false
      if (!activity.dueDate) return false
      return new Date(activity.dueDate) < now
    }).length
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planning': return 'bg-yellow-100 text-yellow-800'
      case 'active': return 'bg-green-100 text-green-800'
      case 'on_hold': return 'bg-orange-100 text-orange-800'
      case 'completed': return 'bg-blue-100 text-blue-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'campaign': return '📢'
      case 'outreach': return '📧'
      case 'nurturing': return '🌱'
      case 'event': return '🎉'
      case 'product_launch': return '🚀'
      default: return '📁'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Project Management</h1>
                <p className="text-gray-600 mt-1">{projects.length} active projects</p>
              </div>
              <div className="flex items-center space-x-3">
                <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                  Templates
                </button>
                <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center gap-2">
                  <PlusIcon className="w-4 h-4" />
                  New Project
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Projects List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Projects</h3>
              </div>
              <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
                {projects.map((project) => (
                  <button
                    key={project.id}
                    onClick={() => setSelectedProject(project)}
                    className={`w-full text-left p-4 hover:bg-gray-50 transition-colors ${
                      selectedProject?.id === project.id ? 'bg-blue-50 border-r-2 border-blue-500' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{getTypeIcon(project.type)}</span>
                        <span className="font-medium text-gray-900">{project.name}</span>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                        {project.status}
                      </span>
                    </div>
                    
                    <div className="space-y-2">
                      {/* Progress Bar */}
                      <div>
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                          <span>Progress</span>
                          <span>{project.completionRate}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${project.completionRate}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      {/* Stats */}
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{project.leads.length} leads</span>
                        <span>{project.activeActivities} activities</span>
                        {project.overdueTasks > 0 && (
                          <span className="text-red-600 font-medium">
                            {project.overdueTasks} overdue
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Project Details */}
          <div className="lg:col-span-2">
            {selectedProject ? (
              <div className="space-y-6">
                {/* Project Header */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{getTypeIcon(selectedProject.type)}</span>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">{selectedProject.name}</h2>
                        <p className="text-gray-600">{selectedProject.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-gray-400 hover:text-gray-600">
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-red-600">
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Project Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{selectedProject.completionRate}%</div>
                      <div className="text-xs text-gray-600">Completion</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{selectedProject.leads.length}</div>
                      <div className="text-xs text-gray-600">Leads</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">{selectedProject.activeActivities}</div>
                      <div className="text-xs text-gray-600">Activities</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className={`text-2xl font-bold ${selectedProject.overdueTasks > 0 ? 'text-red-600' : 'text-gray-600'}`}>
                        {selectedProject.overdueTasks}
                      </div>
                      <div className="text-xs text-gray-600">Overdue</div>
                    </div>
                  </div>
                </div>

                {/* Tabs */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                  <div className="border-b border-gray-200">
                    <nav className="flex space-x-8 px-6">
                      {[
                        { id: 'overview', name: 'Overview', icon: FolderIcon },
                        { id: 'activities', name: 'Activities', icon: CheckCircleIcon },
                        { id: 'leads', name: 'Leads', icon: UserGroupIcon },
                        { id: 'analytics', name: 'Analytics', icon: ChartBarIcon }
                      ].map((tab) => (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id as any)}
                          className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                            activeTab === tab.id
                              ? 'border-blue-500 text-blue-600'
                              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                          }`}
                        >
                          <tab.icon className="w-4 h-4" />
                          {tab.name}
                        </button>
                      ))}
                    </nav>
                  </div>

                  <div className="p-6">
                    {activeTab === 'overview' && (
                      <div className="space-y-6">
                        {/* Timeline */}
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900 mb-3">Timeline</h4>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <CalendarIcon className="w-4 h-4" />
                              <span>Start: {new Date(selectedProject.startDate).toLocaleDateString()}</span>
                            </div>
                            {selectedProject.endDate && (
                              <div className="flex items-center gap-2">
                                <CalendarIcon className="w-4 h-4" />
                                <span>End: {new Date(selectedProject.endDate).toLocaleDateString()}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Team */}
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900 mb-3">Team</h4>
                          <div className="flex items-center space-x-2">
                            {selectedProject.assignedTeam.slice(0, 5).map((memberId, index) => (
                              <div key={memberId} className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                                <span className="text-xs font-medium text-gray-700">
                                  {String.fromCharCode(65 + index)}
                                </span>
                              </div>
                            ))}
                            {selectedProject.assignedTeam.length > 5 && (
                              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                                <span className="text-xs text-gray-600">+{selectedProject.assignedTeam.length - 5}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* KPIs */}
                        {selectedProject.kpis.length > 0 && (
                          <div>
                            <h4 className="text-lg font-semibold text-gray-900 mb-3">Key Performance Indicators</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {selectedProject.kpis.map((kpi, index) => (
                                <div key={index} className="p-4 border border-gray-200 rounded-lg">
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="font-medium text-gray-900">{kpi.name}</span>
                                    <span className="text-sm text-gray-500">{kpi.unit}</span>
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <span className="text-2xl font-bold text-blue-600">{kpi.actual}</span>
                                    <span className="text-sm text-gray-500">/ {kpi.target}</span>
                                  </div>
                                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                                    <div 
                                      className="bg-blue-600 h-2 rounded-full"
                                      style={{ width: `${Math.min((kpi.actual / kpi.target) * 100, 100)}%` }}
                                    ></div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {activeTab === 'activities' && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="text-lg font-semibold text-gray-900">Project Activities</h4>
                          <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
                            Add Activity
                          </button>
                        </div>
                        
                        <div className="space-y-3">
                          {activities
                            .filter(activity => selectedProject.activities.includes(activity.id))
                            .map((activity) => (
                              <div key={activity.id} className="p-4 border border-gray-200 rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="font-medium text-gray-900">{activity.title}</span>
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    activity.status === 'completed' ? 'bg-green-100 text-green-800' :
                                    activity.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                                    activity.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-red-100 text-red-800'
                                  }`}>
                                    {activity.status}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-600 mb-2">{activity.description}</p>
                                <div className="flex items-center justify-between text-xs text-gray-500">
                                  <span>Assigned to: {activity.assignedTo}</span>
                                  {activity.dueDate && (
                                    <span>Due: {new Date(activity.dueDate).toLocaleDateString()}</span>
                                  )}
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}

                    {activeTab === 'leads' && (
                      <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-gray-900">Project Leads</h4>
                        <div className="text-center py-8 text-gray-500">
                          <UserGroupIcon className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                          <p>Lead management integration coming soon...</p>
                        </div>
                      </div>
                    )}

                    {activeTab === 'analytics' && (
                      <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-gray-900">Project Analytics</h4>
                        <div className="text-center py-8 text-gray-500">
                          <ChartBarIcon className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                          <p>Advanced analytics coming soon...</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                <FolderIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Project</h3>
                <p className="text-gray-600">Choose a project from the sidebar to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
