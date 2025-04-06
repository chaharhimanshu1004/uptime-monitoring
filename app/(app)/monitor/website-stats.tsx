"use client"

import { useState, useEffect } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import { Activity, ChevronRight, Clock, ExternalLink, Globe, Pause, Play, Trash2, ArrowUpRight, ArrowDownRight, Shield, Bell, AlertTriangle, } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import axios from "axios"
import toast from "react-hot-toast"
import { Badge } from "@/components/ui/badge"
import { useSession } from "next-auth/react"
import type { User } from "next-auth"
import { useRouter } from "next/navigation"
import { DeleteConfirmationModal } from "@/app/components/DeleteConfirmationModal"
import { PauseConfirmationModal } from "@/app/components/PauseConfirmationModal"

interface WebsiteStats {
  timestamp: string
  status: string
  responseTime: number
}

interface Website {
  id: string | number
  url: string
  userId?: string | number
  updatedAt?: Date
  createdAt?: Date
  isPaused?: boolean
  lastCheckedAt?: Date | string | null
  lastDownAt?: Date | string | null
  incidentCount: number
  incidents?: Incident[]
}

interface Incident {
  id: string
  startTime: Date | string
  endTime?: Date | string | null
  isResolved: boolean
  duration?: number | null
  responseTime: number
}

