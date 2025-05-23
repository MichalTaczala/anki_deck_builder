'use client'

import { useSearchParams } from 'next/navigation'
import { useState, Suspense, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { config } from '@/config'

function SuccessContent() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const [isLoading, setIsLoading] = useState(false)
  const [isDeckReady, setIsDeckReady] = useState(false)
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    let timeoutId: NodeJS.Timeout

    const checkDeckStatus = async () => {
      if (!sessionId) {
        toast.error('Session ID is missing')
        setIsChecking(false)
        return
      }

      try {
        console.log('Checking deck status...')
        const response = await fetch(`${config.backendUrl}/is-deck-created?session_id=${sessionId}`)
        const data = await response.json()
        console.log('Deck status response:', data)
        
        if (data === true) {
          console.log('Deck is ready, stopping polling')
          setIsDeckReady(true)
          setIsChecking(false)
          return // Exit the function early
        }
        
        // Only set up next poll if deck is not ready
        console.log('Deck not ready, scheduling next check')
        timeoutId = setTimeout(checkDeckStatus, 2000)
      } catch (error) {
        console.error('Error checking deck status:', error)
        toast.error('Failed to check deck status')
        setIsChecking(false)
      }
    }

    checkDeckStatus()

    // Cleanup function to clear the timeout when component unmounts
    return () => {
      console.log('Cleaning up polling')
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, [sessionId])

  const handleDownload = async () => {
    if (!sessionId) {
      toast.error('Session ID is missing')
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch(`${config.backendUrl}/get-deck?session_id=${sessionId}`, {
        method: 'GET',
      })

      if (!response.ok) {
        throw new Error('Failed to download deck')
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'anki-deck.apkg'
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      toast.error('Failed to download deck')
      console.error('Error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen p-8 gradient-animate">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
            Payment Successful!
          </h1>
          <p className="text-white/80 text-lg">
            {!isDeckReady ? 'Generating your deck...' : 'Your Anki deck is ready for download'}
          </p>
        </div>
        
        <div className="glass-effect rounded-2xl p-8 text-center">
          {!isDeckReady ? (
            <div className="flex items-center justify-center space-x-3">
              <svg className="animate-spin h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="text-white/80 text-lg">Please wait while we generate your deck...</span>
            </div>
          ) : (
            <button
              onClick={handleDownload}
              disabled={isLoading}
              className="button-primary"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Downloading...
                </span>
              ) : (
                'Download Deck'
              )}
            </button>
          )}
        </div>
      </div>
    </main>
  )
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen p-8 gradient-animate">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
              Loading...
            </h1>
            <p className="text-white/80 text-lg">
              Please wait while we prepare your download
            </p>
          </div>
        </div>
      </main>
    }>
      <SuccessContent />
    </Suspense>
  )
} 