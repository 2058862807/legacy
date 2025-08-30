import './globals.css'
import { Inter } from 'next/font/google'
import { Providers } from '../components/Providers'
import { MetaMaskProvider } from '../components/Wallet/MetaMaskProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'NexteraEstate - Secure Estate Planning with AI & Blockchain',
  description: 'Professional estate planning platform with 50-state compliance, AI assistance, blockchain notarization, and secure document management.',
  keywords: 'estate planning, will, trust, legal documents, blockchain, AI assistant, compliance, notarization',
  authors: [{ name: 'NexteraEstate' }],
  creator: 'NexteraEstate',
  publisher: 'NexteraEstate',
  robots: 'index, follow',
  openGraph: {
    title: 'NexteraEstate - Secure Estate Planning',
    description: 'Professional estate planning with AI, blockchain security, and 50-state legal compliance.',
    url: 'https://nexteraestate.com',
    siteName: 'NexteraEstate',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NexteraEstate - Secure Estate Planning',
    description: 'Professional estate planning with AI, blockchain security, and 50-state legal compliance.',
  },
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#2563eb',
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