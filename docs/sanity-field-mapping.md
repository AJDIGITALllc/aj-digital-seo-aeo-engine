# Sanity Field Mapping — AJ Digital SEO/AEO Engine

**Version:** 1.0
**Last updated:** 2026-04-03
**Written by:** W-01, W-02, W-04 n8n code nodes → Sanity Mutations API

This document maps every engine output field to its corresponding Sanity document field.
Use this when debugging data discrepancies between n8n and Sanity Studio.

---

## Document Type Summary

| Sanity Type | Created By | n8n Code Node | ID Pattern |
|-------------|-----------|---------------|------------|
| `clientProfile` | Manual / deploy script | — | `client-{slug}` |
| `contentBrief` | W-01 Normalizer | `sanity-write-brief.js` | `brief-{clientSlug}-{keyword-slug}` |
| `article` | W-02 Article Generator | `sanity-write-article.js` | `article-{clientSlug}-{keyword-slug}` |
| `performanceMetrics` | W-04 Feedback Collector | `sanity-patch-performance.js` | `perf-{clientSlug}-{keyword-slug}-{weekOf}` |

---

## contentBrief — Field Mapping

### Source: Normalizer output (`workflows/n8n/code/normalizer.js`)
### Written by: `sanity-write-brief.js`

| Engine Field | Source Path | Sanity Field | Type | Notes |
|-------------|-------------|-------------|------|-------|
| `keyword` | `opportunity.keyword` | `keyword` | string | Required. Unique per client. |
| `keyword` (derived) | `slugify(keyword)` | `slug.current` | slug | Auto-derived. |
| `CLIENT_SLUG` | `$env.CLIENT_SLUG` | `clientSlug` | string | From env var. |
| ISO week (derived) | `isoWeek()` | `weekOf` | string | e.g. `2026-W14` |
| `intent` | `opportunity.intent` | `intent` | string enum | commercial/transactional/local/informational |
| `difficulty` | `opportunity.difficulty` | `difficulty` | string enum | very_low/low/medium/high |
| (derived) | `deriveCluster(keyword, intent)` | `cluster` | string | Heuristic + CLIENT_ config |
| `volume_estimate` | `opportunity.volume_estimate` | `volumeEstimate` | number | |
| `local_city` | `opportunity.local_city` | `localCity` | string | Local briefs only |
| (constant) | `'queued'` | `status` | string | Always reset on createOrReplace |
| `score` | `opportunity.score` | `score` | number | 0–10 weighted score |
| `priority` | `opportunity.priority` | `priority` | string enum | critical/high/medium/low |
| `fast_track` | `opportunity.fast_track` | `fastTrack` | boolean | |
| `scoring_components.volume` | `opportunity.scoring_components.volume` | `scoringComponents.volume` | number | |
| `scoring_components.difficulty` | `opportunity.scoring_components.difficulty` | `scoringComponents.difficulty` | number | |
| `scoring_components.intent` | `opportunity.scoring_components.intent` | `scoringComponents.intent` | number | |
| `scoring_components.local` | `opportunity.scoring_components.local` | `scoringComponents.local` | number | |
| `scoring_components.aeo` | `opportunity.scoring_components.aeo` | `scoringComponents.aeo` | number | |
| `aeo_question` | `opportunity.aeo_question` | `aeoQuestion` | text | |
| `aeo_citation_level` | `opportunity.aeo_citation_level` | `aeoCitationLevel` | string | high/medium/low |
| `gsc_status` | `opportunity.gsc_status` | `gscStatus` | string | |
| (serialized) | `JSON.stringify({trending_queries, content_recommendations, gsc_data, aeo_answer_gap})` | `serpResearchJson` | text | Full Perplexity payload |
| (constant) | `1400` | `wordCountTarget` | number | Default |
| (derived) | `new Date().toISOString()` | `createdAt` | datetime | |

---

## article — Field Mapping

### Source: Claude article JSON (`article_json`), AEO Validator scores, Fast Track Router
### Written by: `sanity-write-article.js`

