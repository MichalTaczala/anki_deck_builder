import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import './globals.css'
import JsonLd from '@/components/JsonLd'
import InitializeApp from '@/components/InitializeApp'
import { AuthProvider } from '@/components/AuthProvider'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'arial']
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#6366f1',
}

export const metadata: Metadata = {
  metadataBase: new URL('https://memohill.com'),
  title: {
    default: 'MemoHill - AI-Powered Language Learning Flashcards',
    template: '%s | MemoHill'
  },
  description: 'Create personalized language learning flashcards with AI. Compatible with Anki and other flashcard apps. Learn languages faster with MemoHill.',
  keywords: ['language learning', 'flashcards', 'anki', 'AI flashcards', 'language study', 'memorization', 'spaced repetition'],
  authors: [{ name: 'MemoHill' }],
  creator: 'MemoHill',
  publisher: 'MemoHill',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://memohill.com',
    siteName: 'MemoHill',
    title: 'MemoHill - AI-Powered Language Learning Flashcards',
    description: 'Create personalized language learning flashcards with AI. Compatible with Anki and other flashcard apps.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'MemoHill - AI-Powered Language Learning Flashcards'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MemoHill - AI-Powered Language Learning Flashcards',
    description: 'Create personalized language learning flashcards with AI. Compatible with Anki and other flashcard apps.',
    images: ['/og-image.jpg'],
    creator: '@memohill'
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://memohill.com',
    languages: {
      'en-US': 'https://memohill.com',
    },
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'MemoHill',
  },
  other: {
    'msapplication-TileColor': '#6366f1',
    'msapplication-config': '/browserconfig.xml',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="canonical" href="https://memohill.com" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        <meta name="theme-color" content="#6366f1" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="MemoHill" />
        <meta name="application-name" content="MemoHill" />
        <meta name="msapplication-TileColor" content="#6366f1" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <JsonLd />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <InitializeApp />
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  )
}