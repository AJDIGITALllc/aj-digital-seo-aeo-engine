# n8n Workflow Spec — AJ Digital SEO/AEO Authority Engine
## Dynamic Intelligence → Execution Loop (Production Build)

**Version:** 2.0
**Last updated:** 2026-04-03
**Owner:** AJ Digital LLC — Audio Jones
**Domain:** weareajdigital.com
**Status:** Production-ready

---

## System Overview

This is the closed-loop content intelligence system for AJ Digital. Every stage feeds the next. Every output is structured. Every article published increases the system's authority and citation surface.

```
┌─────────────────────────────────────────────────────────────┐
│              AJ DIGITAL AUTHORITY ENGINE LOOP               │
│                                                             │
│  [1] Perplexity        →  Raw intelligence                  │
│  [2] Normalizer        →  Structured brief                  │
│  [3] Claude            →  Draft content                     │
│  [4] AEO Validator     →  Quality gate                      │
│  [5] Sanity CMS        →  Telegram approval → Publish       │
│  [6] Distribution      →  Social + email + GBP              │
│  [7] Feedback          →  GSC + GA4 + citation checks       │
│  [8] Re-injection      →  Perplexity re-query               │
│         │                                                   │
│         └──────────────────────────────────────────►        │
└─────────────────────────────────────────────────────────────┘
```

---

## Workflow Inventory

| ID | Workflow Name | Trigger | Cadence |
|----|--------------|---------|---------|
| W-01 | Intelligence Scan | Schedule (Monday 07:00 UTC) | Weekly |
| W-02 | Article Generator | Webhook (from W-01 or manual) | On-demand |
| W-03 | Distribution Engine | Webhook (Sanity publish event) | On publish |
| W-04 | Feedback Collector | Schedule (Sunday 08:00 UTC) | Weekly |
| W-05 | Content Mutation | Schedule (1st of month, 09:00 UTC) | Monthly |

Import all from: `workflows/n8n/seo-aeo-engine-workflow.json`

---

## W-01: INTELLIGENCE SCAN

**Trigger:** Every Monday at 07:00 UTC
**Purpose:** Detect new keyword opportunities, trending questions, competitor moves, AI citation gaps
**Runtime:** ~3–5 minutes

### Node Map

```
[Schedule Trigger]
    → [Fetch GSC Performance]
    → [Perplexity: Opportunity Scan]
    → [Normalizer: Build Opportunity Matrix]
    → [Filter: Priority ≥ High]
    → [Write to Sanity: Queue Drafts]
    → [Telegram: Weekly Intel Report]
```

---

### NODE 1 — Schedule Trigger

```json
{
  "type": "n8n-nodes-base.scheduleTrigger",
  "name": "Monday Intel Trigger",
  "parameters": {
    "rule": {
      "interval": [
        {
          "field": "cronExpression",
          "expression": "0 7 * * 1"
        }
      ]
    }
  }
}
```

---

### NODE 2 — Fetch GSC Performance (Last 28 Days)

```json
{
  "type": "n8n-nodes-base.httpRequest",
  "name": "GSC: Top Queries",
  "parameters": {
    "method": "POST",
    "url": "https://searchconsole.googleapis.com/webmasters/v3/sites/{{ $env.GSC_SITE_URL }}/searchAnalytics/query",
    "authentication": "oAuth2",
    "oAuth2": "Google Search Console OAuth2",
    "body": {
      "startDate": "={{ $now.minus({days: 28}).format('yyyy-MM-dd') }}",
      "endDate": "={{ $now.format('yyyy-MM-dd') }}",
      "dimensions": ["query", "page"],
      "rowLimit": 50,
      "dataState": "final"
    }
  }
}
```

**Output used in:** Normalizer (feeds current ranking data to score gaps)

---

### NODE 3 — Perplexity: Opportunity Scan

```json
{
  "type": "n8n-nodes-base.httpRequest",
  "name": "Perplexity: Opportunity Scan",
  "parameters": {
    "method": "POST",
    "url": "https://api.perplexity.ai/chat/completions",
    "headers": {
      "Authorization": "Bearer {{ $env.PERPLEXITY_API_KEY }}",
      "Content-Type": "application/json"
    },
    "body": {
      "model": "llama-3.1-sonar-large-128k-online",
      "messages": [
        {
          "role": "system",
          "content": "You are an expert SEO and AEO strategist. Return only valid JSON. No markdown. No commentary outside JSON."
        },
        {
          "role": "user",
          "content": "Perform a live SEO + AEO opportunity scan for a South Florida podcast production and AI consulting agency (weareajdigital.com) that serves entrepreneurs, coaches, and churches.\n\nFocus on these topic clusters:\n1. Podcast production services (Miami, South Florida, remote)\n2. AI consulting for entrepreneurs and coaches\n3. Content automation and repurposing systems\n4. Personal brand authority building with podcasts\n\nReturn this exact JSON structure:\n{\n  \"scan_date\": \"YYYY-MM-DD\",\n  \"trending_queries\": [\n    {\"query\": string, \"trend\": \"rising|new|seasonal\", \"source\": string}\n  ],\n  \"low_competition_keywords\": [\n    {\"keyword\": string, \"volume_estimate\": string, \"difficulty\": \"very_low|low|medium\", \"intent\": \"informational|commercial|local\"}\n  ],\n  \"ai_questions\": [\n    {\"question\": string, \"answer_gap\": boolean, \"citation_opportunity\": \"high|medium|low\"}\n  ],\n  \"local_opportunities\": [\n    {\"keyword\": string, \"city\": string, \"competition\": \"minimal|low|medium\"}\n  ],\n  \"content_recommendations\": [\n    {\"action\": \"create|update|consolidate\", \"topic\": string, \"rationale\": string, \"priority\": \"critical|high|medium\"}\n  ]\n}"
        }
      ],
      "max_tokens": 2000,
      "temperature": 0.1
    }
  }
}
```

