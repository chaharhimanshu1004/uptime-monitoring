"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, Home } from "lucide-react"
import { HeroHighlight } from "@/components/ui/hero-highlight"
import { FloatingElements } from "@/components/floating-elements"
import { Navbar } from "@/components/navbar"

export default function NotFound() {
  const router = useRouter()

  return (
    <HeroHighlight>
      <div className="relative min-h-[calc(100vh-80px)] flex flex-col items-center justify-center px-4">
        <FloatingElements />
        <motion.div
          className="absolute z-0 w-[500px] h-[500px] bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative z-10 mb-6"
        >
          <h1 className="text-[120px] md:text-[180px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-cyan-400 to-purple-400 leading-none tracking-tight">
            404
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative z-10 text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">Page Not Found</h2>
          <p className="text-lg text-zinc-300 max-w-md mb-10">
            We couldn't find the page you're looking for. It might have been moved or doesn't exist.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="relative z-10 flex flex-col sm:flex-row gap-4"
        >
          <button
            onClick={() => router.back()}
            className="relative inline-flex items-center justify-center h-14 overflow-hidden rounded-xl px-8 transition-all duration-300 bg-zinc-800/50 hover:bg-zinc-800/80 border border-zinc-700/50"
          >
            <span className="relative flex items-center gap-2 text-white font-medium">
              <ArrowLeft className="w-5 h-5" />
              Go Back
            </span>
          </button>

          <Link href="/">
            <button className="relative inline-flex items-center justify-center h-14 overflow-hidden rounded-xl px-8 transition-all duration-300 bg-gradient-to-r from-fuchsia-500 to-cyan-500 hover:opacity-90 shadow-lg shadow-fuchsia-500/20 hover:shadow-cyan-500/20">
              <span className="relative flex items-center gap-2 text-white font-medium">
                <Home className="w-5 h-5" />
                Return Home
              </span>
            </button>
          </Link>
        </motion.div>

        <div className="absolute bottom-10 left-0 right-0 flex justify-center gap-16 opacity-60">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 + i * 0.1 }}
              className="w-16 h-[1px] bg-gradient-to-r from-purple-400 to-cyan-400"
            >
              <motion.div
                className="w-2 h-2 rounded-full bg-cyan-400 -mt-[3px]"
                animate={{
                  x: [0, 64, 0],
                }}
                transition={{
                  duration: 3,
                  delay: i * 1,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "loop",
                  ease: "easeInOut",
                }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </HeroHighlight>
  )
}
