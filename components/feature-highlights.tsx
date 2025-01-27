import { motion } from "framer-motion"
import { Activity, Bell, Shield } from "lucide-react"

export const FeatureHighlights = () => {
  const features = [
    {
      icon: <Activity className="w-5 h-5" />,
      label: "Real-time Monitoring",
    },
    {
      icon: <Bell className="w-5 h-5" />,
      label: "Instant Alerts",
    },
    {
      icon: <Shield className="w-5 h-5" />,
      label: "Advanced Security",
    },
  ]

  return (
    <div className="flex justify-center gap-6 md:gap-12 bg-transparent">
      {features.map((feature, index) => (
        <motion.div
          key={feature.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
          className="flex items-center gap-3 text-zinc-400"
        >
          {feature.icon}
          <span className="text-base font-medium">{feature.label}</span>
        </motion.div>
      ))}
    </div>
  )
}

