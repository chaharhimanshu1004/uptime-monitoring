"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { AppSidebar } from "@/components/Sidebar"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { motion } from "framer-motion"
import axios from "axios"
import { Gauge, CheckCircle, AlertCircle } from "lucide-react"
import type { User } from "next-auth"

const ProfileDashboard = () => {
  const { data: session } = useSession()
  const [websites, setWebsites] = useState([])
  const [isLoading, setIsLoading] = useState(true);

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
  }, [session])

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0B] to-[#141417] text-white">
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <div className="p-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-8"
            >
              <h1 className="text-5xl font-extrabold bg-gradient-to-r from-purple-400 via-cyan-400 to-purple-400 text-transparent bg-clip-text">
                Profile Dashboard
              </h1>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="bg-zinc-900/40 p-6 rounded-2xl border border-zinc-800/50 shadow-lg shadow-purple-500/20">
                  <h2 className="text-xl font-semibold text-zinc-300">Total Websites</h2>
                  <p className="text-4xl font-extrabold mt-2 text-white">{websites.length}</p>
                </div>
                <div className="bg-zinc-900/40 p-6 rounded-2xl border border-zinc-800/50 shadow-lg shadow-green-500/20">
                  <h2 className="text-xl font-semibold text-zinc-300">Websites Up</h2>
                  <p className="text-4xl font-extrabold mt-2 text-green-400">
                    {websites.filter((site) => !site.isPaused).length}
                  </p>
                </div>
                <div className="bg-zinc-900/40 p-6 rounded-2xl border border-zinc-800/50 shadow-lg shadow-yellow-500/20">
                  <h2 className="text-xl font-semibold text-zinc-300">Websites Paused</h2>
                  <p className="text-4xl font-extrabold mt-2 text-yellow-400">
                    {websites.filter((site) => site.isPaused).length}
                  </p>
                </div>
              </div>
              <div className="bg-zinc-900/40 p-8 rounded-2xl border border-zinc-800/50 shadow-lg shadow-indigo-500/20">
                <h2 className="text-3xl font-bold text-zinc-300 mb-6">Website Status</h2>
                {isLoading ? (
                  <p className="text-gray-400">Loading...</p>
                ) : websites.length === 0 ? (
                  <p className="text-gray-400">No websites added yet.</p>
                ) : (
                  <div className="space-y-4">
                    {websites.map((website) => (
                      <div
                        key={website.id}
                        className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-xl hover:bg-zinc-700/50 transition-all duration-300"
                      >
                        <div>
                          <p className="font-medium text-white">
                            {website.url.replace(/(^\w+:|^)\/\//, "")}
                          </p>
                          <p className="text-sm text-gray-400">
                            {website.isPaused ? "Paused" : "Active"}
                          </p>
                        </div>
                        <div>
                          {website.isPaused ? (
                            <AlertCircle className="h-6 w-6 text-yellow-400" />
                          ) : (
                            <CheckCircle className="h-6 w-6 text-green-400" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}

export default ProfileDashboard