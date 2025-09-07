import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/components/AuthProvider'
import Bot from '@/components/Bot'
import AIManagerAccess from '@/components/AIManagerAccess'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'NexteraEstate - Estate Planning Made Simple | AI & Blockchain Powered',
  description: 'Create your estate plan, notarize on Polygon, meet your state rules. Professional estate planning with 50-state compliance, AI assistance, and blockchain security.',
  keywords: 'estate planning, will creation, blockchain notarization, legal compliance, AI assistance',
  openGraph: {
    title: 'NexteraEstate - Estate Planning Made Simple',
    description: 'AI-powered estate planning with blockchain security and 50-state compliance',
    url: 'https://www.nexteraestate.com',
    siteName: 'NexteraEstate',
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
        <AuthProvider>
          {children}
          <Bot />
          <AIManagerAccess />
        </AuthProvider>
      </body>
    </html>
  )
}