---

### NODE 4 — Normalizer: Build Opportunity Matrix

**Type:** `n8n-nodes-base.code`
**Language:** JavaScript

```javascript
// Full code: workflows/n8n/code/normalizer.js
const perplexityRaw = JSON.parse($input.first().json.choices[0].message.content);
const gscData = $('GSC: Top Queries').first().json.rows || [];

// Build ranked keyword set from GSC
const gscKeywords = new Set(gscData.map(r => r.keys[0]?.toLowerCase()));

// Score and structure opportunities
const opportunities = [];

// Process low-competition keywords
for (const kw of perplexityRaw.low_competition_keywords || []) {
  const alreadyRanking = gscKeywords.has(kw.keyword.toLowerCase());
  const difficultyScore = { very_low: 9, low: 7, medium: 5 }[kw.difficulty] ?? 5;
  const intentBoost = kw.intent === 'commercial' ? 1.5 : kw.intent === 'local' ? 1.3 : 1.0;
  const seoScore = Math.min(10, difficultyScore * intentBoost).toFixed(1);

  opportunities.push({
    keyword: kw.keyword,
    intent: kw.intent,
    seo_score: parseFloat(seoScore),
    aeo_score: 5.0, // Default; elevated by AI questions match below
    priority: parseFloat(seoScore) >= 8 ? 'critical' : parseFloat(seoScore) >= 6 ? 'high' : 'medium',
    already_ranking: alreadyRanking,
    recommended_action: alreadyRanking ? 'optimize' : 'create',
    source: 'perplexity_opportunity_scan'
  });
}

// Elevate AEO score for keywords matching AI questions
for (const q of perplexityRaw.ai_questions || []) {
  if (q.citation_opportunity === 'high') {
    const match = opportunities.find(o =>
      q.question.toLowerCase().includes(o.keyword.toLowerCase())
    );
    if (match) {
      match.aeo_score = 9.0;
      match.priority = 'critical';
      match.aeo_question = q.question;
    }
  }
}

// Sort by combined score
opportunities.sort((a, b) => (b.seo_score + b.aeo_score) - (a.seo_score + a.aeo_score));

return [{
  json: {
    generated_at: new Date().toISOString(),
    site_url: 'https://weareajdigital.com',
    opportunities,
    trending_queries: perplexityRaw.trending_queries || [],
    local_opportunities: perplexityRaw.local_opportunities || [],
    content_recommendations: perplexityRaw.content_recommendations || [],
    raw_ai_questions: perplexityRaw.ai_questions || []
  }
}];
```

---

### NODE 5 — Filter: Priority ≥ High

```json
{
  "type": "n8n-nodes-base.filter",
  "name": "Filter: High+ Priority Only",
  "parameters": {
    "conditions": {
      "options": { "combinator": "or" },
      "conditions": [
        {
          "leftValue": "={{ $json.priority }}",
          "operator": { "type": "string", "operation": "equals" },
          "rightValue": "critical"
        },
        {
          "leftValue": "={{ $json.priority }}",
          "operator": { "type": "string", "operation": "equals" },
          "rightValue": "high"
        }
      ]
    }
  }
}
```

---

### NODE 6 — Write to Sanity: Queue Drafts

```json
{
  "type": "n8n-nodes-base.httpRequest",
  "name": "Sanity: Queue Draft Briefs",
  "parameters": {
    "method": "POST",
    "url": "https://{{ $env.SANITY_PROJECT_ID }}.api.sanity.io/v2021-06-07/data/mutate/{{ $env.SANITY_DATASET }}",
    "headers": {
      "Authorization": "Bearer {{ $env.SANITY_API_TOKEN }}",
      "Content-Type": "application/json"
    },
    "body": {
      "mutations": [
        {
          "create": {
            "_type": "contentBrief",
            "keyword": "={{ $json.keyword }}",
            "intent": "={{ $json.intent }}",
            "seo_score": "={{ $json.seo_score }}",
            "aeo_score": "={{ $json.aeo_score }}",
            "priority": "={{ $json.priority }}",
            "status": "queued",
            "aeo_question": "={{ $json.aeo_question || '' }}",
            "created_at": "={{ $now.toISOString() }}"
          }
        }
      ]
    }
  }
}
```

---

### NODE 7 — Telegram: Weekly Intel Report

