'use client'

import { useState, useEffect } from 'react'
import { crmService } from '@/services/crmService'
import {
  ChartBarIcon,
  UserGroupIcon,
  FireIcon,
  ArrowTrendingUpIcon,
  ClockIcon,
  CheckCircleIcon,
  CurrencyDollarIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from '@heroicons/react/24/outline'

interface DashboardMetrics {
  totalLeads: number
  hotLeads: number
  conversionRate: number
  pipelineValue: number
  activitiesCompleted: number
  averageScore: number
  monthlyGrowth: number
  topSources: Array<{ source: string; count: number }>
}

interface ConversionFunnelData {
  stage: string
  count: number
  conversionRate: number
}

export default function CRMDashboard() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null)
  const [funnelData, setFunnelData] = useState<ConversionFunnelData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      const [metricsData, funnelData] = await Promise.all([
        crmService.getDashboardMetrics(),
        crmService.getLeadConversionFunnel()
      ])
      setMetrics(metricsData)
      setFunnelData(funnelData)
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!metrics) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Unable to load dashboard</h2>
          <button 
            onClick={loadDashboardData}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR'
    }).format(value)
  }

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">CRM Dashboard</h1>
                <p className="text-gray-600 mt-1">Comprehensive overview of your sales pipeline</p>
              </div>
              <div className="flex items-center space-x-3">
                <button 
                  onClick={loadDashboardData}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Refresh
                </button>
                <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
                  Export Report
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Leads */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <UserGroupIcon className="w-8 h-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Leads</p>
                <p className="text-2xl font-bold text-gray-900">{metrics.totalLeads.toLocaleString()}</p>
              </div>
            </div>
            <div className="mt-4 flex items-center">
              {metrics.monthlyGrowth >= 0 ? (
                <ArrowUpIcon className="w-4 h-4 text-green-500" />
              ) : (
                <ArrowDownIcon className="w-4 h-4 text-red-500" />
              )}
              <span className={`text-sm ml-1 ${
                metrics.monthlyGrowth >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {formatPercentage(Math.abs(metrics.monthlyGrowth))} this month
              </span>
            </div>
          </div>

          {/* Hot Leads */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <FireIcon className="w-8 h-8 text-red-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Hot Leads</p>
                <p className="text-2xl font-bold text-gray-900">{metrics.hotLeads}</p>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-4">Ready for immediate contact</p>
          </div>

          {/* Conversion Rate */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <ArrowTrendingUpIcon className="w-8 h-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                <p className="text-2xl font-bold text-gray-900">{formatPercentage(metrics.conversionRate)}</p>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-4">Lead to customer conversion</p>
          </div>

          {/* Pipeline Value */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <CurrencyDollarIcon className="w-8 h-8 text-purple-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pipeline Value</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(metrics.pipelineValue)}</p>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-4">Total potential revenue</p>
          </div>
        </div>

        {/* Secondary Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <CheckCircleIcon className="w-6 h-6 text-green-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Activities Completed</p>
                <p className="text-xl font-bold text-gray-900">{metrics.activitiesCompleted}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <ChartBarIcon className="w-6 h-6 text-blue-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Average Score</p>
                <p className="text-xl font-bold text-gray-900">{metrics.averageScore.toFixed(1)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <ClockIcon className="w-6 h-6 text-orange-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Monthly Growth</p>
                <p className="text-xl font-bold text-gray-900">{formatPercentage(metrics.monthlyGrowth)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts and Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Conversion Funnel */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Conversion Funnel</h3>
            <div className="space-y-4">
              {funnelData.map((stage, index) => (
                <div key={stage.stage} className="relative">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">{stage.stage}</span>
                    <div className="text-right">
                      <span className="text-sm font-bold text-gray-900">{stage.count}</span>
                      <span className="text-xs text-gray-500 ml-2">
                        ({formatPercentage(stage.conversionRate)})
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${stage.conversionRate}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Lead Sources */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Lead Sources</h3>
            <div className="space-y-4">
              {metrics.topSources.map((source, index) => (
                <div key={source.source} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-3 ${
                      index === 0 ? 'bg-blue-500' :
                      index === 1 ? 'bg-green-500' :
                      index === 2 ? 'bg-yellow-500' :
                      index === 3 ? 'bg-purple-500' :
                      'bg-gray-400'
                    }`}></div>
                    <span className="text-sm font-medium text-gray-700 capitalize">
                      {source.source.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-gray-900">{source.count}</span>
                    <span className="text-xs text-gray-500 ml-2">
                      ({formatPercentage((source.count / metrics.totalLeads) * 100)})
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
              <FireIcon className="w-6 h-6 text-red-500 mb-2" />
              <div className="text-sm font-medium text-gray-900">View Hot Leads</div>
              <div className="text-xs text-gray-500">Contact immediately</div>
            </button>
            
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
              <UserGroupIcon className="w-6 h-6 text-blue-500 mb-2" />
              <div className="text-sm font-medium text-gray-900">Import Leads</div>
              <div className="text-xs text-gray-500">Add new prospects</div>
            </button>
            
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
              <ChartBarIcon className="w-6 h-6 text-green-500 mb-2" />
              <div className="text-sm font-medium text-gray-900">Create Campaign</div>
              <div className="text-xs text-gray-500">Launch outreach</div>
            </button>
            
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
              <CheckCircleIcon className="w-6 h-6 text-purple-500 mb-2" />
              <div className="text-sm font-medium text-gray-900">Generate Report</div>
              <div className="text-xs text-gray-500">Export analytics</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
