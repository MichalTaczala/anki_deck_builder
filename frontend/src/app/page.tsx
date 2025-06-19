'use client'

import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'

export default function Home() {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return (
      <main className="min-h-screen p-8 gradient-animate">
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white"></div>
        </div>
      </main>
    )
  }

  // Redirect unauthenticated users to sign in
  if (!session) {
    redirect('/auth/signin')
  }

  // Redirect authenticated users to dashboard
  redirect('/dashboard')
}
