"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ChevronDown } from "lucide-react"

const navItems = [
  {
    title: "Platform",
    href: "#",
    hasDropdown: true,
  },
  {
    title: "Documentation",
    href: "#",
    hasDropdown: false,
  },
  {
    title: "Pricing",
    href: "#",
    hasDropdown: false,
  },
  {
    title: "Community",
    href: "#",
    hasDropdown: true,
  },
  {
    title: "Company",
    href: "#",
    hasDropdown: true,
  },
  {
    title: "Enterprise",
    href: "#",
    hasDropdown: false,
  },
]

export function Navbar() {
  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="fixed top-0 left-0 right-0 z-50 flex"
    >
      <div className="w-full flex">
        <div className="relative w-[130px]">
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />

          <div className="absolute inset-0 bg-gradient-radial from-purple-900/30 via-background to-background" />

          <div className="absolute top-0 left-0 w-full h-full bg-purple-600/10 blur-[50px] rounded-full" />

          <div
            className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[rgba(0,0,0,0)] to-[rgba(24,24,27,0.8)]"
            style={{ maskImage: "linear-gradient(to right, transparent, black)" }}
          />
        </div>

        <div className="flex-1 bg-zinc-900/80 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16 relative">
              <div className="flex-shrink-0">
                <Link href="/" className="flex items-center">
                  <span className="text-xl font-semibold bg-gradient-to-r from-purple-400 via-cyan-400 to-purple-400 text-transparent bg-clip-text">
                    Uptime Monitor
                  </span>
                </Link>
              </div>

              <div className="hidden md:flex items-center space-x-4">
                {navItems.map((item) => (
                  <Link
                    key={item.title}
                    href={item.href}
                    className="group px-3 py-2 text-sm text-zinc-400 hover:text-white transition-colors relative flex items-center gap-1"
                  >
                    {item.title}
                    {item.hasDropdown && (
                      <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
                    )}
                  </Link>
                ))}
              </div>

              <div className="hidden md:flex items-center space-x-4">
                <Link href="/onboarding/sign-in" className="text-sm text-zinc-400 hover:text-white transition-colors">
                  Sign in
                </Link>
                <Link
                  href="/onboarding/sign-up"
                  className="inline-flex items-center justify-center h-8 px-4 text-sm font-medium text-white transition-colors bg-gradient-to-r from-fuchsia-500 to-cyan-500 rounded-lg hover:opacity-90"
                >
                  Sign up
                </Link>
              </div>

              <div
                className="absolute bottom-0 h-px bg-zinc-800/50"
                style={{
                  left: "0",
                  right: "0",
                }}
              />
            </div>
          </div>
        </div>

        <div className="relative w-[130px]">
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />

          <div className="absolute inset-0 bg-gradient-radial from-purple-900/30 via-background to-background" />

          <div className="absolute bottom-0 right-0 w-full h-full bg-cyan-600/10 blur-[50px] rounded-full" />

          <div
            className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[rgba(24,24,27,0.8)] to-[rgba(0,0,0,0)]"
            style={{ maskImage: "linear-gradient(to right, black, transparent)" }}
          />
        </div>
      </div>
    </motion.nav>
  )
}

