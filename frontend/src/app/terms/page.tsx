import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service | MemoHill - Language Learning Flashcards',
  description: 'Terms of Service for MemoHill. Learn about our terms, conditions, and policies for using our language learning flashcard service.',
}

export default function TermsOfService() {
  return (
    <main className="min-h-screen p-8 gradient-animate">
      <div className="max-w-3xl mx-auto">
        <div className="glass-effect rounded-2xl p-8">
          <h1 className="text-4xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
            Terms of Service
          </h1>
          
          <div className="prose prose-invert max-w-none">
            <p className="text-white/80">
              Last updated: March 20, 2024
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4 text-white">1. Acceptance of Terms</h2>
            <p className="text-white/80">
              By accessing and using MemoHill, you agree to be bound by these Terms of Service and all applicable laws and regulations.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4 text-white">2. Description of Service</h2>
            <p className="text-white/80">
              MemoHill provides AI-powered language learning flashcards that are compatible with Anki and other flashcard applications.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4 text-white">3. User Responsibilities</h2>
            <p className="text-white/80">
              As a user of MemoHill, you agree to:
            </p>
            <ul className="list-disc pl-6 text-white/80">
              <li>Provide accurate information</li>
              <li>Use the service for lawful purposes only</li>
              <li>Not share your account credentials</li>
              <li>Not attempt to reverse engineer the service</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-8 mb-4 text-white">4. Payment Terms</h2>
            <p className="text-white/80">
              All payments are processed securely through Stripe. Prices are subject to change with notice.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4 text-white">5. Intellectual Property</h2>
            <p className="text-white/80">
              All content and materials available on MemoHill are protected by intellectual property rights.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4 text-white">6. Limitation of Liability</h2>
            <p className="text-white/80">
              MemoHill is provided "as is" without any warranties, expressed or implied.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4 text-white">7. Contact Information</h2>
            <p className="text-white/80">
              For any questions regarding these Terms of Service, please contact us at:
              <br />
              Email: radakanis321@gmail.com
            </p>
          </div>
        </div>
      </div>
    </main>
  )
} 