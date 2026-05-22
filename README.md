# 🧠 LENS — Neuro-Oriented Hyper-Productivity Platform

<div align="center">

```
██╗     ███████╗███╗   ██╗███████╗
██║     ██╔════╝████╗  ██║██╔════╝
██║     █████╗  ██╔██╗ ██║███████╗
██║     ██╔══╝  ██║╚██╗██║╚════██║
███████╗███████╗██║ ╚████║███████║
╚══════╝╚══════╝╚═╝  ╚═══╝╚══════╝
```

**Master Your Mind. Own Your Time.**

*A habit tracking and deep work platform built from real personal transformation — not from theory.*

[![Next.js](https://img.shields.io/badge/Next.js_14-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://prisma.io)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://postgresql.org)

</div>

---

## 🌱 The Origin — Why LENS Exists

For years I lived what I now call **the loop** — waking up every day, working hard, spending everything, and going to sleep knowing nothing had actually changed. No direction. No habits. No system. Just noise.

Then something clicked. I started studying neuroscience, building habits, and learning about dopamine, discipline and consistency. I finished my high school diploma I'd been putting off for years. I built a mindset, a body, and eventually — **a new identity**.

LENS is the tool I **wish I had when I started**. Every feature maps directly to something that changed my life.

> *"If things continue the way they are, they're not going to lead anywhere."*
> *That sentence changed my trajectory. LENS is proof that it's possible to change.*
> — **Lucas, Creator of LENS**

---

## 📖 The E-Book Connection — *Vire a Chave*

LENS is the **companion app** to the e-book **Vire a Chave** (Turn the Key):

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│   📘 Vire a Chave (E-Book)                         │
│   ↳ The MINDSET: neuroscience, habits, clarity     │
│                                                     │
│   🧠 LENS (This App)                               │
│   ↳ The SYSTEM: track, gamify, evolve              │
│                                                     │
│   Together → Real, measurable transformation       │
│                                                     │
└─────────────────────────────────────────────────────┘
```

The e-book gives you the **why** and the **how**. LENS gives you the **daily system** to put it into practice and make it visible. One without the other is incomplete.

→ **[Get the E-Book](https://your-ebook-link.com)**

---

## ✨ Features

### 🔥 Habit Tracking
Daily check-ins with streak counters, categories, XP rewards and completion animations. Build the identity of someone who doesn't miss days.

### 📊 Habit Heatmap
A full-year GitHub-style consistency calendar. See your discipline at a glance — intensity from 0 to 4 completions per day, color-coded.

### ⚡ XP & Rank Gamification
7 dynamic ranks that evolve with you:

| Rank | XP Range | Color |
|------|----------|-------|
| `INITIATE` | 0 – 499 | ⬜ Gray |
| `BUILDER` | 500 – 1,499 | 🔵 Blue |
| `ARCHITECT OF FLOW` | 1,500 – 3,999 | 🟣 Purple |
| `DEEP WORKER` | 4,000 – 7,999 | 🟡 Gold |
| `GHOST MODE` | 8,000 – 14,999 | 🔵 Cyan |
| `NEURAL MASTER` | 15,000 – 29,999 | 🔴 Red |
| `TRANSCENDENT` | 30,000+ | ⚪ White |

### ⏱ Focus Timer
Deep Work (90min), Pomodoro (25min), Flow (60min) and Study (45min) modes. Matches your brain's natural attention cycle. Every minute earns XP.

### 💪 Gym Rats Social Feed
Post your progress, milestones and reflections. Like, comment, and tag your tribe. Your community is your most powerful habit.

### ⌘ Command Palette (Ctrl+K)
Navigate, create habits and start focus sessions instantly from anywhere in the app. Built for speed and flow state.

### 📈 Advanced Analytics
- Weekly bar charts (focus, habits, XP)
- Radar chart (discipline, focus, consistency, energy, clarity)
- Habit completion rate per habit
- XP growth over 12 weeks (area chart)

---

## 🏗 Architecture & Tech Stack

```
lens/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── dashboard/          # Main app pages
│   │   │   ├── page.tsx        # Dashboard
│   │   │   ├── habits/         # Habit management
│   │   │   ├── focus/          # Focus timer
│   │   │   ├── analytics/      # Charts & insights
│   │   │   └── social/         # Gym Rats feed
│   │   └── api/                # API Routes
│   ├── components/
│   │   ├── layout/             # Sidebar, Header, CommandPalette
│   │   ├── dashboard/          # Heatmap, Charts, StatsRow
│   │   ├── habits/             # HabitCheckList
│   │   └── gamification/       # XPCard
│   ├── store/                  # Zustand global state
│   ├── types/                  # TypeScript types + XP logic
│   └── lib/                    # Utilities + Prisma client
├── prisma/
│   ├── schema.prisma           # DB models
│   └── seed.ts                 # Initial data
└── ...config files
```

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 14 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS (custom design system) |
| **Database** | PostgreSQL via [Neon](https://neon.tech) or Supabase |
| **ORM** | Prisma |
| **Animations** | Framer Motion |
| **Charts** | Recharts |
| **State** | Zustand (persisted) |
| **Icons** | Lucide React |
| **Command Menu** | cmdk |
| **Auth** | NextAuth.js v4 |

---

## 🗄 Database Schema (simplified)

```prisma
model User {
  id            String         // cuid
  username      String         // @unique
  xp            Int            // total XP earned
  level         Int            // calculated from XP
  currentStreak Int            // active streak days
  rankId        String         // FK → Rank
  habits        Habit[]
  posts         Post[]
  sessions      FocusSession[]
}

model Habit {
  id            String
  title         String
  category      HabitCategory  // HEALTH | MIND | WORK | SOCIAL | FINANCE
  xpReward      Int
  currentStreak Int
  logs          HabitLog[]     // one per completed day
}

model Rank {
  name   String   // INITIATE → TRANSCENDENT
  minXP  Int
  maxXP  Int
  color  String   // hex color
}

// + Post, HabitLog, FocusSession, Follow, Like, Comment
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL database — free tier on [Neon](https://neon.tech) recommended

### 1. Clone & Install

```bash
git clone https://github.com/your-user/lens.git
cd lens
npm install
```

### 2. Environment Setup

```bash
cp .env.example .env
```

Edit `.env`:

```env
DATABASE_URL="your-postgresql-connection-string"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"
```

> 💡 **Tip:** Create a free database at [neon.tech](https://neon.tech). Works with Prisma out of the box.

### 3. Database Setup

```bash
npx prisma generate      # generate Prisma Client
npx prisma db push       # create all tables
npx tsx prisma/seed.ts   # populate with initial data
```

Expected output:
```
🌱 Seeding LENS database...
✅ Seed complete!
   → User: lucas@lens.app / password: lens123
   → 7 ranks created
   → 6 habits created
```

### 4. Run

```bash
npm run dev
```

Open **[http://localhost:3000/dashboard](http://localhost:3000/dashboard)**

---

## 🔑 Demo Credentials

```
Email:    lucas@lens.app
Password: lens123
Username: lucasCEO
XP:       1,620  →  Rank: ARCHITECT OF FLOW  →  Level 5
```

---

## 📜 Available Scripts

```bash
npm run dev             # development server
npm run build           # production build
npm run start           # start production server
npx prisma studio       # visual database browser
npx prisma db push      # sync schema to database
npx tsx prisma/seed.ts  # re-seed database
```

---

## 🗺 Roadmap

- [x] Dashboard with XP, stats and heatmap
- [x] Habit tracking with streaks and check-ins
- [x] Rank & XP gamification system (7 ranks)
- [x] Weekly analytics — bar, radar, area charts
- [x] Gym Rats social feed with likes and comments
- [x] Command Palette (Ctrl+K)
- [x] Glassmorphism UI with neon accents
- [x] Full auth — login & register pages
- [x] Focus timer — Pomodoro / Deep Work modes
- [x] Real-time data from database (Server Actions)
- [x] Push notifications for habit reminders
- [x] Mobile responsive layout
- [x] Deploy to Vercel

---

## 🎨 Design System

| Token | Value | Usage |
|-------|-------|-------|
| `background` | `#050505` | App background |
| `surface` | `#0D0D0D` | Card backgrounds |
| `purple` | `#A855F7` | Primary accent |
| `red` | `#EF4444` | Secondary accent |
| `gold` | `#F59E0B` | XP / warnings |
| `green` | `#22C55E` | Success / streaks |
| `text` | `#F0F0F0` | Primary text |
| `muted` | `#666666` | Secondary text |

**Visual effects:** Glassmorphism (`backdrop-blur`), neon glow (`box-shadow`), gradient text, subtle noise overlay.

---

## 🤝 Contributing

Contributions are welcome.

1. Fork the repository
2. Create your branch: `git checkout -b feat/your-feature`
3. Commit: `git commit -m 'feat: add your feature'`
4. Push: `git push origin feat/your-feature`
5. Open a Pull Request

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

---

<div align="center">

**Built with discipline. Designed for transformation.**

*LENS is the companion app to the e-book*
*[Vire a Chave](https://your-ebook-link.com) — a no-BS guide to breaking the loop.*

Made in Brazil 🇧🇷 by **[lucas04501](https://github.com/lucas04501)**

⭐ **Star this repo if LENS helped you level up**

</div>
