"use client"

import { signIn } from "next-auth/react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Gauge } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function SignInPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: email,
        password: password,
      })
      console.log(result)
      if (result?.error) {
        setError(result.error) // add toast here
        return
      }
      if (result?.url) {
        router.replace("/dashboard")
      }
    } catch (err) {
      console.log("Error occurred while signing in!", err)
      setError("An error occurred while signing in!")
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0A0A0B] text-white">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="inline-block p-3 rounded-2xl bg-gradient-to-br from-purple-600 to-cyan-500">
            <Gauge className="w-8 h-8 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-bold">Sign in to your account</h2>
          <p className="mt-2 text-sm text-zinc-400">Monitor your websites with ease</p>
        </div>
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
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
            className="w-full bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
          >
            Sign In
          </Button>
        </form>
        <p className="mt-4 text-center text-sm text-zinc-400">
          Don't have an account?{" "}
          <a href="#" className="font-medium text-purple-500 hover:text-purple-400">
            Sign up
          </a>
        </p>
      </div>
    </div>
  )
}

