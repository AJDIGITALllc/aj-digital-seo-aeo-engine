import type { NextConfig } from 'next'

const config: NextConfig = {
  // Enable React strict mode for catching hydration issues early
  reactStrictMode: true,

  // Allow Sanity CDN image URLs
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        pathname: '/images/**',
      },
    ],
  },

  // Explicit environment variable exposure to the browser
  // Only NEXT_PUBLIC_ prefixed vars are exposed to the client bundle
  env: {
    NEXT_PUBLIC_SANITY_PROJECT_ID: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? '',
    NEXT_PUBLIC_SANITY_DATASET:    process.env.NEXT_PUBLIC_SANITY_DATASET    ?? 'production',
    NEXT_PUBLIC_SANITY_API_VERSION:process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? '2024-01-01',
  },
}

export default config
