import { useState, FormEvent } from 'react';
import { Toaster, toast } from 'react-hot-toast';

interface DeckData {
  level: string;
  number_of_words: number;
  topic: string;
  native_language: string;
  foreign_language: string;
  email: string;
}

function App() {
  const [formData, setFormData] = useState<DeckData>({
    level: 'A1',
    number_of_words: 10,
    topic: '',
    native_language: '',
    foreign_language: '',
    email: '',
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch(`${process.env.BACKEND_URL}/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || 'Failed to create checkout session')
      }

      const { url } = await response.json()
      if (!url) {
        throw new Error('No checkout URL received')
      }
      
      window.location.href = url // Redirect to Stripe Checkout
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to create checkout session')
      console.error('Error:', error)
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-600 to-red-600 py-12 px-4 sm:px-6 lg:px-8 animate-gradient-x">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-white mb-2">
            Anki Deck Creator
          </h1>
          <p className="text-white/90">Create personalized language learning decks</p>
        </div>
        
        <div className="bg-white/20 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden border border-white/30">
          <div className="px-8 py-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-6">
                <div className="group">
                  <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    className="block w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="your@email.com"
                  />
                </div>

                <div className="group">
                  <label htmlFor="native_language" className="block text-sm font-medium text-white mb-2">
                    Native language
                  </label>
                  <input
                    type="text"
                    id="native_language"
                    required
                    className="block w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all"
                    value={formData.native_language}
                    onChange={(e) => setFormData({ ...formData, native_language: e.target.value })}
                    placeholder="e.g., English"
                  />
                </div>

                <div className="group">
                  <label htmlFor="foreign_language" className="block text-sm font-medium text-white mb-2">
                    Language I want to learn
                  </label>
                  <input
                    type="text"
                    id="foreign_language"
                    required
                    className="block w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all"
                    value={formData.foreign_language}
                    onChange={(e) => setFormData({ ...formData, foreign_language: e.target.value })}
                    placeholder="e.g., Spanish"
                  />
                </div>

                <div className="group">
                  <label htmlFor="level" className="block text-sm font-medium text-white mb-2">
                    Language Level
                  </label>
                  <select
                    id="level"
                    required
                    className="block w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all"
                    value={formData.level}
                    onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                  >
                    <option value="A1" className="text-gray-900">A1 (Beginner)</option>
                    <option value="A2" className="text-gray-900">A2 (Elementary)</option>
                    <option value="B1" className="text-gray-900">B1 (Intermediate)</option>
                    <option value="B2" className="text-gray-900">B2 (Upper Intermediate)</option>
                    <option value="C1" className="text-gray-900">C1 (Advanced)</option>
                    <option value="C2" className="text-gray-900">C2 (Mastery)</option>
                  </select>
                </div>

                <div className="group">
                  <label htmlFor="number_of_words" className="block text-sm font-medium text-white mb-2">
                    Number of Words
                  </label>
                  <input
                    type="number"
                    id="number_of_words"
                    required
                    min="1"
                    max="100"
                    className="block w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all"
                    value={formData.number_of_words}
                    onChange={(e) => setFormData({ ...formData, number_of_words: parseInt(e.target.value) })}
                  />
                </div>

                <div className="group">
                  <label htmlFor="topic" className="block text-sm font-medium text-white mb-2">
                    Topic
                  </label>
                  <input
                    type="text"
                    id="topic"
                    required
                    className="block w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all"
                    value={formData.topic}
                    onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                    placeholder="e.g., Business, Travel, Food"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full px-6 py-4 bg-white text-purple-700 rounded-xl font-semibold text-lg shadow-lg hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-purple-600 transform hover:scale-[1.02] transition-all duration-200"
              >
                Create Your Deck
              </button>
            </form>
          </div>
        </div>
      </div>
      <Toaster 
        position="top-center"
        toastOptions={{
          style: {
            background: '#fff',
            color: '#333',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#4F46E5',
              secondary: '#fff',
            },
          },
          error: {
            duration: 3000,
            iconTheme: {
              primary: '#EF4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </div>
  );
}

export default App;