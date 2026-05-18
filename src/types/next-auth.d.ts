import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  /**
   * Extende o tipo 'user' dentro de 'session'
   */
  interface Session {
    user: {
      id: string;
      username: string | null;
      totalStreak: number;
    } & DefaultSession["user"];
  }

  /**
   * Extende o tipo 'User' retornado pelo authorize e providers
   */
  interface User {
    id: string;
    username: string | null;
    totalStreak: number;
  }
}

declare module "next-auth/jwt" {
  /**
   * Extende o tipo do token JWT para incluir o id, username e streak
   */
  interface JWT {
    id: string;
    username: string | null;
    totalStreak: number;
  }
}
