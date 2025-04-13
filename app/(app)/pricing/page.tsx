"use client"

import { useState } from "react"
import { AppSidebar } from "@/components/Sidebar"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { Check, CreditCard, Shield, ArrowRight, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"

export default function PricingPage() {
  const [responderLicenses, setResponderLicenses] = useState(1)
  const [selectedPlan, setSelectedPlan] = useState("pay-as-you-go")

  return (
    <div className="min-h-screen bg-[#0A0A0B]">
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="bg-[#0A0A0B] overflow-auto">
          <div className="max-w-4xl mx-auto p-8 pb-24">
            {/* Background effects */}
            <div className="fixed top-0 right-0 w-1/2 h-1/2 bg-purple-600/5 blur-[120px] rounded-full pointer-events-none" />
            <div className="fixed bottom-0 left-0 w-1/2 h-1/2 bg-cyan-600/5 blur-[120px] rounded-full pointer-events-none" />

            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="relative"
            >
              <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-300 mb-2">
                Billing & Subscription
              </h1>
              <p className="text-zinc-400 mb-8">Manage your subscription plan and billing preferences</p>
            </motion.div>

            {/* Current plan info */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="mb-12 relative"
            >
              <div className="bg-[#111113]/80 backdrop-blur-sm border border-zinc-800/50 rounded-xl p-8 shadow-xl shadow-purple-900/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-radial from-purple-600/10 via-transparent to-transparent pointer-events-none" />

                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-600 to-cyan-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-purple-500/20">
                    <Sparkles className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-white mb-2">You are currently on the Free plan</h2>
                    <p className="text-zinc-400 max-w-2xl">
                      Please upgrade your plan to use Pay as you go features. All plans come with a 60-day money-back
                      guarantee.
                    </p>

                    <div className="mt-6 inline-flex items-center gap-2 bg-gradient-to-r from-purple-600/20 to-cyan-500/20 rounded-full px-4 py-1.5 border border-purple-500/30">
                      <Badge className="bg-gradient-to-r from-purple-600 to-cyan-500 text-white border-0">Free</Badge>
                      <span className="text-white">Current Plan</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Responder licenses */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="mb-12 relative"
            >
              <div className="flex items-center mb-4">
                <div className="h-1 w-1 rounded-full bg-purple-500 mr-2"></div>
                <h2 className="text-xl font-semibold text-white">How many responder licenses will you need?</h2>
              </div>
              <p className="text-zinc-400 mb-6">All users are team members by default and are free.</p>

              <div className="bg-[#111113]/80 backdrop-blur-sm border border-zinc-800/50 rounded-xl p-8 shadow-xl shadow-purple-900/5 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-900/5 to-transparent pointer-events-none"></div>

                <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-6">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
                        $29
                      </div>
                      <div className="text-zinc-400 text-sm">per month billed yearly</div>
                    </div>
                    <div className="text-zinc-400 text-sm">
                      Responder is a user that has access to Uptime with incident management, on-call, monitoring and
                      status pages with unlimited phone call and SMS alerts and is billed extra.
                    </div>
                  </div>

                  <div className="w-full md:w-auto">
                    <label className="block text-sm text-zinc-400 mb-2 font-medium">Responder licenses</label>
                    <div className="flex items-center gap-4">
                      <Input
                        type="number"
                        value={responderLicenses}
                        onChange={(e) => setResponderLicenses(Number.parseInt(e.target.value) || 1)}
                        min={1}
                        max={10}
                        className="w-24 bg-[#141417] border-zinc-800 text-white focus:border-purple-500/50 focus:ring-purple-500/20 h-11 rounded-lg"
                      />
                      <div className="flex-1 min-w-[150px]">
                        <Slider
                          value={[responderLicenses]}
                          onValueChange={(value) => setResponderLicenses(value[0])}
                          min={1}
                          max={10}
                          step={1}
                          className="w-full"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 bg-purple-500/10 rounded-lg p-3 border border-purple-500/20">
                  <div className="h-6 w-6 rounded-full bg-purple-500/20 flex items-center justify-center">
                    <Check className="h-3.5 w-3.5 text-purple-400" />
                  </div>
                  <p className="text-purple-300 text-sm">
                    Total: <span className="font-bold">${29 * responderLicenses}</span> per month
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Logs & metrics bundle */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
              className="mb-12 relative"
            >
              <div className="flex items-center mb-4">
                <div className="h-1 w-1 rounded-full bg-cyan-500 mr-2"></div>
                <h2 className="text-xl font-semibold text-white">
                  Do you want to pre-pay for a logs & metrics bundle?
                </h2>
              </div>
              <p className="text-zinc-400 mb-6">
                Reserve data usage now and save. All bundles include 30-day logs retention and 13-month metrics
                retention.
              </p>

              <RadioGroup value={selectedPlan} onValueChange={setSelectedPlan} className="space-y-4">
                <div
                  className={`bg-[#111113]/80 backdrop-blur-sm border ${
                    selectedPlan === "pay-as-you-go" ? "border-purple-500" : "border-zinc-800/50"
                  } rounded-xl p-6 relative transition-all duration-300 hover:border-purple-500/50 shadow-xl shadow-purple-900/5`}
                >
                  <div className="absolute top-4 right-4">
                    {selectedPlan === "pay-as-you-go" && (
                      <div className="h-6 w-6 rounded-full bg-gradient-to-r from-purple-600 to-cyan-500 flex items-center justify-center">
                        <Check className="h-4 w-4 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="flex items-start mb-4">
                    <RadioGroupItem value="pay-as-you-go" id="pay-as-you-go" className="mt-1" />
                    <div className="ml-3">
                      <Label htmlFor="pay-as-you-go" className="text-lg font-semibold text-white">
                        I don't know how much data I need
                      </Label>
                      <p className="text-zinc-400 text-sm">Continue with Pay as you go</p>
                    </div>
                  </div>
                </div>

                <div
                  className={`bg-[#111113]/80 backdrop-blur-sm border ${
                    selectedPlan === "hobby" ? "border-purple-500" : "border-zinc-800/50"
                  } rounded-xl p-6 relative transition-all duration-300 hover:border-purple-500/50 shadow-xl shadow-purple-900/5`}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-900/5 to-transparent pointer-events-none"></div>
                  <div className="absolute top-4 right-4">
                    {selectedPlan === "hobby" && (
                      <div className="h-6 w-6 rounded-full bg-gradient-to-r from-purple-600 to-cyan-500 flex items-center justify-center">
                        <Check className="h-4 w-4 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="flex items-start">
                    <RadioGroupItem value="hobby" id="hobby" className="mt-1" />
                    <div className="ml-3 flex-1">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
                        <div>
                          <Label htmlFor="hobby" className="text-lg font-semibold text-white">
                            Hobby
                          </Label>
                          <div className="flex items-center">
                            <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 mr-2">
                              $25
                            </div>
                            <div className="bg-indigo-900/30 text-indigo-400 text-xs px-2 py-0.5 rounded">19% OFF</div>
                          </div>
                          <p className="text-zinc-400 text-sm">per month billed yearly</p>
                        </div>
                        <div className="flex gap-6">
                          <div className="text-center">
                            <div className="text-xl font-bold text-white">35 GB</div>
                            <p className="text-zinc-400 text-sm">Logs</p>
                          </div>
                          <div className="text-center">
                            <div className="text-xl font-bold text-white">2.5B</div>
                            <p className="text-zinc-400 text-sm">Metrics</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  className={`bg-[#111113]/80 backdrop-blur-sm border ${
                    selectedPlan === "indie" ? "border-purple-500" : "border-zinc-800/50"
                  } rounded-xl p-6 relative transition-all duration-300 hover:border-purple-500/50 shadow-xl shadow-purple-900/5`}
                >
                  <div className="absolute top-4 right-4">
                    {selectedPlan === "indie" && (
                      <div className="h-6 w-6 rounded-full bg-gradient-to-r from-purple-600 to-cyan-500 flex items-center justify-center">
                        <Check className="h-4 w-4 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="flex items-start">
                    <RadioGroupItem value="indie" id="indie" className="mt-1" />
                    <div className="ml-3">
                      <Label htmlFor="indie" className="text-lg font-semibold text-white">
                        Indie hacker
                      </Label>
                      <div className="flex items-center">
                        <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 mr-2">
                          $49
                        </div>
                      </div>
                      <p className="text-zinc-400 text-sm">per month billed yearly</p>
                      <div className="flex gap-6 mt-2">
                        <div className="text-center">
                          <div className="text-xl font-bold text-white">75 GB</div>
                          <p className="text-zinc-400 text-sm">Logs</p>
                        </div>
                        <div className="text-center">
                          <div className="text-xl font-bold text-white">5B</div>
                          <p className="text-zinc-400 text-sm">Metrics</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </RadioGroup>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
              className="flex flex-col md:flex-row justify-between items-center gap-6 relative"
            >
              <div className="bg-[#111113]/80 backdrop-blur-sm border border-zinc-800/50 rounded-xl p-6 shadow-xl shadow-purple-900/5 w-full md:w-auto">
                <h3 className="text-lg font-semibold text-white mb-2">Pay as you go includes:</h3>
                <ul className="text-zinc-400 space-y-2">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-purple-400" />
                    <span>30 GB logs per month retained for 7 days</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-purple-400" />
                    <span>Unlimited metrics with 30-day retention</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-purple-400" />
                    <span>Basic monitoring features</span>
                  </li>
                </ul>
              </div>

              <Button className="bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 text-white border-0 shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30 transition-all duration-300 h-12 px-6 w-full md:w-auto">
                <div className="flex items-center">
                  <CreditCard className="h-4 w-4 mr-2" />
                  <span>Upgrade plan</span>
                  <ArrowRight className="h-4 w-4 ml-2" />
                </div>
              </Button>
            </motion.div>

            {/* Help footer */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.5 }}
              className="mt-16 bg-[#111113]/80 backdrop-blur-sm border border-zinc-800/50 rounded-xl p-6 flex items-center shadow-xl shadow-purple-900/5 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-900/5 to-transparent pointer-events-none"></div>
              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-600 to-cyan-500 flex items-center justify-center mr-4 shadow-lg shadow-purple-500/20">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-white font-medium mb-1">Questions about billing?</h3>
                <p className="text-zinc-400">
                  Contact our support team at{" "}
                  <a
                    href="mailto:hello@betterstack.com"
                    className="text-purple-400 hover:text-purple-300 hover:underline"
                  >
                    hello@betterstack.com
                  </a>
                </p>
              </div>
            </motion.div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}
