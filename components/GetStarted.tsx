"use client"
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { HeroHighlight,Highlight } from './ui/hero-highlight';
import { motion } from 'framer-motion';
import { Input } from './ui/input';

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
  //   <HeroHighlight>
  //     <div className="flex flex-col items-center gap-10 max-w-5xl mx-auto">
  //       <motion.h1
  //         initial={{ opacity: 0, y: 20 }}
  //         animate={{ opacity: 1, y: 0 }}
  //         transition={{ duration: 0.5 }}
  //         className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-fuchsia-200 to-white max-w-4xl leading-tight tracking-tight text-center mx-auto"
  //       >
  //         Prevent Downtime 
  //         <span className="bg-gradient-to-r from-fuchsia-500 to-cyan-500 bg-clip-text text-transparent"> !!</span>
  //       </motion.h1>

  //       <motion.div
  //         initial={{ opacity: 0, y: 20 }}
  //         animate={{ opacity: 1, y: 0 }}
  //         transition={{ duration: 0.5, delay: 0.2 }}
  //         className="w-full max-w-md relative group"
  //       >
  //         <div className="absolute -inset-0.5 bg-gradient-to-r from-fuchsia-500  to-cyan-500 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-1000"></div>
  //         <Input
  //           className="relative h-14 bg-black/90 border-0 text-white placeholder:text-zinc-400 rounded-xl focus:ring-2 focus:ring-fuchsia-500/50 focus:outline-none"
  //           placeholder="Enter your email..."
  //         />
  //       </motion.div>

  //       <motion.div
  //         initial={{ opacity: 0, y: 20 }}
  //         animate={{ opacity: 1, y: 0 }}
  //         transition={{ duration: 0.5, delay: 0.4 }}
  //       >
  //         <button
  //           onClick={handleSubmit}
  //           className="group relative inline-flex items-center justify-center h-14 overflow-hidden rounded-xl px-12 transition-all duration-300"
  //         >
  //           {/* Animated background */}
  //           <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-fuchsia-500 via-cyan-500 to-fuchsia-500 opacity-100 group-hover:opacity-90 transition-opacity duration-300 bg-[length:200%_auto] animate-[gradient_3s_linear_infinite]"></div>

  //           {/* Button content */}
  //           <span className="relative flex items-center gap-2 text-white font-semibold text-lg">
  //             Get Started
  //             <svg
  //               className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300"
  //               fill="none"
  //               viewBox="0 0 24 24"
  //               stroke="currentColor"
  //             >
  //               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
  //             </svg>
  //           </span>
  //         </button>
  //       </motion.div>
  //     </div>
  //   </HeroHighlight>
  // )
  return (
    <HeroHighlight>
      <div className="flex flex-col items-center gap-8 max-w-5xl mx-auto">
        {/* Company/Product Name */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-2xl md:text-3xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-cyan-400 to-purple-400 tracking-tight"
        >
          Uptime Monitoring
        </motion.div>

        {/* Main Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-3xl px-4 md:text-4xl lg:text-5xl font-bold text-white max-w-4xl   text-center mx-auto"
        >
          Always On, Always Watching
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-xl md:text-2xl text-zinc-200 text-center max-w-2xl mx-auto mb-4 font-medium"
        >
          Your Website Never Sleeps, Neither Do We
        </motion.p>

        {/* Email Input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full max-w-md relative group"
        >
          <div className="absolute -inset-0.5 bg-gradient-to-r from-fuchsia-500  to-cyan-500 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-1000"></div>
          <Input
            className="relative h-14 bg-black/90 border-0 text-white placeholder:text-zinc-400 rounded-xl focus:ring-2 focus:ring-fuchsia-500/50 focus:outline-none"
            placeholder="Enter your email..."
          />
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <button
            onClick={handleSubmit}
            className="group relative inline-flex items-center justify-center h-14 overflow-hidden rounded-xl px-12 transition-all duration-300"
          >
            {/* Animated background */}
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-fuchsia-500 via-cyan-500 to-fuchsia-500 opacity-100 group-hover:opacity-90 transition-opacity duration-300 bg-[length:200%_auto] animate-[gradient_3s_linear_infinite]"></div>

            {/* Button content */}
            <span className="relative flex items-center gap-2 text-white font-semibold text-lg">
              Get Started
              <svg
                className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          </button>
        </motion.div>
      </div>
    </HeroHighlight>
  )
};

export default GetStarted;