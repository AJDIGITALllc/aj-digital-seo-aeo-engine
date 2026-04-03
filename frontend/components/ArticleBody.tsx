/**
 * ArticleBody — renders the raw HTML body from Sanity.
 *
 * Responsibilities:
 *   1. Resolve [LINK: /path/ | anchor: text] placeholders → <a> tags
 *   2. Render the resolved HTML via dangerouslySetInnerHTML
 *
 * Security note:
 *   Content originates from Claude via the AJ Digital engine — treated as
 *   trusted. For user-generated content, pipe through DOMPurify first.
 *   Add: import DOMPurify from 'isomorphic-dompurify'
 *        const clean = DOMPurify.sanitize(resolvedHtml)
 *
 * Styling note:
 *   The article-body class is intentionally unstyled here.
 *   Add global CSS targeting .article-body h2, .article-body p etc.
 *   or use @tailwindcss/typography: <div className="prose lg:prose-xl ...">
 */

import type { InternalLink } from '@/lib/sanity/types'

interface ArticleBodyProps {
  body: string
  internalLinkMap?: InternalLink[]
  className?: string
}

/**
 * Replace [LINK: /url/ | anchor: text] placeholders with real <a> tags.
 * Prefers resolvedUrl over suggestedUrl when available.
 * Falls back to stripping the placeholder if neither URL exists.
 */
function resolveInternalLinks(html: string, linkMap: InternalLink[]): string {
  // Pattern: [LINK: /path/ | anchor: some text]
  const LINK_PLACEHOLDER = /\[LINK:\s*([^\|]+)\|\s*anchor:\s*([^\]]+)\]/gi

  // Build a lookup map: placeholder → resolved URL + anchor
  // Using the stored linkMap entries for precise matching when available,
  // falling back to regex extraction from the placeholder text itself.
  const resolved = new Map<string, { url: string; anchor: string }>()

  for (const link of linkMap) {
    const url = link.resolvedUrl ?? link.suggestedUrl
    if (url && link.anchorText) {
      // Normalise whitespace so slight formatting differences don't break matching
      resolved.set(link.placeholder.trim(), { url, anchor: link.anchorText })
    }
  }

  return html.replace(LINK_PLACEHOLDER, (fullMatch, rawUrl, rawAnchor) => {
    // Try exact match from linkMap first
    const fromMap = resolved.get(fullMatch.trim())
    if (fromMap) {
      return `<a href="${escapeAttr(fromMap.url)}">${escapeHtml(fromMap.anchor)}</a>`
    }
    // Fallback: use values extracted from the placeholder itself
    const url    = rawUrl?.trim()
    const anchor = rawAnchor?.trim()
    if (url && anchor) {
      return `<a href="${escapeAttr(url)}">${escapeHtml(anchor)}</a>`
    }
    // Last resort: drop the placeholder entirely
    return ''
  })
}

function escapeAttr(value: string): string {
  return value.replace(/"/g, '&quot;').replace(/'/g, '&#39;')
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

export default function ArticleBody({
  body,
  internalLinkMap = [],
  className,
}: ArticleBodyProps) {
  const resolvedHtml = internalLinkMap.length > 0
    ? resolveInternalLinks(body, internalLinkMap)
    : body

  return (
    <div
      className={className ?? 'article-body'}
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: resolvedHtml }}
    />
  )
}
