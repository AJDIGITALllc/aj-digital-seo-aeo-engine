# Execution Mode

**Repeatable, step-by-step execution system that transforms idea into live, optimized website.**

---

## Purpose

Define the operational engine that converts the Skill OS from documentation into structured execution. This file is the primary orchestration layer used by Claude Code, Anti-Gravity, and human operators.

---

## Scope

**Included:** Four execution modes (Research, Strategy, Build, Optimization), pipeline sequencing, decision rules for mode selection, iteration loops, success metrics, and enforcement rules.

**Not included:** Skill-level details (see `/skills/`), page-level structures (see `page_blueprints.md`), design tokens (see `design_system.md`), phase-level project management (see `workflow.md`).

---

## Core Principle

Execution must be:

- Repeatable
- Structured
- Prompt-driven
- Outcome-focused

Avoid improvisation when a system exists.

---

# 1. Execution Modes

Claude must operate in one of four modes. Claude should explicitly state which mode it is in when executing.

| Mode | Goal | Key Output |
|---|---|---|
| Research | Gather structured intelligence | Research summary with opportunity gaps |
| Strategy | Translate research into a build plan | Page map, funnel structure, messaging framework |
| Build | Produce actual pages and components | Production-ready sections following blueprints |
| Optimization | Improve performance, conversion, and visibility | Prioritized audit findings and fixes |

---

# 2. Research Mode

## Goal

Gather high-quality, structured intelligence that directly informs strategy and build decisions.

## Inputs

- Business type
- Audience
- Offer
- Competitors
- Target keywords (if known)

## Process

1. Run `/prompts/research/senior_research_prompt.md`
2. Extract:
   - competitor positioning
   - design patterns
   - content patterns
   - keyword clusters
   - user intent breakdown
3. Produce structured output

## Output Format

```
Market Overview
Competitor Analysis (comparison table)
User Intent Breakdown
Keyword Opportunities (table with volume, difficulty, intent, opportunity)
Positioning Gaps
Strategic Direction
```

---

# 3. Strategy Mode

## Goal

Translate research into a concrete build plan with page-level decisions.

## Inputs

- Research output (from Research Mode or existing knowledge)
- Business goals
- Offer definition

## Process

1. Define:
   - ICP (ideal customer profile)
   - Primary page types
   - Funnel structure
   - Conversion goals
2. Map pages using `/skills/web_building/page_blueprints.md`
3. Define:
   - Messaging hierarchy
   - CTA strategy
   - Trust strategy
   - Content depth per page

## Output Format

```
Business Summary
ICP Definition
Page Map (page type → blueprint → primary CTA)
Funnel Structure
Messaging Framework
CTA Strategy
Content Strategy
```

---

# 4. Build Mode

## Goal

Produce actual website pages and components that meet AJ Digital quality standards.

## Inputs

- Strategy output
- Selected page blueprint

## Process

1. Select blueprint from `/skills/web_building/page_blueprints.md`
2. Apply design rules from `/skills/web_building/design_system.md`
3. Apply strategic rules from `/skills/web_building/million_dollar_websites.md`
4. Generate components using `/skills/web_building/claude_templates.md`
5. If UI generation is needed, use `/skills/web_building/anti_gravity_prompts.md`
6. Validate:
   - 8pt spacing consistency
   - Golden ratio typography hierarchy
   - Clear CTA flow
   - Mobile-first responsiveness
   - Semantic HTML structure
   - Accessibility (WCAG 2.1 AA)

## Output Format

```
Page: [Page Name]
Blueprint: [Selected blueprint]
Section 1: Hero
Section 2: [Name]
...
Final CTA
---
Notes:
- Assumptions made
- Deviations from blueprint (with rationale)
```

---

# 5. Optimization Mode

## Goal

Improve performance, conversion, and visibility of existing pages.

## Inputs

- Existing page (URL or code)
- Analytics (if available)
- User behavior insights (if available)

## Process

1. Run `/prompts/audit/website_audit_prompt.md`
2. Evaluate:
   - CRO (conversion clarity, CTA effectiveness, trust placement)
   - SEO structure (meta, headings, schema, internal links)
   - AEO readiness (direct answers, FAQ schema, entity definition)
   - Performance metrics (LCP, INP, CLS, page weight)
   - UX friction (navigation, forms, mobile experience)
3. Identify bottlenecks, weak sections, and missed opportunities
4. Recommend specific, prioritized changes

## Output Format

```
Audit Summary
Conversion Issues (severity-ranked)
SEO / AEO Issues (severity-ranked)
UX Issues (severity-ranked)
Performance Issues (with target metrics)
Recommended Fixes (prioritized by impact)
```

---

# 6. Execution Pipelines

## Full Pipeline (Standard)

Use for new projects, new markets, or unclear positioning.

```
Research Mode → Strategy Mode → Build Mode → Optimization Mode
```

## Short Loop (Fast Execution)

Use for known niches, repeatable offers, or similar previous builds.

```
Strategy Mode → Build Mode → Optimization Mode
```

## Decision Rules

| Condition | Pipeline |
|---|---|
| New project, new market | Full pipeline |
| Unclear positioning or audience | Full pipeline |
| Known niche, clear offer | Short loop |
| Repeatable build from existing pattern | Short loop |
| Existing site needs improvement | Optimization Mode only |

---

# 7. Iteration Loop

After launch:

1. **Collect:** User behavior, conversion data, SEO performance, AI citation data
2. **Re-enter:** Optimization Mode
3. **Apply:** Prioritized improvements
4. **Repeat:** On a regular cadence (monthly minimum)

---

# 8. Success Metrics

### Conversion

- CTA click rate
- Form submissions
- Booked calls / qualified inquiries

### SEO

- Keyword rankings
- Impressions
- Organic traffic growth

### AEO

- AI citations
- Featured snippets
- Structured answer extraction

### Performance

- LCP < 2.5s
- INP < 200ms
- CLS < 0.1

---

# 9. Failure Conditions

Stop and re-evaluate if:

- Page lacks clear intent
- CTA is unclear or weak
- Structure does not match blueprint
- Spacing is inconsistent (non-8pt values)
- Content is generic or vague
- No proof or trust signals exist
- Performance targets are missed

---

# 10. Claude Enforcement Rules

Claude must:

1. **Declare mode** before starting execution
2. **Follow mode-specific process** — do not skip steps without justification
3. **Reference relevant skill files** — load them, do not build from memory
4. **Validate output** against the quality standards in `CLAUDE.md` and `design_system.md`
5. **Maintain consistency** across all outputs within a session
6. **Flag gaps** when skill docs do not cover a required decision

---

# 11. Example Usage

**Prompt:** "Build a homepage for a podcast production agency targeting creators and brands."

**Expected Claude behavior:**

```
Mode: Strategy → Build (short loop — known niche)

1. [Strategy output: ICP, page map, messaging framework, CTA strategy]
2. [Homepage build using Homepage Blueprint from page_blueprints.md]
3. [Sections built in blueprint order, design system applied]
4. [Notes: assumptions, deviations, validation results]
```

---

*Every build should feel intentional, structured, premium, conversion-focused, and AI-optimized.*
