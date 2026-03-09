// src/app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css' // Import global styles, including Tailwind

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Emoji Memory Game',
  description: 'A fun client-side memory matching game built with Next.js',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-900 text-white min-h-screen flex flex-col items-center justify-center p-4`}>
        {children}
      </body>
    </html>
  )
}