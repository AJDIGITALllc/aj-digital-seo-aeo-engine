# Client Delivery Pipeline

**End-to-end client delivery workflow for AJ Digital — from first contact through post-launch optimization and retention.**

---

## Purpose

Define the operational pipeline that governs how AJ Digital takes a client from lead to live product to ongoing value. This is the project-level orchestration layer that sits above execution modes and skill docs, ensuring every client engagement follows a repeatable, quality-controlled process.

This file is the source of truth for:

- What happens at each phase of a client project
- Who owns each phase
- What must be true before moving forward
- What artifacts get produced
- Where the Skill OS files plug in

---

## Scope

**Included:** 12-phase delivery pipeline, standard and fast-track flows, revision control, communication checkpoints, deliverables matrix, artifact recommendations.

**Not included:** Execution-level details for Research/Strategy/Build/Optimization (see `/system/execution_mode.md`), page-level structures (see `/skills/web_building/page_blueprints.md`), scoring frameworks (see `/skills/web_building/conversion_audit_checklist.md`).

---

## Alignment

This pipeline connects to the Skill OS at every phase:

| Skill OS File | Role in Pipeline |
|---|---|
| `/templates/_project_brief.md` | Produced in Phase 4, consumed by all subsequent phases |
| `/system/execution_mode.md` | Governs Phases 5–8 and Phase 11 |
| `/skills/web_building/page_blueprints.md` | Blueprint selection happens in Phase 6, validated in Phase 8 |
| `/skills/web_building/conversion_audit_checklist.md` | Scoring framework for Phase 8 (QA/Audit) and Phase 11 (Post-Launch) |
| `/CLAUDE.md` | Behavioral contract enforced during Phases 7–8 |
| `/system/workflow.md` | Technical execution steps within Phases 5–8 |
| `/prompts/research/senior_research_prompt.md` | Used in Phase 5 |
| `/prompts/audit/website_audit_prompt.md` | Used in Phase 8 and Phase 11 |
| `/skills/sales/offer_architecture.md` | Tier definitions and scope rules consumed in Phases 2–4 |

---

# Pipeline Overview

```
Lead Intake → Qualification → Discovery → Brief Creation → Research → Strategy → Build → QA/Audit → Client Review → Launch → Post-Launch Optimization → Handoff/Retention
     1              2             3            4              5          6         7        8             9           10              11                      12
```

---

# Phase 1: Lead Intake

## Objective

Capture and organize every inbound lead with enough context to make a qualification decision.

## Inputs

- Inbound inquiry (form submission, email, referral, DM, call)
- Any assets the lead shares (current site, brief, RFP)

## Outputs

- Lead record (name, business, contact info, source, initial request, date)
- Initial categorization (project type: new build / redesign / optimization / other)

## Owner

**AJ Digital — Sales/Operations**

## Key Decisions

- Is this a web project or something outside scope?
- Is there enough information to qualify, or do we need a response to gather more?

## Failure Risks

- Lead falls through the cracks — no CRM entry, no follow-up
- Slow response time — lead goes cold (target: respond within 4 business hours)
- Misclassifying the project type — wastes time in later phases

## Exit Criteria

- Lead is logged with complete contact info
- Project type is tagged
- Response sent within 4 business hours acknowledging receipt
- Lead is routed to qualification

---

# Phase 2: Qualification

## Objective

Determine whether this lead is a fit for AJ Digital's services, pricing, and timeline — before investing discovery time.

## Inputs

- Lead record from Phase 1
- Any publicly available information (website, LinkedIn, social presence)

## Outputs

- Qualified / Not Qualified decision
- If qualified: scheduled discovery call
- If not qualified: polite decline with optional referral

## Owner

**AJ Digital — Sales/Operations**

## Key Decisions

- Does this lead match our ICP (business type, budget range, project scope)?
- Is the timeline realistic?
- Is the decision-maker accessible?
- Can we deliver meaningful ROI for this client?

## Qualification Criteria

