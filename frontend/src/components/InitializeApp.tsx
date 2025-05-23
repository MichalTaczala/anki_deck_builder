'use client'

import { useEffect } from 'react'
import { config } from '@/config'

export default function InitializeApp() {
  useEffect(() => {
    const initializeBackend = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/initialize`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })
        
        if (!response.ok) {
          console.error('Failed to initialize backend')
        }
      } catch (error) {
        console.error('Error initializing backend:', error)
      }
    }

    initializeBackend()
  }, []) // Empty dependency array means this runs once on mount

  return null // This component doesn't render anything
} 