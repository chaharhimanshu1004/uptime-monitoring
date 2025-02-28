"use client"
import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { HeroHighlight } from "./ui/hero-highlight"
import { motion } from "framer-motion"
import { Input } from "./ui/input"
import { FloatingElements } from "./floating-elements"
import { TrustStats } from "./trust-stats"
import { FeatureHighlights } from "./feature-highlights"
import { Navbar } from "./navbar"

const GetStarted = () => {
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    if (!email) {
      setError("Please enter a valid email.")
      return
    }

    try {
      const response = await fetch("/api/user/get-started", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      if (response.redirected) {
        router.push(response.url)
      } else if (response.ok) {
        const data = await response.json()
        console.log(data)
      } else {
        const errorData = await response.json()
        setError(errorData.errors?.[0] || errorData.error || "An error occurred.")
      }
    } catch (err) {
      console.error(err)
      setError("An error occurred while getting you on board")
    }
  }

  return (
    <HeroHighlight>
      <Navbar />
      <div >
        {/* Add this wrapper with padding-top */}
        <FloatingElements />
        <div className="flex flex-col items-center gap-8 max-w-5xl mx-auto relative z-10">
          {/* Company/Product Name */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-2xl md:text-3xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-cyan-400 to-purple-400 tracking-tight"
          >
            Uptime Monitoring
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl px-4 md:text-4xl lg:text-5xl font-bold text-white max-w-4xl text-center mx-auto leading-tight"
          >
            Always On, Always Watching
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl md:text-2xl text-zinc-200 text-center max-w-2xl mx-auto mb-4 font-medium"
          >
            Your Website Never Sleeps, Neither Do We
          </motion.p>

          {/* Trust Stats */}
          <TrustStats />

          {/* Email Input */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="w-full max-w-md relative group"
          >
            <div className="absolute -inset-0.5 bg-gradient-to-r from-fuchsia-500/30 to-cyan-500/30 rounded-xl blur opacity-50 group-hover:opacity-75 transition duration-1000"></div>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="relative h-14 bg-zinc-900/90 border-0 text-white placeholder:text-zinc-400 rounded-xl focus:ring-2 focus:ring-fuchsia-500/50 focus:outline-none px-4"
              placeholder="Enter your email..."
            />
            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute mt-2 text-sm text-red-400"
              >
                {error}
              </motion.p>
            )}
          </motion.div>

          {/* CTA Button */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            onClick={handleSubmit}
            className="relative inline-flex items-center justify-center h-12 overflow-hidden rounded-xl px-8 transition-all duration-300 bg-gradient-to-r from-fuchsia-500 to-cyan-500 hover:opacity-90"
          >
            <span className="relative flex items-center gap-2 text-white font-medium">
              Get Started
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          </motion.button>

          {/* Feature Highlights */}
          <FeatureHighlights />
        </div>
      </div>
    </HeroHighlight>
  )
}

export default GetStarted

