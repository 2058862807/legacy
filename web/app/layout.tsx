import './globals.css'
import { Inter } from 'next/font/google'
import { Providers } from '../components/Providers'
import { MetaMaskProvider } from '../components/Wallet/MetaMaskProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'NexteraEstate - Estate Planning Made Simple | AI & Blockchain Powered',
  description: 'Create your estate plan, notarize on Polygon, meet your state rules. Professional estate planning with 50-state compliance, AI assistance, and blockchain security.',
  keywords: 'estate planning, will, trust, legal documents, blockchain notarization, AI assistant, compliance, NexteraEstate, Polygon, Stripe payments',
  authors: [{ name: 'NexteraEstate LLC' }],
  creator: 'NexteraEstate LLC',
  publisher: 'NexteraEstate LLC',
  robots: 'index, follow',
  metadataBase: new URL('https://nexteraestate.com'),
  alternates: {
    canonical: 'https://nexteraestate.com',
  },
  openGraph: {
    title: 'NexteraEstate - Estate Planning Made Simple',
    description: 'Create your plan, notarize on Polygon, meet your state rules. Professional estate planning with AI guidance and blockchain security.',
    url: 'https://nexteraestate.com',
    siteName: 'NexteraEstate',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/logo.svg',
        width: 1200,
        height: 630,
        alt: 'NexteraEstate - Estate Planning Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NexteraEstate - Estate Planning Made Simple',
    description: 'Create your plan, notarize on Polygon, meet your state rules.',
    images: ['/logo.svg'],
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/logo.svg',
  },
  manifest: '/manifest.json',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={inter.className}>
        <Providers>
          <MetaMaskProvider>
            <div id="__next">
              {children}
            </div>
          </MetaMaskProvider>
        </Providers>
      </body>
    </html>
  )
}