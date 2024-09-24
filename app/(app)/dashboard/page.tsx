'use client'
import React from 'react'
import { useSession, signOut } from 'next-auth/react'
import { User } from 'next-auth' // this is the user next-auth returns after the authentication
import { WebsiteStatusDisplay } from '@/app/components/WebsiteStatusDisplay'
const Page = () => {
  const { data: session } = useSession();
  const user: User = session?.user as User;

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-800">
      {session ? (
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-6 text-gray-800">Dashboard</h1>
          <p className="text-lg text-gray-600 mb-4">Welcome {user?.name}</p>
          <WebsiteStatusDisplay />
          <button
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            onClick={() => signOut()}
          >
            Sign Out
          </button>
        </div>
      ) : (
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-6 text-gray-800">Dashboard</h1>
          <p className="text-lg text-gray-600 mb-4">Please sign in to view this page</p>
        </div>
      )}
    </div>
  );
}

export default Page;
