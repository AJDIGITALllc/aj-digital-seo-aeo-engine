/**
 * AJ Digital SEO/AEO Engine — Normalizer Node v2.0
 * n8n Code Node: Perplexity Output → Structured Opportunity Matrix
 *
 * HARDENED:
 *   - Strict Perplexity output validation (throws + kills workflow on bad data)
 *   - Raw output logging for every run (audit trail)
 *   - Weighted scoring formula: volume + difficulty + intent + local + AEO citation
 *   - Fast-track flagging for auto-publish candidates
 *
 * Inputs:
 *   - $('Perplexity: Opportunity Scan') → Perplexity API response
 *   - $('GSC: Top Queries')             → Google Search Console rows
 */

// ─── STEP 1: Capture raw Perplexity text (ALWAYS LOG FIRST) ──────────────────

const rawText = $('Perplexity: Opportunity Scan').first().json?.choices?.[0]?.message?.content;

if (!rawText) {
  throw new Error('NORMALIZER_FATAL: Perplexity returned no content. Check API key and model.');
}

// Raw output log — visible in n8n execution log for every run
console.log('RAW_PERPLEXITY_OUTPUT:', JSON.stringify(rawText, null, 2));

// ─── STEP 2: Parse JSON (strict) ─────────────────────────────────────────────

let data;
try {
  data = typeof rawText === 'string' ? JSON.parse(rawText) : rawText;
} catch (e) {
  console.log('PARSE_FAILED_RAW:', rawText.substring(0, 500));
  throw new Error(`NORMALIZER_FATAL: Cannot parse Perplexity JSON — ${e.message}. See RAW above.`);
}

// ─── STEP 3: Structural validation (kill workflow on missing fields) ──────────

const REQUIRED_FIELDS = [
  'low_competition_keywords',
  'ai_questions',
  'content_recommendations',
  'local_opportunities',
  'trending_queries'
];

const missingFields = REQUIRED_FIELDS.filter(f => !data[f]);
if (missingFields.length > 0) {
  console.log('VALIDATION_FAILED_DATA:', JSON.stringify(data, null, 2));
  throw new Error(
    `NORMALIZER_FATAL: Invalid Perplexity output — missing fields: [${missingFields.join(', ')}]. ` +
    'Re-run W-01 or check Perplexity prompt in workflow spec.'
  );
}

if (!data.content_recommendations || data.content_recommendations.length === 0) {
  throw new Error('NORMALIZER_FATAL: Invalid Perplexity output: missing content_recommendations.');
}

if (!data.low_competition_keywords || data.low_competition_keywords.length === 0) {
  throw new Error('NORMALIZER_FATAL: Invalid Perplexity output: no low_competition_keywords returned.');
}

console.log('VALIDATION_PASSED: fields OK, keywords:', data.low_competition_keywords.length);

// ─── STEP 4: Build GSC keyword index ─────────────────────────────────────────

const gscRows = $('GSC: Top Queries').first().json?.rows || [];
const gscIndex = {};
for (const row of gscRows) {
  const keyword = row.keys?.[0]?.toLowerCase();
  if (keyword) {
    gscIndex[keyword] = {
      clicks:      row.clicks      || 0,
      impressions: row.impressions || 0,
      ctr:         row.ctr         || 0,
      position:    row.position    || 99
    };
  }
}

// ─── STEP 5: Volume estimator (Perplexity gives strings like "1,200/mo") ──────

function estimateVolume(volumeStr) {
  if (!volumeStr) return 500; // default mid estimate
  const cleaned = String(volumeStr).replace(/[^0-9]/g, '');
  const num = parseInt(cleaned, 10);
  if (isNaN(num)) return 500;
  return num;
}

// ─── STEP 6: Weighted opportunity scoring formula ─────────────────────────────
//
// score = (volume_score    * 0.30)   ← traffic ceiling
//       + (difficulty_inv  * 0.30)   ← how winnable is this?
//       + (intent_score    * 0.20)   ← does this drive revenue?
//       + (local_boost     * 0.10)   ← Miami/South Florida advantage
//       + (aeo_citation    * 0.10)   ← AI citation likelihood
//
// Each component is normalized to 0–10 before weighting.
// Combined score is 0–10 (not 0–100 — keeps thresholds intuitive).

