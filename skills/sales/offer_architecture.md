# Offer Architecture

**AJ Digital's website and digital delivery offers — structured for sales alignment, scope control, and delivery predictability.**

---

## Purpose

Define exactly what AJ Digital sells, at what tier, to whom, and what each offer includes. This file exists so sales conversations produce scoped commitments that delivery can fulfill without guesswork or margin erosion.

This is the source of truth for:

- What we offer and what we don't
- What each tier includes and excludes
- How to match a lead to the right offer
- How pricing logic works
- Where sales promises must align with delivery reality

---

## Scope

**Included:** Offer categories, package tiers, deliverables, inclusion/exclusion rules, qualification fit, pricing logic, revision control, upsell paths, retainer structures, sales-to-delivery handoff, example offer matrix, decision tree, misalignment risks.

**Not included:** Sales process mechanics (see `/skills/sales/sales_system.md`), delivery execution (see `/system/client_delivery_pipeline.md`), build-level standards (see `/CLAUDE.md`).

---

## Alignment

This file connects to the Skill OS at every boundary between sales and delivery:

| Skill OS File | Role in Offer Architecture |
|---|---|
| `/skills/sales/sales_system.md` | Sales process, qualification scorecard, objection handling — uses offers defined here |
| `/system/client_delivery_pipeline.md` | Delivery phases consume the scope defined by the offer sold |
| `/templates/_project_brief.md` | Project brief §3 (Goals), §4 (Offer Details), §8 (Page Scope) are populated from the offer sold |
| `/system/execution_mode.md` | Execution pipeline selection (full vs. short loop) depends on the tier sold |
| `/skills/web_building/page_blueprints.md` | Page count and types per tier map directly to available blueprints |
| `/skills/web_building/conversion_audit_checklist.md` | QA scope varies by tier — all tiers get audited, but depth differs |

---

# 1. Offer Philosophy

## Core Beliefs

1. **Sell outcomes, not deliverables.** The client is buying more leads, higher revenue, or market credibility — not "a 7-page website."
2. **Scope is a promise.** What sales commits, delivery must fulfill. Anything ambiguous in sales becomes a scope dispute in delivery.
3. **Tiers exist to create clarity, not to upsell.** Each tier serves a real use case. Pushing a client into a higher tier they don't need destroys trust.
4. **Every offer must be deliverable.** If we can't define the inputs, process, timeline, and quality bar — it's not an offer, it's a guess.
5. **Exclusions are as important as inclusions.** What's NOT included prevents 80% of scope disputes.

## Pricing Anchor

All pricing is value-based, not hourly. Price reflects:

- Business impact of the deliverable
- Complexity and risk of execution
- Client's ability to capture ROI from the result
- Market positioning of AJ Digital as a premium operator

Reference: `/skills/sales/sales_system.md` — Value-Based Positioning section.

---

# 2. Core Offer Categories

AJ Digital operates in four offer categories. Every engagement maps to one of these.

| Category | What It Is | When It Applies |
|---|---|---|
| **New Build** | Design and build a website from scratch | No existing site, or existing site is beyond repair |
| **Redesign** | Rebuild an existing site with new strategy, design, and code | Existing site underperforms, outdated brand, poor UX/conversion |
| **Optimization** | Improve an existing site's conversion, SEO, performance, or UX | Site is structurally sound but underperforming on metrics |
| **Retainer** | Ongoing optimization, content, and growth management | Post-launch clients or businesses needing continuous improvement |

### Category → Pipeline Mapping

| Category | Pipeline Flow | Execution Mode |
|---|---|---|
| New Build | Standard (Phases 1–12) | Full pipeline: Research → Strategy → Build → Optimization |
| Redesign | Standard (Phases 1–12) | Full pipeline (or short loop if niche is known) |
| Optimization | Abbreviated (Phases 1–4, then 8, 11–12) | Optimization Mode only |
| Retainer | Rolling (Phase 11 on repeat) | Optimization Mode, periodic Strategy Mode |

---

# 3. Package Tiers

Three tiers. Each maps to a defined scope, timeline, and delivery commitment.

## Tier 1: Foundation

**Who it's for:** Solo operators, early-stage businesses, or service providers who need a professional web presence that converts — but don't need a complex multi-page funnel.

**Ideal use case:** "I need a site that looks premium, explains what I do, and generates leads."

**Recommended page scope:** 3–5 pages

