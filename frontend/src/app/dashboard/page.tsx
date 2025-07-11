'use client';

import { useState, useEffect } from 'react';
import { signOut, useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import { config } from '@/config';
import { redirect } from 'next/navigation';

interface Deck {
  id: string;
  name: string;
  category: string;
  createdAt: string;
  nativeLanguage?: string;
  foreignLanguage?: string;
  level?: string;
  topic?: string;
  name_in_storage?: string;
  version?: number;
}

const LEVELS = [
  { value: 'A1', label: 'A1 - Beginner' },
  { value: 'A2', label: 'A2 - Elementary' },
  { value: 'B1', label: 'B1 - Intermediate' },
  { value: 'B2', label: 'B2 - Upper Intermediate' },
  { value: 'C1', label: 'C1 - Advanced' },
  { value: 'C2', label: 'C2 - Mastery' },
];

export default function Dashboard() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/');
    },
  });
  const userEmail = session?.user?.email || '';
  const idToken = (session as any)?.idToken;

  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [decks, setDecks] = useState<Deck[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    nativeLanguage: '',
    foreignLanguage: '',
    level: 'B2',
    topic: '',
  });
  const [formLoading, setFormLoading] = useState(false);
  const [downloading, setDownloading] = useState<string | null>(null);

  useEffect(() => {
    if (!idToken) return; // Only fetch when idToken is available
    setLoading(true);
    fetch(`${config.backendUrl}/get-user-decks`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${idToken}`,
      },
    })
      .then(async (response) => {
        if (response.status === 401) {
          toast.error("Your session has expired. Please log in again.");
          signOut({ callbackUrl: '/' });
          return;
        }
        if (!response.ok) throw new Error('Failed to fetch decks');
        const data = await response.json();
        console.log('Received data:', data); // For debugging
        const decksToProcess = Array.isArray(data) ? data : (data.decks || []);
        const formattedDecks = decksToProcess.map((deck: any, idx: number) => {
          // Try to get a unique id from id_in_storage, fallback to name_in_storage, or index as last resort
          const id =
            deck.id;

          const nativeLang = deck.language_native?.charAt(0).toUpperCase() + deck.language_native?.slice(1);
          const foreignLang = deck.language_foreign?.charAt(0).toUpperCase() + deck.language_foreign?.slice(1);

          return {
            id,
            name: `${foreignLang} Deck (${deck.level})`,
            category: `${nativeLang}-${foreignLang}`,
            createdAt: new Date(deck.added_at).toISOString().split('T')[0],
            nativeLanguage: nativeLang,
            foreignLanguage: foreignLang,
            level: deck.level,
            topic: deck.topic || 'General',
            name_in_storage: deck.name_in_storage,
            version: deck.version,
          };
        });
        console.log('Formatted decks:', formattedDecks); // For debugging
        setDecks(formattedDecks);
        setCategories(Array.from(new Set(formattedDecks.map((d: Deck) => d.category))));
      })
      .catch((error) => {
        toast.error(error instanceof Error ? error.message : 'Failed to fetch decks');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [idToken, session]);

  const filteredDecks = (selectedCategory
    ? decks.filter(d => d.category === selectedCategory)
    : decks
  ).filter(d => d.id);

  if (status === 'loading' || (loading && idToken)) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#f1f5f9' }}>
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  const handleDownloadDeck = async (deck: Deck) => {
    if (!idToken) {
      toast.error('You must be logged in to download decks.');
      return;
    }
    if (!deck.id || typeof deck.id !== 'string') {
      toast.error('Deck ID is invalid, cannot download.');
      return;
    }
    if (!deck.name_in_storage) {
      toast.error('Deck file name not available.');
      return;
    }

    setDownloading(deck.id);
    const toastId = toast.loading(`Downloading ${deck.name}...`);

    try {
      const response = await fetch(`${config.backendUrl}/download-deck/${deck.id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${idToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to download deck.');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = deck.name_in_storage;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      
      toast.success('Download complete!', { id: toastId });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'An unknown error occurred.', { id: toastId });
    } finally {
      setDownloading(null);
    }
  };

  // Modal form handlers
  const openCreateModal = () => {
    setForm({ nativeLanguage: '', foreignLanguage: '', level: 'B2', topic: '' });
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
  };
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleCreateDeck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nativeLanguage || !form.foreignLanguage || !form.level) {
      toast.error('Please fill in all required fields');
      return;
    }
    setFormLoading(true);
    try {
      const response = await fetch(`${config.backendUrl}/create-checkout-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          level: form.level,
          number_of_words: 200,
          topic: form.topic || 'general',
          native_language: form.nativeLanguage,
          foreign_language: form.foreignLanguage,
          email: userEmail,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || 'Failed to create checkout session');
      if (!data.url) throw new Error('No checkout URL received');
      window.location.href = data.url;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to create checkout session');
    } finally {
      setFormLoading(false);
      closeModal();
    }
  };

  // Create new deck of the same type (category)
  const handleCreateDeckOfType = async () => {
    if (!filteredDecks.length) {
      toast.error('No deck data found for this category.');
      return;
    }
    const deck = filteredDecks[0];
    setFormLoading(true);
    try {
      const response = await fetch(`${config.backendUrl}/create-checkout-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          level: deck.level || 'B2',
          number_of_words: 200,
          topic: deck.topic || 'general',
          native_language: deck.nativeLanguage || '',
          foreign_language: deck.foreignLanguage || '',
          email: userEmail,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || 'Failed to create checkout session');
      if (!data.url) throw new Error('No checkout URL received');
      window.location.href = data.url;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to create checkout session');
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f1f5f9' }}>
      {/* Sidebar */}
      <aside style={{ width: 240, background: '#232946', padding: 28, color: '#fff', boxShadow: '2px 0 8px #0001' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 18, letterSpacing: 1 }}>Categories</h2>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {categories.map(cat => (
            <li key={cat}>
              <button
                style={{
                  background: selectedCategory === cat ? '#6366f1' : 'transparent',
                  color: selectedCategory === cat ? '#fff' : '#e0e7ef',
                  border: 'none',
                  padding: '10px 14px',
                  borderRadius: 8,
                  margin: '4px 0',
                  cursor: 'pointer',
                  width: '100%',
                  textAlign: 'left',
                  fontWeight: selectedCategory === cat ? 700 : 500,
                  transition: 'background 0.2s, color 0.2s',
                  outline: 'none',
                }}
                onClick={() => setSelectedCategory(cat)}
                onMouseOver={e => (e.currentTarget.style.background = '#444b6e')}
                onMouseOut={e => (e.currentTarget.style.background = selectedCategory === cat ? '#6366f1' : 'transparent')}
              >
                {cat}
              </button>
            </li>
          ))}
        </ul>
        <button
          style={{ marginTop: 28, background: '#6366f1', color: '#fff', border: 'none', borderRadius: 8, padding: '12px 18px', width: '100%', fontWeight: 600, fontSize: '1rem', cursor: 'pointer', boxShadow: '0 2px 8px #0001', transition: 'background 0.2s' }}
          onClick={() => setSelectedCategory(null)}
          onMouseOver={e => (e.currentTarget.style.background = '#444b6e')}
          onMouseOut={e => (e.currentTarget.style.background = '#6366f1')}
        >
          All Decks
        </button>
        <button
          style={{ marginTop: 16, background: '#e11d48', color: '#fff', border: 'none', borderRadius: 8, padding: '12px 18px', width: '100%', fontWeight: 600, fontSize: '1rem', cursor: 'pointer', boxShadow: '0 2px 8px #0001', transition: 'background 0.2s' }}
          onClick={() => signOut({ callbackUrl: '/' })}
          onMouseOver={e => (e.currentTarget.style.background = '#b91c1c')}
          onMouseOut={e => (e.currentTarget.style.background = '#e11d48')}
        >
          Logout
        </button>
      </aside>
      {/* Main Content */}
      <main style={{ flex: 1, padding: 40 }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: 24 }}>
          {selectedCategory ? (
            <button
              style={{ background: '#10b981', color: '#fff', border: 'none', borderRadius: 8, padding: '12px 22px', fontWeight: 600, fontSize: '1rem', cursor: 'pointer', boxShadow: '0 2px 8px #0001', transition: 'background 0.2s' }}
              onClick={handleCreateDeckOfType}
              disabled={formLoading}
              onMouseOver={e => (e.currentTarget.style.background = '#059669')}
              onMouseOut={e => (e.currentTarget.style.background = '#10b981')}
            >
              {formLoading ? 'Processing...' : 'Create New Deck of This Type'}
            </button>
          ) : (
            <button
              style={{ background: '#10b981', color: '#fff', border: 'none', borderRadius: 8, padding: '12px 22px', fontWeight: 600, fontSize: '1rem', cursor: 'pointer', boxShadow: '0 2px 8px #0001', transition: 'background 0.2s' }}
              onClick={openCreateModal}
              disabled={formLoading}
              onMouseOver={e => (e.currentTarget.style.background = '#059669')}
              onMouseOut={e => (e.currentTarget.style.background = '#10b981')}
            >
              Create New Deck
            </button>
          )}
        </div>
        {loading ? (
          <p style={{ color: '#232946', fontWeight: 500 }}>Loading...</p>
        ) : (
          <ul style={{ marginTop: 12, padding: 0, listStyle: 'none' }}>
            {filteredDecks.map((deck, idx) => {
              if (!deck.id) {
                console.warn('Deck is missing a unique id:', deck);
              }
              const key =
                deck.id && deck.version !== undefined
                  ? `${deck.id}-${deck.version}`
                  : deck.id
                  ? `${deck.id}-nover`
                  : `deck-${idx}`;
                return (
                  <li key={key} style={{ marginBottom: 18, padding: 20, background: '#fff', borderRadius: 10, boxShadow: '0 1px 8px #0001', display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '1.1rem', color: '#232946' }}>{deck.name}</div>
                    <div style={{ fontSize: 13, color: '#6366f1', fontWeight: 500 }}>Category: {deck.category}</div>
                    {deck.topic && deck.topic !== 'General' && (
                      <div style={{ fontSize: 12, color: '#6b7280' }}>Topic: {deck.topic}</div>
                    )}
                    {deck.version && (
                      <div style={{ fontSize: 12, color: '#6b7280' }}>Version: {deck.version}</div>
                    )}
                    <div style={{ fontSize: 12, color: '#6b7280' }}>Created: {deck.createdAt}</div>
                  </div>
                  <button
                    style={{
                      background: '#059669',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 8,
                      padding: '10px 18px',
                      fontWeight: 600,
                      fontSize: '0.95rem',
                      cursor: 'pointer',
                      transition: 'background 0.2s',
                      whiteSpace: 'nowrap',
                    }}
                    onClick={() => handleDownloadDeck(deck)}
                    disabled={downloading === deck.id}
                    onMouseOver={e => (e.currentTarget.style.background = '#047857')}
                    onMouseOut={e => (e.currentTarget.style.background = '#059669')}
                  >
                    {downloading === deck.id ? 'Downloading...' : 'Download Deck'}
                  </button>
                </div>
                <button
                  style={{ marginTop: 10, background: '#6366f1', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 16px', fontWeight: 600, fontSize: '0.95rem', cursor: 'pointer', alignSelf: 'flex-start', transition: 'background 0.2s' }}
                  onClick={() => setSelectedCategory(deck.category)}
                  onMouseOver={e => (e.currentTarget.style.background = '#3730a3')}
                  onMouseOut={e => (e.currentTarget.style.background = '#6366f1')}
                >
                  View Category
                </button>
              </li>
            );
            })}
          </ul>
        )}
        {/* Modal for creating a new deck (All Decks) */}
        {showModal && !selectedCategory && (
          <div style={{
            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
          }}>
            <form
              onSubmit={handleCreateDeck}
              style={{
                background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ef 100%)',
                padding: 40,
                borderRadius: 20,
                minWidth: 380,
                boxShadow: '0 4px 32px #0002',
                display: 'flex',
                flexDirection: 'column',
                gap: 24,
                alignItems: 'stretch',
                border: '1px solid #e5e7eb',
              }}
            >
              <h2 style={{ fontSize: '1.5rem', marginBottom: 8, color: '#232946', fontWeight: 700, textAlign: 'center', letterSpacing: 1 }}>Create New Deck</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <label style={{ color: '#232946', fontWeight: 600, marginBottom: 2 }} htmlFor="nativeLanguage">
                  Native Language
                </label>
                <input
                  id="nativeLanguage"
                  name="nativeLanguage"
                  type="text"
                  value={form.nativeLanguage}
                  onChange={handleFormChange}
                  style={{
                    width: '100%',
                    padding: '14px 12px',
                    borderRadius: 10,
                    border: '1.5px solid #cbd5e1',
                    fontSize: '1.05rem',
                    background: '#fff',
                    color: '#232946',
                    outline: 'none',
                    transition: 'border 0.2s',
                  }}
                  required
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <label style={{ color: '#232946', fontWeight: 600, marginBottom: 2 }} htmlFor="foreignLanguage">
                  Language I want to learn
                </label>
                <input
                  id="foreignLanguage"
                  name="foreignLanguage"
                  type="text"
                  value={form.foreignLanguage}
                  onChange={handleFormChange}
                  style={{
                    width: '100%',
                    padding: '14px 12px',
                    borderRadius: 10,
                    border: '1.5px solid #cbd5e1',
                    fontSize: '1.05rem',
                    background: '#fff',
                    color: '#232946',
                    outline: 'none',
                    transition: 'border 0.2s',
                  }}
                  required
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <label style={{ color: '#232946', fontWeight: 600, marginBottom: 2 }} htmlFor="level">
                  Language Level
                </label>
                <select
                  id="level"
                  name="level"
                  value={form.level}
                  onChange={handleFormChange}
                  style={{
                    width: '100%',
                    padding: '14px 12px',
                    borderRadius: 10,
                    border: '1.5px solid #cbd5e1',
                    fontSize: '1.05rem',
                    background: '#fff',
                    color: '#232946',
                    outline: 'none',
                    transition: 'border 0.2s',
                    appearance: 'auto',
                    cursor: 'pointer'
                  }}
                  required
                >
                  {LEVELS.map(l => (
                    <option key={l.value} value={l.value}>{l.label}</option>
                  ))}
                </select>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <label style={{ color: '#232946', fontWeight: 600, marginBottom: 2 }} htmlFor="topic">
                  Topic (optional)
                </label>
                <input
                  id="topic"
                  name="topic"
                  type="text"
                  value={form.topic}
                  onChange={handleFormChange}
                  style={{
                    width: '100%',
                    padding: '14px 12px',
                    borderRadius: 10,
                    border: '1.5px solid #cbd5e1',
                    fontSize: '1.05rem',
                    background: '#fff',
                    color: '#232946',
                    outline: 'none',
                    transition: 'border 0.2s',
                  }}
                />
              </div>
              <div style={{ display: 'flex', gap: 16, marginTop: 8, justifyContent: 'center' }}>
                <button
                  type="submit"
                  style={{
                    background: '#10b981',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 10,
                    padding: '14px 32px',
                    fontWeight: 700,
                    fontSize: '1.1rem',
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px #0001',
                    transition: 'background 0.2s',
                  }}
                  disabled={formLoading}
                  onMouseOver={e => (e.currentTarget.style.background = '#059669')}
                  onMouseOut={e => (e.currentTarget.style.background = '#10b981')}
                >
                  {formLoading ? 'Processing...' : 'Create & Checkout'}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  style={{
                    background: '#e5e7eb',
                    color: '#232946',
                    border: 'none',
                    borderRadius: 10,
                    padding: '14px 32px',
                    fontWeight: 700,
                    fontSize: '1.1rem',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
} 