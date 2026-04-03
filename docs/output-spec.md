# Output Specification — AJ Digital SEO/AEO Engine

**Version:** 2.0
**Last updated:** 2026-04-03
**Scope:** All data objects produced by W-01 through W-05

Every engine run produces a deterministic, schema-backed output set. This document defines each output type: what it contains, which workflow produces it, and which schema validates it.

---

## Output Inventory

| # | Output Name | Produced By | Schema | Stored In |
|---|-------------|-------------|--------|-----------|
| 1 | Opportunity Matrix | W-01 Normalizer | `schemas/opportunity-matrix.schema.json` | n8n → Sanity draft |
| 2 | Topic Map | W-01 Normalizer | `schemas/topic-map.schema.json` | n8n → Sanity draft |
| 3 | Article Brief | W-01 → W-02 | `schemas/page-brief.schema.json` | Sanity `contentBrief` |
| 4 | AEO Citation Brief | W-01 Normalizer | `schemas/ai-citation-brief.schema.json` | n8n in-memory |
| 5 | Internal Linking Map | W-02 Claude output | `schemas/internal-linking-map.schema.json` | Sanity `article` field |
| 6 | Publish Queue | W-01 → W-02 | `schemas/publish-queue.schema.json` | n8n in-memory |
| 7 | Schema Pack (JSON-LD) | W-02 post-processing | `schemas/schema-pack.schema.json` | Sanity `article` field |

---

## Output Definitions

---

### 1. Opportunity Matrix

**Schema:** `schemas/opportunity-matrix.schema.json`
**Produced by:** W-01 Normalizer code node
**Format:** Array of opportunity objects, one per scored keyword

Each item in the matrix represents a single keyword opportunity that scored `critical` or `high` after the weighted scoring formula.

**Key fields:**

| Field | Type | Description |
|-------|------|-------------|
| `keyword` | string | The target keyword |
| `intent` | enum | `commercial` \| `transactional` \| `local` \| `informational` |
| `difficulty` | enum | `very_low` \| `low` \| `medium` \| `high` |
| `volume_estimate` | integer | Estimated monthly search volume |
| `score` | float | Weighted score 0–10 |
| `priority` | enum | `critical` \| `high` \| `medium` \| `low` |
| `fast_track` | boolean | Eligible for auto-publish bypass |
| `recommended_action` | enum | `create` \| `optimize` |
| `scoring_components` | object | Per-dimension scores for audit trail |
| `aeo_question` | string\|null | Matched AI question from citation scan |
| `gsc_status` | string | Current GSC position status |

**Scoring formula:**
```
score = (volume_score × 0.30)
      + (difficulty_inv × 0.30)
      + (intent_score × 0.20)
      + (local_boost × 0.10)
      + (aeo_citation × 0.10)
```
All components normalized to 0–10. Final score is 0–10.

---

### 2. Topic Map

**Schema:** `schemas/topic-map.schema.json`
**Produced by:** W-01 Normalizer code node
**Format:** Single object grouping opportunities into content clusters

The topic map organizes the opportunity matrix into editorial clusters — pillar pages, supporting articles, and local landing page targets — for 4-week content planning.

**Key fields:**

| Field | Type | Description |
|-------|------|-------------|
| `generated_at` | ISO8601 | Timestamp |
| `site_url` | string | Client site URL (from env) |
| `clusters` | array | Grouped content clusters |
| `clusters[].cluster_name` | string | Topic cluster label |
| `clusters[].pillar_keyword` | string | Primary keyword for the cluster pillar page |
| `clusters[].supporting_keywords` | array | Supporting article targets |
| `clusters[].total_score` | float | Aggregate score for cluster prioritization |

---

### 3. Article Brief

**Schema:** `schemas/page-brief.schema.json`
**Produced by:** W-01 Normalizer → W-02 webhook trigger
**Format:** Single object per article, stored as Sanity `contentBrief` document

The brief is the single source of truth for a Claude article generation request. It packages the keyword, intent, AEO questions, competitor context, and PAA data into a structured prompt payload.

**Key fields:**

| Field | Type | Description |
|-------|------|-------------|
| `keyword` | string | Primary target keyword |
| `intent` | string | Search intent |
| `aeo_question` | string | Primary AEO question to answer |
| `paa_questions` | array | People Also Ask questions from SERP scan |
| `competitor_gaps` | array | Content gaps identified vs. top-ranking competitors |
| `word_count_target` | integer | Target word count (default: 1200–1800) |
| `fast_track` | boolean | Whether this brief is eligible for auto-publish |
| `priority` | string | From opportunity matrix |
| `serp_research_json` | object | Full Perplexity research payload |

---

### 4. AEO Citation Brief

