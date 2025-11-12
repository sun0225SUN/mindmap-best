import '@/styles/globals.css'
import '@/styles/view-transition.css'

import type { Metadata } from 'next'
import { ThemeProvider } from '@/components/theme/provider'

export const metadata: Metadata = {
  title: 'Mindmap Best',
  description: 'A beautiful mindmap application built with Next.js and Plait',
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang='en'
      suppressHydrationWarning
    >
      <body>
        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          disableTransitionOnChange
          enableSystem
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
