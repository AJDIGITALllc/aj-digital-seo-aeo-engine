# Conversion Audit Checklist

**100-point scoring framework for auditing website conversion performance, SEO, AEO, design clarity, UX, and technical readiness.**

---

## Purpose

Grade any website or page against AJ Digital's premium standards using a repeatable, weighted scoring system. This checklist produces an actionable audit report that Claude, Anti-Gravity, or a human operator can execute against immediately.

Use in:

- Optimization Mode (`/system/execution_mode.md`)
- QA phase of any build (`/system/workflow.md`, Phase 7)
- Client discovery and competitive evaluation
- Post-launch performance reviews

---

## Scope

**Included:** 100-point weighted scoring across 10 categories, section-level checks for 4 page types, severity classification, prioritization method, audit worksheet, report template, quick triage version.

**Not included:** Full SEO technical crawl (see `/prompts/audit/website_audit_prompt.md`), brand strategy evaluation (see `brand_system.md`), content production (see `content_system.md`).

---

## Alignment

This checklist enforces standards from:

- `/CLAUDE.md` — behavioral contract and quality thresholds
- `/skills/web_building/design_system.md` — 8pt spacing, typography, color
- `/skills/web_building/million_dollar_websites.md` — CRO frameworks, trust strategy
- `/skills/web_building/page_blueprints.md` — section order and page structure
- `/skills/web_building/claude_templates.md` — component patterns

---

# 1. Scoring Framework

## 100-Point Scale

| Category | Weight | Max Points |
|---|---|---|
| Messaging Clarity | 14% | 14 |
| Hero Effectiveness | 12% | 12 |
| CTA Clarity | 12% | 12 |
| Trust and Proof | 10% | 10 |
| Information Hierarchy | 10% | 10 |
| UX Friction | 10% | 10 |
| Mobile Responsiveness | 8% | 8 |
| SEO Structure | 10% | 10 |
| AEO Readiness | 8% | 8 |
| Performance Readiness | 6% | 6 |
| **Total** | **100%** | **100** |

## Grading Thresholds

| Score | Grade | Verdict |
|---|---|---|
| 90–100 | A | Launch-ready. Premium quality. |
| 80–89 | B | Solid. Minor refinements needed. |
| 70–79 | C | Functional but underperforming. Address majors before launch. |
| 60–69 | D | Significant issues. Do not launch without fixes. |
| Below 60 | F | Failing. Requires structural rework. |

## Severity Levels

| Severity | Definition | Impact | Action |
|---|---|---|---|
| **Critical** | Blocks conversions or breaks core functionality | Direct revenue loss | Fix before launch or immediately |
| **Major** | Degrades quality, trust, or findability | Reduced performance | Fix within current sprint |
| **Minor** | Polish issue, suboptimal but functional | Marginal impact | Fix in next iteration |

---

# 2. Category Evaluation Criteria

## 2.1 Messaging Clarity (14 pts)

| # | Check | Points | Severity if Failed |
|---|---|---|---|
| 1 | Value proposition is stated in the first screen | 4 | Critical |
| 2 | Headline answers "what is this and who is it for" | 3 | Critical |
| 3 | Subheadline clarifies the outcome or mechanism | 2 | Major |
| 4 | Language matches audience vocabulary (no jargon without context) | 2 | Major |
| 5 | No vague adjectives ("innovative," "cutting-edge," "best-in-class") without proof | 1 | Minor |
| 6 | Each section has a clear, scannable purpose statement | 2 | Major |

## 2.2 Hero Effectiveness (12 pts)

| # | Check | Points | Severity if Failed |
|---|---|---|---|
| 7 | H1 is specific, outcome-driven, and above the fold | 3 | Critical |
| 8 | Hero communicates who you help + what result you deliver | 3 | Critical |
| 9 | Primary CTA is visible without scrolling | 2 | Critical |
| 10 | Visual supports the message (not decorative stock) | 2 | Major |
| 11 | Hero loads fast — no layout shift, images optimized | 2 | Major |

## 2.3 CTA Clarity (12 pts)

| # | Check | Points | Severity if Failed |
|---|---|---|---|
| 12 | Primary CTA uses action-oriented verb (not "Submit" or "Learn More") | 2 | Major |
| 13 | CTA is visually dominant — high contrast, sufficient size (min 44×44px) | 2 | Critical |
| 14 | One primary CTA per section (no competing actions) | 2 | Major |
| 15 | CTA is repeated at hero, mid-page, and final section | 2 | Major |
| 16 | CTA text communicates value ("Get My Free Audit" > "Click Here") | 2 | Major |
| 17 | Secondary CTAs exist but are visually subordinate | 2 | Minor |

