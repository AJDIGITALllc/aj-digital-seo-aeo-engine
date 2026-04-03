/**
 * AJ Digital SEO/AEO Engine — Sanity Patch: Article Status
 * n8n Code Node: W-02 Approval Router (Telegram command handler)
 * Positioned: after Approval Router code node, before Sanity HTTP node
 *
 * Handles three Telegram command routes:
 *   /approve_{docId}   → article.status = 'approved' → 'published' + publishedAt
 *   /reject_{docId}    → article.status = 'archived'
 *   /revise_{docId}    → article.status = 'needs_revision' + brief back to 'queued'
 *
 * Also patches the linked contentBrief to keep status in sync.
 *
 * Input:  Approval Router output: { action, article_id, brief_id, reason }
 * Output: { mutations: [...] } body for Sanity HTTP Request node
 *
 * n8n HTTP Request node config:
 *   Method:  POST
 *   URL:     https://{{$env.SANITY_PROJECT_ID}}.api.sanity.io/v{{$env.SANITY_API_VERSION}}/data/mutate/{{$env.SANITY_DATASET}}
 *   Auth:    Bearer {{$env.SANITY_API_TOKEN}}
 *   Body:    JSON (field: sanity_mutation)
 */

// ─── Read approval router output ─────────────────────────────────────────────

const routerOutput = $input.first().json;
const action      = routerOutput.action;     // 'approve' | 'reject' | 'revise'
const articleId   = routerOutput.article_id;
const briefId     = routerOutput.brief_id || null;
const reason      = routerOutput.reason   || null;

if (!action || !articleId) {
  throw new Error('SANITY_PATCH_STATUS: Missing action or article_id in router output.');
}

const now = new Date().toISOString();

// ─── Determine status values per action ──────────────────────────────────────

const STATUS_MAP = {
  approve: {
    article: 'published',
    brief:   'published',
    extra:   { publishedAt: now, updatedAt: now }
  },
  reject: {
    article: 'archived',
    brief:   'archived',
    extra:   { updatedAt: now }
  },
  revise: {
    article: 'needs_revision',
    brief:   'queued',    // Re-queues the brief so W-01 picks it up again next cycle
    extra:   { updatedAt: now }
  }
};

const mapping = STATUS_MAP[action];
if (!mapping) {
  throw new Error(`SANITY_PATCH_STATUS: Unknown action "${action}". Must be approve|reject|revise.`);
}

console.log(`SANITY_PATCH_STATUS: action=${action}, articleId=${articleId}, articleStatus=${mapping.article}`);

// ─── Build mutations ─────────────────────────────────────────────────────────

const mutations = [];

// 1. Patch article status
mutations.push({
  patch: {
    id:  articleId,
    set: {
      status: mapping.article,
      ...mapping.extra
    }
  }
});

// 2. Patch contentBrief status (if brief ID is known)
if (briefId) {
  const briefPatch = {
    patch: {
      id:  briefId,
      set: { status: mapping.brief }
    }
  };
  // For approve: also set publishedAt on the brief
  if (action === 'approve') briefPatch.patch.set.publishedAt = now;
  // For revise: clear generatedAt so re-generation is tracked cleanly
  if (action === 'revise')  briefPatch.patch.set.generatedAt = null;
  mutations.push(briefPatch);
}

const mutationBody = { mutations };

// ─── Output ───────────────────────────────────────────────────────────────────

return [{
  json: {
    sanity_mutation:  mutationBody,
    article_id:       articleId,
    brief_id:         briefId,
    action,
    new_article_status: mapping.article,
    new_brief_status:   briefId ? mapping.brief : null,
    reason,
    patched_at: now,

    // For Telegram confirmation message
    telegram_confirmation:
      action === 'approve' ? `✅ Article published: ${articleId}` :
      action === 'reject'  ? `📦 Article archived: ${articleId}` :
                             `🔄 Article queued for revision: ${articleId}`
  }
}];
