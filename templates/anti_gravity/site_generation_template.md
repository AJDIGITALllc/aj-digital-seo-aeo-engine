# Anti-Gravity Site Generation Template

**Structured template for generating premium website UI with Anti-Gravity, aligned to AJ Digital's design and conversion standards.**

---

## Purpose

This template gives Anti-Gravity the complete context it needs to generate UI that looks like it was designed by a senior product designer with CRO expertise. It encodes design direction, content structure, and quality expectations into a single input.

---

## Usage Instructions

1. Start with a completed project brief (`/templates/_project_brief.md`) — this is your structured input
2. Copy the template below and transfer brief data into the matching sections
3. Review the design direction section — select or customize a style
4. Feed the complete template to Anti-Gravity
5. Evaluate the output against the validation checklist at the bottom
6. Iterate with specific refinements, not vague requests

> **Relationship to Claude build template:** This template targets **Anti-Gravity** for visual UI generation. After validating the design output, transfer the project data into `/templates/claude/site_build_template.md` to build the production code. Both templates share the same content structure intentionally — fill in the project brief once, reuse across both tools.

---

## The Template

```
GENERATE A PREMIUM WEBSITE DESIGN

---

PROJECT:
- Client: [CLIENT NAME]
- Industry: [INDUSTRY]
- Business: [ONE-SENTENCE DESCRIPTION]
- Website type: [MARKETING SITE / LANDING PAGE / SAAS PRODUCT / PORTFOLIO / ECOMMERCE]

---

AUDIENCE:
- Who visits: [ROLE, DEMOGRAPHICS — e.g., "Marketing directors at B2B SaaS companies, 30-50, US-based"]
- What they need: [PRIMARY NEED — e.g., "a reliable agency to redesign their website for better conversions"]
- What they fear: [PRIMARY CONCERN — e.g., "wasting budget on a site that doesn't perform"]

---

DESIGN DIRECTION:

Style: [SELECT ONE]
□ Modern Minimalist — clean lines, generous white space, neutral palette with one bold accent
□ Bold and Energetic — high contrast, dynamic layouts, vibrant colors
□ Elegant and Refined — serif headings, muted colors, editorial feel
□ Corporate Professional — structured grids, blue/navy tones, data-forward
□ Custom: [DESCRIBE THE DESIRED AESTHETIC IN 2-3 SENTENCES]

Color palette:
- Primary: [HEX OR DESCRIPTION — e.g., "#2563EB" or "deep blue"]
- Accent: [HEX OR DESCRIPTION]
- Background: [WHITE / LIGHT GRAY / DARK]
- Text: [DARK ON LIGHT / LIGHT ON DARK]

Typography feel:
- Headings: [CLEAN SANS-SERIF / EDITORIAL SERIF / GEOMETRIC MODERN / BOLD DISPLAY]
- Body: [READABLE SANS-SERIF]

Imagery:
- Style: [PHOTOGRAPHY / ILLUSTRATION / ABSTRACT / PRODUCT MOCKUPS]
- Mood: [BRIGHT AND AIRY / DARK AND MOODY / CORPORATE / LIFESTYLE]
- People: [INCLUDE PEOPLE / PRODUCT ONLY / ABSTRACT]

---

PAGE STRUCTURE AND CONTENT:

NAVIGATION:
- Logo: left-aligned
- Items: [LIST — e.g., "Services, Work, About, Blog, Contact"]
- CTA button: [BUTTON TEXT — e.g. "Get Started"]
- Style: clean, minimal, sticky on scroll

---

SECTION 1: HERO
- Layout: [TEXT LEFT + IMAGE RIGHT / CENTERED TEXT + BACKGROUND IMAGE / FULL-WIDTH WITH OVERLAY]
- Headline: "[PROVIDED HEADLINE — or direction: 'benefit-driven, under 10 words']"
- Subheadline: "[PROVIDED — or 'who it's for + the outcome they get']"
- Primary CTA: "[BUTTON TEXT]" — large, high contrast, impossible to miss
- Trust indicator: "[e.g., 'Trusted by 200+ companies' or a row of logos]"
- Visual: [DESCRIBE THE IMAGE/VISUAL — e.g., "product dashboard mockup on a laptop"]

DESIGN NOTES: The hero sets the premium tone. Generous padding (128px+ top and bottom).
Headline is the largest text on the page. CTA button stands out against everything.

---

SECTION 2: PROBLEM / PAIN POINTS
- Layout: [3 COLUMNS WITH ICONS / SINGLE COLUMN NARRATIVE / ALTERNATING LEFT-RIGHT]
- Content:
  - Pain point 1: [TITLE] — [ONE-SENTENCE DESCRIPTION]
  - Pain point 2: [TITLE] — [ONE-SENTENCE DESCRIPTION]
  - Pain point 3: [TITLE] — [ONE-SENTENCE DESCRIPTION]

DESIGN NOTES: This section validates the visitor's frustration. Visual tone is empathetic but
confident. Use subtle background color (light gray or very light brand tint) to differentiate from hero.

---

SECTION 3: SOLUTION / FEATURES
- Layout: [ICON + TITLE + DESCRIPTION CARDS IN 3-COLUMN GRID / ALTERNATING IMAGE-TEXT BLOCKS]
- Content:
  - Feature 1: [TITLE] — [BENEFIT STATEMENT]
  - Feature 2: [TITLE] — [BENEFIT STATEMENT]
  - Feature 3: [TITLE] — [BENEFIT STATEMENT]
  [Add more if needed]

DESIGN NOTES: Each feature focuses on the outcome, not the feature itself.
Icons are consistent in style and size (48px). Cards have equal height.

---

SECTION 4: SOCIAL PROOF
- Layout: [TESTIMONIAL CARDS / SINGLE LARGE QUOTE / CAROUSEL]
- Content:
  - Testimonial 1: "[QUOTE]" — [NAME], [TITLE] at [COMPANY]
  - Testimonial 2: "[QUOTE]" — [NAME], [TITLE] at [COMPANY]
  [Optional: client logo strip below or above]

DESIGN NOTES: Place near a CTA or conversion point. Photos of real people increase trust.
Specific results in quotes ("43% increase in leads") outperform vague praise.

---

SECTION 5: HOW IT WORKS
- Layout: [3-STEP HORIZONTAL WITH NUMBERS/ICONS / VERTICAL TIMELINE]
- Content:
  - Step 1: [TITLE] — [WHAT HAPPENS]
  - Step 2: [TITLE] — [WHAT HAPPENS]
  - Step 3: [TITLE] — [OUTCOME]

DESIGN NOTES: This reduces perceived complexity. Numbers should be prominent (large,
brand-colored). Each step is brief — one sentence per step.

---

SECTION 6: RESULTS / METRICS
- Layout: [LARGE STAT COUNTERS / CASE STUDY CARD / BEFORE-AFTER]
- Content:
  - Metric 1: [NUMBER] — [WHAT IT MEANS — e.g., "200+ Projects Delivered"]
  - Metric 2: [NUMBER] — [WHAT IT MEANS]
  - Metric 3: [NUMBER] — [WHAT IT MEANS]
  [Or: brief case study with challenge → solution → result]

DESIGN NOTES: Numbers are the visual hero of this section. Large, bold, brand-colored.
Supporting text is small and secondary. This section builds confidence.

---

SECTION 7: FAQ
- Layout: accordion / expandable items
- Content:
  - Q1: [QUESTION] — A: [ANSWER]
  - Q2: [QUESTION] — A: [ANSWER]
  - Q3: [QUESTION] — A: [ANSWER]
  [5-7 questions that handle objections]

DESIGN NOTES: Max-width 768px for readability. Clean dividers between items. Questions
are prominent (semibold), answers are regular weight. One item expanded by default.

---

SECTION 8: FINAL CTA
- Layout: centered text block on contrasting background
- Content:
  - Headline: "[RESTATED VALUE PROPOSITION]"
  - Description: "[1-2 SENTENCES — reinforce what they get]"
  - CTA: "[SAME BUTTON TEXT AS HERO]"
  - Trust line: "[RISK REVERSAL — e.g., 'Free consultation. No commitment.']"

DESIGN NOTES: Strong visual contrast from preceding section. This is the page's
closing argument. Make the CTA button the most prominent element.

---

FOOTER:
- Contact: [EMAIL, PHONE, ADDRESS]
- Navigation: [REPEAT KEY LINKS]
- Social: [PLATFORM LINKS]
- Legal: [PRIVACY, TERMS, COPYRIGHT]
- Newsletter: [INCLUDE / EXCLUDE]

---

OVERALL DESIGN RULES:
1. Generous white space between all sections (96px+ desktop)
2. Strong typographic hierarchy — headline sizes decrease predictably
3. Consistent 8px spacing rhythm in all padding, margins, and gaps
4. Primary CTA color is consistent across the entire page
5. Alternating section backgrounds for visual rhythm (white → light → white)
6. Mobile-responsive — stacks cleanly, maintains hierarchy, CTAs remain prominent
7. Maximum content width: 1280px with padding on both sides
8. No clutter — every element earns its space on the page
9. Premium feel — this should look like a $50K website, not a template

CONVERSION RULES:
1. CTA visible above the fold
2. Trust signals near every CTA
3. One primary action per section
4. Visual hierarchy guides the eye to the action
5. Objections addressed before the final CTA
6. Form fields minimized (if forms are present)
```