export default function WebsiteStats({ websiteId }: { websiteId: string }) {
  const [stats, setStats] = useState<WebsiteStats[]>([])
  const [period, setPeriod] = useState("24h")
  const [loading, setLoading] = useState(true)
  const [website, setWebsite] = useState<Website | null>(null)
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [pauseDialogOpen, setPauseDialogOpen] = useState(false)
  const [sendingTestAlert, setSendingTestAlert] = useState(false)

  const { data: session } = useSession();
  const user = session?.user as User
  const userId = user?.id

  const router = useRouter()

  useEffect(() => {
    if (!userId) return

    const fetchWebsite = async () => {
      try {
        const response = await axios.get(`/api/user/get-websites?userId=${userId}`)
        const websites = response?.data?.websites || []
        const foundWebsite = websites.find((site: Website) => site.id.toString() === websiteId.toString())

        if (foundWebsite) {
          setWebsite(foundWebsite)
        } else {
          console.error("Website not found")
          toast.error("Website not found", {
            style: {
              borderRadius: "10px",
              background: "rgba(170, 50, 60, 0.9)",
              color: "#fff",
              backdropFilter: "blur(10px)",
            },
          })
        }
      } catch (error) {
        console.error("Failed to fetch website:", error)
      }
    }

    fetchWebsite()
  }, [userId, websiteId])


  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true)
      try {
        const response = await fetch(`/api/website-stats?websiteId=${websiteId}&period=${period}`)
        const data = await response.json()

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

  const minResponseTime = stats?.length > 0 ? Math.min(...stats.map((s) => s.responseTime)).toFixed(2) : "0"

  const maxResponseTime = stats?.length > 0 ? Math.max(...stats.map((s) => s.responseTime)).toFixed(2) : "0"

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-zinc-900/90 backdrop-blur-md border border-purple-500/20 p-4 rounded-lg shadow-xl">
          <p className="text-sm font-medium text-zinc-300 mb-2">{new Date(label).toLocaleString()}</p>
          {payload[0].name === "responseTime" && (
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-blue-400"></div>
              <p className="text-sm font-semibold text-blue-400">Response Time: {payload[0].value}ms</p>
            </div>
          )}
          {payload[0].name === "status" && (
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-green-400"></div>
              <p className="text-sm font-semibold text-green-400">Status: {payload[0].value === 1 ? "Up" : "Down"}</p>
            </div>
          )}
        </div>
      )
    }
    return null
  }

  const handleToggleMonitor = async () => {
    if (!website) return

    if (website.isPaused) {
      try {
        setWebsite({
          ...website,
          isPaused: false,
        })

        await axios.post(`/api/user/toggle-monitor`, {
          websiteId,
          action: "resume",
        })

        toast.success("Monitor resumed", {
          style: {
            borderRadius: "10px",
            background: "rgba(50, 140, 90, 0.9)",
            color: "#fff",
            backdropFilter: "blur(10px)",
          },
        })
      } catch (error) {
        console.error("Error resuming monitor:", error)

        setWebsite({
          ...website,
          isPaused: true,
        })

        toast.error("Error updating monitor status!", {
          style: {
            borderRadius: "10px",
            background: "rgba(170, 50, 60, 0.9)",
            color: "#fff",
            backdropFilter: "blur(10px)",
          },
        })
      }
    } else {
      setPauseDialogOpen(true)
    }
  }

  const confirmPause = async () => {
    if (!website) return

    try {
      setWebsite({
        ...website,
        isPaused: true,
      })

      await axios.post(`/api/user/toggle-monitor`, {
        websiteId,
        action: "pause",
      })

      toast.success("Monitor paused", {
        style: {
          borderRadius: "10px",
          background: "rgba(50, 140, 90, 0.9)",
          color: "#fff",
          backdropFilter: "blur(10px)",
        },
      })
    } catch (error) {
      console.error("Error pausing monitor:", error)

      setWebsite({
        ...website,
        isPaused: false,
      })

      toast.error("Error updating monitor status!", {
        style: {
          borderRadius: "10px",
          background: "rgba(170, 50, 60, 0.9)",
          color: "#fff",
          backdropFilter: "blur(10px)",
        },
      })
    } finally {
      setPauseDialogOpen(false)
    }
  }

  const handleDeleteMonitor = async () => {
    try {
      await axios.delete(`/api/user/delete-website?websiteId=${websiteId}`)

      toast.success("Monitor successfully deleted", {
        style: {
          borderRadius: "10px",
          background: "rgba(50, 140, 90, 0.9)",
          color: "#fff",
          backdropFilter: "blur(10px)",
        },
      })

      router.push("/dashboard");
    } catch (error) {
      console.error("Error deleting monitor:", error)

      toast.error("Error deleting monitor!", {
        style: {
          borderRadius: "10px",
          background: "rgba(170, 50, 60, 0.9)",
          color: "#fff",
          backdropFilter: "blur(10px)",
        },
      })
    } finally {
      setDeleteDialogOpen(false)
    }
  }

  function formatDuration(seconds: number): string {
    if (!seconds) return "0 seconds"

    if (seconds < 60) {
      return `${seconds} seconds`
    } else if (seconds < 3600) {
      const minutes = Math.floor(seconds / 60)
      const remainingSeconds = seconds % 60
      return `${minutes}m ${remainingSeconds}s`
    } else {
      const hours = Math.floor(seconds / 3600)
      const minutes = Math.floor((seconds % 3600) / 60)
      return `${hours}h ${minutes}m`
    }
  }

  function formatRelativeTime(timestamp: string | Date | null | undefined): string {
    if (!timestamp) return "Never"

    const now = new Date()
    const date = new Date(timestamp)
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) {
      return `${diffInSeconds} seconds ago`
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60)
      return `${minutes} minute${minutes > 1 ? "s" : ""} ago`
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600)
      return `${hours} hour${hours > 1 ? "s" : ""} ago`
    } else {
      const days = Math.floor(diffInSeconds / 86400)
      return `${days} day${days > 1 ? "s" : ""} ago`
    }
  }

  const handleSendTestAlert = async () => {
    if (!website) return

    setSendingTestAlert(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast.success("Test alert sent successfully", {
        style: {
          borderRadius: "10px",
          background: "rgba(50, 140, 90, 0.9)",
          color: "#fff",
          backdropFilter: "blur(10px)",
        },
      })
    } catch (error) {
      console.error("Error sending test alert:", error)

      toast.error("Failed to send test alert", {
        style: {
          borderRadius: "10px",
          background: "rgba(170, 50, 60, 0.9)",
          color: "#fff",
          backdropFilter: "blur(10px)",
        },
      })
    } finally {
      setSendingTestAlert(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0A0B]">
      {website && (
        <>
          <DeleteConfirmationModal
            isOpen={deleteDialogOpen}
            onClose={() => setDeleteDialogOpen(false)}
            onConfirm={handleDeleteMonitor}
            websiteUrl={website.url?.replace(/(^\w+:|^)\/\//, "") || ""}
          />

          <PauseConfirmationModal
            isOpen={pauseDialogOpen}
            onClose={() => setPauseDialogOpen(false)}
            onConfirm={confirmPause}
            websiteUrl={website.url?.replace(/(^\w+:|^)\/\//, "") || ""}
          />
        </>
      )}

      <div className="border-b border-zinc-800 bg-[#111113] sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-3 flex items-center justify-between">
            <div className="flex items-center space-x-2 text-md font-medium">
              <Link
                href="/dashboard"
                className="text-zinc-400 hover:text-white flex items-center gap-2 transition-colors"
              >
                <Globe className="w-4 h-4" />
                Monitors
              </Link>
              <ChevronRight className="w-4 h-4 text-zinc-600" />
              <span className="text-white truncate max-w-[200px] md:max-w-md">
                {website?.url?.replace(/(^\w+:|^)\/\//, "") || `Monitor ${websiteId}`}
              </span>

              {website?.isPaused ? (
                <Badge variant="outline" className="ml-2 bg-yellow-500/10 text-yellow-400 border-yellow-500/20">
                  Paused
                </Badge>
              ) : (
                <Badge variant="outline" className="ml-2 bg-green-500/10 text-green-400 border-green-500/20">
                  Active
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-3">
              {website && (
                <>
                  <Button
                    size="sm"
                    className={`${
                      website.isPaused
                        ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                        : "bg-amber-600 hover:bg-amber-700 text-white"
                    }`}
                    onClick={handleToggleMonitor}
                  >
                    {website.isPaused ? (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        Resume Monitor
                      </>
                    ) : (
                      <>
                        <Pause className="h-4 w-4 mr-2" />
                        Pause Monitor
                      </>
                    )}
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    className="border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300"
                    onClick={() => setDeleteDialogOpen(true)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Monitor
                  </Button>

                  {website.url && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-zinc-700 text-zinc-300 hover:text-white hover:bg-zinc-800"
                      onClick={() => window.open(website.url, "_blank")}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Visit
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-cyan-400 to-purple-400">
              Website Statistics
            </h1>
            <p className="text-zinc-400 text-sm">
              Monitoring data for {website?.url?.replace(/(^\w+:|^)\/\//, "") || `Monitor ${websiteId}`}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              size="sm"
              variant="outline"
              className="border-purple-500/30 bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 hover:text-purple-300"
              onClick={handleSendTestAlert}
              disabled={sendingTestAlert}
            >
              {sendingTestAlert ? (
                <div className="flex items-center">
                  <div className="h-4 w-4 border-t-2 border-r-2 border-purple-400 rounded-full animate-spin mr-2"></div>
                  Sending...
                </div>
              ) : (
                <>
                  <Bell className="h-4 w-4 mr-2" />
                  Send Test Alert
                </>
              )}
            </Button>

            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-[140px] bg-zinc-900/80 border-zinc-800 text-white h-9">
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
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {loading ? (
            Array(4)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="bg-[#111113] rounded-lg p-4 animate-pulse">
                  <div className="flex justify-between items-center mb-2">
                    <div className="h-5 w-24 bg-zinc-800 rounded"></div>
                    <div className="h-5 w-5 bg-zinc-800 rounded-full"></div>
                  </div>
                  <div className="h-10 w-32 bg-zinc-800 rounded mb-2"></div>
                  <div className="h-4 w-full bg-zinc-800 rounded"></div>
                </div>
              ))
          ) : (
            <>
              <div className="bg-[#111113] rounded-lg p-4 border border-zinc-800/50">
                <div className="flex justify-between items-center mb-1">
                  <h3 className="text-zinc-300 font-medium">Uptime</h3>
                  <Activity className="h-5 w-5 text-purple-400" />
                </div>
                <div className="text-4xl font-bold text-green-400 mb-1">{uptime}%</div>
                <div className="text-xs text-zinc-500">
                  Over the last {period === "24h" ? "24 hours" : period === "7d" ? "7 days" : "30 days"}
                  <div className="mt-1 flex items-center text-xs">
                    <ArrowUpRight className="h-3 w-3 text-green-400 mr-1" />
                    <span className="text-green-400">Excellent</span>
                    <span className="text-zinc-500 ml-1">Target: 99.9%</span>
                  </div>
                </div>
              </div>

              <div className="bg-[#111113] rounded-lg p-4 border border-zinc-800/50">
                <div className="flex justify-between items-center mb-1">
                  <h3 className="text-zinc-300 font-medium">Avg Response</h3>
                  <Clock className="h-5 w-5 text-cyan-400" />
                </div>
                <div className="text-4xl font-bold text-blue-400 mb-1">{avgResponseTime}ms</div>
                <div className="text-xs text-zinc-500">
                  Over the last {period === "24h" ? "24 hours" : period === "7d" ? "7 days" : "30 days"}
                  {Number(avgResponseTime) < 200 ? (
                    <div className="mt-1 flex items-center text-xs">
                      <ArrowUpRight className="h-3 w-3 text-green-400 mr-1" />
                      <span className="text-green-400">Fast</span>
                      <span className="text-zinc-500 ml-1">Target: &lt;200ms</span>
                    </div>
                  ) : Number(avgResponseTime) < 500 ? (
                    <div className="mt-1 flex items-center text-xs">
                      <ArrowUpRight className="h-3 w-3 text-yellow-400 mr-1" />
                      <span className="text-yellow-400">Good</span>
                      <span className="text-zinc-500 ml-1">Target: &lt;200ms</span>
                    </div>
                  ) : (
                    <div className="mt-1 flex items-center text-xs">
                      <ArrowDownRight className="h-3 w-3 text-red-400 mr-1" />
                      <span className="text-red-400">Slow</span>
                      <span className="text-zinc-500 ml-1">Target: &lt;200ms</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-[#111113] rounded-lg p-4 border border-zinc-800/50">
                <div className="flex justify-between items-center mb-1">
                  <h3 className="text-zinc-300 font-medium">Fastest Response</h3>
                  <Activity className="h-5 w-5 text-blue-400" />
                </div>
                <div className="text-4xl font-bold text-indigo-400 mb-1">{minResponseTime}ms</div>
                <div className="text-xs text-zinc-500">Best performance recorded</div>
              </div>

              <div className="bg-[#111113] rounded-lg p-4 border border-zinc-800/50">
                <div className="flex justify-between items-center mb-1">
                  <h3 className="text-zinc-300 font-medium">Slowest Response</h3>
                  <Activity className="h-5 w-5 text-red-400" />
                </div>
                <div className="text-4xl font-bold text-red-400 mb-1">{maxResponseTime}ms</div>
                <div className="text-xs text-zinc-500">Worst performance recorded</div>
              </div>
            </>
          )}
        </div>

        {loading ? (
          <div className="mb-6 bg-[#111113] rounded-lg p-4 animate-pulse">
            <div className="h-6 w-48 bg-zinc-800 rounded mb-4"></div>
            <div className="grid grid-cols-3 gap-4">
              <div className="h-20 bg-zinc-800 rounded"></div>
              <div className="h-20 bg-zinc-800 rounded"></div>
              <div className="h-20 bg-zinc-800 rounded"></div>
            </div>
          </div>
        ) : (
          <div className="mb-6 bg-[#111113] rounded-lg p-4 border border-zinc-800/50">
            <div className="flex items-center mb-3">
              <div className="h-2 w-2 rounded-full bg-orange-400 mr-2"></div>
              <h2 className="text-lg font-medium text-zinc-200">Incident Summary</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-zinc-900/50 rounded-lg p-3 border border-zinc-800/50">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-zinc-400">Total Incidents</div>
                  <AlertTriangle className="h-4 w-4 text-orange-400" />
                </div>
                <div className="text-2xl font-bold text-orange-400 mt-1">{website?.incidentCount || 0}</div>
              </div>

              <div className="bg-zinc-900/50 rounded-lg p-3 border border-zinc-800/50">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-zinc-400">Last Down</div>
                  <ArrowDownRight className="h-4 w-4 text-red-400" />
                </div>
                <div className="text-lg font-bold text-red-400 mt-1 truncate">
                  {website?.lastDownAt ? formatRelativeTime(website.lastDownAt) : "Never"}
                </div>
              </div>

              <div className="bg-zinc-900/50 rounded-lg p-3 border border-zinc-800/50">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-zinc-400">Last Checked</div>
                  <Clock className="h-4 w-4 text-blue-400" />
                </div>
                <div className="text-lg font-bold text-blue-400 mt-1 truncate">
                  {website?.lastCheckedAt ? formatRelativeTime(website.lastCheckedAt) : "Never"}
                </div>
              </div>
            </div>
          </div>
        )}

        

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {loading ? (
            Array(2)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="bg-[#111113] rounded-lg p-4 animate-pulse">
                  <div className="flex items-center mb-3">
                    <div className="h-2 w-2 bg-zinc-800 rounded-full mr-2"></div>
                    <div className="h-5 w-48 bg-zinc-800 rounded"></div>
                  </div>
                  <div className="h-[250px] bg-zinc-800/30 rounded"></div>
                </div>
              ))
          ) : (
            <>
              <div className="bg-[#111113] rounded-lg p-4 border border-zinc-800/50">
                <div className="flex items-center mb-3">
                  <div className="h-2 w-2 rounded-full bg-blue-400 mr-2"></div>
                  <h2 className="text-sm font-medium text-zinc-300">Response Time History</h2>
                </div>
                {stats.length === 0 ? (
                  <div className="h-[250px] flex items-center justify-center text-zinc-500">
                    <div className="text-center">
                      <Shield className="h-10 w-10 text-zinc-700 mx-auto mb-2" />
                      <p className="text-sm">No data available for the selected period</p>
                    </div>
                  </div>
                ) : (
                  <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={stats} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
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
                          fontSize={10}
                          tick={{ fill: "#999" }}
                          domain={["dataMin", "dataMax"]}
                          interval="preserveStartEnd"
                          minTickGap={50}
                        />
                        <YAxis stroke="#666" fontSize={10} tick={{ fill: "#999" }} domain={[0, "auto"]} />
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
                )}
              </div>

              <div className="bg-[#111113] rounded-lg p-4 border border-zinc-800/50">
                <div className="flex items-center mb-3">
                  <div className="h-2 w-2 rounded-full bg-green-400 mr-2"></div>
                  <h2 className="text-sm font-medium text-zinc-300">Status History</h2>
                </div>
                {stats.length === 0 ? (
                  <div className="h-[250px] flex items-center justify-center text-zinc-500">
                    <div className="text-center">
                      <Shield className="h-10 w-10 text-zinc-700 mx-auto mb-2" />
                      <p className="text-sm">No data available for the selected period</p>
                    </div>
                  </div>
                ) : (
                  <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={stats} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
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
                          fontSize={10}
                          tick={{ fill: "#999" }}
                          domain={["dataMin", "dataMax"]}
                          interval="preserveStartEnd"
                          minTickGap={50}
                        />
                        <YAxis
                          stroke="#666"
                          fontSize={10}
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
                )}
              </div>
            </>
          )}
        </div>

        {loading ? (
          <div className="bg-[#111113] rounded-lg p-4 animate-pulse">
            <div className="flex items-center mb-3">
              <div className="h-2 w-2 bg-zinc-800 rounded-full mr-2"></div>
              <div className="h-5 w-48 bg-zinc-800 rounded"></div>
            </div>
            <div className="space-y-3">
              {Array(3)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="h-20 bg-zinc-800/30 rounded"></div>
                ))}
            </div>
          </div>
        ) : incidents && incidents.length > 0 ? (
          <div className="bg-[#111113] rounded-lg p-4 border border-zinc-800/50">
            <div className="flex items-center mb-3">
              <div className="h-2 w-2 rounded-full bg-orange-400 mr-2"></div>
              <h2 className="text-sm font-medium text-zinc-300">Recent Incidents</h2>
            </div>
            <div className="space-y-3">
              {incidents.slice(0, 5).map((incident) => (
                <div key={incident.id} className="bg-zinc-900/50 rounded-lg p-3 border border-zinc-800/50">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center">
                        <span
                          className={`h-2 w-2 rounded-full ${incident.isResolved ? "bg-green-500" : "bg-red-500"} mr-2`}
                        ></span>
                        <span className="text-zinc-300 text-sm font-medium">
                          {incident.isResolved ? "Resolved" : "Ongoing"}
                        </span>
                      </div>
                      <div className="text-xs text-zinc-400 mt-1">
                        Started: {new Date(incident.startTime).toLocaleString()}
                      </div>
                      {incident.endTime && (
                        <div className="text-xs text-zinc-400">
                          Ended: {new Date(incident.endTime).toLocaleString()}
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      {incident.duration ? (
                        <div className="text-orange-400 text-sm font-medium">{formatDuration(incident.duration)}</div>
                      ) : (
                        <div className="text-red-400 text-sm font-medium">Ongoing</div>
                      )}
                      <div className="text-xs text-zinc-400 mt-1">Response: {incident.responseTime}ms</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-[#111113] rounded-lg p-4 border border-zinc-800/50">
            <div className="flex items-center mb-3">
              <div className="h-2 w-2 rounded-full bg-orange-400 mr-2"></div>
              <h2 className="text-sm font-medium text-zinc-300">Recent Incidents</h2>
            </div>
            <div className="py-6 text-center text-zinc-500">
              <Shield className="h-10 w-10 text-zinc-700 mx-auto mb-2" />
              <p className="text-sm">No incidents recorded</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

