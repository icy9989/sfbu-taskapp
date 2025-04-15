import { Inter } from 'next/font/google'
import './globals.css'

import AuthProvider from '@/providers/auth-provider'
import { ToastProvider } from '@/providers/toast-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'မေမြန်မာ',
  description: 'May Myanmar Admin Application',
}

export default function RootLayout({
  children,
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <ToastProvider />
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
