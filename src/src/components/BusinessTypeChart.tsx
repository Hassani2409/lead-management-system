'use client'

import { useState, useEffect } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import { getLeadStats, BUSINESS_TYPE_LABELS } from '@/lib/leadService'

const COLORS = [
  '#3B82F6', // Blue
  '#EF4444', // Red  
  '#F59E0B', // Yellow
  '#10B981', // Green
  '#8B5CF6', // Purple
  '#F97316', // Orange
  '#6B7280'  // Gray
]

export default function BusinessTypeChart() {
  const [stats, setStats] = useState<any>({ total: 0, by_business_type: {} })
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Only run on client side to avoid hydration mismatch
    const loadStats = () => {
      const loadedStats = getLeadStats()
      setStats(loadedStats)
      setIsLoaded(true)
    }

    loadStats()
  }, [])

  const data = Object.entries(stats.by_business_type).map(([type, count], index) => ({
    name: BUSINESS_TYPE_LABELS[type as keyof typeof BUSINESS_TYPE_LABELS] || type,
    value: count,
    color: COLORS[index % COLORS.length]
  }))

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0]
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium">{data.name}</p>
          <p className="text-sm text-gray-600">
            {data.value} Leads ({((data.value / stats.total) * 100).toFixed(1)}%)
          </p>
        </div>
      )
    }
    return null
  }

  // Show loading state during hydration
  if (!isLoaded) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="animate-pulse">
          <div className="w-48 h-48 bg-gray-200 rounded-full mx-auto mb-4"></div>
          <div className="flex justify-center space-x-4">
            <div className="h-3 bg-gray-200 rounded w-16"></div>
            <div className="h-3 bg-gray-200 rounded w-20"></div>
            <div className="h-3 bg-gray-200 rounded w-18"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={2}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="bottom"
            height={36}
            formatter={(value, entry: any) => (
              <span style={{ color: entry.color }}>{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
