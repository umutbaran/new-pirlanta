import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Admin Girişi',
      credentials: {
        username: { label: "Kullanıcı Adı", type: "text" },
        password: { label: "Şifre", type: "password" }
      },
      async authorize(credentials) {
        if (!process.env.ADMIN_USERNAME || !process.env.ADMIN_PASSWORD) {
  return null;
}
const isValid = credentials?.username === process.env.ADMIN_USERNAME &&
            credentials?.password === process.env.ADMIN_PASSWORD;

        if (isValid) {
          return { id: "1", name: "Admin User", email: "admin@newpirlanta.com", role: "admin" };
        }
        return null;
      }
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 60,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user && 'role' in user) {
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        if (session.user) {
  (session.user as any).role = token.role;
}
      }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
}
