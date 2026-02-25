import { NextAuthOptions, DefaultSession } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

// NextAuth tiplerini genişletelim
declare module "next-auth" {
  interface Session {
    user: {
      role?: string;
    } & DefaultSession["user"]
  }

  interface User {
    role?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Admin Girişi',
      credentials: {
        username: { label: "Kullanıcı Adı", type: "text" },
        password: { label: "Şifre", type: "password" }
      },
      async authorize(credentials) {
        const adminUser = process.env.ADMIN_USERNAME;
        const adminPass = process.env.ADMIN_PASSWORD;

        if (!adminUser || !adminPass) {
          console.error("KRİTİK HATA: ADMIN_USERNAME veya ADMIN_PASSWORD tanımlanmamış!");
          return null;
        }

        const isValid = credentials?.username === adminUser && credentials?.password === adminPass;

        if (isValid) {
          return { id: "1", name: "Admin", email: "info@newpirlanta.com", role: "admin" };
        }
        return null;
      }
    })
  ],
  pages: {
    signIn: '/admin/login',
    error: '/admin/login', // Hata durumunda da bizim sayfada kalsın
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 60, // 30 dakika
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role;
      }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET || "fallback_secret_for_dev_only",
}
