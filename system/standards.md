# Standards

**Strict rules for naming, formatting, organization, versioning, and quality across the entire Skill OS.**

These are not guidelines. They are requirements. Every file in this repo must comply.

---

## 1. Naming Conventions

### Files

| Rule                          | Example                        | Violation                      |
|-------------------------------|--------------------------------|--------------------------------|
| Lowercase only                | `design_system.md`             | `Design_System.md`            |
| Underscores for word separation| `million_dollar_websites.md`   | `million-dollar-websites.md`   |
| `.md` extension for all docs  | `workflow.md`                  | `workflow.txt`, `workflow`     |
| Descriptive, specific names   | `website_audit_prompt.md`      | `audit.md`, `prompt1.md`      |
| No abbreviations unless universal | `seo_strategy.md`          | `srch_eng_opt.md`             |
| No version numbers in filenames| `design_system.md`            | `design_system_v2.md`         |

### Directories

| Rule                          | Example                        | Violation                      |
|-------------------------------|--------------------------------|--------------------------------|
| Lowercase only                | `/web_building/`               | `/Web_Building/`              |
| Underscores for word separation| `/content_creation/`           | `/content-creation/`          |
| Singular or descriptive plural | `/skills/`, `/prompts/`        | `/skill/`, `/prompt/`         |
| No nesting beyond 2 levels    | `/skills/web_building/`        | `/skills/web/building/core/`  |

---

## 2. Markdown Formatting

### Document Structure

Every markdown file must follow this structure:

```markdown
# Title

**One-line description of what this file does.**

---

## Section 1

Content...

---

## Section 2

Content...

---

*Footer note (optional — attribution, version, or governance note)*
```

### Headings

| Level | Use For                           | Limit Per File       |
|-------|-----------------------------------|----------------------|
| `#`   | Document title                    | Exactly 1            |
| `##`  | Major sections                    | As needed            |
| `###` | Subsections within a section      | As needed            |
| `####`| Rarely — only when three levels aren't enough | Sparingly   |

**No heading level skipping.** Don't jump from `##` to `####`.

### Formatting Rules

| Element         | Rule                                              |
|-----------------|---------------------------------------------------|
| Bold            | Use for key terms, labels, first mention of concepts |
| Italic          | Use for emphasis, file references in prose         |
| Code (inline)   | Use for file paths, commands, variable names, values |
| Code blocks     | Use for multi-line code, command sequences, structures |
| Tables          | Use for structured comparisons — always with headers |
| Lists           | Use for sequential steps (ordered) or parallel items (unordered) |
| Horizontal rules| Use `---` to separate major sections               |

### Line Length

- No hard wrap at a specific column — let the renderer handle it
- One sentence per line for easier diffs (recommended for prose-heavy files)
- Keep table cells concise — under 60 characters per cell

### Spacing

- One blank line between sections
- One blank line before and after code blocks
- One blank line before and after tables
- No trailing whitespace
- File ends with a single newline

---

## 3. File Organization

### Required Metadata

Every skill file must begin with:

```markdown
# [Skill Name]

**[One-line purpose statement]**

---
```

### Section Requirements by File Type

**Skill files** (`/skills/`) must include:
1. Purpose — what this skill covers
2. Scope — boundaries of this skill
3. Principles — operating rules
4. Frameworks/standards — actionable content
5. Future modules — planned expansions (if applicable)

**Prompt files** (`/prompts/`) must include:
1. Purpose — what this prompt produces
2. Context requirements — what information to provide
3. The prompt itself — ready to copy and execute
4. Expected output — what good output looks like

**Template files** (`/templates/`) must include:
1. Purpose — what this template builds
2. Usage instructions — how to customize and execute
3. The template itself — complete and ready to use
4. Customization points — what to modify per project

**System files** (`/system/`) must include:
1. Purpose — what this document governs
2. Rules — specific, enforceable standards
3. Examples — of correct and incorrect application

---

## 4. Versioning

### Change Documentation

This repo uses **inline version tracking** — not semantic versioning tags.

When making significant changes to a file:

1. Note the change at the bottom of the file or in a changelog section
2. Include the date and a one-line description
3. If the change is breaking (alters how other files reference this one), update all referencing files

**What counts as a breaking change:**
- Renaming a file
- Removing a section that other files reference
- Changing a standard that affects existing content
- Restructuring a directory

