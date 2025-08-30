import './globals.css'
import { Inter } from 'next/font/google'
import { Providers } from '../components/Providers'

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
        <div id="__next">
          {children}
        </div>
      </body>
    </html>
  )
}