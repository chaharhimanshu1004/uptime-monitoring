import React from "react"
import { Button } from "@/components/ui/button"

interface PauseConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  websiteUrl: string
}

export const PauseConfirmationModal: React.FC<PauseConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  websiteUrl,
}) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-zinc-900 rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold text-white mb-4">Pause Monitor</h2>
        <p className="text-gray-400 mb-6">
          Are you sure you want to pause monitoring for <span className="text-white">{websiteUrl}</span>?
        </p>
        <div className="flex justify-end gap-4">
          <Button variant="outline" onClick={onClose} className="text-gray-400 hover:text-white">
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white hover:opacity-90"
          >
            Pause Monitor
          </Button>
        </div>
      </div>
    </div>
  )
}