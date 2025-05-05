"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { AppSidebar } from "@/components/Sidebar"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { motion } from "framer-motion"
import axios from "axios"
import { CheckCircle, AlertCircle, Mail } from "lucide-react"
import type { User } from "next-auth"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"

interface Website {
  id: string | number
  url: string
  userId: string | number
  updatedAt: Date
  createdAt: Date
  isPaused?: boolean
}

const ProfileDashboard = () => {
  const { data: session } = useSession()
  const [websites, setWebsites] = useState<Website[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const user: User = session?.user as User

  useEffect(() => {
    const fetchWebsites = async () => {
      try {
        setIsLoading(true)
        const response = await axios.get(`/api/user/get-websites?userId=${user?.id}`)
        setWebsites(response.data.websites || [])
      } catch (error) {
        console.error("Error fetching websites:", error)
      } finally {
        setIsLoading(false)
      }
    }
    if (session?.user?.id) fetchWebsites()
  }, [session, user?.id])

  // Get first name for greeting
  const firstName = user?.name?.split(" ")[0] || "User"

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-[#0A0A0B]"
    >
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <div className="h-full">
            <div className="border-b border-zinc-800/70">
              <div className="max-w-5xl mx-auto px-6 py-4 flex justify-center items-center">
                <Avatar className="h-10 w-10 mr-3">
                  <AvatarImage src={user?.image || ""} />
                  <AvatarFallback className="bg-zinc-800 text-zinc-200">{firstName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-white font-medium">{user?.name}</h2>
                  <div className="flex items-center text-sm text-zinc-400">
                    <Mail className="h-3.5 w-3.5 mr-1.5" />
                    {user?.email}
                  </div>
                </div>
              </div>
            </div>

            <div className="max-w-5xl mx-auto p-6">
              <h1 className="text-xl font-medium text-white mb-6">Profile Dashboard</h1>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-zinc-900/40 rounded-lg border border-zinc-800/50 p-4">
                  <div className="text-sm text-zinc-400 mb-1">Total Websites</div>
                  <div className="text-2xl font-semibold text-white">{websites.length}</div>
                </div>
                <div className="bg-zinc-900/40 rounded-lg border border-zinc-800/50 p-4">
                  <div className="text-sm text-zinc-400 mb-1">Currently Monitoring</div>
                  <div className="text-2xl font-semibold text-green-400">
                    {websites.filter((site) => !site.isPaused).length}
                  </div>
                </div>
                <div className="bg-zinc-900/40 rounded-lg border border-zinc-800/50 p-4">
                  <div className="text-sm text-zinc-400 mb-1">Websites Paused</div>
                  <div className="text-2xl font-semibold text-yellow-400">
                    {websites.filter((site) => site.isPaused).length}
                  </div>
                </div>
              </div>

              <div className="bg-zinc-900/40 rounded-lg border border-zinc-800/50 overflow-hidden">
                <div className="p-4 border-b border-zinc-800/70">
                  <h2 className="text-lg font-medium text-white">Website Status</h2>
                </div>

                {isLoading ? (
                  <div className="p-6 text-center text-zinc-400">
                    <div className="inline-block h-4 w-4 border-2 border-current border-r-transparent rounded-full animate-spin mr-2"></div>
                    Loading...
                  </div>
                ) : websites.length === 0 ? (
                  <div className="p-6 text-center text-zinc-400">No websites added yet.</div>
                ) : (
                  <div>
                    {websites.map((website, index) => (
                      <div key={website.id}>
                        {index > 0 && <Separator className="bg-zinc-800/70" />}
                        <div className="flex items-center justify-between p-4 hover:bg-zinc-800/20 transition-colors">
                          <div className="flex items-center">
                            <div className="mr-3">
                              {website.isPaused ? (
                                <AlertCircle className="h-5 w-5 text-yellow-400" />
                              ) : (
                                <CheckCircle className="h-5 w-5 text-green-400" />
                              )}
                            </div>
                            <div>
                              <div className="text-white font-medium">{website.url.replace(/(^\w+:|^)\/\//, "")}</div>
                              <div className="text-sm text-zinc-400">{website.isPaused ? "Monitoring Paused" : "Actively Monitoring"}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </motion.div>
  )
}

export default ProfileDashboard

