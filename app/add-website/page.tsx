"use client"
import React, { useState } from 'react';

const Page = () => {
  const [websiteUrl, setWebsiteUrl] = useState('');

  const handleSubmit = async () => {
    const response = await fetch('/api/user/add-website', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url: websiteUrl }),
    });

    const data = await response.json();
    console.log(data);
  }

  return (
    <div className="flex flex-col items-center">
      <input
        type="text"
        value={websiteUrl}
        onChange={(e)=>setWebsiteUrl(e.target.value)}
        className="border text-black border-gray-300 rounded-md px-4 py-2 mb-4"
      />
      <button
        onClick={handleSubmit}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Submit
      </button>
    </div>
  );
};

export default Page;

