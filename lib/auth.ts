import { NextAuthOptions, DefaultSession } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { createHash, timingSafeEqual } from "crypto"

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

// --- Kaba kuvvet (brute-force) koruması ---
// Not: Bellek içi sayaçtır; sunucusuz ortamda her sunucu örneği kendi sayacını tutar.
// Yine de tek bir kaynaktan gelen hızlı şifre denemelerini büyük ölçüde yavaşlatır.
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_WINDOW_MS = 15 * 60 * 1000;
const failedAttempts = new Map<string, { count: number; firstAt: number }>();

function isRateLimited(ip: string): boolean {
  const entry = failedAttempts.get(ip);
  if (!entry) return false;
  if (Date.now() - entry.firstAt > LOCKOUT_WINDOW_MS) {
    failedAttempts.delete(ip);
    return false;
  }
  return entry.count >= MAX_FAILED_ATTEMPTS;
}

function recordFailure(ip: string) {
  const entry = failedAttempts.get(ip);
  if (!entry || Date.now() - entry.firstAt > LOCKOUT_WINDOW_MS) {
    failedAttempts.set(ip, { count: 1, firstAt: Date.now() });
  } else {
    entry.count++;
  }
}

/** Zamanlama saldırılarına karşı sabit sürede karşılaştırma */
function safeEqual(a: string, b: string): boolean {
  const hashA = createHash('sha256').update(a).digest();
  const hashB = createHash('sha256').update(b).digest();
  return timingSafeEqual(hashA, hashB);
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Admin Girişi',
      credentials: {
        username: { label: "Kullanıcı Adı", type: "text" },
        password: { label: "Şifre", type: "password" }
      },
      async authorize(credentials, req) {
        const adminUser = process.env.ADMIN_USERNAME;
        const adminPass = process.env.ADMIN_PASSWORD;

        if (!adminUser || !adminPass) {
          console.error("KRİTİK HATA: ADMIN_USERNAME veya ADMIN_PASSWORD tanımlanmamış!");
          return null;
        }

        const forwardedFor = req?.headers?.['x-forwarded-for'];
        const ip = (Array.isArray(forwardedFor) ? forwardedFor[0] : forwardedFor)?.split(',')[0].trim() || 'unknown';

        if (isRateLimited(ip)) {
          console.warn(`Admin girişi geçici olarak engellendi (çok fazla hatalı deneme): ${ip}`);
          return null;
        }

        const isValid =
          safeEqual(credentials?.username || '', adminUser) &&
          safeEqual(credentials?.password || '', adminPass);

        if (isValid) {
          failedAttempts.delete(ip);
          return { id: "1", name: "Admin", email: "info@newpirlanta.com", role: "admin" };
        }

        recordFailure(ip);
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
  secret: process.env.NEXTAUTH_SECRET,
}
