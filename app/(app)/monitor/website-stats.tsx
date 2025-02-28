"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip } from "@/components/ui/chart"
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
                setStats(data.stats)
            } catch (error) {
                console.error("Failed to fetch stats:", error)
            }
            setLoading(false)
        }

        fetchStats()
    }, [websiteId, period])

    const uptime =
        stats.length > 0 ? ((stats.filter((s) => s.status === "up").length / stats.length) * 100).toFixed(2) : "0"

    const avgResponseTime =
        stats.length > 0 ? (stats.reduce((acc, s) => acc + s.responseTime, 0) / stats.length).toFixed(2) : "0"

    const chartConfig = {
        responseTime: {
            label: "Response Time",
            color: "var(--chart-blue)",
        },
        status: {
            label: "Status",
            color: "var(--chart-green)",
        },
    }

    return (
        <>
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

            <div className="mx-auto w-[90%] min-w-[800px] space-y-8 p-8">
                <style jsx global>{`
                :root {
                    --chart-blue: #2563eb;
                    --chart-blue-semi: #2563eb80;
                    --chart-green: #16a34a;
                    --chart-green-semi: #16a34a80;
                }
            `}</style>


                <div className="flex justify-between items-center">
                    <h2 className="text-3xl font-bold tracking-tight">Website Statistics</h2>
                    <Select value={period} onValueChange={setPeriod}>
                        <SelectTrigger className="w-36">
                            <SelectValue placeholder="Select period" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="24h">Last 24 hours</SelectItem>
                            <SelectItem value="7d">Last 7 days</SelectItem>
                            <SelectItem value="30d">Last 30 days</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Uptime</CardTitle>
                            <Activity className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl font-bold text-green-600">{uptime}%</div>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Average Response Time</CardTitle>
                            <Clock className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl font-bold text-blue-600">{avgResponseTime}ms</div>
                        </CardContent>
                    </Card>
                </div>

                <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                        <CardTitle>Response Time History</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer className="h-[300px]" config={chartConfig}>
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={stats}>
                                    <defs>
                                        <linearGradient id="responseTimeGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="var(--chart-blue)" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="var(--chart-blue)" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.4} />
                                    <XAxis
                                        dataKey="timestamp"
                                        tickFormatter={(timestamp) => new Date(timestamp).toLocaleTimeString()}
                                        stroke="var(--muted-foreground)"
                                        fontSize={12}
                                    />
                                    <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                                    <ChartTooltip />
                                    <Area
                                        type="monotone"
                                        dataKey="responseTime"
                                        stroke="var(--chart-blue)"
                                        strokeWidth={2}
                                        fill="url(#responseTimeGradient)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                        <CardTitle>Status History</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer className="h-[300px]" config={chartConfig}>
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={stats}>
                                    <defs>
                                        <linearGradient id="statusGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="var(--chart-green)" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="var(--chart-green)" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.4} />
                                    <XAxis
                                        dataKey="timestamp"
                                        tickFormatter={(timestamp) => new Date(timestamp).toLocaleTimeString()}
                                        stroke="var(--muted-foreground)"
                                        fontSize={12}
                                    />
                                    <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                                    <ChartTooltip />
                                    <Area
                                        type="monotone"
                                        dataKey={(data) => (data.status === "up" ? 1 : 0)}
                                        stroke="var(--chart-green)"
                                        strokeWidth={2}
                                        fill="url(#statusGradient)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                    </CardContent>
                </Card>
            </div>
        </>
    )
}

