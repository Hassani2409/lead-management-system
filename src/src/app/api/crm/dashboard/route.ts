import { NextRequest, NextResponse } from 'next/server'
import { getLeads } from '@/lib/leadService'

export async function GET(request: NextRequest) {
  try {
    const leads = getLeads()
    
    // Calculate dashboard metrics
    const totalLeads = leads.length
    const hotLeads = leads.filter(lead => (lead.calculated_score ?? 0) >= 80).length
    const warmLeads = leads.filter(lead => (lead.calculated_score ?? 0) >= 60 && (lead.calculated_score ?? 0) < 80).length
    const coldLeads = leads.filter(lead => (lead.calculated_score ?? 0) >= 40 && (lead.calculated_score ?? 0) < 60).length
    
    // Calculate conversion rate (mock data)
    const convertedLeads = leads.filter(lead => lead.status === 'converted').length
    const conversionRate = totalLeads > 0 ? (convertedLeads / totalLeads) * 100 : 0
    
    // Calculate pipeline value (mock data)
    const pipelineValue = leads.reduce((sum, lead) => {
      const estimatedValue = lead.revenue_estimate || 5000 // Default estimate
      return sum + estimatedValue
    }, 0)
    
    // Calculate average score
    const averageScore = leads.length > 0 
      ? leads.reduce((sum, lead) => sum + (lead.calculated_score || 0), 0) / leads.length 
      : 0
    
    // Mock activities completed
    const activitiesCompleted = Math.floor(Math.random() * 100) + 50
    
    // Mock monthly growth
    const monthlyGrowth = Math.random() * 20 - 5 // -5% to +15%
    
    // Top lead sources
    const sourceCount: Record<string, number> = {}
    leads.forEach(lead => {
      const source = lead.source || 'unknown'
      sourceCount[source] = (sourceCount[source] || 0) + 1
    })
    
    const topSources = Object.entries(sourceCount)
      .map(([source, count]) => ({ source, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)

    const dashboardMetrics = {
      totalLeads,
      hotLeads,
      conversionRate,
      pipelineValue,
      activitiesCompleted,
      averageScore,
      monthlyGrowth,
      topSources
    }

    return NextResponse.json(dashboardMetrics)
  } catch (error) {
    console.error('Error fetching dashboard metrics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard metrics' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Handle dashboard updates or custom metrics
    const body = await request.json()
    
    // Mock implementation - in real app, save custom dashboard config
    return NextResponse.json({ success: true, message: 'Dashboard updated' })
  } catch (error) {
    console.error('Error updating dashboard:', error)
    return NextResponse.json(
      { error: 'Failed to update dashboard' },
      { status: 500 }
    )
  }
}
