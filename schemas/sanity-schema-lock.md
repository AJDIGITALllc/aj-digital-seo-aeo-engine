# Sanity Schema Lock — AJ Digital SEO/AEO Engine

**Version:** 1.0
**Last updated:** 2026-04-03
**Status:** LOCKED — do not add optional fields without updating validators

This document defines the minimum required fields for every Sanity document type
used by the n8n workflows. Fields marked `required` will throw in the AEO validator
and Normalizer if missing. Fields marked `optional` are appended by workflows but
never depended on for routing decisions.

---

## Document Type: `contentBrief`

Created by W-01 (Intelligence Scan) when an opportunity is queued.

```javascript
// sanity/schemas/contentBrief.js
export default {
  name: 'contentBrief',
  title: 'Content Brief',
  type: 'document',
  fields: [
    // ─── REQUIRED (workflow will throw if absent) ───────────────────────────
    {
      name: 'keyword',
      title: 'Primary Keyword',
      type: 'string',
      validation: Rule => Rule.required().min(2).max(120)
    },
    {
      name: 'slug',
      title: 'URL Slug',
      type: 'slug',
      options: { source: 'keyword', maxLength: 96 },
      validation: Rule => Rule.required()
    },
    {
      name: 'intent',
      title: 'Search Intent',
      type: 'string',
      options: {
        list: [
          { title: 'Informational', value: 'informational' },
          { title: 'Commercial',    value: 'commercial'    },
          { title: 'Transactional', value: 'transactional' },
          { title: 'Local',         value: 'local'         }
        ]
      },
      validation: Rule => Rule.required()
    },
    {
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Queued',           value: 'queued'           },
          { title: 'Generating',       value: 'generating'       },
          { title: 'Pending Approval', value: 'pending_approval' },
          { title: 'Approved',         value: 'approved'         },
          { title: 'Published',        value: 'published'        },
          { title: 'Archived',         value: 'archived'         },
          { title: 'Needs Revision',   value: 'needs_revision'   }
        ]
      },
      initialValue: 'queued',
      validation: Rule => Rule.required()
    },
    {
      name: 'cluster',
      title: 'Topic Cluster',
      type: 'string',
      options: {
        list: [
          { title: 'Podcast Production',      value: 'podcast_production'  },
          { title: 'AI Consulting',            value: 'ai_consulting'       },
          { title: 'Content Systems',          value: 'content_systems'     },
          { title: 'Personal Brand',           value: 'personal_brand'      },
          { title: 'Local SEO',                value: 'local_seo'           }
        ]
      },
      validation: Rule => Rule.required()
    },

    // ─── SCORING (written by Normalizer, read by routing logic) ────────────
    {
      name: 'seo_score',
      title: 'SEO Score (0–10)',
      type: 'number',
      validation: Rule => Rule.min(0).max(10)
    },
    {
      name: 'aeo_score',
      title: 'AEO Score (0–100)',
      type: 'number',
      validation: Rule => Rule.min(0).max(100)
    },
    {
      name: 'priority',
      title: 'Priority',
      type: 'string',
      options: {
        list: [
          { title: 'Critical', value: 'critical' },
          { title: 'High',     value: 'high'     },
          { title: 'Medium',   value: 'medium'   },
          { title: 'Low',      value: 'low'      }
        ]
      }
    },
    {
      name: 'fast_track',
      title: 'Fast Track (skip approval)',
      type: 'boolean',
      initialValue: false
    },

    // ─── AEO CONTEXT (optional, written by Normalizer) ─────────────────────
    {
      name: 'aeo_question',
      title: 'AEO Target Question',
      type: 'text',
      rows: 2
    },

    // ─── TIMESTAMPS (written by workflows) ─────────────────────────────────
    {
      name: 'created_at',
      title: 'Created At',
      type: 'datetime'
    },
    {
      name: 'generated_at',
      title: 'Article Generated At',
      type: 'datetime'
    }
  ],

  preview: {
    select: { title: 'keyword', subtitle: 'status', media: 'priority' },
    prepare({ title, subtitle }) {
      return { title, subtitle: `[${subtitle}]` };
    }
  }
};
```

---

## Document Type: `article`

Created by W-02 (Article Generator) when Claude writes an article.

