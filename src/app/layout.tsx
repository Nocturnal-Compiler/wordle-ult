import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Wordle Premium - Play the Classic Word Game',
  description: 'A beautifully designed Wordle clone with smooth animations, daily challenges, and unlimited practice mode. Track your stats and compete with friends!',
  keywords: ['wordle', 'word game', 'puzzle', 'daily challenge', 'brain game'],
  authors: [{ name: 'Wordle Premium' }],
  openGraph: {
    title: 'Wordle Premium',
    description: 'A beautifully designed Wordle clone with smooth animations',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
