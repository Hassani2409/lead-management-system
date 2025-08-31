import { NextRequest, NextResponse } from 'next/server'

// Scraper-Konfiguration
const SCRAPERS = {
  'Working Lead Scraper': {
    script: 'working_lead_scraper.py',
    type: 'python'
  },
  'Playwright Scraper': {
    script: 'robust_playwright_scraper.py',
    type: 'python'
  },
  'Crawl4AI Analyzer': {
    script: 'crawl4ai_lead_analyzer.py',
    type: 'python'
  },
  'Google Maps Scraper': {
    script: 'google-maps-scraper/main.go',
    type: 'go'
  },
  'KI Automation': {
    script: 'ki_automation_analyzer.py',
    type: 'python'
  }
}

// Aktive Scraper-Prozesse verfolgen (Simulation)
// Reset bei Server-Neustart
const activeProcesses = new Map<string, any>()

// Cleanup-Funktion für abgelaufene Prozesse
function cleanupExpiredProcesses() {
  const now = Date.now()
  Array.from(activeProcesses.entries()).forEach(([name, process]) => {
    // Entferne Prozesse, die älter als 5 Minuten sind
    if (now - process.startTime.getTime() > 5 * 60 * 1000) {
      activeProcesses.delete(name)
    }
  })
}

export async function POST(request: NextRequest) {
  try {
    const { scraper } = await request.json()

    if (!scraper || !SCRAPERS[scraper as keyof typeof SCRAPERS]) {
      return NextResponse.json(
        { error: 'Invalid scraper name' },
        { status: 400 }
      )
    }

    // Cleanup abgelaufene Prozesse
    cleanupExpiredProcesses()

    // Prüfe ob Scraper bereits läuft (und noch nicht abgelaufen)
    const existingProcess = activeProcesses.get(scraper)
    if (existingProcess && existingProcess.status === 'running') {
      // Prüfe ob Prozess wirklich noch läuft (nicht älter als 2 Minuten)
      const processAge = Date.now() - existingProcess.startTime.getTime()
      if (processAge < 2 * 60 * 1000) {
        return NextResponse.json(
          { error: 'Scraper is already running' },
          { status: 409 }
        )
      } else {
        // Alter Prozess ist abgelaufen, entferne ihn
        activeProcesses.delete(scraper)
      }
    }

    // SIMULATION MODE - für UI-Testing
    const simulatedProcess = {
      pid: Math.floor(Math.random() * 10000) + 1000,
      startTime: new Date(),
      output: `Starting ${scraper}...\n`,
      error: '',
      status: 'running'
    }

    activeProcesses.set(scraper, simulatedProcess)

    // Simuliere Scraper-Completion nach 10-30 Sekunden
    const completionTime = Math.floor(Math.random() * 20000) + 10000
    setTimeout(() => {
      const processInfo = activeProcesses.get(scraper)
      if (processInfo) {
        processInfo.status = 'completed'
        processInfo.output += `\nScraper completed successfully!\nFound ${Math.floor(Math.random() * 50) + 10} new leads.`
        processInfo.endTime = new Date()
      }
    }, completionTime)

    // Entferne aus aktiven Prozessen nach 5 Minuten
    setTimeout(() => {
      activeProcesses.delete(scraper)
    }, 5 * 60 * 1000)

    return NextResponse.json({
      success: true,
      message: `${scraper} started successfully (simulation mode)`,
      pid: simulatedProcess.pid,
      startTime: simulatedProcess.startTime.toISOString(),
      mode: 'simulation'
    })

  } catch (error) {
    console.error('Error starting scraper:', error)
    return NextResponse.json(
      { error: 'Failed to start scraper' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  // Cleanup abgelaufene Prozesse
  cleanupExpiredProcesses()

  // Check für Reset-Parameter
  const { searchParams } = new URL(request.url)
  if (searchParams.get('reset') === 'true') {
    activeProcesses.clear()
    return NextResponse.json({
      message: 'All scraper processes reset',
      activeScrapers: []
    })
  }

  // Gebe Status aller aktiven Scraper zurück
  const status = Array.from(activeProcesses.entries()).map(([name, info]) => ({
    name,
    pid: info.pid,
    startTime: info.startTime,
    isRunning: info.status === 'running',
    output: info.output.slice(-1000), // Letzte 1000 Zeichen
    error: info.error.slice(-1000),
    status: info.status
  }))

  return NextResponse.json({ activeScrapers: status })
}

export async function DELETE(request: NextRequest) {
  try {
    const { scraper } = await request.json()

    if (!activeProcesses.has(scraper)) {
      return NextResponse.json(
        { error: 'Scraper is not running' },
        { status: 404 }
      )
    }

    // SIMULATION MODE - stoppe simulierten Scraper
    const processInfo = activeProcesses.get(scraper)
    if (processInfo) {
      processInfo.status = 'stopped'
      processInfo.output += '\nScraper stopped by user.'
    }

    activeProcesses.delete(scraper)

    return NextResponse.json({
      success: true,
      message: `${scraper} stopped successfully (simulation mode)`
    })

  } catch (error) {
    console.error('Error stopping scraper:', error)
    return NextResponse.json(
      { error: 'Failed to stop scraper' },
      { status: 500 }
    )
  }
}