**Key deliverables:**
- Strategy brief (abbreviated — discovery + strategy combined)
- 3–5 pages built to AJ Digital standards (homepage, about, service, contact — minimum)
- Mobile-first responsive design
- Basic SEO implementation (meta tags, schema, semantic HTML)
- 1 contact/inquiry form
- Analytics setup
- Staging review + 1 revision round
- Launch deployment

**Expected timeline:** 3–4 weeks

**Fit criteria:**
- Clear, simple offer (1–3 services or products)
- Single target audience
- Content is provided or straightforward to produce
- Budget aligns with Foundation tier pricing
- Decision-maker is the point of contact

**Risks if mis-scoped:**
- Client actually needs a full funnel (landing pages, case studies, segmented audiences) — Foundation won't cover it
- Client expects brand strategy, content writing, or photography — these are excluded
- "Just 5 pages" hides complex interactive requirements (calculators, booking systems, member areas)

---

## Tier 2: Growth

**Who it's for:** Established businesses ready to invest in a conversion-optimized site with strategic depth — multiple audience segments, structured content, and a defined funnel.

**Ideal use case:** "We need a site that generates qualified leads, ranks for our key terms, and positions us as the premium option in our market."

**Recommended page scope:** 6–12 pages

**Key deliverables:**
- Full research phase (competitive, audience, SEO/AEO analysis)
- Complete strategy (page map, messaging framework, CTA strategy, funnel structure)
- 6–12 pages built to AJ Digital standards
- Page blueprints applied per `/skills/web_building/page_blueprints.md`
- Advanced SEO (keyword-targeted content, full schema markup, internal linking strategy)
- AEO optimization (FAQ schema, direct-answer content blocks)
- Conversion audit at QA (scored per `/skills/web_building/conversion_audit_checklist.md`)
- Analytics + conversion tracking setup
- Staging review + 2 revision rounds
- Launch deployment
- 30-day post-launch performance report

**Expected timeline:** 5–8 weeks

**Fit criteria:**
- Multiple services or audience segments
- Clear growth goals with measurable metrics
- Willing to invest in research and strategy before build
- Has (or can produce) content assets — testimonials, case studies, team bios
- Budget aligns with Growth tier pricing
- Decision-maker involved, approval process is clear

**Risks if mis-scoped:**
- Client doesn't have content and expects AJ Digital to write everything — content creation is an add-on
- 12 pages balloons to 18 because "we also need a blog, a careers page, and a partner portal"
- Client wants e-commerce or application-level functionality — that's Custom tier
- Multiple stakeholders with no designated decision-maker — endless revision loops

---

## Tier 3: Custom

**Who it's for:** Organizations with complex requirements — custom functionality, multiple user journeys, integrations, or business-critical digital platforms.

**Ideal use case:** "We need a digital platform that serves multiple audiences, integrates with our CRM, handles bookings, and drives measurable revenue."

**Recommended page scope:** 12–25+ pages (or application-level complexity)

**Key deliverables:**
- Everything in Growth tier, plus:
- Custom discovery workshop (extended, may involve multiple stakeholders)
- Technical architecture planning
- Custom component development
- Third-party integrations (CRM, scheduling, payment, email)
- Multi-funnel strategy (different conversion paths for different audiences)
- Content strategy and information architecture
- Extended QA with full conversion audit + cross-browser/device testing
- Staging review + 3 revision rounds
- Launch deployment with rollback plan
- 90-day post-launch optimization period
- Dedicated project channel

**Expected timeline:** 8–16 weeks

**Fit criteria:**
- Complex business model (multiple offers, audiences, or user journeys)
- Requires custom functionality beyond standard page builds
- Has budget for a premium, high-touch engagement
- Internal team available for content, feedback, and approvals
- Clear project sponsor with decision authority

**Risks if mis-scoped:**
- Project is actually a SaaS product, not a website — needs a product team, not an agency
- Scope is defined at Custom level but budget is at Growth level — misaligned expectations
- No internal content owner — AJ Digital becomes the bottleneck for copy, images, and approvals
- Integration requirements are underestimated — API complexity, authentication, data migration

---

# 4. Deliverables by Tier

