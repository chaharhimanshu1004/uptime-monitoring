"use client"
import { useState } from 'react';
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter(); 
  const email = searchParams.get("email")

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

  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('An OTP has been sent to your email. Please verify.');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (otp.length !== 6 || isNaN(Number(otp))) {
      setError('Please enter a valid 6-digit OTP.');
      return;
    }
    try {
      const result = await fetch('/api/user/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, code: otp }),
      });
      console.log('>>>result is ', result);
      if (result.ok) {
        setMessage('Email verified successfully!');
        setError('');
      } else {
        throw new Error('Verification failed');
      }
    } catch (e) {
      setError('Invalid OTP. Please try again.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black text-white">
      <div className="w-full max-w-md bg-neutral-900 p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-6 text-center">Verify Your Email</h2>
        <p className="text-center mb-6 text-neutral-300">{message}</p>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="otp" className="block text-neutral-300">Enter OTP</label>
            <input
              type="text"
              id="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-neutral-600 text-white"
              placeholder="Enter 6-digit OTP"
              maxLength={6}
              required
            />
          </div>
          {error && <p className="text-red-400 text-center mb-4">{error}</p>}
          <button
            type="submit"
            className="w-full px-4 py-2 bg-neutral-700 text-white font-semibold rounded-md shadow-sm hover:bg-neutral-600 focus:outline-none focus:ring-2 focus:ring-neutral-500"
          >
            Verify OTP
          </button>
        </form>
      </div>
    </div>
  );
}