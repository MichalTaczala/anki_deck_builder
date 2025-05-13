import { useState, FormEvent } from 'react';
import { Toaster, toast } from 'react-hot-toast';

interface DeckData {
  nativeLanguage: string;
  foreignLanguage: string;
  languageLevel: string;
  topic?: string;
}

function App() {
  const [formData, setFormData] = useState<DeckData>({
    nativeLanguage: '',
    foreignLanguage: '',
    languageLevel: 'A1',
    topic: '',
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    try {
      // Replace with your actual API endpoint
      const response = await fetch('YOUR_API_ENDPOINT', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to create deck');
      }

      toast.success('Deck creation request sent successfully!');
      setFormData({
        nativeLanguage: '',
        foreignLanguage: '',
        languageLevel: 'A1',
        topic: '',
      });
    } catch (error) {
      toast.error('Failed to create deck. Please try again.');
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
                  <label htmlFor="nativeLanguage" className="block text-sm font-medium text-white mb-2">
                    Native Language
                  </label>
                  <input
                    type="text"
                    id="nativeLanguage"
                    required
                    className="block w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all"
                    value={formData.nativeLanguage}
                    onChange={(e) => setFormData({ ...formData, nativeLanguage: e.target.value })}
                    placeholder="e.g., English"
                  />
                </div>

                <div className="group">
                  <label htmlFor="foreignLanguage" className="block text-sm font-medium text-white mb-2">
                    Foreign Language
                  </label>
                  <input
                    type="text"
                    id="foreignLanguage"
                    required
                    className="block w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all"
                    value={formData.foreignLanguage}
                    onChange={(e) => setFormData({ ...formData, foreignLanguage: e.target.value })}
                    placeholder="e.g., Spanish"
                  />
                </div>

                <div className="group">
                  <label htmlFor="languageLevel" className="block text-sm font-medium text-white mb-2">
                    Language Level
                  </label>
                  <select
                    id="languageLevel"
                    required
                    className="block w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all"
                    value={formData.languageLevel}
                    onChange={(e) => setFormData({ ...formData, languageLevel: e.target.value })}
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
                  <label htmlFor="topic" className="block text-sm font-medium text-white mb-2">
                    Topic (Optional)
                  </label>
                  <input
                    type="text"
                    id="topic"
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