| Deliverable | Foundation | Growth | Custom |
|---|---|---|---|
| Discovery call | ✓ (30 min) | ✓ (45–60 min) | ✓ (60–90 min, may be multiple) |
| Project brief | ✓ (abbreviated) | ✓ (full) | ✓ (full + technical addendum) |
| Research phase | — | ✓ | ✓ (extended) |
| Strategy document | ✓ (lightweight) | ✓ (full) | ✓ (full + architecture plan) |
| Page map | ✓ | ✓ | ✓ |
| Messaging framework | — | ✓ | ✓ |
| CTA strategy | ✓ (basic) | ✓ (per page) | ✓ (per page, per audience) |
| Pages built | 3–5 | 6–12 | 12–25+ |
| Blueprint compliance | ✓ | ✓ | ✓ |
| Mobile-first responsive | ✓ | ✓ | ✓ |
| SEO implementation | Basic | Advanced | Advanced + technical SEO |
| AEO optimization | — | ✓ | ✓ |
| Schema markup | Basic (Organization) | Full (FAQ, Service, Breadcrumb) | Full + custom schemas |
| Analytics setup | ✓ | ✓ + conversion tracking | ✓ + event tracking + dashboards |
| Conversion audit (QA) | Abbreviated | Full (100-point) | Full + extended regression |
| Revision rounds | 1 | 2 | 3 |
| Staging review | ✓ | ✓ | ✓ |
| Launch deployment | ✓ | ✓ | ✓ + rollback plan |
| Post-launch report | — | 30-day | 90-day |
| Custom integrations | — | — | ✓ |
| Content creation | — | — | Scoped separately |
| Brand/identity work | — | — | Scoped separately |

---

# 5. Included vs. Excluded Scope

## Always Included (All Tiers)

- Discovery and project brief
- Strategy (depth varies by tier)
- Responsive, mobile-first build
- SEO fundamentals (meta, headings, semantic HTML)
- Accessibility baseline (WCAG 2.1 AA)
- Analytics installation
- QA/audit pass
- Staging review
- Production deployment
- 8pt spacing system and design system compliance
- Performance optimization (target: LCP < 2.5s, INP < 200ms, CLS < 0.1)

## Always Excluded (Unless Scoped as Add-On)

| Exclusion | Why |
|---|---|
| Copywriting / content creation | Separate skill, separate timeline. Client provides or we quote separately. |
| Photography / videography | Separate production. Client provides or we source stock. |
| Brand identity design (logo, brand guidelines) | See `/skills/branding/brand_system.md`. Quoted as separate engagement. |
| E-commerce setup (Shopify, WooCommerce, Stripe integration) | Requires dedicated scoping. Not bundled into standard page builds. |
| Blog / content system buildout | CMS setup is additional scope unless explicitly included in Custom tier. |
| Ongoing hosting management | Client manages hosting or retainer includes it. |
| Email marketing setup | Separate system. Integration with forms is included; campaign setup is not. |
| Social media management | Out of scope entirely. |
| Domain purchase / DNS management | Client responsibility. AJ Digital advises but does not manage. |
| Legal content (privacy policy, terms of service) | Client provides. AJ Digital does not offer legal advice. |

## Gray Zone Items (Must Be Explicitly Scoped)

These frequently cause scope disputes. Address in the SOW every time:

| Item | Default Position | When to Include |
|---|---|---|
| Favicon and social sharing images | Included | Always |
| 404 page | Included | Always |
| Cookie consent banner | Excluded | Include if GDPR/CCPA applies |
| Multilingual support | Excluded | Include only in Custom with dedicated scoping |
| Animation beyond CSS transitions | Excluded | Include in Growth/Custom if specified in strategy |
| CMS training | Excluded | Include in Custom if CMS is part of delivery |
| Password-protected pages | Excluded | Include only if specified in Custom |
| A/B testing setup | Excluded | Include in post-launch optimization scope |

---

# 6. Qualification Fit

Use this table during qualification (Pipeline Phase 2) to match a lead to the right tier.

| Signal | Foundation | Growth | Custom |
|---|---|---|---|
| Business stage | Early / solo | Established / growing | Established / complex |
| Number of services/offers | 1–3 | 3–6 | 6+ or multi-product |
| Target audiences | 1 | 1–2 | 2+ with distinct journeys |
| Content readiness | Has it or can write it | Has most, needs light support | Needs content strategy |
| Technical requirements | Standard pages | Pages + forms + tracking | Pages + integrations + custom features |
| Decision-making | Solo | 1–2 approvers | Committee or multi-stakeholder |
| Timeline expectations | 3–4 weeks | 5–8 weeks | 8–16 weeks |
| Budget alignment | Foundation range | Growth range | Custom range |
| Growth ambition | "Get online professionally" | "Generate leads and rank" | "Build a digital platform" |

