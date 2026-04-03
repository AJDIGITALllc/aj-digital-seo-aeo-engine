---
name: seo-aeo-engine-workflow
description: End-to-end n8n workflow spec for AJ Digital SEO + AEO Engine. Runs Perplexity research, enriches with Search Console, structures outputs with OpenAI, routes approval through Telegram, and persists approved artifacts to Sanity with optional GitHub and Cloudflare steps.
version: 1.0.0
owner: AJ Digital
status: production-ready
workflow_mode:
  - scheduled
  - manual
dependencies:
  - PERPLEXITY_API_KEY
  - OPENAI_API_KEY
  - GOOGLE_CLIENT_ID
  - GOOGLE_CLIENT_SECRET
  - GOOGLE_REFRESH_TOKEN
  - GSC_SITE_URL
  - TELEGRAM_BOT_TOKEN
  - TELEGRAM_CHAT_ID
  - SANITY_PROJECT_ID
  - SANITY_DATASET
  - SANITY_API_TOKEN
optional_dependencies:
  - GITHUB_TOKEN
  - GITHUB_REPO
  - CLOUDFLARE_API_TOKEN
  - CLOUDFLARE_ACCOUNT_ID
  - CLOUDFLARE_ZONE_ID
---

# AJ Digital SEO + AEO Engine — n8n Workflow Spec

## 1. Purpose

This workflow runs a full SEO/AEO research cycle for a brand or client:

1. Trigger manually or on schedule
2. Load brand config
3. Call Perplexity for live web research
4. Normalize research output
5. Pull Google Search Console query/page performance
6. Merge and score opportunities
7. Call OpenAI to produce structured briefs
8. Send approval packet to Telegram
9. On approval, persist artifacts to Sanity
10. Optionally archive to GitHub and Cloudflare

Use **Schedule Trigger** for production runs and **Manual Trigger** for operator-driven runs. n8n's Schedule Trigger runs workflows at fixed intervals and requires the workflow to be saved and published; it also uses the instance timezone, which can be adjusted globally if needed.

---

## 2. Workflow topology

### Recommended production split

Use **two workflows**.

#### Workflow A — `AJD - SEO AEO Research Run`

Builds the research packet.

#### Workflow B — `AJD - SEO AEO Approval Handler`

Receives Telegram approval responses and executes approve/reject/revise actions.

This split keeps webhook-style Telegram handling isolated from long-running research tasks and makes debugging cleaner.

---

# WORKFLOW A — `AJD - SEO AEO Research Run`

## 3. Nodes overview

| #  | Node Name                        | Node Type        | Purpose                                 |
| -- | -------------------------------- | ---------------- | --------------------------------------- |
| 1  | Schedule Trigger                 | Schedule Trigger | Recurring production execution          |
| 2  | Manual Trigger                   | Manual Trigger   | Operator-run execution                  |
| 3  | Set Brand Config                 | Set              | Load brand/client parameters            |
| 4  | Perplexity - Research            | HTTP Request     | Live research and competitor analysis   |
| 5  | Normalize Research               | Code             | Parse and standardize Perplexity output |
| 6  | GSC - Search Analytics           | HTTP Request     | Pull query/page performance             |
| 7  | Merge - Research + GSC           | Merge            | Combine external datasets               |
| 8  | Score Opportunities              | Code             | Score and prioritize                    |
| 9  | OpenAI - Build Briefs            | HTTP Request     | Create structured deliverables          |
| 10 | Build Telegram Summary           | Code             | Create approval digest                  |
| 11 | Telegram - Send Approval Message | Telegram         | Send approval packet                    |
| 12 | Log Run Output                   | Code or Set      | Build archival payload                  |

---

## 4. Node specifications

## Node 1 — Schedule Trigger

### Type

`n8n-nodes-base.scheduleTrigger`

### Purpose

Run the workflow automatically.

### Config

* Trigger Rule: `cron`
* Cron Expression: `0 9 * * 2`
* Timezone: `America/New_York`

### Notes

* Use for weekly Tuesday 9:00 AM runs
* Workflow must be **saved and published** for this to execute automatically
* If scheduled times drift, verify the instance timezone

---

## Node 2 — Manual Trigger

