import React from 'react'
import ScraperResults from '@/components/ScraperResults'
import { 
  RocketLaunchIcon,
  ChartBarIcon,
  CogIcon
} from '@heroicons/react/24/outline'

export default function ScrapersPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <RocketLaunchIcon className="h-8 w-8 text-blue-600 mr-3" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Lead Scraper Management
                  </h1>
                  <p className="text-sm text-gray-600">
                    Zentrale Steuerung und Überwachung aller Lead-Scraper
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center text-sm text-gray-600">
                  <div className="w-3 h-3 bg-green-400 rounded-full mr-2"></div>
                  System Online
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Actions */}
        <div className="mb-8">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Schnellaktionen
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button className="flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                <RocketLaunchIcon className="h-5 w-5 mr-2" />
                Alle Scraper starten
              </button>
              
              <button className="flex items-center justify-center px-4 py-3 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                <ChartBarIcon className="h-5 w-5 mr-2" />
                Live-Monitoring
              </button>
              
              <button className="flex items-center justify-center px-4 py-3 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                <CogIcon className="h-5 w-5 mr-2" />
                Konfiguration
              </button>
            </div>
          </div>
        </div>

        {/* Scraper Results */}
        <ScraperResults />

        {/* Help Section */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-blue-900 mb-2">
            💡 Scraper-Bedienung
          </h3>
          <div className="text-sm text-blue-800 space-y-2">
            <p>
              <strong>Sidebar öffnen:</strong> Klicken Sie auf den blauen Button links oben, um das Scraper Control Panel zu öffnen.
            </p>
            <p>
              <strong>Alle Scraper starten:</strong> Verwenden Sie "A" im Control Panel oder den grünen Button oben.
            </p>
            <p>
              <strong>Einzelne Scraper:</strong> Wählen Sie "S" im Control Panel und dann den gewünschten Scraper.
            </p>
            <p>
              <strong>Ergebnisse anzeigen:</strong> Diese Seite zeigt automatisch alle Scraper-Ergebnisse an.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
