"use client"
import { AlertTriangle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"

interface DeleteConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  type: "monitor" | "account"
  itemName?: string 
  isProcessing?: boolean
}

export function DeleteConfirmationModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  type, 
  itemName,
  isProcessing = false,
}: DeleteConfirmationModalProps) {
  if (!isOpen) return null

  const getModalContent = () => {
    switch (type) {
      case "monitor":
        return {
          title: "Delete Monitor",
          description: (
            <>
              Are you sure you want to delete the monitor for{" "}
              <span className="font-medium text-white">{itemName}</span>? This action cannot be undone.
            </>
          ),
          buttonText: "Delete"
        }
      case "account":
        return {
          title: "Delete Account",
          description: "Are you sure you want to permanently delete your account? All your data and monitors will be removed. This action cannot be undone.",
          buttonText: "Delete Account"
        }
      default:
        return {
          title: "Confirm Deletion",
          description: "Are you sure you want to delete this item? This action cannot be undone.",
          buttonText: "Delete"
        }
    }
  }

  const { title, description, buttonText } = getModalContent()

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
              className="w-full max-w-md rounded-xl bg-[#141417] border border-[#232328] p-6 shadow-xl"
            >
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10">
                  <AlertTriangle className="h-6 w-6 text-red-500" />
                </div>
                <h2 className="text-xl font-semibold text-white mb-2">{title}</h2>
                <p className="mb-6 text-gray-400">
                  {description}
                </p>
                <div className="flex w-full gap-3">
                  <Button
                    variant="outline"
                    className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
                    onClick={onClose}
                    disabled={isProcessing}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white"
                    onClick={onConfirm}
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Processing...
                      </span>
                    ) : (
                      buttonText
                    )}
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