### Type

`n8n-nodes-base.manualWorkflowTrigger`

### Purpose

Allow manual execution during testing, strategy sessions, or one-off runs.

### Config

No extra configuration required.

---

## Node 3 — Set Brand Config

### Type

`n8n-nodes-base.set`

### Purpose

Inject the brand/client payload used throughout the workflow.

### Recommended fields

```json
{
  "run_id": "={{$now.toISO()}}",
  "brand_name": "AJ Digital",
  "site_url": "https://weareajdigital.com",
  "niche": "podcast production, AI consulting, content systems",
  "geo_targets": ["United States"],
  "seed_topics": [
    "podcast marketing",
    "AI consulting",
    "authority building",
    "content systems",
    "business podcast strategy"
  ],
  "competitors": [],
  "goals": {
    "rank_on_google": true,
    "be_cited_by_ai": true,
    "capture_leads": true
  }
}
```

### Notes

For multi-client use later, replace this node with:

* Google Sheets loader
* Notion query
* webhook input
* repo JSON config file

---

## Node 4 — Perplexity - Research

### Type

`n8n-nodes-base.httpRequest`

### Purpose

Run live web-grounded research for:

* demand mining
* SERP patterns
* competitor themes
* topical clusters
* AI citation opportunities

### Authentication

Use HTTP Header Auth or generic header values:

* Header: `Authorization`
* Value: `Bearer {{$env.PERPLEXITY_API_KEY}}`

### Request config

* Method: `POST`
* URL: `https://api.perplexity.ai/chat/completions`
* Send Headers: `true`
* Send Body: `true`
* Content Type: `JSON`

### Sample request body

```json
{
  "model": "sonar-pro",
  "messages": [
    {
      "role": "system",
      "content": "You are an SEO + AEO research operator. Use live web research to identify ranking opportunities, competitor gaps, topical clusters, indexing/discovery risks, and AI citation opportunities. Return structured JSON only."
    },
    {
      "role": "user",
      "content": "Brand: {{$json.brand_name}}\nSite: {{$json.site_url}}\nNiche: {{$json.niche}}\nGeo Targets: {{$json.geo_targets}}\nSeed Topics: {{$json.seed_topics}}\nCompetitors: {{$json.competitors}}\nGoals: Rank on Google, be cited by AI, generate leads.\n\nReturn JSON with keys: topic_map, opportunities, competitor_findings, indexing_notes, source_notes."
    }
  ],
  "temperature": 0.2
}
```

### Node options

* Response Format: `JSON`
* Timeout: `120000`
* Settings → Retry on Fail: `true`
* Max Tries: `3`
* Wait Between Tries (ms): `2000`

### Optional rate-limit protection

Add HTTP Request **Batching** if later iterating over many topics or brands.

---

## Node 5 — Normalize Research

### Type

`n8n-nodes-base.code`

### Purpose

Parse the Perplexity response into a stable internal shape.

### Sample code

```javascript
const raw = items[0].json;
const content =
  raw.choices?.[0]?.message?.content ??
  raw.data?.content ??
  raw.content ??
  "";

let parsed;
try {
  parsed = typeof content === "string" ? JSON.parse(content) : content;
} catch (e) {
  parsed = {
    topic_map: [],
    opportunities: [],
    competitor_findings: [],
    indexing_notes: [],
    source_notes: [String(content)]
  };
}

return [
  {
    json: {
      run_id: $input.first().json.run_id || new Date().toISOString(),
      brand_name: $input.first().json.brand_name,
      site_url: $input.first().json.site_url,
      niche: $input.first().json.niche,
      geo_targets: $input.first().json.geo_targets,
      topic_map: parsed.topic_map || [],
      opportunities: parsed.opportunities || [],
      competitor_findings: parsed.competitor_findings || [],
      indexing_notes: parsed.indexing_notes || [],
      source_notes: parsed.source_notes || []
    }
  }
];
```

### Notes

Keep this node strict. Do not let malformed model output silently pass without a fallback shape.

---

## Node 6 — GSC - Search Analytics

### Type

`n8n-nodes-base.httpRequest`

### Purpose

Pull first-party search performance data to validate opportunities.

### Authentication