```json
{
  "type": "n8n-nodes-base.telegram",
  "name": "Telegram: Intel Report",
  "parameters": {
    "chatId": "={{ $env.TELEGRAM_CHAT_ID }}",
    "text": "🧠 *AJ Digital — Weekly Intel Report*\n📅 {{ $now.format('MMMM d, yyyy') }}\n\n📊 *Opportunities Found:* {{ $('Normalizer').all().length }}\n🔴 Critical: {{ $('Normalizer').all().filter(i => i.json.priority === 'critical').length }}\n🟠 High: {{ $('Normalizer').all().filter(i => i.json.priority === 'high').length }}\n\n🏆 *Top 3 Keywords:*\n1. {{ $('Normalizer').all()[0]?.json.keyword }}\n2. {{ $('Normalizer').all()[1]?.json.keyword }}\n3. {{ $('Normalizer').all()[2]?.json.keyword }}\n\n📥 Queued in Sanity for article generation.\nReply /generate to trigger content now.",
    "parseMode": "Markdown"
  }
}
```

---

## W-02: ARTICLE GENERATOR

**Trigger:** Webhook (called by W-01 or manually from Telegram)
**Purpose:** Generate a fully AEO-optimized article for a queued brief
**Runtime:** ~90–120 seconds per article

### Node Map

```
[Webhook Trigger]
    → [Fetch Brief from Sanity]
    → [Perplexity: Deep SERP Research]
    → [Claude: Generate Full Article]
    → [AEO Validator]
        → [Pass] → [Sanity: Save Draft] → [Telegram: Approval Request]
        → [Fail] → [Claude: Revise Draft] → [Sanity: Save Draft] → [Telegram: Flag for Review]
    → [Telegram Approval]
        → [Approve] → [Sanity: Publish]
        → [Reject] → [Sanity: Archive]
```

---

### NODE 1 — Webhook Trigger

```json
{
  "type": "n8n-nodes-base.webhook",
  "name": "Article Generator: Webhook",
  "parameters": {
    "path": "generate-article",
    "httpMethod": "POST",
    "responseMode": "responseNode"
  }
}
```

**Expected payload:**
```json
{
  "brief_id": "sanity-document-id",
  "keyword": "optional-override",
  "priority_override": "critical"
}
```

---

### NODE 2 — Fetch Brief from Sanity

```json
{
  "type": "n8n-nodes-base.httpRequest",
  "name": "Sanity: Fetch Brief",
  "parameters": {
    "method": "GET",
    "url": "https://{{ $env.SANITY_PROJECT_ID }}.api.sanity.io/v2021-06-07/data/query/{{ $env.SANITY_DATASET }}",
    "headers": {
      "Authorization": "Bearer {{ $env.SANITY_API_TOKEN }}"
    },
    "queryParameters": {
      "query": "*[_type == 'contentBrief' && _id == '{{ $json.brief_id }}'][0]"
    }
  }
}
```

---

### NODE 3 — Perplexity: Deep SERP Research

```json
{
  "type": "n8n-nodes-base.httpRequest",
  "name": "Perplexity: Deep SERP",
  "parameters": {
    "method": "POST",
    "url": "https://api.perplexity.ai/chat/completions",
    "headers": {
      "Authorization": "Bearer {{ $env.PERPLEXITY_API_KEY }}",
      "Content-Type": "application/json"
    },
    "body": {
      "model": "llama-3.1-sonar-large-128k-online",
      "messages": [
        {
          "role": "system",
          "content": "You are a senior SEO researcher. Return only valid JSON. No markdown wrappers."
        },
        {
          "role": "user",
          "content": "Perform deep SERP research for the keyword: \"{{ $('Sanity: Fetch Brief').first().json.result.keyword }}\"\n\nReturn this JSON:\n{\n  \"serp_overview\": {\n    \"top_5_urls\": [string],\n    \"dominant_format\": string,\n    \"featured_snippet_present\": boolean,\n    \"avg_word_count\": number\n  },\n  \"paa_questions\": [string],\n  \"competitor_gaps\": [string],\n  \"aeo_answer\": {\n    \"question\": string,\n    \"direct_answer\": string,\n    \"answer_word_count\": number\n  },\n  \"recommended_h2s\": [string],\n  \"key_stats_to_include\": [\n    {\"stat\": string, \"source_url\": string}\n  ]\n}"
        }
      ],
      "max_tokens": 1500,
      "temperature": 0.1
    }
  }
}
```

---

### NODE 4 — Claude: Generate Full Article

