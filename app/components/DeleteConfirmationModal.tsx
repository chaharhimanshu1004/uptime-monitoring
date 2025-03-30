"use client"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle} from "@/components/ui/alert-dialog"
import { Trash2 } from "lucide-react"

interface DeleteConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  websiteUrl: string
}

export function DeleteConfirmationModal({ isOpen, onClose, onConfirm, websiteUrl }: DeleteConfirmationModalProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="bg-zinc-900 border border-zinc-800 text-white">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-white">
            <Trash2 className="h-5 w-5 text-red-400" />
            Delete Monitor
          </AlertDialogTitle>
          <AlertDialogDescription className="text-zinc-400">
            Are you sure you want to delete the monitor for{" "}
            <span className="font-medium text-zinc-300">{websiteUrl}</span>?
            <div className="mt-2 p-3 bg-zinc-950/50 rounded-lg border border-zinc-800 text-sm">
              This action cannot be undone. The monitor will be permanently removed from our servers and you will no
              longer receive any alerts for this website.
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="bg-zinc-800 text-white border-zinc-700 hover:bg-zinc-700 hover:text-white">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

