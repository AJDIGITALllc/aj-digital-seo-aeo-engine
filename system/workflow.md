# Workflow

**End-to-end process for producing premium digital products at AJ Digital LLC.**

---

## Overview

Every project follows a structured pipeline of nine phases. Phases are sequential but iterative — you can loop back to any earlier phase when new information surfaces.

```
Research → Synthesis → Skill Creation → Template Creation → Build Execution → UI Generation → QA → Iteration → Deployment
```

Skipping phases creates quality debt. The process exists to prevent it.

---

## Phase 1: Research

**Objective:** Gather all information needed to make informed decisions.

**Activities:**
- Competitive analysis: audit 5–10 competitors/comparables for design, messaging, CRO patterns, SEO structure
- Audience research: identify target personas, their pain points, language patterns, objections
- Technical requirements: platform constraints, integrations, performance targets, accessibility needs
- Business context: revenue model, conversion goals, brand positioning, market differentiators
- SEO/AEO landscape: target keywords, search intent mapping, AI search result patterns

**Output:** Research synthesis document with findings organized by category.

**Prompt:** Use `/prompts/research/senior_research_prompt.md` for structured deep research.

**Quality gate:** Research is complete when you can answer:
1. Who is the target user?
2. What action do we want them to take?
3. What objections will they have?
4. How do competitors handle this?
5. What search queries bring people to this type of page?

---

## Phase 2: Synthesis

**Objective:** Distill research into actionable strategic decisions.

