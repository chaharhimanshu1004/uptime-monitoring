"use client"

import { useState } from "react"
import { ChevronRight, Globe, AlertCircle, Info } from "lucide-react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"

export default function CreateMonitor() {
  const [websiteUrl, setWebsiteUrl] = useState("")
  const [alertType, setAlertType] = useState("unavailable")

  const handleSubmit = async () => {
    try {
      const response = await fetch("/api/user/add-website", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: websiteUrl }),
      })

      if (!response.ok) {
        throw new Error("Failed to add website")
      }
    } catch (error) {
      console.error("Error adding website:", error)
    }
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Breadcrumb Navigation */}
      <div className="border-b border-zinc-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4 flex items-center space-x-2 text-sm">
            <Link href="/monitors" className="text-zinc-400 hover:text-white flex items-center gap-2 transition-colors">
              <Globe className="w-4 h-4" />
              Monitors
            </Link>
            <ChevronRight className="w-4 h-4 text-zinc-600" />
            <span className="text-white">Create monitor</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <h1 className="text-3xl font-bold text-white">Create monitor</h1>

          <div>
            <h2 className="text-xl font-semibold text-white mb-2">What to monitor</h2>
            <p className="text-zinc-400">
              Configure the target website you want to monitor. You&apos;ll find the advanced configuration below, in
              the advanced settings section.
            </p>
          </div>

          <div className="bg-zinc-900/30 backdrop-blur-sm rounded-xl border border-zinc-800/50 overflow-hidden">
            <div className="p-6 space-y-6">
              {/* Alert Type Selection */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-zinc-400">Alert us when</label>
                    <Info className="w-4 h-4 text-zinc-500" />
                  </div>
                  <Badge className="bg-zinc-800 text-zinc-400 hover:bg-zinc-800">Billable</Badge>
                </div>
                <Select value={alertType} onValueChange={setAlertType}>
                  <SelectTrigger className="w-full bg-black/50 border-zinc-800 text-white focus:ring-0 focus:ring-offset-0">
                    <SelectValue placeholder="Select alert type" />
                  </SelectTrigger>
                  <SelectContent className="bg-black border border-zinc-800">
                    <SelectItem value="unavailable" className="text-white focus:bg-zinc-800 focus:text-white">
                      URL becomes unavailable
                    </SelectItem>
                    <SelectItem value="slow" className="text-white focus:bg-zinc-800 focus:text-white">
                      Response time exceeds threshold
                    </SelectItem>
                    <SelectItem value="status" className="text-white focus:bg-zinc-800 focus:text-white">
                      Status code changes
                    </SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-zinc-500">
                  We recommend the keyword matching method.{" "}
                  <Link href="/upgrade" className="text-purple-400 hover:text-purple-300 underline">
                    Upgrade your account to enable more options
                  </Link>
                  .
                </p>
              </div>

              {/* URL Input */}
              <div className="space-y-2 ">
                <div className="flex items-center gap-2">
                  <label className="text-sm text-zinc-400">URL to monitor</label>
                  <Info className="w-4 h-4 text-zinc-500" />
                </div>
                <div className="relative border border-solid border-zinc-800 rounded-xl">
                  <Input
                    type="url"
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    className="w-full bg-black/50 border-zinc-800 pl-20 text-white focus:ring-0 focus:ring-offset-0 focus-visible:ring-purple-500/50"
                    placeholder="example.com"
                  />
                  <div className="absolute inset-y-0 left-0 flex items-center px-3 pointer-events-none border-r border-zinc-800">
                    <span className="text-sm text-zinc-500">https://</span>
                  </div>
                </div>
                <p className="text-sm text-zinc-500">
                  You can import multiple monitors{" "}
                  <Link href="/import" className="text-purple-400 hover:text-purple-300 underline">
                    here
                  </Link>
                  .
                </p>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <Button
                  onClick={handleSubmit}
                  className="bg-gradient-to-r from-fuchsia-500 to-cyan-500 text-white hover:opacity-90 transition-opacity"
                >
                  Create Monitor
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

