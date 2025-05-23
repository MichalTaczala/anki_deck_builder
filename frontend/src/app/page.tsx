'use client'

import { useState } from 'react'
import { toast } from 'react-hot-toast'
import { config } from '@/config'
import { useSession, signIn } from 'next-auth/react'
import { redirect } from 'next/navigation'

export default function Home() {
  const { data: session, status } = useSession()
  const [level, setLevel] = useState('B2')
  const [topic, setTopic] = useState('')
  const [nativeLanguage, setNativeLanguage] = useState('')
  const [foreignLanguage, setForeignLanguage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  if (status === 'loading') {
    return (
      <main className="min-h-screen p-8 gradient-animate">
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white"></div>
        </div>
      </main>
    )
  }

  if (!session) {
    redirect('/auth/signin')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!level || !nativeLanguage || !foreignLanguage) {
      toast.error('Please fill in all required fields')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch(`${config.backendUrl}/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          level,
          number_of_words: 200,
          topic: topic || 'general',
          native_language: nativeLanguage,
          foreign_language: foreignLanguage,
          email: session.user?.email,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.detail || 'Failed to create checkout session')
      }

      if (!data.url) {
        throw new Error('No checkout URL received')
      }
      
      window.location.href = data.url
    } catch (error) {
      console.error('Error:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to create checkout session')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen p-8 gradient-animate">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
              MemoHill
            </h1>
            <p className="text-white/80 text-lg">
              Welcome, {session.user?.name}!
            </p>
          </div>
          <button
            onClick={() => signIn('google')}
            className="text-white/80 hover:text-white transition-colors"
          >
            Switch Account
          </button>
        </div>
        
        <div className="glass-effect rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="nativeLanguage" className="block text-sm font-medium mb-2 text-white/90">
                Native language
              </label>
              <input
                type="text"
                id="nativeLanguage"
                value={nativeLanguage}
                onChange={(e) => setNativeLanguage(e.target.value)}
                className="input-field"
                placeholder="e.g., English"
                required
              />
            </div>

            <div>
              <label htmlFor="foreignLanguage" className="block text-sm font-medium mb-2 text-white/90">
                Language I want to learn
              </label>
              <input
                type="text"
                id="foreignLanguage"
                value={foreignLanguage}
                onChange={(e) => setForeignLanguage(e.target.value)}
                className="input-field"
                placeholder="e.g., Spanish"
                required
              />
            </div>

            <div>
              <label htmlFor="level" className="block text-sm font-medium mb-2 text-white/90">
                Language Level
              </label>
              <select
                id="level"
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="select-field"
                required
              >
                <option value="A1">A1 - Beginner</option>
                <option value="A2">A2 - Elementary</option>
                <option value="B1">B1 - Intermediate</option>
                <option value="B2">B2 - Upper Intermediate</option>
                <option value="C1">C1 - Advanced</option>
                <option value="C2">C2 - Mastery</option>
              </select>
            </div>

            <div>
              <label htmlFor="topic" className="block text-sm font-medium mb-2 text-white/90">
                Topic (optional)
              </label>
              <input
                type="text"
                id="topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="input-field"
                placeholder="e.g., Technology, Science, History"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="button-primary"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating...
                </span>
              ) : (
                'Generate Deck'
              )}
            </button>
          </form>
        </div>

        <div className="mt-12 text-center text-white/60 text-sm">
          <p>Trusted by language learners worldwide</p>
          <p className="mt-2">✓ Anki-compatible .apkg files</p>
          <p>✓ AI-powered vocabulary selection</p>
          <p>✓ Instant download after purchase</p>
        </div>
      </div>
    </main>
  )
}