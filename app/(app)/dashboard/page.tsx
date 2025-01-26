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
    <div className="min-h-screen flex h-screen">
      <div style={{ width: '15%', height: '100%' }}>
        <SidebarUptime />
      </div>
      <div style={{ width: '85%', height: '100%' }} >
        <WebsiteStatusDisplay />
      </div>
    </div>
  );
}

export default Page;
