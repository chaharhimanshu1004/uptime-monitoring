"use client"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import type React from "react"
import { Input } from "./input"

// export const HeroHighlight = ({
//   children,
//   className,
//   containerClassName,
// }: {
//   children: React.ReactNode
//   className?: string
//   containerClassName?: string
// }) => {
//   return (
//     <div
//       className={cn(
//         "relative h-[40rem] flex pt-[10%]  bg-white dark:bg-black justify-center w-full",
//         containerClassName,
//       )}
//     >
//       <div className="absolute inset-0 bg-dot-thick-neutral-300 dark:bg-dot-thick-neutral-800 pointer-events-none" />
      
//       <div className={cn("relative z-20", className)}>{children}</div>
//     </div>
//   )
// }
export const HeroHighlight = ({
  children,
  className,
  containerClassName,
}: {
  children: React.ReactNode
  className?: string
  containerClassName?: string
}) => {
  return (
    <div
      className={cn(
        "relative min-h-[100vh] flex items-center justify-center w-full bg-black",
        containerClassName
      )}
    >
      {/* More visible dotted background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#333_1.5px,transparent_1.5px)] [background-size:24px_24px] opacity-60" />
      
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/40" />
      
      {/* Ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[200px] w-[600px] bg-fuchsia-500/20 blur-[120px] rounded-full" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[200px] w-[600px] bg-cyan-500/20 blur-[120px] rounded-full" />

      <div className={cn("relative z-20 px-6", className)}>{children}</div>
    </div>
  )
}

export const HeroHighlightForFeatureDemo = ({
  children,
  className,
  containerClassName,
}: {
  children: React.ReactNode
  className?: string
  containerClassName?: string
}) => {
  return (
    <div
      className={cn(
        "relative min-h-[100vh] flex items-center justify-center w-full bg-black",
        containerClassName
      )}
    >
      {/* More visible dotted background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#333_2px,transparent_2px)] [background-size:24px_24px] opacity-60" />
      
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/40" />
      
      {/* Ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[200px] w-[600px] bg-fuchsia-500/20 blur-[120px] rounded-full" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[200px] w-[600px] bg-cyan-500/20 blur-[120px] rounded-full" />

      <div className={cn("relative z-20 px-6", className)}>{children}</div>
    </div>
  )
}

export const Highlight = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => {
  return (
    <motion.span
      initial={{
        backgroundSize: "0% 100%",
      }}
      animate={{
        backgroundSize: "100% 100%",
      }}
      transition={{
        duration: 2,
        ease: "linear",
        delay: 0.5,
      }}
      style={{
        backgroundRepeat: "no-repeat",
        backgroundPosition: "left center",
        display: "inline",
      }}
      className={cn(
        `relative inline-block pb-1 px-1 rounded-lg bg-gradient-to-r from-indigo-300 to-purple-300 dark:from-indigo-500 dark:to-purple-500`,
        className,
      )}
    >
      {children}
    </motion.span>
  )
}


