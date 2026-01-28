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
        // .env dosyasındaki bilgilerle kontrol et
        const isValid = 
            credentials?.username === process.env.ADMIN_USERNAME &&
            credentials?.password === process.env.ADMIN_PASSWORD;

        if (isValid) {
          return { id: "1", name: "Admin User", email: "admin@newpirlanta.com" };
        }
        return null;
      }
    })
  ],
  pages: {
    signIn: '/admin/login', // Kendi özel login sayfamızı kullanacağız
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
        (session.user as any).role = token.role;
      }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
