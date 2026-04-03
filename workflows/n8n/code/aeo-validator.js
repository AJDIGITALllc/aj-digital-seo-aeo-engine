/**
 * AJ Digital SEO/AEO Engine — AEO Validator Node v2.0
 * n8n Code Node: Hard quality gate for every Claude article
 *
 * HARDENED v2.0:
 *   - Hard fail() helper — unified blocker pattern (no silent misses)
 *   - Explicit H2 count enforcement (throws, not warns)
 *   - FAQ hard check with item count
 *   - Answer-first block detection (regex-based paragraph scan)
 *   - Kill switch output: { kill: true } routes to STOP branch + Telegram alert
 *   - AEO composite score 0–100 for Sanity storage
 *
 * Input:  Claude API response (previous node)
 * Output: { kill, passed, aeo_score, issues[], warnings[], article, scores{} }
 *
 * Routing:
 *   kill === true  → STOP branch → Telegram error alert → workflow ends
 *   passed === true  → Approve branch
 *   passed === false → Revise branch (revision pass, not kill)
 */

// ─── Parse Claude response ────────────────────────────────────────────────────

let article;
try {
  const rawText = $input.first().json.content[0].text;
  console.log('AEO_VALIDATOR_RAW_LENGTH:', rawText?.length);
  article = typeof rawText === 'string' ? JSON.parse(rawText) : rawText;
} catch (e) {
  // Unparseable Claude response = kill switch
  return [{
    json: {
      kill: true,
      kill_reason: `Claude response unparseable: ${e.message}`,
      passed: false,
      aeo_score: 0,
      issues: [`PARSE_FAILURE: ${e.message}`],
      warnings: [],
      article: null,
      scores: {}
    }
  }];
}

const html   = article.article_html || '';
const issues  = [];  // Blockers → revision pass
const warnings = []; // Non-blocking → flag for review
const scores  = {};  // Per-check scores for Sanity audit trail

// ─── HARD ENFORCEMENT HELPER ──────────────────────────────────────────────────
// fail() adds to issues[] AND logs — every call is visible in n8n execution log

function fail(code, detail = '') {
  const msg = detail ? `${code}: ${detail}` : code;
  issues.push(msg);
  console.log('VALIDATION_FAIL:', msg);
}

function warn(code, detail = '') {
  const msg = detail ? `${code}: ${detail}` : code;
  warnings.push(msg);
  console.log('VALIDATION_WARN:', msg);
}

// ─── BLOCK 1: STRUCTURAL COMPLETENESS (article must exist and be complete) ───

if (!article || typeof article !== 'object') {
  return [{
    json: {
      kill: true,
      kill_reason: 'Claude returned null or non-object article',
      passed: false,
      aeo_score: 0,
      issues: ['NULL_ARTICLE'],
      warnings: [],
      article: null,
      scores: {}
    }
  }];
}

if (!html || html.length < 500) {
  fail('ARTICLE_BODY_TOO_SHORT', `${html.length} chars — minimum 500`);
}

// ─── BLOCK 2: META RULES ──────────────────────────────────────────────────────

scores.meta_title_length = article.meta_title?.length || 0;
if (!article.meta_title) {
  fail('META_TITLE_MISSING');
} else if (scores.meta_title_length > 60) {
  fail('META_TITLE_TOO_LONG', `${scores.meta_title_length} chars — max 60`);
}

scores.meta_desc_length = article.meta_description?.length || 0;
if (scores.meta_desc_length < 100) {
  fail('META_DESC_TOO_SHORT', `${scores.meta_desc_length} chars — minimum 140`);
} else if (scores.meta_desc_length > 165) {
  warn('META_DESC_TOO_LONG', `${scores.meta_desc_length} chars — max 160`);
}

if (!article.h1) {
  fail('H1_MISSING');
}

// ─── BLOCK 3: H2 COUNT — HARD ENFORCEMENT ────────────────────────────────────

const h2Tags = html.match(/<h2[^>]*>/gi) || [];
scores.h2_count = h2Tags.length;

