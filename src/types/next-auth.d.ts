import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  /**
   * Extende o tipo 'user' dentro de 'session'
   */
  interface Session {
    user: {
      id: string;
      username?: string | null;
    } & DefaultSession["user"];
  }

  /**
   * Extende o tipo 'User' retornado pelo authorize
   */
  interface User {
    id: string;
    username?: string | null;
  }
}

declare module "next-auth/jwt" {
  /**
   * Extende o tipo do token JWT
   */
  interface JWT {
    id: string;
    username?: string | null;
  }
}