function volumeComponent(estimatedVolume) {
  // Scale: 0–200 → 2, 201–500 → 4, 501–1000 → 6, 1001–3000 → 8, 3000+ → 10
  if (estimatedVolume >= 3000) return 10;
  if (estimatedVolume >= 1001) return 8;
  if (estimatedVolume >= 501)  return 6;
  if (estimatedVolume >= 201)  return 4;
  return 2;
}

function difficultyComponent(difficulty) {
  // Inverted — lower difficulty = higher score
  const map = { very_low: 10, low: 8, medium: 5, high: 2 };
  return map[difficulty] ?? 5;
}

function intentComponent(intent) {
  // Commercial and local drive direct revenue
  const map = { commercial: 10, transactional: 9, local: 8, informational: 6 };
  return map[intent] ?? 5;
}

function localBoostComponent(intent, keyword) {
  // Extra points for Miami/South Florida intent or explicit city in keyword
  const localSignals = ['miami', 'fort lauderdale', 'west palm', 'south florida', 'hialeah', 'near me'];
  const kwLower = keyword.toLowerCase();
  const hasLocalSignal = localSignals.some(s => kwLower.includes(s));
  if (intent === 'local' || hasLocalSignal) return 10;
  return 0;
}

function aeoComponent(keyword, aiQuestions) {
  // High if there's a matching AI question with citation_opportunity = 'high'
  const kwLower = keyword.toLowerCase();
  for (const q of aiQuestions) {
    if (q.citation_opportunity !== 'high') continue;
    const qWords = q.question.toLowerCase().split(/\s+/);
    const kwWords = kwLower.split(/\s+/);
    const overlap = kwWords.filter(w => qWords.includes(w)).length;
    if (overlap >= Math.min(2, kwWords.length)) return 10;
  }
  // Medium if there's any AI question that partially matches
  for (const q of aiQuestions) {
    if (q.question.toLowerCase().includes(kwLower.split(' ')[0])) return 6;
  }
  return 3;
}

function weightedScore(vol, diff, intent, local, aeo) {
  return parseFloat((
    (vol   * 0.30) +
    (diff  * 0.30) +
    (intent * 0.20) +
    (local  * 0.10) +
    (aeo    * 0.10)
  ).toFixed(2));
}

function priorityFromScore(score) {
  if (score >= 8.0) return 'critical';
  if (score >= 6.0) return 'high';
  if (score >= 4.0) return 'medium';
  return 'low';
}

// ─── STEP 7: Fast-track eligibility check ────────────────────────────────────
//
// Fast-track = auto-publish after validation, skip manual Telegram approval.
// Criteria: local keyword OR (low/very_low difficulty AND commercial/local intent)

function isFastTrack(kw) {
  const isLocal    = kw.intent === 'local' ||
    ['miami', 'fort lauderdale', 'west palm', 'south florida', 'hialeah'].some(
      c => kw.keyword.toLowerCase().includes(c)
    );
  const isLowKD    = ['very_low', 'low'].includes(kw.difficulty);
  const isCommercial = ['commercial', 'transactional', 'local'].includes(kw.intent);

  return isLocal || (isLowKD && isCommercial);
}

// ─── STEP 8: Build opportunity objects ───────────────────────────────────────

const aiQuestions = data.ai_questions || [];
const aeoQuestionMap = {};

// Pre-index high-value AEO questions for answer attachment
for (const q of aiQuestions) {
  if (q.citation_opportunity === 'high') {
    const qWords = q.question.toLowerCase().split(/\s+/);
    for (const kw of (data.low_competition_keywords || []).map(k => k.keyword.toLowerCase())) {
      const kwWords = kw.split(/\s+/);
      const overlap = kwWords.filter(w => qWords.includes(w)).length;
      if (overlap >= Math.min(2, kwWords.length)) {
        aeoQuestionMap[kw] = q;
      }
    }
  }
}

const opportunities = [];

