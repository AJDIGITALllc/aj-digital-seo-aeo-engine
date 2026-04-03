/**
 * AJ Digital SEO/AEO Engine — Sanity Schema Index
 *
 * Exports all document types for registration in sanity.config.ts.
 * Add new types here after creating the schema file.
 */

import contentBrief       from './contentBrief'
import article            from './article'
import performanceMetrics from './performanceMetrics'
import clientProfile      from './clientProfile'
import servicePage        from './servicePage'

export const schemaTypes = [
  // Core engine document types — order determines Sanity Studio sidebar order
  clientProfile,       // Client identity + cluster taxonomy
  contentBrief,        // W-01 output: keyword opportunities queued for generation
  article,             // W-02 output: Claude-generated, validated articles
  performanceMetrics,  // W-04 output: weekly GSC + citation metrics per article
  servicePage,         // Service landing pages — frontend route: /services/[slug]
]
