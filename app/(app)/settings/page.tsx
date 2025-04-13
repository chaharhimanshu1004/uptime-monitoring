"use client"

import { useState, useEffect } from "react"
import { AppSidebar } from "@/components/Sidebar"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Shield, Save, Trash2, ExternalLink, LockIcon, CheckCircle, XCircle } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import toast from "react-hot-toast"

export default function SettingsPage() {
    const { data: session, status, update } = useSession()
    const router = useRouter()

    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [originalName, setOriginalName] = useState("")
    const [email, setEmail] = useState("")
    const [timezone, setTimezone] = useState("(GMT+05:30) Chennai")
    const [isFormChanged, setIsFormChanged] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [isSaving, setIsSaving] = useState(false)

    console.log('>>>status', status)

    useEffect(() => {
        if (status === "authenticated" && session?.user) {
            const firstName = session.user.name?.split(" ")[0] || ""
            const lastName = session.user.name?.split(" ")[1] || ""
            const email = session.user.email || ""

            setFirstName(firstName)
            setLastName(lastName)
            setOriginalName(session.user.name || "")
            setEmail(email)
        }
    }, [session, status])

    const handleInputChange = () => {
        setIsFormChanged(true)
    }

    const handleSaveChanges = async () => {
        setIsSaving(true)

        try {
            const fullName = `${firstName} ${lastName}`.trim()
            if (fullName !== originalName) {
                const response = await fetch('/api/user/update-profile', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        name: fullName,
                    }),
                })

                const data = await response.json()

                if (!response.ok) {
                    throw new Error(data.error || 'Failed to update profile')
                }

                await update({
                    ...session,
                    user: {
                        ...session?.user,
                        name: fullName
                    }
                })

                setOriginalName(fullName)
                toast.success("Profile Updated successfully", {
                    style: {
                        borderRadius: "10px",
                        background: "rgba(50, 140, 90, 0.9)",
                        color: "#fff",
                        backdropFilter: "blur(10px)",
                    },
                })
            } else {
                toast.error("No changes detected", {
                    style: {
                        borderRadius: "10px",
                        background: "rgba(170, 50, 60, 0.9)",
                        color: "#fff",
                        backdropFilter: "blur(10px)",
                    },
                })
            }
        } catch (error) {
            console.error('Error updating profile:', error)
            toast.error("Error updating Profile!", {
                style: {
                    borderRadius: "10px",
                    background: "rgba(170, 50, 60, 0.9)",
                    color: "#fff",
                    backdropFilter: "blur(10px)",
                },
            })
        } finally {
            setIsSaving(false)
            setIsFormChanged(false)
        }
    }

    const handleDeleteAccount = async () => {
        setIsDeleting(true)
        try {
            const response = await fetch('/api/user/delete-account', {
                method: 'DELETE',
            })

            if (!response.ok) {
                const data = await response.json()
                throw new Error(data.error || 'Failed to delete account')
            }

            router.push("/")
        } catch (error) {
            console.error('Error deleting account:', error)
            toast.error("Error Deleting Account!", {
                style: {
                    borderRadius: "10px",
                    background: "rgba(170, 50, 60, 0.9)",
                    color: "#fff",
                    backdropFilter: "blur(10px)",
                },
            })
        } finally {
            setIsDeleting(false)
        }
    }

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((part) => part[0])
            .join("")
            .toUpperCase()
    }

    return (
        <div className="min-h-screen bg-[#0A0A0B]">
            <SidebarProvider>
                <AppSidebar />
                <SidebarInset className="bg-[#0A0A0B] overflow-auto">
                    <div className="max-w-4xl mx-auto p-8 pb-24">
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
                                Update your personal information to keep your account secure and up-to-date.
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
                                            <span className="text-white font-medium">{firstName + " " + lastName}</span>
                                            <br />
                                            {email}
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
                                            <div className="flex items-center mb-2">
                                                <label className="block text-sm text-zinc-400 font-medium mr-2">E-mail</label>
                                                <LockIcon className="h-3 w-3 text-zinc-500" />
                                            </div>
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <div className="relative">
                                                            <Input
                                                                value={email}
                                                                disabled
                                                                className="bg-[#141417] border-zinc-800 text-white h-11 rounded-lg cursor-not-allowed opacity-75"
                                                            />
                                                            <div className="absolute right-3 top-3">
                                                                <LockIcon className="h-4 w-4 text-zinc-500" />
                                                            </div>
                                                        </div>
                                                    </TooltipTrigger>
                                                    <TooltipContent className="bg-zinc-800 text-white border-zinc-700 px-3 py-1.5">
                                                        <p>Primary email cannot be changed</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </div>

                                        <div>
                                            <label className="block text-sm text-zinc-400 mb-2 font-medium">Timezone</label>
                                            <Input
                                                value={timezone}
                                                disabled
                                                className="bg-[#141417] border-zinc-800 text-white h-11 rounded-lg cursor-not-allowed opacity-75"
                                            />
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
                                                href="mailto:uptime.monitoring.dev@gmail.com"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-purple-400 hover:text-purple-300 hover:underline"
                                            >
                                                uptime.monitoring.dev@gmail.com
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
                                        href="mailto:uptime.monitoring.dev@gmail.com"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-purple-400 hover:text-purple-300 hover:underline"
                                    >
                                        uptime.monitoring.dev@gmail.com
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