"use client"

import React, { useEffect, useState } from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function OverviewClient() {
  const [data, setData] = useState<any[]>([])

  useEffect(() => {
    // Generate mock data for the last 7 days
    const generateData = () => {
      const result = []
      const today = new Date()
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today)
        date.setDate(date.getDate() - i)
        result.push({
          name: date.toLocaleDateString('id-ID', { weekday: 'short' }),
          bookings: Math.floor(Math.random() * 20) + 5,
        })
      }
      return result
    }
    
    setData(generateData())
  }, [])

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={data}
        margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
      >
        <defs>
          <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
          </linearGradient>
        </defs>
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
        />
        <Tooltip 
          contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
          labelStyle={{ fontWeight: 'bold', color: '#0f172a' }}
        />
        <Area 
          type="monotone" 
          dataKey="bookings" 
          stroke="#3b82f6" 
          strokeWidth={3}
          fillOpacity={1} 
          fill="url(#colorBookings)" 
          activeDot={{ r: 6, fill: '#3b82f6', stroke: '#fff', strokeWidth: 2 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
