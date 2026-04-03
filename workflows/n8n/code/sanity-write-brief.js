/**
 * AJ Digital SEO/AEO Engine — Sanity Write: contentBrief
 * n8n Code Node: W-01 Intelligence Scan
 * Positioned: after Normalizer, before W-02 webhook trigger
 *
 * Operation: createOrReplace (idempotent — re-running W-01 updates existing briefs)
 * Document type: contentBrief
 * Deterministic _id: brief-{clientSlug}-{keyword-slugified}
 *
 * Input:  Normalizer output — one item per actionable opportunity
 * Output: { mutations: [...] } body for Sanity HTTP Request node
 *         + pass-through of original opportunity data for downstream nodes
 *
 * n8n HTTP Request node config (place immediately after this Code node):
 *   Method:  POST
 *   URL:     https://{{$env.SANITY_PROJECT_ID}}.api.sanity.io/v{{$env.SANITY_API_VERSION}}/data/mutate/{{$env.SANITY_DATASET}}
 *   Auth:    Bearer {{$env.SANITY_API_TOKEN}}
 *   Body:    JSON (from this node's output)
 */

// ─── Read inputs ──────────────────────────────────────────────────────────────

const opportunity = $input.first().json.current_opportunity;
const matrixMeta  = $input.first().json;

if (!opportunity || !opportunity.keyword) {
  throw new Error('SANITY_WRITE_BRIEF: No opportunity data in input. Check Normalizer output.');
}

// ─── Client config (from n8n environment) ────────────────────────────────────

const clientSlug  = $env.CLIENT_SLUG || 'unknown-client';
const siteUrl     = $env.CLIENT_SITE_URL || '';

// ─── Deterministic document ID ───────────────────────────────────────────────

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 80);
}

const keywordSlug = slugify(opportunity.keyword);
const docId       = `brief-${clientSlug}-${keywordSlug}`;

// ─── ISO week helper ──────────────────────────────────────────────────────────

function isoWeek(date = new Date()) {
  const d    = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const day  = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - day);
  const year = d.getUTCFullYear();
  const week = Math.ceil(((d - new Date(Date.UTC(year, 0, 1))) / 86400000 + 1) / 7);
  return `${year}-W${String(week).padStart(2, '0')}`;
}

const weekOf = isoWeek();
const now    = new Date().toISOString();

// ─── Map cluster from keyword/intent ─────────────────────────────────────────
// Uses a simple heuristic. Override by setting cluster explicitly in deployment-config.
// The cluster value must match a value in clientProfile.clusterTaxonomy[].value.

function deriveCluster(kw, intent) {
  const kwLower = (kw || '').toLowerCase();
  // Intent-based fallback
  if (intent === 'local') return 'local_seo';
  // Keyword-based matching — extend this map in deployment-config.json
  const clusterMap = [
    { keywords: ['podcast', 'episode', 'audio', 'recording'],          cluster: 'podcast_production' },
    { keywords: ['ai ', 'artificial intelligence', 'chatgpt', 'claude'], cluster: 'ai_consulting'      },
    { keywords: ['content', 'blog', 'article', 'writing'],              cluster: 'content_systems'    },
    { keywords: ['personal brand', 'brand', 'founder', 'thought'],      cluster: 'personal_brand'     },
    { keywords: ['seo', 'search', 'ranking', 'keyword', 'traffic'],     cluster: 'local_seo'          },
  ];
  for (const entry of clusterMap) {
    if (entry.keywords.some(k => kwLower.includes(k))) return entry.cluster;
  }
  return 'content_systems'; // default fallback
}

const cluster = opportunity.cluster || deriveCluster(opportunity.keyword, opportunity.intent);

// ─── Build the contentBrief Sanity document ───────────────────────────────────

const briefDocument = {
  _id:   docId,
  _type: 'contentBrief',

  // Identity
  keyword:    opportunity.keyword,
  slug:       { _type: 'slug', current: keywordSlug },
  clientSlug,
  weekOf,

  // Classification
  intent:          opportunity.intent      || 'informational',
  difficulty:      opportunity.difficulty  || 'unknown',
  cluster,
  volumeEstimate:  opportunity.volume_estimate || 0,
  localCity:       opportunity.local_city  || null,

  // Status — always reset to 'queued' on createOrReplace
  // (re-running W-01 requeues the brief without disrupting in-progress articles)
  status: 'queued',

  // Scoring
  score:    opportunity.score    || 0,
  priority: opportunity.priority || 'medium',
  fastTrack: opportunity.fast_track === true,
  scoringComponents: opportunity.scoring_components
    ? {
        volume:     opportunity.scoring_components.volume     || 0,
        difficulty: opportunity.scoring_components.difficulty || 0,
        intent:     opportunity.scoring_components.intent     || 0,
        local:      opportunity.scoring_components.local      || 0,
        aeo:        opportunity.scoring_components.aeo        || 0,
      }
    : null,

  // AEO context
  aeoQuestion:      opportunity.aeo_question      || null,
  aeoCitationLevel: opportunity.aeo_citation_level || 'low',
  gscStatus:        opportunity.gsc_status         || 'no_data',

  // Research payload (serialized for Sanity text field)
  serpResearchJson: JSON.stringify({
    trending_queries:        matrixMeta.trending_queries        || [],
    content_recommendations: matrixMeta.content_recommendations || [],
    gsc_data:                opportunity.gsc_data               || null,
    aeo_answer_gap:          opportunity.aeo_answer_gap         || null,
  }),

  wordCountTarget: 1400,

  // Timestamps
  createdAt: now,
};

// ─── Build Sanity mutation body ───────────────────────────────────────────────

const mutationBody = {
  mutations: [
    { createOrReplace: briefDocument }
  ]
};

console.log(`SANITY_WRITE_BRIEF: id=${docId}, keyword="${opportunity.keyword}", score=${opportunity.score}`);

// ─── Output ───────────────────────────────────────────────────────────────────
// Return TWO fields:
//   1. sanity_mutation: the body for the HTTP Request node
//   2. brief_id: the deterministic ID for downstream nodes (W-02 webhook payload)

return [{
  json: {
    sanity_mutation:  mutationBody,
    brief_id:         docId,
    brief_keyword:    opportunity.keyword,
    brief_cluster:    cluster,
    brief_fast_track: opportunity.fast_track === true,
    brief_priority:   opportunity.priority,
    opportunity       // pass-through for W-02 webhook
  }
}];
