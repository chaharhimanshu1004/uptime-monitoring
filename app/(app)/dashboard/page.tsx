'use client'
import React from 'react'
import { useSession, signOut } from 'next-auth/react'
import { User } from 'next-auth' // this is the user next-auth returns after the authentication
import { WebsiteStatusDisplay } from '@/app/components/WebsiteStatusDisplay'
import { SidebarUptime } from '@/acertinity-components/Sidebar'
const Page = () => {
  const { data: session } = useSession();
  const user: User = session?.user as User;

  return (
    <div className="bg-black   min-h-screen flex">
      <div className="w-3/10">
      <SidebarUptime />
      </div>
      <div className="w-7/10">
      <WebsiteStatusDisplay />
      </div>
    </div>
  );
}

export default Page;
