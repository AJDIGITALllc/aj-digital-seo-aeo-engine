# Project Brief

**Standardized input format for all AJ Digital website builds.**

---

## Purpose

This is the single source of project context for every build. Fill it in once, then feed it into any downstream tool — Claude Code, Anti-Gravity, Strategy Mode, or manual execution. Every template and prompt in the system reads from this format.

---

## Usage Instructions

1. Copy the blank brief below (§1–§10)
2. Fill in every section — leave nothing as `[BRACKET]` in production use
3. Mark optional fields as "N/A" if not applicable — do not delete them
4. Feed the completed brief into your build workflow:

| Workflow | How This Brief Is Used |
|---|---|
| **Strategy Mode** (`/system/execution_mode.md`) | Brief is the primary input. Strategy output maps pages, messaging, and CTA strategy from this data. |
| **Build Mode** (`/system/execution_mode.md`) | Strategy output + this brief together feed page construction. Blueprint selection comes from §8 + `/skills/web_building/page_blueprints.md`. |
| **Claude Code** (`/templates/claude/site_build_template.md`) | Transfer brief data into the template's PROJECT BRIEF, BRAND, and SEO REQUIREMENTS sections. |
| **Anti-Gravity** (`/templates/anti_gravity/site_generation_template.md`) | Transfer brief data into the template's PROJECT, AUDIENCE, DESIGN DIRECTION, and PAGE STRUCTURE sections. |
| **Research Mode** (`/system/execution_mode.md`) | §2, §6, and §7 feed the research prompt. Research output flows back to refine this brief. |

---

## Alignment

This brief provides structured input to:

- `/system/execution_mode.md` — all four modes consume this brief
- `/skills/web_building/page_blueprints.md` — §8 determines which blueprints to select
- `/skills/web_building/claude_templates.md` — component builds reference §5 for messaging and §4 for offer framing
- `/skills/web_building/anti_gravity_prompts.md` — UI generation uses §5 for design direction and §2 for audience context

---

# The Brief

## 1. Business Overview

```
Business Name:    [Legal or brand name]
Industry:         [Primary industry or category]
Offer(s):         [What the business sells — services, products, or both]
Business Model:   [Agency / SaaS / Ecommerce / Consultancy / Productized service / Other]
Website:          [Current URL if redesign, or "New build"]
One-Line Summary: [What they do, for whom, in one sentence]
```

## 2. Target Audience

```
Primary Audience:
  Role:           [Job title, function, or persona type]
  Company Size:   [Solo / SMB / Mid-market / Enterprise / Consumer]
  Industry:       [Their industry, not yours]
  Pain Points:    [Top 3 frustrations or unmet needs]
  Desired Outcome:[What success looks like for them]
  Language:       [How they describe their problem — use their words]

Secondary Audience (optional):
  Role:           [If applicable]
  Relationship:   [How they differ from primary — e.g., "decision influencer, not buyer"]
```

## 3. Goals

```
Primary Goal:       [Specific conversion action — e.g., "Book a strategy call"]
Secondary Goals:    [e.g., "Build email list," "Establish thought leadership"]
Success Metrics:    [How you will measure — e.g., "20 qualified leads/month within 90 days"]
Current Baseline:   [Current performance if known — e.g., "~5 leads/month, 1.2% conversion rate"]
```

## 4. Offer Details

```
Core Offer:         [The primary thing being sold on this site]
Pricing:            [Starting at $X / Custom / Tiered / Not displayed]
Positioning:        [Premium / Mid-market / Value / Category-defining]
Engagement Model:   [Retainer / Project / Subscription / One-time]
Key Deliverables:   [What the client actually receives]
```

## 5. Messaging Direction

