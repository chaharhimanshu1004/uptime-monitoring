"use client";
import { useState } from "react";
import axios from "axios";

export default function Home() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleClick = async (e: any) => {
    e.preventDefault();
    
    if (!email) {
      setError("Please enter a valid email.");
      return;
    }

    try {
      console.log("here")
      const response = await fetch('/api/user/get-started', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      console.log("here again")

      const data = await response.json();
      console.log(data);

    } catch (err: any) {
      if (err.response?.data?.err) {
        setError(err.response.data.err);
      } else {
        setError("An error occurred while processing your request.");
      }
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
