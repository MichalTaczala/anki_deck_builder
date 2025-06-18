'use client'

import { useState } from 'react'
import { toast } from 'react-hot-toast'
import { config } from '@/config'
<<<<<<< HEAD
import { signIn, signOut, useSession } from 'next-auth/react'
import SignIn from '@/components/sign-in'

export default function Home() {
  const { data: session } = useSession();
=======
import { useSession, signIn } from 'next-auth/react'
import { redirect } from 'next/navigation'

export default function Home() {
  const { data: session, status } = useSession()
>>>>>>> ae4a3d7bb448f4c9fa5732fb0fa4c32fa5c39790
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
<<<<<<< HEAD
    <>
      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, #6366f1 0%, #a5b4fc 100%)',
        padding: '3.5rem 0 2.5rem 0',
        color: '#fff',
        textAlign: 'center',
        borderRadius: '0 0 2rem 2rem',
        boxShadow: '0 4px 32px #0001',
      }}>
        <h1 style={{ fontSize: '2.8rem', fontWeight: 800, marginBottom: 16, letterSpacing: 1, lineHeight: 1.1 }}>MemoHill – Anki Cards Generator for Language Learning</h1>
        <p style={{ fontSize: '1.3rem', maxWidth: 700, margin: '0 auto', marginBottom: 18, fontWeight: 500 }}>
          Create personalized, AI-powered flashcards and Anki decks for any language, topic, or level. Perfect for students, teachers, and self-learners who want to master vocabulary and concepts efficiently.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 28 }}>
          <SignIn />
        </div>
      </section>

      {/* Main Form Section */}
      <main className="min-h-screen p-8" style={{ background: '#f8fafc' }}>
        <div className="max-w-2xl mx-auto">
=======
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
>>>>>>> ae4a3d7bb448f4c9fa5732fb0fa4c32fa5c39790

          {/* SEO/Description Section */}
          <section style={{ marginTop: 56, background: '#fff', borderRadius: 18, boxShadow: '0 2px 16px #0001', padding: '2.7rem 2rem', color: '#232946', lineHeight: 1.7, fontSize: '1.13rem' }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: 18, color: '#6366f1', letterSpacing: 0.5 }}>Why Choose MemoHill for Language Learning?</h2>
            <p>
              <strong>MemoHill</strong> is your trusted Anki cards generator and flashcard creator for language learning. Our platform uses advanced AI to help you generate high-quality, personalized flashcards for any language, topic, or proficiency level. Whether you are preparing for exams, expanding your vocabulary, or teaching a new language, MemoHill makes it easy to create Anki decks tailored to your needs.
            </p>
            <p style={{ marginTop: 18 }}>
              With MemoHill, you can:
            </p>
            <ul style={{ margin: '14px 0 0 28px', listStyle: 'disc' }}>
              <li>Generate Anki decks and flashcards for over 50 languages</li>
              <li>Choose your language, topic, and level for fully customized decks</li>
              <li>Leverage spaced repetition and AI-powered memorization techniques</li>
              <li>Download decks compatible with Anki and other flashcard apps</li>
              <li>Accelerate your language learning with smart, efficient study tools</li>
              <li>Enjoy a user-friendly interface designed for students, teachers, and self-learners</li>
              <li>Access your decks anytime, anywhere, and on any device</li>
            </ul>
            <p style={{ marginTop: 18 }}>
              Join thousands of language learners, students, and teachers who trust MemoHill for their vocabulary building and language study. Start creating your Anki cards today and experience the benefits of a smarter, faster, and more effective way to learn languages. MemoHill is your go-to language learning tool, offering AI flashcards, vocabulary builders, and a comprehensive Anki deck creator. Whether you are a beginner or an advanced learner, MemoHill helps you achieve your language goals with ease and confidence.
            </p>
          </section>
        </div>
      </main>
    </>
  )
<<<<<<< HEAD
}
=======
}
>>>>>>> ae4a3d7bb448f4c9fa5732fb0fa4c32fa5c39790