```
Voice:              [Professional / Bold / Friendly / Authoritative / Technical]
Personality:        [1–2 sentence brand personality — e.g., "Confident but approachable. Data-driven, not corporate."]
Key Messages:
  1. [Primary message — the one thing every visitor should remember]
  2. [Supporting message]
  3. [Supporting message]
Differentiators:
  1. [What makes this offer different from competitors]
  2. [Second differentiator]
  3. [Third differentiator]
Objections to Overcome:
  1. [Most common reason prospects hesitate]
  2. [Second objection]
  3. [Third objection]
```

## 6. Competitors / References

```
Competitors:
  1. [Name] — [URL] — [What they do well / where they're weak]
  2. [Name] — [URL] — [What they do well / where they're weak]
  3. [Name] — [URL] — [What they do well / where they're weak]

Inspiration Sites (design or UX reference, any industry):
  1. [URL] — [What you like about it]
  2. [URL] — [What you like about it]

Positioning Gaps:
  [What competitors are NOT doing that this site should own]
```

## 7. SEO / AEO Inputs

```
Primary Keywords:
  1. [Keyword] — [Estimated intent: informational / commercial / transactional]
  2. [Keyword] — [Intent]
  3. [Keyword] — [Intent]

Supporting Topics:
  [Subtopics, related entities, or long-tail clusters to cover]

Content Priorities:
  [Which pages or content types matter most for organic visibility]

AEO Targets:
  [Questions this site should answer for AI-generated search results]
```

## 8. Page Scope

```
Pages Required:
  1. [Page name] — [Type: Homepage / Landing / Service / Case Study / Contact / About / Other]
  2. [Page name] — [Type]
  3. [Page name] — [Type]
  [Continue as needed]

Priority Pages (build first):
  1. [Page name]
  2. [Page name]
  3. [Page name]

Blueprint References:
  [Map each page to a blueprint in page_blueprints.md — e.g., "Homepage → §3, Services → §5"]
```

## 9. Technical Notes

```
Platform:           [Next.js 14+ App Router / Other — specify]
Styling:            [Tailwind CSS / Other — specify]
CMS:                [Sanity / Payload / None / Other]
Hosting:            [Vercel / Other — specify]
Integrations:       [CRM, email, analytics, booking, payment — list all]
Constraints:        [Budget limits, timeline, accessibility requirements, regulatory needs]
Existing Assets:    [Design files, brand guidelines, photography, copy docs — list what exists]
```

## 10. Additional Context

```
Brand Assets:       [Logo files, color codes, font files — available / not yet / in progress]
Colors:
  Primary:          [HEX]
  Secondary:        [HEX]
  Accent:           [HEX or "derive from primary"]
  Neutrals:         [Light/dark preference]
Typography:
  Headings:         [Font family — e.g., "Inter"]
  Body:             [Font family]
Timeline:           [Launch target date or deadline]
Special Instructions:
  [Anything else — legal requirements, migration notes, stakeholder preferences, phased delivery, etc.]
```

---

# Completed Example

