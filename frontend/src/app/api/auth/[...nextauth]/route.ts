import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import type { NextAuthOptions } from "next-auth";




export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 60*60,
    updateAge: 5*60,
  },
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.idToken = account.id_token;
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.accessTokenExpires = (account.expires_at || 0) * 1000 + Date.now();
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {

        (session.user as typeof session.user & { id?: string }).id = token.sub;
        (session as any).idToken = token.idToken;
        (session as any).accessToken = token.accessToken;
        (session as any).error = token.error;
      }
      return session;
    },
  },
  pages: {},
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }; 
