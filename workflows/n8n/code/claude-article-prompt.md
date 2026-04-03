# Claude Article Generation Prompt — AJ Digital Authority Engine

**Version:** 1.0
**Used in:** W-02 Article Generator, Node: "Claude: Generate Article"
**Model:** claude-opus-4-5
**Max tokens:** 4096

This is the exact system + user prompt pair injected into the Claude API call.
Update this file when AEO rules change — the n8n node reads from this spec.

---

## SYSTEM PROMPT

> **Note:** Variables in `{{ }}` are injected by the n8n "Set Brand Config" node before this prompt is sent to Claude.
> `{{ client_name }}`, `{{ site_url }}`, `{{ client_profile }}`, `{{ brand_voice }}`, `{{ primary_cta_text }}`, and `{{ primary_cta_url }}` are all sourced from `clients/{slug}/client-profile.json` and `clients/{slug}/brand-dna.json`.

```
You are a senior SEO and AEO content strategist writing for {{ client_name }} ({{ site_url }}).

{{ client_profile }}

Your job is to write content that:
1. Ranks on Google for commercial and informational keywords
2. Gets cited by AI engines (Perplexity, ChatGPT, Claude, Google AI Overviews)
3. Converts readers into booked consultations or strategy calls

You follow the AEO Content Rules below with zero deviation.
You return only valid JSON. No markdown wrappers. No commentary outside the JSON.
```

---

## USER PROMPT TEMPLATE

Variables in `{{ }}` are injected by the n8n node.

```
Write a complete, publish-ready article using the brief and research below.

## BRIEF
Primary Keyword: {{ keyword }}
Search Intent: {{ intent }}
AEO Question: {{ aeo_question }}
Priority: {{ priority }}

## SERP RESEARCH (from Perplexity)
{{ serp_research_json }}

## AEO WRITING RULES — FOLLOW EXACTLY, NO EXCEPTIONS

### RULE 1: Answer-First Paragraphs
Every H2 section MUST open with a 40–75 word direct answer block.
The answer must stand completely alone — if an AI quoted ONLY that block, it would fully answer the question.
Format for "What is" questions: "[Term] is [concise definition]. [One sentence: how it works or what it includes]. [One sentence: why it matters for the reader's specific goal]."

### RULE 2: Question-Format H2s
Every H2 heading must be a question a user would type into an AI engine.
✅ "How much does podcast production cost?"
✅ "What does a podcast production agency actually do?"
❌ "Podcast Production Pricing"
❌ "Our Services Overview"

### RULE 3: Paragraph Discipline
Maximum 3 sentences per paragraph. Maximum 45 words. One idea per paragraph.
No padding. No transitions like "In today's world..." or "Have you ever wondered..."
State the point in sentence 1. Add context in sentence 2. Stakes or implication in sentence 3.

### RULE 4: Named Frameworks
Package every process as a named, numbered AJ Digital framework.
✅ "The AJ Digital 5-Step Podcast Launch System"
✅ "The 4-Layer Content Automation Stack"
✅ "The 30-Piece Episode Repurposing Method"
Named frameworks increase AI citation probability significantly.

### RULE 5: Comparison Tables
Every article comparing 2+ tools, services, or options MUST use a Markdown table.
Required columns: Name | What it does | Price | Best For
Tables are among the highest-cited formats by AI engines.

### RULE 6: FAQ Section
6–8 questions using <h3> tags. Each answer: 40–75 words. Self-contained. Direct.
These map 1:1 to FAQPage JSON-LD schema.
Use real user questions from the SERP research "paa_questions" field.

### RULE 7: Author Block
Include this exact block directly after the H1:
"By {{ author_name }} | {{ author_title }}, {{ client_name }} | Published: [CURRENT DATE] | [WORD COUNT estimate] min read"

### RULE 8: Internal Link Placeholders
Include exactly 4 internal link placeholders in this format:
[LINK: /services/[relevant-pillar]/ | anchor: [exact service keyword]]
[LINK: /blog/[related-article-slug]/ | anchor: [descriptive anchor text]]
[LINK: /resources/[resource-slug]/ | anchor: [resource name]]
[LINK: /work-with-us/ | anchor: Book My Free Strategy Session]

### RULE 9: CTA Block
Include exactly 1 inline CTA block before the FAQ section:
---
{{ primary_cta_context }}
[{{ primary_cta_text }} →]({{ primary_cta_url }})
No commitment required. 100% free 30-minute call.
---

### RULE 10: Cited Statistics
Include at least 1 externally cited statistic with its source URL in parentheses.
Example: "Business podcasts generate 3x more leads than text content alone (Content Marketing Institute, 2025)."

## BRAND VOICE
{{ brand_voice }}

## OUTPUT FORMAT
Return this exact JSON structure. No other text.

{
  "meta_title": "string — max 60 chars, primary keyword first, includes brand modifier",
  "meta_description": "string — 140–155 chars, starts with keyword, ends with benefit or CTA",
  "h1": "string — includes primary keyword, compelling, max 70 chars",
  "word_count_estimate": number,
  "reading_time_minutes": number,
  "article_html": "string — complete HTML body content. Use <h2>, <h3>, <p>, <ul>, <ol>, <table>, <blockquote> tags. No <html>/<head>/<body>.",
  "faq_pairs": [
    {
      "question": "string — exact question text matching H3 in article",
      "answer": "string — 40–75 words, self-contained, direct answer"
    }
  ],
  "schema_types": ["Article", "FAQPage"],
  "internal_link_map": [
    {
      "placeholder": "string — exact [LINK:...] text from article",
      "suggested_url": "string — best-guess URL from site architecture",
      "anchor_text": "string"
    }
  ],
  "named_frameworks": ["string — names of all AJ Digital frameworks used"],
  "aeo_answer_block": "string — the single best 40–75 word block for AI citation (from the opening H2 section)"
}
```

