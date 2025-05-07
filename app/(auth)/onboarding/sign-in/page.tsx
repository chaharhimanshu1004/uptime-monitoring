"use client"

import type React from "react"

import { signIn } from "next-auth/react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Gauge } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import toast from "react-hot-toast"

export default function SignInPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [showGoogleReminder, setShowGoogleReminder] = useState(false)
  const [loadingSignIn, setLoadingSignIn] = useState(false) 
  const [loadingGoogle, setLoadingGoogle] = useState(false) 
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoadingSignIn(true)
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: email,
        password: password,
      })
      if (result?.error) {
        setError(result.error)
        if (
          result.error.includes("Invalid credentials") ||
          result.error.includes("Invalid Password") ||
          result.error.includes("No user found")
        ) {
          setShowGoogleReminder(true)
        }
        return
      }
      if (result?.url) {
        router.replace("/dashboard")
      }
    } catch (err) {
      console.log('Error occurred while signing you in!', err);
      toast.error("Error signing you in, Please try again!", {
        style: {
          borderRadius: "10px",
          background: "rgba(170, 50, 60, 0.9)",
          color: "#fff",
          backdropFilter: "blur(10px)",
        },
      })
    } finally {
      setLoadingSignIn(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setLoadingGoogle(true) 
    try {
      await signIn("google", { redirect: true, callbackUrl: "/dashboard" })
    } finally {
      setLoadingGoogle(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen text-white">
      {showGoogleReminder && (
        <Dialog open={showGoogleReminder} onOpenChange={setShowGoogleReminder}>
          <DialogContent className="border border-amber-500 text-amber-100">
            <DialogHeader>
              <DialogTitle>Invalid Credentials</DialogTitle>
              <DialogDescription>
                Having trouble signing in? If you previously used Google to sign in with this email, try the "Sign in
                with Google" option instead.
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      )}

      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="inline-block p-3 rounded-2xl bg-gradient-to-br from-purple-600 to-cyan-500">
            <Gauge className="w-8 h-8 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-bold">Sign in to your account</h2>
          <p className="mt-2 text-sm text-zinc-400">Monitor your websites with ease</p>
        </div>

        <div className="mt-8 space-y-6">
          <Button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loadingSignIn || loadingGoogle}
            className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-[#1E1E22] to-[#141417] text-white 
            border border-zinc-600 rounded-lg py-3 px-4 transition-all duration-300
            shadow-[0_0_15px_rgba(66,133,244,0.15)]
            hover:shadow-[0_0_18px_rgba(66,133,244,0.25)]
            hover:border-[#4285F4]/30
            hover:scale-[1.01]
            relative overflow-hidden
            animate-pulse-subtle
            before:content-[''] 
            before:absolute 
            before:inset-0 
            before:bg-gradient-to-r 
            before:from-[#EA4335]/5 
            before:via-[#4285F4]/10 
            before:to-[#34A853]/5
            after:content-[''] 
            after:absolute 
            after:inset-0 
            after:bg-gradient-to-r 
            after:from-[#EA4335]/10
            after:via-[#4285F4]/15 
            after:to-[#34A853]/10 
            after:opacity-0 
            hover:after:opacity-100 
            after:transition-opacity 
            after:duration-300"
          >
            {loadingGoogle ? (
              <div className="w-5 h-5 border-4 border-t-transparent border-white rounded-full animate-spin"></div>
            ) : (
              <>
                <div className="relative">
                  <div className="absolute inset-0 bg-white/10 blur-md rounded-full"></div>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" className="w-6 h-6 relative drop-shadow-[0_0_4px_rgba(255,255,255,0.4)]">
                    <path
                      fill="#EA4335"
                      d="M5.26620003,9.76452941 C6.19878754,6.93863203 8.85444915,4.90909091 12,4.90909091 C13.6909091,4.90909091 15.2181818,5.50909091 16.4181818,6.49090909 L19.9090909,3 C17.7818182,1.14545455 15.0545455,0 12,0 C7.27006974,0 3.1977497,2.69829785 1.23999023,6.65002441 L5.26620003,9.76452941 Z"
                    />
                    <path
                      fill="#34A853"
                      d="M16.0407269,18.0125889 C14.9509167,18.7163016 13.5660892,19.0909091 12,19.0909091 C8.86648613,19.0909091 6.21911939,17.076871 5.27698177,14.2678769 L1.23746264,17.3349879 C3.19279051,21.2936293 7.26500293,24 12,24 C14.9328362,24 17.7353462,22.9573905 19.834192,20.9995801 L16.0407269,18.0125889 Z"
                    />
                    <path
                      fill="#4A90E2"
                      d="M19.834192,20.9995801 C22.0291676,18.9520994 23.4545455,15.903663 23.4545455,12 C23.4545455,11.2909091 23.3454545,10.5272727 23.1818182,9.81818182 L12,9.81818182 L12,14.4545455 L18.4363636,14.4545455 C18.1187732,16.013626 17.2662994,17.2212117 16.0407269,18.0125889 L19.834192,20.9995801 Z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.27698177,14.2678769 C5.03832634,13.556323 4.90909091,12.7937589 4.90909091,12 C4.90909091,11.2182781 5.03443647,10.4668121 5.26620003,9.76452941 L1.23999023,6.65002441 C0.43658717,8.26043162 0,10.0753848 0,12 C0,13.9195484 0.444780743,15.7301709 1.23746264,17.3349879 L5.27698177,14.2678769 Z"
                    />
                  </svg>
                </div>
                <span className="font-medium tracking-wider text-white/90">Sign in with Google</span>
              </>
            )}
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-[#0A0A0B] text-zinc-400">Or sign in with email</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-zinc-300">
                  Email address
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full bg-[#141417] border-zinc-700 focus:border-purple-500 focus:ring-purple-500"
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-zinc-300">
                  Password
                </label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 block w-full bg-[#141417] border-zinc-700 focus:border-purple-500 focus:ring-purple-500"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            {error && <p className="text-red-400 text-center">{error}</p>}
            <Button
              type="submit"
              disabled={loadingGoogle || loadingSignIn}
              className="w-full bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
            >
              {loadingSignIn ? (
                <div className="w-5 h-5 border-4 border-t-transparent border-white rounded-full animate-spin"></div>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </div>

        <p className="mt-4 text-center text-sm text-zinc-400">
          Don't have an account?{" "}
          <a href="/onboarding/sign-up" className="font-medium text-purple-500 hover:text-purple-400">
            Sign up
          </a>
        </p>
      </div>
    </div>
  )
}
