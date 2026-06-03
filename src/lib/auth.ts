import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error("Credenciais não fornecidas");
          }

          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          });

          if (!user || !user.password) {
            console.error("AUTH_DEBUG: Usuário não encontrado ou sem senha");
            throw new Error("Credenciais inválidas");
          }

          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!isPasswordCorrect) {
            console.error("AUTH_DEBUG: Senha incorreta");
            throw new Error("Credenciais inválidas");
          }

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            username: user.username,
            totalStreak: user.totalStreak,
            avatarUrl: user.avatarUrl,
            xp: user.xp,
            level: user.level,
          };
        } catch (error: any) {
          console.error("AUTH_AUTHORIZE_ERROR:", error.message);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.totalStreak = user.totalStreak;
        token.xp = user.xp;
        token.level = user.level;
        
        // Segurança: Evitar que URLs de avatar gigantes (Base64) estourem o cookie de 4KB
        const avatarUrl = user.avatarUrl as string;
        if (avatarUrl && avatarUrl.length > 2000) {
          token.avatarUrl = "/avatar-placeholder.png"; // Fallback se for Base64 gigante
        } else {
          token.avatarUrl = avatarUrl;
        }
      }

      if (trigger === "update" && session) {
        if (session.avatarUrl) {
          // Também validar no update
          token.avatarUrl = session.avatarUrl.length > 2000 ? token.avatarUrl : session.avatarUrl;
        }
        if (session.xp) token.xp = session.xp;
        if (session.level) token.level = session.level;
      }

      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.username = token.username as string;
        session.user.avatarUrl = token.avatarUrl as string;
        session.user.totalStreak = token.totalStreak as number;
        session.user.xp = token.xp as number;
        session.user.level = token.level as number;
      }
      return session;
    },
  },
  useSecureCookies: process.env.NODE_ENV === "production",
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
};
