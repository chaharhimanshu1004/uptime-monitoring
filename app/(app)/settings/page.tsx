"use client"

import { useState } from "react"
import { AppSidebar } from "@/components/Sidebar"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Shield, Save, Trash2, ExternalLink } from "lucide-react"

export default function SettingsPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [firstName, setFirstName] = useState(session?.user?.name?.split(" ")[0] || "")
  const [lastName, setLastName] = useState(session?.user?.name?.split(" ")[1] || "")
  const [email, setEmail] = useState(session?.user?.email || "")
  const [phone, setPhone] = useState("+1 555 123 4567")
  const [timezone, setTimezone] = useState("(GMT+05:30) Chennai")
  const [isFormChanged, setIsFormChanged] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const handleInputChange = () => {
    setIsFormChanged(true)
  }

  const handleSaveChanges = async () => {
    setIsSaving(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSaving(false)
    setIsFormChanged(false)
  }

  const handleDeleteAccount = async () => {
    setIsDeleting(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsDeleting(false)
    router.push("/")
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  return (
    <div className="min-h-screen bg-[#0A0A0B]">
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="bg-[#0A0A0B] overflow-auto">
          <div className="max-w-4xl mx-auto p-8 pb-24">
            {/* Background effects */}
            <div className="fixed top-0 right-0 w-1/2 h-1/2 bg-purple-600/5 blur-[120px] rounded-full pointer-events-none" />
            <div className="fixed bottom-0 left-0 w-1/2 h-1/2 bg-cyan-600/5 blur-[120px] rounded-full pointer-events-none" />

            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="relative"
            >
              <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-300 mb-2">
                Account settings
              </h1>
              <p className="text-zinc-400 mb-8">Manage your personal information and account preferences</p>
            </motion.div>

            {/* Basic account information */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="mb-12 relative"
            >
              <div className="flex items-center mb-4">
                <div className="h-1 w-1 rounded-full bg-purple-500 mr-2"></div>
                <h2 className="text-xl font-semibold text-white">Basic account information</h2>
              </div>
              <p className="text-zinc-400 mb-6">
                We'll ask you to click a magic link in your email everytime you sign in.
              </p>

              <div className="bg-[#111113]/80 backdrop-blur-sm border border-zinc-800/50 rounded-xl p-8 shadow-xl shadow-purple-900/5">
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="flex-shrink-0 flex flex-col items-center">
                    <Avatar className="h-28 w-28 border-2 border-zinc-800 ring-2 ring-purple-500/20">
                      <AvatarImage src={session?.user?.image || ""} />
                      <AvatarFallback className="bg-gradient-to-r from-purple-600 to-cyan-500 text-white text-2xl font-medium">
                        {getInitials(firstName + " " + lastName)}
                      </AvatarFallback>
                    </Avatar>
                    <p className="text-zinc-400 text-sm mt-4 text-center max-w-[180px]">
                      You can configure your profile picture here or at{" "}
                      <a
                        href="https://gravatar.com"
                        className="text-purple-400 hover:text-purple-300 hover:underline inline-flex items-center"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Gravatar
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </a>
                    </p>
                  </div>

                  <div className="flex-1 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm text-zinc-400 mb-2 font-medium">First name</label>
                        <Input
                          value={firstName}
                          onChange={(e) => {
                            setFirstName(e.target.value)
                            handleInputChange()
                          }}
                          className="bg-[#141417] border-zinc-800 text-white focus:border-purple-500/50 focus:ring-purple-500/20 h-11 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-zinc-400 mb-2 font-medium">Last name</label>
                        <Input
                          value={lastName}
                          onChange={(e) => {
                            setLastName(e.target.value)
                            handleInputChange()
                          }}
                          className="bg-[#141417] border-zinc-800 text-white focus:border-purple-500/50 focus:ring-purple-500/20 h-11 rounded-lg"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm text-zinc-400 mb-2 font-medium">E-mail</label>
                      <Input
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value)
                          handleInputChange()
                        }}
                        className="bg-[#141417] border-zinc-800 text-white focus:border-purple-500/50 focus:ring-purple-500/20 h-11 rounded-lg"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-zinc-400 mb-2 font-medium">Phone</label>
                      <Input
                        value={phone}
                        onChange={(e) => {
                          setPhone(e.target.value)
                          handleInputChange()
                        }}
                        className="bg-[#141417] border-zinc-800 text-white focus:border-purple-500/50 focus:ring-purple-500/20 h-11 rounded-lg"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-zinc-400 mb-2 font-medium">Timezone</label>
                      <Select
                        value={timezone}
                        onValueChange={(value) => {
                          setTimezone(value)
                          handleInputChange()
                        }}
                      >
                        <SelectTrigger className="bg-[#141417] border-zinc-800 text-white focus:ring-purple-500/20 h-11 rounded-lg">
                          <SelectValue placeholder="Select timezone" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#141417]/95 backdrop-blur-md border-zinc-800 text-white">
                          <SelectItem value="(GMT+05:30) Chennai">(GMT+05:30) Chennai</SelectItem>
                          <SelectItem value="(GMT+00:00) London">(GMT+00:00) London</SelectItem>
                          <SelectItem value="(GMT-05:00) New York">(GMT-05:00) New York</SelectItem>
                          <SelectItem value="(GMT-08:00) Los Angeles">(GMT-08:00) Los Angeles</SelectItem>
                          <SelectItem value="(GMT+08:00) Singapore">(GMT+08:00) Singapore</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Permanently remove account */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="mb-12 relative"
            >
              <div className="flex items-center mb-4">
                <div className="h-1 w-1 rounded-full bg-red-500 mr-2"></div>
                <h2 className="text-xl font-semibold text-white">Danger zone</h2>
              </div>

              <div className="bg-[#111113]/80 backdrop-blur-sm border border-zinc-800/50 rounded-xl p-8 shadow-xl shadow-purple-900/5 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-red-900/10 to-transparent pointer-events-none"></div>

                <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Permanently remove your account</h3>
                    <p className="text-zinc-400 max-w-xl">
                      This will permanently delete your account and all associated data. This action cannot be undone.
                      <br />
                      Need help configuring your account?
                      <br />
                      Let us know at{" "}
                      <a
                        href="mailto:hello@betterstack.com"
                        className="text-purple-400 hover:text-purple-300 hover:underline"
                      >
                        hello@betterstack.com
                      </a>
                    </p>
                  </div>
                  <Button
                    className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white border-0 shadow-lg shadow-red-500/10 hover:shadow-red-500/20 transition-all duration-300 min-w-[220px] h-11"
                    onClick={handleDeleteAccount}
                    disabled={isDeleting}
                  >
                    {isDeleting ? (
                      <div className="flex items-center">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Deleting...
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete my account
                      </div>
                    )}
                  </Button>
                </div>
                <div className="flex items-center">
                  <div className="h-5 w-5 rounded-full bg-red-500/20 flex items-center justify-center mr-2">
                    <Trash2 className="h-3 w-3 text-red-400" />
                  </div>
                  <p className="text-red-400 text-sm">Warning: This is a destructive action that cannot be reverted.</p>
                </div>
              </div>
            </motion.div>

            {/* Save changes button */}
            {isFormChanged && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="fixed bottom-8 right-8 z-50"
              >
                <Button
                  className="bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 text-white border-0 shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30 transition-all duration-300 h-12 px-6"
                  onClick={handleSaveChanges}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <div className="flex items-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Saving...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <Save className="h-4 w-4 mr-2" />
                      Save changes
                    </div>
                  )}
                </Button>
              </motion.div>
            )}

            {/* Help footer */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
              className="mt-16 bg-[#111113]/80 backdrop-blur-sm border border-zinc-800/50 rounded-xl p-6 flex items-center shadow-xl shadow-purple-900/5 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-900/5 to-transparent pointer-events-none"></div>
              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-600 to-cyan-500 flex items-center justify-center mr-4 shadow-lg shadow-purple-500/20">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-white font-medium mb-1">Need help?</h3>
                <p className="text-zinc-400">
                  Let us know at{" "}
                  <a
                    href="mailto:hello@betterstack.com"
                    className="text-purple-400 hover:text-purple-300 hover:underline"
                  >
                    hello@betterstack.com
                  </a>
                </p>
              </div>
            </motion.div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}
