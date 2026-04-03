/**
 * AJ Digital SEO/AEO Engine — Fast Track Router
 * n8n Code Node: Routes validated articles to auto-publish or manual approval
 *
 * Fast Track = article publishes automatically after validation pass.
 * Standard  = article goes to Telegram for manual approval.
 *
 * Fast Track criteria (ANY of these qualifies):
 *   A) Local keyword (Miami, Fort Lauderdale, etc.) — low-risk, high local value
 *   B) Difficulty: very_low + intent: commercial or transactional
 *   C) brief.fast_track === true (set by Normalizer)
 *
 * Hard blockers (NEVER fast-track even if criteria met):
 *   - kill === true from validator
 *   - aeo_score < 60 (content quality floor)
 *   - validation warnings count >= 4 (too many soft issues)
 *
 * Input:  AEO Validator output + original brief data
 * Output: { route: 'fast_track' | 'manual_approval' | 'kill', reason }
 */

const validated  = $input.first().json;
const brief      = $('W02: Article Generator Webhook').first().json;

// ─── Kill switch passthrough ──────────────────────────────────────────────────

if (validated.kill) {
  console.log('FAST_TRACK_ROUTER: Kill switch active — routing to STOP.');
  return [{
    json: {
      route:  'kill',
      reason: validated.kill_reason || 'Validator triggered kill switch',
      article: validated.article,
      issues:  validated.issues
    }
  }];
}

// ─── Must have passed validation ─────────────────────────────────────────────

if (!validated.passed) {
  console.log('FAST_TRACK_ROUTER: Validation failed — routing to revision pass.');
  return [{
    json: {
      route:  'revision',
      reason: `${validated.issue_count} blocking issues require revision`,
      article:  validated.article,
      issues:   validated.issues,
      warnings: validated.warnings
    }
  }];
}

// ─── Quality floor check (even fast-track must clear this) ───────────────────

const aeo_score       = validated.aeo_score   || 0;
const warning_count   = validated.warning_count || 0;

if (aeo_score < 60) {
  console.log('FAST_TRACK_ROUTER: AEO score too low for fast-track:', aeo_score);
  return [{
    json: {
      route:  'manual_approval',
      reason: `AEO score ${aeo_score}/100 is below fast-track floor (60). Requires human review.`,
      article:  validated.article,
      warnings: validated.warnings,
      aeo_score
    }
  }];
}

if (warning_count >= 4) {
  console.log('FAST_TRACK_ROUTER: Too many warnings for auto-publish:', warning_count);
  return [{
    json: {
      route:  'manual_approval',
      reason: `${warning_count} warnings exceed fast-track threshold (max 3). Requires human review.`,
      article:  validated.article,
      warnings: validated.warnings,
      aeo_score
    }
  }];
}

// ─── Fast track eligibility checks ───────────────────────────────────────────

const keyword  = (brief.keyword || '').toLowerCase();
const intent   = (brief.intent  || '').toLowerCase();
const difficulty = (brief.difficulty || '').toLowerCase();

// Check A: Local keyword signal
const LOCAL_CITIES = ['miami', 'fort lauderdale', 'west palm', 'south florida', 'hialeah', 'brickell', 'coral gables', 'aventura', 'doral', 'near me'];
const isLocalKeyword = intent === 'local' || LOCAL_CITIES.some(c => keyword.includes(c));

// Check B: Low difficulty + commercial intent
const isLowKD        = ['very_low', 'low'].includes(difficulty);
const isCommercial   = ['commercial', 'transactional'].includes(intent);
const isLowKDComm    = isLowKD && isCommercial;

// Check C: Explicit fast_track flag set by Normalizer
const isFlaggedFT    = brief.fast_track === true;

const isFastTrack = isLocalKeyword || isLowKDComm || isFlaggedFT;

// ─── Determine reason for logging and Telegram notification ──────────────────

let fastTrackReason = null;
if (isFastTrack) {
  const reasons = [];
  if (isLocalKeyword) reasons.push(`local keyword (${keyword})`);
  if (isLowKDComm)    reasons.push(`low-KD (${difficulty}) + commercial intent`);
  if (isFlaggedFT)    reasons.push('flagged by Normalizer');
  fastTrackReason = reasons.join(', ');
}

const route = isFastTrack ? 'fast_track' : 'manual_approval';

console.log(`FAST_TRACK_ROUTER: route=${route}, aeo_score=${aeo_score}, reasons=${fastTrackReason || 'standard'}`);

return [{
  json: {
    route,
    reason: isFastTrack
      ? `Auto-publish: ${fastTrackReason}`
      : `Manual approval required: ${aeo_score}/100 AEO score, ${warning_count} warnings`,
    fast_track_criteria: {
      is_local_keyword: isLocalKeyword,
      is_low_kd_commercial: isLowKDComm,
      is_flagged: isFlaggedFT
    },
    aeo_score,
    warning_count,
    article:  validated.article,
    warnings: validated.warnings,
    scores:   validated.scores
  }
}];
