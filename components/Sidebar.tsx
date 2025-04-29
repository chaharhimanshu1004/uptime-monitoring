"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Gauge, User2, Settings, LogOut, CreditCard, Gem, CircleAlert } from "lucide-react"
import { cn } from "@/lib/utils"
import { signOut, useSession } from "next-auth/react"
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

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
    icon: CircleAlert,
    label: "Incidents",
    href: "/incidents",
  },
  {
    icon: Gem,
    label: "Billing",
    href: "/billing",
  },
  {
    icon: Settings,
    label: "Settings",
    href: "/settings",
  }
]

export function AppSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { data: session } = useSession()
  const user = session?.user

  const handleLogout = async () => {
    await signOut({ redirect: false })
    router.replace("/")
  }

  const getInitials = (name: string) => {
    if (!name) return "U"
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  return (
    <Sidebar className="border-r border-purple-500/10 bg-[#0A0A0B] backdrop-blur-xl">
      <SidebarHeader className="border-b border-purple-500/10 px-4 py-6">
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
                    : "hover:text-white hover:bg-gradient-to-r hover:from-[#4338CA]/20 hover:to-[#6D28D9]/20",
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

      <SidebarFooter className="px-2 py-4 border-t border-purple-500/10">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-zinc-400/90 hover:text-white hover:bg-gradient-to-r hover:from-[#4338CA]/20 hover:to-[#6D28D9]/20 transition-colors">
              <Avatar className="h-8 w-8 border border-purple-500/20">
                <AvatarImage src={user?.image || ""} alt={user?.name || "User"} />
                <AvatarFallback className="bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white">
                  {user?.name ? getInitials(user.name) : "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start">
                <span className="text-sm font-medium text-white">{user?.name || "User"}</span>
                <span className="text-xs text-zinc-500 truncate max-w-[120px]">{user?.email || ""}</span>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-56 bg-zinc-900/70 backdrop-blur-sm border border-zinc-700 text-zinc-200 p-2 shadow-lg shadow-black/20"
          >
            <DropdownMenuItem
              className="h-11 px-3 py-2 flex items-center gap-3 hover:bg-gradient-to-r hover:from-purple-500/10 hover:to-purple-400/5 focus:bg-gradient-to-r focus:from-purple-500/10 focus:to-purple-400/5 cursor-pointer rounded-md transition-all duration-200"
              onClick={() => router.push("/settings")}
            >
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-purple-500/10">
                <Settings className="h-4 w-4 text-purple-400" />
              </div>
              <span className="font-medium">Settings</span>
            </DropdownMenuItem>

            <DropdownMenuItem
              className="h-11 px-3 py-2 mt-1 flex items-center gap-3 hover:bg-gradient-to-r hover:from-cyan-500/10 hover:to-cyan-400/5 focus:bg-gradient-to-r focus:from-cyan-500/10 focus:to-cyan-400/5 cursor-pointer rounded-md transition-all duration-200"
              onClick={() => router.push("/billing")}
            >
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-cyan-500/10">
                <CreditCard className="h-4 w-4 text-cyan-400" />
              </div>
              <span className="font-medium">Billing</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator className="bg-purple-500/10 my-2" />

            <DropdownMenuItem
              className="h-11 px-3 py-2 flex items-center gap-3 hover:bg-gradient-to-r hover:from-red-500/10 hover:to-red-400/5 focus:bg-gradient-to-r focus:from-red-500/10 focus:to-red-400/5 text-red-400 cursor-pointer rounded-md transition-all duration-200"
              onClick={handleLogout}
            >
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-red-500/10">
                <LogOut className="h-4 w-4 text-red-400" />
              </div>
              <span className="font-medium">Sign out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  )
}

