/**
 * AJ Digital SEO/AEO Engine — Sanity Schema: contentBrief
 *
 * Created by W-01 Intelligence Scan (Normalizer code node).
 * One document per keyword per client. _id is deterministic:
 *   brief-{clientSlug}-{keyword-slugified}
 *
 * Status flow managed entirely by n8n:
 *   queued → generating → pending_approval → approved/needs_revision/killed → published/archived
 */

import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'contentBrief',
  title: 'Content Brief',
  type: 'document',

  groups: [
    { name: 'targeting',  title: 'Targeting',       default: true },
    { name: 'scoring',    title: 'Scoring'                        },
    { name: 'research',   title: 'Research Data'                  },
    { name: 'meta',       title: 'Meta / Status'                  },
  ],

  fields: [
    // ─── IDENTITY ─────────────────────────────────────────────────────────────

    defineField({
      name: 'keyword',
      title: 'Primary Keyword',
      type: 'string',
      group: 'targeting',
      description: 'The exact target keyword. Set by W-01 Normalizer — do not edit manually.',
      validation: Rule => Rule.required().min(2).max(120)
    }),

    defineField({
      name: 'slug',
      title: 'URL Slug',
      type: 'slug',
      group: 'targeting',
      options: { source: 'keyword', maxLength: 96 },
      validation: Rule => Rule.required()
    }),

    defineField({
      name: 'clientSlug',
      title: 'Client Slug',
      type: 'string',
      group: 'meta',
      description: 'Matches CLIENT_SLUG env var. Scopes this brief to one client deployment.',
      validation: Rule => Rule.required()
    }),

    defineField({
      name: 'weekOf',
      title: 'Week Of (ISO week)',
      type: 'string',
      group: 'meta',
      description: 'e.g. 2026-W14. Set by W-01 on creation.',
      validation: Rule =>
        Rule.regex(/^\d{4}-W(0[1-9]|[1-4]\d|5[0-3])$/, {
          name: 'ISO week',
          invert: false,
        })
    }),

    // ─── INTENT & CLASSIFICATION ──────────────────────────────────────────────

    defineField({
      name: 'intent',
      title: 'Search Intent',
      type: 'string',
      group: 'targeting',
      options: {
        list: [
          { title: 'Informational',  value: 'informational'  },
          { title: 'Commercial',     value: 'commercial'     },
          { title: 'Transactional',  value: 'transactional'  },
          { title: 'Local',          value: 'local'          },
        ],
        layout: 'radio',
      },
      validation: Rule => Rule.required()
    }),

    defineField({
      name: 'difficulty',
      title: 'Keyword Difficulty',
      type: 'string',
      group: 'targeting',
      options: {
        list: [
          { title: 'Very Low', value: 'very_low' },
          { title: 'Low',      value: 'low'      },
          { title: 'Medium',   value: 'medium'   },
          { title: 'High',     value: 'high'     },
          { title: 'Unknown',  value: 'unknown'  },
        ],
        layout: 'dropdown',
      }
    }),

    defineField({
      name: 'cluster',
      title: 'Topic Cluster',
      type: 'string',
      group: 'targeting',
      description: 'Content cluster this brief belongs to. Values defined in clients/{slug}/deployment-config.json.',
      validation: Rule => Rule.required()
    }),

    defineField({
      name: 'volumeEstimate',
      title: 'Volume Estimate (monthly)',
      type: 'number',
      group: 'targeting',
      validation: Rule => Rule.min(0)
    }),

    defineField({
      name: 'localCity',
      title: 'Local City Target',
      type: 'string',
      group: 'targeting',
      description: 'Set for local keyword briefs. Sourced from CLIENT_LOCAL_CITIES.'
    }),

    // ─── STATUS FLOW ──────────────────────────────────────────────────────────

    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      group: 'meta',
      options: {
        list: [
          { title: 'Queued',            value: 'queued'            },
          { title: 'Generating',        value: 'generating'        },
          { title: 'Pending Approval',  value: 'pending_approval'  },
          { title: 'Approved',          value: 'approved'          },
          { title: 'Published',         value: 'published'         },
          { title: 'Needs Revision',    value: 'needs_revision'    },
          { title: 'Killed',            value: 'killed'            },
          { title: 'Archived',          value: 'archived'          },
        ],
        layout: 'dropdown',
      },
      initialValue: 'queued',
      validation: Rule => Rule.required()
    }),

    // ─── SCORING ──────────────────────────────────────────────────────────────

    defineField({
      name: 'score',
      title: 'Opportunity Score (0–10)',
      type: 'number',
      group: 'scoring',
      description: 'Weighted score: volume(0.3) + difficulty(0.3) + intent(0.2) + local(0.1) + aeo(0.1)',
      validation: Rule => Rule.min(0).max(10)
    }),

    defineField({
      name: 'priority',
      title: 'Priority',
      type: 'string',
      group: 'scoring',
      options: {
        list: [
          { title: 'Critical', value: 'critical' },
          { title: 'High',     value: 'high'     },
          { title: 'Medium',   value: 'medium'   },
          { title: 'Low',      value: 'low'      },
        ],
        layout: 'radio',
      }
    }),

    defineField({
      name: 'fastTrack',
      title: 'Fast Track (skip manual approval)',
      type: 'boolean',
      group: 'scoring',
      description: 'True when article can auto-publish after validation pass.',
      initialValue: false
    }),

    defineField({
      name: 'scoringComponents',
      title: 'Scoring Components',
      type: 'object',
      group: 'scoring',
      description: 'Per-dimension scores for audit transparency.',
      fields: [
        defineField({ name: 'volume',     title: 'Volume (0–10)',     type: 'number' }),
        defineField({ name: 'difficulty', title: 'Difficulty (0–10)', type: 'number' }),
        defineField({ name: 'intent',     title: 'Intent (0–10)',     type: 'number' }),
        defineField({ name: 'local',      title: 'Local Boost (0–10)', type: 'number' }),
        defineField({ name: 'aeo',        title: 'AEO Signal (0–10)', type: 'number' }),
      ]
    }),

    // ─── AEO CONTEXT ──────────────────────────────────────────────────────────

    defineField({
      name: 'aeoQuestion',
      title: 'AEO Target Question',
      type: 'text',
      rows: 2,
      group: 'research',
      description: 'Primary question this article must answer for AI citation.'
    }),

    defineField({
      name: 'aeoCitationLevel',
      title: 'AEO Citation Opportunity',
      type: 'string',
      group: 'research',
      options: {
        list: [
          { title: 'High',   value: 'high'   },
          { title: 'Medium', value: 'medium' },
          { title: 'Low',    value: 'low'    },
        ]
      }
    }),

    defineField({
      name: 'gscStatus',
      title: 'GSC Status',
      type: 'string',
      group: 'research',
      options: {
        list: [
          { title: 'No Data',          value: 'no_data'           },
          { title: 'Already Ranking P1', value: 'already_ranking_p1' },
          { title: 'Ranking Page 2',   value: 'ranking_page2'     },
          { title: 'Ranking Poorly',   value: 'ranking_poorly'    },
        ]
      }
    }),

    // ─── RESEARCH PAYLOAD ─────────────────────────────────────────────────────

    defineField({
      name: 'serpResearchJson',
      title: 'SERP Research (raw JSON)',
      type: 'text',
      group: 'research',
      description: 'Serialized Perplexity research payload. Read-only — set by W-01.',
      rows: 6
    }),

    defineField({
      name: 'paaQuestions',
      title: 'People Also Ask Questions',
      type: 'array',
      group: 'research',
      of: [{ type: 'string' }]
    }),

    defineField({
      name: 'competitorGaps',
      title: 'Competitor Content Gaps',
      type: 'array',
      group: 'research',
      of: [{ type: 'string' }]
    }),

    defineField({
      name: 'wordCountTarget',
      title: 'Target Word Count',
      type: 'number',
      group: 'research',
      initialValue: 1400,
      validation: Rule => Rule.min(500).max(5000)
    }),

    // ─── TIMESTAMPS ───────────────────────────────────────────────────────────

    defineField({
      name: 'createdAt',
      title: 'Created At',
      type: 'datetime',
      group: 'meta',
      readOnly: true
    }),

    defineField({
      name: 'generatedAt',
      title: 'Article Generated At',
      type: 'datetime',
      group: 'meta',
      readOnly: true
    }),

    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      group: 'meta',
      readOnly: true
    }),
  ],

  orderings: [
    {
      title: 'Score (High → Low)',
      name: 'scoreDesc',
      by: [{ field: 'score', direction: 'desc' }]
    },
    {
      title: 'Status',
      name: 'statusAsc',
      by: [{ field: 'status', direction: 'asc' }]
    },
    {
      title: 'Created (Newest First)',
      name: 'createdDesc',
      by: [{ field: 'createdAt', direction: 'desc' }]
    },
  ],

  preview: {
    select: {
      title:    'keyword',
      subtitle: 'status',
      score:    'score',
      priority: 'priority',
    },
    prepare({ title, subtitle, score, priority }) {
      const icons: Record<string, string> = {
        queued: '⏳', generating: '⚙️', pending_approval: '👀',
        approved: '✅', published: '🟢', needs_revision: '🔴',
        killed: '💀', archived: '📦'
      }
      const icon = icons[subtitle] || '•'
      return {
        title: `${icon} ${title}`,
        subtitle: `[${priority || '?'}] ${subtitle} | score: ${score ?? '—'}`
      }
    }
  }
})
