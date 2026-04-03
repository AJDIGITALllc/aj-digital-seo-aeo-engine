/**
 * AJ Digital SEO/AEO Engine — Feedback Analyzer v1.0
 * n8n Code Node: W-04 Feedback Collector
 *
 * This is the optimization loop brain. It compares this week vs last week,
 * calculates citation rates, and fires specific rewrite triggers.
 *
 * Three optimization rules (from hardening spec):
 *
 *   RULE 1: Citation Rate
 *     citation_rate = citations / impressions
 *     Tracks whether AI engines are extracting content as this page gains visibility.
 *
 *   RULE 2: High Impressions + Low CTR → Rewrite Title + Meta
 *     If impressions >= 500 AND ctr < 0.03 (3%), the page is visible but not compelling.
 *     Fix: rewrite meta_title and meta_description. Content is fine.
 *
 *   RULE 3: Ranking But Not Cited → Inject Definition + Answer-First
 *     If position <= 15 (ranking) AND citations == 0, the page ranks but AI ignores it.
 *     Fix: inject a better definition block and strengthen the answer-first opening.
 *
 * Input:
 *   - $('GSC: This Week')      → Google Search Console (last 7 days)
 *   - $('GSC: Last Week')      → Google Search Console (8–14 days ago)
 *   - $('Perplexity: Citation Check') → Citation check results
 *   - $('Sanity: Published Articles') → All published articles with performance data
 *
 * Output: Array of page-level analysis objects with action flags
 */

// ─── Gather inputs ────────────────────────────────────────────────────────────

const thisWeekRows  = $('GSC: This Week').first().json?.rows  || [];
const lastWeekRows  = $('GSC: Last Week').first().json?.rows  || [];
const citationRaw   = $('Perplexity: Citation Check').first().json?.choices?.[0]?.message?.content;
const sanityArticles = $('Sanity: Published Articles').first().json?.result || [];

console.log('FEEDBACK_INPUTS: thisWeek=', thisWeekRows.length, 'lastWeek=', lastWeekRows.length);

// ─── Parse citation data ──────────────────────────────────────────────────────

let citationData = { citations: [] };
try {
  citationData = citationRaw ? JSON.parse(citationRaw) : { citations: [] };
} catch (e) {
  console.log('CITATION_PARSE_WARNING: Could not parse citation check output. Proceeding without.');
}

// Build citation index by URL fragment (keyword-to-citation map)
const citationIndex = {};
for (const c of citationData.citations || []) {
  const questionLower = (c.question || '').toLowerCase();
  citationIndex[questionLower] = {
    aj_cited:   c.aj_digital_cited || false,
    competitors: c.competing_sources || [],
    opportunity: c.citation_opportunity || 'low'
  };
}

// ─── Build GSC indexes ────────────────────────────────────────────────────────

function indexGSCRows(rows) {
  const index = {};
  for (const row of rows) {
    const url = row.keys?.[1] || row.keys?.[0] || 'unknown';
    if (!index[url]) {
      index[url] = { clicks: 0, impressions: 0, ctr: 0, position: 0, count: 0 };
    }
    index[url].clicks      += row.clicks      || 0;
    index[url].impressions += row.impressions || 0;
    index[url].ctr          = row.ctr          || 0;  // latest value
    index[url].position     = row.position     || 99;
    index[url].count++;
  }
  return index;
}

const thisWeek = indexGSCRows(thisWeekRows);
const lastWeek = indexGSCRows(lastWeekRows);

// ─── Core analysis function ───────────────────────────────────────────────────

