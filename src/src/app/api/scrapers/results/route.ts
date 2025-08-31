import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

export async function GET() {
  try {
    // SIMULATION MODE - für UI-Testing
    const results = {
      totalFiles: 15,
      totalLeads: 742,
      recentFiles: [
        {
          name: 'working_lead_scraper_20250828_151822.json',
          path: '/live_scraper_results',
          size: 125000,
          leads: 70,
          modified: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 min ago
          scraper: 'Working Lead Scraper'
        },
        {
          name: 'playwright_results_20250828_143015.json',
          path: '/scraper_results',
          size: 89000,
          leads: 45,
          modified: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
          scraper: 'Playwright Scraper'
        },
        {
          name: 'crawl4ai_analysis_20250828_140230.json',
          path: '/ai_analysis',
          size: 156000,
          leads: 82,
          modified: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), // 3 hours ago
          scraper: 'Crawl4AI Analyzer'
        },
        {
          name: 'gmaps_restaurants_berlin.csv',
          path: '/google-maps-scraper',
          size: 67000,
          leads: 38,
          modified: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(), // 4 hours ago
          scraper: 'Google Maps Scraper'
        },
        {
          name: 'ki_automation_leads_bakery.csv',
          path: '/ki_automation_leads',
          size: 94000,
          leads: 52,
          modified: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
          scraper: 'KI Automation'
        }
      ],
      scraperStats: {
        'Working Lead Scraper': {
          files: 4,
          leads: 285,
          lastRun: new Date(Date.now() - 1000 * 60 * 30).toISOString()
        },
        'Playwright Scraper': {
          files: 3,
          leads: 156,
          lastRun: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString()
        },
        'Crawl4AI Analyzer': {
          files: 2,
          leads: 124,
          lastRun: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString()
        },
        'Google Maps Scraper': {
          files: 3,
          leads: 98,
          lastRun: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString()
        },
        'KI Automation': {
          files: 3,
          leads: 79,
          lastRun: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString()
        }
      }
    }

    return NextResponse.json(results)

  } catch (error) {
    console.error('Error fetching scraper results:', error)
    return NextResponse.json(
      { error: 'Failed to fetch scraper results' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { filePath } = await request.json()

    if (!filePath) {
      return NextResponse.json(
        { error: 'File path is required' },
        { status: 400 }
      )
    }

    // SIMULATION MODE - simuliere File-Content
    const fileName = filePath.split('/').pop() || 'unknown.json'

    const sampleLeads = [
      {
        name: "Bäckerei Schmidt",
        address: "Hauptstraße 123, 10115 Berlin",
        phone: "+49 30 12345678",
        email: "info@baeckerei-schmidt.de",
        website: "https://baeckerei-schmidt.de",
        business_type: "bakery"
      },
      {
        name: "Restaurant Zur Linde",
        address: "Lindenstraße 45, 80331 München",
        phone: "+49 89 87654321",
        email: "kontakt@zur-linde.de",
        website: "https://restaurant-zur-linde.de",
        business_type: "restaurant"
      },
      {
        name: "Café Central",
        address: "Marktplatz 7, 20095 Hamburg",
        phone: "+49 40 11223344",
        email: "hello@cafe-central.de",
        website: "https://cafe-central.de",
        business_type: "cafe"
      }
    ]

    return NextResponse.json({
      fileName,
      filePath,
      size: 15420,
      modified: new Date().toISOString(),
      leadCount: sampleLeads.length,
      content: sampleLeads,
      preview: sampleLeads
    })

  } catch (error) {
    console.error('Error reading file:', error)
    return NextResponse.json(
      { error: 'Failed to read file' },
      { status: 500 }
    )
  }
}