**Schema:** `schemas/ai-citation-brief.schema.json`
**Produced by:** W-01 Normalizer (from Perplexity AI questions output)
**Format:** Array of citation opportunity objects

Tracks which AI questions have citation gaps that the engine should target. Used to prioritize answer-first content blocks and FAQ sections.

**Key fields:**

| Field | Type | Description |
|-------|------|-------------|
| `question` | string | The AI engine query |
| `citation_opportunity` | enum | `high` \| `medium` \| `low` |
| `aj_digital_cited` | boolean | Whether client is currently cited for this question |
| `competing_sources` | array | URLs currently cited for this question |
| `answer_gap` | string | What the current answers are missing |

---

### 5. Internal Linking Map

**Schema:** `schemas/internal-linking-map.schema.json`
**Produced by:** W-02 Claude article output field `internal_link_map`
**Format:** Array of link placement objects, stored in Sanity `article.internal_link_map`

Each article must contain exactly 4 internal link placeholders (`[LINK: ...]`). The internal linking map resolves those placeholders to actual site URLs and anchor text.

**Key fields:**

| Field | Type | Description |
|-------|------|-------------|
| `article_slug` | string | The slug of the article being linked from |
| `links` | array | All internal link entries |
| `links[].placeholder` | string | Original `[LINK:...]` text in article |
| `links[].suggested_url` | string | Best-guess URL from site architecture |
| `links[].anchor_text` | string | Exact anchor text to use |
| `links[].resolved` | boolean | `true` once a human has verified the URL |
| `links[].resolved_url` | string\|null | Final verified URL (set by editor) |

---

### 6. Publish Queue

**Schema:** `schemas/publish-queue.schema.json`
**Produced by:** W-01 Intelligence Scan (end of run)
**Format:** Single object representing the current week's article schedule

The publish queue is the operational output of W-01. It tells W-02 what to build and in what order this week.

**Key fields:**

| Field | Type | Description |
|-------|------|-------------|
| `generated_at` | ISO8601 | When the queue was built |
| `week_of` | string | ISO week (e.g. `2026-W14`) |
| `items` | array | Ordered list of articles to generate |
| `items[].keyword` | string | Primary keyword |
| `items[].priority` | string | From opportunity matrix |
| `items[].fast_track` | boolean | Auto-publish eligible |
| `items[].status` | enum | `queued` \| `generating` \| `pending_approval` \| `published` \| `killed` |
| `items[].brief_id` | string\|null | Sanity contentBrief document ID once created |

---

### 7. Schema Pack (JSON-LD)

**Schema:** `schemas/schema-pack.schema.json`
**Produced by:** W-02 post-processing node
**Format:** Object containing all JSON-LD blocks for a published article

Every article gets a schema pack. The pack is injected into the Sanity `article` document and rendered in the `<head>` of the published page.

**Key fields:**

| Field | Type | Description |
|-------|------|-------------|
| `article_slug` | string | The article this pack belongs to |
| `schema_types` | array | List of schema.org types included |
| `article_schema` | object | `Article` or `BlogPosting` JSON-LD |
| `faq_schema` | object | `FAQPage` JSON-LD — built from `faq_pairs` |
| `breadcrumb_schema` | object | `BreadcrumbList` JSON-LD |
| `author_schema` | object | `Person` JSON-LD for the author |
| `organization_schema` | object | `Organization` or `LocalBusiness` JSON-LD |

---

## Schema Validation

All outputs can be validated against their JSON Schema at any time:

```bash
# Example: validate an opportunity matrix output
npx ajv validate -s schemas/opportunity-matrix.schema.json -d examples/opportunity-matrix.example.json

# Validate all schemas are structurally sound
npx ajv compile schemas/*.schema.json
```

Schemas use draft-07. No external `$ref` dependencies.

---

## Output Lifecycle

```
W-01 runs
  └─► Opportunity Matrix (in-memory, n8n)
  └─► Topic Map (in-memory, n8n)
  └─► Publish Queue (in-memory → triggers W-02 per item)
  └─► AEO Citation Briefs (in-memory)

W-02 runs (once per queue item)
  └─► Article Brief → Sanity contentBrief (status: queued)
  └─► Claude generates article
  └─► AEO Validator runs
      ├─ PASS → Fast Track Router
      │   ├─ fast_track → Internal Linking Map + Schema Pack → Sanity publish
      │   └─ manual_approval → Telegram → human review → Sanity publish
      └─ KILL → Telegram alert → workflow stops

W-03 runs (on Sanity publish event)
  └─► Distribution Pack (social posts, email digest, GBP post)

W-04 runs (weekly)
  └─► GSC comparison → Feedback analysis → Rewrite queue → Sanity flags

W-05 runs (monthly)
  └─► Content mutation → Sanity updates → re-validation
```
