"use client"
import { motion, AnimatePresence } from "framer-motion"
import { AlertTriangle, CheckCircle, Clock, Globe, MapPin, Server, X, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface Incident {
  id: string
  websiteId: number
  startTime: string | Date
  endTime?: string | Date | null
  isResolved: boolean
  responseTime: number
  duration?: number | null
  region: string
  reason: string
  website: {
    url: string
  }
}

interface IncidentDetailsModalProps {
  incident: Incident | null
  isOpen: boolean
  onClose: () => void
  onAcknowledge: (id: string) => void
  isProcessing: boolean
}

export function IncidentDetailsModal({
  incident,
  isOpen,
  onClose,
  onAcknowledge,
  isProcessing,
}: IncidentDetailsModalProps) {
  if (!incident) return null

  function formatDuration(seconds: number | null | undefined): string {
    if (!seconds) return "0s"

    if (seconds < 60) {
      return `${seconds}s`
    } else if (seconds < 3600) {
      const minutes = Math.floor(seconds / 60)
      const remainingSeconds = seconds % 60
      return `${minutes}m ${remainingSeconds}s`
    } else {
      const hours = Math.floor(seconds / 3600)
      const minutes = Math.floor((seconds % 3600) / 60)
      return `${hours}h ${minutes}m`
    }
  }

  function formatDate(date: string | Date | null | undefined): string {
    if (!date) return "N/A"
    return new Date(date).toLocaleString()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className="w-full max-w-2xl rounded-xl bg-[#141417] border border-[#232328] p-6 shadow-xl"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center">
                  {incident.isResolved ? (
                    <div className="h-10 w-10 rounded-full bg-emerald-500/10 flex items-center justify-center mr-4">
                      <CheckCircle className="h-5 w-5 text-emerald-400" />
                    </div>
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-red-500/10 flex items-center justify-center mr-4">
                      <AlertTriangle className="h-5 w-5 text-red-400" />
                    </div>
                  )}
                  <div>
                    <h2 className="text-xl font-semibold text-white">Incident Details</h2>
                    <p className="text-zinc-400 text-sm">{incident.website.url.replace(/(^\w+:|^)\/\//, "")}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-zinc-400 hover:text-white hover:bg-zinc-800"
                  onClick={onClose}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-zinc-500 mb-1">Status</div>
                    <div>
                      {incident.isResolved ? (
                        <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 flex items-center gap-1">
                          <CheckCircle className="h-3 w-3" />
                          Resolved
                        </Badge>
                      ) : (
                        <Badge className="bg-red-500/10 text-red-400 border-red-500/20 flex items-center gap-1">
                          <XCircle className="h-3 w-3" />
                          Unresolved
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-zinc-500 mb-1">Region</div>
                    <div className="flex items-center text-zinc-300">
                      <MapPin className="h-4 w-4 text-purple-400 mr-2" />
                      <span className="capitalize">{incident.region}</span>
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-zinc-500 mb-1">Response Time</div>
                    <div className="flex items-center text-zinc-300">
                      <Server className="h-4 w-4 text-cyan-400 mr-2" />
                      <span>{incident.responseTime} ms</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-zinc-500 mb-1">Start Time</div>
                    <div className="flex items-center text-zinc-300">
                      <Clock className="h-4 w-4 text-blue-400 mr-2" />
                      <span>{formatDate(incident.startTime)}</span>
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-zinc-500 mb-1">End Time</div>
                    <div className="flex items-center text-zinc-300">
                      <Clock className="h-4 w-4 text-blue-400 mr-2" />
                      <span>{incident.endTime ? formatDate(incident.endTime) : "Ongoing"}</span>
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-zinc-500 mb-1">Duration</div>
                    <div className="flex items-center text-zinc-300">
                      <Clock className="h-4 w-4 text-amber-400 mr-2" />
                      <span>{formatDuration(incident.duration)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <div className="text-sm text-zinc-500 mb-1">Reason</div>
                <div className="bg-zinc-900/50 rounded-lg p-3 border border-zinc-800/50 text-zinc-300">
                  {incident.reason}
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  className="border-zinc-700 text-zinc-300 hover:text-white hover:bg-zinc-800"
                  onClick={() => window.open(incident.website.url, "_blank")}
                >
                  <Globe className="h-4 w-4 mr-2" />
                  Visit Website
                </Button>

                {!incident.isResolved && (
                  <Button
                    className="bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 text-white"
                    onClick={() => onAcknowledge(incident.id)}
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <div className="h-4 w-4 border-t-2 border-r-2 border-white rounded-full animate-spin mr-2"></div>
                    ) : (
                      <CheckCircle className="h-4 w-4 mr-2" />
                    )}
                    Acknowledge Incident
                  </Button>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
