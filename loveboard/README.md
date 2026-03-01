# LoveBoard 💕

A cute long-distance relationship dashboard for couples. Share notes, care for a pet together, play mini-games, and keep your daily streaks alive — no matter the distance.

## Features

- **Auth** — Email/password registration and login via NextAuth.js
- **Couple Spaces** — Create a space and invite your partner with a unique code (max 2 members)
- **Love Notes** — CRUD sticky notes with color options
- **Daily Check-Ins** — Mood picker + optional message, with history view
- **Shared Pet** — Feed, play, water your Love Bug; watch it grow through 5 stages (Seed → Flourishing)
- **Memory Match** — Card-matching game with love-themed emojis and scoring
- **Love Trivia** — Answer questions about each other; add your own custom questions
- **Streaks** — Non-punitive daily streak tracking for check-ins, pet care, and notes
- **Cute UI** — Soft pastel palette, rounded cards, Framer Motion animations

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Prisma** + PostgreSQL
- **NextAuth.js** (credentials provider)
- **Tailwind CSS** (custom design tokens)
- **Framer Motion** (animations)
- **Zod** (input validation)
- **Jest** (unit tests)

## Setup

### 1. Clone and install

```bash
cd loveboard
npm install
```

### 2. Database

Option A — Docker:
```bash
docker compose up -d
```

Option B — Use any PostgreSQL instance and update the connection string.

### 3. Environment

```bash
cp .env.example .env
# Edit .env with your database URL and a secure NEXTAUTH_SECRET
```

### 4. Initialize database

```bash
npx prisma migrate dev --name init
npm run db:seed
```

### 5. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Sample accounts (after seeding)

| Email | Password |
|-------|----------|
| alice@example.com | password123 |
| bob@example.com | password123 |

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm test` | Run unit tests |
| `npm run lint` | Lint code |
| `npm run db:seed` | Seed sample data |
| `npm run db:studio` | Open Prisma Studio |

## Project Structure

```
loveboard/
├── prisma/
│   ├── schema.prisma       # Data model (9 models)
│   └── seed.ts             # Sample data
├── src/
│   ├── app/
│   │   ├── (marketing)/    # Landing page
│   │   ├── (auth)/         # Login + Register
│   │   ├── (app)/          # Authenticated pages
│   │   │   ├── dashboard/
│   │   │   ├── notes/
│   │   │   ├── checkins/
│   │   │   ├── pet/
│   │   │   └── games/
│   │   │       ├── memory-match/
│   │   │       └── love-trivia/
│   │   └── api/            # Route handlers
│   ├── components/
│   │   └── ui/             # CuteCard, MoodPicker, HeartButton, etc.
│   ├── lib/                # Business logic (auth, games, pet, streaks, invite)
│   ├── types/              # TypeScript types + next-auth augmentation
│   └── hooks/
├── tests/
│   └── unit/               # Jest tests (43 tests)
├── docker-compose.yml
└── .env.example
```

## Tests

```bash
npm test
```

43 unit tests covering:
- Streak calculation (consecutive days, resets, same-day dedup)
- Memory Match (board generation, pair matching, scoring)
- Love Trivia (score calculation)
- Pet care (decay over time, action effects, growth stages, stat caps)

## Future Improvements

- **Real-time updates** — WebSocket/SSE for live note and check-in sync
- **Push notifications** — Gentle daily reminders (not punitive)
- **Photo sharing** — Attach images to notes
- **Video calls** — Embedded WebRTC for in-app calls
- **More games** — Would You Rather, Drawing Together, Countdown Timer
- **Themes** — Customizable color palettes per couple
- **Mobile app** — React Native wrapper
- **OAuth providers** — Google/Apple sign-in
- **Timezone awareness** — Per-user timezone for accurate streak tracking
- **Pet species** — Choose between plant, cat, dog, bunny
- **Achievement badges** — Unlock milestones for streaks and game scores