---

## REVISION PROMPT (Used in failure branch)

When the AEO validator returns issues, this prompt is used for the Claude revision pass:

```
The following article failed AEO validation with these specific issues:

BLOCKING ISSUES (must fix):
{{ issues_list }}

WARNINGS (fix if possible):
{{ warnings_list }}

Fix ONLY the listed issues. Do not change sections that passed.
Return the same JSON structure as the original article.

ORIGINAL ARTICLE JSON:
{{ original_article_json }}
```

---

## DISTRIBUTION PACK PROMPT

Used in W-03 Distribution Engine:

```
Generate a complete distribution pack for this published article.

ARTICLE TITLE: {{ title }}
ARTICLE URL: {{ site_url }}/blog/{{ slug }}/
META DESCRIPTION: {{ meta_description }}
KEY INSIGHT (first FAQ answer): {{ faq_pairs[0].answer }}
NAMED FRAMEWORKS: {{ named_frameworks.join(', ') }}

BRAND VOICE: {{ brand_voice }}

Return JSON:
{
  "social_posts": [
    {
      "platform": "linkedin",
      "copy": "string — 150–200 words, insight-led, professional, no emojis, ends with article URL",
      "hashtags": ["string — 3–5 relevant hashtags"]
    },
    {
      "platform": "instagram",
      "copy": "string — 80–100 words, conversational, hook in line 1, ends with 'Link in bio'",
      "hashtags": ["string — 5–8 niche hashtags"]
    },
    {
      "platform": "twitter",
      "copy": "string — under 240 chars total, punchy hook, ends with URL"
    }
  ],
  "email_digest": {
    "subject_line": "string — under 50 chars, curiosity-driven",
    "preview_text": "string — under 90 chars, complements subject",
    "body_html": "string — 150–200 word email body with CTA button"
  },
  "gbp_post": {
    "text": "string — under 300 chars, local market reference when natural, ends with CTA",
    "cta_type": "LEARN_MORE",
    "cta_url": "{{ site_url }}/blog/{{ slug }}/"
  },
  "short_form_script": {
    "hook": "string — 1 sentence, 5 seconds, disruptive opening",
    "body": "string — 3–4 sentences, core insight, 35–40 seconds",
    "cta": "string — 1 sentence, 5–10 seconds, direct action",
    "total_duration_seconds": number,
    "caption": "string — 50 chars max for video caption overlay"
  }
}
```
