# File Index

**Complete map of every file in Skill OS, its purpose, and what references it.**

---

## Root

| File | Purpose | Referenced By |
|------|---------|---------------|
| `README.md` | Repo overview, structure, usage instructions | Entry point |
| `CLAUDE.md` | AI behavioral contract — enforces design, CRO, SEO, accessibility | All build workflows, templates |
| `LICENSE.md` | Proprietary license terms | README |
| `.gitignore` | Git ignore rules (OS files, editor files, node_modules) | Git |
| `CHANGELOG.md` | Version history and upgrade traceability | README, contributors |

---

## System (`/system/`)

| File | Purpose | Referenced By |
|------|---------|---------------|
| `index.md` | This file — repo-wide file map | README, onboarding |
| `repo_architecture.md` | Why this structure exists, layer model, scaling rules | Onboarding, README |
| `workflow.md` | 9-phase project execution process | All build work, onboarding |
| `standards.md` | Naming, formatting, quality, enforcement rules | Every contributor, CLAUDE.md |
| `execution_mode.md` | Operational execution modes (Research, Strategy, Build, Optimization) | CLAUDE.md, workflow, all build work |

---

## Skills (`/skills/`)

### Web Building (`/skills/web_building/`)

| File | Purpose | Referenced By |
|------|---------|---------------|
| `million_dollar_websites.md` | CRO frameworks, page structures, SEO/AEO strategy, performance | CLAUDE.md, templates, audit prompt |
| `design_system.md` | 8pt spacing, golden ratio typography, color, layout, components | CLAUDE.md, all build work |
| `claude_templates.md` | Section-by-section build prompts for Claude Code | Site build template, CLAUDE.md |
| `anti_gravity_prompts.md` | UI generation prompts for Anti-Gravity | Site generation template |
| `page_blueprints.md` | Page-level structural blueprints (homepage, landing, service, case study, contact) | CLAUDE.md, templates, build workflows |
| `conversion_audit_checklist.md` | 100-point scoring framework for auditing pages (CRO, SEO, AEO, UX, performance) | Audit prompt, Optimization Mode |

### Other Domains

| File | Purpose | Referenced By |
|------|---------|---------------|
| `branding/brand_system.md` | Brand strategy, identity, voice/tone, web translation | Content system, build templates |
| `content_creation/content_system.md` | Content strategy, CRO copy, SEO/AEO writing rules | Build templates, brand system |
| `automation/automation_system.md` | Automation decision framework, integration patterns | Workflow |
| `sales/sales_system.md` | Sales process, pricing, proposals, objection handling | Standalone |

---

## Prompts (`/prompts/`)

| File | Purpose | Referenced By |
|------|---------|---------------|
| `research/senior_research_prompt.md` | Deep competitive, audience, SEO analysis | Workflow Phase 1 |
| `build/repo_build_prompt.md` | Knowledge repository architecture generation | Standalone |
| `audit/website_audit_prompt.md` | 6-dimension website audit (CRO, SEO, AEO, design, perf, a11y) | Workflow Phase 7, site build template |

---

## Templates (`/templates/`)

| File | Purpose | Referenced By |
|------|---------|---------------|
| `claude/site_build_template.md` | Complete input template for Claude Code website builds | Workflow Phase 5, onboarding |
| `anti_gravity/site_generation_template.md` | Complete input template for Anti-Gravity UI generation | Workflow Phase 6, onboarding |

---

## Docs (`/docs/`)

| File | Purpose | Referenced By |
|------|---------|---------------|
| `onboarding.md` | 5-step guide for new team members | README |
| `roadmap.md` | 6-phase expansion plan with priorities | Standalone |

---

## Dependency Flow

```
CLAUDE.md ──references──→ design_system.md
CLAUDE.md ──references──→ million_dollar_websites.md
CLAUDE.md ──references──→ claude_templates.md
CLAUDE.md ──references──→ standards.md

site_build_template.md ──uses──→ CLAUDE.md + design_system.md + million_dollar_websites.md
site_generation_template.md ──uses──→ anti_gravity_prompts.md + design_system.md

website_audit_prompt.md ──validates against──→ design_system.md + million_dollar_websites.md
senior_research_prompt.md ──feeds──→ site_build_template.md (via strategy brief)

workflow.md ──orchestrates──→ all prompts and templates
execution_mode.md ──sequences──→ research → strategy → build → optimization
standards.md ──governs──→ all files
```

---

*Update this index when adding, removing, or renaming any file in the repo.*
