'use client'

import React from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts'

interface DashboardChartsProps {
  data: any[]
}

export default function DashboardCharts({ data }: DashboardChartsProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
        <XAxis 
          dataKey="name" 
          axisLine={false} 
          tickLine={false} 
          tick={{ fill: '#64748b', fontSize: 12 }} 
          dy={10}
        />
        <YAxis 
          axisLine={false} 
          tickLine={false} 
          tick={{ fill: '#64748b', fontSize: 12 }} 
          dx={-10}
        />
        <Tooltip 
          contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
        />
        <Legend wrapperStyle={{ paddingTop: '20px' }} />
        <Line 
          type="monotone" 
          name="Posts"
          dataKey="posts" 
          stroke="#3b82f6" 
          strokeWidth={3}
          dot={{ r: 4, strokeWidth: 2 }}
          activeDot={{ r: 6 }}
        />
        <Line 
          type="monotone" 
          name="Comments"
          dataKey="comments" 
          stroke="#10b981" 
          strokeWidth={3}
          dot={{ r: 4, strokeWidth: 2 }}
        />
        <Line 
          type="monotone" 
          name="Active Users"
          dataKey="users" 
          stroke="#8b5cf6" 
          strokeWidth={3}
          dot={{ r: 4, strokeWidth: 2 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
