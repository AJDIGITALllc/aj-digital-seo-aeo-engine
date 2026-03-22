# Claude Templates

**Reusable prompts and structural patterns for building website sections and components with Claude Code.**

---

## Purpose

This file contains ready-to-use prompts for generating specific website sections and full pages. Each prompt references the design system and CRO principles so Claude Code produces output that meets AJ Digital standards on the first pass.

---

## How to Use These Templates

1. Copy the relevant prompt
2. Replace `[bracketed placeholders]` with project-specific information
3. Ensure `CLAUDE.md` and `design_system.md` are in the conversation context
4. Send the prompt
5. Validate output against the design system checklist at the bottom of this file

---

## Section Templates

### Hero Section

```
Build a hero section for [CLIENT NAME]'s website.

CONTEXT:
- Business: [what they do]
- Target audience: [who they serve]
- Primary goal: [what action visitors should take]
- Brand colors: primary [HEX], secondary [HEX]
- Voice: [professional/bold/friendly/authoritative]

CONTENT:
- Headline: [provided headline or "generate based on context"]
- Subheadline: [provided or "generate — should clarify who it's for and the outcome"]
- Primary CTA: [button text, e.g., "Get a Free Consultation"]
- Secondary CTA: [optional, e.g., "View Our Work"]
- Trust indicator: [e.g., "Trusted by 200+ companies" or client logo strip]

TECHNICAL REQUIREMENTS:
- Next.js App Router component with TypeScript
- Tailwind CSS for styling
- 8pt spacing system (all values multiples of 8)
- Responsive: single column mobile, layout adapts at md/lg breakpoints
- Hero image or background: use next/image with priority loading
- Above-fold CTA must be visible without scrolling on all devices
- Minimum touch target: 44x44px for all interactive elements
- Semantic HTML: use <section> with aria-label

DESIGN RULES:
- Section padding: py-16 mobile, py-20 tablet, py-24 desktop (using space tokens)
- Headline: text-5xl mobile scaling to text-6xl desktop, font-bold, tight line height
- Subheadline: text-lg to text-xl, neutral-600 color, max-width 65ch
- CTA button: primary style, large size (py-4 px-8), prominent visual weight
- Visual hierarchy: headline is dominant, subheadline supports, CTA is the action
- White space between elements: space-4 to space-6

OUTPUT: A single React component file with complete implementation.
```

### Features / Services Section

```
Build a features section that showcases [NUMBER] key features/services for [CLIENT NAME].

CONTEXT:
- Business: [what they do]
- These features solve: [what pain points]
- Each feature should emphasize: [outcomes/benefits, not just descriptions]

CONTENT:
- Section headline: [provided or "generate"]
- Section description: [optional, 1-2 sentences]
- Features:
  1. [Title] — [description of benefit/outcome]
  2. [Title] — [description of benefit/outcome]
  3. [Title] — [description of benefit/outcome]
  [add more as needed]

TECHNICAL REQUIREMENTS:
- Next.js component with TypeScript
- Tailwind CSS, 8pt spacing system
- Grid layout: 1 column mobile, 2 column tablet, 3 column desktop
- Each feature: icon + title + description
- Icons: use Lucide React or Heroicons (specify which)
- Cards have equal height in grid
- Responsive with proper stacking behavior

DESIGN RULES:
- Section padding: py-16 to py-24 (responsive)
- Section header centered, max-width 65ch for description
- Gap between header and grid: space-8 to space-12
- Card padding: space-6
- Card heading: text-xl, semibold
- Card description: text-base, neutral-600
- Icon: 48px (space-6), brand color
- Grid gap: space-6 to space-8

OUTPUT: A single React component file with complete implementation.
```

### Social Proof / Testimonials Section

