# Website Audit Prompt

**Comprehensive CRO, SEO, AEO, design, performance, and accessibility audit prompt.**

---

## Purpose

This prompt produces a thorough audit of an existing website against AJ Digital's quality standards. It identifies specific issues, quantifies their impact, and provides prioritized recommendations. Use it during QA (Phase 7 of the workflow) or when evaluating a client's current website during discovery.

---

## Context Requirements

Before running this prompt, provide:

1. **Website URL** — the site to audit
2. **Business context** — what the business does, who they serve
3. **Primary conversion goal** — what the site should make visitors do
4. **Target audience** — who visits the site and what they need
5. **Audit scope** — full audit or focused (CRO only, SEO only, etc.)

---

## The Prompt

```
You are a senior website auditor specializing in Conversion Rate Optimization (CRO),
SEO, AI Engine Optimization (AEO), design systems, performance, and accessibility.
You audit websites against premium agency standards — not minimum compliance.

WEBSITE: [URL]
BUSINESS: [WHAT THEY DO]
AUDIENCE: [WHO VISITS AND WHAT THEY NEED]
PRIMARY GOAL: [WHAT VISITORS SHOULD DO — e.g., "book a consultation"]
AUDIT SCOPE: [FULL / CRO FOCUS / SEO FOCUS / DESIGN FOCUS / PERFORMANCE FOCUS]

Conduct a comprehensive audit across the following dimensions. For each finding:
- State the issue clearly
- Explain WHY it matters (impact on conversions, rankings, or user experience)
- Provide a specific recommendation
- Rate severity: CRITICAL (blocks conversions) / MAJOR (degrades quality) / MINOR (polish)

---

AUDIT DIMENSIONS:

1. CONVERSION RATE OPTIMIZATION (CRO)

   Evaluate:
   - Above-the-fold content: Is the value proposition clear? Is there a visible CTA?
   - CTA strategy: Are CTAs prominent, well-placed, and using action-oriented copy?
   - Trust signals: Are testimonials, logos, metrics, or certifications present and placed near CTAs?
   - Friction points: Are there unnecessary steps, confusing navigation, or unclear messaging?
   - Form design: Are forms minimal, labeled, and providing clear feedback?
   - Visual hierarchy: Does the eye naturally flow from headline → supporting info → CTA?
   - Objection handling: Are common concerns addressed before the conversion point?
   - Mobile conversion: Does the conversion path work smoothly on mobile devices?

   For each page: identify the intended conversion action and rate whether the page achieves it.

2. SEO

   Evaluate:
   - Title tags: unique, keyword-informed, under 60 characters?
   - Meta descriptions: action-oriented, under 155 characters, unique per page?
   - H1 tags: one per page, keyword-informed, above the fold?
   - Heading hierarchy: sequential (H1 → H2 → H3), no skips?
   - URL structure: short, descriptive, keyword-rich?
   - Internal linking: contextual links between related pages?
   - Image optimization: alt text, file size, next-gen formats?
   - Schema markup: Organization, Service, FAQ, BreadcrumbList present and valid?
   - Canonical tags: present on all pages?
   - Mobile-friendliness: responsive, no horizontal scroll, touch-friendly?
   - XML sitemap: present, submitted, includes all indexable pages?
   - Robots.txt: properly configured, not blocking important pages?

   Provide a priority-ranked list of SEO improvements.

3. AEO (AI ENGINE OPTIMIZATION)

   Evaluate:
   - Content structure: Are sections structured as clear question-answer patterns?
   - FAQ content: Are FAQs present with real questions people search for?
   - Direct answers: Does each section start with a clear, extractable statement?
   - Entity definition: Is the business clearly described (what, who, where, what they offer)?
   - Structured data: Does schema markup help AI models understand the content?
   - Comprehensiveness: Does the content cover topics thoroughly enough to be an authoritative source?
   - Factual specificity: Are there specific numbers, timeframes, and verifiable claims?

   Identify the top 5 AEO opportunities for this website.

4. DESIGN AND UX

   Evaluate:
   - Spacing consistency: Is spacing systematic or arbitrary?
   - Typography: Is there a clear typographic hierarchy? Font choices appropriate?
   - Color: Is the palette cohesive? Does color guide attention to CTAs?
   - White space: Do sections have adequate breathing room?
   - Visual hierarchy: Can you identify the most important element in each viewport?
   - Component consistency: Do similar elements (cards, buttons, links) look consistent?
   - Responsive design: Does the layout adapt cleanly at all breakpoints?
   - Imagery: Is it high quality, relevant, and consistently styled?
   - Navigation: Is it clear, accessible, and appropriate for the site's size?

   Rate the overall design quality: Premium / Professional / Acceptable / Below Standard.

5. PERFORMANCE

   Evaluate (reference Core Web Vitals):
   - Largest Contentful Paint (LCP): target < 2.5 seconds
   - First Input Delay (FID) / Interaction to Next Paint (INP): target < 200ms
   - Cumulative Layout Shift (CLS): target < 0.1
   - Total page weight: target < 500KB initial load
   - Image optimization: proper formats, sizing, lazy loading
   - Font loading: strategies in place, limited families
   - JavaScript: code-split, deferred, minimal third-party
   - Compression: Brotli/gzip enabled

   Provide specific performance improvement recommendations with estimated impact.

6. ACCESSIBILITY

   Evaluate (WCAG 2.1 AA):
   - Color contrast: text and UI elements meet minimum ratios
   - Keyboard navigation: all interactive elements accessible via keyboard
   - Focus indicators: visible focus styles on all focusable elements
   - Alt text: all images have descriptive alt text
   - Form labels: all inputs have associated labels (not just placeholders)
   - Heading hierarchy: proper sequential nesting
   - ARIA usage: correct and necessary (not overused)
   - Touch targets: minimum 44x44px on mobile
   - Skip links: present for screen readers

   Provide specific violations with element references.

---

OUTPUT FORMAT:

1. EXECUTIVE SUMMARY
   - Overall assessment (1 paragraph)
   - Top 3 critical issues
   - Top 3 quick wins
   - Estimated overall conversion impact of addressing all findings

2. DETAILED FINDINGS BY CATEGORY
   For each dimension above:
   - Table of findings with severity, issue, impact, recommendation
   - Priority ranking within the category

3. PRIORITIZED ACTION PLAN
   - Phase 1 (this week): Critical fixes that directly impact conversions
   - Phase 2 (this month): Major improvements for SEO, performance, accessibility
   - Phase 3 (this quarter): Polish and optimization for premium quality
   - Each item includes: what to do, why, and expected impact

4. METRICS TO TRACK
   - Before/after metrics to measure improvement
   - Recommended tools for ongoing monitoring
```

---

## Expected Output

A structured audit report containing:

1. **Executive summary** with critical issues and quick wins
2. **Category-by-category findings** in severity-ranked tables
3. **Prioritized action plan** in three phases
4. **Success metrics** to measure improvement

The output should be specific enough to hand directly to a developer for implementation. "Improve the hero" is not acceptable. "Add a primary CTA button below the hero headline with contrasting color and action-oriented copy ('Get Your Free Audit')" is.

---

## When to Use

| Scenario                          | Audit Scope        |
|-----------------------------------|--------------------|
| Pre-project discovery              | Full audit         |
| QA during build (Phase 7)         | Full audit         |
| Quick CRO review                   | CRO focus          |
| SEO improvement planning           | SEO + AEO focus    |
| Performance optimization           | Performance focus  |
| Accessibility compliance check     | Accessibility focus|

---

*Audit ruthlessly. Every issue found before launch is a problem the client never has to experience.*
