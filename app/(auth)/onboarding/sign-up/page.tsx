"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Gauge } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { signIn } from "next-auth/react"

export default function SignupPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [loadingGoogle, setLoadingGoogle] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }
    try {
      setLoading(true)
      const response = await fetch("/api/user/sign-up", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      })
      if (response.redirected) {
        const redirectUrl = new URL(response.url);
        redirectUrl.searchParams.set("email", email);
        router.push(redirectUrl.toString());
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Something went wrong.");
        return;
      }
      await signIn("credentials", {
        redirect: false,
        email: email,
        password: password
      });
      router.push(`/onboarding/verify-email?email=${encodeURIComponent(email)}`);
    } catch (err) {
      console.log("Error occurred while signing you up!", err)
      setError("An error occurred while signing you up!")
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignUp = async () => {
    setLoadingGoogle(true) 
    try {
      await signIn("google", { redirect: true, callbackUrl: "/dashboard" })
    } finally {
      setLoadingGoogle(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0A0A0B] text-white px-6">
      <div className="w-full max-w-2xl mx-auto space-y-8 relative">
        <div className="text-center">
          <div className="inline-block p-3 rounded-2xl bg-gradient-to-br from-purple-600 to-cyan-500 shadow-lg shadow-purple-500/10">
            <Gauge className="w-8 h-8 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-bold">Create your account</h2>
          <p className="mt-2 text-sm text-zinc-400">Start monitoring your websites today</p>
        </div>

        <div className="mt-10 space-y-7 px-2">
          <Button
            type="button"
            onClick={handleGoogleSignUp}
            disabled={loading || loadingGoogle}
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
                <span className="font-medium tracking-wider text-white/90">Sign up with Google</span>
              </>
            )}
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-700/70"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-[#0A0A0B] text-zinc-400">Or sign up with email</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-zinc-300 mb-1">
                  Name
                </label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full bg-[#141417] border-zinc-700/50 focus:border-purple-500 focus:ring-purple-500 rounded-md"
                  placeholder="Enter your name"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-zinc-300 mb-1">
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
                  className="block w-full bg-[#141417] border-zinc-700/50 focus:border-purple-500 focus:ring-purple-500 rounded-md"
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-zinc-300 mb-1">
                  Password
                </label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full bg-[#141417] border-zinc-700/50 focus:border-purple-500 focus:ring-purple-500 rounded-md"
                  placeholder="Enter your password"
                />
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-zinc-300 mb-1">
                  Confirm Password
                </label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="block w-full bg-[#141417] border-zinc-700/50 focus:border-purple-500 focus:ring-purple-500 rounded-md"
                  placeholder="Confirm your password"
                />
              </div>
            </div>

            {error && <p className="text-red-400 text-center text-sm">{error}</p>}
            <Button
              type="submit"
              disabled={loading || loadingGoogle}
              className="w-full bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 text-white font-bold py-3 px-4 rounded-lg transition duration-300 shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30"
            >
              {loading ? (
                <div className="w-5 h-5 border-4 border-t-transparent border-white rounded-full animate-spin"></div>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>
        </div>

        <p className="text-center text-sm text-zinc-400">
          Already have an account?{" "}
          <a href="/onboarding/sign-in" className="font-medium text-purple-500 hover:text-purple-400">
            Sign in
          </a>
        </p>
      </div>
    </div>
  )
}