---

## Customization Points

| Section          | What to Customize                               |
|------------------|------------------------------------------------|
| Design Direction | Style, colors, typography, imagery             |
| Page Structure   | Sections and their order (add/remove as needed)|
| Content          | All headlines, descriptions, testimonials, FAQs|
| Layout Choices   | Column arrangements, hero layouts, card styles |
| Design Notes     | Per-section refinements for specific needs     |

---

## Post-Generation Validation

After Anti-Gravity generates the design:

- [ ] Visual hierarchy is immediately clear — you know what to look at first
- [ ] CTA buttons are the most prominent interactive elements
- [ ] Spacing feels generous and consistent — no cramped sections
- [ ] Color usage is restrained — accent color draws attention to CTAs
- [ ] Typography scales nicely — large headlines, comfortable body text
- [ ] Trust signals are visible and placed near conversion points
- [ ] Mobile layout is intentional (not just a squished desktop)
- [ ] Overall aesthetic matches the requested design direction
- [ ] Every section has a clear purpose in the conversion funnel
- [ ] The page feels premium — appropriate for a $10K+ service

---

## From UI to Code

After validating the Anti-Gravity output:

1. Use the Claude site build template (`/templates/claude/site_build_template.md`) to translate the design into code
2. Reference the generated UI as the visual target
3. Ensure the code implementation follows `design_system.md` exactly
4. Run the website audit prompt for final validation

---

*Anti-Gravity designs the vision. Claude Code builds the reality. This template ensures they speak the same language.*
