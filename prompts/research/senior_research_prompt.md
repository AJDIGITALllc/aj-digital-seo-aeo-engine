# Senior Research Prompt

**Deep research and synthesis prompt for gathering strategic intelligence before any build project.**

---

## Purpose

This prompt produces a comprehensive research synthesis that informs strategy, messaging, design, and content decisions for a client project. It is the first step in the workflow defined in `system/workflow.md`.

---

## Context Requirements

Before running this prompt, provide:

1. **Client business description** — what they do, who they serve
2. **Project type** — website redesign, new landing page, full digital platform
3. **Target audience** — demographics, role, industry, pain points
4. **Competitors** — 3-5 competitor URLs or company names
5. **Goals** — what business outcome the project should achieve
6. **Existing assets** — current website URL, brand guidelines, analytics data

---

## The Prompt

```
You are a senior research strategist at a premium digital agency. Your role is to conduct
deep competitive and strategic research that informs website design, messaging, and
conversion strategy.

PROJECT CONTEXT:
- Client: [CLIENT NAME]
- Business: [WHAT THEY DO]
- Industry: [INDUSTRY]
- Target audience: [WHO THEY SERVE — be specific about role, company size, pain points]
- Project type: [WEBSITE REDESIGN / NEW LANDING PAGE / FULL PLATFORM]
- Primary goal: [BUSINESS OUTCOME — e.g., "increase qualified leads by 40%"]
- Current website: [URL or "new build"]
- Competitors: [LIST 3-5 COMPETITOR URLs]

RESEARCH TASKS:

1. COMPETITIVE ANALYSIS
   For each competitor, analyze:
   - Homepage structure and messaging hierarchy
   - Value proposition (headline, subheadline)
   - CTA strategy (primary action, placement, copy)
   - Trust signals (testimonials, logos, metrics, certifications)
   - Design quality (layout, typography, use of white space)
   - Content strategy (blog, case studies, resources)
   - SEO indicators (title tags, meta descriptions, heading structure, schema markup)
   - Strengths to learn from
   - Weaknesses to exploit

   Organize findings in a comparison table.

2. AUDIENCE ANALYSIS
   - Primary persona: demographics, role, goals, frustrations, decision factors
   - Secondary persona (if applicable)
   - Language patterns: how does this audience describe their problems?
   - Decision journey: what steps do they take before choosing a provider?
   - Objections: what would stop them from converting?

3. SEO LANDSCAPE
   - Top 10 relevant keywords with estimated search volume
   - Keyword difficulty and ranking opportunity
   - Content gaps: what topics do competitors cover that the client doesn't?
   - SERP features: what appears (featured snippets, People Also Ask, maps)?
   - AEO opportunities: what questions could the client's content definitively answer?

4. CONVERSION STRATEGY RECOMMENDATIONS
   - Recommended page structure (what sections, in what order)
   - Messaging hierarchy (what's said first, second, third)
   - CTA strategy (what action, what copy, where placed)
   - Trust signal recommendations (what proof to include and where)
   - Objection handling strategy (what concerns to address pre-CTA)
   - Content requirements (what content needs to be written for each section)

5. AEO OPPORTUNITIES
   - Top 10 questions the target audience asks about this service/product
   - For each question: recommended answer structure and content strategy
   - Recommended FAQ schema content
   - Entity definition recommendations (how to describe the business for AI understanding)

OUTPUT FORMAT:
- Organized with clear headers for each section
- Competitor analysis in comparison tables
- Keyword data in tables with volume, difficulty, and opportunity rating
- Recommendations are specific and actionable (not vague)
- Total length: comprehensive — this is the foundation for the entire project

QUALITY BAR:
- Findings must be specific enough to directly inform design and content decisions
- Recommendations must reference specific competitor examples where relevant
- Every recommendation must include a rationale ("because...")
- If data is unavailable, flag it explicitly rather than guessing
```

---

## Expected Output

A research synthesis document containing:

1. **Competitive comparison table** with strengths, weaknesses, and patterns
2. **Audience personas** with specific pain points and language
3. **Keyword opportunity matrix** with prioritized targets
4. **Page structure recommendation** with conversion-informed section order
5. **Content requirements** per section
6. **AEO question bank** with answer strategies

The output should be detailed enough that a designer and copywriter can begin work without additional research.

---

*Run this prompt at the start of every client project. The quality of the research directly determines the quality of the build.*
