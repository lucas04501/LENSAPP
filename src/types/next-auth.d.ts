import "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      username?: string | null
      avatarUrl?: string | null
      xp?: number
      level?: number
      totalStreak?: number
    }
  }

  interface User {
    id: string
    name: string
    username: string
    email: string
    avatarUrl?: string | null
    xp?: number
    level?: number
    totalStreak?: number
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    sub: string
    username?: string | null
    avatarUrl?: string | null
    xp?: number
    level?: number
    totalStreak?: number
  }
}