**Rule:** If more than 2 signals point to a higher tier, recommend the higher tier. Underselling creates scope pressure during delivery.

---

# 7. Pricing Logic

## Principles

1. **Price reflects value delivered, not hours spent.** A 5-page site for a high-revenue client is worth more than a 12-page site for a startup.
2. **Tiers set the floor, not the ceiling.** Each tier has a minimum. Actual price adjusts upward based on complexity, urgency, and client's revenue context.
3. **Never discount — add value.** If a client pushes on price, add a deliverable to justify the number. Don't reduce scope to fit a lower price.
4. **Transparency builds trust.** The client should understand what they're paying for and what they're not.

## Pricing Structure

| Tier | Minimum | Typical Range | What Drives It Higher |
|---|---|---|---|
| Foundation | $X,XXX | $X,XXX – $XX,XXX | Additional pages, rush timeline, complexity beyond standard |
| Growth | $XX,XXX | $XX,XXX – $XX,XXX | Page count, content depth, number of audience segments, integrations |
| Custom | $XX,XXX | $XX,XXX – $XXX,XXX | Custom functionality, integrations, multi-audience funnels, extended optimization |

> **Note:** Actual price ranges are set by AJ Digital leadership and communicated to sales privately. This document defines the logic, not the numbers.

## Payment Terms

| Milestone | Foundation | Growth | Custom |
|---|---|---|---|
| Deposit (project start) | 50% | 50% | 40% |
| Midpoint (strategy approved or build started) | — | 25% | 30% |
| Final (before launch) | 50% | 25% | 30% |

## Price Adjustments

| Factor | Effect |
|---|---|
| Rush timeline (< minimum weeks) | +20–30% rush fee |
| Additional pages beyond tier scope | Per-page rate |
| Content creation add-on | Quoted separately based on volume |
| Brand identity add-on | Separate engagement or bundled at project rate |
| Extended post-launch optimization | Monthly retainer rate |
| Reduced scope (fewer pages, simpler needs) | Consider whether Foundation tier is a better fit |

---

# 8. Revision / Scope Control Rules

## Revision Allocation by Tier

| Tier | Rounds | Scope per Round |
|---|---|---|
| Foundation | 1 | Full-page feedback on all delivered pages |
| Growth | 2 | Round 1: full-page feedback. Round 2: refinements on Round 1 changes only. |
| Custom | 3 | Round 1: full-page. Round 2: focused refinements. Round 3: polish-level only. |

## What Counts as a Revision

- Copy changes within existing sections
- Image swaps (client provides new images)
- Color or spacing adjustments within the design system
- CTA rewording
- Layout reordering within a page

## What Does NOT Count as a Revision (Out-of-Scope)

- New pages not in the original page map
- New features (booking systems, member areas, e-commerce)
- Fundamental strategy changes (new audience, new messaging direction, new funnel)
- Content creation (writing copy the client was supposed to provide)
- Third-party integrations not in the original SOW

## Change Request Process

1. Client submits the change request
2. AJ Digital categorizes: **in-scope revision** or **out-of-scope change request**
3. In-scope → applied in the current revision round
4. Out-of-scope → quoted with timeline, added to SOW addendum if approved
5. Categorization is communicated before work begins — no surprises

Reference: `/system/client_delivery_pipeline.md` §14 (Revision Control Rules).

---

# 9. Upsell Paths

Every engagement has natural expansion points. These are not aggressive upsells — they're logical next steps that deliver additional value.

| Current Offer | Natural Upsell | Trigger |
|---|---|---|
| Foundation | Growth tier for next project | Client sees results, wants more pages, SEO, or conversion depth |
| Foundation | Content creation add-on | Client realizes they need professional copy |
| Growth | Custom tier expansion | Client needs integrations, additional funnels, or application features |
| Growth | Retainer | Post-launch report shows opportunity for ongoing optimization |
| Custom | Retainer (premium) | Complex site needs ongoing management, content updates, optimization |
| Any tier | Brand identity engagement | Client's visual brand doesn't match the quality of the new site |
| Optimization | Growth rebuild | Audit reveals the existing site is beyond optimization — needs a rebuild |
| Retainer | Quarterly strategy sprints | Client wants periodic strategy reviews and new page builds |

## Upsell Rules

