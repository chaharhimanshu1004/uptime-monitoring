"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Gauge, User2, Settings, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const menuItems = [
  {
    icon: Gauge,
    label: "Dashboard",
    href: "/dashboard",
  },
  {
    icon: User2,
    label: "Profile",
    href: "/profile",
  },
  {
    icon: Settings,
    label: "Settings",
    href: "/settings",
  },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar className="border-r border-white/[0.08] bg-[#121212] backdrop-blur-xl">
      <SidebarHeader className="border-b border-white/[0.08] px-4 py-6">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="rounded-xl bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] hover:from-[#4338CA] hover:to-[#6D28D9] p-2 shadow-lg shadow-indigo-500/20">
            <Gauge className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-semibold text-white">Uptime Monitor</span>
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4">
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href}
                className={cn(
                  "group relative h-11 w-full overflow-hidden rounded-lg px-3 text-zinc-400/90 transition-colors",
                  pathname === item.href
                    ? "text-white bg-gradient-to-r from-[#4F46E5] to-[#7C3AED]"
                    : "hover:text-white hover:bg-gradient-to-r hover:from-[#4338CA] hover:to-[#6D28D9]"
                )}
              >
                <Link href={item.href}>
                  <span className="relative flex items-center gap-3">
                    <item.icon className="h-5 w-5" />
                    {item.label}
                  </span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="px-2 py-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="group relative h-11 w-full overflow-hidden rounded-lg px-3 text-zinc-400/90 transition-colors hover:text-white hover:bg-gradient-to-r hover:from-[#4338CA] hover:to-[#6D28D9]">
              <span className="relative flex items-center gap-3">
                <LogOut className="h-5 w-5" />
                Logout
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
