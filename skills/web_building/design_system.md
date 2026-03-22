# Design System

**Strict visual standards for spacing, typography, color, layout, and component design across all AJ Digital projects.**

---

## Purpose

This design system eliminates visual inconsistency. Every spacing value, font size, color choice, and layout decision is governed by these rules. When in doubt, reference this file — not intuition.

---

## Scope

- 8pt spacing system (mandatory)
- Golden ratio typography scale
- Typography hierarchy
- Grid and layout system
- Color system with accessibility requirements
- White space rules
- Component design rules
- Layout composition rules

This file governs visual implementation. For strategic decisions (what to build and why), see `million_dollar_websites.md`.

---

## 8pt Spacing System

All spacing values in every project must be multiples of 8. No exceptions.

### Spacing Scale

| Token       | Value   | CSS Variable          | Use Case                                   |
|-------------|---------|----------------------|---------------------------------------------|
| `space-1`   | 8px     | `--space-1: 0.5rem`  | Icon gaps, tight inline spacing             |
| `space-2`   | 16px    | `--space-2: 1rem`    | Standard element gaps, input padding        |
| `space-3`   | 24px    | `--space-3: 1.5rem`  | Card padding, list item spacing             |
| `space-4`   | 32px    | `--space-4: 2rem`    | Group spacing, subsection gaps              |
| `space-5`   | 40px    | `--space-5: 2.5rem`  | Component separation                        |
| `space-6`   | 48px    | `--space-6: 3rem`    | Major group separation                      |
| `space-8`   | 64px    | `--space-8: 4rem`    | Section padding (mobile)                    |
| `space-10`  | 80px    | `--space-10: 5rem`   | Section padding (tablet)                    |
| `space-12`  | 96px    | `--space-12: 6rem`   | Section padding (desktop)                   |
| `space-16`  | 128px   | `--space-16: 8rem`   | Hero sections, major landmark spacing       |
| `space-20`  | 160px   | `--space-20: 10rem`  | Maximum section spacing                     |

### Spacing Rules

1. **Section vertical padding:** `space-8` (mobile) → `space-10` (tablet) → `space-12` (desktop)
2. **Component internal padding:** `space-3` minimum
3. **Between sibling components:** `space-4` to `space-6`
4. **Between sections:** `space-8` to `space-16`
5. **Button padding:** `space-2` vertical, `space-3` to `space-4` horizontal
6. **Form inputs:** `space-2` padding, `space-3` between fields
7. **Card padding:** `space-3` (compact) to `space-4` (standard)
8. **Grid gutters:** `space-3` (mobile) → `space-4` (desktop)

### Rejected Values

These are **never** acceptable: 5px, 10px, 12px, 15px, 17px, 20px, 25px, 30px, 35px, 50px, 60px, 75px, 100px.

If a design calls for 10px, use 8px. If it calls for 20px, use 16px or 24px. Always round to the nearest multiple of 8.

---

## Golden Ratio Typography

### The Scale

Base size: **16px** (1rem). Each step up multiplies by **1.618** (golden ratio), rounded to the nearest pixel.

| Level     | Size      | rem       | Line Height | Use                           |
|-----------|-----------|-----------|-------------|-------------------------------|
| `text-xs` | 12px      | 0.75rem   | 1.5         | Captions, legal text, labels  |
| `text-sm` | 14px      | 0.875rem  | 1.5         | Secondary text, metadata      |
| `text-base`| 16px     | 1rem      | 1.5         | Body text, paragraphs         |
| `text-lg` | 18px      | 1.125rem  | 1.5         | Lead text, card descriptions  |
| `text-xl` | 20px      | 1.25rem   | 1.4         | Subheadings, card titles      |
| `text-2xl`| 26px      | 1.625rem  | 1.3         | Section subheadings           |
| `text-3xl`| 32px      | 2rem      | 1.25        | Section headings              |
| `text-4xl`| 42px      | 2.625rem  | 1.2         | Page titles                   |
| `text-5xl`| 52px      | 3.25rem   | 1.15        | Hero headings (mobile)        |
| `text-6xl`| 68px      | 4.25rem   | 1.1         | Hero headings (desktop)       |
| `text-7xl`| 84px      | 5.25rem   | 1.05        | Display text (use sparingly)  |

