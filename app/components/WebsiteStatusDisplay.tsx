"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import type { User } from "next-auth"
import axios from "axios"
import { ChevronDown, MoreHorizontal, Plus, Search, SlidersHorizontal, ExternalLink, Gauge, Pause, Play, Trash2, AlertCircle, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DeleteConfirmationModal } from "./DeleteConfirmationModal"
import toast from "react-hot-toast"

interface Website {
  id: string | number
  url: string
  userId: string | number
  updatedAt: Date
  createdAt: Date
  isPaused?: boolean
}

export function WebsiteStatusDisplay() {
  const router = useRouter()
  const { data: session } = useSession()
  const user = session?.user as User
  const [websites, setWebsites] = useState<Website[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [websiteToDelete, setWebsiteToDelete] = useState<Website | null>(null)

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

  const handleWebsiteClick = (id: string | number) => {
    router.push(`/monitor/${id}`)
  }

  const handlePauseMonitor = async (e: React.MouseEvent, websiteId: string | number) => {
    e.stopPropagation()
    try {

      await axios.post(`/api/user/toggle-monitor`, {
        websiteId,
        action: websites.find((w) => w.id === websiteId)?.isPaused ? "resume" : "pause",
      })

      setWebsites((prev) => prev.map((site) => (site.id === websiteId ? { ...site, isPaused: !site.isPaused } : site)))
      toast.success('Monitor successfully paused',
        {
          style: {
            borderRadius: '4px',
            background: 'rgb(50, 140, 90)',
            color: '#fff',
          }
        }
      );
    } catch (error) {
      console.error("Error toggling monitor:", error)
      setWebsites((prev) => prev.map((site) => (site.id === websiteId ? { ...site, isPaused: !site.isPaused } : site)))
      toast.error('Error, Please try again after sometime !',
        {
          style: {
            borderRadius: '4px',
            background: 'rgb(170, 50, 60)',
            color: '#fff',
          }
        }
      );
    }
  }

  const openDeleteModal = (e: React.MouseEvent, website: Website) => {
    e.stopPropagation()
    setWebsiteToDelete(website)
    setDeleteModalOpen(true)
  }

  const closeDeleteModal = () => {
    setDeleteModalOpen(false)
    setTimeout(() => setWebsiteToDelete(null), 300) // Clear after animation completes
  }

  const confirmDelete = async () => {
    if (!websiteToDelete) return

    try {
      await axios.delete(`/api/user/delete-website?websiteId=${websiteToDelete.id}`)
      setWebsites((prev) => prev.filter((site) => site.id !== websiteToDelete.id))

      toast.success('Monitor successfully deleted',
        {
          style: {
            borderRadius: '4px',
            background: 'rgb(50, 140, 90)',
            color: '#fff',
          }
        }
      );
    } catch (error) {
      console.error("Error deleting monitor for websiteId:", websiteToDelete.id, error)

      toast.error('Error, Please try again after sometime !',
        {
          style: {
            borderRadius: '4px',
            background: 'rgb(170, 50, 60)',
            color: '#fff',
          }
        }
      );
    } finally {
      closeDeleteModal()
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

  return (
    <div className="h-full flex flex-col bg-[#0A0A0B] text-white p-16">
      {websiteToDelete && (
        <DeleteConfirmationModal
          isOpen={deleteModalOpen}
          onClose={closeDeleteModal}
          onConfirm={confirmDelete}
          websiteUrl={websiteToDelete.url.replace(/(^\w+:|^)\/\//, "")}
        />
      )}

      <div className="flex items-center justify-between mb-8">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-2xl font-semibold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent"
        >
          Greetings, {firstName}
        </motion.h1>
        <div className="flex items-center gap-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative rounded-2xl"
          >
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="search"
              placeholder="Search"
              className="w-80 bg-[#141417]/80 text-white border-0 pl-10 placeholder:text-gray-500 rounded-xl focus:bg-[#141417] transition-colors focus:ring-1 focus:ring-purple-500/50"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Button
              onClick={(e) => router.push("/add-website")}
              className="bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] hover:from-[#4338CA] hover:to-[#6D28D9] text-white gap-2 rounded-xl shadow-lg shadow-indigo-500/20 transition-all duration-300 hover:shadow-indigo-500/30 hover:translate-y-[-2px]"
            >
              Create monitor
              <ChevronDown className="h-4 w-4" />
            </Button>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-[#141417]/80 rounded-xl border border-[#232328] backdrop-blur-sm flex-1 overflow-hidden"
      >
        <div className="p-4 flex items-center justify-between border-b border-[#232328]">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white hover:bg-white/5 rounded-lg">
              <ChevronDown className="h-4 w-4 mr-2" />
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
              onClick={(e) => router.push("/add-website")}
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
            <div className="w-16 h-16 bg-zinc-800/50 rounded-full flex items-center justify-center mb-4">
              <Gauge className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-gray-400 mb-2">No monitors available</p>
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => router.push("/add-website")}
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
                    {!website.isPaused ? (
                      <>
                        <span className="absolute inline-flex w-full h-full duration-1000 bg-green-400 rounded-full opacity-75 animate-ping"></span>
                        <span className="relative inline-flex w-2 h-2 bg-green-500 rounded-full"></span>
                      </>
                    ) : (
                      <span className="relative inline-flex w-2 h-2 bg-yellow-500 rounded-full"></span>
                    )}
                  </div>
                  <div>
                    <div className="font-medium text-gray-100 group-hover:text-white transition-colors">
                      {website.url.replace(/(^\w+:|^)\/\//, "")}
                    </div>
                    <div className="text-sm flex items-center">
                      {website.isPaused ? (
                        <span className="text-yellow-400">Paused</span>
                      ) : (
                        <span className="text-emerald-400">Up • 14m</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-500">3m</span>
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
                          onClick={(e) => router.push(`/monitor/${website.id}/settings`)}
                        >
                          <Settings className="h-4 w-4 text-blue-400" />
                          <span>Monitor Settings</span>
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          className="flex items-center gap-2 focus:bg-white/5 focus:text-white cursor-pointer"
                          onClick={(e) => router.push(`/monitor/${website.id}/alerts`)}
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

