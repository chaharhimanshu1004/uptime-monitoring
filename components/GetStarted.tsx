"use client"
import { useRouter } from "next/navigation"
import { HeroHighlight } from "./ui/hero-highlight"
import { motion } from "framer-motion"
import { FloatingElements } from "./floating-elements"
import { TrustStats } from "./trust-stats"
import { FeatureHighlights } from "./feature-highlights"
import { Navbar } from "./navbar"

const GetStarted = () => {
  const router = useRouter()

  const handleGetStarted = () => {
    router.push("onboarding/sign-up")
  }

  return (
    <HeroHighlight>
      <Navbar />
      <div>
        <FloatingElements />
        <div className="flex flex-col items-center gap-8 max-w-5xl mx-auto relative z-10 pt-24 md:pt-32 lg:pt-36">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-cyan-400 to-purple-400 tracking-tight"
          >
            Uptime Monitoring
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl px-4 md:text-4xl lg:text-5xl font-bold text-white max-w-4xl text-center mx-auto leading-tight"
          >
            Always On, Always Watching
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl md:text-2xl text-zinc-200 text-center max-w-2xl mx-auto mb-4 font-medium"
          >
            Your Website Never Sleeps, Neither Do We
          </motion.p>

          <TrustStats />

          <div className="mt-[12px] mb-[10px]">

            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              onClick={handleGetStarted}
              className="relative inline-flex items-center justify-center h-14 overflow-hidden rounded-xl px-10 transition-all duration-300 bg-gradient-to-r from-fuchsia-500 to-cyan-500 hover:opacity-90 shadow-lg shadow-fuchsia-500/20 hover:shadow-cyan-500/20"
            >
              <span className="relative flex items-center gap-2 text-white font-medium text-lg">
                Get Started
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </motion.button>
          </div>

          <FeatureHighlights />
        </div>
      </div>
    </HeroHighlight>
  )
}

export default GetStarted