## 2.4 Trust and Proof (10 pts)

| # | Check | Points | Severity if Failed |
|---|---|---|---|
| 18 | Trust signals appear above the fold or immediately after hero | 2 | Critical |
| 19 | Testimonials include name, title, company (specific, not anonymous) | 2 | Major |
| 20 | Metrics or results are quantified (not vague) | 2 | Major |
| 21 | Client logos or "featured in" badges present | 2 | Major |
| 22 | Trust signals placed near conversion points | 2 | Major |

## 2.5 Information Hierarchy (10 pts)

| # | Check | Points | Severity if Failed |
|---|---|---|---|
| 23 | One dominant element per viewport (clear visual anchor) | 2 | Major |
| 24 | Heading hierarchy is sequential (H1 → H2 → H3, no skips) | 2 | Major |
| 25 | Sections follow a logical conversion flow (problem → solution → proof → CTA) | 2 | Critical |
| 26 | Progressive disclosure — most important info first | 2 | Major |
| 27 | Scan pattern is clear (F-pattern for text, Z-pattern for marketing) | 2 | Minor |

## 2.6 UX Friction (10 pts)

| # | Check | Points | Severity if Failed |
|---|---|---|---|
| 28 | Navigation is clear, minimal, and includes primary CTA | 2 | Major |
| 29 | Forms use minimum necessary fields | 2 | Major |
| 30 | Form inputs have visible labels (not placeholder-only) | 2 | Critical |
| 31 | Error states are clear and inline | 2 | Major |
| 32 | No dead-end pages — every page has a next action | 2 | Major |

## 2.7 Mobile Responsiveness (8 pts)

| # | Check | Points | Severity if Failed |
|---|---|---|---|
| 33 | Layout stacks cleanly — no horizontal scroll | 2 | Critical |
| 34 | Touch targets are minimum 44×44px | 2 | Major |
| 35 | CTA remains prominent and easy to tap | 2 | Critical |
| 36 | Typography is readable without zooming (16px+ body) | 2 | Major |

## 2.8 SEO Structure (10 pts)

| # | Check | Points | Severity if Failed |
|---|---|---|---|
| 37 | One H1 per page, keyword-informed, front-loaded | 2 | Critical |
| 38 | Meta title under 60 chars, meta description under 155 chars | 2 | Major |
| 39 | Semantic HTML used correctly (main, article, section, nav, aside) | 2 | Major |
| 40 | Internal links with descriptive anchor text to key pages | 2 | Major |
| 41 | Schema markup present (Organization, Service, FAQ, BreadcrumbList) | 2 | Major |

## 2.9 AEO Readiness (8 pts)

| # | Check | Points | Severity if Failed |
|---|---|---|---|
| 42 | Direct-answer blocks under major H2s (40–75 words) | 2 | Major |
| 43 | FAQ section uses real questions with concise, extractable answers | 2 | Major |
| 44 | Entity definition is clear (what the business is, who it serves, where) | 2 | Major |
| 45 | Structured data supports AI extraction (FAQ schema, Organization schema) | 2 | Major |

## 2.10 Performance Readiness (6 pts)

| # | Check | Points | Severity if Failed |
|---|---|---|---|
| 46 | LCP < 2.5s | 2 | Critical |
| 47 | INP < 200ms | 2 | Major |
| 48 | CLS < 0.1 (no layout shifts on load) | 2 | Major |

---

# 3. Page-Specific Checks

Apply the category checks above, then add these page-specific validations.

## 3.1 Homepage

| Check | Pass / Fail | Severity |
|---|---|---|
| Positions the brand within the first screen | | Critical |
| Routes multiple audience types to relevant paths | | Major |
| Services or pathways section present with links to deeper pages | | Major |
| Trust strip present (logos, stats, or mentions) | | Major |
| Process section reduces uncertainty | | Minor |
| Featured case study or proof block present | | Major |
| Footer includes nav, legal, contact, and trust reinforcement | | Minor |

Reference: Homepage Blueprint in `page_blueprints.md` §3.

## 3.2 Landing Page