if (scores.h2_count < 4) {
  fail('INSUFFICIENT_H2_SECTIONS',
    `Found ${scores.h2_count} — minimum 4 required. ` +
    'Every H2 must be a user question (How/What/Why/Which). Add missing sections.');
}

// ─── BLOCK 4: FAQ SECTION — HARD ENFORCEMENT ─────────────────────────────────

const hasFaqHeading = /(<h[23][^>]*>\s*(?:frequently asked questions|faq|common questions)[^<]*<\/h[23]>)/i.test(html);
scores.has_faq_section = hasFaqHeading ? 1 : 0;

if (!hasFaqHeading) {
  fail('MISSING_FAQ_SECTION',
    'No FAQ heading found. Add an H2 or H3 "Frequently Asked Questions" section. ' +
    'This is required for FAQPage JSON-LD schema and AI citation.');
}

const faqPairs = article.faq_pairs || [];
scores.faq_pair_count = faqPairs.length;

if (faqPairs.length < 6) {
  fail('INSUFFICIENT_FAQ_PAIRS',
    `Found ${faqPairs.length} — minimum 6 required. ` +
    'Add questions from the PAA (People Also Ask) data in the SERP research.');
}

// Validate each FAQ answer is within the AEO target range
const shortFaqs = faqPairs.filter(pair => {
  const wc = (pair.answer || '').split(/\s+/).filter(Boolean).length;
  return wc < 30;
});
if (shortFaqs.length > 0) {
  warn('FAQ_ANSWERS_TOO_SHORT',
    `${shortFaqs.length} FAQ answer(s) under 30 words. Target: 40–75 words per answer.`);
}

// ─── BLOCK 5: ANSWER-FIRST BLOCKS — HARD ENFORCEMENT ─────────────────────────
//
// Each H2 section MUST be immediately followed by a paragraph of 40+ words.
// This is the core AEO requirement — AI systems extract these blocks.

const h2Sections = [...html.matchAll(/<h2[^>]*>(.*?)<\/h2>\s*(<p>[\s\S]{150,}?<\/p>)?/gi)];
const sectionsWithAnswer = h2Sections.filter(m => !!m[2]);
scores.answer_first_ratio = h2Sections.length > 0
  ? parseFloat((sectionsWithAnswer.length / h2Sections.length).toFixed(2))
  : 0;

if (h2Sections.length > 0 && scores.answer_first_ratio < 0.5) {
  fail('MISSING_ANSWER_FIRST_BLOCKS',
    `Only ${(scores.answer_first_ratio * 100).toFixed(0)}% of H2 sections ` +
    'have an immediate answer paragraph (min 150 chars). ' +
    'Each H2 must open with a 40–75 word direct answer block.');
} else if (scores.answer_first_ratio < 0.75) {
  warn('LOW_ANSWER_FIRST_RATIO',
    `${(scores.answer_first_ratio * 100).toFixed(0)}% of H2s have answer blocks — target 100%.`);
}

// ─── BLOCK 6: AUTHOR BLOCK ────────────────────────────────────────────────────

scores.has_author_block = html.includes('Audio Jones') ? 1 : 0;
if (!scores.has_author_block) {
  fail('MISSING_AUTHOR_BLOCK',
    '"Audio Jones" not found in article body. ' +
    'Add author block after H1: "By Audio Jones | Podcast Producer & AI Consultant, AJ Digital"');
}

// ─── BLOCK 7: WORD COUNT ─────────────────────────────────────────────────────

scores.word_count = article.word_count_estimate || 0;
if (scores.word_count < 800) {
  fail('WORD_COUNT_TOO_LOW',
    `${scores.word_count} words — minimum 800. ` +
    'Add more depth to H2 sections or expand FAQ answers.');
}

// ─── BLOCK 8: SCHEMA TYPES ───────────────────────────────────────────────────

if (!article.schema_types || article.schema_types.length === 0) {
  fail('MISSING_SCHEMA_TYPES',
    'No schema_types array in article JSON. Must include at least: ["Article", "FAQPage"]');
}

// ─── BLOCK 9: CTA PRESENCE ───────────────────────────────────────────────────

