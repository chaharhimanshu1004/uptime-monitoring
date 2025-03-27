"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import { Activity, ChevronRight, Clock, Globe } from "lucide-react"
import Link from "next/link"

interface WebsiteStats {
  timestamp: string
  status: string
  responseTime: number
}

export default function WebsiteStats({ websiteId }: { websiteId: string }) {
  const [stats, setStats] = useState<WebsiteStats[]>([])
  const [period, setPeriod] = useState("24h")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true)
      try {
        const response = await fetch(`/api/website-stats?websiteId=${websiteId}&period=${period}`)
        const data = await response.json()

        // Sort data chronologically to ensure proper display
        const sortedStats = data.stats.sort(
          (a: WebsiteStats, b: WebsiteStats) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
        )

        setStats(sortedStats)
      } catch (error) {
        console.error("Failed to fetch stats:", error)
      }
      setLoading(false)
    }

    fetchStats()
  }, [websiteId, period])

  const uptime =
    stats?.length > 0 ? ((stats.filter((s) => s.status === "up").length / stats.length) * 100).toFixed(2) : "0"

  const avgResponseTime =
    stats?.length > 0 ? (stats.reduce((acc, s) => acc + s.responseTime, 0) / stats.length).toFixed(2) : "0"

  // Custom tooltip component for charts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-zinc-900 border border-zinc-800 p-3 rounded-lg shadow-lg">
          <p className="text-sm text-zinc-300 mb-1">{new Date(label).toLocaleString()}</p>
          {payload[0].name === "responseTime" && (
            <p className="text-sm font-semibold text-blue-400">Response Time: {payload[0].value}ms</p>
          )}
          {payload[0].name === "status" && (
            <p className="text-sm font-semibold text-green-400">Status: {payload[0].value === 1 ? "Up" : "Down"}</p>
          )}
        </div>
      )
    }
    return null
  }

  return (
    <div className="min-h-screen bg-[#0A0A0B]">
      <div className="border-b border-zinc-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4 flex items-center space-x-2 text-md font-semibold">
            <Link href="/monitors" className="text-zinc-400 hover:text-white flex items-center gap-2 transition-colors">
              <Globe className="w-4 h-4" />
              Monitors
            </Link>
            <ChevronRight className="w-4 h-4 text-zinc-600" />
            <span className="text-white">Monitor {websiteId}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-white">Website Statistics</h2>
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[180px] bg-zinc-900/80 border-zinc-800 text-white">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
              <SelectItem value="24h" className="text-white focus:bg-zinc-800 focus:text-white">
                Last 24 hours
              </SelectItem>
              <SelectItem value="7d" className="text-white focus:bg-zinc-800 focus:text-white">
                Last 7 days
              </SelectItem>
              <SelectItem value="30d" className="text-white focus:bg-zinc-800 focus:text-white">
                Last 30 days
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-6 md:grid-cols-2 mb-8">
          <Card className="bg-zinc-900/30 backdrop-blur-sm border border-zinc-800/50 hover:border-zinc-700/50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-zinc-300 font-medium">Uptime</CardTitle>
              <Activity className="h-5 w-5 text-zinc-500" />
            </CardHeader>
            <CardContent>
              <div className="text-5xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                {uptime}%
              </div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900/30 backdrop-blur-sm border border-zinc-800/50 hover:border-zinc-700/50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-zinc-300 font-medium">Average Response Time</CardTitle>
              <Clock className="h-5 w-5 text-zinc-500" />
            </CardHeader>
            <CardContent>
              <div className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-cyan-500 bg-clip-text text-transparent">
                {avgResponseTime}ms
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-zinc-900/30 backdrop-blur-sm border border-zinc-800/50 hover:border-zinc-700/50 transition-colors mb-8">
          <CardHeader className="border-b border-zinc-800/50">
            <CardTitle className="text-zinc-300">Response Time History</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="responseTimeGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" opacity={0.2} />
                  <XAxis
                    dataKey="timestamp"
                    tickFormatter={(timestamp) => {
                      const date = new Date(timestamp)
                      return `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`
                    }}
                    stroke="#666"
                    fontSize={12}
                    tick={{ fill: "#999" }}
                    domain={["dataMin", "dataMax"]}
                    interval="preserveStartEnd"
                    minTickGap={50}
                  />
                  <YAxis stroke="#666" fontSize={12} tick={{ fill: "#999" }} domain={[0, "auto"]} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="responseTime"
                    name="responseTime"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    fill="url(#responseTimeGradient)"
                    activeDot={{ r: 6, fill: "#3b82f6", stroke: "#fff", strokeWidth: 2 }}
                    isAnimationActive={true}
                    animationDuration={1000}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900/30 backdrop-blur-sm border border-zinc-800/50 hover:border-zinc-700/50 transition-colors">
          <CardHeader className="border-b border-zinc-800/50">
            <CardTitle className="text-zinc-300">Status History</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="statusGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" opacity={0.2} />
                  <XAxis
                    dataKey="timestamp"
                    tickFormatter={(timestamp) => {
                      const date = new Date(timestamp)
                      return `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`
                    }}
                    stroke="#666"
                    fontSize={12}
                    tick={{ fill: "#999" }}
                    domain={["dataMin", "dataMax"]}
                    interval="preserveStartEnd"
                    minTickGap={50}
                  />
                  <YAxis
                    stroke="#666"
                    fontSize={12}
                    tick={{ fill: "#999" }}
                    domain={[0, 1]}
                    ticks={[0, 1]}
                    tickFormatter={(value) => (value === 1 ? "Up" : "Down")}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="stepAfter"
                    dataKey={(data) => (data.status === "up" ? 1 : 0)}
                    name="status"
                    stroke="#10b981"
                    strokeWidth={2}
                    fill="url(#statusGradient)"
                    activeDot={{ r: 6, fill: "#10b981", stroke: "#fff", strokeWidth: 2 }}
                    isAnimationActive={true}
                    animationDuration={1000}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