| Check | Pass / Fail | Severity |
|---|---|---|
| Message matches the traffic source (ad, email, campaign) | | Critical |
| Full-site navigation removed or minimized | | Major |
| One audience, one offer, one CTA — no competing paths | | Critical |
| Deliverables are explicit ("What You Get" section) | | Major |
| Objection handling section present | | Major |
| CTA repeated at minimum 3 times on page | | Major |
| "What Happens Next" process section present | | Minor |

Reference: Landing Page Blueprint in `page_blueprints.md` §4.

## 3.3 Service Page

| Check | Pass / Fail | Severity |
|---|---|---|
| Direct-answer block present (40–75 words defining the service) | | Major |
| "Who This Is For" section defines ideal fit | | Major |
| Deliverables are scoped and specific | | Major |
| Differentiation block explains why your approach is different | | Major |
| Pricing guidance or engagement model present | | Minor |
| FAQ covers buying objections and service mechanics | | Major |
| Internal links to related services and case studies | | Major |

Reference: Service Page Blueprint in `page_blueprints.md` §5.

## 3.4 Contact / Inquiry Page

| Check | Pass / Fail | Severity |
|---|---|---|
| Page states what happens after submission | | Major |
| Expected response timeline is visible | | Minor |
| Fit guidance clarifies who should and should not inquire | | Minor |
| Form fields are minimal (only what is needed to qualify and respond) | | Major |
| Trust / assurance block reduces submission hesitation | | Major |
| Alternate contact paths available (email, calendar, phone) | | Minor |

Reference: Contact Blueprint in `page_blueprints.md` §7.

---

# 4. Prioritization Method

After scoring, prioritize fixes using this matrix:

| Priority | Criteria | Action |
|---|---|---|
| **P0 — Fix Now** | Critical severity + high-weight category (Messaging, Hero, CTA) | Block launch until resolved |
| **P1 — Fix This Sprint** | Critical severity in any category, or Major in top-4 weighted categories | Address before launch or within 48 hours |
| **P2 — Fix This Cycle** | Major severity in lower-weight categories | Schedule in current iteration |
| **P3 — Fix Next Cycle** | Minor severity in any category | Add to backlog, address in next pass |

### Tiebreaker Rules

When two issues share the same priority:

1. Fix the one closer to the top of the page first (above-fold issues beat below-fold)
2. Fix the one affecting more page types first
3. Fix the one with lower implementation effort first

---

# 5. Top 10 Common Failures

These are the most frequent audit failures across client and competitor sites. Check these first.

| # | Failure | Category | Severity | Fix |
|---|---|---|---|---|
| 1 | Hero headline says nothing specific | Messaging | Critical | Rewrite with outcome + audience + differentiator |
| 2 | No CTA visible above the fold | CTA | Critical | Add primary CTA to hero section |
| 3 | Trust signals buried below the fold | Trust | Critical | Move logos or testimonial snippet to trust strip |
| 4 | Competing CTAs in the same section | CTA | Major | Pick one primary, demote or remove others |
| 5 | Form uses placeholder text instead of labels | UX Friction | Critical | Add proper `<label>` elements |
| 6 | No FAQ section on service pages | AEO | Major | Add 5–7 objection-handling FAQs with direct answers |
| 7 | Missing or duplicate H1 tags | SEO | Critical | Ensure one H1 per page, keyword-informed |
| 8 | Layout shift on load (images without dimensions) | Performance | Major | Add explicit width/height to all images |
| 9 | Service page lists features without outcomes | Messaging | Major | Rewrite every feature as "you get X so that Y" |
| 10 | Contact page gives no indication of what happens next | UX Friction | Major | Add response timeline and process expectation |

---

# 6. Quick Triage (5-Minute Audit)

Use when you need a fast read on page quality without a full scoring pass.

### Triage Questions (answer Yes or No)

| # | Question | If No → |
|---|---|---|
| 1 | Can you tell what this page is about within 5 seconds? | Messaging failure — Critical |
| 2 | Is the primary CTA visible without scrolling? | CTA failure — Critical |
| 3 | Is there any trust signal in the first two screens? | Trust failure — Critical |
| 4 | Does the page have one clear primary action? | CTA failure — Major |
| 5 | Does the heading hierarchy make sense when read alone? | Hierarchy failure — Major |
| 6 | Does the page work on mobile without horizontal scrolling? | Mobile failure — Critical |
| 7 | Is there an FAQ or objection-handling section? | AEO / CRO failure — Major |
| 8 | Can you identify who this page is for within 10 seconds? | Messaging failure — Major |
| 9 | Are there specific numbers, results, or named testimonials? | Trust failure — Major |
| 10 | Does the page load without visible layout shifts? | Performance failure — Major |

