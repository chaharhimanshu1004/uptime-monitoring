import { motion } from "framer-motion"

export const TrustStats = () => {
  const stats = [
    { number: "99.9%", label: "Uptime" },
    { number: "24/7", label: "Monitoring" },
    { number: "1M+", label: "Websites" },
  ]

  return (
    <div className="flex justify-center gap-16 md:gap-24">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
          className="text-center"
        >
          <div className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-cyan-400">
            {stat.number}
          </div>
          <div className="text-sm text-zinc-400 mt-2">{stat.label}</div>
        </motion.div>
      ))}
    </div>
  )
}

