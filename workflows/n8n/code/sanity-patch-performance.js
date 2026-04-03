/**
 * AJ Digital SEO/AEO Engine — Sanity Patch: Performance Metrics
 * n8n Code Node: W-04 Feedback Collector
 * Positioned: after Feedback Analyzer, before Sanity HTTP node
 *
 * Two writes per page analysis:
 *   1. PATCH article.performance — overwrites the latest snapshot
 *   2. createOrReplace performanceMetrics — creates the weekly historical record
 *
 * Also patches article.rewriteFlagged + article.rewriteReason + article.rewriteActions
 * when the feedback analyzer fires Rule 2 or Rule 3.
 *
 * Input:  Feedback Analyzer output — page analysis objects + summary
 * Output: { mutations: [...] } body for Sanity HTTP Request node
 *
 * n8n HTTP Request node config:
 *   Method:  POST
 *   URL:     https://{{$env.SANITY_PROJECT_ID}}.api.sanity.io/v{{$env.SANITY_API_VERSION}}/data/mutate/{{$env.SANITY_DATASET}}
 *   Auth:    Bearer {{$env.SANITY_API_TOKEN}}
 *   Body:    JSON (field: sanity_mutation)
 *   Note:    Set "Batch Size" = 1 if using Split In Batches before this node
 */

// ─── Read inputs ──────────────────────────────────────────────────────────────

const input = $input.first().json;

// This node runs once per page analysis item (after Split In Batches in W-04)
const page    = input.page    || input; // handle both direct and wrapped formats
const summary = input.summary || {};

const url             = page.url;
const thisWeek        = page.this_week       || {};
const deltas          = page.deltas          || {};
const citationCount   = page.citation_count  || 0;
const citationRate    = page.citation_rate   || 0;
const rewriteFlagged  = page.rewrite_flagged === true;
const rewriteReason   = page.rewrite_reason  || null;
const rewriteActions  = page.actions         || [];
const ruleMatches     = page.rule_matches    || {};

if (!url) {
  throw new Error('SANITY_PATCH_PERFORMANCE: No URL in page analysis. Check Feedback Analyzer output.');
}

// ─── Client config ────────────────────────────────────────────────────────────

const clientSlug = $env.CLIENT_SLUG || 'unknown-client';
const siteUrl    = $env.CLIENT_SITE_URL || '';

// ─── Derive article _id from URL ─────────────────────────────────────────────
// URL format from GSC: https://example.com/blog/keyword-slug/
// Article _id format: article-{clientSlug}-{keyword-slug}

function urlToArticleId(pageUrl, site, slug) {
  try {
    const path      = pageUrl.replace(site, '').replace(/^\/+|\/+$/g, '');
    const lastSegment = path.split('/').pop() || path;
    const cleaned   = lastSegment.replace(/[^a-z0-9-]/g, '').substring(0, 80);
    return `article-${slug}-${cleaned}`;
  } catch {
    return null;
  }
}

const articleId = urlToArticleId(url, siteUrl, clientSlug);

// ─── ISO week helper ──────────────────────────────────────────────────────────

function isoWeek(date = new Date()) {
  const d    = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const day  = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - day);
  const year = d.getUTCFullYear();
  const week = Math.ceil(((d - new Date(Date.UTC(year, 0, 1))) / 86400000 + 1) / 7);
  return `${year}-W${String(week).padStart(2, '0')}`;
}

const weekOf     = isoWeek();
const now        = new Date().toISOString();
const perfDocId  = `perf-${clientSlug}-${(articleId || 'unknown').replace('article-', '')}-${weekOf}`;

// ─── Performance snapshot object (matches article.performance fields) ─────────

const performanceSnapshot = {
  clicks:          thisWeek.clicks      || 0,
  impressions:     thisWeek.impressions || 0,
  ctr:             (thisWeek.ctr || 0) / 100, // feedback-analyzer stores as %, Sanity stores as decimal
  avgPosition:     thisWeek.position    || 99,
  clicksDelta:     deltas.clicks        || 0,
  impressionsDelta:deltas.impressions   || 0,
  positionDelta:   deltas.position      || 0,
  trend:           page.trend           || 'flat',
  citationCount,
  citationRate,
  lastChecked:     now,
};

const mutations = [];

// ─── Mutation 1: Patch article.performance (latest snapshot) ─────────────────

if (articleId) {
  const articlePatch = {
    patch: {
      id:  articleId,
      set: {
        'performance.clicks':          performanceSnapshot.clicks,
        'performance.impressions':     performanceSnapshot.impressions,
        'performance.ctr':             performanceSnapshot.ctr,
        'performance.avgPosition':     performanceSnapshot.avgPosition,
        'performance.clicksDelta':     performanceSnapshot.clicksDelta,
        'performance.impressionsDelta':performanceSnapshot.impressionsDelta,
        'performance.positionDelta':   performanceSnapshot.positionDelta,
        'performance.trend':           performanceSnapshot.trend,
        'performance.citationCount':   performanceSnapshot.citationCount,
        'performance.citationRate':    performanceSnapshot.citationRate,
        'performance.lastChecked':     performanceSnapshot.lastChecked,
        // Rewrite flags
        rewriteFlagged,
        rewriteReason,
        rewriteActions,
      }
    }
  };
  mutations.push(articlePatch);
  console.log(`SANITY_PATCH_PERFORMANCE: patching article=${articleId}, rewrite=${rewriteFlagged}`);
}

// ─── Mutation 2: createOrReplace performanceMetrics (weekly record) ───────────

const perfDocument = {
  _id:   perfDocId,
  _type: 'performanceMetrics',

  // References
  ...(articleId ? { article: { _type: 'reference', _ref: articleId } } : {}),
  articleUrl:  url,
  clientSlug,
  weekOf,
  recordedAt:  now,

  // GSC data
  clicks:          performanceSnapshot.clicks,
  impressions:     performanceSnapshot.impressions,
  ctr:             performanceSnapshot.ctr,
  avgPosition:     performanceSnapshot.avgPosition,

  // Deltas
  clicksDelta:     performanceSnapshot.clicksDelta,
  impressionsDelta:performanceSnapshot.impressionsDelta,
  positionDelta:   performanceSnapshot.positionDelta,
  trend:           performanceSnapshot.trend,

  // AEO
  citationCount,
  citationRate,
  citationRatePct: page.citation_rate_pct || 0,

  // Optimization flags
  rewriteFlagged,
  rewriteReason,
  rewriteActions,
  ruleMatches: {
    highImpressionsLowCtr: ruleMatches.high_impressions_low_ctr === true,
    rankingNotCited:       ruleMatches.ranking_not_cited        === true,
  },
};

mutations.push({ createOrReplace: perfDocument });

const mutationBody = { mutations };

// ─── Output ───────────────────────────────────────────────────────────────────

return [{
  json: {
    sanity_mutation:  mutationBody,
    article_id:       articleId,
    perf_doc_id:      perfDocId,
    url,
    weekOf,
    rewrite_flagged:  rewriteFlagged,
    rewrite_reason:   rewriteReason,
    summary           // pass-through for Telegram weekly report
  }
}];