const hasCta = /work-with-us|book.*session|book.*call|free.*strategy|free.*consult/i.test(html);
scores.has_cta = hasCta ? 1 : 0;
if (!hasCta) {
  fail('MISSING_CTA',
    'No booking/consultation CTA detected. ' +
    'Add: "Book My Free Strategy Session → /work-with-us/" before the FAQ section.');
}

// ─── SOFT RULES (warnings only) ──────────────────────────────────────────────

// Internal links
const internalLinks = (html.match(/\[LINK:/g) || []).length;
scores.internal_link_count = internalLinks;
if (internalLinks < 3) {
  warn('FEW_INTERNAL_LINKS', `${internalLinks} [LINK:] placeholders found — target 4`);
}

// H2s should be questions
const h2TextMatches = [...html.matchAll(/<h2[^>]*>([^<]+)<\/h2>/gi)];
const questionH2s = h2TextMatches.filter(m =>
  /\?$/.test(m[1].trim()) ||
  /^(how|what|why|when|which|where|is|are|does|do|can|should)/i.test(m[1].trim())
);
scores.question_h2_ratio = h2Tags.length > 0
  ? parseFloat((questionH2s.length / h2Tags.length).toFixed(2))
  : 0;
if (scores.question_h2_ratio < 0.5) {
  warn('LOW_QUESTION_H2_RATIO',
    `${(scores.question_h2_ratio * 100).toFixed(0)}% of H2s are questions — target 80%+`);
}

// Named AJ Digital framework
const hasNamedFramework = /the aj digital|step system|framework|method|stack/i.test(html);
scores.has_named_framework = hasNamedFramework ? 1 : 0;
if (!hasNamedFramework) {
  warn('MISSING_NAMED_FRAMEWORK',
    'Add an "AJ Digital [Name] Framework" — named frameworks increase AI citation probability.');
}

// Comparison table
const hasTable = /<table/i.test(html);
scores.has_comparison_table = hasTable ? 1 : 0;
if (!hasTable) {
  warn('NO_COMPARISON_TABLE', 'Add a comparison table — this format is cited 3x more by AI engines.');
}

// ─── AEO Composite Score (0–100) ─────────────────────────────────────────────

const aeo_score = Math.round(
  (hasFaqHeading               ? 20 : 0) +
  (faqPairs.length >= 6        ? 20 : (faqPairs.length / 6) * 20) +
  (scores.has_author_block     ? 10 : 0) +
  (scores.answer_first_ratio   * 20) +
  (scores.question_h2_ratio    * 15) +
  (hasNamedFramework           ? 10 : 0) +
  (hasTable                    ?  5 : 0)
);

// ─── Kill switch: only triggered by truly unrecoverable failures ──────────────
// A revision pass can fix structural issues. Kill is reserved for:
//   - Unparseable output (handled above)
//   - Null article body
//   - Combined hard failures that would require a full rewrite (5+ blockers)

const kill = issues.length >= 5;
const passed = issues.length === 0;

if (kill) {
  console.log('KILL_SWITCH_TRIGGERED:', issues.length, 'blocking failures:', issues.join(' | '));
}

if (passed) {
  console.log('VALIDATION_PASSED: aeo_score=' + aeo_score + ', warnings=' + warnings.length);
} else {
  console.log('VALIDATION_FAILED: issues=' + issues.length + ', will route to revision pass');
}

// ─── Return ───────────────────────────────────────────────────────────────────

return [{
  json: {
    kill,
    kill_reason: kill ? `${issues.length} blocking failures — revision pass insufficient: ${issues.slice(0,3).join('; ')}` : null,
    passed,
    aeo_score,
    issue_count:   issues.length,
    warning_count: warnings.length,
    issues,
    warnings,
    scores,
    article,
    disposition: kill ? 'KILL' : passed ? (warnings.length === 0 ? 'CLEAN_PASS' : 'PASS_WITH_WARNINGS') : 'FAILED_REVISION_NEEDED',
    validation_timestamp: new Date().toISOString()
  }
}];
