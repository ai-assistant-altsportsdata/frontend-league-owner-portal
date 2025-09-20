import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'League Onboarding - AltSports Data Platform',
  description: 'Progressive enhancement dropbox onboarding for sports leagues with data schema visualization',
  keywords: ['sports', 'league', 'onboarding', 'data', 'schema', 'analytics'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
          {children}
        </div>
      </body>
    </html>
  )
}