```json
{
  "type": "n8n-nodes-base.httpRequest",
  "name": "Claude: Generate Article",
  "parameters": {
    "method": "POST",
    "url": "https://api.anthropic.com/v1/messages",
    "headers": {
      "x-api-key": "{{ $env.ANTHROPIC_API_KEY }}",
      "anthropic-version": "2023-06-01",
      "Content-Type": "application/json"
    },
    "body": {
      "model": "claude-opus-4-5",
      "max_tokens": 4096,
      "system": "You are a senior SEO and AEO content strategist for AJ Digital (weareajdigital.com), a South Florida podcast production and AI consulting agency. You write conversion-optimized, AI-citation-ready content following strict AEO rules. Author: Audio Jones, Podcast Producer & AI Consultant.",
      "messages": [
        {
          "role": "user",
          "content": "Write a complete, publish-ready article using the brief and research below.\n\n## BRIEF\nKeyword: {{ $('Sanity: Fetch Brief').first().json.result.keyword }}\nIntent: {{ $('Sanity: Fetch Brief').first().json.result.intent }}\nAEO Question: {{ $('Sanity: Fetch Brief').first().json.result.aeo_question }}\n\n## SERP RESEARCH\n{{ JSON.stringify($('Perplexity: Deep SERP').first().json.choices[0].message.content) }}\n\n## AEO WRITING RULES (STRICT — FOLLOW EXACTLY)\n\n1. ANSWER-FIRST: Every H2 section opens with a 40–75 word direct answer. If an AI quoted only that block, it would fully answer the question.\n2. QUESTION H2s: Every H2 must be a question the user would type into an AI (e.g. 'What is podcast production?').\n3. PARAGRAPH DISCIPLINE: Max 3 sentences per paragraph. Max 45 words. One idea per paragraph.\n4. DEFINITION BLOCKS: Define every key term as: '[Term] is [definition]. [How it works]. [Why it matters for the reader].'\n5. NAMED FRAMEWORKS: Package every process as a named framework (e.g. 'The AJ Digital 5-Step Podcast Launch System').\n6. COMPARISON TABLES: Use tables for any 2+ option comparison. Columns: Name | What it does | Price | Best For.\n7. FAQ SECTION: 6–8 H3 questions, each with 40–75 word direct answers. These map to FAQPage JSON-LD.\n8. INTERNAL LINKS: Include 4 internal link placeholders:\n   - [LINK: /services/[relevant-pillar]/ | anchor: [service keyword]]\n   - [LINK: /blog/[related-article]/ | anchor: [descriptive phrase]]\n   - [LINK: /resources/[resource]/ | anchor: [resource name]]\n   - [LINK: /work-with-us/ | anchor: first-person CTA]\n9. AUTHOR BLOCK: Include at top: 'By Audio Jones | Podcast Producer & AI Consultant, AJ Digital | Published: [DATE] | [X] min read'\n10. CTA: Include 1 inline CTA before the FAQ: 'Ready to [action]? [Book My Free Strategy Session →](https://weareajdigital.com/work-with-us/)'\n\n## OUTPUT FORMAT\nReturn a JSON object:\n{\n  \"meta_title\": string (max 60 chars, keyword first),\n  \"meta_description\": string (150–155 chars, starts with keyword),\n  \"h1\": string (includes primary keyword, max 70 chars),\n  \"word_count_estimate\": number,\n  \"article_html\": string (full HTML body, no <html>/<head>/<body> tags),\n  \"faq_pairs\": [{\"question\": string, \"answer\": string}],\n  \"schema_types\": [string],\n  \"internal_link_map\": [{\"placeholder\": string, \"suggested_url\": string}]\n}"
        }
      ]
    }
  }
}
```

---

### NODE 5 — AEO Validator

**Type:** `n8n-nodes-base.code`
**Language:** JavaScript

Full code: `workflows/n8n/code/aeo-validator.js`

```javascript
const article = JSON.parse(
  $('Claude: Generate Article').first().json.content[0].text
);

const html = article.article_html || '';
const issues = [];
const warnings = [];

// 1. Meta title length
if (article.meta_title?.length > 60) {
  issues.push(`META_TITLE_TOO_LONG: ${article.meta_title.length} chars (max 60)`);
}

// 2. Meta description length
const descLen = article.meta_description?.length || 0;
if (descLen < 140 || descLen > 160) {
  warnings.push(`META_DESC_LENGTH: ${descLen} chars (target 140–155)`);
}

// 3. H2 count (minimum 4)
const h2Matches = html.match(/<h2[^>]*>/gi) || [];
if (h2Matches.length < 4) {
  issues.push(`TOO_FEW_H2S: Found ${h2Matches.length} (minimum 4)`);
}

// 4. FAQ section presence
if (!html.toLowerCase().includes('frequently asked') && !html.toLowerCase().includes('faq')) {
  issues.push('MISSING_FAQ_SECTION');
}

// 5. FAQ pairs count
if (!article.faq_pairs || article.faq_pairs.length < 6) {
  issues.push(`TOO_FEW_FAQ_PAIRS: Found ${article.faq_pairs?.length || 0} (minimum 6)`);
}

// 6. Internal link placeholders
const linkPlaceholders = (html.match(/\[LINK:/g) || []).length;
if (linkPlaceholders < 3) {
  warnings.push(`FEW_INTERNAL_LINKS: Found ${linkPlaceholders} (target 4)`);
}

// 7. Word count estimate
if (article.word_count_estimate < 800) {
  issues.push(`WORD_COUNT_LOW: ${article.word_count_estimate} (minimum 800)`);
}

// 8. Author block
if (!html.includes('Audio Jones')) {
  issues.push('MISSING_AUTHOR_BLOCK');
}

// 9. CTA presence
if (!html.toLowerCase().includes('work-with-us') && !html.toLowerCase().includes('book')) {
  warnings.push('MISSING_CTA_LINK');
}

// 10. Schema types
if (!article.schema_types || article.schema_types.length === 0) {
  issues.push('MISSING_SCHEMA_TYPES');
}

const passed = issues.length === 0;

return [{
  json: {
    passed,
    issue_count: issues.length,
    warning_count: warnings.length,
    issues,
    warnings,
    article,
    validation_timestamp: new Date().toISOString()
  }
}];
```

---

### NODE 6a — Pass Branch: Save Draft to Sanity

