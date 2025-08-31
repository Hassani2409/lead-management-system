import DashboardHeader from '@/components/DashboardHeader'
import LeadsTableSimple from '@/components/LeadsTableSimple'
import StatsCards from '@/components/StatsCards'

export default function Home() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <DashboardHeader />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <StatsCards />
        <LeadsTableSimple />
      </main>
    </div>
  )
}