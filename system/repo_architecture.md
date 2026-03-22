# Repository Architecture

**Why this repo exists, how it's structured, and how it connects to everything else.**

---

## The Single Skill OS Model

This repository is a **mono-knowledge-base** — a single source of truth for all agency-wide skills, standards, and workflows. It is not split across multiple repos because:

1. **Cross-referencing is essential.** Design system rules inform web building skills, which inform prompts, which reference templates. Splitting these across repos creates sync problems and version drift.

2. **AI context loading is simpler.** Claude Code and other AI tools perform best when they can reference a coherent set of documents from one location. One repo means one context window, one set of instructions, one behavioral contract.

3. **Standards are universal.** Naming conventions, markdown formatting, and quality rules apply to every file in the system. A single `standards.md` governs everything.

4. **Onboarding is immediate.** Clone one repo, read one README, follow one workflow. No hunting across multiple repositories to understand how the agency operates.

---

## How Skills Are Modular

Each skill directory (`/skills/{domain}/`) operates as an independent knowledge module:

```
/skills/web_building/
├── million_dollar_websites.md    # Strategic framework
├── design_system.md              # Visual standards
├── claude_templates.md           # AI-ready build prompts
└── anti_gravity_prompts.md       # UI generation prompts
```

**Modularity rules:**

- A skill file must be **self-contained** — readable and useful without requiring other skill files
- A skill file may **reference** other files but must not **depend** on them to be functional
- Skills can be **composed** — a website build references web_building + branding + content_creation
- Skills are **versioned** — breaking changes are documented with dates and rationale

This means you can hand someone `design_system.md` and they can enforce it immediately, even if they've never seen the rest of the repo.

---

## How This Connects to Client Repos

Skill OS is the **upstream knowledge layer**. Client project repos are **downstream consumers**.

```
┌─────────────────────────┐
│   aj-digital-skill-os   │  ← Knowledge, standards, templates
│   (this repo)           │
└───────────┬─────────────┘
            │
            │  Referenced by / informs
            │
    ┌───────┴───────┐
    │               │
    ▼               ▼
┌─────────┐   ┌─────────┐
│ client-a │   │ client-b │  ← Production code repos
│  repo    │   │  repo    │
└─────────┘   └─────────┘
```

**Connection model:**

1. **Pre-build:** Before starting a client project, the relevant skill docs are loaded into the AI context. CLAUDE.md is referenced as the behavior contract.

2. **During build:** Claude Code and Anti-Gravity use templates from `/templates/` and reference skill docs for decision-making. Standards from `/system/standards.md` govern code quality.

3. **Post-build:** Audit prompts from `/prompts/audit/` are used to validate the deliverable against skill doc standards.

4. **Feedback loop:** Lessons learned from client projects are codified back into skill docs, keeping the knowledge base current.

Client repos do **not** import or submodule this repo. The relationship is **reference-based**, not dependency-based. This keeps client repos clean and avoids versioning complexity.

---

## How the Layers Interact

```
Layer 1: SYSTEM (governance)
  ├── repo_architecture.md   → Defines the structure
  ├── workflow.md            → Defines the process
  └── standards.md           → Defines the quality bar

Layer 2: SKILLS (knowledge)
  ├── web_building/          → Domain expertise
  ├── branding/              → Domain expertise
  ├── content_creation/      → Domain expertise
  ├── automation/            → Domain expertise
  └── sales/                 → Domain expertise

Layer 3: PROMPTS (execution triggers)
  ├── research/              → Activates research workflows
  ├── build/                 → Activates build workflows
  └── audit/                 → Activates QA workflows

Layer 4: TEMPLATES (structural scaffolds)
  ├── claude/                → Claude Code execution patterns
  └── anti_gravity/          → Anti-Gravity UI generation
```

**Interaction flow:**

1. **System** sets the rules → informs how Skills are written
2. **Skills** encode expertise → inform what Prompts reference
3. **Prompts** trigger action → use Templates as structural scaffolds
4. **Templates** produce output → validated against System standards

No layer bypasses another. You don't jump from a prompt to output without referencing the relevant skill. You don't create a template that ignores the design system.

---

## Directory Decisions

| Directory    | Purpose                           | Audience                    |
|-------------|-----------------------------------|-----------------------------|
| `/skills/`   | Domain knowledge modules         | AI tools, humans building   |
| `/system/`   | Repo governance and architecture | Anyone contributing         |
| `/prompts/`  | Executable AI instructions       | AI tools consuming          |
| `/templates/`| Structural build scaffolds       | AI tools generating output  |
| `/docs/`     | Operational guidance             | New team members, onboarding|

**Why not a flat structure?**

Flat structures break down at 15+ files. Nested directories with clear naming make it possible to navigate by intuition: "I need a prompt for auditing → `/prompts/audit/`." No guessing, no searching.

**Why markdown?**

- Universal readability (GitHub, VS Code, Claude, any text editor)
- No build step required
- Version control friendly (clean diffs)
- AI models process markdown with high fidelity
- Zero dependencies

---

## Scaling Model

As the agency grows, new skill domains are added as directories:

```
/skills/
  /web_building/       ← exists
  /branding/           ← exists
  /content_creation/   ← exists
  /automation/         ← exists
  /sales/              ← exists
  /seo/                ← future: dedicated deep SEO module
  /analytics/          ← future: data analysis and reporting
  /client_management/  ← future: client communication protocols
  /ai_operations/      ← future: AI tool management and optimization
```

Each new directory follows the same pattern: self-contained, composable, governed by the same standards.

The structure scales linearly. 5 skill domains or 50 — the architecture holds.

---

*Architecture decisions are documented, not assumed. If you're changing the structure, update this file first.*