```
Build a testimonials section for [CLIENT NAME].

CONTEXT:
- Industry: [e.g., B2B SaaS, professional services, ecommerce]
- Social proof goal: [build trust / show results / demonstrate expertise]

CONTENT:
- Section headline: [e.g., "What Our Clients Say" or "Results That Speak"]
- Testimonials:
  1. Quote: "[testimonial text]"
     Name: [person name]
     Title: [their role]
     Company: [company name]
     Result: [optional — specific metric or outcome]
  2. [repeat for each testimonial, 2-4 total]

TECHNICAL REQUIREMENTS:
- Next.js component with TypeScript
- Tailwind CSS, 8pt spacing system
- Layout: single featured testimonial or grid of cards
- Avatar images: use next/image, 64px circular
- Optional: star rating display
- Responsive stacking

DESIGN RULES:
- Section padding: py-16 to py-24 (responsive)
- Quote text: text-lg to text-xl, italic or regular (match brand voice)
- Attribution: text-sm, semibold for name, regular for title/company
- Card style: subtle background (neutral-50) or bordered
- If using large quote marks: decorative only, don't interfere with readability
- Testimonials near a CTA or conversion point

OUTPUT: A single React component file with complete implementation.
```

### Pricing Section

```
Build a pricing section for [CLIENT NAME] with [NUMBER] pricing tiers.

CONTEXT:
- Business model: [subscription/one-time/packages]
- Primary tier to promote: [which one — this gets the "recommended" badge]
- Conversion goal: [which tier drives the most revenue]

CONTENT:
- Section headline: [e.g., "Simple, Transparent Pricing"]
- Section description: [optional]
- Tiers:
  1. Name: [e.g., "Starter"]
     Price: [$X/period]
     Description: [one line about who it's for]
     Features: [bullet list]
     CTA: [button text]
  2. [repeat for each tier]

TECHNICAL REQUIREMENTS:
- Next.js component with TypeScript
- Tailwind CSS, 8pt spacing system
- Grid: stack on mobile, side-by-side on tablet+
- Recommended tier visually elevated (border, badge, or scale)
- Toggle for monthly/annual if applicable
- All prices clearly visible with period (e.g., /month)

DESIGN RULES:
- Section padding: py-16 to py-24
- Cards: consistent height, aligned feature lists
- Recommended card: brand color border or accent header
- Feature list: checkmarks for included, x or dash for excluded
- CTA: primary button on recommended, secondary on others
- Price: text-4xl, bold — the most visually prominent element in each card
- Period: text-sm, neutral-500, immediately after price

OUTPUT: A single React component file with complete implementation.
```

### FAQ Section

```
Build an FAQ section for [CLIENT NAME].

CONTEXT:
- Page type: [landing page / service page / product page]
- FAQ serves dual purpose: objection handling + SEO/AEO

CONTENT:
- Section headline: [e.g., "Frequently Asked Questions"]
- Questions and answers:
  1. Q: [question — phrase as the user would search it]
     A: [answer — first sentence directly answers the question, 2-4 sentences total]
  2. [repeat for 5-7 FAQs]

TECHNICAL REQUIREMENTS:
- Next.js component with TypeScript
- Tailwind CSS, 8pt spacing system
- Accordion pattern: click to expand/collapse
- Only one item open at a time (or configurable)
- Smooth height animation (Framer Motion or CSS transition)
- Include FAQ schema (JSON-LD) in the component or as a separate script
- Accessible: proper ARIA attributes for accordion pattern

DESIGN RULES:
- Section padding: py-16 to py-24
- Max-width: 768px for FAQ content (readability)
- Question: text-lg, semibold, full-width clickable area
- Answer: text-base, neutral-600
- Divider between items: 1px neutral-200
- Expand/collapse icon: chevron or plus/minus, animated on toggle
- Padding inside each item: space-4 to space-5

SCHEMA OUTPUT: Include JSON-LD FAQPage schema with all Q&A pairs.

OUTPUT: A single React component file with schema implementation.
```

### CTA Section

```
Build a call-to-action section for [CLIENT NAME].

CONTEXT:
- Placement: [end of page / mid-page break / standalone]
- Goal: [lead generation / demo request / purchase / contact]

CONTENT:
- Headline: [action-oriented, benefit-driven]
- Description: [1-2 sentences reinforcing the value]
- Primary CTA: [button text]
- Trust element: [optional — "No commitment required" / "Free consultation" / guarantee]

TECHNICAL REQUIREMENTS:
- Next.js component with TypeScript
- Tailwind CSS, 8pt spacing system
- Background: brand color, gradient, or contrasting neutral
- Centered layout
- CTA button: large, high contrast against section background

DESIGN RULES:
- Section padding: py-16 to py-20
- Text: white or contrasting color against background
- Headline: text-3xl to text-4xl, bold, centered
- Description: text-lg, centered, max-width 55ch
- Button: large size, high contrast, stands out as the clear action
- Vertical spacing: space-4 between headline and description, space-6 between description and CTA

OUTPUT: A single React component file with complete implementation.
```

