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
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Credenciais inválidas");
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        });

        if (!user || !user.password) {
          throw new Error("Credenciais inválidas");
        }

        const isPasswordCorrect = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordCorrect) {
          throw new Error("Credenciais inválidas");
        }

        // Retornamos o objeto com todos os campos necessários para o JWT
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          username: user.username,
          totalStreak: user.totalStreak,
          avatarUrl: user.avatarUrl,
        };
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
      // Quando o usuário faz login, 'user' contém os dados retornados pelo authorize
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.totalStreak = user.totalStreak;
        token.avatarUrl = user.avatarUrl;
      }

      // Suporte para update() do useSession
      if (trigger === "update" && session?.avatarUrl) {
        token.avatarUrl = session.avatarUrl;
      }

      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        
        // Fetch fresh user data from DB on each session request
        const user = await prisma.user.findUnique({
          where: { id: token.id as string },
          select: { avatarUrl: true, username: true, xp: true, level: true, totalStreak: true }
        });

        if (user) {
          session.user.avatarUrl = user.avatarUrl;
          session.user.username = user.username;
          session.user.xp = user.xp;
          session.user.level = user.level;
          session.user.totalStreak = user.totalStreak;
        }
      }
      return session;
    },
  },
  useSecureCookies: process.env.NODE_ENV === "production",
  secret: process.env.NEXTAUTH_SECRET,
};