### Typography Rules

1. **Font families:** Maximum 2 per project — one for headings, one for body. System fonts are acceptable and preferred for performance.

2. **Font weights:**
   - Regular (400): Body text
   - Medium (500): Emphasized body text, navigation
   - Semibold (600): Subheadings, button text
   - Bold (700): Headings

3. **Line height:**
   - Body text: 1.5 (24px at 16px base)
   - Headings: 1.1–1.3 (decreases as size increases)

4. **Paragraph width:** 45–75 characters per line. 65 characters is optimal. Use `max-width: 65ch` on text containers.

5. **Letter spacing:**
   - Body text: 0 (normal)
   - Headings: -0.01em to -0.02em (tighten slightly at large sizes)
   - All caps: +0.05em to +0.1em (always increase for readability)

6. **Responsive scaling:** Headings scale down on mobile. Use `clamp()` for fluid sizing:
   ```css
   font-size: clamp(2rem, 5vw, 4.25rem);
   ```

---

## Typography Hierarchy

### Required Heading Cascade

```
H1: text-5xl → text-6xl (responsive)  | Page title / Hero headline
H2: text-3xl → text-4xl (responsive)  | Major section headings
H3: text-2xl                           | Subsection headings
H4: text-xl                            | Group headings, card titles
H5: text-lg (semibold)                 | Label headings
H6: text-base (semibold, uppercase)    | Overline text, category labels
```

### Rules

- **One H1 per page.** Always.
- **Sequential nesting.** No skipping from H2 to H4.
- **Headings are not for styling.** Use a heading tag for semantic meaning, use CSS classes for visual size. An H3 that needs to be big is still an H3.
- **Heading content is concise.** Under 10 words for H1/H2. Under 8 words for H3+.

---

## Grid System

### Container

```css
.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 24px;   /* mobile: space-3 */
}

@media (min-width: 768px) {
  .container {
    padding: 0 32px;  /* tablet: space-4 */
  }
}

@media (min-width: 1024px) {
  .container {
    padding: 0 48px;  /* desktop: space-6 */
  }
}
```

### Grid

Use CSS Grid with consistent gutters:

```css
.grid {
  display: grid;
  gap: 24px;          /* space-3 base */
  grid-template-columns: 1fr;
}

@media (min-width: 768px) {
  .grid {
    gap: 32px;        /* space-4 tablet */
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .grid-3 {
    grid-template-columns: repeat(3, 1fr);
  }
  .grid-4 {
    grid-template-columns: repeat(4, 1fr);
  }
}
```

### Golden Ratio Layouts

For content-sidebar layouts, apply the golden ratio:

```
Content: 61.8% (≈ 792px at 1280px)
Sidebar: 38.2% (≈ 488px at 1280px)
```

```css
.layout-golden {
  display: grid;
  grid-template-columns: 1fr;
  gap: 32px;
}

@media (min-width: 1024px) {
  .layout-golden {
    grid-template-columns: 1.618fr 1fr;
  }
}
```

---

## Color System

### Structure

Every project defines these color roles:

| Role         | Purpose                                  | Example         |
|-------------|------------------------------------------|-----------------|
| `primary`    | Brand color, primary CTAs, key accents   | #2563EB (blue)  |
| `secondary`  | Supporting brand color, secondary actions | #7C3AED (purple)|
| `neutral`    | Text, backgrounds, borders               | Gray scale      |
| `success`    | Positive feedback, confirmations         | #059669 (green) |
| `warning`    | Caution states, warnings                 | #D97706 (amber) |
| `error`      | Error states, destructive actions        | #DC2626 (red)   |

### Neutral Scale

Define 10 neutral steps:

| Token           | Light Theme         | Dark Theme          |
|-----------------|---------------------|---------------------|
| `neutral-50`    | #FAFAFA (page bg)   | #171717 (page bg)   |
| `neutral-100`   | #F5F5F5 (card bg)   | #1F1F1F (card bg)   |
| `neutral-200`   | #E5E5E5 (borders)   | #2E2E2E (borders)   |
| `neutral-300`   | #D4D4D4 (disabled)  | #404040 (disabled)  |
| `neutral-400`   | #A3A3A3 (placeholder)| #525252 (placeholder)|
| `neutral-500`   | #737373 (secondary text)| #737373 (secondary text)|
| `neutral-600`   | #525252 (body text) | #A3A3A3 (body text) |
| `neutral-700`   | #404040 (headings)  | #D4D4D4 (headings)  |
| `neutral-800`   | #262626 (bold text) | #E5E5E5 (bold text) |
| `neutral-900`   | #171717 (highest contrast)| #FAFAFA (highest contrast)|

### Accessibility Requirements

| Combination                  | Minimum Ratio | Standard        |
|-----------------------------|---------------|-----------------|
| Body text on background     | 4.5:1         | WCAG AA         |
| Large text (≥24px or ≥18.5px bold) on background | 3:1 | WCAG AA |
| UI elements on background   | 3:1           | WCAG AA         |
| Primary CTA text on CTA bg  | 4.5:1         | WCAG AA         |

**Test every color combination** before using it. Tools: WebAIM Contrast Checker, Chrome DevTools Contrast Ratio.

### Color Usage Rules

1. **Primary color:** Used for CTAs, links, active states, key brand elements. Not for large background areas.
2. **Neutral colors:** Used for 80%+ of the page. Text, backgrounds, borders, dividers.
3. **Semantic colors:** Used only for their intended purpose — success for success, error for errors. Never decorative.
4. **Limit accent usage:** The more color you use, the less impact any single color has. Restraint creates emphasis.
5. **Dark mode:** Define all colors as CSS custom properties. Switch values at the root level, not per-component.

---

## White Space Rules

### Principles

1. **White space is not empty space.** It is a design element that creates hierarchy, groups, and breathing room.

2. **More important elements get more space.** A hero section gets `space-16` padding. A card body gets `space-3`. The difference communicates importance.

3. **Proximity = relationship.** Elements that are closer together are perceived as related. Use spacing to group and separate.

4. **Consistent margins > clever asymmetry.** Asymmetric spacing must be intentional and systematic. Default to symmetric.

### Specific Rules

| Scenario                        | Spacing                          |
|---------------------------------|----------------------------------|
| Between heading and body text   | `space-2` (16px)                 |
| Between paragraphs              | `space-3` (24px)                 |
| Between subsections             | `space-5` (40px)                 |
| Between major sections          | `space-12` (96px desktop)        |
| Hero padding (top/bottom)       | `space-16` (128px desktop)       |
| Card internal padding           | `space-3` to `space-4`          |
| Between grid items              | `space-3` to `space-4`          |
| Between form fields             | `space-3` (24px)                 |
| Between a label and its input   | `space-1` (8px)                  |

### The Breathing Test

When reviewing a layout, ask:
- Does every section have enough space to be perceived as separate?
- Is the hero comfortably large or does it feel cramped?
- Can you identify content groups by white space alone (without borders)?
- Does the footer feel like an ending or a collision with the last section?

If any answer is "no," add more space.

---

## Component Rules

### Buttons

| Type        | Style                                      | Use Case                        |
|-------------|--------------------------------------------|---------------------------------|
| Primary     | Filled, brand color, white text            | Main action (1 per section max) |
| Secondary   | Outlined, brand color border               | Alternative action              |
| Tertiary    | Text only, brand color, no border          | Low-priority navigation         |
| Destructive | Filled, error color                        | Delete, cancel, remove          |

**Button sizing:**

| Size    | Padding            | Font Size   | Min Width  |
|---------|--------------------|-------------|------------|
| Small   | 8px 16px           | text-sm     | 80px       |
| Medium  | 12px 24px          | text-base   | 120px      |
| Large   | 16px 32px          | text-lg     | 160px      |

