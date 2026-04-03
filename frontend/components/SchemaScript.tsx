/**
 * SchemaScript — injects JSON-LD structured data into <head>.
 *
 * Usage:
 *   // From schemaPackJson (Sanity field — serialized JSON string)
 *   <SchemaScript schemaPackJson={article.schemaPackJson} />
 *
 *   // Direct object (built in the page)
 *   <SchemaScript jsonLd={{ '@context': 'https://schema.org', '@type': 'Article', ... }} />
 *
 *   // Multiple JSON-LD blocks
 *   <SchemaScript jsonLd={[articleSchema, organizationSchema]} />
 *
 * Place inside Next.js <head> via generateMetadata or directly in the page.
 * In App Router, <script> tags rendered in the page component are
 * hoisted to <head> automatically when using next/head patterns.
 *
 * Schema pack structure (from sanity-write-article.js):
 *   { "faqSchema": { "@context": "https://schema.org", "@type": "FAQPage", ... } }
 */

import type { SchemaPackJson } from '@/lib/sanity/types'

type JsonLdObject = Record<string, unknown>

interface SchemaScriptProps {
  /** Raw serialized schemaPackJson string from the Sanity article/servicePage field. */
  schemaPackJson?: string | null
  /** Directly pass a JSON-LD object or array of objects. */
  jsonLd?: JsonLdObject | JsonLdObject[]
}

function parseSchemaPackJson(raw: string): JsonLdObject[] {
  try {
    const parsed: SchemaPackJson = JSON.parse(raw)
    const schemas: JsonLdObject[] = []
    // Extract each named schema from the pack object
    for (const key of Object.keys(parsed)) {
      const value = parsed[key]
      if (value && typeof value === 'object' && '@type' in (value as object)) {
        schemas.push(value as JsonLdObject)
      }
    }
    return schemas
  } catch {
    if (process.env.NODE_ENV === 'development') {
      console.warn('[SchemaScript] Failed to parse schemaPackJson:', raw?.slice(0, 100))
    }
    return []
  }
}

export default function SchemaScript({ schemaPackJson, jsonLd }: SchemaScriptProps) {
  const schemas: JsonLdObject[] = []

  // 1. Extract schemas from schemaPackJson string (Sanity field)
  if (schemaPackJson) {
    schemas.push(...parseSchemaPackJson(schemaPackJson))
  }

  // 2. Add directly passed JSON-LD objects
  if (jsonLd) {
    if (Array.isArray(jsonLd)) {
      schemas.push(...jsonLd)
    } else {
      schemas.push(jsonLd)
    }
  }

  if (schemas.length === 0) return null

  return (
    <>
      {schemas.map((schema, index) => (
        <script
          key={`schema-${schema['@type'] ?? index}`}
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema, null, process.env.NODE_ENV === 'development' ? 2 : 0),
          }}
        />
      ))}
    </>
  )
}
