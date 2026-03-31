# Wordle Premium

A beautifully designed Wordle clone built with Next.js 14, featuring buttery smooth animations, an abyssal dark theme with ASCII tornado and particle starfield effects.

## Features

- 🎮 **Two Game Modes**: Daily challenge (same word for everyone) and Unlimited practice mode
- 🔐 **User Authentication**: Sign in with email/password or OAuth (Google, GitHub)
- 📊 **Statistics Tracking**: Games played, win percentage, streaks, guess distribution
- ✨ **Beautiful Animations**: Tile flips, shakes, bounces, and win celebrations
- 🌌 **Stunning Visuals**: Abyssal black background with ASCII tornado and particle starfield
- 📱 **Responsive Design**: Works great on desktop and mobile
- ☁️ **Cloud Sync**: Your stats sync across devices when signed in

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Database**: MongoDB with Mongoose
- **Authentication**: NextAuth.js
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ installed
- MongoDB database (local or MongoDB Atlas)

### Installation

1. Clone or navigate to the project directory:
   ```bash
   cd wordle
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file (copy from `.env.local.example`):
   ```bash
   cp .env.local.example .env.local
   ```

4. Update the environment variables in `.env.local`:
   ```env
   MONGODB_URI=your-mongodb-connection-string
   NEXTAUTH_SECRET=your-secret-key
   NEXTAUTH_URL=http://localhost:3000
   
   # Optional: OAuth providers
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   GITHUB_CLIENT_ID=your-github-client-id
   GITHUB_CLIENT_SECRET=your-github-client-secret
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Deployment to Vercel

1. Push your code to a GitHub repository

2. Connect your repository to Vercel

3. Add the environment variables in Vercel's project settings:
   - `MONGODB_URI`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL` (set to your production URL)
   - OAuth credentials if using

4. Deploy!

## MongoDB Setup

### Using MongoDB Atlas (Recommended for production)

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Get your connection string and add it to `MONGODB_URI`

### Using Local MongoDB

1. Install MongoDB Community Edition
2. Start MongoDB service
3. Use `mongodb://localhost:27017/wordle` as your `MONGODB_URI`

## Project Structure

```
wordle/
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── api/            # API routes
│   │   ├── auth/           # Authentication pages
│   │   ├── globals.css     # Global styles
│   │   ├── layout.tsx      # Root layout
│   │   └── page.tsx        # Home page
│   ├── components/         # React components
│   │   ├── Background/     # Visual effects
│   │   ├── Board.tsx       # Game board
│   │   ├── Tile.tsx        # Individual tiles
│   │   └── Keyboard.tsx    # Virtual keyboard
│   ├── context/            # React contexts
│   ├── hooks/              # Custom hooks
│   ├── lib/                # Utilities and configs
│   ├── models/             # MongoDB models
│   └── types/              # TypeScript types
├── public/                 # Static assets
└── package.json
```

## License

MIT