---

## Full Page Template

### Complete Landing Page

```
Build a complete landing page for [CLIENT NAME].

BUSINESS CONTEXT:
- Business: [what they do]
- Target audience: [who they serve, their pain points]
- Primary conversion goal: [what action — book a call, sign up, buy]
- Differentiators: [what makes them unique — 2-3 points]
- Proof points: [results, metrics, number of clients, years in business]

BRAND:
- Colors: primary [HEX], secondary [HEX], neutrals [light/dark preference]
- Typography: [font family for headings, font family for body]
- Voice: [professional/bold/friendly/confident/technical]
- Existing brand assets: [logo URL, imagery style direction]

PAGE STRUCTURE (build in this order):
1. Navigation — logo, 5-7 links, CTA button
2. Hero — headline, subheadline, primary CTA, trust indicator
3. Problem — 3 pain points the audience faces
4. Solution — how [CLIENT NAME] solves each pain point (3 pillars)
5. Social Proof — 3 testimonials with names, titles, specific outcomes
6. How It Works — 3-step process
7. Results — metrics, case study highlight, or before/after
8. FAQ — 5-7 questions (objection handling + SEO/AEO, include schema)
9. Final CTA — restated value prop, primary CTA, risk reversal
10. Footer — contact, social links, legal, sitemap links

TECHNICAL REQUIREMENTS:
- Next.js App Router, TypeScript
- Tailwind CSS
- 8pt spacing system (all values from design_system.md)
- Golden ratio typography scale
- Responsive: mobile-first, breakpoints at 640, 768, 1024, 1280px
- Performance: images optimized with next/image, minimal JS
- SEO: semantic HTML, JSON-LD schema (Organization, Service, FAQ)
- Accessibility: WCAG 2.1 AA compliant
- Each section as a separate component, composed in a page file

DESIGN RULES:
- Follow design_system.md for all spacing, typography, and color decisions
- Visual hierarchy: hero headline is largest text on page, section headings are consistent
- Section backgrounds alternate: white / neutral-50 for visual rhythm
- CTAs are high contrast and unmissable
- White space is generous — never cramped
- Consistent component patterns throughout

OUTPUT:
- Page file (page.tsx) composing all sections
- Individual component files for each section
- Layout file if needed
- Types file for shared interfaces
```

---

## Next.js Component Patterns

### Component File Structure

```typescript
// ComponentName.tsx
import { type FC } from 'react'

interface ComponentNameProps {
  headline: string
  description?: string
  // ... typed props
}

const ComponentName: FC<ComponentNameProps> = ({
  headline,
  description,
}) => {
  return (
    <section aria-label="[descriptive label]" className="py-16 md:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-6 md:px-8 lg:px-12">
        {/* Section content */}
      </div>
    </section>
  )
}

export default ComponentName
```

### Key Patterns

1. **All sections wrapped in `<section>` with `aria-label`**
2. **Container div with max-width and responsive padding**
3. **Props are typed with TypeScript interfaces**
4. **Content is passed via props, not hardcoded**
5. **Responsive classes follow mobile-first: base → md → lg**
6. **Images use `next/image` with width, height, and alt**
7. **Links use `next/link` for internal navigation**
8. **Schema markup rendered as `<script type="application/ld+json">`**

---

## Validation Checklist

After generating any section, verify:

- [ ] All spacing values are multiples of 8 (check Tailwind classes against 8pt system)
- [ ] Typography follows the golden ratio scale
- [ ] Color contrast meets WCAG AA (4.5:1 text, 3:1 UI elements)
- [ ] Component is responsive at all breakpoints
- [ ] Semantic HTML is used (`section`, `nav`, `main`, `article`, `aside`)
- [ ] Images have alt text, width, height, and use next/image
- [ ] Interactive elements have hover, focus, and active states
- [ ] CTA is visually prominent and accessible
- [ ] No hardcoded colors, sizes, or spacing — use design tokens
- [ ] TypeScript types are defined for all props

---

*These templates are starting points, not rigid scripts. Customize for each project while maintaining the quality standards.*
