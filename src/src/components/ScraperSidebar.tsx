'use client'

import React, { useState, useEffect } from 'react'
import { 
  ChevronLeftIcon, 
  ChevronRightIcon,
  PlayIcon,
  StopIcon,
  EyeIcon,
  CogIcon,
  DocumentTextIcon,
  ChartBarIcon,
  GlobeAltIcon,
  CpuChipIcon,
  MapIcon,
  RocketLaunchIcon
} from '@heroicons/react/24/outline'

interface ScraperStatus {
  name: string
  status: 'idle' | 'running' | 'completed' | 'error'
  lastRun?: string
  results?: number
  description: string
  icon: React.ComponentType<any>
}

interface ScraperSidebarProps {
  isOpen: boolean
  onToggle: () => void
}

export default function ScraperSidebar({ isOpen, onToggle }: ScraperSidebarProps) {
  const [scrapers, setScrapers] = useState<ScraperStatus[]>([
    {
      name: 'Working Lead Scraper',
      status: 'idle',
      description: 'Gelbe Seiten & Branchenbuch Scraper',
      icon: DocumentTextIcon,
      results: 0
    },
    {
      name: 'Playwright Scraper',
      status: 'idle',
      description: 'Browser-basierter Universal Scraper',
      icon: GlobeAltIcon,
      results: 0
    },
    {
      name: 'Crawl4AI Analyzer',
      status: 'idle',
      description: 'KI-Enhanced Lead Analyzer',
      icon: CpuChipIcon,
      results: 0
    },
    {
      name: 'Google Maps Scraper',
      status: 'idle',
      description: 'Google Maps Business Scraper',
      icon: MapIcon,
      results: 0
    },
    {
      name: 'KI Automation',
      status: 'idle',
      description: 'KI-basierte Automation',
      icon: RocketLaunchIcon,
      results: 0
    }
  ])

  const [isMonitoring, setIsMonitoring] = useState(false)
  const [totalResults, setTotalResults] = useState(742)

  // Simuliere Scraper-Status Updates
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isMonitoring) {
      interval = setInterval(() => {
        setScrapers(prev => prev.map(scraper => {
          if (scraper.status === 'running') {
            const shouldComplete = Math.random() > 0.8
            if (shouldComplete) {
              const newResults = Math.floor(Math.random() * 50) + 10
              return {
                ...scraper,
                status: 'completed',
                results: (scraper.results || 0) + newResults,
                lastRun: new Date().toLocaleTimeString('de-DE')
              }
            }
          }
          return scraper
        }))
      }, 3000)
    }

    return () => {
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [isMonitoring])

  const startScraper = async (scraperName: string) => {
    setScrapers(prev => prev.map(scraper =>
      scraper.name === scraperName
        ? { ...scraper, status: 'running' }
        : scraper
    ))

    // API-Call zum Backend
    try {
      const response = await fetch('/api/scrapers/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
        },
        body: JSON.stringify({ scraper: scraperName })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))

        // Wenn Scraper bereits läuft, reset und versuche erneut
        if (response.status === 409) {
          console.log('Scraper already running, resetting...')
          await fetch('/api/scrapers/start?reset=true')

          // Versuche erneut nach Reset
          const retryResponse = await fetch('/api/scrapers/start', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Cache-Control': 'no-cache'
            },
            body: JSON.stringify({ scraper: scraperName })
          })

          if (retryResponse.ok) {
            const result = await retryResponse.json()
            console.log('Scraper started successfully after reset:', result)
            return
          }
        }

        throw new Error(`Failed to start scraper: ${response.status} ${errorData.error || 'Unknown error'}`)
      }

      const result = await response.json()
      console.log('Scraper started successfully:', result)

    } catch (error) {
      console.error('Error starting scraper:', error)
      setScrapers(prev => prev.map(scraper =>
        scraper.name === scraperName
          ? { ...scraper, status: 'error' }
          : scraper
      ))
    }
  }

  const startAllScrapers = async () => {
    setIsMonitoring(true)

    // Reset alle Prozesse zuerst
    try {
      await fetch('/api/scrapers/start?reset=true')
      console.log('All processes reset before starting all scrapers')
    } catch (error) {
      console.warn('Failed to reset processes:', error)
    }

    // Starte alle Scraper nacheinander
    for (const scraper of scrapers) {
      if (scraper.status === 'idle') {
        await startScraper(scraper.name)
        // Kurze Pause zwischen Starts
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
    }
  }

  const stopAllScrapers = () => {
    setIsMonitoring(false)
    setScrapers(prev => prev.map(scraper => ({
      ...scraper,
      status: scraper.status === 'running' ? 'idle' : scraper.status
    })))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'text-blue-600 bg-blue-100'
      case 'completed': return 'text-green-600 bg-green-100'
      case 'error': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running': return <div className="animate-spin w-2 h-2 bg-blue-600 rounded-full" />
      case 'completed': return <div className="w-2 h-2 bg-green-600 rounded-full" />
      case 'error': return <div className="w-2 h-2 bg-red-600 rounded-full" />
      default: return <div className="w-2 h-2 bg-gray-400 rounded-full" />
    }
  }

  return (
    <>
      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-full bg-white shadow-lg border-r border-gray-200 transition-all duration-300 z-40 ${
        isOpen ? 'w-80' : 'w-0'
      } overflow-hidden`}>
        
        {/* Header */}
        <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="flex items-center justify-between">
            <div className="text-white">
              <h2 className="text-lg font-semibold">Lead Scraper Control</h2>
              <p className="text-blue-100 text-sm">Zentrale Scraper-Steuerung</p>
            </div>
            <button
              onClick={onToggle}
              className="text-white hover:bg-white/20 p-1 rounded"
            >
              <ChevronLeftIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="p-4 bg-gray-50 border-b border-gray-200">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white p-3 rounded-lg shadow-sm">
              <div className="text-2xl font-bold text-blue-600">{totalResults}</div>
              <div className="text-xs text-gray-600">Total Leads</div>
            </div>
            <div className="bg-white p-3 rounded-lg shadow-sm">
              <div className="text-2xl font-bold text-green-600">
                {scrapers.filter(s => s.status === 'running').length}
              </div>
              <div className="text-xs text-gray-600">Active Scrapers</div>
            </div>
          </div>
        </div>

        {/* Control Buttons */}
        <div className="p-4 border-b border-gray-200">
          <div className="space-y-2">
            <button
              onClick={startAllScrapers}
              disabled={isMonitoring}
              className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              <PlayIcon className="w-4 h-4" />
              Alle Scraper starten
            </button>
            
            <button
              onClick={stopAllScrapers}
              disabled={!isMonitoring}
              className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              <StopIcon className="w-4 h-4" />
              Alle Scraper stoppen
            </button>
          </div>
        </div>

        {/* Scraper List */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Verfügbare Scraper</h3>
            <div className="space-y-3">
              {scrapers.map((scraper, index) => {
                const IconComponent = scraper.icon
                return (
                  <div key={index} className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <IconComponent className="w-5 h-5 text-gray-600" />
                        <div>
                          <h4 className="font-medium text-gray-900 text-sm">{scraper.name}</h4>
                          <p className="text-xs text-gray-600">{scraper.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(scraper.status)}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(scraper.status)}`}>
                          {scraper.status === 'idle' && 'Bereit'}
                          {scraper.status === 'running' && 'Läuft...'}
                          {scraper.status === 'completed' && 'Abgeschlossen'}
                          {scraper.status === 'error' && 'Fehler'}
                        </span>
                        {scraper.results !== undefined && scraper.results > 0 && (
                          <span className="text-xs text-gray-600">
                            {scraper.results} Leads
                          </span>
                        )}
                      </div>
                      
                      <button
                        onClick={() => startScraper(scraper.name)}
                        disabled={scraper.status === 'running'}
                        className="text-blue-600 hover:text-blue-800 disabled:text-gray-400 p-1"
                      >
                        <PlayIcon className="w-4 h-4" />
                      </button>
                    </div>
                    
                    {scraper.lastRun && (
                      <div className="mt-2 text-xs text-gray-500">
                        Letzter Lauf: {scraper.lastRun}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between text-xs text-gray-600">
            <span>Scraper Control v1.0</span>
            <div className="flex items-center gap-1">
              <EyeIcon className="w-3 h-3" />
              <span>Live Monitoring</span>
            </div>
          </div>
        </div>
      </div>

      {/* Toggle Button (when sidebar is closed) */}
      {!isOpen && (
        <button
          onClick={onToggle}
          className="fixed left-4 top-4 z-50 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg shadow-lg transition-colors"
          title="Scraper Control öffnen"
        >
          <ChevronRightIcon className="w-5 h-5" />
        </button>
      )}

      {/* Overlay (when sidebar is open on mobile) */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={onToggle}
        />
      )}
    </>
  )
}
