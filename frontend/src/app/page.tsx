'use client'

import { useState } from 'react'
import { toast } from 'react-hot-toast'

export default function Home() {
  const [level, setLevel] = useState('B2')
  const [numberOfWords, setNumberOfWords] = useState(10)
  const [topic, setTopic] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/generate-deck', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          level,
          numberOfWords,
          topic,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate deck')
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${topic.toLowerCase().replace(' ', '_')}.apkg`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast.success('Deck generated successfully!')
    } catch (error) {
      toast.error('Failed to generate deck')
      console.error('Error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Anki Deck Generator</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="level" className="block text-sm font-medium mb-2">
              English Level
            </label>
            <select
              id="level"
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="w-full p-2 border rounded"
              required
            >
              <option value="A1">A1</option>
              <option value="A2">A2</option>
              <option value="B1">B1</option>
              <option value="B2">B2</option>
              <option value="C1">C1</option>
              <option value="C2">C2</option>
            </select>
          </div>

          <div>
            <label htmlFor="numberOfWords" className="block text-sm font-medium mb-2">
              Number of Words
            </label>
            <input
              type="number"
              id="numberOfWords"
              value={numberOfWords}
              onChange={(e) => setNumberOfWords(Number(e.target.value))}
              min="1"
              max="50"
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label htmlFor="topic" className="block text-sm font-medium mb-2">
              Topic
            </label>
            <input
              type="text"
              id="topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="e.g., Technology, Science, History"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-500 text-white p-3 rounded hover:bg-blue-600 disabled:bg-blue-300"
          >
            {isLoading ? 'Generating...' : 'Generate Deck'}
          </button>
        </form>
      </div>
    </main>
  )
} 