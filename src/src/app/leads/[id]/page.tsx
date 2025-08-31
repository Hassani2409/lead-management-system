'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getLeadById } from '@/lib/leadService'
import LeadHeader from '@/components/LeadHeader'
import LeadInfo from '@/components/LeadInfo'
import LeadActions from '@/components/LeadActions'
import LeadFiles from '@/components/LeadFiles'

interface LeadPageProps {
  params: {
    id: string
  }
}

export default function LeadPage({ params }: LeadPageProps) {
  const [lead, setLead] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const loadLead = () => {
      const foundLead = getLeadById(params.id)
      if (!foundLead) {
        router.push('/')
        return
      }
      setLead(foundLead)
      setIsLoading(false)
    }

    loadLead()
  }, [params.id, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!lead) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Lead nicht gefunden</h1>
          <button
            onClick={() => router.push('/')}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Zurück zum Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <LeadHeader lead={lead} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Lead Info */}
          <div className="lg:col-span-2 space-y-8">
            <LeadInfo lead={lead} />
            <LeadFiles lead={lead} />
          </div>

          {/* Actions Sidebar */}
          <div className="lg:col-span-1">
            <LeadActions lead={lead} />
          </div>
        </div>
      </main>
    </div>
  )
}