Use **Google OAuth2 generic credential** configured for Search Console access.

### Request config

* Method: `POST`
* URL: `={{"https://searchconsole.googleapis.com/webmasters/v3/sites/" + encodeURIComponent($json.site_url) + "/searchAnalytics/query"}}`
* Send Body: `true`
* Content Type: `JSON`

### Sample request body

```json
{
  "startDate": "={{$now.minus({days: 90}).toFormat('yyyy-MM-dd')}}",
  "endDate": "={{$now.minus({days: 1}).toFormat('yyyy-MM-dd')}}",
  "dimensions": ["page", "query"],
  "rowLimit": 250
}
```

### Response expectations

* `rows[].keys[0]` = page
* `rows[].keys[1]` = query
* `rows[].clicks`
* `rows[].impressions`
* `rows[].ctr`
* `rows[].position`

### Notes

This node gives you:

* high-impression / low-rank opportunities
* query/page mismatch
* existing winners worth expanding

---

## Node 7 — Merge - Research + GSC

### Type

`n8n-nodes-base.merge`

### Purpose

Combine model research with first-party GSC data.

### Recommended mode

* If one research packet + one GSC response: `Append`
* If you pre-split opportunities into items and map by query: `Combine by Matching Fields`

### Notes

For V1, simplest pattern:

1. keep Perplexity packet as one object
2. keep raw GSC rows array attached to same object
3. score in the next Code node

---

## Node 8 — Score Opportunities

### Type

`n8n-nodes-base.code`

### Purpose

Rank opportunities by strategic value.

### Sample code

```javascript
const input = items[0].json;

const opportunities = input.opportunities || [];
const gscRows = input.rows || input.gsc_rows || input.gsc?.rows || [];

function findGscMatch(primaryQuery) {
  return gscRows.find(r => (r.keys?.[1] || "").toLowerCase() === String(primaryQuery).toLowerCase());
}

const scored = opportunities.map(op => {
  const gsc = findGscMatch(op.primary_query || "");
  const impressions = gsc?.impressions || 0;
  const position = gsc?.position || 0;

  const business = op.business_relevance_score ?? 7;
  const intent = op.intent_clarity ?? 7;
  const weakness = op.serp_weakness ?? 6;
  const topical = op.topical_fit ?? 7;
  const links = op.internal_link_leverage ?? 6;
  const proof = op.proof_availability ?? 6;
  const citation = op.citation_likelihood_score ?? 6;
  const freshness = op.freshness_opportunity ?? 5;

  const normalizedImpressionBoost = Math.min(impressions / 1000, 5);
  const rankBoost = position > 5 && position < 30 ? 2 : 0;

  const score =
    business * 0.25 +
    intent * 0.15 +
    weakness * 0.15 +
    topical * 0.10 +
    links * 0.10 +
    proof * 0.10 +
    citation * 0.10 +
    freshness * 0.05 +
    normalizedImpressionBoost +
    rankBoost;

  return {
    ...op,
    gsc_impressions: impressions,
    gsc_position: position,
    priority_score: Number(score.toFixed(2))
  };
}).sort((a, b) => b.priority_score - a.priority_score);

return [
  {
    json: {
      ...input,
      scored_opportunities: scored
    }
  }
];
```

---

## Node 9 — OpenAI - Build Briefs

### Type

`n8n-nodes-base.httpRequest`

### Purpose

Transform merged research into production-ready deliverables:

* executive summary
* topic map
* page briefs
* AI citation briefs
* internal link plan
* indexing status summary

### Authentication

Header:

* `Authorization: Bearer {{$env.OPENAI_API_KEY}}`

### Request config

* Method: `POST`
* URL: `https://api.openai.com/v1/responses`
* Content Type: `JSON`

### Sample request body

```json
{
  "model": "gpt-4o",
  "input": [
    {
      "role": "system",
      "content": "You are a search strategist and content systems architect. Transform the provided SEO/AEO research into structured JSON only."
    },
    {
      "role": "user",
      "content": "Brand packet:\n{{ JSON.stringify($json, null, 2) }}\n\nReturn JSON with keys: executive_summary, topic_map, opportunities, page_briefs, ai_citation_briefs, internal_link_plan, indexing_status, gsc_opportunities."
    }
  ]
}
```

