/**
 * AJ Digital SEO/AEO Engine — Sanity Schema: servicePage
 *
 * Service landing pages managed in Sanity.
 * Slug drives the route: app/services/[slug]/page.tsx
 * _id pattern: service-{clientSlug}-{slug}
 *
 * Separate from article — service pages are evergreen, not date-published.
 * Related articles are listed via GROQ query (no stored reference array needed).
 */

import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'servicePage',
  title: 'Service Page',
  type: 'document',

  groups: [
    { name: 'content', title: 'Content',   default: true },
    { name: 'seo',     title: 'SEO / AEO'               },
    { name: 'schema',  title: 'Structured Data'          },
    { name: 'meta',    title: 'Meta / Status'            },
  ],

  fields: [
    // ─── IDENTITY ─────────────────────────────────────────────────────────────

    defineField({
      name: 'title',
      title: 'Service Name (H1)',
      type: 'string',
      group: 'content',
      validation: Rule => Rule.required().max(80)
    }),

    defineField({
      name: 'slug',
      title: 'URL Slug',
      type: 'slug',
      group: 'meta',
      options: { source: 'title', maxLength: 96 },
      validation: Rule => Rule.required()
    }),

    defineField({
      name: 'clientSlug',
      title: 'Client Slug',
      type: 'string',
      group: 'meta',
      description: 'Matches CLIENT_SLUG env var.',
      validation: Rule => Rule.required()
    }),

    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
      group: 'content',
      description: 'One-line service sub-heading. Displayed below H1.',
      validation: Rule => Rule.max(120)
    }),

    // ─── STATUS ───────────────────────────────────────────────────────────────

    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      group: 'meta',
      options: {
        list: [
          { title: 'Draft',     value: 'draft'     },
          { title: 'Published', value: 'published' },
          { title: 'Archived',  value: 'archived'  },
        ],
        layout: 'radio',
      },
      initialValue: 'draft',
      validation: Rule => Rule.required()
    }),

    // ─── SEO META ─────────────────────────────────────────────────────────────

    defineField({
      name: 'metaTitle',
      title: 'Meta Title',
      type: 'string',
      group: 'seo',
      validation: Rule => Rule.required().max(60)
    }),

    defineField({
      name: 'metaDescription',
      title: 'Meta Description',
      type: 'text',
      rows: 3,
      group: 'seo',
      validation: Rule => Rule.required().min(100).max(165)
    }),

    defineField({
      name: 'primaryKeyword',
      title: 'Primary Keyword',
      type: 'string',
      group: 'seo',
      description: 'Main keyword this service page targets.'
    }),

    defineField({
      name: 'aeoQuestion',
      title: 'AEO Answer Question',
      type: 'text',
      rows: 2,
      group: 'seo',
      description: 'The top user question this service page directly answers.'
    }),

    // ─── CONTENT ──────────────────────────────────────────────────────────────

    defineField({
      name: 'body',
      title: 'Page Body (HTML)',
      type: 'text',
      rows: 30,
      group: 'content',
      description: 'Full HTML content. May include H2s, lists, tables.',
      validation: Rule => Rule.required().min(200)
    }),

    // ─── FAQ ──────────────────────────────────────────────────────────────────

    defineField({
      name: 'faqPairs',
      title: 'FAQ Pairs',
      type: 'array',
      group: 'seo',
      of: [
        {
          type: 'object',
          name: 'faqPair',
          title: 'FAQ Pair',
          fields: [
            defineField({ name: 'question', type: 'string', title: 'Question', validation: R => R.required() }),
            defineField({ name: 'answer',   type: 'text',   title: 'Answer',   rows: 3, validation: R => R.required() }),
          ],
          preview: {
            select: { title: 'question' }
          }
        }
      ]
    }),

    // ─── STRUCTURED DATA ──────────────────────────────────────────────────────

    defineField({
      name: 'schemaTypes',
      title: 'JSON-LD Schema Types',
      type: 'array',
      group: 'schema',
      of: [{ type: 'string' }],
      initialValue: ['Service', 'FAQPage']
    }),

    defineField({
      name: 'schemaPackJson',
      title: 'Schema Pack (JSON-LD, serialized)',
      type: 'text',
      rows: 6,
      group: 'schema',
      description: 'Serialized JSON-LD. Rendered in <head>.'
    }),

    // ─── TIMESTAMPS ───────────────────────────────────────────────────────────

    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      group: 'meta',
      readOnly: true
    }),

    defineField({
      name: 'updatedAt',
      title: 'Last Updated',
      type: 'datetime',
      group: 'meta',
      readOnly: true
    }),
  ],

  preview: {
    select: {
      title:  'title',
      status: 'status',
      slug:   'slug.current',
    },
    prepare({ title, status, slug }) {
      const icon = status === 'published' ? '🟢' : status === 'draft' ? '📝' : '📦'
      return {
        title:    `${icon} ${title}`,
        subtitle: `${status} | /services/${slug}`
      }
    }
  }
})
