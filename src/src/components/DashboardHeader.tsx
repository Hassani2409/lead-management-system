import Link from 'next/link'
import { BuildingOfficeIcon, ChartBarIcon, UserGroupIcon, RocketLaunchIcon } from '@heroicons/react/24/outline'

export default function DashboardHeader() {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <div className="flex items-center">
            <BuildingOfficeIcon className="h-8 w-8 text-primary-600" />
            <div className="ml-3">
              <h1 className="text-2xl font-bold text-gray-900">
                Lead Management System
              </h1>
              <p className="text-sm text-gray-600">
                742 Organized Leads • 100% Success Rate • Scraper Control Active
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              href="/scrapers"
              className="flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
            >
              <RocketLaunchIcon className="h-4 w-4 mr-2" />
              Scraper Control
            </Link>

            <div className="flex items-center text-sm text-gray-600">
              <ChartBarIcon className="h-5 w-5 mr-2" />
              <span>System Status: </span>
              <span className="text-success-600 font-semibold ml-1">Active</span>
            </div>

            <div className="flex items-center text-sm text-gray-600">
              <UserGroupIcon className="h-5 w-5 mr-2" />
              <span>CRM Integration: </span>
              <span className="text-success-600 font-semibold ml-1">Connected</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
