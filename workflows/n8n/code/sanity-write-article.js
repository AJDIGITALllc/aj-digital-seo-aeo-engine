/**
 * AJ Digital SEO/AEO Engine — Sanity Write: article
 * n8n Code Node: W-02 Article Generator
 * Positioned: after Fast Track Router (fast_track branch), before Sanity HTTP node
 *             AND after Telegram Approval (manual_approval branch)
 *
 * Operation: createOrReplace
 * Document type: article
 * Deterministic _id: article-{clientSlug}-{keyword-slugified}
 *
 * Also fires a Sanity PATCH on the source contentBrief to advance status:
 *   generating → pending_approval (or → published for fast-track)
 *
 * Input:  Fast Track Router output — validated article + routing decision
 * Output: { mutations: [...] } body for Sanity HTTP Request node
 *
 * n8n HTTP Request node config (place immediately after this Code node):
 *   Method:  POST
 *   URL:     https://{{$env.SANITY_PROJECT_ID}}.api.sanity.io/v{{$env.SANITY_API_VERSION}}/data/mutate/{{$env.SANITY_DATASET}}
 *   Auth:    Bearer {{$env.SANITY_API_TOKEN}}
 *   Body:    JSON (from this node's output — field: sanity_mutation)
 */

// ─── Read inputs ──────────────────────────────────────────────────────────────

const routerOutput = $input.first().json;
const article      = routerOutput.article;
const route        = routerOutput.route;       // 'fast_track' | 'manual_approval'
const aeoScore     = routerOutput.aeo_score || 0;
const scores       = routerOutput.scores    || {};
const warnings     = routerOutput.warnings  || [];

if (!article) {
  throw new Error('SANITY_WRITE_ARTICLE: No article in router output. Check Fast Track Router.');
}

// ─── Source brief data (passed through from W-01 webhook payload) ─────────────

const briefData = $('W02: Article Generator Webhook').first().json;
const briefId   = briefData.brief_id   || null;
const cluster   = briefData.brief_cluster || 'content_systems';
const keyword   = briefData.keyword    || article.keyword || '';

// ─── Client config ────────────────────────────────────────────────────────────

const clientSlug  = $env.CLIENT_SLUG || 'unknown-client';

// ─── Deterministic IDs ────────────────────────────────────────────────────────

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 80);
}

const keywordSlug = slugify(keyword);
const articleId   = `article-${clientSlug}-${keywordSlug}`;
const now         = new Date().toISOString();

// ─── Determine article status from route ──────────────────────────────────────

// fast_track → article goes straight to 'approved' (will be published by next node)
// manual_approval → article waits at 'pending_approval' for Telegram decision
const articleStatus = route === 'fast_track' ? 'approved' : 'pending_approval';

// ─── Build schema pack JSON ───────────────────────────────────────────────────
// Minimal FAQPage JSON-LD from faq_pairs — Article schema built by frontend renderer

function buildSchemaPackJson(articleData) {
  const faqPairs = articleData.faq_pairs || [];
  const faqSchema = faqPairs.length >= 1 ? {
    '@context': 'https://schema.org',
    '@type':    'FAQPage',
    mainEntity: faqPairs.map(pair => ({
      '@type':          'Question',
      name:             pair.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text:    pair.answer
      }
    }))
  } : null;

  return JSON.stringify({ faqSchema }, null, 0);
}

// ─── Map faq_pairs to Sanity object array ─────────────────────────────────────

const faqPairs = (article.faq_pairs || []).map((pair, i) => ({
  _key:     `faq-${i}`,
  question: pair.question || '',
  answer:   pair.answer   || ''
}));

// ─── Map internal_link_map ────────────────────────────────────────────────────

const internalLinkMap = (article.internal_link_map || []).map((link, i) => ({
  _key:         `link-${i}`,
  placeholder:  link.placeholder    || '',
  suggestedUrl: link.suggested_url  || '',
  anchorText:   link.anchor_text    || '',
  linkType:     link.link_type      || 'other',
  resolved:     false,
  resolvedUrl:  null,
}));

// ─── Build article Sanity document ───────────────────────────────────────────

const articleDocument = {
  _id:   articleId,
  _type: 'article',

  // Identity
  title:      article.h1         || '',
  slug:       { _type: 'slug', current: keywordSlug },
  keyword,
  cluster,
  clientSlug,
  ...(briefId ? { brief: { _type: 'reference', _ref: briefId } } : {}),

  // Status
  status: articleStatus,

  // SEO meta
  metaTitle:       article.meta_title        || '',
  metaDescription: article.meta_description  || '',
  intent:          briefData.intent          || 'informational',

  // Content
  body:                 article.article_html || '',
  wordCountEstimate:    article.word_count_estimate    || 0,
  readingTimeMinutes:   article.reading_time_minutes   || 0,
  aeoAnswerBlock:       article.aeo_answer_block       || null,
  namedFrameworks:      article.named_frameworks       || [],

  // FAQ
  faqPairs,

  // Internal linking
  internalLinkMap,

  // Structured data
  schemaTypes:    article.schema_types || ['Article', 'FAQPage'],
  schemaPackJson: buildSchemaPackJson(article),

  // AEO validation results
  aeoScore,
  aeoScoreComponents: scores ? {
    h2Count:            scores.h2_count             || 0,
    hasFaqSection:      scores.has_faq_section       || 0,
    faqPairCount:       scores.faq_pair_count        || 0,
    answerFirstRatio:   scores.answer_first_ratio    || 0,
    questionH2Ratio:    scores.question_h2_ratio     || 0,
    hasAuthorBlock:     scores.has_author_block      || 0,
    hasNamedFramework:  scores.has_named_framework   || 0,
    hasComparisonTable: scores.has_comparison_table  || 0,
    internalLinkCount:  scores.internal_link_count   || 0,
    wordCount:          scores.word_count            || 0,
    metaTitleLength:    scores.meta_title_length     || 0,
    metaDescLength:     scores.meta_desc_length      || 0,
  } : null,

  validationPassed:   true, // only reaches this node if passed = true
  validationIssues:   [],
  validationWarnings: warnings,

  // Performance (empty on create — populated by W-04)
  rewriteFlagged: false,
  rewriteReason:  null,
  rewriteActions: [],

  // Timestamps
  updatedAt: now,
  ...(route === 'fast_track' ? { publishedAt: now } : {}),
};

// ─── Also patch the source contentBrief status ───────────────────────────────

const briefStatusPatch = briefId ? {
  patch: {
    id:  briefId,
    set: {
      status:      route === 'fast_track' ? 'published' : 'pending_approval',
      generatedAt: now,
      ...(route === 'fast_track' ? { publishedAt: now } : {}),
    }
  }
} : null;

// ─── Build Sanity mutation body ───────────────────────────────────────────────

const mutations = [{ createOrReplace: articleDocument }];
if (briefStatusPatch) mutations.push(briefStatusPatch);

const mutationBody = { mutations };

console.log(`SANITY_WRITE_ARTICLE: id=${articleId}, route=${route}, aeoScore=${aeoScore}, status=${articleStatus}`);

// ─── Output ───────────────────────────────────────────────────────────────────

return [{
  json: {
    sanity_mutation: mutationBody,
    article_id:      articleId,
    article_status:  articleStatus,
    article_slug:    keywordSlug,
    brief_id:        briefId,
    route,
    aeo_score:       aeoScore,
    keyword,
    // Pass article data through for Telegram notification node
    article_title:   article.h1 || '',
    article_meta_description: article.meta_description || '',
  }
}];
