/**
 * Sanity client — read-only, published content only.
 *
 * Two client variants:
 *   client       — CDN-backed, for Server Components (fast, cached, public content)
 *   serverClient — direct API, bypasses CDN (use when you need fresh drafts or
 *                  private dataset access via SANITY_API_READ_TOKEN)
 *
 * Both clients are READ-ONLY. No token is required for published content
 * on a public dataset. For private datasets, set SANITY_API_READ_TOKEN.
 *
 * Never import these in Client Components — Sanity fetches belong in
 * Server Components or generateStaticParams/generateMetadata only.
 */

import { createClient, type SanityClient } from '@sanity/client'

const projectId  = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset    = process.env.NEXT_PUBLIC_SANITY_DATASET    ?? 'production'
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? '2024-01-01'

if (!projectId) {
  throw new Error(
    'Missing NEXT_PUBLIC_SANITY_PROJECT_ID. ' +
    'Copy .env.local.example to .env.local and set the value.'
  )
}

/**
 * CDN client — fastest option for published content.
 * Suitable for: page fetches, generateStaticParams, generateMetadata.
 * Cached by Sanity's global CDN — eventual consistency (~60s lag after publish).
 * For immediate consistency, trigger /api/revalidate via Sanity webhook.
 */
export const client: SanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  // Server-only read token — undefined in browser bundle (no NEXT_PUBLIC_ prefix)
  token: process.env.SANITY_API_READ_TOKEN,
  perspective: 'published', // never serve drafts to the frontend
})

/**
 * Direct API client — bypasses CDN.
 * Use in API routes (e.g. /api/revalidate) where you need fresh data.
 * Slower than CDN client — do not use in page render paths.
 */
export const serverClient: SanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_API_READ_TOKEN,
  perspective: 'published',
})

/**
 * Helper: typed fetch wrapper with automatic error surfacing.
 * Always returns null on "not found" (empty result) — caller handles notFound().
 */
export async function sanityFetch<T>(
  query: string,
  params: Record<string, string | number | boolean> = {}
): Promise<T | null> {
  try {
    const result = await client.fetch<T>(query, params)
    return result ?? null
  } catch (error) {
    // In development, surface full Sanity API errors
    if (process.env.NODE_ENV === 'development') {
      console.error('[sanityFetch] error:', error)
    }
    return null
  }
}
