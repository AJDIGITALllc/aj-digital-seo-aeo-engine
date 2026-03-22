# Claude Site Build Template

**Complete template for building a production-quality website with Claude Code, pre-loaded with AJ Digital standards.**

---

## Purpose

This template is the starting input for Claude Code when building a new website. It contains all the context, rules, and structure needed to produce output that meets AJ Digital's quality standards from the first iteration.

---

## Usage Instructions

1. Start with a completed project brief (`/templates/_project_brief.md`) — this is your structured input
2. Copy the template below and transfer brief data into the matching sections
3. Ensure `CLAUDE.md` is loaded in the conversation context
4. Send the complete template as your initial prompt
5. Build section by section — do not ask Claude to build the entire site in one message
6. Validate each section against the checklist before moving to the next

> **Relationship to Anti-Gravity template:** This template targets **Claude Code** for full code generation. If you need visual UI mockups first, use `/templates/anti_gravity/site_generation_template.md` to generate the design, then translate it into code using this template. Both templates share the same content structure so project data transfers seamlessly between them.

---

## The Template

```
SYSTEM CONTEXT:
You are building a production website for a premium digital agency client.
You must follow AJ Digital's design system and quality standards exactly.
Reference: CLAUDE.md, design_system.md, million_dollar_websites.md

All output must meet these non-negotiable requirements:
- 8pt spacing system (all values multiples of 8)
- Golden ratio typography scale
- WCAG 2.1 AA accessibility
- Core Web Vitals targets (LCP < 2.5s, INP < 200ms, CLS < 0.1)
- Semantic HTML throughout
- Mobile-first responsive design
- SEO + AEO optimized structure

---

PROJECT BRIEF:

Client: [CLIENT NAME]
Industry: [INDUSTRY]
Business: [ONE-SENTENCE DESCRIPTION OF WHAT THEY DO]
Website: [NEW BUILD / REDESIGN — if redesign, current URL: ___]

Target Audience:
- Primary: [ROLE, COMPANY SIZE, INDUSTRY, KEY PAIN POINTS]
- Secondary: [IF APPLICABLE]

Business Goals:
- Primary: [SPECIFIC OUTCOME — e.g., "Increase qualified leads by 40%"]
- Secondary: [e.g., "Establish authority in the B2B SaaS space"]

Primary Conversion Action: [WHAT VISITORS SHOULD DO — book a call, sign up, purchase]

---

BRAND:

Colors:
- Primary: [HEX CODE]
- Secondary: [HEX CODE]
- Accent: [HEX CODE OR "derive from primary"]
- Neutrals: [LIGHT/DARK PREFERENCE]

Typography:
- Headings: [FONT FAMILY, e.g., "Inter" or "system default"]
- Body: [FONT FAMILY]

Voice: [PROFESSIONAL / BOLD / FRIENDLY / AUTHORITATIVE]
Personality: [1-2 SENTENCE BRAND PERSONALITY DESCRIPTION]

---

TECHNICAL STACK:

Framework: Next.js 14+ (App Router)
Styling: Tailwind CSS
Language: TypeScript
Images: next/image with WebP/AVIF optimization
Animation: Framer Motion (subtle, purposeful only)
Forms: React Hook Form + Zod validation
Deployment: Vercel

---

SITE STRUCTURE:

Pages:
1. [PAGE NAME] — [PURPOSE] — [PRIMARY CTA]
2. [PAGE NAME] — [PURPOSE] — [PRIMARY CTA]
3. [PAGE NAME] — [PURPOSE] — [PRIMARY CTA]
[Continue for all pages]

---

HOMEPAGE SECTIONS (BUILD IN THIS ORDER):

1. Navigation
   - Logo: [LEFT]
   - Links: [LIST ITEMS, e.g., "Services, Work, About, Blog, Contact"]
   - CTA: [BUTTON TEXT, e.g., "Get Started"]
   - Behavior: sticky on scroll, transparent → solid background

2. Hero
   - Headline: [PROVIDED OR "generate based on brief"]
   - Subheadline: [PROVIDED OR "generate — who it's for + outcome"]
   - Primary CTA: [BUTTON TEXT]
   - Secondary CTA: [OPTIONAL]
   - Trust indicator: [e.g., "Trusted by 200+ companies"]
   - Visual: [DESCRIPTION OF HERO IMAGE/VIDEO DIRECTION]

3. Problem / Pain Points
   - [PAIN POINT 1]
   - [PAIN POINT 2]
   - [PAIN POINT 3]

4. Solution / Services
   - [SERVICE 1]: [BRIEF DESCRIPTION + OUTCOME]
   - [SERVICE 2]: [BRIEF DESCRIPTION + OUTCOME]
   - [SERVICE 3]: [BRIEF DESCRIPTION + OUTCOME]

5. Social Proof
   - Testimonials: [NUMBER — provide quotes, names, titles, companies]
   - Client logos: [LIST OR "none yet"]
   - Metrics: [e.g., "200+ projects, 43% avg conversion increase, 98% client retention"]

6. How It Works
   - Step 1: [TITLE] — [DESCRIPTION]
   - Step 2: [TITLE] — [DESCRIPTION]
   - Step 3: [TITLE] — [DESCRIPTION]

7. Results / Case Study
   - [PROVIDE CASE STUDY DATA OR "generate example structure"]

8. FAQ
   - Q1: [QUESTION] — A: [ANSWER]
   - Q2: [QUESTION] — A: [ANSWER]
   [5-7 FAQs — each answer starts with a direct response for AEO]

9. Final CTA
   - Headline: [ACTION-ORIENTED]
   - Description: [REINFORCE VALUE]
   - CTA: [SAME AS HERO CTA FOR CONSISTENCY]
   - Risk reversal: [e.g., "No commitment required", "Free consultation"]

10. Footer
    - Contact: [ADDRESS, PHONE, EMAIL]
    - Social: [LINKS]
    - Legal: [PRIVACY, TERMS]
    - Sitemap links: [KEY PAGES]
    - Newsletter: [IF APPLICABLE]

---

SEO REQUIREMENTS:

Homepage:
- Title: [KEYWORD-INFORMED, < 60 CHARS]
- Description: [ACTION-ORIENTED, < 155 CHARS]
- H1: [HERO HEADLINE]

Schema markup (JSON-LD):
- Organization: name, url, logo, contact, social profiles
- Service: for each service offered
- FAQ: from FAQ section
- BreadcrumbList: on all interior pages

[REPEAT SEO BLOCK FOR EACH PAGE]

---

COMPONENT ARCHITECTURE:

Build components in this order:
1. Layout (root layout with metadata, fonts, analytics)
2. Navigation component
3. Footer component
4. Hero component
5. Section components (in homepage order)
6. Shared components (Button, Card, SectionHeader, Container)
7. Page compositions

Each component:
- Self-contained with typed props (TypeScript interface)
- Uses Tailwind CSS with design system tokens
- Responsive (mobile-first breakpoints at sm/md/lg/xl)
- Accessible (semantic HTML, ARIA where needed, keyboard nav)
- Follows 8pt spacing system strictly

---

OUTPUT INSTRUCTIONS:

1. Build one section at a time
2. After each section, I will review and approve before moving on
3. Use consistent naming: PascalCase for components, kebab-case for files
4. Export all components from index files
5. Include all necessary imports
6. Do not use placeholder "Lorem ipsum" text — use the content from the brief
   or generate contextually appropriate content
7. Include inline comments only when logic is non-obvious
```

---

## Customization Points

| Section           | What to Customize                              |
|-------------------|------------------------------------------------|
| Project Brief     | All client-specific information                 |
| Brand             | Colors, typography, voice                       |
| Technical Stack   | Only change if project requires different tech  |
| Site Structure    | Pages and their purposes                        |
| Homepage Sections | Content for every section                       |
| SEO Requirements  | Keywords and meta content per page              |

---

## Post-Build Validation

After the site is built, run the website audit prompt (`/prompts/audit/website_audit_prompt.md`) to validate:

- [ ] All spacing values are 8pt multiples
- [ ] Typography follows golden ratio scale
- [ ] CRO elements are present (CTAs, trust signals, hierarchy)
- [ ] SEO is implemented (meta tags, schema, semantic HTML)
- [ ] AEO patterns are present (FAQ schema, Q&A structure)
- [ ] Performance targets are met
- [ ] Accessibility passes WCAG 2.1 AA
- [ ] Responsive at all breakpoints
- [ ] No placeholder content remains

---

*This template is the bridge between strategy and execution. Fill it in thoroughly, and the build executes itself.*
