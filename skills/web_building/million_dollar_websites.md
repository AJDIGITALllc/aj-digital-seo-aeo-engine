# Million Dollar Websites

**The strategic framework for building websites that convert visitors into customers and rank in both traditional and AI-powered search.**

---

## Purpose

This is the master strategy document for web building at AJ Digital. Every website we build is a revenue-generating asset, not a digital brochure. This file defines the frameworks, structures, and principles that make that happen.

---

## Scope

- Conversion Rate Optimization (CRO) frameworks
- High-converting page structures
- SEO strategy and implementation
- AEO (AI Engine Optimization) strategy
- Performance principles
- Layout systems
- Real-world best practices
- AJ Digital implementation model

This file does NOT cover visual design rules (see `design_system.md`), specific component code (see `claude_templates.md`), or AI generation prompts (see `anti_gravity_prompts.md`).

---

## CRO Frameworks

### The Conversion Equation

```
Conversion = (Motivation × Value Proposition × Incentive) / (Friction × Anxiety)
```

Every page element either increases the numerator or decreases the denominator. There is no neutral content.

### Framework 1: AIDA for Page Structure

| Stage     | Content Goal                          | Page Element                              |
|-----------|---------------------------------------|-------------------------------------------|
| Attention | Stop the scroll. Interrupt the pattern.| Hero headline, striking visual, bold stat |
| Interest  | "This is relevant to me."             | Problem statement, relatable scenario     |
| Desire    | "I want this outcome."                | Benefits, social proof, results           |
| Action    | "Here's how I get it."                | CTA, offer, next step                     |

### Framework 2: PAS for Messaging

| Stage     | Purpose                               | Example                                    |
|-----------|---------------------------------------|--------------------------------------------|
| Problem   | Name the pain the visitor feels       | "Your website isn't converting because visitors can't find what they need in 3 seconds." |
| Agitation | Amplify the cost of inaction          | "Every day that passes, you're losing qualified leads to competitors with clearer messaging." |
| Solution  | Present the answer                    | "We build conversion-engineered websites that turn visitors into customers." |

### Framework 3: Trust Stack

Build trust progressively as the visitor scrolls:

1. **Credibility indicators** (above fold): Client logos, "trusted by X companies," featured-in badges
2. **Proof of results** (mid-page): Specific metrics — "43% increase in conversions," "2.1s load time"
3. **Social proof** (near CTA): Testimonials with names, photos, companies, and specific outcomes
4. **Risk reversal** (at CTA): Guarantees, free consultations, no-commitment language
5. **Authority markers** (footer): Certifications, awards, years in business, team credentials

---

## High-Converting Page Structures

### Landing Page (Lead Gen)

```
┌──────────────────────────────────────┐
│ HERO                                  │
│ - Headline (benefit-driven, < 10 words)│
│ - Subhead (who it's for + outcome)    │
│ - Primary CTA                         │
│ - Hero image/video (shows outcome)    │
│ - Trust indicator (1 line)            │
├──────────────────────────────────────┤
│ PROBLEM / PAIN POINTS                 │
│ - 3 pain points the audience feels    │
│ - Validates their frustration         │
├──────────────────────────────────────┤
│ SOLUTION OVERVIEW                     │
│ - What you offer (3 pillars/features) │
│ - How it solves each pain point       │
├──────────────────────────────────────┤
│ SOCIAL PROOF                          │
│ - 2-3 testimonials with outcomes      │
│ - Client logos (if applicable)        │
├──────────────────────────────────────┤
│ HOW IT WORKS                          │
│ - 3-step process                      │
│ - Reduces perceived complexity        │
├──────────────────────────────────────┤
│ RESULTS / CASE STUDY                  │
│ - Specific metrics and outcomes       │
│ - Before/after or ROI data            │
├──────────────────────────────────────┤
│ FAQ                                   │
│ - Top 5-7 objection-handling questions│
│ - Structured for SEO + AEO           │
├──────────────────────────────────────┤
│ FINAL CTA                             │
│ - Restated value proposition          │
│ - Primary CTA (same as hero)         │
│ - Risk reversal (guarantee/no-commit) │
└──────────────────────────────────────┘
```

### Homepage (Service Business)

```
Hero → Services Overview → Featured Work → Testimonials → About/Differentiators → Blog/Resources → CTA → Footer
```

### Service Page

```
Hero (service + outcome) → Problem → Solution Details → Process → Pricing/Packages → Case Study → FAQ → CTA
```

### Case Study Page

```
Client Overview → Challenge → Approach → Solution → Results (metrics) → Testimonial → Related CTA
```

---

## SEO Strategy

### On-Page Fundamentals

