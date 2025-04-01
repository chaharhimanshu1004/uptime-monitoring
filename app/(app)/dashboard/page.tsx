"use client"
import React from "react"
import { useSession } from "next-auth/react"
import type { User } from "next-auth"
import { WebsiteStatusDisplay } from "@/app/components/WebsiteStatusDisplay"
import { AppSidebar } from "@/components/Sidebar"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { motion } from "framer-motion"

const Page = () => {
  const { data: session } = useSession()
  const user: User = session?.user as User

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="h-screen bg-[#0A0A0B] overflow-hidden"
    >
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="bg-[#0A0A0B]">
          <WebsiteStatusDisplay />
        </SidebarInset>
      </SidebarProvider>
    </motion.div>
  )
}

export default Page
