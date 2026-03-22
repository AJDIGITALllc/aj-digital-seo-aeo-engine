# Onboarding

**How to use the AJ Digital Skill OS, contribute to it, and maintain consistency.**

---

## Welcome

You've been given access to the most important repository at AJ Digital. This is not a codebase — it's the knowledge layer that powers every project we build. Treat it accordingly.

---

## Step 1: Understand the Architecture

Read these files in order:

1. **`README.md`** — what this system is and why it exists
2. **`system/index.md`** — complete file map with cross-references (start here to see the full picture)
3. **`system/repo_architecture.md`** — how the repo is structured and why
4. **`system/standards.md`** — the quality rules everything follows
5. **`system/workflow.md`** — the end-to-end process for every project
6. **`system/execution_mode.md`** — the four operational modes (Research → Strategy → Build → Optimization)
7. **`CLAUDE.md`** — how AI behaves when building for us

Time investment: approximately 30 minutes. This is not optional.

---

## Step 2: Understand the Skills

Browse the `/skills/` directory. Each subdirectory is a domain of expertise:

| Directory             | What It Covers                              |
|-----------------------|---------------------------------------------|
| `/skills/web_building/`   | Website strategy, design systems, build templates |
| `/skills/branding/`       | Brand identity and strategy                 |
| `/skills/content_creation/`| Content strategy and production            |
| `/skills/automation/`     | Business and workflow automation            |
| `/skills/sales/`          | Sales process and conversion systems        |

**Start with web_building** — it's the most developed and most frequently used.

Read in this order:
1. `million_dollar_websites.md` — strategic framework
2. `design_system.md` — visual rules
3. `claude_templates.md` — how we prompt AI to build
4. `anti_gravity_prompts.md` — how we generate UI

---

## Step 3: Use Skills in Claude Code

When starting a build with Claude Code:

### Prepare the Context

1. Open the project conversation
2. Reference `CLAUDE.md` as the system instruction
3. Provide relevant skill docs based on what you're building:
   - Building a landing page → `million_dollar_websites.md` + `design_system.md`
   - Setting up a design system → `design_system.md` (primary focus)
   - Writing a research brief → load `/prompts/research/senior_research_prompt.md`

### Feed the Right Template

1. Check `/templates/claude/` for a matching template
2. Fill in the project-specific details (client name, goals, audience, brand)
3. Send the filled template to Claude Code
4. Build section by section — don't request an entire site in one prompt

### Validate Output

After each build section:
- Does the spacing follow the 8pt system?
- Does the typography follow the golden ratio scale?
- Are CTA placements aligned with CRO principles?
- Is the HTML semantic and accessible?
- Does it meet the performance targets in CLAUDE.md?

If any answer is "no," reference the specific standard and ask Claude to fix it.

---

## Step 4: Add a New Skill

When you learn something new that should be codified:

### Determine If It's a New File or an Update

- **New file:** The topic doesn't fit cleanly into any existing skill file
- **Update:** The topic extends an existing skill's coverage

Most contributions are updates, not new files. Prefer expanding existing docs over creating new ones.

### Create a New Skill File

1. **Choose the right directory.** If the skill is about web building, it goes in `/skills/web_building/`. If no directory fits, propose a new one.

2. **Name the file.** Follow naming conventions in `system/standards.md`:
   - Lowercase, underscores, `.md` extension
   - Descriptive and specific: `conversion_copywriting.md`, not `copy.md`

3. **Use this structure:**

```markdown
# [Skill Name]

**[One-line purpose statement]**

---

## Purpose

What this skill covers and why it matters to AJ Digital's work.

---

## Scope

What's included and — equally important — what's NOT included.
Reference other skill files for adjacent topics.

---

## Principles

The operating rules for this domain. 3–7 principles, each with a rationale.

---

## [Core Framework Sections]

The actionable content. This is the bulk of the file.
Frameworks, standards, patterns, decision trees — whatever makes this skill executable.

---

## Future Modules

Planned expansions for this skill area. Brief descriptions, not full outlines.

---

*[Governance note]*
```

4. **Write real content.** No placeholders, no "TBD," no "coming soon." If the content isn't ready, the file isn't ready.

5. **Validate against standards.** Run through the checklist in `system/standards.md` Section 5 (Documentation Quality).

### Update an Existing Skill File

1. Read the entire file first — understand the existing structure and content
2. Find the right section for your addition
3. Match the existing tone, formatting, and detail level
4. If your change is substantial, note it at the bottom of the file with a date

---

## Step 5: Maintain Consistency

### Before Every Commit

Ask yourself:

- [ ] Does this file follow `system/standards.md`?
- [ ] Is every section actionable (not just descriptive)?
- [ ] Would a new team member understand this without my explanation?
- [ ] Does it reference other relevant skill docs where appropriate?
- [ ] Is the formatting clean — consistent headings, proper tables, no trailing whitespace?

### Common Mistakes to Avoid

| Mistake                     | Why It's a Problem                              | Fix                            |
|-----------------------------|--------------------------------------------------|--------------------------------|
| Vague guidance              | Can't be enforced or validated                   | Add specific numbers, rules    |
| Orphan files                | Nobody knows they exist or when to use them     | Reference them in relevant docs|
| Duplicate content           | Two sources of truth creates confusion           | Write once, reference elsewhere|
| Style drift                 | Inconsistent tone/formatting erodes trust        | Follow the standards strictly  |
| Placeholder sections        | Signals the doc is incomplete = can't be trusted | Only commit complete content   |

---

## Getting Help

- **Architecture questions:** Read `system/repo_architecture.md` first, then ask
- **Standard questions:** Read `system/standards.md` — the answer is probably there
- **Workflow questions:** Read `system/workflow.md` — it covers the full process
- **AI behavior questions:** Read `CLAUDE.md` — it defines the complete contract
- **Everything else:** Contact dev@audiojones.com

---

*Welcome to the team. Build things that matter.*
