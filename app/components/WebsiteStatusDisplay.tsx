import { useEffect, useState } from "react"
import { websiteStatus } from "../hooks/websiteStatus"
import { useSession } from "next-auth/react"
import type { User } from "next-auth"
import axios from "axios"
import { ChevronDown, MoreHorizontal, Plus, Search, SlidersHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from 'next/navigation'

interface Website {
  id: string | number;        
  url: string;        
  userId: string | number;     
  updatedAt: Date;   
  createdAt: Date;    
}

export function WebsiteStatusDisplay() {
  const router = useRouter();
  const { data: session } = useSession()
  const user = session?.user as User
  const [websites, setWebsites] = useState<Website[]>([]);
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
        const addedWebsites = await axios.get(`/api/user/get-websites?userId=${userId}`)
        setWebsites(addedWebsites?.data?.websites || [])
      }
      fetchWebsites()
    } catch (err) {
      console.log("Error in fetchWebsites", err)
    }
  }, [userId]);


  const handleWebsiteClick = (id : string | number) =>{
    router.push(`/monitor/${id}`)
  }
 
  // const statuses = websiteStatus() 
  const firstName = user?.name?.split(" ")[0] || "User";

  return (
    <div className="min-h-screen pt-12 w-full bg-[#0A0A0B] px-16 text-white p-6">
      <div className="flex items-center  justify-between mb-8">
        <h1 className="text-[25px]  font-semibold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
          Greetings, {firstName}
        </h1>
        <div className="flex items-center gap-4">
          <div className="relative rounded-2xl">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="search"
              placeholder="Search"
              className="w-80 bg-[#141417]/80 text-white border-0 pl-10 placeholder:text-gray-500 rounded-xl focus:bg-[#141417] transition-colors"
            />
          </div>
          <Button onClick={(e)=>router.push('/add-website')} className="bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] hover:from-[#4338CA] hover:to-[#6D28D9] text-white gap-2 rounded-xl shadow-lg shadow-indigo-500/20">
            Create monitor
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="bg-[#141417]/80 rounded-xl border border-[#232328] backdrop-blur-sm">
        <div className="p-4 flex items-center justify-between border-b border-[#232328]">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white hover:bg-white/5">
              <ChevronDown className="h-4 w-4 mr-2" />
              Monitors
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-white/5">
              <SlidersHorizontal className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-white/5">
              <Plus className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-white/5">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {websites.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-400">No monitors available</p>
          </div>
        ) : (
          <div className="divide-y divide-[#232328]">
            {websites.map((website: Website, index:any) => (
              <div
                key={index}
                onClick={()=>handleWebsiteClick(website.id)}
                className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors group hover:cursor-pointer"
              >
                <div className="flex items-center gap-3">
                <span className="relative flex items-center justify-center w-3 h-3"><span className="absolute inline-flex w-full h-full duration-1000 bg-green-400 rounded-full opacity-75 animate-ping"></span><span className="relative inline-flex w-2 h-2 bg-green-500 rounded-full"></span></span>
                  <div>
                    <div className="font-medium text-gray-100">{website.url}</div>
                    <div className="text-sm text-emerald-400">Up • 14m</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">3m</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-gray-400 hover:text-white opacity-0 group-hover:opacity-100 hover:bg-white/5"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