1. **Never upsell during delivery** — it creates distrust. Upsell after the current project delivers results.
2. **Let data drive it** — the 30-day report is the natural upsell moment. Show results, then propose expansion.
3. **Package the upsell** — don't price ad hoc. Map it to a defined offer (tier, retainer, or add-on).
4. **Get the current project right first** — a mediocre delivery kills all future revenue from that client.

---

# 10. Retainer / Optimization Offers

## Retainer Tiers

| Retainer | Cadence | Includes | Best For |
|---|---|---|---|
| **Maintain** | Monthly | Performance monitoring, security updates, uptime checks, 2 minor content updates | Clients who need the site managed but aren't actively growing |
| **Grow** | Monthly | Everything in Maintain + monthly conversion audit, 1 optimization sprint (SEO, CRO, or content), analytics reporting | Clients actively growing who want ongoing improvement |
| **Scale** | Monthly | Everything in Grow + quarterly strategy review, 2 optimization sprints, new page builds, A/B testing, dedicated Slack channel | High-value clients building a digital platform over time |

## Retainer Pricing Logic

- Retainers are priced monthly, billed monthly or quarterly
- Each tier has a minimum monthly commitment
- Unused hours/sprints do not roll over (incentivizes consistent engagement)
- Retainer scope is defined in the retainer agreement — no open-ended "whatever you need" arrangements

## Optimization-Only Engagements

For clients who don't need a full build but want to improve an existing site:

| Engagement | Scope | Timeline | Deliverable |
|---|---|---|---|
| **Quick Audit** | Abbreviated conversion audit (top-level scoring) | 2–3 days | Audit summary with top 5 recommendations |
| **Full Audit** | Complete 100-point conversion audit per checklist | 1 week | Full audit report with prioritized fix list |
| **Audit + Fix Sprint** | Full audit + implementation of P0/P1 fixes | 2–3 weeks | Audit report + implemented fixes + before/after metrics |

Reference: `/skills/web_building/conversion_audit_checklist.md` for the scoring framework used in all audit engagements.

---

# 11. Sales-to-Delivery Handoff Rules

## The Handoff Problem

The most common source of client disappointment is a gap between what sales promised and what delivery understood. This section eliminates that gap.

## Handoff Checklist

Before delivery begins (between Pipeline Phase 4 and Phase 5), sales must confirm:

- [ ] **Signed SOW** exists with defined scope, timeline, price, revision rounds, and payment terms
- [ ] **Completed project brief** (`/templates/_project_brief.md`) — all 10 sections filled, reviewed by sales and delivery
- [ ] **Tier is documented** — Foundation / Growth / Custom, with any add-ons explicitly listed
- [ ] **Page map is agreed** — specific pages and types, not "approximately 8–10 pages"
- [ ] **Exclusions are stated** — client has acknowledged what's NOT included
- [ ] **Content ownership is clear** — who provides copy, images, testimonials, and by when
- [ ] **Timeline is realistic** — delivery has confirmed the timeline is achievable given current capacity
- [ ] **Decision-maker is identified** — name and contact of the person who approves deliverables
- [ ] **Revision terms are stated** — number of rounds and what constitutes a revision vs. a change request
- [ ] **Risk flags are documented** — anything unusual (tight timeline, unclear content, committee approvals)

## Handoff Meeting

A 15-minute internal sync between sales and delivery at the point of handoff:

1. Sales walks through the brief, tier, and any context not captured in writing
2. Delivery asks clarifying questions
3. Both confirm the timeline and capacity
4. Risk flags are discussed and mitigation plans noted
5. Delivery takes ownership from this point forward

## Post-Handoff Rule

**Sales does not make scope promises after handoff.** If a client asks sales for something during delivery, sales routes it to the delivery lead — never confirms scope changes independently.

---

# 12. Example Offer Matrix

A concrete example of how offers map to real scenarios.

