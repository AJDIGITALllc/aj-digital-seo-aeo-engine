/**
 * On-demand ISR revalidation endpoint.
 * Called by a Sanity webhook whenever an article or service page is published.
 *
 * Sanity webhook setup:
 *   URL:    https://yourdomain.com/api/revalidate?secret=YOUR_REVALIDATE_SECRET
 *   Filter: _type in ["article", "servicePage"] && status == "published"
 *   HTTP method: POST
 *
 * Revalidates the specific slug path that changed.
 * Falls back to full revalidation tag if no slug is present.
 */

import { revalidatePath, revalidateTag } from 'next/cache'
import { type NextRequest, NextResponse }  from 'next/server'

interface SanityWebhookBody {
  _type?: string
  slug?:  { current?: string } | string
  status?: string
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  // 1. Validate secret
  const secret = request.nextUrl.searchParams.get('secret')
  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: 'Invalid revalidation secret.' }, { status: 401 })
  }

  // 2. Parse Sanity webhook body
  let body: SanityWebhookBody = {}
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 })
  }

  const docType = body._type
  const rawSlug = typeof body.slug === 'object' ? body.slug?.current : body.slug

  // 3. Revalidate the specific path
  if (docType === 'article' && rawSlug) {
    revalidatePath(`/blog/${rawSlug}`)
    return NextResponse.json({
      revalidated: true,
      path: `/blog/${rawSlug}`,
      ts: Date.now(),
    })
  }

  if (docType === 'servicePage' && rawSlug) {
    revalidatePath(`/services/${rawSlug}`)
    return NextResponse.json({
      revalidated: true,
      path: `/services/${rawSlug}`,
      ts: Date.now(),
    })
  }

  // 4. Fallback: revalidate all blog and service paths
  revalidatePath('/blog', 'layout')
  revalidatePath('/services', 'layout')
  return NextResponse.json({
    revalidated: true,
    path: 'all (fallback)',
    ts: Date.now(),
  })
}
