import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy | MemoHill - Language Learning Flashcards',
  description: 'Privacy Policy for MemoHill. Learn how we protect your data and ensure your privacy while using our language learning flashcard service.',
}

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen p-8 gradient-animate">
      <div className="max-w-3xl mx-auto">
        <div className="glass-effect rounded-2xl p-8">
          <h1 className="text-4xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
            Privacy Policy
          </h1>
          
          <div className="prose prose-invert max-w-none">
            <p className="text-white/80">
              Last updated: March 20, 2024
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4 text-white">1. Information We Collect</h2>
            <p className="text-white/80">
              We collect information that you provide directly to us, including:
            </p>
            <ul className="list-disc pl-6 text-white/80">
              <li>Email address</li>
              <li>Language preferences</li>
              <li>Payment information (processed securely through Stripe)</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-8 mb-4 text-white">2. How We Use Your Information</h2>
            <p className="text-white/80">
              We use the information we collect to:
            </p>
            <ul className="list-disc pl-6 text-white/80">
              <li>Provide and maintain our service</li>
              <li>Process your payments</li>
              <li>Send you important updates about your account</li>
              <li>Improve our service</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-8 mb-4 text-white">3. Data Security</h2>
            <p className="text-white/80">
              We implement appropriate security measures to protect your personal information. Your data is encrypted and stored securely.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4 text-white">4. Your Rights</h2>
            <p className="text-white/80">
              You have the right to:
            </p>
            <ul className="list-disc pl-6 text-white/80">
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Object to data processing</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-8 mb-4 text-white">5. Contact Us</h2>
            <p className="text-white/80">
              If you have any questions about this Privacy Policy, please contact us at:
              <br />
              Email: privacy@memohill.com
            </p>
          </div>
        </div>
      </div>
    </main>
  )
} 