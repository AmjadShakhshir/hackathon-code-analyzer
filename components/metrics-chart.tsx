"use client"

import { useState } from "react"
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { Button } from "@/components/ui/button"

interface FunctionInfo {
  file: string
  name: string
  loc: number
  params: number
  cc: number
  nesting: number
  notes: string[]
}

interface MetricsChartProps {
  functions: FunctionInfo[]
}

export function MetricsChart({ functions }: MetricsChartProps) {
  const [viewMode, setViewMode] = useState<'overview' | 'distribution'>('overview')

  if (!functions.length) {
    return (
      <div className="flex items-center justify-center h-80 text-slate-400">
        <div className="text-center">
          <div className="text-lg mb-2">📊</div>
          <div>No data to visualize</div>
          <div className="text-sm">Analyze some code to see charts</div>
        </div>
      </div>
    )
  }

  // Prepare data for composed chart (CC vs LOC)
  const composedData = functions.slice(0, 20).map((fn, index) => ({
    name: fn.name.length > 12 ? fn.name.substring(0, 12) + "..." : fn.name,
    fullName: fn.name,
    cc: fn.cc,
    loc: fn.loc,
    params: fn.params,
    file: fn.file,
    index,
  }))

  // Prepare data for complexity distribution pie chart
  const complexityDistribution = [
    {
      name: "Simple (CC 1-4)",
      value: functions.filter(f => f.cc >= 1 && f.cc <= 4).length,
      color: "#10b981", // green
    },
    {
      name: "Medium (CC 5-9)",
      value: functions.filter(f => f.cc >= 5 && f.cc <= 9).length,
      color: "#f59e0b", // yellow
    },
    {
      name: "Complex (CC 10+)",
      value: functions.filter(f => f.cc >= 10).length,
      color: "#ef4444", // red
    },
  ].filter(item => item.value > 0)

  // Custom tooltip for composed chart
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-3 shadow-lg">
          <p className="text-slate-100 font-medium">{data.fullName}</p>
          <p className="text-slate-300 text-sm mb-1">{data.file}</p>
          <div className="space-y-1 text-sm">
            <p className="text-blue-400">Cyclomatic Complexity: {data.cc}</p>
            <p className="text-green-400">Lines of Code: {data.loc}</p>
            <p className="text-purple-400">Parameters: {data.params}</p>
          </div>
        </div>
      )
    }
    return null
  }

  // Custom tooltip for pie chart
  const PieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0]
      return (
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-2 shadow-lg">
          <p className="text-slate-100 text-sm">{data.name}</p>
          <p className="text-slate-300 text-sm">{data.value} functions</p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="space-y-6">
      {/* View Toggle */}
      <div className="flex gap-2">
        <Button
          variant={viewMode === 'overview' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setViewMode('overview')}
          className={viewMode === 'overview' ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-slate-800 border-slate-700 hover:bg-slate-700 text-slate-100'}
        >
          Function Overview
        </Button>
        <Button
          variant={viewMode === 'distribution' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setViewMode('distribution')}
          className={viewMode === 'distribution' ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-slate-800 border-slate-700 hover:bg-slate-700 text-slate-100'}
        >
          Complexity Distribution
        </Button>
      </div>

      {viewMode === 'overview' && (
        <div>
          <h3 className="text-lg font-medium text-slate-200 mb-4">
            Function Metrics Overview
          </h3>
          <div className="bg-slate-950 border border-slate-700 rounded-lg p-4">
            <ResponsiveContainer width="100%" height={400}>
              <ComposedChart data={composedData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis 
                  dataKey="name" 
                  stroke="#94a3b8"
                  fontSize={12}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis 
                  yAxisId="left"
                  stroke="#94a3b8"
                  fontSize={12}
                  label={{ value: 'Cyclomatic Complexity', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#94a3b8' } }}
                />
                <YAxis 
                  yAxisId="right" 
                  orientation="right"
                  stroke="#94a3b8"
                  fontSize={12}
                  label={{ value: 'Lines of Code', angle: 90, position: 'insideRight', style: { textAnchor: 'middle', fill: '#94a3b8' } }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  wrapperStyle={{ color: '#94a3b8' }}
                />
                <Bar 
                  yAxisId="left"
                  dataKey="cc" 
                  fill="#3b82f6" 
                  name="Cyclomatic Complexity"
                  radius={[2, 2, 0, 0]}
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="loc" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  name="Lines of Code"
                  dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {viewMode === 'distribution' && complexityDistribution.length > 0 && (
        <div>
          <h3 className="text-lg font-medium text-slate-200 mb-4">
            Complexity Distribution
          </h3>
          <div className="bg-slate-950 border border-slate-700 rounded-lg p-4">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={complexityDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {complexityDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<PieTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-950 border border-slate-700 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-blue-400">
            {functions.reduce((sum, f) => sum + f.cc, 0)}
          </div>
          <div className="text-sm text-slate-300">Total CC</div>
        </div>
        <div className="bg-slate-950 border border-slate-700 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-green-400">
            {functions.reduce((sum, f) => sum + f.loc, 0)}
          </div>
          <div className="text-sm text-slate-300">Total LOC</div>
        </div>
        <div className="bg-slate-950 border border-slate-700 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-purple-400">
            {Math.round(functions.reduce((sum, f) => sum + f.params, 0) / functions.length * 10) / 10}
          </div>
          <div className="text-sm text-slate-300">Avg Params</div>
        </div>
        <div className="bg-slate-950 border border-slate-700 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-yellow-400">
            {functions.filter(f => f.cc >= 10).length}
          </div>
          <div className="text-sm text-slate-300">High CC</div>
        </div>
      </div>
    </div>
  )
}
