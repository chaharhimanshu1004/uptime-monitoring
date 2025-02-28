"use client"
import React from "react"
import { useSession } from "next-auth/react"
import type { User } from "next-auth"
import { WebsiteStatusDisplay } from "@/app/components/WebsiteStatusDisplay"
import { AppSidebar } from "@/components/Sidebar"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"

const Page = () => {
  const { data: session } = useSession()
  const user: User = session?.user as User

  return (

    <>
      <div>
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <WebsiteStatusDisplay />
          </SidebarInset>
        </SidebarProvider>
      </div>
    </>
  )
}

export default Page