| Factor | Minimum Threshold |
|---|---|
| Budget | Meets project minimum (defined per service tier) |
| Timeline | At least 4 weeks for standard builds |
| Decision-maker | Direct access or one layer removed |
| Project type | Within AJ Digital's service scope |
| Growth potential | Retention or upsell opportunity exists |

## Failure Risks

- Taking on underqualified leads — scope creep, payment issues, misaligned expectations
- Over-qualifying — rejecting good projects based on surface-level signals
- No follow-up after qualification — qualified lead goes cold

## Exit Criteria

- Go/no-go decision is documented
- If qualified: discovery call is scheduled within 5 business days
- If not qualified: decline sent with reasoning (internal) and grace (external)

---

# Phase 3: Discovery

## Objective

Gather deep business context, goals, constraints, audience understanding, and competitive landscape directly from the client.

## Inputs

- Qualification data from Phase 2
- Pre-discovery questionnaire (sent before the call)
- Client's existing assets (current site, brand guidelines, analytics access)

## Outputs

- Discovery notes (structured)
- Completed or near-complete project brief draft
- Preliminary scope understanding
- Identified risks and open questions

## Owner

**AJ Digital — Strategy Lead**

## Key Decisions

- What is the client's real business goal (not just "I need a website")?
- Who is the actual target audience and what triggers their buying decision?
- What does success look like in 90 days? 6 months?
- What are the non-negotiable constraints (budget, timeline, tech stack, brand)?
- Are there internal stakeholders who need to approve deliverables?

## Discovery Call Structure

1. **Business context** — what they do, for whom, how they make money
2. **Current state** — what's working, what isn't, why now
3. **Goals** — primary conversion action, secondary goals, success metrics
4. **Audience** — who buys, who influences, what language they use
5. **Competitors** — who they lose to, who they admire, what they want to differentiate from
6. **Constraints** — budget range, timeline, approvals, technical limitations
7. **Content** — do they have copy, photos, testimonials, case studies
8. **Next steps** — what happens after this call, when they'll see a proposal

## Failure Risks

- Client can't articulate their goals — discovery notes are vague
- Skipping discovery and going straight to proposal — leads to scope misalignment
- Not identifying the actual decision-maker — delays and reversals later
- Missing technical constraints — rework during build

## Exit Criteria

- Discovery notes are documented and organized
- All sections of the project brief draft can be populated (even if some are "TBD — needs research")
- Client has confirmed goals, audience, and constraints verbally
- Open questions are logged with a plan to resolve them

---

# Phase 4: Project Brief Creation

## Objective

Produce a completed, client-approved project brief that becomes the single source of truth for all downstream work.

## Inputs

- Discovery notes from Phase 3
- Client's existing assets and brand materials
- Any preliminary research

## Outputs

- Completed `/templates/_project_brief.md` (all 10 sections filled)
- Client-facing scope summary (derived from the brief)
- Signed agreement / SOW

## Owner

**AJ Digital — Strategy Lead** (brief creation)
**AJ Digital — Operations** (SOW/contract)

## Key Decisions

- Is the brief complete enough to begin research and strategy without guessing?
- Does the client agree with the goals, audience, and scope as documented?
- Are payment terms and revision limits defined in the SOW?

## Process

1. Transfer discovery notes into `/templates/_project_brief.md` §1–§10
2. Fill gaps with reasonable defaults, flagged as assumptions
3. Present brief to client for review and approval
4. Lock the brief — changes after approval follow revision control rules (see §14)
5. Generate SOW from brief scope (pages, features, timeline, price, revision rounds)
6. Get SOW signed before proceeding to Phase 5

## Failure Risks

- Brief is incomplete — downstream phases operate on assumptions
- Client doesn't review the brief — misalignment surfaces during build
- No signed SOW — scope creep has no boundary

## Exit Criteria