| Engine Field | Source Path | Sanity Field | Type | Notes |
|-------------|-------------|-------------|------|-------|
| `h1` | `article.h1` | `title` | string | Required. Max 80 chars. |
| (derived) | `slugify(keyword)` | `slug.current` | slug | From keyword, not title |
| `keyword` | `briefData.keyword` | `keyword` | string | Passed through from W-01 webhook |
| (from brief) | `briefData.brief_cluster` | `cluster` | string | Copied from contentBrief |
| `CLIENT_SLUG` | `$env.CLIENT_SLUG` | `clientSlug` | string | |
| (reference) | `briefData.brief_id` | `brief._ref` | reference | Links to source contentBrief |
| (derived) | `route === 'fast_track' ? 'approved' : 'pending_approval'` | `status` | string | |
| `meta_title` | `article.meta_title` | `metaTitle` | string | Max 60 chars |
| `meta_description` | `article.meta_description` | `metaDescription` | text | 140–165 chars |
| `intent` | `briefData.intent` | `intent` | string | From contentBrief |
| `article_html` | `article.article_html` | `body` | text | Full HTML |
| `word_count_estimate` | `article.word_count_estimate` | `wordCountEstimate` | number | |
| `reading_time_minutes` | `article.reading_time_minutes` | `readingTimeMinutes` | number | |
| `aeo_answer_block` | `article.aeo_answer_block` | `aeoAnswerBlock` | text | Best 40–75 word AI-citeable block |
| `named_frameworks` | `article.named_frameworks` | `namedFrameworks` | array\<string\> | |
| `faq_pairs[].question` | `article.faq_pairs[].question` | `faqPairs[].question` | string | Min 6 pairs |
| `faq_pairs[].answer` | `article.faq_pairs[].answer` | `faqPairs[].answer` | text | 40–75 words |
| `internal_link_map[].placeholder` | `article.internal_link_map[].placeholder` | `internalLinkMap[].placeholder` | string | |
| `internal_link_map[].suggested_url` | `article.internal_link_map[].suggested_url` | `internalLinkMap[].suggestedUrl` | string | |
| `internal_link_map[].anchor_text` | `article.internal_link_map[].anchor_text` | `internalLinkMap[].anchorText` | string | |
| `schema_types` | `article.schema_types` | `schemaTypes` | array\<string\> | e.g. `["Article","FAQPage"]` |
| (derived) | `buildSchemaPackJson(article)` | `schemaPackJson` | text | Serialized FAQPage JSON-LD |
| `aeo_score` | `routerOutput.aeo_score` | `aeoScore` | number | 0–100 |
| `scores.h2_count` | `routerOutput.scores.h2_count` | `aeoScoreComponents.h2Count` | number | |
| `scores.has_faq_section` | `routerOutput.scores.has_faq_section` | `aeoScoreComponents.hasFaqSection` | number | |
| `scores.faq_pair_count` | `routerOutput.scores.faq_pair_count` | `aeoScoreComponents.faqPairCount` | number | |
| `scores.answer_first_ratio` | `routerOutput.scores.answer_first_ratio` | `aeoScoreComponents.answerFirstRatio` | number | |
| `scores.question_h2_ratio` | `routerOutput.scores.question_h2_ratio` | `aeoScoreComponents.questionH2Ratio` | number | |
| `scores.has_author_block` | `routerOutput.scores.has_author_block` | `aeoScoreComponents.hasAuthorBlock` | number | |
| `scores.has_named_framework` | `routerOutput.scores.has_named_framework` | `aeoScoreComponents.hasNamedFramework` | number | |
| `scores.has_comparison_table` | `routerOutput.scores.has_comparison_table` | `aeoScoreComponents.hasComparisonTable` | number | |
| `scores.internal_link_count` | `routerOutput.scores.internal_link_count` | `aeoScoreComponents.internalLinkCount` | number | |
| `scores.word_count` | `routerOutput.scores.word_count` | `aeoScoreComponents.wordCount` | number | |
| `warnings` | `routerOutput.warnings` | `validationWarnings` | array\<string\> | |
| (constant) | `true` | `validationPassed` | boolean | Only reaches node if passed |
| (constant) | `false` | `rewriteFlagged` | boolean | Set by W-04 later |
| (derived) | `new Date().toISOString()` | `updatedAt` | datetime | |
| (conditional) | fast_track only | `publishedAt` | datetime | Set immediately for fast-track |

### Status patch on contentBrief (same mutation batch):

| Condition | contentBrief.status |
|-----------|---------------------|
| `route === 'fast_track'` | `published` |
| `route === 'manual_approval'` | `pending_approval` |

---

## article (status patch) — Field Mapping

### Source: Approval Router (`approval-router.js`) → `sanity-patch-status.js`

| Action | article.status | contentBrief.status | Extra fields |
|--------|---------------|---------------------|-------------|
| `/approve_{id}` | `published` | `published` | `publishedAt`, `updatedAt` |
| `/reject_{id}` | `archived` | `archived` | `updatedAt` |
| `/revise_{id}` | `needs_revision` | `queued` | `updatedAt`, clears `brief.generatedAt` |

---

## performanceMetrics — Field Mapping

### Source: Feedback Analyzer (`feedback-analyzer.js`) → `sanity-patch-performance.js`

