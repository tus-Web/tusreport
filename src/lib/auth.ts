import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { isFirebaseConfigured } from "@/lib/firebase-config";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("メールアドレスとパスワードを入力してください");
        }

        // Check if Firebase is configured
        if (!isFirebaseConfigured()) {
          console.warn("Firebase is not configured. Using demo mode.");
          // Demo mode for development - accept any credentials
          if (credentials.email === "demo@example.com" && credentials.password === "demo123") {
            return {
              id: "demo-user",
              email: "demo@example.com",
              name: "Demo User"
            };
          }
          throw new Error("Firebase is not configured. Please complete the Firebase setup.");
        }

        // Import userService only when Firebase is configured
        const { userService } = await import("@/lib/firebase-db");
        
        const user = await userService.findByEmail(credentials.email);

        if (!user || !user.password) {
          throw new Error("メールアドレスまたはパスワードが正しくありません");
        }

        if (!user.emailVerified) {
          throw new Error("メールアドレスが認証されていません。認証メールをご確認ください");
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

        if (!isPasswordValid) {
          throw new Error("メールアドレスまたはパスワードが正しくありません");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
      }
      return session;
    }
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/login",
  },
  session: {
    strategy: "jwt"
  },
  secret: process.env.NEXTAUTH_SECRET,
};