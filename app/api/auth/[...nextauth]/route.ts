import NextAuth, { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Admin Girişi',
      credentials: {
        username: { label: "Kullanıcı Adı", type: "text", placeholder: "admin" },
        password: { label: "Şifre", type: "password" }
      },
      async authorize(credentials) {
        const isValid = 
            credentials?.username === (process.env.ADMIN_USERNAME || "admin") &&
            credentials?.password === (process.env.ADMIN_PASSWORD || "admin123");

        if (isValid) {
          return { id: "1", name: "Admin User", email: "admin@newpirlanta.com" };
        }
        return null;
      }
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 60, // 30 dakika (Saniye cinsinden)
  },
  pages: {
    signIn: '/admin/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = "admin";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        Object.assign(session.user, { role: token.role });
      }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET || "gizli-anahtar-degistirin", // Fallback secret for dev
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
