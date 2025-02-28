import type React from "react"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { motion } from "framer-motion"
import { HeroHighlightForFeatureDemo } from "@/components/ui/hero-highlight"

export function FeaturesSectionDemo() {
  const features = [
    {
      title: "Track issues effectively",
      description: "Track and manage your project issues with ease using our intuitive interface.",
      skeleton: <SkeletonOne />,
      className: "col-span-1 lg:col-span-4 border-b lg:border-r border-zinc-800/30",
    },
    {
      title: "Track when website goes down!",
      description: "Capture stunning photos effortlessly using our advanced AI technology.",
      skeleton: <SkeletonTwo />,
      className: "border-b col-span-1 lg:col-span-2 border-zinc-800/30",
    },
  ]

  return (
    <HeroHighlightForFeatureDemo>
      <div className="relative py-10 max-w-7xl mx-auto">
        <div className="px-8">
          <motion.h4
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl lg:text-5xl lg:leading-tight max-w-5xl mx-auto text-center tracking-tight font-medium text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 via-purple-500 to-cyan-500"
          >
            Packed with thousands of features
          </motion.h4>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-sm lg:text-base max-w-2xl my-4 mx-auto text-zinc-400 text-center font-normal"
          >
            From Image generation to video generation, Everything AI has APIs for literally everything. It can even
            create this website copy for you.
          </motion.p>
        </div>

        {/* <div className="relative">
          <div className="grid grid-cols-1 lg:grid-cols-6 mt-12 xl:border rounded-xl border-zinc-800/30 bg-black/20 backdrop-blur-sm">
            {features.map((feature) => (
              <FeatureCard key={feature.title} className={feature.className}>
                <FeatureTitle>{feature.title}</FeatureTitle>
                <FeatureDescription>{feature.description}</FeatureDescription>
                <div className="h-full w-full">{feature.skeleton}</div>
              </FeatureCard>
            ))}
          </div>*/}
        {/* </div>  */}
      </div>
    </HeroHighlightForFeatureDemo>
  )
}

const FeatureCard = ({
  children,
  className,
}: {
  children?: React.ReactNode
  className?: string
}) => {
  return (
    <div
      className={cn(
        `p-4 sm:p-8 relative overflow-hidden transition-colors duration-300
        hover:bg-zinc-800/20`,
        className,
      )}
    >
      {children}
    </div>
  )
}

const FeatureTitle = ({ children }: { children?: React.ReactNode }) => {
  return <p className="text-xl md:text-2xl md:leading-snug tracking-tight text-white font-medium mb-2">{children}</p>
}

const FeatureDescription = ({ children }: { children?: React.ReactNode }) => {
  return <p className="text-sm md:text-base text-zinc-400 mb-6">{children}</p>
}

export const SkeletonOne = () => {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  return (
    <div className="relative flex py-8 px-2 gap-10 h-full">
      <div className="w-full p-5 mx-auto bg-zinc-900/50 shadow-2xl group h-full rounded-xl border border-zinc-800/30 backdrop-blur-sm transition-all duration-300 hover:border-fuchsia-500/30 hover:bg-zinc-900/80">
        <div className="flex flex-1 w-full h-full flex-col space-y-2">
          <Image
            src={`https://res.cloudinary.com/${cloudName}/image/upload/v1727808980/xoiu1nnjhphcwg62tnnv.png`}
            alt="header"
            width={800}
            height={800}
            className="h-full w-full aspect-square object-cover object-left-top rounded-lg transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      </div>

      <div className="absolute bottom-0 z-40 inset-x-0 h-60 bg-gradient-to-t from-black via-black/80 to-transparent w-full pointer-events-none" />
      <div className="absolute top-0 z-40 inset-x-0 h-60 bg-gradient-to-b from-black via-transparent to-transparent w-full pointer-events-none" />
    </div>
  )
}

export const SkeletonTwo = () => {
  const images = [
    "https://images.unsplash.com/photo-1517322048670-4fba75cbbb62?q=80&w=3000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1573790387438-4da905039392?q=80&w=3425&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1555400038-63f5ba517a47?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1554931670-4ebfabf6e7a9?q=80&w=3387&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1546484475-7f7bd55792da?q=80&w=2581&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  ]

  const imageVariants = {
    initial: { scale: 1, rotate: 0 },
    whileHover: {
      scale: 1.1,
      rotate: 0,
      zIndex: 100,
      transition: { duration: 0.2 },
    },
    whileTap: {
      scale: 1.1,
      rotate: 0,
      zIndex: 100,
    },
  }

  return (
    <div className="relative flex flex-col items-start p-8 gap-10 h-full overflow-hidden">
      {[0, 1, 2, 3].map((row, rowIdx) => (
        <div key={rowIdx} className="flex flex-row -ml-20">
          {images.map((image, idx) => (
            <motion.div
              initial="initial"
              variants={imageVariants}
              key={`row-${rowIdx}-image-${idx}`}
              style={{
                rotate: Math.random() * 20 - 10,
              }}
              whileHover="whileHover"
              whileTap="whileTap"
              className="rounded-xl -mr-4 mt-4 p-1 bg-zinc-900/50 border-zinc-800/30 border backdrop-blur-sm flex-shrink-0 overflow-hidden
                       hover:border-fuchsia-500/30 transition-colors duration-300"
            >
              <Image
                src={image || "/placeholder.svg"}
                alt="bali images"
                width="500"
                height="500"
                className="rounded-lg h-20 w-20 md:h-40 md:w-40 object-cover flex-shrink-0"
              />
            </motion.div>
          ))}
        </div>
      ))}

      <div className="absolute left-0 z-[100] inset-y-0 w-20 bg-gradient-to-r from-black to-transparent h-full pointer-events-none" />
      <div className="absolute right-0 z-[100] inset-y-0 w-20 bg-gradient-to-l from-black to-transparent h-full pointer-events-none" />
    </div>
  )
}