- All 10 sections of the project brief are filled (no `[BRACKET]` placeholders remain)
- Client has reviewed and approved the brief (email confirmation minimum)
- SOW is signed with defined scope, timeline, price, and revision rounds
- Brief is stored in the project folder as the canonical reference

---

# Phase 5: Research

## Objective

Gather structured market, competitor, audience, and SEO intelligence that directly informs strategy decisions.

## Inputs

- Completed project brief (Phase 4 output)
- Client-provided competitor list and keyword targets (§6, §7 of brief)

## Outputs

- Research summary document (structured per Research Mode output format)
- Competitor analysis table
- Keyword opportunity matrix
- Audience intent breakdown
- Positioning gaps identified

## Owner

**AJ Digital — Strategy Lead** (with Claude in Research Mode)

## Skill OS Integration

| Action | File |
|---|---|
| Enter Research Mode | `/system/execution_mode.md` §2 |
| Run research prompt | `/prompts/research/senior_research_prompt.md` |
| Source inputs from brief | `/templates/_project_brief.md` §1, §2, §6, §7 |

## Key Decisions

- Is the market well-understood or does it require deep research?
- Are there competitor patterns we should adopt or deliberately avoid?
- What search intent clusters should the site target?
- Are there AEO opportunities (AI-generated answer positioning)?

## Failure Risks

- Superficial research — strategy is built on assumptions instead of evidence
- Research paralysis — over-researching delays the project
- Ignoring AEO — missing AI search optimization opportunities

## Exit Criteria

- Research document exists with all sections populated
- Competitor comparison table has 5+ entries with positioning, design, CRO analysis
- Keyword opportunity matrix has volume, difficulty, intent, and opportunity columns
- Strategy lead can articulate the positioning direction based on research

---

# Phase 6: Strategy

## Objective

Translate research into a concrete build plan with page-level decisions, messaging framework, and conversion strategy.

## Inputs

- Research output (Phase 5)
- Completed project brief (Phase 4)

## Outputs

- Page map (page type → blueprint → primary CTA)
- Funnel structure
- Messaging framework (headline hierarchy, value props, proof points)
- CTA strategy (per page and per section)
- Content requirements list
- Technical architecture decisions

## Owner

**AJ Digital — Strategy Lead** (with Claude in Strategy Mode)

## Skill OS Integration

| Action | File |
|---|---|
| Enter Strategy Mode | `/system/execution_mode.md` §3 |
| Select page blueprints | `/skills/web_building/page_blueprints.md` |
| Source goals from brief | `/templates/_project_brief.md` §3, §4, §5 |
| Apply CRO frameworks | `/skills/web_building/million_dollar_websites.md` |

## Key Decisions

- Which page blueprints match this project's needs?
- What is the primary conversion path (visitor → lead → customer)?
- What messaging order maximizes conversion at each funnel stage?
- What trust strategy is appropriate for this audience?
- How deep should content go on each page?

## Failure Risks

- Strategy is disconnected from research — decisions aren't evidence-based
- Too many pages planned — scope exceeds budget/timeline
- Messaging is generic — doesn't differentiate from competitors
- No CTA strategy — pages are informational but don't convert

## Exit Criteria