```javascript
// sanity/schemas/article.js
export default {
  name: 'article',
  title: 'Article',
  type: 'document',
  fields: [
    // ─── REQUIRED (routing depends on these) ───────────────────────────────
    {
      name: 'title',
      title: 'H1 Title',
      type: 'string',
      validation: Rule => Rule.required().max(80)
    },
    {
      name: 'slug',
      title: 'URL Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: Rule => Rule.required()
    },
    {
      name: 'keyword',
      title: 'Primary Keyword',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'cluster',
      title: 'Topic Cluster',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Draft',            value: 'draft'            },
          { title: 'Pending Approval', value: 'pending_approval' },
          { title: 'Needs Revision',   value: 'needs_revision'   },
          { title: 'Approved',         value: 'approved'         },
          { title: 'Published',        value: 'published'        },
          { title: 'Archived',         value: 'archived'         }
        ]
      },
      initialValue: 'draft',
      validation: Rule => Rule.required()
    },
    {
      name: 'aeo_score',
      title: 'AEO Score (0–100)',
      type: 'number',
      validation: Rule => Rule.required().min(0).max(100)
    },

    // ─── SEO META ───────────────────────────────────────────────────────────
    {
      name: 'metaTitle',
      title: 'Meta Title',
      type: 'string',
      validation: Rule => Rule.required().max(60)
    },
    {
      name: 'metaDescription',
      title: 'Meta Description',
      type: 'text',
      rows: 3,
      validation: Rule => Rule.required().min(140).max(160)
    },

    // ─── CONTENT ────────────────────────────────────────────────────────────
    {
      name: 'body',
      title: 'Article Body (HTML)',
      type: 'text',
      rows: 20,
      validation: Rule => Rule.required()
    },
    {
      name: 'faqPairs',
      title: 'FAQ Pairs',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'question', type: 'string', title: 'Question' },
            { name: 'answer',   type: 'text',   title: 'Answer'   }
          ]
        }
      ],
      validation: Rule => Rule.min(6)
    },
    {
      name: 'schemaTypes',
      title: 'JSON-LD Schema Types',
      type: 'array',
      of: [{ type: 'string' }],
      validation: Rule => Rule.min(1)
    },

    // ─── PERFORMANCE (written by W-04 Feedback Collector) ──────────────────
    {
      name: 'performance',
      title: 'SEO Performance',
      type: 'object',
      fields: [
        { name: 'clicks',           type: 'number', title: 'Clicks (28d)'       },
        { name: 'impressions',      type: 'number', title: 'Impressions (28d)'   },
        { name: 'avg_position',     type: 'number', title: 'Avg Position'        },
        { name: 'ctr',              type: 'number', title: 'CTR'                 },
        { name: 'citation_count',   type: 'number', title: 'AI Citations'        },
        { name: 'citation_rate',    type: 'number', title: 'Citation Rate'       },
        { name: 'rewrite_flagged',  type: 'boolean', title: 'Flagged for Rewrite' },
        { name: 'rewrite_reason',   type: 'string', title: 'Rewrite Reason'      },
        { name: 'last_checked',     type: 'datetime', title: 'Last Checked'      }
      ]
    },

    // ─── TIMESTAMPS ─────────────────────────────────────────────────────────
    {
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime'
    },
    {
      name: 'updatedAt',
      title: 'Last Updated',
      type: 'datetime'
    },

    // ─── VALIDATION RECORD ──────────────────────────────────────────────────
    {
      name: 'validationPassed',
      title: 'AEO Validation Passed',
      type: 'boolean'
    },
    {
      name: 'validationWarnings',
      title: 'Validation Warnings',
      type: 'array',
      of: [{ type: 'string' }]
    }
  ],

  preview: {
    select: { title: 'title', subtitle: 'status' },
    prepare({ title, subtitle }) {
      return { title, subtitle: `[${subtitle}]` };
    }
  }
};
```

---

## Schema Validation Rules (Enforced by n8n Nodes)

| Field | Document | Node that checks | On failure |
|-------|----------|-----------------|------------|
| `keyword` | contentBrief | Normalizer | Throw + kill |
| `status` | contentBrief, article | Approval Router | Throw + kill |
| `cluster` | contentBrief, article | Normalizer | Throw + kill |
| `aeo_score` | article | AEO Validator | Required field |
| `faqPairs (≥6)` | article | AEO Validator | Fail → revision |
| `metaTitle (≤60)` | article | AEO Validator | Fail → revision |
| `metaDescription (140–160)` | article | AEO Validator | Warn |
| `schemaTypes (≥1)` | article | AEO Validator | Fail → revision |
| `publishedAt` | article | Distribution Webhook | Required to trigger W-03 |

---

## Cluster Taxonomy (locked — do not add without updating Normalizer)

| Value | Label | Pillar URL |
|-------|-------|------------|
| `podcast_production` | Podcast Production | `/services/podcast-production/` |
| `ai_consulting` | AI Consulting | `/services/ai-consulting/` |
| `content_systems` | Content Systems | `/services/content-systems/` |
| `personal_brand` | Personal Brand | `/services/personal-brand/` |
| `local_seo` | Local SEO | `/local/[city-service]/` |

---

## Status Flow Diagram

```
queued
  ↓
generating        ← W-02 sets this on webhook receive
  ↓
pending_approval  ← W-02 sets after validation pass
  ↓
  ├─ approved     ← Telegram /approve_ command
  │     ↓
  │  published    ← Sanity mutation sets publishedAt
  │
  ├─ needs_revision ← Telegram /revise_ command
  │     ↓
  │  generating   ← loops back through W-02
  │
  └─ archived     ← Telegram /reject_ command
```