```
─── 1. BUSINESS OVERVIEW ───

Business Name:    Podcraft Studio
Industry:         Podcast production
Offer(s):         Full-service podcast production for brands and creators
Business Model:   Productized service
Website:          New build
One-Line Summary: We produce, edit, and grow podcasts for brands that want authority without the production hassle.

─── 2. TARGET AUDIENCE ───

Primary Audience:
  Role:           Marketing directors, founders
  Company Size:   SMB to mid-market (20–500 employees)
  Industry:       B2B SaaS, professional services, DTC brands
  Pain Points:    No time to produce consistently; poor audio quality hurts brand; no growth strategy
  Desired Outcome:A consistent, professional podcast that builds authority and generates leads
  Language:       "We started a podcast but can't keep up." "It sounds amateur." "We're not growing."

Secondary Audience:
  Role:           Independent creators with 5K+ audience
  Relationship:   Smaller budgets, higher volume, different onboarding path

─── 3. GOALS ───

Primary Goal:       Book a discovery call
Secondary Goals:    Build email list via lead magnet (podcast launch checklist)
Success Metrics:    15 qualified discovery calls/month within 60 days
Current Baseline:   New site, no baseline

─── 4. OFFER DETAILS ───

Core Offer:         Done-for-you podcast production (recording to distribution)
Pricing:            Starting at $2,500/month
Positioning:        Premium
Engagement Model:   Monthly retainer
Key Deliverables:   4 edited episodes/month, show notes, audiograms, distribution, analytics report

─── 5. MESSAGING DIRECTION ───

Voice:              Confident, direct, creative
Personality:        Expert who makes complex production feel effortless. Not corporate — more like a skilled collaborator.
Key Messages:
  1. You focus on the conversation. We handle everything else.
  2. Podcast production that sounds like a top-10 show.
  3. Strategy-first — we grow audiences, not just publish episodes.
Differentiators:
  1. Strategy + production in one team (competitors split these)
  2. Brand-first approach — every episode serves business goals
  3. AI-assisted workflow cuts turnaround to 48 hours
Objections to Overcome:
  1. "We tried podcasting and it didn't work." → Show proof of growth
  2. "It's too expensive." → Show ROI per episode vs. paid ads
  3. "We don't have time." → Show how little client time is needed

─── 6. COMPETITORS / REFERENCES ───

Competitors:
  1. Podium Audio — podiumaudio.com — Strong brand, but no strategy services
  2. Resonate Recordings — resonaterecordings.com — Good SEO, weak CRO
  3. Lemonpie — lemonpie.fm — Creative positioning, limited service depth

Inspiration Sites:
  1. basecamp.com — Clean, opinionated, strong voice
  2. linear.app — Premium feel, excellent typography

Positioning Gaps:
  No competitor combines strategy + production + growth in one retainer.

─── 7. SEO / AEO INPUTS ───

Primary Keywords:
  1. "podcast production agency" — commercial
  2. "podcast production for brands" — commercial
  3. "podcast editing service" — transactional

Supporting Topics:
  Podcast launch strategy, podcast growth, podcast ROI, B2B podcasting

Content Priorities:
  Service pages (production, editing, strategy), case studies, FAQ-rich homepage

AEO Targets:
  "What does a podcast production agency do?"
  "How much does podcast production cost?"
  "How to start a branded podcast"

─── 8. PAGE SCOPE ───

Pages Required:
  1. Homepage — Homepage
  2. Production Service — Service
  3. Strategy Service — Service
  4. Case Studies (hub) — Resource
  5. Case Study: [Client] — Case Study
  6. About — About
  7. Contact — Contact
  8. Podcast Launch Checklist (lead magnet) — Landing

Priority Pages:
  1. Homepage
  2. Production Service
  3. Contact

Blueprint References:
  Homepage → page_blueprints.md §3
  Production Service → page_blueprints.md §5
  Strategy Service → page_blueprints.md §5
  Case Study → page_blueprints.md §6
  Contact → page_blueprints.md §7
  Lead Magnet → page_blueprints.md §4

─── 9. TECHNICAL NOTES ───

Platform:           Next.js 14+ (App Router)
Styling:            Tailwind CSS
CMS:                Sanity
Hosting:            Vercel
Integrations:       Calendly (booking), ConvertKit (email), Plausible (analytics)
Constraints:        Launch in 4 weeks. Budget supports 8 pages max.
Existing Assets:    Logo (SVG), brand colors, no photography yet

─── 10. ADDITIONAL CONTEXT ───

Brand Assets:       Logo available. Photography TBD — use abstract/lifestyle direction.
Colors:
  Primary:          #1E3A5F
  Secondary:        #F97316
  Accent:           Derive from secondary
  Neutrals:         Light background preferred
Typography:
  Headings:         Inter
  Body:             Inter
Timeline:           April 21, 2026
Special Instructions:
  Founder wants to personally approve homepage copy before build.
  Phased delivery: homepage + contact first, then service pages, then case studies.
```

---

*Fill this brief thoroughly. The quality of the output is directly proportional to the quality of the input.*