**Note:** Button padding uses 12px (not a strict 8pt multiple) because 12px vertical with text-base line height produces a 44px+ touch target. Pragmatic exception documented here.

**States:**

| State    | Visual Change                               |
|----------|---------------------------------------------|
| Default  | Base styling                                |
| Hover    | Slightly darker/lighter (5-10% shift)       |
| Focus    | Visible ring (2px offset, contrasting color) |
| Active   | Darker than hover (pressed state)           |
| Disabled | 50% opacity, no cursor pointer              |
| Loading  | Spinner replaces text or appears inline     |

### Cards

```
┌─────────────────────────────┐
│  Image (optional, top)      │  ← aspect-ratio: 16/9 or 3/2
├─────────────────────────────┤
│  Padding: space-3 to space-4│
│  ┌─ Overline (optional)     │  ← text-xs, uppercase, brand color
│  │  Heading                 │  ← text-xl, semibold
│  │  Description             │  ← text-base, neutral-600
│  │  CTA or link             │  ← text-sm, semibold, brand color
│  └──────────────────────────│
└─────────────────────────────┘
```

**Card rules:**
- Consistent border-radius: 8px (space-1) or 16px (space-2)
- Subtle shadow or border — not both
- Equal height in grid layouts (use flexbox stretch)
- Hover state: subtle elevation or border color change

### Forms

- Labels above inputs (not beside, not floating)
- Input height: 48px (space-6) for comfortable touch targets
- Border: 1px, neutral-300
- Focus: brand color border, optional ring
- Error: error color border, error message below input
- Spacing between fields: space-3
- Submit button: full-width on mobile, auto-width on desktop

### Navigation

- Height: 64px (space-8) to 80px (space-10)
- Fixed or sticky at top
- Logo: left-aligned
- Links: center or right-aligned
- CTA: right-most, visually distinct
- Mobile: hamburger icon, full-screen overlay menu
- Active state: underline, bold, or color change

---

## Layout Composition Rules

### Section Anatomy

Every section follows this structure:

```
┌── Section Container ────────────────────────────────────┐
│  padding-top: space-12 (desktop)                        │
│  ┌── Container (max-width: 1280px, centered) ─────────┐│
│  │  ┌── Section Header ─────────────────────────────┐  ││
│  │  │  Overline (optional)                           │  ││
│  │  │  Heading (H2)                                  │  ││
│  │  │  Description (optional, max-width: 65ch)       │  ││
│  │  └────────────────────────────────────────────────┘  ││
│  │  gap: space-6 to space-8                             ││
│  │  ┌── Section Content ────────────────────────────┐  ││
│  │  │  Grid, cards, text, media — whatever fits     │  ││
│  │  └────────────────────────────────────────────────┘  ││
│  └──────────────────────────────────────────────────────┘│
│  padding-bottom: space-12 (desktop)                     │
└─────────────────────────────────────────────────────────┘
```

### Alignment

- Section headers: center-aligned for symmetrical layouts, left-aligned for content-heavy sections
- Body text: always left-aligned (never center-aligned for paragraphs)
- CTAs: center-aligned when alone, left-aligned when after content
- Grid items: top-aligned within rows

### Rhythm

Maintain vertical rhythm by:
1. Using consistent section padding throughout the page
2. Keeping element spacing proportional to element size
3. Alternating section backgrounds (white / neutral-50) for visual separation
4. Ensuring the "beat" of the page feels predictable and comfortable

---

## Enforcement

This design system is enforced through:

1. **CLAUDE.md** — AI tools are instructed to reject non-compliant values
2. **Code review** — visual QA checks spacing, color, and typography against this doc
3. **Design tokens** — implemented as CSS custom properties, not magic numbers
4. **Audit prompts** — QA audits reference this file for compliance checks

If a project needs to deviate from this system, the deviation must be:
- Documented in the project brief
- Justified with a design rationale
- Approved before implementation

---

*This design system is the visual constitution. Follow it. Every pixel matters.*