for (const kw of data.low_competition_keywords) {
  // Validate individual keyword entry
  if (!kw.keyword || typeof kw.keyword !== 'string') {
    console.log('SKIPPED_INVALID_KEYWORD:', JSON.stringify(kw));
    continue;
  }

  const vol_est    = estimateVolume(kw.volume_estimate);
  const vol_comp   = volumeComponent(vol_est);
  const diff_comp  = difficultyComponent(kw.difficulty);
  const intent_comp = intentComponent(kw.intent);
  const local_comp = localBoostComponent(kw.intent, kw.keyword);
  const aeo_comp   = aeoComponent(kw.keyword, aiQuestions);

  const score = weightedScore(vol_comp, diff_comp, intent_comp, local_comp, aeo_comp);

  const gscMatch = gscIndex[kw.keyword.toLowerCase()];
  let gsc_status = 'no_data';
  let gsc_boost_note = null;
  if (gscMatch) {
    if (gscMatch.position <= 10)  { gsc_status = 'already_ranking_p1'; }
    else if (gscMatch.position <= 20) { gsc_status = 'ranking_page2'; }
    else { gsc_status = 'ranking_poorly'; }
    gsc_boost_note = `pos: ${gscMatch.position.toFixed(1)}, clicks: ${gscMatch.clicks}, ctr: ${(gscMatch.ctr * 100).toFixed(1)}%`;
  }

  const matched_question = aeoQuestionMap[kw.keyword.toLowerCase()];

  opportunities.push({
    keyword:             kw.keyword,
    intent:              kw.intent      || 'unknown',
    difficulty:          kw.difficulty  || 'unknown',
    volume_estimate:     vol_est,

    // Scored components (for audit / explainability)
    scoring_components: {
      volume:     vol_comp,
      difficulty: diff_comp,
      intent:     intent_comp,
      local:      local_comp,
      aeo:        aeo_comp
    },

    // Final score and routing
    score,
    priority:            priorityFromScore(score),
    fast_track:          isFastTrack(kw),
    recommended_action:  gsc_status === 'already_ranking_p1' ? 'optimize' : 'create',

    // GSC context
    gsc_status,
    gsc_data:            gsc_boost_note,

    // AEO context
    aeo_question:        matched_question?.question    || null,
    aeo_answer_gap:      matched_question?.answer_gap  ?? null,
    aeo_citation_level:  matched_question ? 'high' : (aeo_comp >= 6 ? 'medium' : 'low'),

    source:              'perplexity_weekly_scan',
    normalized_at:       new Date().toISOString()
  });
}

// ─── STEP 9: Add local opportunities ─────────────────────────────────────────

for (const local of data.local_opportunities) {
  if (!local.keyword) continue;

  const score = weightedScore(4, 10, 8, 10, 3); // Local defaults: low volume, very low KD, local intent

  opportunities.push({
    keyword:         local.keyword,
    intent:          'local',
    difficulty:      local.competition || 'low',
    volume_estimate: 300,

    scoring_components: { volume: 4, difficulty: 10, intent: 8, local: 10, aeo: 3 },

    score,
    priority:        'high',
    fast_track:      true, // All local keywords fast-track
    recommended_action: 'create',

    gsc_status:      gscIndex[local.keyword.toLowerCase()] ? 'ranking_poorly' : 'no_data',
    gsc_data:        null,

    aeo_question:    null,
    aeo_answer_gap:  null,
    aeo_citation_level: 'low',

    local_city:      local.city || 'Miami',
    source:          'perplexity_local_scan',
    normalized_at:   new Date().toISOString()
  });
}

// ─── STEP 10: Sort, summarize, log ───────────────────────────────────────────

opportunities.sort((a, b) => b.score - a.score);

const summary = {
  total:      opportunities.length,
  critical:   opportunities.filter(o => o.priority === 'critical').length,
  high:       opportunities.filter(o => o.priority === 'high').length,
  fast_track: opportunities.filter(o => o.fast_track).length,
  top_keyword: opportunities[0]?.keyword || 'none'
};

console.log('NORMALIZER_SUMMARY:', JSON.stringify(summary));

// ─── STEP 11: Return actionable opportunities only ───────────────────────────

const actionable = opportunities.filter(o => ['critical', 'high'].includes(o.priority));

if (actionable.length === 0) {
  throw new Error(
    'NORMALIZER_FATAL: Zero critical/high opportunities scored. ' +
    'Check Perplexity prompt for topic relevance or broaden seed query.'
  );
}

const matrixMeta = {
  generated_at:            new Date().toISOString(),
  site_url:                'https://weareajdigital.com',
  summary,
  trending_queries:        data.trending_queries        || [],
  content_recommendations: data.content_recommendations || []
};

return actionable.map(o => ({ json: { ...matrixMeta, current_opportunity: o } }));