**Activities:**
- Define the page/site information architecture
- Establish the messaging hierarchy (what's said first, second, third)
- Select CRO patterns appropriate for the audience and goal
- Map the conversion funnel: awareness → consideration → decision → action
- Define content requirements per section
- Identify technical approach and component needs

**Output:** Project strategy brief containing:
- Site map or page structure
- Messaging framework (headlines, value props, proof points)
- Conversion strategy (CTA placement, trust signals, objection handling)
- Technical architecture decisions
- SEO/AEO content strategy

**Quality gate:** Strategy is complete when every section on the page has a defined purpose, message, and success metric.

---

## Phase 3: Skill Creation

**Objective:** Codify any new learnings or patterns into reusable skill docs.

**Activities:**
- Review existing skill docs — does the current knowledge cover this project's needs?
- If gaps exist, create new skill content or update existing files
- If a new pattern was discovered during research (e.g., a CRO technique, a layout pattern), document it
- Ensure new skill content follows `/system/standards.md`

**Output:** Updated or new skill files in `/skills/`.

**When to skip:** If existing skill docs fully cover the project's needs, move to Phase 4. Do not create skill docs for the sake of creating them.

**Quality gate:** Any new person reading the updated skill docs can execute the same strategy without the original researcher's involvement.

---

## Phase 4: Template Creation

**Objective:** Build or select structural scaffolds for the build phase.

**Activities:**
- Check `/templates/` for existing templates that match the project type
- If a matching template exists, customize it for the project's specific needs
- If no template exists, create one following the patterns in `/templates/`
- Ensure the template references the correct skill docs and design system rules

**Output:** A ready-to-execute template that defines:
- Component structure and hierarchy
- Content slots and required content types
- Design system tokens to apply
- Responsive behavior expectations
- Performance and accessibility requirements

**Quality gate:** The template is specific enough that Claude Code or Anti-Gravity can produce a first draft without additional clarification.

---

## Phase 5: Build Execution (Claude Code)

**Objective:** Generate production-quality code using AI-assisted development.

**Activities:**
- Load `CLAUDE.md` as the behavioral contract
- Load relevant skill docs into context
- Feed the project template and strategy brief
- Build section by section, validating each against the design system
- Apply component patterns from `/skills/web_building/claude_templates.md`

**Implementation order:**
1. Layout structure and responsive grid
2. Typography and color system (design tokens)
3. Hero section — sets the visual tone
4. Navigation and footer — structural bookends
5. Content sections — in order of conversion priority
6. Interactive elements — forms, accordions, modals
7. Performance optimization — image handling, code splitting, lazy loading
8. SEO implementation — meta tags, schema markup, semantic HTML
9. Accessibility pass — keyboard nav, screen reader testing, contrast checks

**Output:** Functional, styled, responsive code that meets all CLAUDE.md standards.

**Quality gate:** Every component passes the checklist in `CLAUDE.md` Section 10 ("Reject Low-Quality Output").

---

## Phase 6: UI Generation (Anti-Gravity)

**Objective:** Generate or refine visual UI using Anti-Gravity's design generation capabilities.

**Activities:**
- Use prompts from `/skills/web_building/anti_gravity_prompts.md`
- Apply the template from `/templates/anti_gravity/site_generation_template.md`
- Generate UI that matches the design system specifications
- Ensure generated output aligns with the project's brand guidelines
- Export assets at correct resolutions and formats

**Output:** Visual UI components, layouts, or full page designs ready for integration.

**When to use:** Anti-Gravity is used when visual design exploration is needed before or alongside code generation. Not every project requires this phase.

**Quality gate:** Generated UI aligns with design system rules, brand guidelines, and conversion strategy.

---

## Phase 7: QA

**Objective:** Validate the build against all quality standards.

**QA checklist:**

### Performance
- [ ] LCP < 2.5 seconds
- [ ] FID < 100ms
- [ ] CLS < 0.1
- [ ] Page weight < 500KB initial load
- [ ] All images optimized (WebP/AVIF, lazy loaded, dimensioned)
- [ ] No render-blocking resources

### Accessibility
- [ ] WCAG 2.1 AA compliant
- [ ] Keyboard navigation works on all interactive elements
- [ ] Screen reader announces content correctly
- [ ] Color contrast meets minimum ratios
- [ ] Touch targets ≥ 44×44px

### SEO
- [ ] One H1 per page, keyword-informed
- [ ] Meta title < 60 chars, meta description < 155 chars
- [ ] Schema markup (JSON-LD) present and valid
- [ ] Semantic HTML used throughout
- [ ] Internal links have descriptive anchor text

### AEO
- [ ] FAQ schema on relevant pages
- [ ] Question-answer content structure present
- [ ] Concise, extractable statements for AI search

### CRO
- [ ] Primary CTA visible above the fold
- [ ] Trust signals present near conversion points
- [ ] Form fields minimized
- [ ] Objection handling content placed before CTAs
- [ ] Clear visual hierarchy guides the eye to primary action

### Design System
- [ ] All spacing values are multiples of 8
- [ ] Typography follows the defined scale
- [ ] Colors match the approved palette
- [ ] Components are responsive at all breakpoints
- [ ] No hardcoded values — all use design tokens

**Prompt:** Use `/prompts/audit/website_audit_prompt.md` for structured QA.

**Quality gate:** All checklist items pass. No exceptions for launch.

---

## Phase 8: Iteration

**Objective:** Address QA findings and refine based on feedback.

**Activities:**
- Triage QA findings by severity: critical (blocks launch) → major (degrades quality) → minor (polish)
- Fix critical issues immediately
- Batch major issues into a focused revision sprint
- Log minor issues for post-launch iteration
- Re-run QA on fixed areas

**Output:** A build that passes all QA gates.

**Iteration limit:** Maximum 3 iteration cycles per project phase. If issues persist after 3 cycles, the problem is architectural and needs a strategy review (return to Phase 2).

---

## Phase 9: Deployment Mindset

**Objective:** Prepare the build for production with a focus on reliability and observability.

**Activities:**
- Environment configuration: production environment variables, API keys, CDN settings
- Monitoring setup: error tracking (Sentry or similar), uptime monitoring, performance monitoring
- Analytics: conversion tracking, event tracking, goal funnels
- SEO: XML sitemap, robots.txt, Google Search Console verification
- Security: HTTPS enforced, headers configured (CSP, HSTS, X-Frame-Options), dependencies audited
- Backup: Ensure rollback capability (Vercel instant rollback or equivalent)
- Documentation: Client-facing handoff document with access credentials and maintenance notes

**This phase is a mindset, not just a checklist.** The question is always: "If this breaks at 2 AM, can we recover quickly and know what happened?"

**Quality gate:** Site is live, monitored, and the team has clear ownership of ongoing maintenance.

---

## Workflow Summary

| Phase             | Input                        | Output                          | Tools                         |
|-------------------|------------------------------|---------------------------------|-------------------------------|
| Research          | Business brief               | Research synthesis              | Research prompt               |
| Synthesis         | Research synthesis            | Strategy brief                  | Human judgment                |
| Skill Creation    | Gaps identified              | Updated skill docs              | Standards reference           |
| Template Creation | Strategy brief               | Build template                  | Template library              |
| Build Execution   | Template + skill docs        | Production code                 | Claude Code + CLAUDE.md       |
| UI Generation     | Design requirements          | Visual UI                       | Anti-Gravity + prompts        |
| QA                | Built product                | QA report                       | Audit prompt                  |
| Iteration         | QA findings                  | Refined product                 | Build tools                   |
| Deployment        | Validated build              | Live product                    | Hosting platform              |

---

*This workflow is the backbone of every project. Follow it, and the quality takes care of itself.*
