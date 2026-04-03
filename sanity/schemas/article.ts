/**
 * AJ Digital SEO/AEO Engine — Sanity Schema: article
 *
 * Created by W-02 Article Generator (Claude output → AEO Validator → Sanity write).
 * One document per keyword per client. _id is deterministic:
 *   article-{clientSlug}-{keyword-slugified}
 *
 * Status flow:
 *   draft → pending_approval → approved → published
 *             ↓                              ↑
 *        needs_revision ─────────────────────┘
 *             ↓
 *          killed / archived
 *
 * Performance fields (clicks, impressions, position, citations) are
 * updated weekly by W-04 Feedback Collector via Sanity PATCH.
 */

import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'article',
  title: 'Article',
  type: 'document',

  groups: [
    { name: 'content',     title: 'Content',        default: true },
    { name: 'seo',         title: 'SEO / AEO'                     },
    { name: 'schema',      title: 'Structured Data'               },
    { name: 'performance', title: 'Performance'                    },
    { name: 'validation',  title: 'Validation'                    },
    { name: 'meta',        title: 'Meta / Status'                 },
  ],

  fields: [
    // ─── IDENTITY ─────────────────────────────────────────────────────────────

    defineField({
      name: 'title',
      title: 'H1 Title',
      type: 'string',
      group: 'content',
      description: 'The article H1. Set by Claude — maps to article_json.h1.',
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
      name: 'keyword',
      title: 'Primary Keyword',
      type: 'string',
      group: 'seo',
      validation: Rule => Rule.required()
    }),

    defineField({
      name: 'cluster',
      title: 'Topic Cluster',
      type: 'string',
      group: 'seo',
      description: 'Inherited from the source contentBrief. Values per deployment-config.json.',
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
      name: 'brief',
      title: 'Source Content Brief',
      type: 'reference',
      group: 'meta',
      to: [{ type: 'contentBrief' }],
      description: 'The contentBrief document that triggered this article generation.'
    }),

    // ─── STATUS ───────────────────────────────────────────────────────────────

    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      group: 'meta',
      options: {
        list: [
          { title: 'Draft',             value: 'draft'            },
          { title: 'Pending Approval',  value: 'pending_approval' },
          { title: 'Needs Revision',    value: 'needs_revision'   },
          { title: 'Approved',          value: 'approved'         },
          { title: 'Published',         value: 'published'        },
          { title: 'Killed',            value: 'killed'           },
          { title: 'Archived',          value: 'archived'         },
        ],
        layout: 'dropdown',
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
      description: 'Max 60 chars. Primary keyword front-loaded. Maps to article_json.meta_title.',
      validation: Rule => Rule.required().max(60)
    }),

    defineField({
      name: 'metaDescription',
      title: 'Meta Description',
      type: 'text',
      rows: 3,
      group: 'seo',
      description: '140–160 chars. Starts with keyword, ends with benefit or CTA. Maps to article_json.meta_description.',
      validation: Rule => Rule.required().min(100).max(165)
    }),

    defineField({
      name: 'intent',
      title: 'Search Intent',
      type: 'string',
      group: 'seo',
      options: {
        list: [
          { title: 'Informational',  value: 'informational'  },
          { title: 'Commercial',     value: 'commercial'     },
          { title: 'Transactional',  value: 'transactional'  },
          { title: 'Local',          value: 'local'          },
        ]
      }
    }),

    // ─── CONTENT ──────────────────────────────────────────────────────────────

    defineField({
      name: 'body',
      title: 'Article Body (HTML)',
      type: 'text',
      rows: 30,
      group: 'content',
      description: 'Full HTML body from Claude. Maps to article_json.article_html.',
      validation: Rule => Rule.required().min(500)
    }),

    defineField({
      name: 'wordCountEstimate',
      title: 'Word Count',
      type: 'number',
      group: 'content',
      validation: Rule => Rule.min(1)
    }),

    defineField({
      name: 'readingTimeMinutes',
      title: 'Reading Time (minutes)',
      type: 'number',
      group: 'content',
      validation: Rule => Rule.min(1)
    }),

    defineField({
      name: 'aeoAnswerBlock',
      title: 'AEO Answer Block',
      type: 'text',
      rows: 4,
      group: 'seo',
      description: 'The single best 40–75 word block for AI citation. Maps to article_json.aeo_answer_block.'
    }),

    defineField({
      name: 'namedFrameworks',
      title: 'Named Frameworks',
      type: 'array',
      group: 'content',
      of: [{ type: 'string' }],
      description: 'All named frameworks referenced in the article. Maps to article_json.named_frameworks.'
    }),

    // ─── FAQ ──────────────────────────────────────────────────────────────────

    defineField({
      name: 'faqPairs',
      title: 'FAQ Pairs',
      type: 'array',
      group: 'seo',
      description: 'Minimum 6. Maps 1:1 to FAQPage JSON-LD schema.',
      of: [
        {
          type: 'object',
          name: 'faqPair',
          title: 'FAQ Pair',
          fields: [
            defineField({
              name: 'question',
              title: 'Question',
              type: 'string',
              validation: Rule => Rule.required()
            }),
            defineField({
              name: 'answer',
              title: 'Answer',
              type: 'text',
              rows: 3,
              description: '40–75 words. Self-contained. Direct.',
              validation: Rule => Rule.required()
            }),
          ],
          preview: {
            select: { title: 'question', subtitle: 'answer' }
          }
        }
      ],
      validation: Rule => Rule.min(6)
    }),

    // ─── INTERNAL LINKING ─────────────────────────────────────────────────────

    defineField({
      name: 'internalLinkMap',
      title: 'Internal Link Map',
      type: 'array',
      group: 'content',
      description: 'Exactly 4 internal link placeholders resolved to site URLs.',
      of: [
        {
          type: 'object',
          name: 'internalLink',
          title: 'Internal Link',
          fields: [
            defineField({ name: 'placeholder',    title: 'Placeholder',     type: 'string'  }),
            defineField({ name: 'suggestedUrl',   title: 'Suggested URL',   type: 'string'  }),
            defineField({ name: 'anchorText',     title: 'Anchor Text',     type: 'string'  }),
            defineField({
              name: 'linkType',
              title: 'Link Type',
              type: 'string',
              options: {
                list: [
                  { title: 'Service',  value: 'service'  },
                  { title: 'Blog',     value: 'blog'     },
                  { title: 'Resource', value: 'resource' },
                  { title: 'CTA',      value: 'cta'      },
                  { title: 'Other',    value: 'other'    },
                ]
              }
            }),
            defineField({ name: 'resolved',    title: 'Resolved',    type: 'boolean', initialValue: false }),
            defineField({ name: 'resolvedUrl', title: 'Resolved URL', type: 'string'  }),
          ],
          preview: {
            select: { title: 'anchorText', subtitle: 'suggestedUrl', resolved: 'resolved' },
            prepare({ title, subtitle, resolved }) {
              return { title, subtitle: `${resolved ? '✅' : '⏳'} ${subtitle}` }
            }
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
      description: 'e.g. ["Article", "FAQPage"]. Maps to article_json.schema_types.',
      validation: Rule => Rule.required().min(1)
    }),

    defineField({
      name: 'schemaPackJson',
      title: 'Schema Pack (JSON-LD, serialized)',
      type: 'text',
      rows: 6,
      group: 'schema',
      description: 'Full JSON-LD pack serialized as string. Rendered in <head> by CMS.'
    }),

    // ─── AEO SCORES ───────────────────────────────────────────────────────────

    defineField({
      name: 'aeoScore',
      title: 'AEO Score (0–100)',
      type: 'number',
      group: 'validation',
      description: 'Composite AEO quality score from validator. Required for routing.',
      validation: Rule => Rule.required().min(0).max(100)
    }),

    defineField({
      name: 'aeoScoreComponents',
      title: 'AEO Score Components',
      type: 'object',
      group: 'validation',
      description: 'Per-check scores from AEO Validator for audit transparency.',
      fields: [
        defineField({ name: 'h2Count',          title: 'H2 Count',               type: 'number' }),
        defineField({ name: 'hasFaqSection',    title: 'Has FAQ Section (0/1)',   type: 'number' }),
        defineField({ name: 'faqPairCount',     title: 'FAQ Pair Count',          type: 'number' }),
        defineField({ name: 'answerFirstRatio', title: 'Answer-First Ratio',      type: 'number' }),
        defineField({ name: 'questionH2Ratio',  title: 'Question H2 Ratio',       type: 'number' }),
        defineField({ name: 'hasAuthorBlock',   title: 'Has Author Block (0/1)',  type: 'number' }),
        defineField({ name: 'hasNamedFramework',title: 'Has Named Framework(0/1)',type: 'number' }),
        defineField({ name: 'hasComparisonTable',title: 'Has Comparison Table(0/1)',type: 'number'}),
        defineField({ name: 'internalLinkCount',title: 'Internal Link Count',     type: 'number' }),
        defineField({ name: 'wordCount',        title: 'Word Count',              type: 'number' }),
        defineField({ name: 'metaTitleLength',  title: 'Meta Title Length',       type: 'number' }),
        defineField({ name: 'metaDescLength',   title: 'Meta Desc Length',        type: 'number' }),
      ]
    }),

    // ─── VALIDATION RECORD ────────────────────────────────────────────────────

    defineField({
      name: 'validationPassed',
      title: 'AEO Validation Passed',
      type: 'boolean',
      group: 'validation'
    }),

    defineField({
      name: 'validationIssues',
      title: 'Blocking Issues',
      type: 'array',
      group: 'validation',
      of: [{ type: 'string' }]
    }),

    defineField({
      name: 'validationWarnings',
      title: 'Validation Warnings',
      type: 'array',
      group: 'validation',
      of: [{ type: 'string' }]
    }),

    // ─── PERFORMANCE (written by W-04) ────────────────────────────────────────

    defineField({
      name: 'performance',
      title: 'Latest GSC Performance',
      type: 'object',
      group: 'performance',
      description: 'Updated weekly by W-04 Feedback Collector via Sanity PATCH.',
      fields: [
        defineField({ name: 'clicks',          title: 'Clicks (7d)',          type: 'number' }),
        defineField({ name: 'impressions',     title: 'Impressions (7d)',     type: 'number' }),
        defineField({ name: 'avgPosition',     title: 'Avg Position',         type: 'number' }),
        defineField({ name: 'ctr',             title: 'CTR',                  type: 'number' }),
        defineField({ name: 'clicksDelta',     title: 'Clicks Δ (vs prev 7d)', type: 'number' }),
        defineField({ name: 'impressionsDelta',title: 'Impressions Δ',        type: 'number' }),
        defineField({ name: 'positionDelta',   title: 'Position Δ',           type: 'number' }),
        defineField({ name: 'trend',           title: 'Trend',                type: 'string' }),
        defineField({ name: 'citationCount',   title: 'AI Citations',         type: 'number' }),
        defineField({ name: 'citationRate',    title: 'Citation Rate',        type: 'number' }),
        defineField({ name: 'lastChecked',     title: 'Last Checked',         type: 'datetime' }),
      ]
    }),

    defineField({
      name: 'rewriteFlagged',
      title: 'Flagged for Rewrite',
      type: 'boolean',
      group: 'performance',
      description: 'Set by W-04 when Rule 2 (high impressions, low CTR) or Rule 3 (ranking, not cited) triggers.',
      initialValue: false
    }),

    defineField({
      name: 'rewriteReason',
      title: 'Rewrite Reason',
      type: 'text',
      rows: 2,
      group: 'performance'
    }),

    defineField({
      name: 'rewriteActions',
      title: 'Rewrite Actions',
      type: 'array',
      group: 'performance',
      of: [{ type: 'string' }],
      description: 'e.g. ["rewrite_title_meta", "inject_definition_answer_first"]'
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

  orderings: [
    {
      title: 'AEO Score (High → Low)',
      name: 'aeoScoreDesc',
      by: [{ field: 'aeoScore', direction: 'desc' }]
    },
    {
      title: 'Published (Newest First)',
      name: 'publishedDesc',
      by: [{ field: 'publishedAt', direction: 'desc' }]
    },
    {
      title: 'Status',
      name: 'statusAsc',
      by: [{ field: 'status', direction: 'asc' }]
    },
  ],

  preview: {
    select: {
      title:    'title',
      subtitle: 'status',
      aeoScore: 'aeoScore',
    },
    prepare({ title, subtitle, aeoScore }) {
      const icons: Record<string, string> = {
        draft: '📝', pending_approval: '👀', needs_revision: '🔴',
        approved: '✅', published: '🟢', killed: '💀', archived: '📦'
      }
      const icon = icons[subtitle] || '•'
      return {
        title: `${icon} ${title || '(untitled)'}`,
        subtitle: `${subtitle} | AEO: ${aeoScore ?? '—'}/100`
      }
    }
  }
})
