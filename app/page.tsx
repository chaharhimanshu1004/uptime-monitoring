"use client";
import { useState } from "react";
import { useRouter } from 'next/navigation';

export default function Home() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    
    if (!email) {
      setError("Please enter a valid email.");
      return;
    }

    try {
      const response = await fetch('/api/user/get-started', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.redirected) {
        router.push(response.url);
      } else if (response.ok) {
        const data = await response.json();
        setSuccess("Request processed successfully.");
        console.log(data);
      } else {
        const errorData = await response.json();
        setError(errorData.errors?.[0] || errorData.error || "An error occurred.");
      }

    } catch (err) {
      console.error(err);
      setError("An error occurred while processing your request.");
    }
  };

  return (
    <div>
      <div className="flex mt-40 flex-col items-center justify-center p-4 bg-gray-100 rounded-lg shadow-md max-w-sm mx-auto">
        <input
          type="text"
          className="w-full px-3 py-2 border text-black border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {error && <p className="text-red-500 mt-2">{error}</p>}
        {success && <p className="text-green-500 mt-2">{success}</p>}
        <button
          onClick={handleClick}
          className="mt-4 px-6 py-2 bg-blue-500 text-white font-semibold rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          Get Started
        </button>
      </div>
    </div>
  );
}