| Element              | Rule                                                    |
|----------------------|---------------------------------------------------------|
| Title tag            | Primary keyword + benefit, < 60 characters              |
| Meta description     | Action-oriented, includes keyword, < 155 characters     |
| H1                   | One per page, includes primary keyword, front-loaded    |
| H2s                  | Support keyword variations and topic coverage           |
| URL structure        | Short, keyword-rich, hyphen-separated: `/web-design-services` |
| Image alt text       | Descriptive of content, naturally includes keywords     |
| Internal linking     | 3-5 contextual links per page to related content        |
| Schema markup        | JSON-LD for Organization, Service, FAQ, BreadcrumbList  |

### Content Hierarchy for SEO

Every page targets one primary keyword and 3–5 secondary keywords:

```
Primary keyword → H1, title tag, first paragraph, URL
Secondary keywords → H2 headings, body content, meta description
Related terms → Naturally throughout body content (semantic SEO)
```

### Technical SEO Checklist

- [ ] XML sitemap generated and submitted
- [ ] Robots.txt allows crawling of important pages
- [ ] Canonical tags on all pages
- [ ] No duplicate content across pages
- [ ] 301 redirects for changed URLs
- [ ] HTTPS enforced site-wide
- [ ] Mobile-friendly (Google Mobile-Friendly Test passes)
- [ ] Core Web Vitals in green
- [ ] Structured data validates (Google Rich Results Test)
- [ ] No orphan pages (every page linked from at least one other page)

### Local SEO (When Applicable)

- Google Business Profile optimized
- NAP (Name, Address, Phone) consistent across all listings
- LocalBusiness schema markup
- Location-specific landing pages for multi-location businesses
- Review acquisition strategy implemented

---

## AEO Strategy (AI Engine Optimization)

AI search engines (Perplexity, ChatGPT, Google SGE, Copilot) are changing how people find information. AEO ensures our clients' content is surfaced in AI-generated answers.

### Principles

1. **Answer directly.** The first 1–2 sentences of every section should directly answer the implicit question. AI models extract concise, definitive statements.

2. **Structure for extraction.** Use clear heading → content patterns that AI can parse:
   ```
   ## What is [topic]?
   [Topic] is [clear definition]. It [does X] by [method Y].
   ```

3. **Use FAQ schema.** Every service page and landing page should have FAQ schema with 5–7 questions that match real search queries.

4. **Provide entity information.** Structured data (JSON-LD) helps AI models understand what your client is, what they offer, and how they relate to the industry.

5. **Be the definitive source.** AI models prefer content that is comprehensive, well-structured, and authoritative. Thin content gets skipped.

### AEO Content Patterns

**Question-Answer Pattern:**
```markdown
## How much does web design cost?

Professional web design typically costs between $5,000 and $100,000+,
depending on complexity, features, and the agency's expertise.
A basic marketing website starts around $5,000–$15,000.
Custom web applications with integrations start at $25,000+.
```

**Comparison Pattern:**
```markdown
## [Your Service] vs [Alternative]

| Factor        | Your Service          | Alternative          |
|---------------|----------------------|---------------------|
| Feature A     | Specific detail      | Specific detail     |
| Feature B     | Specific detail      | Specific detail     |
```

**Process Pattern:**
```markdown
## How does [process] work?

[Process] works in three steps:
1. **Step One:** [Specific action and outcome]
2. **Step Two:** [Specific action and outcome]
3. **Step Three:** [Specific action and outcome]
```

### AEO Checklist

- [ ] Every H2 section starts with a direct answer to the implied question
- [ ] FAQ schema with 5–7 questions per service page
- [ ] Organization schema with complete business information
- [ ] Service schema for each service offered
- [ ] Content uses clear, extractable statements (not vague marketing speak)
- [ ] Statistics and data points are cited and current
- [ ] Content covers the topic comprehensively (AI prefers thorough sources)

---

## Performance Principles

### Why Performance = Revenue

| Load Time | Conversion Impact           |
|-----------|----------------------------|
| 1-2s      | Baseline                   |
| 2-3s      | -7% conversion rate        |
| 3-5s      | -16% conversion rate       |
| 5-8s      | -32% conversion rate       |
| 8s+       | -50%+ bounce rate increase |

Performance is not a technical luxury. It is directly correlated to revenue.

### Performance Budget

| Resource        | Budget                  |
|-----------------|-------------------------|
| HTML            | < 50KB (compressed)     |
| CSS             | < 50KB (compressed)     |
| JavaScript      | < 150KB (compressed)    |
| Images          | < 200KB above fold      |
| Fonts           | < 100KB total           |
| Total initial   | < 500KB                 |

### Implementation Rules

