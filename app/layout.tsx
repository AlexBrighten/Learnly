import type { Metadata } from 'next'
import { ThemeProvider } from '../components/theme/provider'
import { Analytics } from '../components/Analytics'
import { Toaster } from '../components/ui/sonner'
import { AuthProvider } from './context/AuthContext'

import { sharedMetadata } from '../configs/metadata'

import { fonts } from '../styles/fonts'
import '../styles/globals.css'
import Provider from './provider'

export const metadata: Metadata = {
  ...sharedMetadata,
  title: {
    template: '%s | Learnly',
    default: 'Learnly - Master Any Topic.',
  },
  description:
    'Master any subject with Learnly - the AI-powered learning app for everything you want to know!',
  keywords: ['Learnly', 'Learn', 'Study', 'AI', 'Courses', 'Education'],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${fonts} flex flex-col font-sans`}>
        <ThemeProvider attribute="class" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <Provider>
              {children}
            </Provider>
          </AuthProvider>
          <Toaster position="top-right" richColors />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
