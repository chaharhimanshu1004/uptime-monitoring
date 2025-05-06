"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import type { User } from "next-auth"
import { AppSidebar } from "@/components/Sidebar"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { motion, AnimatePresence } from "framer-motion"
import { AlertTriangle, CheckCircle, Clock, Filter, Globe, MapPin, RefreshCw, Search, Server, Shield, XCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import axios from "axios"
import toast from "react-hot-toast"
import { IncidentDetailsModal } from "@/app/components/IncidentDetailsModal"
import { AcknowledgeConfirmationModal } from "@/app/components/AcknowledgeConfirmationModal"

interface Incident {
    id: string
    websiteId: number
    startTime: string | Date
    endTime?: string | Date | null
    isResolved: boolean
    responseTime: number
    duration?: number | null
    isAcknowledged: boolean
    reason: string
    region: string
    website: {
        url: string
    }
    regions?: string[] // for grouped incidents
    originalIncidents?: Incident[]
}

export default function IncidentsPage() {
    const { data: session } = useSession()
    const user: User = session?.user as User

    const [incidents, setIncidents] = useState<Incident[]>([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState("all") // all, resolved, unresolved
    const [searchQuery, setSearchQuery] = useState("")
    const [processingIds, setProcessingIds] = useState<string[]>([])
    const [refreshing, setRefreshing] = useState(false)
    const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null)
    const [modalOpen, setModalOpen] = useState(false) // for incident details modal
    const [acknowledgeModalOpen, setAcknowledgeModalOpen] = useState(false)
    const [incidentToAcknowledge, setIncidentToAcknowledge] = useState<{
        id: string
        websiteId: number
        url: string
    } | null>(null)
    const [acknowledgeCounter, setAcknowledgeCounter] = useState(0)

    useEffect(() => {
        fetchIncidents()
    }, [filter, acknowledgeCounter]) // bcz incident detail modal shows outdated data

    const fetchIncidents = async () => {
        try {
            setLoading(true)
            const response = await axios.get(`/api/incidents?status=${filter}`)
            // Group incidents by websiteId
            const groupedIncidents = groupIncidentsByWebsite(response?.data?.incidents)
            setIncidents(groupedIncidents)
        } catch (error) {
            console.error("Failed to fetch incidents:", error)
            toast.error("Failed to load incidents", {
                style: {
                    borderRadius: "10px",
                    background: "rgba(170, 50, 60, 0.9)",
                    color: "#fff",
                    backdropFilter: "blur(10px)",
                },
            })
        } finally {
            setLoading(false)
        }
    }
    // Function to group incidents by websiteId
    const groupIncidentsByWebsite = (incidents: Incident[]): Incident[] => {
        const groupedMap = new Map<number, Incident>()
    
        incidents.forEach((incident) => {
            if (!groupedMap.has(incident.websiteId)) {
                const modifiedIncident = {
                    ...incident,
                    regions: [incident.region],
                    originalIncidents: [incident],
                }
                groupedMap.set(incident.websiteId, modifiedIncident)
            } else {
                const existingIncident = groupedMap.get(incident.websiteId)!
                
                existingIncident.regions = existingIncident.regions ? 
                    [...existingIncident.regions, incident.region] : 
                    [incident.region]
                
                existingIncident.originalIncidents = existingIncident.originalIncidents ? 
                    [...existingIncident.originalIncidents, incident] : 
                    [incident]
    
                if (new Date(incident.startTime) > new Date(existingIncident.startTime)) {
                    existingIncident.startTime = incident.startTime
                }
    
                if (!existingIncident.isResolved && incident.isResolved) {
                    existingIncident.isResolved = false
                }
            }
        })
    
        return Array.from(groupedMap.values())
    }

    const handleRefresh = async () => {
        setRefreshing(true)
        await fetchIncidents()
        setRefreshing(false)
    }

    const openAcknowledgeModal = (incidentId: string, websiteId: number, websiteUrl: string) => {
        setIncidentToAcknowledge({ id: incidentId, websiteId, url: websiteUrl })
        setAcknowledgeModalOpen(true)
      }

    const handleAcknowledge = async (ackIncidentId: string | null, ackWebsiteId: number | null) => {
        // When called from modal, use the direct parameters
        let incidentId = ackIncidentId;
        let websiteId = ackWebsiteId;
        
        // When called from acknowledge confirmation modal, use the stored incident
        if (!incidentId && !websiteId) {
            if (!incidentToAcknowledge) return;
            incidentId = incidentToAcknowledge.id;
            websiteId = incidentToAcknowledge.websiteId;
        }
        
        try {
            setProcessingIds((prev) => [...prev, incidentId!]);

            // Find the incident
            const incident = incidents.find((inc) => inc.id === incidentId)

            // If it has original incidents, acknowledge all of them
            if (incident?.originalIncidents?.length) {
                // Create an array of promises for each original incident
                const acknowledgePromises = incident.originalIncidents.map((originalIncident) =>
                    axios.put("/api/incidents", {
                        incidentId: originalIncident.id,
                        websiteId,
                    }),
                )

                // Wait for all acknowledgements to complete
                await Promise.all(acknowledgePromises)
            } else {
                // Fall back to original behavior for single incidents
                await axios.put("/api/incidents", { incidentId, websiteId })
            }

            setIncidents((prev) =>
                prev.map((incident) => (incident.id === incidentId ? { ...incident, isAcknowledged: true } : incident)),
            )
            if (selectedIncident?.id === incidentId) {
                setSelectedIncident((prev) => (prev ? { ...prev, isAcknowledged: true } : null))
            }

            setAcknowledgeModalOpen(false)
            setIncidentToAcknowledge(null)
            
            setAcknowledgeCounter(prev => prev + 1)

            toast.success("Incident acknowledged", {
                style: {
                    borderRadius: "10px",
                    background: "rgba(50, 140, 90, 0.9)",
                    color: "#fff",
                    backdropFilter: "blur(10px)",
                },
            })
        } catch (error) {
            console.error("Failed to acknowledge incident:", error)
            toast.error("Failed to acknowledge incident", {
                style: {
                    borderRadius: "10px",
                    background: "rgba(170, 50, 60, 0.9)",
                    color: "#fff",
                    backdropFilter: "blur(10px)",
                },
            })
        } finally {
            setProcessingIds((prev) => prev.filter((id) => id !== incidentId))
        }
    }

    const openIncidentDetails = (incident: Incident) => {
        // If this is a grouped incident with original incidents, use the first one for details
        // but add the regions information
        if (incident.originalIncidents && incident.originalIncidents.length > 0) {
            const detailIncident = {
                ...incident.originalIncidents[0],
                regions: incident.regions,
                originalIncidents: incident.originalIncidents,
            }
            setSelectedIncident(detailIncident)
        } else {
            setSelectedIncident(incident)
        }
        setModalOpen(true)
    }

    const filteredIncidents = incidents.filter((incident) => {
        if (!searchQuery) return true

        const searchLower = searchQuery.toLowerCase()
        return (
            incident.website.url.toLowerCase().includes(searchLower) ||
            incident.region.toLowerCase().includes(searchLower) ||
            incident.reason.toLowerCase().includes(searchLower)
        )
    })

    function formatDuration(seconds: number | null | undefined): string {
        if (!seconds) return "0s"

        if (seconds < 60) {
            return `${seconds}s`
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

    function formatDate(date: string | Date | null | undefined): string {
        if (!date) return "N/A"
        return new Date(date).toLocaleString()
    }

    function getReasonBadgeColor(reason: string): string {
        const reasonLower = reason.toLowerCase()
        if (reasonLower.includes("down")) {
            return "bg-red-500/20 text-red-400 border-red-500/30"
        } else if (reasonLower.includes("dns")) {
            return "bg-orange-500/20 text-orange-400 border-orange-500/30"
        } else {
            return "bg-zinc-500/20 text-zinc-400 border-zinc-500/30"
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen bg-[#0A0A0B]"
        >
            <SidebarProvider>
                <AppSidebar />
                <SidebarInset className="bg-[#0A0A0B] w-[80%] ml-auto">
                    <div className="w-[90%] mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                            <div>
                                <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-cyan-400 to-purple-400">
                                    Incidents
                                </h1>
                                <p className="text-zinc-400 text-sm">Monitor and manage all system incidents</p>
                            </div>

                            <div className="flex items-center gap-3">
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="border-purple-500/30 bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 hover:text-purple-300"
                                    onClick={handleRefresh}
                                    disabled={refreshing}
                                >
                                    {refreshing ? <RefreshCw className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                                    <span className="ml-2">Refresh</span>
                                </Button>
                            </div>
                        </div>

                        <div className="bg-[#111113] rounded-xl border border-zinc-800/50  mb-8">
                            <div className="p-4 border-b border-zinc-800/50">
                                <div className="flex flex-col md:flex-row gap-4 justify-between">
                                    <div className="relative w-full md:w-64">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                                        <Input
                                            type="search"
                                            placeholder="Search incidents..."
                                            className="pl-10 bg-zinc-900/50 border-zinc-800 text-white focus:border-purple-500/50 focus:ring-purple-500/20"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                        />
                                    </div>

                                    <div className="flex gap-3">
                                        <div className="flex items-center">
                                            <Filter className="h-4 w-4 text-zinc-500 mr-2" />
                                            <Select value={filter} onValueChange={setFilter}>
                                                <SelectTrigger className="w-[180px] bg-zinc-900/50 border-zinc-800 text-white">
                                                    <SelectValue placeholder="Filter by status" />
                                                </SelectTrigger>
                                                <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                                                    <SelectItem value="all" className="text-white focus:bg-zinc-800 focus:text-white">
                                                        All Incidents
                                                    </SelectItem>
                                                    <SelectItem value="resolved" className="text-white focus:bg-zinc-800 focus:text-white">
                                                        Resolved
                                                    </SelectItem>
                                                    <SelectItem value="unresolved" className="text-white focus:bg-zinc-800 focus:text-white">
                                                        Unresolved
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                {loading ? (
                                    <div className="flex justify-center items-center p-12">
                                        <div className="flex flex-col items-center">
                                            <div className="w-10 h-10 border-t-2 border-r-2 border-purple-500 rounded-full animate-spin mb-4"></div>
                                            <p className="text-zinc-400">Loading incidents...</p>
                                        </div>
                                    </div>
                                ) : filteredIncidents.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center p-16">
                                        <div className="w-16 h-16 bg-zinc-800/50 rounded-full flex items-center justify-center mb-4">
                                            <Shield className="h-8 w-8 text-zinc-400" />
                                        </div>
                                        <p className="text-zinc-400 mb-2">No incidents found</p>
                                        <p className="text-zinc-500 text-sm text-center max-w-md">
                                            {filter !== "all"
                                                ? `No ${filter} incidents match your search criteria.`
                                                : "Your systems are running smoothly or no incidents match your search criteria."}
                                        </p>
                                    </div>
                                ) : (
                                    <div className="min-w-full divide-y divide-zinc-800/50">
                                        <div className="bg-zinc-900/30 text-xs uppercase tracking-wider text-zinc-500 grid grid-cols-12 gap-2 px-6 py-3">
                                            <div className="col-span-3 text-center">Website</div>
                                            <div className="col-span-2 text-center">Status</div>
                                            <div className="col-span-3 text-center">Region</div>
                                            <div className="col-span-1 text-center">Duration</div>
                                            <div className="col-span-3 text-center">Actions</div>
                                        </div>

                                        <div className="divide-y divide-zinc-800/50 bg-[#111113]">
                                            <AnimatePresence>
                                                {filteredIncidents.map((incident) => (
                                                    <motion.div
                                                        key={incident.id}
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, height: 0 }}
                                                        transition={{ duration: 0.2 }}
                                                        className="grid grid-cols-12 gap-2 px-6 py-4 hover:bg-zinc-900/30 transition-colors cursor-pointer"
                                                        onClick={() => openIncidentDetails(incident)}
                                                    >
                                                        <div className="col-span-3">
                                                            <div className="flex flex-col items-center">
                                                                <div className="font-medium text-white flex items-center gap-2">
                                                                    <span className="truncate">{incident.website.url.replace(/(^\w+:|^)\/\//, "")}</span>
                                                                    <Badge
                                                                        className="bg-zinc-800 text-zinc-300 hover:bg-zinc-700 cursor-pointer h-5 px-1.5 flex items-center"
                                                                        onClick={(e) => {
                                                                            e.stopPropagation()
                                                                            window.open(incident.website.url, "_blank")
                                                                        }}
                                                                    >
                                                                        <Globe className="h-3 w-3" />
                                                                    </Badge>
                                                                </div>
                                                                <div className="text-xs text-zinc-500 mt-3 flex items-center">
                                                                    <Clock className="h-3 w-3 mr-1" />
                                                                    {formatDate(incident.startTime)}
                                                                </div>
                                                                <div className="mt-2">
                                                                    <Badge className={getReasonBadgeColor(incident.reason)}>{incident.reason}</Badge>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="col-span-2 flex items-center justify-center">
                                                            {incident.isAcknowledged ? (
                                                                <Badge className="bg-yellow-500/10 text-yellow-400 border-yellow-500/20 flex items-center gap-1">
                                                                    <CheckCircle className="h-3 w-3" />
                                                                    Acknowledged
                                                                </Badge>
                                                            ) : incident.isResolved ? (
                                                                <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 flex items-center gap-1">
                                                                    <CheckCircle className="h-3 w-3" />
                                                                    Resolved
                                                                </Badge>
                                                            ) : (
                                                                <Badge className="bg-red-500/10 text-red-400 border-red-500/20 flex items-center gap-1">
                                                                    <XCircle className="h-3 w-3" />
                                                                    Unresolved
                                                                </Badge>
                                                            )}
                                                        </div>

                                                        <div className="col-span-3 flex items-center justify-center">
                                                            <div className="flex flex-wrap gap-2 justify-center">
                                                                {incident.regions ? (
                                                                    <div className="flex flex-row gap-2">
                                                                        {incident.regions.map((region, idx) => (
                                                                            <Badge
                                                                                key={idx}
                                                                                className="bg-purple-500/10 text-purple-400 border-purple-500/20 flex items-center gap-1 w-fit"
                                                                            >
                                                                                <MapPin className="h-3 w-3" />
                                                                                <span className="capitalize">{region}</span>
                                                                            </Badge>
                                                                        ))}
                                                                    </div>
                                                                ) : (
                                                                    <div className="flex items-center text-zinc-300">
                                                                        <MapPin className="h-4 w-4 text-purple-400 mr-2" />
                                                                        <span className="capitalize">{incident.region}</span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>

                                                        <div className="col-span-1 flex items-center justify-center">
                                                            <div className="text-zinc-300">
                                                                {formatDuration(
                                                                    incident.isResolved
                                                                        ? incident.duration
                                                                        : Math.floor(
                                                                            (new Date().getTime() - new Date(incident.startTime).getTime()) / 1000,
                                                                        ),
                                                                )}
                                                            </div>
                                                        </div>

                                                        <div
                                                            className="col-span-3 flex justify-center items-center gap-2"
                                                            onClick={(e) => e.stopPropagation()}
                                                        >
                                                            {!incident.isResolved && (
                                                                <Button
                                                                    size="sm"
                                                                    className={`bg-gradient-to-r ${incident.isAcknowledged
                                                                            ? "from-gray-600 to-gray-500 opacity-70"
                                                                            : "from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600"
                                                                        } text-white`}
                                                                    onClick={(e) => {
                                                                        e.stopPropagation()
                                                                        if (!incident.isAcknowledged) {
                                                                            openAcknowledgeModal(incident.id, incident.websiteId, incident.website.url)
                                                                        }
                                                                    }}
                                                                    disabled={processingIds.includes(incident.id) || incident.isAcknowledged}
                                                                >
                                                                    {processingIds.includes(incident.id) ? (
                                                                        <div className="h-3.5 w-3.5 border-t-2 border-r-2 border-white rounded-full animate-spin mr-1"></div>
                                                                    ) : (
                                                                        <CheckCircle className="h-3.5 w-3.5 mr-1" />
                                                                    )}
                                                                    Acknowledge
                                                                </Button>
                                                            )}
                                                        </div>
                                                    </motion.div>
                                                ))}
                                            </AnimatePresence>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-[#111113] rounded-xl border border-zinc-800/50 p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-medium text-white">Incident Summary</h3>
                                    <AlertTriangle className="h-5 w-5 text-amber-400" />
                                </div>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-zinc-400">Total Incidents</span>
                                        <span className="text-xl font-bold text-white">{incidents.length}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-zinc-400">Resolved</span>
                                        <span className="text-xl font-bold text-emerald-400">
                                            {incidents.filter((i) => i.isResolved).length}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-zinc-400">Unresolved</span>
                                        <span className="text-xl font-bold text-red-400">
                                            {incidents.filter((i) => !i.isResolved).length}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-[#111113] rounded-xl border border-zinc-800/50 p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-medium text-white">Region Distribution</h3>
                                    <MapPin className="h-5 w-5 text-purple-400" />
                                </div>
                                <div className="space-y-4">
                                    {(() => {
                                        const allRegions = new Set<string>()
                                        const regionCounts: Record<string, number> = {}

                                        incidents.forEach((incident) => {
                                            if (incident.regions && incident.regions.length > 0) {
                                                incident.regions.forEach((region) => {
                                                    allRegions.add(region)
                                                    regionCounts[region] = (regionCounts[region] || 0) + 1
                                                })
                                            } else if (incident.region) {
                                                allRegions.add(incident.region)
                                                regionCounts[incident.region] = (regionCounts[incident.region] || 0) + 1
                                            }
                                        })

                                        const totalRegionCount = Object.values(regionCounts).reduce((sum, count) => sum + count, 0)
                                        return Array.from(allRegions)
                                            .sort((a, b) => regionCounts[b] - regionCounts[a])
                                            .map((region) => {
                                                const count = regionCounts[region]
                                                const percentage = Math.round((count / totalRegionCount) * 100) || 0

                                                return (
                                                    <div key={region} className="space-y-1">
                                                        <div className="flex justify-between items-center">
                                                            <span className="text-zinc-400 capitalize">{region}</span>
                                                            <span className="text-sm font-medium text-white">
                                                                {count} ({percentage}%)
                                                            </span>
                                                        </div>
                                                        <div className="w-full bg-zinc-800/50 rounded-full h-1.5">
                                                            <div
                                                                className="bg-gradient-to-r from-purple-500 to-cyan-500 h-1.5 rounded-full"
                                                                style={{ width: `${percentage}%` }}
                                                            ></div>
                                                        </div>
                                                    </div>
                                                )
                                            })
                                    })()}
                                </div>
                            </div>

                            <div className="bg-[#111113] rounded-xl border border-zinc-800/50 p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-medium text-white">Response Time</h3>
                                    <Server className="h-5 w-5 text-cyan-400" />
                                </div>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-zinc-400">Average</span>
                                        <span className="text-xl font-bold text-white">
                                            {incidents.length > 0
                                                ? Math.round(incidents.reduce((acc, i) => acc + i.responseTime, 0) / incidents.length)
                                                : 0}{" "}
                                            ms
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-zinc-400">Fastest</span>
                                        <span className="text-xl font-bold text-emerald-400">
                                            {incidents.length > 0 ? Math.min(...incidents.map((i) => i.responseTime)) : 0} ms
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-zinc-400">Slowest</span>
                                        <span className="text-xl font-bold text-red-400">
                                            {incidents.length > 0 ? Math.max(...incidents.map((i) => i.responseTime)) : 0} ms
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </SidebarInset>
            </SidebarProvider>

            <IncidentDetailsModal
                incident={selectedIncident}
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onAcknowledge={handleAcknowledge}
                isProcessing={selectedIncident ? processingIds.includes(selectedIncident.id) : false}
            />

            {incidentToAcknowledge && (
                <AcknowledgeConfirmationModal
                    isOpen={acknowledgeModalOpen}
                    onClose={() => {
                        setAcknowledgeModalOpen(false)
                        setIncidentToAcknowledge(null)
                    }}
                    onConfirm={() => handleAcknowledge(null, null)}
                    isProcessing={incidentToAcknowledge ? processingIds.includes(incidentToAcknowledge.id) : false}
                    websiteUrl={incidentToAcknowledge.url}
                />
            )}
        </motion.div>
    )
}