function analyzePagePerformance(url, thisData, lastData) {
  const clicks_delta      = thisData.clicks      - (lastData?.clicks      || 0);
  const impressions_delta = thisData.impressions - (lastData?.impressions || 0);
  const position_delta    = (lastData?.position  || 99) - thisData.position; // positive = improved

  // ── RULE 1: Citation Rate ────────────────────────────────────────────────
  // citation_rate = citations / impressions (how often page is cited per impression)
  const citation_count = (() => {
    let count = 0;
    for (const [question, data] of Object.entries(citationIndex)) {
      if (data.aj_cited && url.toLowerCase().includes(question.split(' ')[0])) count++;
    }
    return count;
  })();

  const citation_rate = thisData.impressions > 0
    ? parseFloat((citation_count / thisData.impressions).toFixed(6))
    : 0;

  // ── RULE 2: High Impressions + Low CTR → Rewrite Title + Meta ───────────
  const CTR_THRESHOLD         = 0.03;  // 3%
  const IMPRESSIONS_THRESHOLD = 500;
  const isHighImpressionsLowCTR =
    thisData.impressions >= IMPRESSIONS_THRESHOLD &&
    thisData.ctr < CTR_THRESHOLD;

  // ── RULE 3: Ranking But Not Cited → Inject Definition Block ─────────────
  const RANKING_POSITION_THRESHOLD = 15;
  const isRankingNotCited =
    thisData.position <= RANKING_POSITION_THRESHOLD &&
    citation_count === 0;

  // ── Determine actions ────────────────────────────────────────────────────
  const actions = [];
  let rewrite_flagged = false;
  let rewrite_reason  = null;

  if (isHighImpressionsLowCTR) {
    actions.push('rewrite_title_meta');
    rewrite_flagged = true;
    rewrite_reason = (rewrite_reason ? rewrite_reason + ' | ' : '') +
      `HIGH_IMPRESSIONS_LOW_CTR: ${thisData.impressions} impressions, ${(thisData.ctr * 100).toFixed(1)}% CTR (threshold: 3%). Rewrite meta_title and meta_description.`;
    console.log('RULE2_TRIGGERED:', url, rewrite_reason);
  }

  if (isRankingNotCited) {
    actions.push('inject_definition_answer_first');
    rewrite_flagged = true;
    rewrite_reason = (rewrite_reason ? rewrite_reason + ' | ' : '') +
      `RANKING_NOT_CITED: Position ${thisData.position.toFixed(1)}, 0 AI citations. Inject definition block and strengthen answer-first paragraph.`;
    console.log('RULE3_TRIGGERED:', url, rewrite_reason);
  }

  // ── Performance trend ─────────────────────────────────────────────────────
  const trend = clicks_delta > 0 ? 'growing'
    : clicks_delta < 0 ? 'declining'
    : 'flat';

  return {
    url,
    this_week: {
      clicks:      thisData.clicks,
      impressions: thisData.impressions,
      ctr:         parseFloat((thisData.ctr * 100).toFixed(2)),
      position:    parseFloat(thisData.position.toFixed(1))
    },
    deltas: {
      clicks:      clicks_delta,
      impressions: impressions_delta,
      position:    parseFloat(position_delta.toFixed(1))
    },
    trend,

    // Citation metrics (RULE 1)
    citation_count,
    citation_rate,
    citation_rate_pct: parseFloat((citation_rate * 100).toFixed(4)),

    // Optimization flags
    rewrite_flagged,
    rewrite_reason,
    actions,

    // Rule match details
    rule_matches: {
      high_impressions_low_ctr: isHighImpressionsLowCTR,
      ranking_not_cited:        isRankingNotCited
    }
  };
}

// ─── Analyze all pages in GSC this-week data ─────────────────────────────────

const pageAnalyses = [];

for (const [url, thisData] of Object.entries(thisWeek)) {
  const lastData = lastWeek[url] || null;
  const analysis = analyzePagePerformance(url, thisData, lastData);
  pageAnalyses.push(analysis);
}

// ─── Sort: rewrites first, then by impressions descending ────────────────────

pageAnalyses.sort((a, b) => {
  if (a.rewrite_flagged && !b.rewrite_flagged) return -1;
  if (!a.rewrite_flagged && b.rewrite_flagged) return 1;
  return b.this_week.impressions - a.this_week.impressions;
});

// ─── Build summary ────────────────────────────────────────────────────────────

const rewriteQueue  = pageAnalyses.filter(p => p.rewrite_flagged);
const citedPages    = pageAnalyses.filter(p => p.citation_count > 0);
const growingPages  = pageAnalyses.filter(p => p.trend === 'growing');
const decliningPages = pageAnalyses.filter(p => p.trend === 'declining');

const weeklyDeltaClicks      = pageAnalyses.reduce((sum, p) => sum + p.deltas.clicks, 0);
const weeklyDeltaImpressions = pageAnalyses.reduce((sum, p) => sum + p.deltas.impressions, 0);

const summary = {
  generated_at:             new Date().toISOString(),
  pages_analyzed:           pageAnalyses.length,
  total_clicks_delta:       weeklyDeltaClicks,
  total_impressions_delta:  weeklyDeltaImpressions,
  trend:                    weeklyDeltaClicks > 0 ? 'up' : weeklyDeltaClicks < 0 ? 'down' : 'flat',
  rewrite_queue_count:      rewriteQueue.length,
  cited_pages_count:        citedPages.length,
  growing_pages_count:      growingPages.length,
  declining_pages_count:    decliningPages.length,

  // For Telegram report
  top_growing_page:         growingPages[0]?.url  || 'none',
  top_cited_page:           citedPages[0]?.url    || 'none',
  top_rewrite_needed:       rewriteQueue[0]?.url  || 'none',
  top_rewrite_reason:       rewriteQueue[0]?.rewrite_reason || null
};

console.log('FEEDBACK_SUMMARY:', JSON.stringify(summary));

// ─── Return: one item per page that needs action, plus the summary ────────────

const actionablePages = rewriteQueue.map(p => ({
  json: {
    type:      'page_analysis',
    summary,
    page:      p,
    action_required: true
  }
}));

// Always include the summary as the first item
return [
  { json: { type: 'summary', summary, all_analyses: pageAnalyses } },
  ...actionablePages
];
