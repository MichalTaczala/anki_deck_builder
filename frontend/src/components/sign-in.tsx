'use client';

import { signIn, signOut, useSession } from 'next-auth/react';

export default function SignIn() {
  const { data: session, status } = useSession();
  const isLoggedIn = !!session?.user;

  if (isLoggedIn) {
    return (
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        background: '#fff',
        border: '1.5px solid #e5e7eb',
        borderRadius: 24,
        padding: '6px 18px 6px 10px',
        boxShadow: '0 1px 4px #0001',
        fontWeight: 500,
        fontSize: '1rem',
        color: '#232946',
        gap: 10,
        minHeight: 44,
      }}>
        {session.user?.image && (
          <img src={session.user.image} alt="avatar" style={{ width: 32, height: 32, borderRadius: '50%', marginRight: 8 }} />
        )}
        <span style={{ marginRight: 10 }}>{session.user?.email}</span>
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          style={{
            background: 'none',
            border: 'none',
            color: '#e11d48',
            fontWeight: 700,
            fontSize: '1rem',
            cursor: 'pointer',
            padding: 0,
            marginLeft: 4,
            display: 'flex',
            alignItems: 'center',
          }}
          title="Sign out"
        >
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path fill="#e11d48" d="M16.59 7.41L15.17 6l-6 6 6 6 1.41-1.41L13.83 12z"/></svg>
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        background: '#fff',
        color: '#444',
        border: '1.5px solid #e5e7eb',
        borderRadius: 24,
        padding: '10px 24px',
        fontWeight: 600,
        fontSize: '1.08rem',
        cursor: 'pointer',
        boxShadow: '0 1px 4px #0001',
        gap: 12,
        transition: 'box-shadow 0.2s',
        minHeight: 44,
      }}
    >
      <img
        src="https://developers.google.com/identity/images/g-logo.png"
        alt="Google"
        style={{ width: 22, height: 22, marginRight: 8 }}
      />
      Sign in with Google
    </button>
  );
} 