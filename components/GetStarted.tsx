"use client"
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { HeroHighlight,Highlight } from './ui/hero-highlight';
import { motion } from 'framer-motion';

const GetStarted = () => {
  const [email, setEmail] = useState('');
  const [error,setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
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
        console.log(data);
      } else {
        const errorData = await response.json();
        setError(errorData.errors?.[0] || errorData.error || "An error occurred.");
      }

    } catch (err) {
      console.error(err);
      setError("An error occurred while getting you on board");
    }
  };

  // return (
  //   // <div className="bg-black text-white min-h-screen flex flex-col items-center justify-center p-4">
  //   //   <h1 className="text-4xl font-bold mb-8">Prevent Downtime! Yeahh</h1>
  //   //     <div className="flex flex-col sm:flex-row gap-4">
  //   //       <input
  //   //         type="email"
  //   //         value={email}
  //   //         onChange={(e) => setEmail(e.target.value)}
  //   //         placeholder="Enter your email"
  //   //         className="flex-grow px-4 py-2 rounded-md text-black"
  //   //         required
  //   //       />
  //   //       <button
  //   //       onClick={handleSubmit}
  //   //         type="submit"
  //   //         className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md transition duration-300"
  //   //       >
  //   //         Get Started
  //   //       </button>
  //   //       {error && <p className="text-red-500 mt-2">{error}</p>}
  //   //     </div>
  //   // </div>
  // );

  return (
    <HeroHighlight>
      <motion.h1
        className="text-2xl px-4 md:text-4xl lg:text-5xl font-bold text-neutral-700 dark:text-white max-w-4xl leading-relaxed lg:leading-snug text-center mx-auto"
      >
        Prevent Downtime!!!
        
      </motion.h1>
    </HeroHighlight>
  )
};

export default GetStarted;