/**
 * Root layout — minimal shell. No UI redesign here.
 * Add nav, footer, and global styles in a future pass.
 */

import type { Metadata } from 'next'

const siteName = process.env.NEXT_PUBLIC_SITE_NAME ?? 'AJ Digital'
const siteUrl  = process.env.NEXT_PUBLIC_SITE_URL  ?? 'https://weareajdigital.com'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default:  siteName,
    template: `%s | ${siteName}`,
  },
  description: 'Digital marketing agency — SEO, web design, and AI content strategy.',
  robots: {
    index:  true,
    follow: true,
  },
  openGraph: {
    type:    'website',
    siteName,
    locale:  'en_US',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
