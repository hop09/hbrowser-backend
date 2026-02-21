import type { Metadata } from 'next'
import { Outfit } from 'next/font/google'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import './globals.css'

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
})

export const metadata: Metadata = {
  title: 'HBrowser | High Stakes Privacy & Antidetect',
  description: 'The ultimate antidetect browser for high-stakes privacy. Securely manage multiple profiles with advanced fingerprint protection.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${outfit.variable} font-sans antialiased bg-white text-black dark:bg-neutral-950 dark:text-white transition-colors duration-300 min-h-screen flex flex-col`}>
        <Header />

        <main className="flex-1 w-full mx-auto relative pt-24">
          {children}
        </main>

        <Footer />
      </body>
    </html>
  )
}
