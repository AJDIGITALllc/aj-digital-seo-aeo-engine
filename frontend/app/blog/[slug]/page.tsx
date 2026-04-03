/**
 * app/blog/[slug]/page.tsx
 *
 * Dynamic route for individual blog articles.
 * Data source: Sanity `article` document (status == "published" only).
 *
 * Rendering strategy: ISR (Static + revalidation)
 *   - generateStaticParams builds all published slugs at build time
 *   - revalidate = 3600 re-generates stale pages every hour
 *   - On-demand revalidation via /api/revalidate is the preferred path
 *     (trigger from Sanity webhook on article publish)
 *
 * What this page renders:
 *   - Full article HTML body (with internal link resolution)
 *   - FAQ section (if faq_pairs present)
 *   - Article JSON-LD + FAQPage JSON-LD (if schemaPackJson present)
 *   - Meta title + description via generateMetadata
 */

import type { Metadata }         from 'next'
import { notFound }              from 'next/navigation'
import ArticleBody               from '@/components/ArticleBody'
import FaqSection                from '@/components/FaqSection'
import SchemaScript              from '@/components/SchemaScript'
import {
  getArticleBySlug,
  getAllArticleSlugs,
}                                from '@/lib/sanity/queries'

// ─── ISR config ───────────────────────────────────────────────────────────────

/** Revalidate the cached page at most once per hour. */
export const revalidate = 3600

/**
 * Return 404 immediately for any slug not generated at build time,
 * rather than attempting an on-demand render.
 * Set to false to enable fallback SSR for new articles before the next build.
 */
export const dynamicParams = false

// ─── Static params ────────────────────────────────────────────────────────────

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const slugs = await getAllArticleSlugs()
  return slugs.map(({ slug }) => ({ slug }))
}

// ─── Metadata ─────────────────────────────────────────────────────────────────

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const article = await getArticleBySlug(slug)

  if (!article) {
    return {
      title:       'Article Not Found',
      description: 'The requested article could not be found.',
    }
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? ''

  return {
    title:       article.metaTitle,
    description: article.metaDescription,
    openGraph: {
      title:       article.metaTitle,
      description: article.metaDescription,
      type:        'article',
      url:         `${siteUrl}/blog/${article.slug}`,
      publishedTime: article.publishedAt,
      modifiedTime:  article.updatedAt,
    },
    alternates: {
      canonical: `${siteUrl}/blog/${article.slug}`,
    },
  }
}

// ─── Article JSON-LD builder ──────────────────────────────────────────────────

function buildArticleJsonLd(article: NonNullable<Awaited<ReturnType<typeof getArticleBySlug>>>) {
  const siteUrl  = process.env.NEXT_PUBLIC_SITE_URL  ?? ''
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME ?? ''

  return {
    '@context': 'https://schema.org',
    '@type':    'Article',
    headline:        article.title,
    description:     article.metaDescription,
    url:             `${siteUrl}/blog/${article.slug}`,
    ...(article.publishedAt ? { datePublished: article.publishedAt } : {}),
    ...(article.updatedAt   ? { dateModified:  article.updatedAt   } : {}),
    ...(article.wordCountEstimate ? { wordCount: article.wordCountEstimate } : {}),
    publisher: {
      '@type': 'Organization',
      name:    siteName,
      url:     siteUrl,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id':   `${siteUrl}/blog/${article.slug}`,
    },
  }
}

// ─── Page component ───────────────────────────────────────────────────────────

export default async function ArticlePage({ params }: Props) {
  const { slug }  = await params
  const article   = await getArticleBySlug(slug)

  if (!article) notFound()

  const hasFaq = Array.isArray(article.faqPairs) && article.faqPairs.length > 0

  return (
    <>
      {/* Structured data — Article schema + FAQPage from schemaPackJson */}
      <SchemaScript
        jsonLd={buildArticleJsonLd(article)}
        schemaPackJson={article.schemaPackJson}
      />

      <article>
        {/* Article header */}
        <header>
          <h1>{article.title}</h1>

          {(article.readingTimeMinutes || article.wordCountEstimate) && (
            <p aria-label="Article metadata">
              {article.readingTimeMinutes && (
                <span>{article.readingTimeMinutes} min read</span>
              )}
              {article.readingTimeMinutes && article.wordCountEstimate && (
                <span aria-hidden="true"> · </span>
              )}
              {article.wordCountEstimate && (
                <span>{article.wordCountEstimate.toLocaleString()} words</span>
              )}
            </p>
          )}

          {article.publishedAt && (
            <time dateTime={article.publishedAt}>
              {new Date(article.publishedAt).toLocaleDateString('en-US', {
                year:  'numeric',
                month: 'long',
                day:   'numeric',
              })}
            </time>
          )}
        </header>

        {/* Article body — resolves [LINK:...] placeholders */}
        <ArticleBody
          body={article.body}
          internalLinkMap={article.internalLinkMap}
        />

        {/* FAQ section — rendered below body, above footer */}
        {/* FAQ HTML — JSON-LD is injected by SchemaScript above via schemaPackJson */}
        {hasFaq && (
          <FaqSection
            pairs={article.faqPairs!}
            injectJsonLd={false}
          />
        )}
      </article>
    </>
  )
}
