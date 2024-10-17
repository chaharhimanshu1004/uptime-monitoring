"use client"

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await signIn('credentials', {
        redirect: false,
        email: email,
        password: password,
      });
      console.log(result);
      if (result?.error) {
        setError(result.error); // add toast here
        return;
      }
      if (result?.url) {
        router.replace('/dashboard');
      }
    } catch(err) {
      console.log("Error occurred while signing in!", err);
      setError("An error occurred while signing in!");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black text-white">
      <div className="w-full max-w-md bg-neutral-900 p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-6 text-center">Sign In</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-neutral-300">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-neutral-600 text-white"
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-neutral-300">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-neutral-600 text-white"
              placeholder="Enter your password"
              required
            />
          </div>
          {error && <p className="text-red-400 text-center mb-4">{error}</p>}
          <button
            type="submit"
            className="w-full px-4 py-2 bg-neutral-700 text-white font-semibold rounded-md shadow-sm hover:bg-neutral-600 focus:outline-none focus:ring-2 focus:ring-neutral-500"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}