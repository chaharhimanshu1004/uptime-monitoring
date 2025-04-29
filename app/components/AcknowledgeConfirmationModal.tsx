"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { AlertCircle } from "lucide-react"

interface AcknowledgeConfirmationModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    isProcessing: boolean
    websiteUrl: string
}

export function AcknowledgeConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    isProcessing,
    websiteUrl,
}: AcknowledgeConfirmationModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[38rem] bg-zinc-900 font-bold border-zinc-800 text-white">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <AlertCircle className="h-5 w-5 text-amber-400" />
                        Confirm Acknowledgement
                    </DialogTitle>
                    <DialogDescription className="text-zinc-400">
                        You are about to acknowledge an incident for <span className="text-purple-400">{websiteUrl}</span>
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="bg-zinc-800/50 p-4 rounded-lg border border-zinc-700/50">
                        <p className="text-sm text-zinc-300">By acknowledging this incident, you confirm that:</p>
                        <ul className="mt-2 space-y-2 text-sm text-zinc-400">
                            <li className="flex items-start">
                                <span className="mr-2">•</span>
                                <span>You are aware of the issue and are taking appropriate action</span>
                            </li>
                            <li className="flex items-start">
                                <span className="mr-2">•</span>
                                <span>You will no longer receive alert emails for this incident</span>
                            </li>
                            <li className="flex items-start">
                                <span className="mr-2">•</span>
                                <span>The incident will be marked as acknowledged in the system</span>
                            </li>
                        </ul>
                    </div>
                </div>
                <DialogFooter className="flex gap-2 sm:justify-end">
                    <Button
                        variant="outline"
                        className="border-zinc-700 text-zinc-300 hover:text-white hover:bg-zinc-800"
                        onClick={onClose}
                    >
                        Cancel
                    </Button>
                    <Button
                        className="bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 text-white"
                        onClick={onConfirm}
                        disabled={isProcessing}
                    >
                        {isProcessing ? (
                            <div className="h-4 w-4 border-t-2 border-r-2 border-white rounded-full animate-spin mr-2"></div>
                        ) : null}
                        Acknowledge Incident
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