```json
{
  "type": "n8n-nodes-base.httpRequest",
  "name": "Sanity: Save Validated Draft",
  "parameters": {
    "method": "POST",
    "url": "https://{{ $env.SANITY_PROJECT_ID }}.api.sanity.io/v2021-06-07/data/mutate/{{ $env.SANITY_DATASET }}",
    "headers": {
      "Authorization": "Bearer {{ $env.SANITY_API_TOKEN }}",
      "Content-Type": "application/json"
    },
    "body": {
      "mutations": [
        {
          "create": {
            "_type": "article",
            "title": "={{ $json.article.h1 }}",
            "metaTitle": "={{ $json.article.meta_title }}",
            "metaDescription": "={{ $json.article.meta_description }}",
            "body": "={{ $json.article.article_html }}",
            "faqPairs": "={{ $json.article.faq_pairs }}",
            "schemaTypes": "={{ $json.article.schema_types }}",
            "wordCount": "={{ $json.article.word_count_estimate }}",
            "validationPassed": true,
            "warnings": "={{ $json.warnings }}",
            "status": "pending_approval",
            "generatedAt": "={{ $now.toISOString() }}"
          }
        }
      ]
    }
  }
}
```

---

### NODE 6b — Fail Branch: Claude Revision Pass

```json
{
  "type": "n8n-nodes-base.httpRequest",
  "name": "Claude: Revise Draft",
  "parameters": {
    "method": "POST",
    "url": "https://api.anthropic.com/v1/messages",
    "headers": {
      "x-api-key": "{{ $env.ANTHROPIC_API_KEY }}",
      "anthropic-version": "2023-06-01",
      "Content-Type": "application/json"
    },
    "body": {
      "model": "claude-opus-4-5",
      "max_tokens": 4096,
      "messages": [
        {
          "role": "user",
          "content": "The following article failed AEO validation. Fix ONLY the listed issues and return the same JSON structure.\n\nISSUES TO FIX:\n{{ $json.issues.join('\\n') }}\n\nORIGINAL ARTICLE JSON:\n{{ JSON.stringify($json.article) }}"
        }
      ]
    }
  }
}
```

---

### NODE 7 — Telegram: Approval Request

```json
{
  "type": "n8n-nodes-base.telegram",
  "name": "Telegram: Approval Request",
  "parameters": {
    "chatId": "={{ $env.TELEGRAM_CHAT_ID }}",
    "text": "✍️ *New Article Ready for Approval*\n\n📰 *Title:* {{ $json.article.h1 }}\n🔑 *Meta Title:* {{ $json.article.meta_title }}\n📊 *Word Count:* {{ $json.article.word_count_estimate }}\n✅ *Validation:* {{ $json.passed ? 'PASSED' : 'PASSED WITH WARNINGS' }}\n⚠️ *Warnings:* {{ $json.warning_count }}\n\n🔗 *Review in Sanity:* https://{{ $env.SANITY_PROJECT_ID }}.sanity.studio\n\nReply:\n✅ /approve_{{ $json.sanity_doc_id }} — Publish now\n❌ /reject_{{ $json.sanity_doc_id }} — Archive draft\n🔄 /revise_{{ $json.sanity_doc_id }} — Request revision",
    "parseMode": "Markdown"
  }
}
```

---

### NODE 8 — Telegram: Approval Webhook Listener

```json
{
  "type": "n8n-nodes-base.telegramTrigger",
  "name": "Telegram: Approval Listener",
  "parameters": {
    "updates": ["message"]
  }
}
```

**Routing logic (Code node after listener):**
```javascript
const text = $input.first().json.message.text || '';

if (text.startsWith('/approve_')) {
  return [{ json: { action: 'approve', doc_id: text.replace('/approve_', '') } }];
} else if (text.startsWith('/reject_')) {
  return [{ json: { action: 'reject', doc_id: text.replace('/reject_', '') } }];
} else if (text.startsWith('/revise_')) {
  return [{ json: { action: 'revise', doc_id: text.replace('/revise_', '') } }];
}

return [{ json: { action: 'unknown' } }];
```

---

### NODE 9 — Sanity: Publish Approved Article

```json
{
  "type": "n8n-nodes-base.httpRequest",
  "name": "Sanity: Publish Article",
  "parameters": {
    "method": "POST",
    "url": "https://{{ $env.SANITY_PROJECT_ID }}.api.sanity.io/v2021-06-07/data/mutate/{{ $env.SANITY_DATASET }}",
    "headers": {
      "Authorization": "Bearer {{ $env.SANITY_API_TOKEN }}",
      "Content-Type": "application/json"
    },
    "body": {
      "mutations": [
        {
          "patch": {
            "id": "={{ $json.doc_id }}",
            "set": {
              "status": "published",
              "publishedAt": "={{ $now.toISOString() }}"
            }
          }
        }
      ]
    }
  }
}
```

---

## W-03: DISTRIBUTION ENGINE

**Trigger:** Sanity publish webhook (fires when article status → `published`)
**Purpose:** Auto-generate social posts, email digest, GBP post, and short-form video script

### Node Map

```
[Sanity Publish Webhook]
    → [Fetch Published Article]
    → [Claude: Generate Distribution Pack]
    → [Telegram: Distribute Pack Preview]
    → [Split: Route by Content Type]
        → [Social: 3 Posts]
        → [Email: Newsletter Digest]
        → [GBP: Weekly Post]
        → [Video: Short-Form Script]
    → [Telegram: Distribution Complete]
```

---

### NODE 1 — Sanity Publish Webhook

Set in Sanity Studio under:
**API → Webhooks → URL:** `https://your-n8n.com/webhook/sanity-publish`
**Filter:** `_type == "article" && status == "published"`

---

