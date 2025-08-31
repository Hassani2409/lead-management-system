'use client'

import React, { useState, useEffect } from 'react'
import { LeadScoringEngine } from '@/utils/leadScoring'
import {
  DocumentTextIcon,
  ChartBarIcon,
  ClockIcon,
  FolderIcon,
  EyeIcon,
  ArrowDownTrayIcon,
  StarIcon,
  FireIcon
} from '@heroicons/react/24/outline'

interface ScraperResult {
  name: string
  path: string
  size: number
  leads: number
  modified: string
  scraper: string
}

interface ScraperStats {
  files: number
  leads: number
  lastRun: string | null
}

interface ResultsData {
  totalFiles: number
  totalLeads: number
  recentFiles: ScraperResult[]
  scraperStats: Record<string, ScraperStats>
}

export default function ScraperResults() {
  const [results, setResults] = useState<ResultsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedFile, setSelectedFile] = useState<any>(null)
  const [fileContent, setFileContent] = useState<any>(null)

  useEffect(() => {
    fetchResults()
    
    // Auto-refresh alle 30 Sekunden
    const interval = setInterval(fetchResults, 30000)
    return () => clearInterval(interval)
  }, [])

  const fetchResults = async () => {
    try {
      const response = await fetch('/api/scrapers/results')
      if (response.ok) {
        const data = await response.json()
        setResults(data)
      }
    } catch (error) {
      console.error('Error fetching results:', error)
    } finally {
      setLoading(false)
    }
  }

  const viewFileContent = async (filePath: string) => {
    try {
      setLoading(true)
      const response = await fetch('/api/scrapers/results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filePath })
      })
      
      if (response.ok) {
        const data = await response.json()
        setFileContent(data)
        setSelectedFile(filePath)
      }
    } catch (error) {
      console.error('Error fetching file content:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('de-DE')
  }

  if (loading && !results) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!results) {
    return (
      <div className="text-center py-12">
        <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Keine Ergebnisse</h3>
        <p className="mt-1 text-sm text-gray-500">
          Starten Sie einen Scraper, um Ergebnisse zu sehen.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DocumentTextIcon className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Gesamt Dateien
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {results.totalFiles}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ChartBarIcon className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Gesamt Leads
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {results.totalLeads.toLocaleString()}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ClockIcon className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Aktive Scraper
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {Object.values(results.scraperStats).filter(s => s.lastRun).length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scraper Stats */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Scraper-Statistiken
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(results.scraperStats).map(([name, stats]) => (
              <div key={name} className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 text-sm">{name}</h4>
                <div className="mt-2 space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Dateien:</span>
                    <span className="font-medium">{stats.files}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Leads:</span>
                    <span className="font-medium">{stats.leads.toLocaleString()}</span>
                  </div>
                  {stats.lastRun && (
                    <div className="text-xs text-gray-500 mt-1">
                      Letzter Lauf: {formatDate(stats.lastRun)}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Files */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Neueste Ergebnisse
          </h3>
          <div className="overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Datei
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Scraper
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Leads
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Größe
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Erstellt
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aktionen
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {results.recentFiles.map((file, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FolderIcon className="h-5 w-5 text-gray-400 mr-2" />
                        <div className="text-sm font-medium text-gray-900">
                          {file.name}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {file.scraper}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {file.leads.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatFileSize(file.size)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(file.modified)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => viewFileContent(file.path + '/' + file.name)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-900">
                        <ArrowDownTrayIcon className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* File Content Modal */}
      {fileContent && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {fileContent.fileName}
                </h3>
                <button
                  onClick={() => setFileContent(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <span className="sr-only">Schließen</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="mb-4 text-sm text-gray-600">
                <p>Leads: {fileContent.leadCount} | Größe: {formatFileSize(fileContent.size)} | 
                   Geändert: {formatDate(fileContent.modified)}</p>
              </div>

              <div className="max-h-96 overflow-y-auto bg-gray-50 p-4 rounded">
                {fileContent.preview ? (
                  <div className="space-y-2">
                    {fileContent.preview.map((lead: any, index: number) => (
                      <div key={index} className="bg-white p-3 rounded border">
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          {Object.entries(lead).slice(0, 6).map(([key, value]) => (
                            <div key={key}>
                              <span className="font-medium text-gray-600">{key}:</span>
                              <span className="ml-1 text-gray-900">{String(value)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <pre className="text-xs text-gray-800 whitespace-pre-wrap">
                    {typeof fileContent.content === 'string' 
                      ? fileContent.content 
                      : JSON.stringify(fileContent.content, null, 2)
                    }
                  </pre>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
