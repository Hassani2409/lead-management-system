import { NextRequest, NextResponse } from 'next/server'
import { bulkUpdateLeads, deleteMultipleLeads } from '@/lib/leadService'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, ids, updates } = body

    if (!action || !ids || !Array.isArray(ids)) {
      return NextResponse.json(
        { success: false, error: 'Action and IDs array are required' },
        { status: 400 }
      )
    }

    let result: number

    switch (action) {
      case 'update':
        if (!updates) {
          return NextResponse.json(
            { success: false, error: 'Updates object is required for update action' },
            { status: 400 }
          )
        }
        result = bulkUpdateLeads(ids, updates)
        return NextResponse.json({
          success: true,
          message: `Updated ${result} leads`,
          updatedCount: result
        })

      case 'delete':
        result = deleteMultipleLeads(ids)
        return NextResponse.json({
          success: true,
          message: `Deleted ${result} leads`,
          deletedCount: result
        })

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action. Use "update" or "delete"' },
          { status: 400 }
        )
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to perform bulk operation' },
      { status: 500 }
    )
  }
}