### NODE 2 — Claude: Generate Distribution Pack

```json
{
  "type": "n8n-nodes-base.httpRequest",
  "name": "Claude: Distribution Pack",
  "parameters": {
    "method": "POST",
    "url": "https://api.anthropic.com/v1/messages",
    "headers": {
      "x-api-key": "{{ $env.ANTHROPIC_API_KEY }}",
      "anthropic-version": "2023-06-01",
      "Content-Type": "application/json"
    },
    "body": {
      "model": "claude-opus-4-5",
      "max_tokens": 2000,
      "messages": [
        {
          "role": "user",
          "content": "Generate a complete distribution pack for this published article.\n\nARTICLE TITLE: {{ $json.title }}\nARTICLE URL: https://weareajdigital.com/blog/{{ $json.slug }}/\nARTICLE SUMMARY: {{ $json.metaDescription }}\nKEY INSIGHT: {{ $json.faqPairs[0].answer }}\n\nReturn JSON:\n{\n  \"social_posts\": [\n    {\"platform\": \"linkedin\", \"copy\": string, \"hashtags\": [string]},\n    {\"platform\": \"instagram\", \"copy\": string, \"hashtags\": [string]},\n    {\"platform\": \"twitter\", \"copy\": string, \"hashtags\": [string]}\n  ],\n  \"email_digest\": {\n    \"subject_line\": string,\n    \"preview_text\": string,\n    \"body_html\": string\n  },\n  \"gbp_post\": {\n    \"text\": string,\n    \"cta_type\": \"LEARN_MORE\",\n    \"cta_url\": string\n  },\n  \"short_form_script\": {\n    \"hook\": string,\n    \"body\": string,\n    \"cta\": string,\n    \"duration_seconds\": number\n  }\n}\n\nRules:\n- LinkedIn: 150–200 words, insight-led, no emojis\n- Instagram: 80–100 words, conversational, 5–8 hashtags\n- Twitter/X: Under 240 chars, punchy hook\n- Email subject: under 50 chars, curiosity-driven\n- GBP post: under 300 chars\n- Short-form script: 45–60 seconds (hook: 5s, body: 35–40s, CTA: 5–10s)"
        }
      ]
    }
  }
}
```

---

## W-04: FEEDBACK COLLECTOR

**Trigger:** Every Sunday at 08:00 UTC
**Purpose:** Pull ranking data, detect citation gains, calculate article ROI, re-queue underperformers

### Node Map

```
[Schedule Trigger: Sunday 08:00 UTC]
    → [GSC: This Week vs Last Week]
    → [Perplexity: Citation Check]
    → [Analyzer: Score Performance]
    → [Flag Underperformers → Re-queue in Sanity]
    → [Telegram: Weekly Feedback Report]
```

---

### NODE 3 — Perplexity: Citation Check

```json
{
  "type": "n8n-nodes-base.httpRequest",
  "name": "Perplexity: Citation Check",
  "parameters": {
    "method": "POST",
    "url": "https://api.perplexity.ai/chat/completions",
    "headers": {
      "Authorization": "Bearer {{ $env.PERPLEXITY_API_KEY }}",
      "Content-Type": "application/json"
    },
    "body": {
      "model": "llama-3.1-sonar-large-128k-online",
      "messages": [
        {
          "role": "user",
          "content": "Check if weareajdigital.com is being cited as a source for any of these questions. Return JSON with citation status for each.\n\nQuestions to check:\n{{ $('GSC Data').all().slice(0, 5).map(r => '- ' + r.json.keys[0]).join('\\n') }}\n\nReturn:\n{\n  \"citations\": [\n    {\n      \"question\": string,\n      \"aj_digital_cited\": boolean,\n      \"competing_sources\": [string],\n      \"citation_opportunity\": \"high|medium|low\"\n    }\n  ]\n}"
        }
      ]
    }
  }
}
```

---

## W-05: CONTENT MUTATION LOOP

**Trigger:** 1st of every month at 09:00 UTC
**Purpose:** Refresh top-performing articles to keep rankings and citations growing

### Mutation Logic

1. Pull top 5 articles by organic clicks (GSC, last 30 days)
2. For each: Perplexity re-queries the topic for new data points
3. Claude appends a "Updated [Month Year]" section with new stats and context
4. Saves as new revision in Sanity
5. Pushes updated `dateModified` in Article JSON-LD
6. Submits URL to GSC Indexing API
7. Sends Telegram summary

---

## API CREDENTIALS REFERENCE

| Credential | n8n Type | Env Var |
|------------|----------|---------|
| Perplexity | HTTP Header Auth | `PERPLEXITY_API_KEY` |
| Claude/Anthropic | HTTP Header Auth | `ANTHROPIC_API_KEY` |
| Google Search Console | OAuth2 | `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REFRESH_TOKEN` |
| Sanity | HTTP Header Auth | `SANITY_API_TOKEN` |
| Telegram | Telegram API | `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID` |
| OpenAI (optional fallback) | HTTP Header Auth | `OPENAI_API_KEY` |

**Add in n8n:** Settings → Credentials → New → select type → paste values from `.env`

---

## ERROR HANDLING (ALL WORKFLOWS)

### Global Error Trigger

Add to every workflow:

```json
{
  "type": "n8n-nodes-base.errorTrigger",
  "name": "Error Handler"
}
```

Connects to:

