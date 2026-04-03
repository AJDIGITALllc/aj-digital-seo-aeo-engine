/**
 * GROQ query helpers — all frontend data access goes through here.
 *
 * Rules:
 *   1. Every query filters status == "published" — drafts never reach the frontend.
 *   2. Projections are explicit — no `...` glob spreads (predictable shape, smaller payload).
 *   3. Exported functions wrap sanityFetch() — callers never touch the raw client.
 *   4. Slug projections always use "slug": slug.current so callers get a plain string.
 */

import { sanityFetch } from './client'
import type {
  SanityArticle,
  SanityArticleCard,
  SanityServicePage,
  SlugOnly,
} from './types'

// ─── Field projection fragments ───────────────────────────────────────────────

const ARTICLE_FULL = `
  _id,
  title,
  "slug": slug.current,
  keyword,
  cluster,
  intent,
  metaTitle,
  metaDescription,
  body,
  wordCountEstimate,
  readingTimeMinutes,
  aeoAnswerBlock,
  namedFrameworks,
  faqPairs[] {
    question,
    answer
  },
  schemaTypes,
  schemaPackJson,
  internalLinkMap[] {
    placeholder,
    suggestedUrl,
    anchorText,
    linkType,
    resolved,
    resolvedUrl
  },
  aeoScore,
  publishedAt,
  updatedAt
`

const ARTICLE_CARD = `
  _id,
  title,
  "slug": slug.current,
  keyword,
  cluster,
  metaTitle,
  metaDescription,
  aeoAnswerBlock,
  publishedAt,
  aeoScore
`

const SERVICE_FULL = `
  _id,
  title,
  "slug": slug.current,
  tagline,
  metaTitle,
  metaDescription,
  primaryKeyword,
  aeoQuestion,
  body,
  faqPairs[] {
    question,
    answer
  },
  schemaTypes,
  schemaPackJson,
  publishedAt,
  updatedAt
`

// ─── GROQ query strings (exported for debugging / Vision tool) ────────────────

/**
 * Single article by slug — published only.
 * Used by: app/blog/[slug]/page.tsx
 */
export const articleBySlugQuery = `
  *[_type == "article" && slug.current == $slug && status == "published"][0] {
    ${ARTICLE_FULL}
  }
`

/**
 * All published article slugs — for generateStaticParams.
 * Used by: app/blog/[slug]/page.tsx > generateStaticParams
 */
export const allArticleSlugsQuery = `
  *[_type == "article" && status == "published"] {
    "slug": slug.current
  }
`

/**
 * Paginated articles list — published, newest first.
 * Used by: app/blog/page.tsx (when built), related articles sections.
 * $from and $to are integer offsets (0-based).
 */
export const articlesListQuery = `
  *[_type == "article" && status == "published"] | order(publishedAt desc) [$from...$to] {
    ${ARTICLE_CARD}
  }
`

/**
 * Articles by cluster — for related-content sections.
 * Used by: service pages to show supporting blog articles for the same cluster.
 */
export const articlesByClusterQuery = `
  *[
    _type == "article" &&
    status == "published" &&
    cluster == $cluster &&
    slug.current != $excludeSlug
  ] | order(publishedAt desc) [0...6] {
    ${ARTICLE_CARD}
  }
`

/**
 * Single service page by slug — published only.
 * Used by: app/services/[slug]/page.tsx
 */
export const servicePageBySlugQuery = `
  *[_type == "servicePage" && slug.current == $slug && status == "published"][0] {
    ${SERVICE_FULL}
  }
`

/**
 * All published service page slugs — for generateStaticParams.
 * Used by: app/services/[slug]/page.tsx > generateStaticParams
 */
export const allServiceSlugsQuery = `
  *[_type == "servicePage" && status == "published"] {
    "slug": slug.current
  }
`

// ─── Typed fetch helpers ───────────────────────────────────────────────────────

/** Fetch a single published article by its slug. Returns null if not found. */
export async function getArticleBySlug(slug: string): Promise<SanityArticle | null> {
  return sanityFetch<SanityArticle>(articleBySlugQuery, { slug })
}

/** Fetch all published article slugs for static path generation. */
export async function getAllArticleSlugs(): Promise<SlugOnly[]> {
  return (await sanityFetch<SlugOnly[]>(allArticleSlugsQuery)) ?? []
}

/** Fetch paginated published articles, newest first. from/to are 0-based offsets. */
export async function getArticlesList(from = 0, to = 12): Promise<SanityArticleCard[]> {
  return (await sanityFetch<SanityArticleCard[]>(articlesListQuery, { from, to })) ?? []
}

/**
 * Fetch articles in the same cluster, excluding the current article.
 * Returns up to 6 cards for a "Related articles" section.
 */
export async function getRelatedArticles(
  cluster: string,
  excludeSlug: string
): Promise<SanityArticleCard[]> {
  return (
    (await sanityFetch<SanityArticleCard[]>(articlesByClusterQuery, {
      cluster,
      excludeSlug,
    })) ?? []
  )
}

/** Fetch a single published service page by its slug. Returns null if not found. */
export async function getServicePageBySlug(slug: string): Promise<SanityServicePage | null> {
  return sanityFetch<SanityServicePage>(servicePageBySlugQuery, { slug })
}

/** Fetch all published service page slugs for static path generation. */
export async function getAllServiceSlugs(): Promise<SlugOnly[]> {
  return (await sanityFetch<SlugOnly[]>(allServiceSlugsQuery)) ?? []
}