- Page map is finalized with blueprint selection for each page
- Messaging framework is documented (not just in someone's head)
- CTA strategy is mapped per page with primary and secondary actions
- Client has reviewed the strategy summary and approved the direction
- Content requirements are listed (what copy, images, testimonials, case studies are needed)

---

# Phase 7: Build

## Objective

Produce production-ready pages and components that meet AJ Digital quality standards, following the approved strategy and blueprints.

## Inputs

- Strategy output (Phase 6)
- Selected page blueprints
- Completed project brief
- Client-provided content (copy, images, testimonials)

## Outputs

- Functional, styled, responsive pages
- All components built to CLAUDE.md standards
- SEO implementation (meta, schema, semantic HTML)
- Accessibility baseline (WCAG 2.1 AA)

## Owner

**AJ Digital — Build Lead** (with Claude in Build Mode)

## Skill OS Integration

| Action | File |
|---|---|
| Enter Build Mode | `/system/execution_mode.md` §4 |
| Follow build order | `/system/workflow.md` Phase 5 implementation order |
| Enforce quality contract | `/CLAUDE.md` |
| Apply design tokens | `/skills/web_building/design_system.md` |
| Use page blueprints | `/skills/web_building/page_blueprints.md` |
| Generate components | `/skills/web_building/claude_templates.md` |
| Generate UI (if needed) | `/skills/web_building/anti_gravity_prompts.md` |
| Use build template | `/templates/claude/site_build_template.md` |
| Use UI template (if needed) | `/templates/anti_gravity/site_generation_template.md` |

## Key Decisions

- Build section by section or page by page?
- Is client-provided content ready, or do we need placeholder copy?
- Which components need custom builds vs. blueprint defaults?
- Does this project need Anti-Gravity UI generation?

## Failure Risks

- Building without approved strategy — rework when direction changes
- Waiting for client content — build stalls
- Ignoring CLAUDE.md standards — low-quality output passes through
- Not building mobile-first — responsive retrofit is expensive

## Exit Criteria

- All pages in the page map are built
- Every component passes CLAUDE.md §10 quality checks
- No placeholder content in production pages (unless explicitly flagged as client-pending)
- Code is committed and deployed to staging/preview environment
- Build is ready for QA

---

# Phase 8: QA / Audit

## Objective

Validate the build against all performance, conversion, SEO, accessibility, and design standards before showing the client.

## Inputs

- Built pages (Phase 7 output, deployed to staging)
- Strategy document (for validating messaging alignment)
- Page blueprints (for validating structural compliance)

## Outputs

- Completed audit scorecard (per `/skills/web_building/conversion_audit_checklist.md`)
- Issue list with severity rankings (P0–P3)
- Fix log (what was found, what was fixed, what remains)

## Owner

**AJ Digital — QA Lead** (with Claude in Optimization Mode)

## Skill OS Integration

| Action | File |
|---|---|
| Enter Optimization Mode | `/system/execution_mode.md` §5 |
| Run audit checklist | `/skills/web_building/conversion_audit_checklist.md` |
| Run full audit prompt | `/prompts/audit/website_audit_prompt.md` |
| Validate against contract | `/CLAUDE.md` |
| Check design compliance | `/skills/web_building/design_system.md` |
| Check performance targets | `/CLAUDE.md` §6 (LCP < 2.5s, INP < 200ms, CLS < 0.1) |

## Key Decisions

- Does the build score ≥ 85/100 on the conversion audit checklist?
- Are all P0 and P1 issues resolved before client review?
- Is performance within target thresholds?
- Are accessibility requirements met?

## QA Pass Sequence

1. **Functional pass** — all links work, forms submit, interactions behave correctly
2. **Design pass** — spacing, typography, color, layout match design system
3. **Content pass** — no typos, placeholder text, or missing images
4. **Performance pass** — Core Web Vitals within targets
5. **Accessibility pass** — keyboard nav, screen reader, contrast, touch targets
6. **SEO pass** — meta tags, schema, headings, internal links
7. **Conversion pass** — CTA clarity, trust placement, objection handling, funnel flow
8. **Cross-browser/device pass** — Chrome, Safari, Firefox, Edge + mobile devices

## Failure Risks

- Rushing QA to meet timeline — bugs reach the client
- Only checking functionality, not conversion quality — site works but doesn't convert
- No structured checklist — QA is ad hoc and inconsistent
- Skipping mobile testing — majority of traffic is mobile

## Exit Criteria

- Audit scorecard is completed with a score of ≥ 85/100
- All P0 issues are resolved (zero remaining)
- All P1 issues are resolved or have documented mitigation plans
- Fix log is documented
- Staging URL is ready for client review

---

# Phase 9: Client Review

## Objective

Present the build to the client, collect structured feedback, and manage revisions within the agreed scope.

## Inputs

- Staging URL (from Phase 8)
- Audit scorecard and fix log
- Strategy summary (reminder of what was agreed)
- SOW revision terms

## Outputs

- Client feedback (structured, not ad hoc)
- Revision list (categorized as in-scope or out-of-scope)
- Approved final version (or next revision round)

## Owner

**AJ Digital — Project Lead**

## Key Decisions

- Is client feedback within the agreed revision scope?
- Are any requested changes strategic pivots (requiring return to Phase 6)?
- How many revision rounds remain per the SOW?

## Review Process

1. **Presentation call** — walk the client through the site, explain decisions, show mobile/desktop
2. **Feedback window** — give the client 3–5 business days to consolidate all feedback
3. **Feedback format** — request organized, page-by-page feedback (not scattered emails)
4. **Categorization** — tag each item as: in-scope fix / enhancement / out-of-scope change request
5. **Revision execution** — apply in-scope changes, quote out-of-scope separately
6. **Re-review** — if substantive changes were made, allow one focused re-review
7. **Sign-off** — client confirms approval in writing (email minimum)

## Revision Control Rules

See §14 (Revision Control Rules) for the full revision framework.

## Failure Risks

- Client gives feedback in dribs and drabs — revision rounds never close
- Feedback is design-by-committee — contradictory requests
- No written sign-off — client claims post-launch that they never approved
- Scope creep disguised as revisions — new pages, new features, new strategy

## Exit Criteria

- Client has provided consolidated feedback
- All in-scope revisions are applied
- Client has given written approval to launch
- Any out-of-scope requests are quoted and agreed upon (or deferred to Phase 11)

---

# Phase 10: Launch

## Objective

Deploy the approved site to production with zero downtime and verified functionality.

## Inputs

- Client-approved build (Phase 9 output)
- Production hosting environment
- Domain and DNS access
- Analytics and tracking setup
- Client's go-live confirmation

## Outputs

- Live production site
- Verified deployment (all pages load, forms work, tracking fires)
- Launch checklist completed
- Client notified

## Owner

**AJ Digital — Build Lead**

## Launch Checklist

### Pre-Launch

- [ ] Production environment is provisioned and configured
- [ ] SSL certificate is active
- [ ] Domain DNS is pointed (or scheduled for cutover)
- [ ] Redirects are configured (if redesign)
- [ ] Analytics installed and verified (events, goals, conversions)
- [ ] Search Console is set up and sitemap submitted
- [ ] Social preview metadata (OG tags) verified
- [ ] Forms tested in production (submissions reach the correct destination)
- [ ] Third-party integrations verified (CRM, email, chat, scheduling)
- [ ] Backup of old site (if redesign)
- [ ] Cache and CDN configured
- [ ] robots.txt reviewed

### Post-Deploy

- [ ] All pages load correctly on production URL
- [ ] SSL shows no mixed content warnings
- [ ] Forms submit successfully
- [ ] Analytics data is flowing
- [ ] Core Web Vitals pass on production (re-test, not just staging)
- [ ] Mobile spot-check on real device
- [ ] Client is notified and given access credentials

## Failure Risks

- DNS misconfiguration — site is unreachable
- Missing redirects — SEO value destroyed on redesigns
- Analytics not firing — no data for optimization
- Launching on Friday — issues discovered over the weekend with no support

## Exit Criteria

- Site is live on production URL
- All launch checklist items are verified
- Client is notified and has confirmed the site is live
- Analytics is confirmed receiving data
- Launch date is recorded for 30-day optimization trigger

---

# Phase 11: Post-Launch Optimization

## Objective

Monitor performance, collect real-world data, and make evidence-based improvements that increase conversion, traffic, and engagement.

## Inputs

- Live site (Phase 10)
- Analytics data (minimum 2 weeks of clean data)
- Search Console data
- User behavior data (heatmaps, session recordings if available)
- Client feedback and support requests

## Outputs

- 30-day performance report
- Optimization recommendations (prioritized)
- Implemented quick wins
- Ongoing optimization plan (if retained)

## Owner

**AJ Digital — Strategy Lead** (with Claude in Optimization Mode)

## Skill OS Integration

| Action | File |
|---|---|
| Enter Optimization Mode | `/system/execution_mode.md` §5 |
| Run conversion audit | `/skills/web_building/conversion_audit_checklist.md` |
| Run full audit prompt | `/prompts/audit/website_audit_prompt.md` |
| Apply CRO frameworks | `/skills/web_building/million_dollar_websites.md` |

## Optimization Cadence

| Timeframe | Action |
|---|---|
| Week 1 | Monitor for launch issues, verify tracking, fix any P0 bugs |
| Week 2–3 | Begin collecting behavioral data |
| Day 30 | First performance report — compare to brief §3 success metrics |
| Monthly | Ongoing review if on retainer — conversion, traffic, ranking trends |
| Quarterly | Strategy review — are business goals being met? Pivot if needed |

## Key Decisions

- Is the site meeting the success metrics defined in the project brief §3?
- What are the highest-impact changes based on real data?
- Does the client want ongoing optimization (retainer) or a one-time handoff?

## Failure Risks

- No post-launch monitoring — issues go undetected
- Optimizing without data — changes based on opinion, not evidence
- Client disengages — site stagnates after launch
- Not comparing to baseline — impossible to prove ROI

## Exit Criteria

- 30-day report is delivered to the client
- Quick wins are implemented (if within scope)
- Ongoing optimization plan is proposed (if retainer opportunity exists)
- Performance is benchmarked against project brief §3 success metrics

---

# Phase 12: Handoff / Retention

## Objective

Either transition the project cleanly to the client (handoff) or convert it into an ongoing relationship (retention).

## Inputs

- 30-day performance report (Phase 11)
- Client satisfaction signal
- Retention opportunity assessment

## Outputs

**If Handoff:**
- Access credentials document (hosting, CMS, DNS, analytics, integrations)
- Maintenance guide (how to update content, what not to touch)
- Training session (if applicable)
- Final invoice and project closure confirmation

**If Retention:**
- Retainer proposal (scope, cadence, deliverables, price)
- Ongoing optimization roadmap
- Communication rhythm established

## Owner

**AJ Digital — Operations + Strategy Lead**

## Key Decisions

- Is there genuine ongoing value we can deliver, or is a clean handoff better?
- Does the client have the capability to maintain the site independently?
- What retainer model fits — monthly hours, monthly deliverables, or performance-based?

## Retention Signals

| Signal | Interpretation |
|---|---|
| Client asks "what's next?" | High retention potential — propose retainer |
| Site is meeting metrics | Leverage success to propose scaling (new pages, new funnels) |
| Client is hands-off | They need ongoing management — position retainer as essential |
| Client has internal team | Handoff is clean — offer quarterly check-ins instead |
| Multiple stakeholders engaged | Complex org = retainer for ongoing coordination |

## Failure Risks

- Ghosting after launch — no closure, no referral, no retention
- Sloppy handoff — client can't access their own site
- No maintenance documentation — client breaks things and blames you
- Not asking for referral — missing easy business development

## Exit Criteria

**Handoff:**
- All access credentials are transferred
- Maintenance guide is delivered
- Client confirms they can access and manage the site
- Final invoice is paid
- Testimonial or referral is requested

**Retention:**
- Retainer agreement is signed
- First optimization cycle is scheduled
- Communication rhythm is established

---

# 13. Project Flow Diagrams

## Standard Flow

For new clients, unclear positioning, or complex projects.

```
Phase 1: Lead Intake
    ↓
Phase 2: Qualification ── [Not Qualified] → Polite Decline
    ↓ [Qualified]
Phase 3: Discovery
    ↓
Phase 4: Brief Creation ── [SOW Signed]
    ↓
Phase 5: Research ────────── (Execution Mode: Research)
    ↓
Phase 6: Strategy ────────── (Execution Mode: Strategy)
    ↓
Phase 7: Build ───────────── (Execution Mode: Build)
    ↓
Phase 8: QA / Audit ──────── (Execution Mode: Optimization)
    ↓
Phase 9: Client Review ── [Revisions needed] → Loop to Phase 7–8
    ↓ [Approved]
Phase 10: Launch
    ↓
Phase 11: Post-Launch Optimization
    ↓
Phase 12: Handoff / Retention
```

## Fast-Track Flow

For repeat clients, known niches, or smaller-scope projects where research and deep discovery are not needed.

```
Phase 1: Lead Intake
    ↓
Phase 2: Qualification ── [Fast-Track Eligible]
    ↓
Phase 3+4: Combined Discovery & Brief ── [Abbreviated — 1 call + brief]
    ↓
Phase 6: Strategy ── [Skip Research — use existing knowledge]
    ↓
Phase 7: Build
    ↓
Phase 8: QA / Audit ── [Abbreviated — focus on P0/P1 only]
    ↓
Phase 9: Client Review ── [1 revision round]
    ↓
Phase 10: Launch
    ↓
Phase 12: Handoff / Retention ── [Skip extended optimization unless retained]
```

### Fast-Track Eligibility

| Criteria | Requirement |
|---|---|
| Client relationship | Existing client or strong referral |
| Niche familiarity | AJ Digital has built in this niche before |
| Scope | ≤ 5 pages, no custom integrations |
| Content | Client provides all copy and images |
| Timeline | Client needs delivery in ≤ 3 weeks |

---

# 14. Revision Control Rules

## Principles

- Revisions are part of the process, not a failure
- But uncontrolled revisions destroy margins and timelines
- The SOW defines the revision scope — not the client's enthusiasm

## Standard Revision Framework

| Tier | Included | Examples |
|---|---|---|
| **Round 1** | Full-page feedback on all delivered pages | Layout changes, copy edits, image swaps, CTA rewording |
| **Round 2** | Focused refinements on Round 1 changes only | Fine-tuning spacing, color adjustments, minor copy tweaks |
| **Round 3** (if included) | Polish-level only | Typos, alignment nudges, final client preference items |

## Out-of-Scope Changes

These are quoted separately and do not consume revision rounds:

- New pages not in the original scope
- Fundamental strategy pivots (new audience, new offer, new funnel)
- New features (e-commerce, member areas, booking systems)
- Content creation beyond what was agreed
- Third-party integration additions

## Change Request Process

1. Client submits change request
2. AJ Digital categorizes: in-scope revision / out-of-scope change request
3. In-scope: applied in current revision round
4. Out-of-scope: quoted with timeline and added to SOW addendum if approved
5. All categorization decisions are communicated to the client before work begins

---

# 15. Communication Checkpoints

## Required Client Touchpoints

| Phase | Touchpoint | Format | Purpose |
|---|---|---|---|
| 1 | Intake acknowledgment | Email | Confirm receipt, set expectations for next step |
| 2 | Qualification outcome | Email or call | Inform go/no-go decision |
| 3 | Discovery call | Video call | Deep business context gathering |
| 4 | Brief + SOW review | Email + document | Formal scope and terms agreement |
| 6 | Strategy presentation | Video call or Loom | Approve direction before build |
| 9 | Build presentation | Video call | Walk through staging site |
| 9 | Revision feedback | Email (structured) | Consolidated page-by-page feedback |
| 10 | Launch confirmation | Email | Go-live approval |
| 11 | 30-day report | Email + document | Performance review and recommendations |
| 12 | Handoff / retainer proposal | Email or call | Close the project or extend |

## Internal Checkpoints

| Phase | Checkpoint | Purpose |
|---|---|---|
| 4 → 5 | Brief lockdown | Confirm brief is complete, SOW signed, before starting research |
| 6 → 7 | Strategy approval | Confirm page map and messaging before build starts |
| 7 → 8 | Build complete | Confirm all pages built and deployed to staging |
| 8 → 9 | QA pass | Confirm audit score ≥ 85 and P0 count = 0 |
| 10 | Launch readiness | All checklist items green |

---

# 16. Deliverables by Phase

| Phase | Client-Facing Deliverables | Internal Artifacts |
|---|---|---|
| 1. Lead Intake | Acknowledgment email | Lead record |
| 2. Qualification | Go/no-go communication | Qualification assessment |
| 3. Discovery | — | Discovery notes, draft brief |
| 4. Brief Creation | Project brief, SOW | Completed `/templates/_project_brief.md` |
| 5. Research | — | Research summary, keyword matrix, competitor analysis |
| 6. Strategy | Strategy summary presentation | Page map, messaging framework, CTA strategy, content requirements |
| 7. Build | Staging URL | Codebase, component library, content integration |
| 8. QA / Audit | — | Audit scorecard, fix log |
| 9. Client Review | Revised staging URL | Revision log, sign-off record |
| 10. Launch | Live production URL | Launch checklist, deployment record |
| 11. Post-Launch | 30-day performance report | Analytics baseline, optimization backlog |
| 12. Handoff/Retention | Access credentials doc, maintenance guide OR retainer proposal | Project closure record or retainer agreement |

---

# 17. Recommended Artifacts by Phase

Artifacts the team should create at each step to maintain quality and traceability.

| Phase | Artifact | Location / Tool |
|---|---|---|
| 1 | Lead intake log | CRM / Project management tool |
| 2 | Qualification scorecard | Internal document |
| 3 | Discovery call recording + notes | Cloud storage + project folder |
| 4 | Completed project brief | `/templates/_project_brief.md` in project repo |
| 4 | Signed SOW | Contract management / project folder |
| 5 | Research summary | Project folder (structured per Research Mode output) |
| 5 | Competitor analysis table | Project folder |
| 5 | Keyword opportunity matrix | Project folder / spreadsheet |
| 6 | Page map | Project folder |
| 6 | Messaging framework | Project folder |
| 6 | CTA strategy map | Project folder |
| 7 | Codebase | Git repository |
| 7 | Staging deployment | Vercel preview / staging URL |
| 8 | Audit scorecard | Per `/skills/web_building/conversion_audit_checklist.md` |
| 8 | Fix log | Project folder |
| 9 | Client feedback document | Email / shared doc |
| 9 | Revision log | Project folder |
| 9 | Written sign-off | Email (archived) |
| 10 | Launch checklist (completed) | Project folder |
| 11 | 30-day report | Client-facing document |
| 11 | Optimization backlog | Project management tool |
| 12 | Access credentials document | Securely shared with client |
| 12 | Maintenance guide | Client-facing document |

---

# 18. Failure Mode Summary

Quick reference for the highest-risk failures across the pipeline.

| Phase | Critical Failure | Prevention |
|---|---|---|
| 1 | Lead lost — no follow-up | CRM entry within 1 hour, auto-response if possible |
| 2 | Bad-fit client accepted | Apply qualification criteria consistently |
| 3 | Vague discovery — no real goals captured | Use structured discovery call format |
| 4 | No signed SOW | Never start build work without a signed agreement |
| 5 | Shallow research | Run the full research prompt, don't shortcut |
| 6 | Generic strategy | Validate strategy against research evidence |
| 7 | Building without approved strategy | Enforce Phase 6 → 7 gate |
| 8 | Skipping QA | Require audit score ≥ 85 before client review |
| 9 | Scope creep via revisions | Apply revision control rules strictly |
| 10 | Launch without final checks | Use launch checklist — no exceptions |
| 11 | No post-launch monitoring | Schedule 30-day report at launch time |
| 12 | No closure or retention attempt | Always close the loop — handoff docs or retainer proposal |

---

*This file defines the operational delivery pipeline for AJ Digital LLC. All client projects follow this pipeline unless an explicit override is approved by the project lead.*