```json
{
  "type": "n8n-nodes-base.telegram",
  "name": "Telegram: Error Alert",
  "parameters": {
    "chatId": "={{ $env.TELEGRAM_CHAT_ID }}",
    "text": "❌ *Workflow Error*\n\n🔧 Workflow: {{ $workflow.name }}\n📍 Node: {{ $execution.lastNodeExecuted }}\n💬 Error: {{ $json.error.message }}\n🕐 Time: {{ $now.format('HH:mm, MMM d') }}\n\n🔗 https://your-n8n.com/workflow/{{ $workflow.id }}"
  }
}
```

---

## IMPLEMENTATION CHECKLIST

```
PHASE 1 — CREDENTIALS (Day 1)
□ Add Perplexity API key to n8n credentials
□ Add Anthropic API key to n8n credentials
□ Configure Google OAuth2 (GSC access)
□ Add Sanity API token
□ Create Telegram bot + add to channel, save bot token + chat ID
□ Verify .env.example matches all credential names

PHASE 2 — SANITY SCHEMA (Day 1–2)
□ Create 'contentBrief' document type in Sanity
□ Create 'article' document type in Sanity
□ Add required fields: title, metaTitle, metaDescription, body, faqPairs, schemaTypes, status, publishedAt
□ Configure Sanity webhook → n8n /webhook/sanity-publish

PHASE 3 — W-01 INTELLIGENCE SCAN (Day 2)
□ Import W-01 nodes
□ Set schedule: Monday 07:00 UTC
□ Test manually: verify Perplexity returns valid JSON
□ Test normalizer: verify opportunity matrix scores
□ Test Sanity write: confirm draft briefs appear
□ Test Telegram: confirm intel report delivers

PHASE 4 — W-02 ARTICLE GENERATOR (Day 3–4)
□ Import W-02 nodes
□ Test with manually created brief in Sanity
□ Verify Claude returns valid article JSON
□ Verify AEO validator catches a known failure
□ Test Telegram approval flow end-to-end
□ Confirm Sanity publish mutation works

PHASE 5 — W-03 DISTRIBUTION (Day 4–5)
□ Import W-03 nodes
□ Test Sanity webhook fires on publish
□ Verify distribution pack JSON structure
□ Test each social post format
□ Confirm GBP post under 300 chars

PHASE 6 — W-04 + W-05 FEEDBACK + MUTATION (Week 2)
□ Import W-04 nodes
□ Test GSC data pull (confirm OAuth works)
□ Test Perplexity citation check
□ Import W-05 nodes
□ Test content mutation on 1 article
□ Confirm GSC indexing API call

PHASE 7 — WEEKLY DRY RUN
□ Run full loop manually (W-01 → W-02 → W-03)
□ Check all Telegram notifications
□ Verify article appears live in Sanity
□ Confirm no orphan nodes or broken connections
□ Enable all schedules
```

---

## RELATED FILES

| File | Purpose |
|------|---------|
| `workflows/n8n/code/normalizer.js` | Normalizer v2 — strict parser, weighted scoring, fast-track flag |
| `workflows/n8n/code/aeo-validator.js` | AEO validator v2 — hard enforcement, kill switch output |
| `workflows/n8n/code/fast-track-router.js` | Post-validation router — auto-publish vs manual approval |
| `workflows/n8n/code/approval-router.js` | Telegram approval command router |
| `workflows/n8n/code/feedback-analyzer.js` | W-04 — citation rate, CTR rule, ranking-not-cited rule |
| `workflows/n8n/code/claude-article-prompt.md` | Exact Claude prompts for article generation + distribution |
| `workflows/n8n/seo-aeo-engine-workflow.json` | Importable n8n JSON scaffold |
| `schemas/sanity-schema-lock.md` | Sanity document types + field lock + status flow |
| `skills/content_creation/seo/perplexity-seo-aeo-research-operator.skill.md` | Perplexity prompts |
| `schemas/opportunity-matrix.schema.json` | Output schema |
| `schemas/page-brief.schema.json` | Brief schema |
| `schemas/ai-citation-brief.schema.json` | AEO citation schema |
| `.env.example` | All required credentials |

---

## HARDENING ADDENDUM (v2.0)

### W-02 Updated Node Map (with kill switch + fast track)

```
[Webhook Trigger]
    → [Fetch Brief from Sanity]
    → [Perplexity: Deep SERP Research]
    → [Claude: Generate Article]
    → [AEO Validator v2]
        → kill === true  → [STOP Node] → [Telegram: Kill Alert]  ← NEW
        → passed + fast_track eligible → [Fast Track Router]
              → route === 'fast_track'      → [Sanity: Auto-Publish]  → [Telegram: Auto-Published]
              → route === 'manual_approval' → [Sanity: Save Draft]    → [Telegram: Approval Request]
              → route === 'revision'        → [Claude: Revise Draft]  → [AEO Validator v2] (loop once)
```

---

### Kill Switch Node Config

Add this node immediately after AEO Validator:

```json
{
  "type": "n8n-nodes-base.if",
  "name": "Kill Switch Gate",
  "parameters": {
    "conditions": {
      "conditions": [
        {
          "leftValue": "={{ $json.kill }}",
          "operator": { "type": "boolean", "operation": "true" }
        }
      ]
    }
  }
}
```

**True branch → Telegram Kill Alert:**

