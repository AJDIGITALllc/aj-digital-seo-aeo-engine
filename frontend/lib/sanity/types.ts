/**
 * TypeScript types for Sanity document projections used by the frontend.
 *
 * These are NOT full document types — they are the projected shapes
 * returned by each GROQ query. Field names match the Sanity schema exactly.
 * See sanity/schemas/ for the canonical schema definitions.
 */

// ─── Shared sub-types ─────────────────────────────────────────────────────────

export interface FaqPair {
  question: string
  answer: string
}

export interface InternalLink {
  placeholder: string
  suggestedUrl: string
  anchorText: string
  linkType?: 'service' | 'blog' | 'resource' | 'cta' | 'other'
  resolved?: boolean
  resolvedUrl?: string | null
}

export interface SchemaPackJson {
  faqSchema?: {
    '@context': 'https://schema.org'
    '@type': 'FAQPage'
    mainEntity: Array<{
      '@type': 'Question'
      name: string
      acceptedAnswer: { '@type': 'Answer'; text: string }
    }>
  }
  [key: string]: unknown
}

// ─── Article (full — used by blog/[slug]) ────────────────────────────────────

export interface SanityArticle {
  _id: string
  title: string
  slug: string                    // GROQ projection: "slug": slug.current
  keyword: string
  cluster?: string
  intent?: string
  metaTitle: string
  metaDescription: string
  body: string                    // Raw HTML from Claude
  wordCountEstimate?: number
  readingTimeMinutes?: number
  aeoAnswerBlock?: string
  namedFrameworks?: string[]
  faqPairs?: FaqPair[]
  schemaTypes?: string[]
  schemaPackJson?: string         // Serialized JSON — parse before use
  internalLinkMap?: InternalLink[]
  aeoScore?: number
  publishedAt?: string
  updatedAt?: string
}

// ─── Article card (list — used by blog index, related articles) ──────────────

export interface SanityArticleCard {
  _id: string
  title: string
  slug: string
  keyword: string
  cluster?: string
  metaTitle: string
  metaDescription: string
  aeoAnswerBlock?: string
  publishedAt?: string
  aeoScore?: number
}

// ─── Service page (full — used by services/[slug]) ───────────────────────────

export interface SanityServicePage {
  _id: string
  title: string
  slug: string                    // GROQ projection: "slug": slug.current
  tagline?: string
  metaTitle: string
  metaDescription: string
  primaryKeyword?: string
  aeoQuestion?: string
  body: string
  faqPairs?: FaqPair[]
  schemaTypes?: string[]
  schemaPackJson?: string
  publishedAt?: string
  updatedAt?: string
}

// ─── Slug-only shape (used by generateStaticParams) ──────────────────────────

export interface SlugOnly {
  slug: string
}
