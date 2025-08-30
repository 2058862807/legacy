import './globals.css'
import { SessionProvider } from 'next-auth/react'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'NexteraEstate - Secure Estate Planning',
  description: 'Secure estate planning with AI, payments, and blockchain compliance.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  )
}