/**
 * app/services/[slug]/page.tsx
 *
 * Dynamic route for service landing pages.
 * Data source: Sanity `servicePage` document (status == "published" only).
 *
 * Rendering strategy: ISR — same as blog/[slug].
 *   revalidate = 3600 (service pages change infrequently; manual publish is typical)
 *
 * What this page renders:
 *   - Page title + tagline
 *   - Full HTML body
 *   - FAQ section (if faq_pairs present)
 *   - Service JSON-LD + FAQPage JSON-LD
 *   - Meta title + description
 *
 * Related articles from the same cluster are NOT rendered here yet.
 * Add a <RelatedArticles cluster={page.primaryKeyword} /> component in a future pass.
 */

import type { Metadata }         from 'next'
import { notFound }              from 'next/navigation'
import ArticleBody               from '@/components/ArticleBody'
import FaqSection                from '@/components/FaqSection'
import SchemaScript              from '@/components/SchemaScript'
import {
  getServicePageBySlug,
  getAllServiceSlugs,
}                                from '@/lib/sanity/queries'

// ─── ISR config ───────────────────────────────────────────────────────────────

export const revalidate    = 3600
export const dynamicParams = false

// ─── Static params ────────────────────────────────────────────────────────────

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const slugs = await getAllServiceSlugs()
  return slugs.map(({ slug }) => ({ slug }))
}

// ─── Metadata ─────────────────────────────────────────────────────────────────

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const page = await getServicePageBySlug(slug)

  if (!page) {
    return {
      title:       'Service Not Found',
      description: 'The requested service page could not be found.',
    }
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? ''

  return {
    title:       page.metaTitle,
    description: page.metaDescription,
    openGraph: {
      title:       page.metaTitle,
      description: page.metaDescription,
      type:        'website',
      url:         `${siteUrl}/services/${page.slug}`,
    },
    alternates: {
      canonical: `${siteUrl}/services/${page.slug}`,
    },
  }
}

// ─── Service JSON-LD builder ──────────────────────────────────────────────────

function buildServiceJsonLd(page: NonNullable<Awaited<ReturnType<typeof getServicePageBySlug>>>) {
  const siteUrl  = process.env.NEXT_PUBLIC_SITE_URL  ?? ''
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME ?? ''

  return {
    '@context':   'https://schema.org',
    '@type':      'Service',
    name:          page.title,
    description:   page.metaDescription,
    url:           `${siteUrl}/services/${page.slug}`,
    provider: {
      '@type': 'Organization',
      name:    siteName,
      url:     siteUrl,
    },
    ...(page.aeoQuestion
      ? { potentialAction: { '@type': 'SearchAction', query: page.aeoQuestion } }
      : {}),
  }
}

// ─── Page component ───────────────────────────────────────────────────────────

export default async function ServicePage({ params }: Props) {
  const { slug } = await params
  const page     = await getServicePageBySlug(slug)

  if (!page) notFound()

  const hasFaq      = Array.isArray(page.faqPairs) && page.faqPairs.length > 0
  const hasBody     = Boolean(page.body?.trim())

  // Service pages have their schemaPackJson injected if present.
  // If not (e.g. manually created service pages), FaqSection handles its own JSON-LD.
  const hasSchemaPackJson = Boolean(page.schemaPackJson)

  return (
    <>
      {/* Structured data — Service schema + optional FAQPage from schemaPackJson */}
      <SchemaScript
        jsonLd={buildServiceJsonLd(page)}
        schemaPackJson={page.schemaPackJson}
      />

      <main>
        {/* Page header */}
        <header>
          <h1>{page.title}</h1>
          {page.tagline && <p>{page.tagline}</p>}
        </header>

        {/* Page body — full HTML */}
        {hasBody && (
          <ArticleBody
            body={page.body}
            internalLinkMap={[]}
          />
        )}

        {/* FAQ section */}
        {hasFaq && (
          <FaqSection
            pairs={page.faqPairs!}
            injectJsonLd={!hasSchemaPackJson}
          />
        )}
      </main>
    </>
  )
}