| Scenario | Tier | Pages | Special Considerations | Pipeline |
|---|---|---|---|---|
| Freelance consultant needs a professional site | Foundation | 4 (Home, About, Services, Contact) | Client provides all copy. No integrations. | Fast-track |
| Growing agency needs a lead-gen site | Growth | 8 (Home, About, 3 Services, Case Studies, Blog, Contact) | Research phase needed. SEO is priority. | Standard |
| SaaS company launching a marketing site | Growth | 10 (Home, Features, Pricing, 3 Use Cases, About, Blog, Contact, Demo) | AEO optimization important. Multiple audiences. | Standard |
| Law firm needs a complete digital presence | Custom | 18 (Home, About, 8 Practice Areas, Team, Case Results, FAQ, Blog, Contact, 2 Landing Pages) | Multiple audience journeys. Content-heavy. Schema per practice area. | Standard |
| E-commerce brand needs a conversion audit | Optimization | N/A | No build — audit + fix sprint only. | Abbreviated |
| Post-launch client wants ongoing growth | Retainer (Grow) | N/A | Monthly optimization sprints. Quarterly reporting. | Rolling |

---

# 13. Offer Decision Tree

Use this to quickly match an inbound lead to the right offer.

```
START: What does the lead need?
│
├── "I need a new website" or "I need a redesign"
│   │
│   ├── Simple? (1 audience, ≤5 pages, no integrations, content ready)
│   │   └── → FOUNDATION
│   │
│   ├── Moderate? (1-2 audiences, 6-12 pages, SEO priority, some content)
│   │   └── → GROWTH
│   │
│   └── Complex? (Multiple audiences, 12+ pages, integrations, custom features)
│       └── → CUSTOM
│
├── "My site isn't performing"
│   │
│   ├── Site is structurally sound? (modern code, decent design)
│   │   └── → OPTIMIZATION (Audit or Audit + Fix Sprint)
│   │
│   └── Site is outdated or fundamentally broken?
│       └── → REDESIGN → match to Foundation / Growth / Custom
│
├── "I need ongoing help"
│   │
│   ├── Just keep it running?
│   │   └── → RETAINER: Maintain
│   │
│   ├── Help me grow?
│   │   └── → RETAINER: Grow
│   │
│   └── Full strategic partnership?
│       └── → RETAINER: Scale
│
└── "I need something else" (brand, content, app, etc.)
    └── → EVALUATE FIT — refer to appropriate skill domain or decline
```

---

# 14. Common Misalignment Risks

Issues that cause delivery pain when sales and delivery aren't aligned.

| Risk | What Happens | Prevention |
|---|---|---|
| **Scope ambiguity** | "About 8 pages" becomes 14 pages mid-build. | Page map with specific page names in the SOW. |
| **Content assumption** | Sales assumes client has content. Client assumes AJ Digital writes it. | Explicit content ownership line in SOW and brief. |
| **Timeline mismatch** | Sales promises 4 weeks. Delivery needs 6. | Delivery confirms timeline before SOW is sent. |
| **Feature creep** | "Can you also add a booking system?" mid-build. | Exclusion list in SOW. Change request process enforced. |
| **Revision abuse** | Client treats revisions as unlimited design iterations. | Revision rounds and scope defined in SOW. Categorization before work. |
| **Decision-maker absence** | Feedback comes from 3 different people with contradicting opinions. | Single decision-maker identified in brief §10. |
| **Tier mismatch** | Client has Custom needs but was sold Foundation pricing. | Qualification fit table + mandatory tier documentation in handoff. |
| **Under-scoped integrations** | "Just connect it to our CRM" — CRM has no API and needs custom work. | Technical requirements documented in brief §9. Reviewed by delivery before SOW. |
| **Post-launch expectations** | Client expects 6 months of support. SOW includes none. | Post-launch scope explicitly stated in SOW (none, 30-day report, or retainer). |
| **Brand gap** | New site is premium but existing brand assets are amateur. | Flag during discovery. Recommend brand engagement or manage expectations. |

---

# 15. Sales-to-Delivery Handoff Checklist (Concise)

Print-ready version for the handoff meeting. Every box must be checked before delivery starts.

```
□ SOW signed (scope, price, timeline, revisions, payment terms)
□ Project brief complete (/templates/_project_brief.md — all 10 sections)
□ Tier documented (Foundation / Growth / Custom)
□ Page map agreed (specific pages listed, not ranges)
□ Exclusions stated and acknowledged by client
□ Content ownership defined (who provides what, by when)
□ Timeline confirmed by delivery team
□ Decision-maker identified (name + contact)
□ Revision terms stated (rounds, scope, change request process)
□ Risk flags documented and discussed
□ Internal handoff meeting completed (sales → delivery)
```

---

*This file defines AJ Digital's offer architecture. Sales uses it to scope engagements. Delivery uses it to validate scope. Both use it to prevent misalignment. Changes require approval from the project lead.*
