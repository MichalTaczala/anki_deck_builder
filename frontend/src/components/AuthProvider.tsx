'use client';

import { SessionProvider } from 'next-auth/react';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider basePath="/api/auth">
      {children}
    </SessionProvider>
  );
}