### Node options

* Timeout: `120000`
* Retry on Fail: `true`
* Max Tries: `3`
* Wait Between Tries (ms): `2000`

---

## Node 10 — Build Telegram Summary

### Type

`n8n-nodes-base.code`

### Purpose

Create a compact approval digest.

### Sample code

```javascript
const packet = items[0].json;
const top = (packet.page_briefs || packet.scored_opportunities || []).slice(0, 5);

const lines = [
  `SEO/AEO Run Complete — ${packet.brand_name}`,
  ``,
  `Run ID: ${packet.run_id}`,
  `Site: ${packet.site_url}`,
  ``,
  `Top Opportunities:`,
  ...top.map((x, i) => `${i + 1}. ${x.target_query || x.primary_query || x.title_direction || "Untitled"}`),
  ``,
  `Reply with one of:`,
  `APPROVE ${packet.run_id}`,
  `REJECT ${packet.run_id}`,
  `REVISE ${packet.run_id}: <notes>`
];

return [
  {
    json: {
      ...packet,
      telegram_text: lines.join("\n")
    }
  }
];
```

---

## Node 11 — Telegram - Send Approval Message

### Type

`n8n-nodes-base.telegram`

### Purpose

Send approval packet to operator.

### Credential

Telegram credential using API bot token.

### Config

* Resource: `Message`
* Operation: `Send Message`
* Chat ID: `{{$env.TELEGRAM_CHAT_ID}}`
* Text: `{{$json.telegram_text}}`
* Parse Mode: `Markdown` or `HTML`
* Disable WebPage Preview: `true`

---

## Node 12 — Log Run Output

### Type

`n8n-nodes-base.set` or `code`

### Purpose

Build a clean archival payload for downstream save nodes.

### Example output

```json
{
  "run_id": "{{$json.run_id}}",
  "brand_name": "{{$json.brand_name}}",
  "site_url": "{{$json.site_url}}",
  "created_at": "={{$now.toISO()}}",
  "payload": "={{JSON.stringify($json)}}",
  "status": "pending_approval"
}
```

---

# WORKFLOW B — `AJD - SEO AEO Approval Handler`

## 5. Nodes overview

| #  | Node Name                        | Node Type        | Purpose                     |
| -- | -------------------------------- | ---------------- | --------------------------- |
| 1  | Telegram Trigger                 | Telegram Trigger | Receive replies             |
| 2  | Parse Approval Command           | Code             | Extract action and run_id   |
| 3  | IF - Approval Branch             | IF               | Route approve/reject/revise |
| 4A | Sanity - Create Draft Record     | HTTP Request     | Save approved outputs       |
| 5A | GitHub - Commit Artifacts        | HTTP Request     | Optional archive            |
| 6A | Cloudflare - Store Artifact      | HTTP Request     | Optional storage            |
| 7A | Telegram - Approved Confirmation | Telegram         | Notify success              |
| 4B | Telegram - Rejected Confirmation | Telegram         | Confirm rejection           |
| 4C | OpenAI - Revise Package          | HTTP Request     | Generate revised package    |
| 5C | Telegram - Send Revised Packet   | Telegram         | Send revised packet         |

### Telegram Trigger note

Telegram only allows **one webhook per bot**, so switching between test and production can overwrite the registered webhook. Use separate bots for test vs. production environments.

---

## Node 1 — Telegram Trigger

### Type

`n8n-nodes-base.telegramTrigger`

### Purpose

Receive operator reply.

### Config

* Updates: `message`
* Credential: Telegram bot credential

### Notes

For production, keep one stable bot per workflow environment or separate bots for test vs production.

---

## Node 2 — Parse Approval Command

### Type

`n8n-nodes-base.code`

### Purpose

Extract:

* action
* run_id
* optional revision notes
* chat_id

### Sample code

