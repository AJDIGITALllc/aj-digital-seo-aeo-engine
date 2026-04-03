/**
 * AJ Digital SEO/AEO Engine — Sanity Schema: clientProfile
 *
 * One document per client deployment. _id is deterministic:
 *   client-{slug}
 *
 * This mirrors clients/{slug}/client-profile.json in the repo,
 * but lives in Sanity so n8n workflows can read it at runtime
 * without filesystem access. Updated manually or via API on deploy.
 *
 * Cluster taxonomy is defined here (per-client) and referenced
 * by contentBrief and article cluster fields.
 */

import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'clientProfile',
  title: 'Client Profile',
  type: 'document',
  __experimental_actions: ['update', 'publish'],

  groups: [
    { name: 'identity',   title: 'Identity',        default: true },
    { name: 'geography',  title: 'Geography'                      },
    { name: 'taxonomy',   title: 'Cluster Taxonomy'               },
    { name: 'author',     title: 'Author'                         },
    { name: 'engine',     title: 'Engine Status'                  },
  ],

  fields: [
    // ─── IDENTITY ─────────────────────────────────────────────────────────────

    defineField({
      name: 'slug',
      title: 'Client Slug',
      type: 'slug',
      group: 'identity',
      description: 'Matches CLIENT_SLUG env var. URL-safe, lowercase. e.g. weareajdigital',
      options: { source: 'brandName', maxLength: 64 },
      validation: Rule => Rule.required()
    }),

    defineField({
      name: 'brandName',
      title: 'Brand Name',
      type: 'string',
      group: 'identity',
      validation: Rule => Rule.required()
    }),

    defineField({
      name: 'siteUrl',
      title: 'Site URL',
      type: 'url',
      group: 'identity',
      description: 'Canonical base URL. No trailing slash. Matches CLIENT_SITE_URL.',
      validation: Rule => Rule.required()
    }),

    defineField({
      name: 'niche',
      title: 'Niche / Industry',
      type: 'string',
      group: 'identity',
      description: 'One-line industry descriptor. Used to focus Perplexity keyword research.',
      validation: Rule => Rule.required()
    }),

    defineField({
      name: 'seedTopics',
      title: 'Seed Topics',
      type: 'array',
      group: 'identity',
      of: [{ type: 'string' }],
      description: 'Core service/topic clusters fed to Perplexity weekly scan. Matches CLIENT_SEED_TOPICS.',
      validation: Rule => Rule.required().min(1)
    }),

    defineField({
      name: 'active',
      title: 'Active',
      type: 'boolean',
      group: 'engine',
      description: 'Set false to pause all workflows for this client without deleting config.',
      initialValue: true
    }),

    // ─── GEOGRAPHY ────────────────────────────────────────────────────────────

    defineField({
      name: 'primaryCity',
      title: 'Primary City',
      type: 'string',
      group: 'geography',
      description: 'Default location anchor in prompts. Matches CLIENT_PRIMARY_CITY.',
      validation: Rule => Rule.required()
    }),

    defineField({
      name: 'localCities',
      title: 'Local Cities',
      type: 'array',
      group: 'geography',
      of: [{ type: 'string' }],
      description: 'All geographic markets. Used for fast-track routing. Matches CLIENT_LOCAL_CITIES.',
      validation: Rule => Rule.required().min(1)
    }),

    // ─── CLUSTER TAXONOMY (per-client) ────────────────────────────────────────

    defineField({
      name: 'clusterTaxonomy',
      title: 'Content Cluster Taxonomy',
      type: 'array',
      group: 'taxonomy',
      description: 'Define the topic clusters for this client. The "value" field is what gets stored on contentBrief.cluster and article.cluster.',
      of: [
        {
          type: 'object',
          name: 'cluster',
          title: 'Cluster',
          fields: [
            defineField({
              name: 'value',
              title: 'Value (slug)',
              type: 'string',
              description: 'Machine-readable slug. e.g. podcast_production',
              validation: Rule => Rule.required().regex(/^[a-z0-9_]+$/, {
                name: 'lowercase slug',
                invert: false
              })
            }),
            defineField({
              name: 'label',
              title: 'Label',
              type: 'string',
              description: 'Human-readable name. e.g. "Podcast Production"',
              validation: Rule => Rule.required()
            }),
            defineField({
              name: 'pillarUrl',
              title: 'Pillar Page URL',
              type: 'string',
              description: 'Root-relative URL of the pillar page for this cluster.'
            }),
            defineField({
              name: 'description',
              title: 'Description',
              type: 'text',
              rows: 2,
              description: 'Brief description used in Perplexity research prompts.'
            }),
          ],
          preview: {
            select: { title: 'label', subtitle: 'value', url: 'pillarUrl' },
            prepare({ title, subtitle, url }) {
              return { title, subtitle: `${subtitle} → ${url || 'no pillar URL'}` }
            }
          }
        }
      ],
      validation: Rule => Rule.required().min(1)
    }),

    // ─── AUTHOR ───────────────────────────────────────────────────────────────

    defineField({
      name: 'author',
      title: 'Primary Author',
      type: 'object',
      group: 'author',
      description: 'Author details for bylines, JSON-LD, and AEO validator checks.',
      fields: [
        defineField({
          name: 'name',
          title: 'Full Name',
          type: 'string',
          description: 'Matches CLIENT_AUTHOR_NAME.',
          validation: Rule => Rule.required()
        }),
        defineField({
          name: 'title',
          title: 'Professional Title',
          type: 'string',
          description: 'Matches CLIENT_AUTHOR_TITLE.',
          validation: Rule => Rule.required()
        }),
        defineField({
          name: 'bioShort',
          title: 'Short Bio',
          type: 'text',
          rows: 2,
          description: '1–2 sentences for article footers.'
        }),
        defineField({
          name: 'linkedinUrl',
          title: 'LinkedIn URL',
          type: 'url'
        }),
        defineField({
          name: 'photoUrl',
          title: 'Headshot URL',
          type: 'url',
          description: 'Absolute URL to author headshot (min 200×200px).'
        }),
      ]
    }),

    // ─── ENGINE STATUS ────────────────────────────────────────────────────────

    defineField({
      name: 'engineVersion',
      title: 'Engine Version',
      type: 'string',
      group: 'engine',
      description: 'e.g. "2.0" — tracks which engine version generated content for this client.',
      initialValue: '2.0'
    }),

    defineField({
      name: 'lastScanAt',
      title: 'Last W-01 Scan',
      type: 'datetime',
      group: 'engine',
      readOnly: true
    }),

    defineField({
      name: 'lastFeedbackAt',
      title: 'Last W-04 Feedback Run',
      type: 'datetime',
      group: 'engine',
      readOnly: true
    }),

    defineField({
      name: 'totalArticlesPublished',
      title: 'Total Articles Published',
      type: 'number',
      group: 'engine',
      readOnly: true,
      initialValue: 0
    }),
  ],

  preview: {
    select: {
      title:  'brandName',
      active: 'active',
      slug:   'slug.current',
      url:    'siteUrl',
    },
    prepare({ title, active, slug, url }) {
      return {
        title: `${active ? '🟢' : '⏸'} ${title}`,
        subtitle: `${slug} | ${url}`
      }
    }
  }
})
