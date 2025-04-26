"use client"

import type React from "react"
import { useEffect, useState, useRef } from "react"
import { useSession } from "next-auth/react"
import type { User } from "next-auth"
import axios from "axios"
import { MoreHorizontal, Plus, Search, SlidersHorizontal, ExternalLink, Gauge, Pause, Play, Trash2, AlertCircle, Settings, Activity, Radio } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { DeleteConfirmationModal } from "./DeleteConfirmationModal"
import { PauseConfirmationModal } from "./PauseConfirmationModal" 
import toast from "react-hot-toast"
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

interface Website {
  id: string | number
  url: string
  userId?: string | number
  updatedAt?: Date
  createdAt?: Date
  isPaused?: boolean
  isUp: boolean
  isChecking: boolean
  lastCheckedAt?: Date | string | null
  lastDownAt?: Date | string | null
  lastUpAt?: Date | string | null 
  incidentCount?: number
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

export function WebsiteStatusDisplay() {
  const router = useRouter()
  const { data: session } = useSession()
  const user = session?.user as User
  const [websites, setWebsites] = useState<Website[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [websiteToDelete, setWebsiteToDelete] = useState<Website | null>(null)
  // Add state for pause confirmation modal
  const [pauseModalOpen, setPauseModalOpen] = useState(false)
  const [websiteToPause, setWebsiteToPause] = useState<Website | null>(null)
  const [deletingMonitor, setDeletingMonitor] = useState(false)
  const [pausingMonitor, setPausingMonitor] = useState(false)

  const timerRef = useRef<NodeJS.Timeout | null>(null);


  const POLL_MS = 5000 // 5 seconds

  let userId: string | number | undefined = user?.id

  if (userId) {
    userId = typeof userId === "string" ? Number.parseInt(userId) : userId
  }

  useEffect(() => {
    try {
      if (!userId) {
        return
      }
      const fetchWebsites = async () => {
        setIsLoading(true)
        const addedWebsites = await axios.get(`/api/user/get-websites?userId=${userId}`)
        setWebsites(addedWebsites?.data?.websites || [])
        setIsLoading(false)
      }
      fetchWebsites()
    } catch (err) {
      console.log("Error in fetchWebsites", err)
      setIsLoading(false)
    }
  }, [userId])

  useEffect(() => {
    const stillChecking = websites.some(w => w.isChecking);

    if (stillChecking && timerRef.current === null) {
      timerRef.current = setInterval(async () => {
        try {
          const { data } = await axios.get(
            `/api/user/get-websites?userId=${userId}`
          );
          setWebsites(data.websites ?? []);
        } catch (err) {
          console.error("Polling error", err);
        }
      }, POLL_MS);
    }

    if (!stillChecking && timerRef.current !== null) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    return () => {
      if (timerRef.current !== null) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [websites, userId]);


  const handleWebsiteClick = (id: string | number) => {
    router.push(`/monitor/${id}`)
  }

  const handlePauseMonitor = async (e: React.MouseEvent, websiteId: string | number) => {
    e.stopPropagation()
    
    const website = websites.find((w) => w.id === websiteId)
    if (!website) return
    
    if (website.isPaused) {
      try {
        setWebsites((prev) =>
          prev.map((site) => (site.id === websiteId ? { ...site, isPaused: false } : site)),
        )

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
        setWebsites((prev) =>
          prev.map((site) => (site.id === websiteId ? { ...site, isPaused: true } : site)),
        )

        toast.error("Error resuming monitor !", {
          style: {
            borderRadius: "10px",
            background: "rgba(170, 50, 60, 0.9)",
            color: "#fff",
            backdropFilter: "blur(10px)",
          },
        })
      }
    } else {
      setWebsiteToPause(website)
      setPauseModalOpen(true)
    }
  }

  function formatUptimeDuration(timestamp: Date | string | null | undefined): string {
    if (!timestamp) return "Unknown";
    
    const now = new Date();
    const timePoint = new Date(timestamp);
    const diffInSeconds = Math.floor((now.getTime() - timePoint.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return `${diffInSeconds}s`;
    } else if (diffInSeconds < 3600) {
      return `${Math.floor(diffInSeconds / 60)}m`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      const minutes = Math.floor((diffInSeconds % 3600) / 60);
      return `${hours}h ${minutes}m`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days}d`;
    }
  }

  const confirmPause = async () => {
    if (!websiteToPause) return

    try {
      setPausingMonitor(true)
      setWebsites((prev) =>
        prev.map((site) => (site.id === websiteToPause.id ? { ...site, isPaused: true } : site)),
      )

      await axios.post(`/api/user/toggle-monitor`, {
        websiteId: websiteToPause.id,
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
      setWebsites((prev) =>
        prev.map((site) => (site.id === websiteToPause.id ? { ...site, isPaused: false } : site)),
      )

      toast.error("Error pausing monitor, Please Try again!", {
        style: {
          borderRadius: "10px",
          background: "rgba(170, 50, 60, 0.9)",
          color: "#fff",
          backdropFilter: "blur(10px)",
        },
      })
    } finally {
      setPausingMonitor(false)
      closePauseModal()
    }
  }

  const closePauseModal = () => {
    setPauseModalOpen(false)
    setTimeout(() => setWebsiteToPause(null), 300) 
  }

  const openDeleteModal = (e: React.MouseEvent, website: Website) => {
    e.stopPropagation()
    setWebsiteToDelete(website)
    setDeleteModalOpen(true)
  }

  const closeDeleteModal = () => {
    setDeleteModalOpen(false)
    setTimeout(() => setWebsiteToDelete(null), 300) 
  }

  const confirmDelete = async () => {
    if (!websiteToDelete) return

    try {
      setDeletingMonitor(true)
      await axios.delete(`/api/user/delete-website?websiteId=${websiteToDelete.id}`)
      setWebsites((prev) => prev.filter((site) => site.id !== websiteToDelete.id))

      toast.success("Monitor successfully deleted", {
        style: {
          borderRadius: "10px",
          background: "rgba(50, 140, 90, 0.9)",
          color: "#fff",
          backdropFilter: "blur(10px)",
        },
      })
    } catch (error) {
      console.error("Error deleting monitor for websiteId:", websiteToDelete.id, error)

      toast.error("Error, Please try again after sometime!", {
        style: {
          borderRadius: "10px",
          background: "rgba(170, 50, 60, 0.9)",
          color: "#fff",
          backdropFilter: "blur(10px)",
        },
      })
    } finally {
      closeDeleteModal()
      setDeletingMonitor(false)
    }
  }

  const firstName = user?.name?.split(" ")[0] || "User"

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  const statsVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.2,
        duration: 0.5,
      },
    },
  }

  return (
    <div className="h-full flex flex-col bg-[#0A0A0B] text-white p-6">
      {websiteToDelete && (
        <DeleteConfirmationModal
          isOpen={deleteModalOpen}
          onClose={closeDeleteModal}
          onConfirm={confirmDelete}
          type="monitor"
          itemName={websiteToDelete.url?.replace(/(^\w+:|^)\/\//, "") || ""}
          isProcessing={deletingMonitor}
        />
      )}

      {websiteToPause && (
        <PauseConfirmationModal
          isOpen={pauseModalOpen}
          onClose={closePauseModal}
          onConfirm={confirmPause}
          websiteUrl={websiteToPause.url.replace(/(^\w+:|^)\/\//, "")}
          isProcessing={pausingMonitor}
        />
      )}

      <div className="flex items-center justify-between mb-8">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-2xl font-semibold bg-gradient-to-r from-purple-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent"
        >
          Greetings, {firstName}
        </motion.h1>
        <div className="flex items-center gap-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative rounded-xl"
          >
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="search"
              placeholder="Search monitors"
              className="w-64 md:w-80 bg-[#141417]/80 text-white border-0 pl-10 placeholder:text-gray-500 rounded-xl focus:bg-[#141417] transition-colors focus:ring-1 focus:ring-purple-500/50"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Button
              onClick={() => router.push("/add-website")}
              className="bg-gradient-to-r from-fuchsia-500 to-cyan-500 hover:from-fuchsia-600 hover:to-cyan-600 text-white gap-2 rounded-xl shadow-lg shadow-fuchsia-500/20 transition-all duration-300 hover:shadow-cyan-500/20 hover:translate-y-[-2px]"
            >
              Create monitor
              <Plus className="h-4 w-4" />
            </Button>
          </motion.div>
        </div>
      </div>

      <motion.div
        variants={statsVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
      >
        <div className="bg-[#141417]/80 rounded-xl border border-[#232328] backdrop-blur-sm p-6 flex flex-col">
          <div className="text-gray-400 text-sm mb-2">Total Uptime</div>
          <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-fuchsia-400">
            99.9%
          </div>
          <div className="text-gray-400 text-xs mt-1">Last 30 days</div>
        </div>
        <div className="bg-[#141417]/80 rounded-xl border border-[#232328] backdrop-blur-sm p-6 flex flex-col">
          <div className="text-gray-400 text-sm mb-2">Monitoring</div>
          <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
            24/7
          </div>
          <div className="text-gray-400 text-xs mt-1">Continuous checks</div>
        </div>
        <div className="bg-[#141417]/80 rounded-xl border border-[#232328] backdrop-blur-sm p-6 flex flex-col">
          <div className="text-gray-400 text-sm mb-2">Active Monitors</div>
          <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-purple-400">
            {websites.filter((w) => !w.isPaused).length}
          </div>
          <div className="text-gray-400 text-xs mt-1">Of {websites.length} total</div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-[#141417]/80 rounded-xl border border-[#232328] backdrop-blur-sm flex-1 overflow-hidden"
      >
        <div className="p-4 flex items-center justify-between border-b border-[#232328]">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white hover:bg-white/5 rounded-lg">
              <Activity className="h-4 w-4 mr-2 text-purple-400" />
              Monitors
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-white/5 rounded-lg">
              <SlidersHorizontal className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-400 hover:text-white hover:bg-white/5 rounded-lg"
              onClick={() => router.push("/add-website")}
            >
              <Plus className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-white/5 rounded-lg">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center p-12">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 border-t-2 border-r-2 border-purple-500 rounded-full animate-spin mb-4"></div>
              <p className="text-gray-400">Loading monitors...</p>
            </div>
          </div>
        ) : websites.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-16">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500/10 to-cyan-500/10 rounded-full flex items-center justify-center mb-4 border border-purple-500/20">
              <Gauge className="h-8 w-8 text-purple-400" />
            </div>
            <p className="text-gray-400 mb-2">No monitors available</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push("/add-website")}
              className="mt-2 border-purple-500/30 text-purple-400 hover:bg-purple-500/10"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add your first monitor
            </Button>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="divide-y divide-[#232328]"
          >
            {websites.map((website: Website, index: number) => (
              <motion.div
                key={index}
                variants={itemVariants}
                onClick={() => handleWebsiteClick(website.id)}
                className="flex items-center justify-between p-5 hover:bg-white/5 transition-all duration-200 group hover:cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="relative flex items-center justify-center w-3 h-3">
                    {website.isPaused ? (
                      <span className="relative inline-flex w-2 h-2 bg-yellow-500 rounded-full"></span>
                    ) : website.isChecking ? (
                      <>
                        <span
                          className='absolute inline-flex w-full h-full duration-1000 rounded-full opacity-75 animate-ping bg-cyan-400'
                        ></span>
                        <span
                          className='relative inline-flex w-2 h-2 rounded-full bg-cyan-400'
                        ></span>
                      </>
                    ) : (
                      <>
                        <span
                          className={`absolute inline-flex w-full h-full duration-1000 rounded-full opacity-75 animate-ping ${website.isUp ? 'bg-green-400' : 'bg-red-400'
                            }`}
                        ></span>
                        <span
                          className={`relative inline-flex w-2 h-2 rounded-full ${website.isUp ? 'bg-green-500' : 'bg-red-500'
                            }`}
                        ></span>
                      </>
                    )}
                  </div>
                  <div>
                    <div className="font-medium text-gray-100 group-hover:text-white transition-colors">
                      {website.url.replace(/(^\w+:|^)\/\//, "")}
                    </div>
                    <div className="text-sm flex items-center">
                      {website?.isPaused ? (
                        <span className="text-yellow-400">Paused</span>
                      ) : website?.isChecking ? (
                        <span className="text-cyan-500"> Checking... </span>
                      ) : website?.isUp ? (
                        <span className="text-emerald-400">Up • {formatUptimeDuration(website?.lastUpAt)}</span>
                      ) : (
                        <span className="text-red-400">Down • {formatUptimeDuration(website?.lastDownAt)}</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center gap-[.40rem]">
                        <Radio className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-400">3m</span>
                      </div>
                    </TooltipTrigger>

                    <TooltipContent side="top">
                      Website is checked every 3 minutes
                    </TooltipContent>
                  </Tooltip>
                  
                  <div className="flex">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-gray-400 hover:text-white hover:bg-white/5 rounded-lg"
                      onClick={(e) => {
                        e.stopPropagation()
                        window.open(website.url, "_blank")
                      }}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-gray-400 hover:text-white hover:bg-white/5 rounded-lg"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48 bg-zinc-900 border border-zinc-800 text-white">
                        <DropdownMenuItem
                          className="flex items-center gap-2 focus:bg-white/5 focus:text-white cursor-pointer"
                          onClick={(e) => handlePauseMonitor(e, website.id)}
                        >
                          {website.isPaused ? (
                            <>
                              <Play className="h-4 w-4 text-emerald-400" />
                              <span>Resume Monitor</span>
                            </>
                          ) : (
                            <>
                              <Pause className="h-4 w-4 text-yellow-400" />
                              <span>Pause Monitor</span>
                            </>
                          )}
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          className="flex items-center gap-2 focus:bg-white/5 focus:text-white cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation()
                            router.push(`/monitor/${website.id}/settings`)
                          }}
                        >
                          <Settings className="h-4 w-4 text-blue-400" />
                          <span>Monitor Settings</span>
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          className="flex items-center gap-2 focus:bg-white/5 focus:text-white cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation()
                            router.push(`/monitor/${website.id}/alerts`)
                          }}
                        >
                          <AlertCircle className="h-4 w-4 text-purple-400" />
                          <span>Configure Alerts</span>
                        </DropdownMenuItem>

                        <DropdownMenuSeparator className="bg-zinc-800" />

                        <DropdownMenuItem
                          className="flex items-center gap-2 focus:bg-white/5 focus:text-white text-red-400 cursor-pointer"
                          onClick={(e) => openDeleteModal(e, website)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span>Delete Monitor</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}