**What is not breaking:**
- Adding new content
- Fixing typos or clarifying language
- Expanding a framework with additional detail

### Git Practices

| Rule                              | Requirement                                        |
|-----------------------------------|----------------------------------------------------|
| Commit messages                   | Imperative tense, specific: "Add CRO framework to million_dollar_websites.md" |
| One logical change per commit     | Don't bundle unrelated changes                     |
| Branch naming                     | `feature/skill-name` or `update/file-name`         |
| No force pushing to main          | Protected branch                                   |
| PR required for skill doc changes | Peer review catches quality drift                  |

---

## 5. Documentation Quality

### Content Standards

| Requirement                        | Details                                            |
|------------------------------------|----------------------------------------------------|
| No placeholder text               | Every section must contain real, usable content    |
| No vague language                  | "Use good design" ❌ → "Maintain 4.5:1 contrast ratio for body text" ✅ |
| No unsupported claims             | Back it up with a framework, a metric, or a rationale |
| No redundancy                     | Say it once, say it well, reference it elsewhere   |
| Action-oriented                   | Describe what to do, not just what exists          |
| Audience-aware                    | Write for the person who will use this file        |

### Completeness Test

A file is complete when:

1. A new team member can read it and execute without asking clarifying questions
2. An AI system can reference it and produce output that meets quality standards
3. It does not contain TODO, TBD, WIP, or "coming soon" in any section
4. Every section has actionable content, not just headings

---

## 6. Prompt Quality

### Structure

Every prompt must:

1. **Set the role** — tell the AI who it is and what it's good at
2. **Define the context** — what background information it needs
3. **State the task** — specifically what to produce
4. **Specify constraints** — quality bars, formatting rules, things to avoid
5. **Define output format** — what the response should look like

### Quality Bars

| Metric               | Requirement                                        |
|----------------------|----------------------------------------------------|
| Specificity          | No ambiguous instructions — every directive is actionable |
| Completeness         | The prompt contains everything needed to produce the output |
| Testability          | Running the prompt twice produces consistent quality |
| Reusability          | The prompt works for multiple similar projects with minor customization |
| Token efficiency     | No unnecessary repetition or verbose instructions  |

### Anti-Patterns

- "Make it look good" — vague, subjective, unenforceable
- "Use best practices" — which practices? Be specific
- "Create a professional website" — lacks structure, audience, goal
- "Fix the design" — no diagnosis, no target state

---

## 7. Design Quality

### Non-Negotiable Standards

| Standard                        | Specification                                      |
|---------------------------------|----------------------------------------------------|
| Spacing system                  | All values multiples of 8px                        |
| Typography scale                | Based on golden ratio (1.618) progression          |
| Color contrast                  | WCAG 2.1 AA minimum (4.5:1 text, 3:1 UI)         |
| Touch targets                   | Minimum 44×44px on mobile                          |
| Responsive breakpoints          | 640px, 768px, 1024px, 1280px, 1536px              |
| Max content width               | 1280px (with fluid padding at larger viewports)    |
| Line height                     | 1.5 for body text, 1.2 for headings               |
| Paragraph width                 | 45–75 characters per line for readability          |

### Component Requirements

Every component must:

1. Work at all defined breakpoints without horizontal overflow
2. Accept design tokens — no hardcoded colors, sizes, or spacing
3. Have defined hover, focus, and active states for interactive elements
4. Degrade gracefully when content is shorter or longer than designed
5. Be testable in isolation — not dependent on parent layout

### Layout Requirements

- Use CSS Grid or Flexbox — no floats for layout
- Maintain consistent gutters across grid systems
- Account for content reflow at every breakpoint
- Ensure no horizontal scrollbar at any viewport width

---

## Enforcement

These standards are enforced through:

1. **PR review** — changes are checked against these rules before merge
2. **AI behavior contract** — `CLAUDE.md` references these standards
3. **QA process** — audit prompts validate compliance
4. **Team agreement** — everyone who contributes agrees to follow these rules

Violations are addressed by:

1. Documenting the violation
2. Correcting it in the same PR cycle
3. If the standard is wrong, updating the standard first (with justification), then proceeding

Standards are not bureaucracy. They are quality infrastructure.

---

*Last updated: 2026-03-22*