### Triage Scoring

| Yes Count | Verdict |
|---|---|
| 10 | Likely strong — proceed to full audit for refinement |
| 7–9 | Decent foundation — full audit will surface specific improvements |
| 4–6 | Significant gaps — full audit required before launch |
| 0–3 | Structural problems — likely needs rebuild, not optimization |

---

# 7. Audit Worksheet

Copy and complete for each page audited.

```
PAGE AUDIT WORKSHEET

Page: [URL or page name]
Page Type: [Homepage / Landing / Service / Contact / Other]
Auditor: [Name or "Claude"]
Date: [YYYY-MM-DD]

─── CATEGORY SCORES ───

Messaging Clarity:        __ / 14
Hero Effectiveness:       __ / 12
CTA Clarity:              __ / 12
Trust and Proof:          __ / 10
Information Hierarchy:    __ / 10
UX Friction:              __ / 10
Mobile Responsiveness:    __ / 8
SEO Structure:            __ / 10
AEO Readiness:            __ / 8
Performance Readiness:    __ / 6

TOTAL:                    __ / 100
GRADE:                    [A / B / C / D / F]

─── FINDINGS ───

Critical Issues:
1. [Issue] — [Category] — [Fix]
2. ...

Major Issues:
1. [Issue] — [Category] — [Fix]
2. ...

Minor Issues:
1. [Issue] — [Category] — [Fix]
2. ...

─── PAGE-SPECIFIC CHECKS ───

[Complete the relevant page-specific checklist from §3]

─── PRIORITY ACTIONS ───

P0 (Fix Now):
1. ...

P1 (Fix This Sprint):
1. ...

P2 (Fix This Cycle):
1. ...

P3 (Fix Next Cycle):
1. ...
```

---

# 8. Final Report Template

Use this format for the complete audit deliverable. Claude should produce this at the end of any Optimization Mode audit.

```
CONVERSION AUDIT REPORT

Client: [Name]
Site: [URL]
Date: [YYYY-MM-DD]
Auditor: [Name or "Claude — Optimization Mode"]

═══════════════════════════════════════

EXECUTIVE SUMMARY

Overall Score: __ / 100 — Grade: [A/B/C/D/F]
Pages Audited: [count]
Critical Issues: [count]
Major Issues: [count]
Minor Issues: [count]
Launch Readiness: [Ready / Ready with caveats / Not ready / Requires rebuild]

Top 3 Issues:
1. [Issue + impact]
2. [Issue + impact]
3. [Issue + impact]

Top 3 Quick Wins:
1. [Fix + expected impact]
2. [Fix + expected impact]
3. [Fix + expected impact]

═══════════════════════════════════════

SCORE BREAKDOWN

| Category                | Score | Max | Notes |
|-------------------------|-------|-----|-------|
| Messaging Clarity       |       | 14  |       |
| Hero Effectiveness      |       | 12  |       |
| CTA Clarity             |       | 12  |       |
| Trust and Proof         |       | 10  |       |
| Information Hierarchy   |       | 10  |       |
| UX Friction             |       | 10  |       |
| Mobile Responsiveness   |       | 8   |       |
| SEO Structure           |       | 10  |       |
| AEO Readiness           |       | 8   |       |
| Performance Readiness   |       | 6   |       |
| **Total**               |       | 100 |       |

═══════════════════════════════════════

DETAILED FINDINGS

[Findings grouped by severity: Critical → Major → Minor]
[Each finding includes: issue, category, page, impact, specific fix]

═══════════════════════════════════════

PRIORITIZED ACTION PLAN

P0 — Fix Now (launch blockers):
1. [Action] — [Page] — [Expected impact]

P1 — Fix This Sprint:
1. [Action] — [Page] — [Expected impact]

P2 — Fix This Cycle:
1. [Action] — [Page] — [Expected impact]

P3 — Fix Next Cycle:
1. [Action] — [Page] — [Expected impact]

═══════════════════════════════════════

METRICS TO TRACK

- [Metric]: [Current] → [Target]
- [Metric]: [Current] → [Target]

═══════════════════════════════════════

AUDIT METHODOLOGY

Scored against AJ Digital Conversion Audit Checklist v1.0
Categories weighted by conversion impact.
Page-specific checks applied per page_blueprints.md.
Standards: CLAUDE.md, design_system.md, million_dollar_websites.md.
```

---

*Audit ruthlessly. Every point lost is a conversion leaked.*
