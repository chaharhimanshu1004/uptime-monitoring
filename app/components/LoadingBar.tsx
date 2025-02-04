import { motion } from "framer-motion"
import type React from "react"

interface LoadingBarProps {
  isLoading: boolean
}

export const LoadingBar: React.FC<LoadingBarProps> = ({ isLoading }) => {
  return (
    <motion.div
      className="h-1 w-full bg-zinc-800 fixed top-0 left-0 z-50"
      initial={{ scaleX: 0 }}
      animate={{ scaleX: isLoading ? 1 : 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      <motion.div
        className="h-full bg-gradient-to-r from-fuchsia-500 to-cyan-500"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: isLoading ? 1 : 0 }}
        transition={{ duration: 2, ease: "easeInOut", repeat: Number.POSITIVE_INFINITY }}
      />
    </motion.div>
  )
}
