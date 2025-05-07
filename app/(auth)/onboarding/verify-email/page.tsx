"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { useRouter } from "next/navigation"
import { Gauge, CheckCircle2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import toast from "react-hot-toast"
import { motion } from "framer-motion"
import { useSession } from "next-auth/react"

export default function VerifyEmailPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const email = searchParams.get("email")
  const { data: session, update } = useSession() // Add this line

  if (!email) {
    toast.error("Error in signing you up", {
      style: {
        borderRadius: "10px",
        background: "rgba(170, 50, 60, 0.9)",
        color: "#fff",
        backdropFilter: "blur(10px)",
      },
    })
    router.push('/');
    return;
  }

  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [error, setError] = useState("")
  const [message, setMessage] = useState("An OTP has been sent to your email. Please verify.")
  const [isVerifying, setIsVerifying] = useState(false)
  const [isVerified, setIsVerified] = useState(false)

  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const setInputRef = (index: number) => {
    return (el: HTMLInputElement | null) => {
      inputRefs.current[index] = el;
    };
  };

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus()
    }
  }, [])

  const handleInputChange = (index: number, value: string) => {
    if (value && !/^\d+$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value.slice(-1)
    setOtp(newOtp)

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }

    setError("")
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus()
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus()
    } else if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text")

    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split("")
      setOtp(digits)
      inputRefs.current[5]?.focus()
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const otpString = otp.join("")

    if (otpString.length !== 6 || isNaN(Number(otpString))) {
      setError("Please enter a valid 6-digit OTP.")
      return
    }

    setIsVerifying(true)

    try {
      const result = await fetch("/api/user/verify-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, code: otpString }),
      })

      if (result.ok) {
        setIsVerified(true)
        setMessage("Email verified successfully!")
        setError("")
        await update({
          ...session,
          user: {
            ...session?.user,
            isVerified: true
          }
        })

        setTimeout(() => {
          router.push("/dashboard")
        }, 1500)
      } else {
        throw new Error("Verification failed")
      }
    } catch (e) {
      setError("Invalid OTP. Please try again.")
    } finally {
      setIsVerifying(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen text-white">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="inline-block p-3 rounded-2xl bg-gradient-to-br from-purple-600 to-cyan-500">
            <Gauge className="w-9 h-9 text-white" />
          </div>
          <h2 className="mt-4 text-3xl font-bold">Verify your email</h2>
          <p className="mt-6 text-sm text-zinc-400">
            {email ? `We've sent a code to ${email}` : "Check your email for the verification code"}
          </p>
        </div>

        <div className="mt-6">
          {isVerified ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#141417]/50 border border-green-500/20 rounded-lg p-6 text-center"
            >
              <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-white mb-2">Email Verified!</h3>
              <p className="text-zinc-400">Redirecting you to the dashboard...</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-3">Enter verification code</label>
                <div className="flex gap-2 justify-between">
                {otp.map((digit, index) => (
                  <Input
                    key={index}
                    ref={setInputRef(index)}
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    pattern="\d{1}"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleInputChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={index === 0 ? handlePaste : undefined}
                    className="w-12 h-12 text-center text-lg font-medium bg-[#141417] border-zinc-700 focus:border-purple-500 focus:ring-purple-500"
                  />
                ))}
                </div>

                {error && (
                  <div className="mt-3 flex items-center gap-2 text-red-400 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    <span>{error}</span>
                  </div>
                )}
              </div>

              <Button
                type="submit"
                disabled={isVerifying || otp.some((digit) => !digit)}
                className="w-full bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
              >
                {isVerifying ? (
                  <div className="w-5 h-5 border-4 border-t-transparent border-white rounded-full animate-spin"></div>
                ) : (
                  "Verify Email"
                )}
              </Button>

              <div className="text-center">
                <p className="text-sm text-zinc-400">
                  Didn't receive a code?{" "}
                  <button
                    type="button"
                    className="font-medium text-purple-500 hover:text-purple-400"
                    onClick={() => {
                      toast.success("A new verification code has been sent", {
                        style: {
                          borderRadius: "10px",
                          background: "rgba(50, 140, 90, 0.9)",
                          color: "#fff",
                          backdropFilter: "blur(10px)",
                        },
                      })
                    }}
                  >
                    Resend
                  </button>
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