| Engine Field | Source Path | Sanity Field (performanceMetrics) | Article Patch Path | Notes |
|-------------|-------------|----------------------------------|-------------------|-------|
| `url` | `page.url` | `articleUrl` | — | GSC row URL |
| `CLIENT_SLUG` | `$env.CLIENT_SLUG` | `clientSlug` | — | |
| (derived) | `isoWeek()` | `weekOf` | — | |
| `this_week.clicks` | `page.this_week.clicks` | `clicks` | `performance.clicks` | |
| `this_week.impressions` | `page.this_week.impressions` | `impressions` | `performance.impressions` | |
| `this_week.ctr` | `page.this_week.ctr / 100` | `ctr` | `performance.ctr` | Stored as decimal |
| `this_week.position` | `page.this_week.position` | `avgPosition` | `performance.avgPosition` | |
| `deltas.clicks` | `page.deltas.clicks` | `clicksDelta` | `performance.clicksDelta` | |
| `deltas.impressions` | `page.deltas.impressions` | `impressionsDelta` | `performance.impressionsDelta` | |
| `deltas.position` | `page.deltas.position` | `positionDelta` | `performance.positionDelta` | |
| `trend` | `page.trend` | `trend` | `performance.trend` | growing/declining/flat |
| `citation_count` | `page.citation_count` | `citationCount` | `performance.citationCount` | |
| `citation_rate` | `page.citation_rate` | `citationRate` | `performance.citationRate` | |
| `citation_rate_pct` | `page.citation_rate_pct` | `citationRatePct` | — | |
| `rewrite_flagged` | `page.rewrite_flagged` | `rewriteFlagged` | `rewriteFlagged` | |
| `rewrite_reason` | `page.rewrite_reason` | `rewriteReason` | `rewriteReason` | |
| `actions` | `page.actions` | `rewriteActions` | `rewriteActions` | |
| `rule_matches.high_impressions_low_ctr` | `page.rule_matches.high_impressions_low_ctr` | `ruleMatches.highImpressionsLowCtr` | — | |
| `rule_matches.ranking_not_cited` | `page.rule_matches.ranking_not_cited` | `ruleMatches.rankingNotCited` | — | |

---

## Status Flow Reference

```
contentBrief.status flow:
  'queued'            ← W-01 creates (or resets on re-run)
  'generating'        ← W-02 sets at webhook receive (patch separately)
  'pending_approval'  ← sanity-write-article.js (manual_approval route)
  'published'         ← sanity-write-article.js (fast_track route)
                      ← sanity-patch-status.js (on /approve_)
  'needs_revision'    → resets to 'queued' (sanity-patch-status.js on /revise_)
  'archived'          ← sanity-patch-status.js (on /reject_)

article.status flow:
  'draft'             ← sanity-write-article.js (initial create)
  'pending_approval'  ← sanity-write-article.js (manual_approval route)
  'approved'          ← sanity-write-article.js (fast_track route sets approved + publishedAt)
  'published'         ← sanity-patch-status.js (on /approve_)
  'needs_revision'    ← sanity-patch-status.js (on /revise_)
  'archived'          ← sanity-patch-status.js (on /reject_)
  'killed'            ← set directly when validator kill switch fires (future node)
```

---

## n8n HTTP Request Node Config (Sanity Mutations API)

Place this node immediately after any of the four Sanity code nodes.
All four share identical HTTP config — only the body field changes.

```json
{
  "name": "Sanity: Mutate",
  "type": "n8n-nodes-base.httpRequest",
  "parameters": {
    "method":          "POST",
    "url":             "https://={{ $env.SANITY_PROJECT_ID }}.api.sanity.io/v={{ $env.SANITY_API_VERSION }}/data/mutate/={{ $env.SANITY_DATASET }}",
    "authentication":  "genericCredentialType",
    "genericAuthType": "httpBearerAuth",
    "sendBody":        true,
    "contentType":     "json",
    "specifyBody":     "json",
    "jsonBody":        "={{ $json.sanity_mutation }}"
  }
}
```

> **Required credentials:** Add an HTTP Bearer Auth credential in n8n with `SANITY_API_TOKEN` as the token value.

---

## Environment Variables Required for Sanity Integration

| Variable | Used In | Notes |
|----------|---------|-------|
| `SANITY_PROJECT_ID` | All Sanity HTTP nodes | From sanity.io/manage |
| `SANITY_DATASET` | All Sanity HTTP nodes | Default: `production` |
| `SANITY_API_TOKEN` | All Sanity HTTP nodes | Editor-level token minimum |
| `SANITY_API_VERSION` | All Sanity HTTP nodes | Default: `2024-01-01` |
| `CLIENT_SLUG` | `sanity-write-brief.js`, `sanity-write-article.js`, `sanity-patch-performance.js` | Scopes all documents to one client |
| `CLIENT_SITE_URL` | `sanity-patch-performance.js` | Used for URL-to-articleId derivation |

---

## GROQ Queries for Debugging

```groq
// Get all contentBriefs for a client, sorted by score
*[_type == "contentBrief" && clientSlug == "weareajdigital"] | order(score desc) {
  _id, keyword, status, priority, score, fastTrack, weekOf
}

// Get all articles pending approval
*[_type == "article" && status == "pending_approval"] {
  _id, title, keyword, aeoScore, validationWarnings
}

// Get all articles flagged for rewrite
*[_type == "article" && rewriteFlagged == true] {
  _id, title, rewriteReason, rewriteActions
}

// Get weekly performance for a specific article
*[_type == "performanceMetrics" && article._ref == "ARTICLE_ID"] | order(weekOf desc) {
  weekOf, clicks, impressions, ctr, avgPosition, citationCount, trend
}

// Get articles ranked in top 15 but not cited (Rule 3 candidates)
*[_type == "article" && performance.avgPosition <= 15 && performance.citationCount == 0] {
  _id, title, keyword, performance.avgPosition, performance.impressions
}
```
