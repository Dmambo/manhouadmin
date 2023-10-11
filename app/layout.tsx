import './globals.css'
import type { Metadata } from 'next'
import { Lexend } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import { ModalProvider } from '@/providers/modal-provider'
import { ToastProvider } from '@/providers/toast-provider'
import { ThemeProvider } from '@/providers/theme-provider'

const lexend = Lexend({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Manhou-admin',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
    <html lang="en">
      <body className={lexend.className}>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
        <ToastProvider />
        <ModalProvider />
        {children}
        </ThemeProvider>
        </body>
    </html>
    </ClerkProvider>
  )
}
