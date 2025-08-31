import { NextResponse } from 'next/server'
import { getLeadStats } from '@/lib/leadService'

export async function GET() {
  try {
    const stats = getLeadStats()

    return NextResponse.json({
      success: true,
      data: stats
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
}
