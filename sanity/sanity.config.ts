/**
 * AJ Digital SEO/AEO Engine — Sanity Studio Configuration
 *
 * Deploy one Sanity project per client.
 * SANITY_PROJECT_ID and SANITY_DATASET are set in .env / deployment-config.json.
 *
 * Setup:
 *   1. npx sanity@latest init --env  (creates .env with projectId + dataset)
 *   2. Update projectId below
 *   3. npx sanity deploy
 */

import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool }    from '@sanity/vision'
import { schemaTypes }   from './schemas'

// The project ID is injected from environment at Studio build time.
// For local dev: copy .env.example → .env and set SANITY_STUDIO_PROJECT_ID.
const projectId = process.env.SANITY_STUDIO_PROJECT_ID || 'REPLACE_SANITY_PROJECT_ID'
const dataset   = process.env.SANITY_STUDIO_DATASET    || 'production'

export default defineConfig({
  name:    'aj-digital-seo-aeo-engine',
  title:   'AJ Digital SEO/AEO Engine',
  projectId,
  dataset,

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('SEO/AEO Engine')
          .items([
            S.listItem()
              .title('Client Profiles')
              .icon(() => '🏢')
              .child(S.documentTypeList('clientProfile').title('Clients')),

            S.divider(),

            S.listItem()
              .title('Content Briefs')
              .icon(() => '📋')
              .child(
                S.list()
                  .title('Filter by Status')
                  .items([
                    S.listItem().title('⏳ Queued').child(
                      S.documentList().title('Queued').filter('_type == "contentBrief" && status == "queued"')
                    ),
                    S.listItem().title('⚙️ Generating').child(
                      S.documentList().title('Generating').filter('_type == "contentBrief" && status == "generating"')
                    ),
                    S.listItem().title('👀 Pending Approval').child(
                      S.documentList().title('Pending Approval').filter('_type == "contentBrief" && status == "pending_approval"')
                    ),
                    S.listItem().title('✅ Published').child(
                      S.documentList().title('Published').filter('_type == "contentBrief" && status == "published"')
                    ),
                    S.listItem().title('📦 All Briefs').child(
                      S.documentTypeList('contentBrief').title('All Briefs')
                    ),
                  ])
              ),

            S.listItem()
              .title('Articles')
              .icon(() => '📄')
              .child(
                S.list()
                  .title('Filter by Status')
                  .items([
                    S.listItem().title('📝 Draft').child(
                      S.documentList().title('Drafts').filter('_type == "article" && status == "draft"')
                    ),
                    S.listItem().title('👀 Pending Approval').child(
                      S.documentList().title('Pending Approval').filter('_type == "article" && status == "pending_approval"')
                    ),
                    S.listItem().title('🔴 Needs Revision').child(
                      S.documentList().title('Needs Revision').filter('_type == "article" && status == "needs_revision"')
                    ),
                    S.listItem().title('🟢 Published').child(
                      S.documentList().title('Published').filter('_type == "article" && status == "published"')
                    ),
                    S.listItem().title('🔴 Rewrite Flagged').child(
                      S.documentList().title('Rewrite Queue').filter('_type == "article" && rewriteFlagged == true')
                    ),
                    S.listItem().title('📦 All Articles').child(
                      S.documentTypeList('article').title('All Articles')
                    ),
                  ])
              ),

            S.listItem()
              .title('Performance Metrics')
              .icon(() => '📊')
              .child(S.documentTypeList('performanceMetrics').title('Performance Metrics')),
          ])
    }),

    // Vision: GROQ query playground for debugging
    visionTool(),
  ],

  schema: { types: schemaTypes },
})
