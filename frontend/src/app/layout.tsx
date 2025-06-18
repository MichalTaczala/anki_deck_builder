import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import './globals.css'
import JsonLd from '@/components/JsonLd'
import InitializeApp from '@/components/InitializeApp'
<<<<<<< HEAD
import SessionProviderWrapper from './SessionProviderWrapper'

// Setting up Google login with NextAuth. Implementation will be in NextAuth config and API route files.
=======
import { AuthProvider } from '@/components/AuthProvider'
>>>>>>> ae4a3d7bb448f4c9fa5732fb0fa4c32fa5c39790

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
    default: 'MemoHill - Anki Cards Generator for Language Learning | Create Anki Decks',
    template: '%s | MemoHill - Anki Cards Generator for Language Learning'
  },
  description: 'Create language learning flashcards for Anki with Anki Cards Generator. Choose your level, language and topic and get cards generated for your needs.',
  keywords: [
    'language learning',
    'flashcards',
    'anki',
    'AI flashcards',
    'language study',
    'memorization',
    'spaced repetition',
    'language learning app',
    'flashcard generator',
    'anki cards generator',
    'anki deck creator',
    'language flashcards',
    'vocabulary builder',
    'language learning tool'
  ],
  authors: [{ name: 'MemoHill', url: 'https://memohill.com' }],
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
    title: 'MemoHill - Anki Cards Generator',
    description: 'Create personalized language learning flashcards with Anki Cards Generator. Anki cards generation with one click of a button. Perfect for language learners, students, and teachers.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'MemoHill - Anki Cards Generator'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MemoHill - Anki Cards Generator',
    description: 'Create personalized language learning flashcards with Anki Cards Generator. Anki cards generation with one click of a button. Perfect for language learners, students, and teachers.',
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

const shareUrl = 'https://memohill.com'
const title = 'Check out MemoHill - Anki Cards Generator for Language Learning!'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.png" type="image/png" />
        <meta name="theme-color" content="#6366f1" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="application-name" content="MemoHill" />
        <meta name="msapplication-TileColor" content="#6366f1" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        {/* <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JsonLd) }} /> */}
        <JsonLd />
      </head>
      <body className={inter.className}>
<<<<<<< HEAD
        <InitializeApp />
        
        <SessionProviderWrapper>
          {children}
        </SessionProviderWrapper>
        <Toaster />
        
=======
        <AuthProvider>
          <InitializeApp />
          {children}
          <Toaster />
        </AuthProvider>
>>>>>>> ae4a3d7bb448f4c9fa5732fb0fa4c32fa5c39790
      </body>
    </html>
  )
}