```javascript
const msg = $json.message?.text || "";
const chatId = $json.message?.chat?.id;

const approve = msg.match(/^APPROVE\s+(.+)$/i);
const reject = msg.match(/^REJECT\s+(.+)$/i);
const revise = msg.match(/^REVISE\s+([^:]+):\s*(.+)$/i);

let action = "unknown";
let run_id = null;
let notes = "";

if (approve) {
  action = "approve";
  run_id = approve[1].trim();
} else if (reject) {
  action = "reject";
  run_id = reject[1].trim();
} else if (revise) {
  action = "revise";
  run_id = revise[1].trim();
  notes = revise[2].trim();
}

return [{ json: { action, run_id, notes, chat_id: chatId } }];
```

---

## Node 3 — IF - Approval Branch

### Type

`n8n-nodes-base.if`

### Purpose

Route into:

* approve
* reject
* revise

### Conditions

* Branch 1: `{{$json.action}} = approve`
* Branch 2: `{{$json.action}} = reject`
* Branch 3: `{{$json.action}} = revise`

---

## Node 4A — Sanity - Create Draft Record

### Type

`n8n-nodes-base.httpRequest`

### Purpose

Persist approved artifact to Sanity.

### Authentication

Header:

* `Authorization: Bearer {{$env.SANITY_API_TOKEN}}`

### Request config

* Method: `POST`
* URL: `={{"https://" + $env.SANITY_PROJECT_ID + ".api.sanity.io/v2023-10-01/data/mutate/" + $env.SANITY_DATASET}}`
* Content Type: `JSON`

### Sample request body

```json
{
  "mutations": [
    {
      "create": {
        "_type": "seoResearchRun",
        "runId": "{{$json.run_id}}",
        "status": "approved",
        "approvedAt": "={{$now.toISO()}}",
        "brandName": "AJ Digital",
        "siteUrl": "https://weareajdigital.com",
        "payload": "={{$json.payload || '{}'}}"
      }
    }
  ]
}
```

---

## Node 5A — GitHub - Commit Artifacts (optional)

### Type

`n8n-nodes-base.httpRequest`

### Purpose

Archive approved run artifacts in repo.

### Authentication

Header:

* `Authorization: Bearer {{$env.GITHUB_TOKEN}}`

### Request config

* Method: `PUT`
* URL: `={{"https://api.github.com/repos/" + $env.GITHUB_REPO + "/contents/runs/" + $json.run_id + "/run.json"}}`
* Content Type: `JSON`

### Sample request body

```json
{
  "message": "Archive approved SEO/AEO run {{$json.run_id}}",
  "content": "={{Buffer.from(JSON.stringify($json.payload || $json, null, 2)).toString('base64')}}"
}
```

---

## Node 6A — Cloudflare - Store Artifact (optional)

### Type

`n8n-nodes-base.httpRequest`

### Purpose

Store archival artifact for future dashboards or client portal use.

### Authentication

Header:

* `Authorization: Bearer {{$env.CLOUDFLARE_API_TOKEN}}`

### Note

Implementation depends on whether you store to:

* Workers KV
* R2
* D1-backed Worker
* custom Worker endpoint

### Recommended V1

Skip this node unless you already have a Cloudflare endpoint ready.

---

## Node 7A — Telegram - Approved Confirmation

### Type

`n8n-nodes-base.telegram`

### Config

* Resource: `Message`
* Operation: `Send Message`
* Chat ID: `{{$json.chat_id}}`
* Text:

```
Approved and saved.

Run ID: {{$json.run_id}}
Status: approved
Targets:
- Sanity
- GitHub (enabled/skipped)
- Cloudflare (enabled/skipped)
```

---

## Node 4B — Telegram - Rejected Confirmation

### Type

`n8n-nodes-base.telegram`

### Config

* Resource: `Message`
* Operation: `Send Message`
* Chat ID: `{{$json.chat_id}}`
* Text:

```
Run rejected.

Run ID: {{$json.run_id}}
No persistence actions were executed.
```

---

## Node 4C — OpenAI - Revise Package

### Type

`n8n-nodes-base.httpRequest`

### Purpose

Create a revised packet using operator notes.

### Sample request body

```json
{
  "model": "gpt-4o",
  "input": [
    {
      "role": "system",
      "content": "You are revising an SEO/AEO research packet based on operator notes. Return concise JSON only."
    },
    {
      "role": "user",
      "content": "Run ID: {{$json.run_id}}\nRevision Notes: {{$json.notes}}\nOriginal Payload: {{JSON.stringify($json.payload || {}, null, 2)}}"
    }
  ]
}
```

