"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import { Activity, ChevronRight, Clock, ExternalLink, Globe, Pause, Play, Trash2, ArrowUpRight, ArrowDownRight, Shield } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import axios from "axios"
import toast from "react-hot-toast"
import { Badge } from "@/components/ui/badge"
import { DeleteConfirmationModal } from "@/app/components/DeleteConfirmationModal"
import { PauseConfirmationModal } from "@/app/components/PauseConfirmationModal"
import { useSession } from "next-auth/react"
import type { User } from "next-auth"
import { Skeleton } from "@/components/ui/skeleton"
import { useRouter } from "next/navigation"

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
}

export default function WebsiteStats({ websiteId }: { websiteId: string }) {
  const { data: session, status } = useSession()
  const user = session?.user as User
  const [stats, setStats] = useState<WebsiteStats[]>([])
  const [period, setPeriod] = useState("24h")
  const [loading, setLoading] = useState(true)
  const [website, setWebsite] = useState<Website | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [pauseDialogOpen, setPauseDialogOpen] = useState(false)
  const router = useRouter();

  let userId: string | number | undefined = user?.id
  if (userId) {
    userId = typeof userId === "string" ? Number.parseInt(userId) : userId
  }

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

      router.push("/dashboard")
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

  const MetricCardSkeleton = ({ gradientFrom }: { gradientFrom: string }) => (
    <Card className="bg-gradient-to-br from-zinc-900/80 to-zinc-900/40 backdrop-blur-sm border-0 shadow-xl shadow-purple-500/5 overflow-hidden relative">
      <div className={`absolute inset-0 bg-gradient-to-br from-${gradientFrom}-500/10 to-transparent`}></div>
      <CardHeader className="relative z-10 flex flex-row items-center justify-between pb-2">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-5 w-5 rounded-full" />
      </CardHeader>
      <CardContent className="relative z-10">
        <Skeleton className="h-12 w-40 mb-2" />
        <Skeleton className="h-4 w-48 mb-4" />
        <Skeleton className="h-4 w-32" />
      </CardContent>
    </Card>
  )

  const ChartSkeleton = ({ gradientFrom }: { gradientFrom: string }) => (
    <Card className="bg-gradient-to-br from-zinc-900/80 to-zinc-900/40 backdrop-blur-sm border-0 shadow-xl shadow-purple-500/5 overflow-hidden relative">
      <div className={`absolute inset-0 bg-gradient-to-br from-${gradientFrom}-500/5 to-transparent`}></div>
      <CardHeader className="relative z-10 border-b border-zinc-800/50">
        <div className="flex items-center">
          <Skeleton className="h-2 w-2 rounded-full mr-2" />
          <Skeleton className="h-6 w-48" />
        </div>
      </CardHeader>
      <CardContent className="relative z-10 pt-6">
        <div className="h-[300px] flex flex-col gap-4">
          <Skeleton className="h-full w-full rounded-lg opacity-20" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-10 w-10 relative">
              <div
                className={`absolute inset-0 rounded-full border-t-2 border-r-2 border-${gradientFrom}-400 animate-spin`}
              ></div>
              <div
                className={`absolute inset-2 rounded-full border-t-2 border-r-2 border-${gradientFrom}-500 animate-spin animation-delay-150`}
              ></div>
              <div
                className={`absolute inset-4 rounded-full border-t-2 border-r-2 border-${gradientFrom}-600 animate-spin animation-delay-300`}
              ></div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0A0A0B] to-[#121214]">
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

      <div className="border-b border-purple-500/10 backdrop-blur-xl bg-black/30 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4 flex items-center justify-between">
            <div className="flex items-center space-x-2 text-md font-medium">
              <Link
                href="/dashboard"
                className="text-zinc-400 hover:text-white flex items-center gap-2 transition-colors"
              >
                <Globe className="w-4 h-4" />
                Monitors
              </Link>
              <ChevronRight className="w-4 h-4 text-zinc-600" />
              {loading ? (
                <Skeleton className="h-5 w-40" />
              ) : (
                <span className="text-white truncate max-w-[200px] md:max-w-md">
                  {website?.url?.replace(/(^\w+:|^)\/\//, "") || `Monitor ${websiteId}`}
                </span>
              )}

              {loading ? (
                <Skeleton className="h-5 w-16 ml-2" />
              ) : website?.isPaused ? (
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
              {loading ? (
                <>
                  <Skeleton className="h-9 w-32" />
                  <Skeleton className="h-9 w-32" />
                  <Skeleton className="h-9 w-20" />
                </>
              ) : (
                website && (
                  <>
                    <Button
                      size="sm"
                      className={`${
                        website.isPaused
                          ? "bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white"
                          : "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white"
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
                )
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-cyan-400 to-purple-400">
              Website Statistics
            </h2>
            {loading ? (
              <Skeleton className="h-5 w-64 mt-1" />
            ) : (
              <p className="text-zinc-400 mt-1">
                Monitoring data for {website?.url?.replace(/(^\w+:|^)\/\//, "") || `Monitor ${websiteId}`}
              </p>
            )}
          </motion.div>

          <Select value={period} onValueChange={setPeriod} disabled={loading}>
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

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          {loading ? (
            <>
              <MetricCardSkeleton gradientFrom="purple" />
              <MetricCardSkeleton gradientFrom="cyan" />
              <MetricCardSkeleton gradientFrom="blue" />
              <MetricCardSkeleton gradientFrom="red" />
            </>
          ) : (
            <>
              <Card className="bg-gradient-to-br from-zinc-900/80 to-zinc-900/40 backdrop-blur-sm border-0 shadow-xl shadow-purple-500/5 overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent"></div>
                <CardHeader className="relative z-10 flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-zinc-200 font-medium">Uptime</CardTitle>
                  <Activity className="h-5 w-5 text-purple-400" />
                </CardHeader>
                <CardContent className="relative z-10">
                  <div className="text-5xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                    {uptime}%
                  </div>
                  <p className="text-zinc-500 mt-2 text-sm">
                    Over the last {period === "24h" ? "24 hours" : period === "7d" ? "7 days" : "30 days"}
                  </p>

                  <div className="mt-4 flex items-center text-sm">
                    <ArrowUpRight className="h-4 w-4 text-green-400 mr-1" />
                    <span className="text-green-400">Excellent</span>
                    <span className="text-zinc-500 ml-2">Target: 99.9%</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-zinc-900/80 to-zinc-900/40 backdrop-blur-sm border-0 shadow-xl shadow-cyan-500/5 overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent"></div>
                <CardHeader className="relative z-10 flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-zinc-200 font-medium">Avg Response</CardTitle>
                  <Clock className="h-5 w-5 text-cyan-400" />
                </CardHeader>
                <CardContent className="relative z-10">
                  <div className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-cyan-500 bg-clip-text text-transparent">
                    {avgResponseTime}ms
                  </div>
                  <p className="text-zinc-500 mt-2 text-sm">
                    Over the last {period === "24h" ? "24 hours" : period === "7d" ? "7 days" : "30 days"}
                  </p>

                  {Number(avgResponseTime) < 200 ? (
                    <div className="mt-4 flex items-center text-sm">
                      <ArrowUpRight className="h-4 w-4 text-green-400 mr-1" />
                      <span className="text-green-400">Fast</span>
                      <span className="text-zinc-500 ml-2">Target: &lt;200ms</span>
                    </div>
                  ) : Number(avgResponseTime) < 500 ? (
                    <div className="mt-4 flex items-center text-sm">
                      <ArrowUpRight className="h-4 w-4 text-yellow-400 mr-1" />
                      <span className="text-yellow-400">Good</span>
                      <span className="text-zinc-500 ml-2">Target: &lt;200ms</span>
                    </div>
                  ) : (
                    <div className="mt-4 flex items-center text-sm">
                      <ArrowDownRight className="h-4 w-4 text-red-400 mr-1" />
                      <span className="text-red-400">Slow</span>
                      <span className="text-zinc-500 ml-2">Target: &lt;200ms</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-zinc-900/80 to-zinc-900/40 backdrop-blur-sm border-0 shadow-xl shadow-blue-500/5 overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent"></div>
                <CardHeader className="relative z-10 flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-zinc-200 font-medium">Fastest Response</CardTitle>
                  <Activity className="h-5 w-5 text-blue-400" />
                </CardHeader>
                <CardContent className="relative z-10">
                  <div className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
                    {minResponseTime}ms
                  </div>
                  <p className="text-zinc-500 mt-2 text-sm">Best performance recorded</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-zinc-900/80 to-zinc-900/40 backdrop-blur-sm border-0 shadow-xl shadow-red-500/5 overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-transparent"></div>
                <CardHeader className="relative z-10 flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-zinc-200 font-medium">Slowest Response</CardTitle>
                  <Activity className="h-5 w-5 text-red-400" />
                </CardHeader>
                <CardContent className="relative z-10">
                  <div className="text-5xl font-bold bg-gradient-to-r from-red-400 to-orange-500 bg-clip-text text-transparent">
                    {maxResponseTime}ms
                  </div>
                  <p className="text-zinc-500 mt-2 text-sm">Worst performance recorded</p>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        {loading ? (
          <ChartSkeleton gradientFrom="purple" />
        ) : (
          <Card className="bg-gradient-to-br from-zinc-900/80 to-zinc-900/40 backdrop-blur-sm border-0 shadow-xl shadow-purple-500/5 mb-8 overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent"></div>
            <CardHeader className="relative z-10 border-b border-zinc-800/50">
              <CardTitle className="text-zinc-200 flex items-center">
                <div className="mr-2 h-2 w-2 rounded-full bg-blue-400"></div>
                Response Time History
              </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10 pt-6">
              {stats.length === 0 ? (
                <div className="h-[300px] flex items-center justify-center text-zinc-500">
                  <div className="text-center">
                    <Shield className="h-12 w-12 text-zinc-700 mx-auto mb-3" />
                    <p>No data available for the selected period</p>
                  </div>
                </div>
              ) : (
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
              )}
            </CardContent>
          </Card>
        )}

        {loading ? (
          <ChartSkeleton gradientFrom="green" />
        ) : (
          <Card className="bg-gradient-to-br from-zinc-900/80 to-zinc-900/40 backdrop-blur-sm border-0 shadow-xl shadow-green-500/5 overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent"></div>
            <CardHeader className="relative z-10 border-b border-zinc-800/50">
              <CardTitle className="text-zinc-200 flex items-center">
                <div className="mr-2 h-2 w-2 rounded-full bg-green-400"></div>
                Status History
              </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10 pt-6">
              {stats.length === 0 ? (
                <div className="h-[300px] flex items-center justify-center text-zinc-500">
                  <div className="text-center">
                    <Shield className="h-12 w-12 text-zinc-700 mx-auto mb-3" />
                    <p>No data available for the selected period</p>
                  </div>
                </div>
              ) : (
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
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

