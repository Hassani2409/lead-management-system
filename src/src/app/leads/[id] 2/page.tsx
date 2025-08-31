import { notFound } from 'next/navigation'
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
  const lead = getLeadById(params.id)

  if (!lead) {
    notFound()
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

export async function generateStaticParams() {
  // This would generate static paths for all leads
  return []
}
