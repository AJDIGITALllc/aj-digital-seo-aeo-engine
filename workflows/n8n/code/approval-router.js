/**
 * AJ Digital SEO/AEO Engine — Telegram Approval Router
 * n8n Code Node: Routes Telegram messages to approve/reject/revise actions
 *
 * Input: Telegram message from $input
 * Output: { action, doc_id, responded_by, timestamp }
 */

const msg = $input.first().json.message || $input.first().json.callback_query?.message || {};
const text = (msg.text || '').trim();
const from = msg.from?.username || msg.from?.first_name || 'unknown';

const COMMANDS = {
  approve: /^\/approve_(.+)$/i,
  reject:  /^\/reject_(.+)$/i,
  revise:  /^\/revise_(.+)$/i,
  status:  /^\/status$/i,
  help:    /^\/help$/i
};

// ─── Match command ────────────────────────────────────────────────────────────

let action = 'unknown';
let doc_id = null;

for (const [cmd, pattern] of Object.entries(COMMANDS)) {
  const match = text.match(pattern);
  if (match) {
    action = cmd;
    doc_id = match[1] || null;
    break;
  }
}

// ─── Validate doc_id format (basic sanity check) ──────────────────────────────

if (doc_id && !/^[a-zA-Z0-9_-]{10,}$/.test(doc_id)) {
  return [{
    json: {
      action: 'invalid',
      error: `Invalid doc_id format: ${doc_id}`,
      original_text: text
    }
  }];
}

// ─── Return routed action ─────────────────────────────────────────────────────

return [{
  json: {
    action,
    doc_id,
    responded_by: from,
    original_text: text,
    timestamp: new Date().toISOString(),
    // Used by downstream Sanity update node
    sanity_status_map: {
      approve: 'published',
      reject:  'archived',
      revise:  'needs_revision'
    }[action] || null
  }
}];