```json
{
  "type": "n8n-nodes-base.telegram",
  "name": "Telegram: Kill Alert",
  "parameters": {
    "chatId": "={{ $env.TELEGRAM_CHAT_ID }}",
    "text": "=🚨 *ARTICLE FAILED VALIDATION — WORKFLOW STOPPED*\n\n🔑 Keyword: {{ $('W02: Article Generator Webhook').first().json.keyword }}\n❌ Reason: {{ $json.kill_reason }}\n📋 Issues ({{ $json.issue_count }}):\n{{ $json.issues.slice(0,3).join('\\n') }}\n\n🔧 Action required: review and re-trigger manually.\nn8n run: {{ $execution.id }}",
    "additionalFields": { "parse_mode": "Markdown" }
  }
}
```

**False branch → Fast Track Router node (routes to auto-publish or approval)**

---

### Fast Track Auto-Publish Node Config

```json
{
  "type": "n8n-nodes-base.httpRequest",
  "name": "Sanity: Auto-Publish (Fast Track)",
  "parameters": {
    "method": "POST",
    "url": "=https://{{ $env.SANITY_PROJECT_ID }}.api.sanity.io/v2021-06-07/data/mutate/{{ $env.SANITY_DATASET }}",
    "body": {
      "mutations": [{
        "create": {
          "_type": "article",
          "title": "={{ $json.article.h1 }}",
          "metaTitle": "={{ $json.article.meta_title }}",
          "metaDescription": "={{ $json.article.meta_description }}",
          "body": "={{ $json.article.article_html }}",
          "faqPairs": "={{ $json.article.faq_pairs }}",
          "schemaTypes": "={{ $json.article.schema_types }}",
          "aeo_score": "={{ $json.aeo_score }}",
          "status": "published",
          "publishedAt": "={{ $now.toISOString() }}",
          "fast_track": true
        }
      }]
    }
  }
}
```

Telegram confirmation:

```
⚡ *Fast Track Published*

📰 {{ article.h1 }}
🎯 AEO Score: {{ aeo_score }}/100
✅ Reason: {{ reason }}
🔗 https://weareajdigital.com/blog/{{ slug }}/
```

---

### W-04 Updated Node Map (with Feedback Analyzer)

```
[Schedule: Sunday 08:00 UTC]
    → [GSC: This Week (last 7 days)]
    → [GSC: Last Week (8–14 days ago)]
    → [Perplexity: Citation Check]
    → [Sanity: Fetch Published Articles]
    → [Feedback Analyzer]                    ← NEW (feedback-analyzer.js)
        → [Filter: action_required === true]
              → [Sanity: Flag Article for Rewrite]
              → [Telegram: Rewrite Queue Alert]
        → [Telegram: Sunday Feedback Report]
```

**Telegram Sunday Report template:**

```
📊 *AJ Digital — Weekly Feedback*
Week ending {{ date }}

{{ trend === 'up' ? '🔼' : '🔽' }} Clicks: {{ delta_clicks >= 0 ? '+' : '' }}{{ delta_clicks }} vs last week
{{ trend === 'up' ? '🔼' : '🔽' }} Impressions: {{ delta_impressions >= 0 ? '+' : '' }}{{ delta_impressions }}

🤖 AI Citations this week: {{ cited_pages_count }}
📈 Growing pages: {{ growing_pages_count }}
⚠️ Rewrite queue: {{ rewrite_queue_count }}

{{ rewrite_queue_count > 0 ? '🔧 Top rewrite needed:\n' + top_rewrite_needed + '\nReason: ' + top_rewrite_reason : '✅ No rewrites needed this week.' }}
```

---

### GSC Two-Window Query Config

**This Week node:**
```json
{
  "startDate": "={{ $now.minus({days: 7}).format('yyyy-MM-dd') }}",
  "endDate":   "={{ $now.format('yyyy-MM-dd') }}",
  "dimensions": ["query", "page"],
  "rowLimit": 100
}
```

**Last Week node:**
```json
{
  "startDate": "={{ $now.minus({days: 14}).format('yyyy-MM-dd') }}",
  "endDate":   "={{ $now.minus({days: 7}).format('yyyy-MM-dd') }}",
  "dimensions": ["query", "page"],
  "rowLimit": 100
}
```

---

### Perplexity Citation Check Config (W-04)

```json
{
  "model": "llama-3.1-sonar-large-128k-online",
  "messages": [{
    "role": "user",
    "content": "Check if weareajdigital.com is being cited as a source when AI engines answer these questions. For each, check Perplexity, ChatGPT, and Google AI Overview if possible.\n\nQuestions to check:\n{{ top_gsc_queries_list }}\n\nReturn JSON:\n{\n  \"citations\": [\n    {\n      \"question\": string,\n      \"aj_digital_cited\": boolean,\n      \"competing_sources\": [string],\n      \"citation_opportunity\": \"high|medium|low\",\n      \"citation_context\": string\n    }\n  ]\n}"
  }]
}
```

---

### Sanity: Flag Article for Rewrite Config

```json
{
  "mutations": [{
    "patch": {
      "id": "={{ $json.page.sanity_doc_id }}",
      "set": {
        "performance.rewrite_flagged": true,
        "performance.rewrite_reason": "={{ $json.page.rewrite_reason }}",
        "performance.last_checked": "={{ $now.toISOString() }}",
        "status": "needs_revision"
      }
    }
  }]
}
```
