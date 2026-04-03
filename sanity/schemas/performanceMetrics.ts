/**
 * AJ Digital SEO/AEO Engine — Sanity Schema: performanceMetrics
 *
 * Created/updated by W-04 Feedback Collector (weekly).
 * One document per article per week. _id is deterministic:
 *   perf-{clientSlug}-{articleId}-{weekOf}
 *
 * This is the historical record. The article document itself stores
 * the LATEST performance snapshot in article.performance.
 * performanceMetrics stores the full weekly series for trend analysis.
 */

import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'performanceMetrics',
  title: 'Performance Metrics',
  type: 'document',

  groups: [
    { name: 'gsc',         title: 'GSC Data',       default: true },
    { name: 'aeo',         title: 'AEO / Citations'               },
    { name: 'optimization',title: 'Optimization'                  },
    { name: 'meta',        title: 'Meta'                          },
  ],

  fields: [
    // ─── IDENTITY ─────────────────────────────────────────────────────────────

    defineField({
      name: 'article',
      title: 'Article',
      type: 'reference',
      group: 'meta',
      to: [{ type: 'article' }],
      description: 'The article this performance record belongs to.',
      validation: Rule => Rule.required()
    }),

    defineField({
      name: 'articleUrl',
      title: 'Article URL',
      type: 'url',
      group: 'meta',
      description: 'Cached URL for GSC lookup (avoids JOIN in W-04).'
    }),

    defineField({
      name: 'clientSlug',
      title: 'Client Slug',
      type: 'string',
      group: 'meta',
      validation: Rule => Rule.required()
    }),

    defineField({
      name: 'weekOf',
      title: 'Week Of (ISO)',
      type: 'string',
      group: 'meta',
      description: 'e.g. 2026-W15. Unique per week per article.',
      validation: Rule =>
        Rule.required().regex(/^\d{4}-W(0[1-9]|[1-4]\d|5[0-3])$/, {
          name: 'ISO week',
          invert: false,
        })
    }),

    defineField({
      name: 'recordedAt',
      title: 'Recorded At',
      type: 'datetime',
      group: 'meta',
      description: 'ISO timestamp when W-04 wrote this record.',
      readOnly: true
    }),

    // ─── GSC DATA: THIS WEEK ──────────────────────────────────────────────────

    defineField({
      name: 'clicks',
      title: 'Clicks (this week)',
      type: 'number',
      group: 'gsc',
      validation: Rule => Rule.min(0)
    }),

    defineField({
      name: 'impressions',
      title: 'Impressions (this week)',
      type: 'number',
      group: 'gsc',
      validation: Rule => Rule.min(0)
    }),

    defineField({
      name: 'ctr',
      title: 'CTR (this week)',
      type: 'number',
      group: 'gsc',
      description: 'Click-through rate as decimal (0.03 = 3%).',
      validation: Rule => Rule.min(0).max(1)
    }),

    defineField({
      name: 'avgPosition',
      title: 'Avg Position (this week)',
      type: 'number',
      group: 'gsc',
      validation: Rule => Rule.min(1)
    }),

    // ─── WEEK-OVER-WEEK DELTAS ────────────────────────────────────────────────

    defineField({
      name: 'clicksDelta',
      title: 'Clicks Δ (vs prev week)',
      type: 'number',
      group: 'gsc'
    }),

    defineField({
      name: 'impressionsDelta',
      title: 'Impressions Δ',
      type: 'number',
      group: 'gsc'
    }),

    defineField({
      name: 'positionDelta',
      title: 'Position Δ (positive = improved)',
      type: 'number',
      group: 'gsc'
    }),

    defineField({
      name: 'trend',
      title: 'Trend',
      type: 'string',
      group: 'gsc',
      options: {
        list: [
          { title: 'Growing',   value: 'growing'   },
          { title: 'Declining', value: 'declining' },
          { title: 'Flat',      value: 'flat'      },
        ],
        layout: 'radio',
      }
    }),

    // ─── AEO / CITATION DATA ─────────────────────────────────────────────────

    defineField({
      name: 'citationCount',
      title: 'AI Citations (this week)',
      type: 'number',
      group: 'aeo',
      description: 'Number of AI queries for which this page was cited.',
      validation: Rule => Rule.min(0)
    }),

    defineField({
      name: 'citationRate',
      title: 'Citation Rate',
      type: 'number',
      group: 'aeo',
      description: 'citations / impressions (Rule 1 metric from feedback-analyzer.js).',
      validation: Rule => Rule.min(0)
    }),

    defineField({
      name: 'citationRatePct',
      title: 'Citation Rate %',
      type: 'number',
      group: 'aeo',
      description: 'citation_rate × 100, stored for easier dashboard display.',
      validation: Rule => Rule.min(0)
    }),

    // ─── OPTIMIZATION FLAGS ───────────────────────────────────────────────────

    defineField({
      name: 'rewriteFlagged',
      title: 'Flagged for Rewrite',
      type: 'boolean',
      group: 'optimization',
      description: 'True if Rule 2 (high impressions, low CTR) or Rule 3 (ranking, not cited) triggered.',
      initialValue: false
    }),

    defineField({
      name: 'rewriteReason',
      title: 'Rewrite Reason',
      type: 'text',
      rows: 2,
      group: 'optimization',
      description: 'Human-readable explanation of which rule triggered.'
    }),

    defineField({
      name: 'rewriteActions',
      title: 'Rewrite Actions',
      type: 'array',
      group: 'optimization',
      of: [{ type: 'string' }],
      description: 'Action codes from feedback-analyzer. e.g. "rewrite_title_meta", "inject_definition_answer_first".'
    }),

    defineField({
      name: 'ruleMatches',
      title: 'Rule Matches',
      type: 'object',
      group: 'optimization',
      fields: [
        defineField({
          name: 'highImpressionsLowCtr',
          title: 'Rule 2: High Impressions + Low CTR',
          type: 'boolean',
          initialValue: false
        }),
        defineField({
          name: 'rankingNotCited',
          title: 'Rule 3: Ranking But Not Cited',
          type: 'boolean',
          initialValue: false
        }),
      ]
    }),
  ],

  orderings: [
    {
      title: 'Week (Newest First)',
      name: 'weekDesc',
      by: [{ field: 'weekOf', direction: 'desc' }]
    },
    {
      title: 'Impressions (High → Low)',
      name: 'impressionsDesc',
      by: [{ field: 'impressions', direction: 'desc' }]
    },
  ],

  preview: {
    select: {
      articleRef: 'article._ref',
      weekOf:     'weekOf',
      clicks:     'clicks',
      impressions:'impressions',
      rewrite:    'rewriteFlagged',
    },
    prepare({ weekOf, clicks, impressions, rewrite }) {
      return {
        title: `${rewrite ? '🔴 ' : ''}${weekOf}`,
        subtitle: `${impressions ?? 0} impressions | ${clicks ?? 0} clicks${rewrite ? ' | ⚠ rewrite needed' : ''}`
      }
    }
  }
})
