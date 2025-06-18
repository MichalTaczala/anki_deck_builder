'use client';

import { signIn } from "next-auth/react";
import Image from "next/image";

export default function SignIn() {
  return (
    <main className="min-h-screen p-8 gradient-animate">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
            Welcome to MemoHill
          </h1>
          <p className="text-white/80 text-lg mb-6">
            Sign in to create personalized language learning flashcards
          </p>
        </div>
        
        <div className="glass-effect rounded-2xl p-8">
          <button
            onClick={() => signIn('google', { callbackUrl: '/' })}
            className="w-full flex items-center justify-center space-x-2 bg-white text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200"
          >
            <Image
              src="https://www.google.com/favicon.ico"
              alt="Google"
              width={20}
              height={20}
            />
            <span>Continue with Google</span>
          </button>
        </div>

        <div className="mt-8 text-center text-white/60 text-sm">
          <p>By signing in, you agree to our</p>
          <div className="space-x-2">
            <a href="/terms" className="underline hover:text-white">Terms of Service</a>
            <span>and</span>
            <a href="/privacy" className="underline hover:text-white">Privacy Policy</a>
          </div>
        </div>
      </div>
    </main>
  );
}