---

## Node 5C — Telegram - Send Revised Packet

### Type

`n8n-nodes-base.telegram`

### Config

* Resource: `Message`
* Operation: `Send Message`
* Chat ID: `{{$json.chat_id}}`
* Text:

```
Revised packet ready.

Run ID: {{$json.run_id}}
Notes applied: {{$json.notes}}

Reply:
APPROVE {{$json.run_id}}
REJECT {{$json.run_id}}
REVISE {{$json.run_id}}: <notes>
```

---

# 6. Credentials setup

## Required credentials

### A. Perplexity API

* n8n type: HTTP Header Auth
* Header Name: `Authorization`
* Header Value: `Bearer {{$env.PERPLEXITY_API_KEY}}`

### B. OpenAI API

* n8n type: HTTP Header Auth
* Header Name: `Authorization`
* Header Value: `Bearer {{$env.OPENAI_API_KEY}}`

### C. Google OAuth2

* n8n type: Google OAuth2 generic
* Use for Search Console requests

### D. Telegram

* n8n type: Telegram credential
* Auth method: bot access token

### E. Sanity

* n8n type: HTTP Header Auth
* Header Name: `Authorization`
* Header Value: `Bearer {{$env.SANITY_API_TOKEN}}`

### F. GitHub

* n8n type: HTTP Header Auth
* Header Name: `Authorization`
* Header Value: `Bearer {{$env.GITHUB_TOKEN}}`

### G. Cloudflare

* n8n type: HTTP Header Auth
* Header Name: `Authorization`
* Header Value: `Bearer {{$env.CLOUDFLARE_API_TOKEN}}`

---

# 7. Environment variables

```bash
PERPLEXITY_API_KEY=
OPENAI_API_KEY=

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REFRESH_TOKEN=
GSC_SITE_URL=

TELEGRAM_BOT_TOKEN=
TELEGRAM_CHAT_ID=

SANITY_PROJECT_ID=
SANITY_DATASET=production
SANITY_API_TOKEN=

GITHUB_TOKEN=
GITHUB_REPO=AJDIGITALllc/aj-digital-seo-aeo-engine

CLOUDFLARE_API_TOKEN=
CLOUDFLARE_ACCOUNT_ID=
CLOUDFLARE_ZONE_ID=
```

---

# 8. Error handling

## HTTP nodes

Enable:

* Retry on Fail: `true`
* Max Tries: `3`
* Wait Between Tries: `2000–5000ms`

## Rate limit mitigation

If iterating across many items:

* use HTTP Request batching
* limit concurrency by splitting workloads
* add wait nodes if required

---

# 9. Testing checklist

## Research workflow

* [ ] Manual Trigger executes end to end
* [ ] Perplexity response parses correctly
* [ ] GSC request authenticates successfully
* [ ] OpenAI returns valid JSON
* [ ] Telegram summary is readable

## Approval workflow

* [ ] Telegram Trigger receives messages in production
* [ ] APPROVE routes to Sanity
* [ ] REJECT stops persistence
* [ ] REVISE loops through revision path
* [ ] test/prod webhook conflicts are avoided

---

# 10. Recommended build order

## Phase 1

Implement:

* Manual Trigger
* Set Brand Config
* Perplexity
* Normalize Research
* GSC
* OpenAI
* Telegram summary

## Phase 2

Add:

* Telegram Trigger
* approval branching
* Sanity persistence

## Phase 3

Add:

* GitHub archive
* Cloudflare storage
* multi-client config source
* GA4 enrichment

---

# 11. File placement

```text
workflows/n8n/seo-aeo-engine-workflow.md     ← this file
workflows/n8n/seo-aeo-engine-workflow.json   ← importable n8n JSON (next artifact)
docs/credentials.md                          ← credential setup guide
examples/sample-input.json                   ← example brand config input
examples/sample-output.json                  ← example scored research output
```

---

# 12. Final implementation note

This spec is the **source of truth**. Build the n8n JSON only after this file is locked, because Markdown is easier to review, version, and refine than raw imported workflow JSON.
