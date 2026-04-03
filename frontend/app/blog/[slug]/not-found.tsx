/**
 * Custom 404 for blog/[slug] — shown when notFound() is called.
 */

import Link from 'next/link'

export default function ArticleNotFound() {
  return (
    <main>
      <h1>Article not found</h1>
      <p>
        This article may have been moved, unpublished, or the URL may be incorrect.
      </p>
      <Link href="/blog">← Back to all articles</Link>
    </main>
  )
}
