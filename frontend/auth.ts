import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { JWT } from "next-auth/jwt"

export const { handlers: { GET, POST }, signIn, signOut, auth } = NextAuth({
  providers: [Google],
  session: {
    strategy: "jwt"
  },
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.idToken = account.id_token;
      }
      return token;
    },
    async session({ session, token }) {
      (session as any).idToken = token.idToken;
      return session;
    }
  },
  pages: {
    signIn: "/auth/signin"
  },
  basePath: "/api/auth",
  trustHost: true
})