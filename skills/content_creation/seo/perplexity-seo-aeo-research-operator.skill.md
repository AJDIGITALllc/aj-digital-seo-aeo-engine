# Skill: Perplexity SEO/AEO Research Operator

**Version:** 1.0
**Last updated:** 2026-04-03
**Owner:** AJ Digital LLC
**Scope:** SEO and AEO opportunity research using Perplexity as the live web intelligence layer

---

## Purpose

This skill defines how to use Perplexity's `sonar-pro` model to perform live SERP analysis, competitor extraction, topical mapping, AEO opportunity structuring, and indexing diagnostics — producing structured outputs that feed directly into the SEO/AEO engine pipeline.

Use this skill when:
- Researching a topic, keyword, or client niche from scratch
- Auditing existing content for SERP gaps
- Identifying AI citation opportunities
- Structuring topical authority maps
- Preparing page briefs grounded in live search reality

---

## Model

```
llama-3.1-sonar-large-128k-online
```

Use `sonar-pro` for depth. Use `sonar` for speed when running bulk opportunity scans.

---

## Research Modes

### Mode 1: Full Topic Research

**When to use:** Starting a new client engagement or content initiative.

**Prompt template:**

```
You are a senior SEO and AEO strategist. Perform a comprehensive research brief for the topic below.

Topic: {TOPIC}
Target site: {SITE_URL}
Target audience: {AUDIENCE}

Return the following in structured JSON:

1. SERP landscape
   - Top 10 ranking URLs for the primary keyword
   - Content format of each result (article, listicle, tool, video, etc.)
   - Estimated word count range
   - Featured snippet present? (yes/no)
   - "People Also Ask" questions (list all visible)

2. Competitor gap analysis
   - Topics the competitors cover that the target site does not
   - Subtopics with low competition but high relevance
   - Content formats not yet covered in the SERP

3. AEO opportunity map
   - Questions that AI engines (ChatGPT, Perplexity, Google AI Overviews) are likely answering on this topic
   - For each: the ideal direct answer (1–3 sentences, citable)
   - Schema type best suited (FAQPage, HowTo, Article)

4. Topical authority gaps
   - Pillar topics the site should own but doesn't yet cover
   - Cluster topics that support each pillar

5. Recommended content actions
   - Create (new page)
   - Update (existing page)
   - Consolidate (merge thin pages)
   - Optimize (on-page improvements only)

Return raw JSON. No markdown wrapper. No commentary outside the JSON.
```

---

### Mode 2: SERP Snapshot

**When to use:** Quick competitive check for a single keyword before writing a page.

**Prompt template:**

```
Analyze the current SERP for: "{KEYWORD}"

Return JSON with:
- top_results: array of { url, title, format, approx_word_count, has_featured_snippet }
- paa_questions: array of strings
- ai_answer_present: boolean
- dominant_content_format: string
- content_gaps: array of strings (subtopics missing from current top results)
- recommended_angle: string (the unique angle this page should take to rank)

Return raw JSON only.
```

---

### Mode 3: AEO Citation Audit

**When to use:** Checking whether a specific page or topic is being cited by AI engines.

**Prompt template:**

```
You are an AEO specialist. Audit the following topic for AI engine citation potential.

Topic: {TOPIC}
Existing URL (if any): {URL}

Answer the following and return as JSON:

1. Is this topic currently answered directly by AI engines? (yes/no/partially)
2. What phrasing does Perplexity use to answer this? (quote or paraphrase)
3. What sources does Perplexity cite? (list URLs)
4. What would make a page more likely to be cited? (3–5 specific actions)
5. What Q&A pairs should this page include to maximize citation probability?
   - question: string
   - ideal_answer: string (1–3 sentences, direct, citable)
   - schema_type: FAQPage | HowTo | Article

Return raw JSON only.
```

---

### Mode 4: Topical Authority Map

**When to use:** Building a full content architecture for a niche.

**Prompt template:**

```
You are a content strategist building a topical authority map.

Niche: {NICHE}
Site: {SITE_URL}
Business type: {BUSINESS_TYPE}

Generate a pillar-cluster content map:

{
  "pillars": [
    {
      "title": string,
      "slug": string,
      "primary_keyword": string,
      "search_intent": "informational|commercial|transactional",
      "clusters": [
        {
          "title": string,
          "slug": string,
          "primary_keyword": string,
          "aeo_questions": [string],
          "recommended_action": "create|update|optimize"
        }
      ]
    }
  ]
}

Rules:
- Minimum 3 pillars, maximum 7
- Minimum 4 clusters per pillar
- Every cluster must have at least 2 AEO questions
- Slugs must be lowercase, hyphen-separated, no special characters

Return raw JSON only. Conform exactly to the structure above.
```

---

## Output Schemas

All outputs from this skill should conform to the JSON schemas in `schemas/`:

| Mode | Schema |
|------|--------|
| Full Topic Research | `opportunity-matrix.schema.json` + `topic-map.schema.json` |
| SERP Snapshot | Inline (subset of `opportunity-matrix.schema.json`) |
| AEO Citation Audit | `ai-citation-brief.schema.json` |
| Topical Authority Map | `topic-map.schema.json` |

---

## Integration Points

| System | Purpose |
|--------|---------|
| n8n workflow | Node 3 (Perplexity Research Operator) |
| Claude Code | Direct invocation during research mode |
| Page brief generator | Feeds structured research into `page-brief.schema.json` |

---

## Quality Rules

- Never summarize. Return structured JSON that the pipeline can consume directly.
- Always request raw JSON. No markdown wrappers, no commentary outside the JSON.
- If Perplexity returns partial results, log the gap and proceed — do not halt the pipeline.
- AEO answers must be 1–3 sentences, written as direct, self-contained statements.
- Every topical authority map must include internal link recommendations.

---

## Related Files

- `workflows/n8n/seo-aeo-engine-workflow.md` — pipeline that consumes this skill
- `schemas/opportunity-matrix.schema.json`
- `schemas/topic-map.schema.json`
- `schemas/page-brief.schema.json`
- `schemas/ai-citation-brief.schema.json`
- `prompts/research/senior_research_prompt.md`