1. **Images:** WebP/AVIF format, responsive `srcset`, lazy loading below fold, explicit dimensions, max 1920px width for full-bleed
2. **Fonts:** System font stack preferred. If custom fonts: max 2 families, subset to needed characters, `font-display: swap`
3. **CSS:** Purge unused styles, minimize specificity chains, prefer composition over inheritance
4. **JavaScript:** Code split per route, defer non-critical, minimize third-party scripts
5. **Server:** Brotli compression, CDN for static assets, proper cache headers (1 year for hashed assets)
6. **Critical path:** Inline critical CSS, preload hero image and primary font

---

## Layout Systems

### The Container System

```
Max width: 1280px
Padding: 24px (mobile) → 32px (tablet) → 48px (desktop)
Centering: margin: 0 auto
```

### Grid System

| Layout          | Grid                     | Use Case                       |
|-----------------|--------------------------|--------------------------------|
| Full-width hero | 1 column, edge-to-edge   | Hero sections, CTAs            |
| Content          | 1 column, max 768px      | Blog posts, long-form content  |
| Two-up          | 2 columns, equal         | Feature comparisons, side-by-side |
| Content + sidebar| ~2:1 ratio (~832px + ~400px) | Blogs with sidebar, service + form |
| Three-up        | 3 columns, equal         | Feature cards, team members    |
| Four-up         | 4 columns, equal         | Logos, small cards, metrics    |

### Responsive Breakpoints

| Breakpoint | Name    | Behavior                              |
|------------|---------|---------------------------------------|
| < 640px    | Mobile  | Single column, stacked layout         |
| 640px      | sm      | Minor layout adjustments              |
| 768px      | md      | Two-column layouts activate           |
| 1024px     | lg      | Full multi-column layouts, sidebar    |
| 1280px     | xl      | Max content width reached             |
| 1536px     | 2xl     | Content centered, outer padding grows |

---

## Real-World Best Practices

### Above the Fold

- **Headline:** Clear outcome, not clever wordplay. "We build websites that convert" beats "Crafting digital experiences."
- **Subheadline:** Who it's for and what they get. "Marketing websites for B2B SaaS companies that turn visitors into demos."
- **CTA:** One primary action, high contrast, action verb. "Get a Free Audit" not "Learn More."
- **Visual:** Shows the outcome (the product, the result, the transformation) — not stock photos of handshakes.
- **Trust indicator:** One line — "Trusted by 200+ companies" or a row of client logos.

### Navigation

- 5–7 top-level items maximum
- CTA in the nav (contrasting style from regular links)
- Mobile: hamburger menu with full-screen overlay
- Logo links to homepage
- Current page indicator

### Footer

- Contact information (address, phone, email)
- Social links
- Legal links (privacy, terms)
- Sitemap links for SEO
- Final CTA or newsletter signup

### Forms

- Maximum 3–5 fields for lead gen (name, email, company, message, budget range)
- Inline validation with clear error messages
- Success state that confirms what happens next
- Never use placeholder text as labels
- Submit button with action verb ("Get My Free Audit" not "Submit")

---

## AJ Digital Implementation Model

### Project Intake

Every website project begins with:

1. **Discovery:** Understand the business, audience, goals, and competitive landscape
2. **Strategy:** Define information architecture, messaging hierarchy, and conversion strategy
3. **Design System:** Establish visual rules (or apply existing brand guidelines)
4. **Content:** Write or direct all copy before building UI
5. **Build:** Execute with Claude Code referencing skill docs
6. **QA:** Audit against all frameworks in this document
7. **Launch:** Deploy with monitoring, analytics, and SEO verification

### Quality Standards

A website is launch-ready when:

| Category    | Standard                                        |
|-------------|------------------------------------------------|
| Performance | Core Web Vitals all green                      |
| SEO         | All pages have unique titles, descriptions, H1s, and schema |
| AEO         | FAQ schema on service pages, Q&A content patterns throughout |
| CRO         | Primary CTA above fold on every key page       |
| Accessibility| WCAG 2.1 AA compliant                         |
| Responsive  | Tested on mobile, tablet, and desktop          |
| Content     | No placeholder text anywhere                   |
| Functionality| All forms, links, and interactions work        |

### Pricing Correlation

| Website Tier | Typical Value  | Characteristics                                    |
|-------------|----------------|---------------------------------------------------|
| Starter     | $5K–$15K       | 5–8 pages, template-based, standard CRO           |
| Professional| $15K–$50K      | 10–20 pages, custom design, advanced CRO, CMS     |
| Premium     | $50K–$100K+    | Full custom, complex integrations, advanced SEO/AEO, ongoing optimization |

Every project, regardless of tier, follows the same quality standards. The difference is scope and depth, not quality.

---

*This document is the strategic backbone of every website we build. Reference it before, during, and after every project.*
