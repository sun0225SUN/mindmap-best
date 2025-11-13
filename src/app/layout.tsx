import '@/styles/globals.css'
import '@/styles/view-transition.css'

import type { Metadata } from 'next'
import { Analytics } from '@/components/analytics'
import { ThemeProvider } from '@/components/theme/provider'

export const metadata: Metadata = {
  title: {
    default: 'Mindmap Best',
    template: '%s | Mindmap Best',
  },
  description:
    'A beautiful and powerful mindmap tool that converts Markdown to interactive mindmaps in real-time. Create, edit, and export mindmaps with ease.',
  keywords: [
    'mindmap',
    'mind map',
    'markdown',
    'visualization',
    'note taking',
    'brainstorming',
    'plait',
    'next.js',
    'interactive',
    'diagram',
    'tree diagram',
    'logic diagram',
  ],
  authors: [
    {
      name: 'sun0225SUN',
      url: 'https://github.com/sun0225SUN',
    },
  ],
  creator: 'sun0225SUN',
  publisher: 'sun0225SUN',
  metadataBase: new URL('https://mindmap-best.vercel.app'), // Update with your actual domain
  alternates: {
    canonical: '/',
    languages: {
      en: '/',
      'zh-CN': '/zh',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://mindmap.best',
    title: 'Mindmap Best - Convert Markdown to Interactive Mindmaps',
    description:
      'A beautiful and powerful mindmap tool that converts Markdown to interactive mindmaps in real-time.',
    siteName: 'Mindmap Best',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'Mindmap Best Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mindmap Best - Convert Markdown to Interactive Mindmaps',
    description:
      'A beautiful and powerful mindmap tool that converts Markdown to interactive mindmaps in real-time.',
    images: ['/logo.png'],
    creator: '@sun0225SUN',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.png', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    apple: [{ url: '/logo.png', type: 'image/png' }],
  },
  category: 'productivity',
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
        <Analytics />
      </body>
    </html>
  )
}
