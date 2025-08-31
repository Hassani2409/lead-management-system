import { NextRequest, NextResponse } from 'next/server'
import { getLeads, searchLeads, getLeadsByBusinessType, getLeadsByStatus, createLead, updateLead, deleteLead, deleteMultipleLeads, bulkUpdateLeads } from '@/lib/leadService'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const search = searchParams.get('search')
  const businessType = searchParams.get('business_type')
  const status = searchParams.get('status')

  try {
    let leads = getLeads()

    // Apply filters
    if (search) {
      leads = searchLeads(search)
    } else if (businessType) {
      leads = getLeadsByBusinessType(businessType)
    } else if (status) {
      leads = getLeadsByStatus(status)
    }

    return NextResponse.json({
      success: true,
      data: leads,
      total: leads.length
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch leads' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, business_type, status, email, phone, website, location, notes } = body

    if (!name || !business_type) {
      return NextResponse.json(
        { success: false, error: 'Name and business type are required' },
        { status: 400 }
      )
    }

    const newLead = createLead({
      name,
      business_type,
      status: status || 'new',
      email: email || '',
      phone: phone || '',
      website: website || '',
      location: location || '',
      notes: notes || ''
    })

    return NextResponse.json({
      success: true,
      data: newLead
    }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to create lead' },
      { status: 500 }
    )
  }
}
