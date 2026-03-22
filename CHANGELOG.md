# Changelog

**Version history for AJ Digital Skill OS.**

---

## Versioning Policy

This repo uses semantic versioning adapted for an internal documentation system:

- **Major (X.0.0):** Architectural changes — new layers, restructured hierarchy, breaking changes to how skill docs are consumed.
- **Minor (0.X.0):** Meaningful capability upgrades — new skill files, new system files, new frameworks or checklists that expand what the system can do.
- **Patch (0.0.X):** Editorial fixes, clarifications, corrected cross-references, and small non-structural improvements.

Versions are tagged at the point of commit, not at the point of authoring.

---

## [1.2.0] — 2026-03-22

**Summary:** Added page-level blueprints, operational execution modes, and a 100-point conversion audit scoring system. The Skill OS now covers the full loop from strategy through build through optimization with enforceable quality gates.

### Added

- `skills/web_building/page_blueprints.md` — 5 core page blueprints (homepage, landing, service, case study, contact), 3 supporting blueprints (about, resource, comparison), decision matrix, CTA mapping rules, AEO block standard, section quality checklist, and common failure patterns.
- `system/execution_mode.md` — 4 operational modes (Research, Strategy, Build, Optimization), full and short-loop pipelines, decision rules, iteration loop, success metrics, failure conditions, and Claude enforcement rules.
- `skills/web_building/conversion_audit_checklist.md` — 100-point weighted scoring framework across 10 categories, 48 individual checks, page-specific validations for 4 page types, P0–P3 prioritization, top 10 common failures, quick triage version, audit worksheet, and final report template.

### Changed

- `CLAUDE.md` — Skill Resolution Protocol updated: `page_blueprints.md` added to Website build and UI generation rows; `conversion_audit_checklist.md` added to Audit row. Core Directives step 3 now references page blueprints. Interaction Protocol step 1 now requires declaring execution mode. File References expanded with `page_blueprints.md` and `execution_mode.md`.
- `system/index.md` — Three new entries added to file map (page_blueprints, execution_mode, conversion_audit_checklist). Dependency flow diagram updated with execution_mode sequencing line.
- `docs/onboarding.md` — Reading order expanded to 7 steps, now includes `execution_mode.md`.

---

## [1.1.0] — 2026-03-22

**Summary:** Comprehensive audit-and-upgrade pass across the entire repository. Eliminated all placeholder content, fixed deprecated metrics, tightened cross-references, and added missing structural files.

### Added

- `system/index.md` — Complete file map of all repo files with purpose, cross-references, and ASCII dependency flow diagram.
- `.gitignore` — Git ignore rules for OS files, editor files, and `node_modules`.

### Changed

- `CLAUDE.md` — Version bumped to 1.1. Added Skill Resolution Protocol (task-type-to-doc lookup table). Replaced deprecated FID metric with INP (< 200ms). Fixed duplicate numbered items in Interaction Protocol. Added governance footer. Strengthened File References section.
- `README.md` — Fixed clone URL from `aj-digital/` to `AJDIGITALORG/`.
- `system/workflow.md` — Replaced FID < 100ms with INP < 200ms in QA performance checklist.
- `skills/web_building/design_system.md` — Added Tailwind CSS Token Mapping section with `tailwind.config.ts` code enforcing the 8pt spacing system.
- `skills/branding/brand_system.md` — Replaced empty "Future Modules" table with 10-item Brand Brief Checklist.
- `skills/content_creation/content_system.md` — Replaced empty "Future Modules" table with Content Brief Template (messaging hierarchy, keywords, competitors).
- `skills/automation/automation_system.md` — Replaced empty "Future Modules" table with Automation Specification Template (trigger, steps, error handling, ROI).
- `skills/sales/sales_system.md` — Replaced empty "Future Modules" table with Lead Qualification Scorecard (point-based scoring with action ranges).
- `prompts/build/repo_build_prompt.md` — Strengthened Architecture Requirements to reference AJ Digital's layer model, file structure conventions, and `standards.md`.
- `prompts/research/senior_research_prompt.md` — Tightened output format with specific table structures, persona templates, and 2,000–4,000 word length target.
- `prompts/audit/website_audit_prompt.md` — Replaced deprecated FID/INP dual reference with INP only.
- `templates/claude/site_build_template.md` — Added INP to Core Web Vitals line. Added cross-reference callout to Anti-Gravity template.
- `templates/anti_gravity/site_generation_template.md` — Added cross-reference callout to Claude build template.
- `docs/onboarding.md` — Added `system/index.md` to reading order.
- `docs/roadmap.md` — Updated Current State table to reflect new depth levels across all skill domains.

---

## [1.0.0] — 2026-03-22

**Summary:** Initial scaffold release. Complete 4-layer architecture with 21 files across system, skills, prompts, templates, and docs.

### Added

- `README.md` — Repo overview, structure, and usage instructions.
- `CLAUDE.md` — AI behavioral contract (design system enforcement, CRO, SEO, AEO, accessibility, performance).
- `LICENSE.md` — Proprietary license.
- `system/repo_architecture.md` — 4-layer architecture model (System → Skills → Prompts → Templates).
- `system/workflow.md` — 9-phase project execution process.
- `system/standards.md` — Naming, formatting, quality, and enforcement rules.
- `skills/web_building/design_system.md` — 8pt spacing, golden ratio typography, color, layout, component rules.
- `skills/web_building/million_dollar_websites.md` — CRO frameworks, page structures, SEO/AEO strategy, performance targets.
- `skills/web_building/claude_templates.md` — Section-by-section build prompts for Claude Code.
- `skills/web_building/anti_gravity_prompts.md` — UI generation prompts for Anti-Gravity.
- `skills/branding/brand_system.md` — Brand strategy, identity, voice/tone.
- `skills/content_creation/content_system.md` — Content strategy, CRO copy, SEO/AEO writing.
- `skills/automation/automation_system.md` — Automation decision framework, integration patterns.
- `skills/sales/sales_system.md` — Sales process, pricing, proposals, objection handling.
- `prompts/research/senior_research_prompt.md` — Deep competitive, audience, and SEO analysis prompt.
- `prompts/build/repo_build_prompt.md` — Knowledge repository creation prompt.
- `prompts/audit/website_audit_prompt.md` — 6-dimension website audit prompt.
- `templates/claude/site_build_template.md` — Complete input template for Claude Code website builds.
- `templates/anti_gravity/site_generation_template.md` — Complete input template for Anti-Gravity UI generation.
- `docs/onboarding.md` — 5-step onboarding guide for new team members.
- `docs/roadmap.md` — 6-phase expansion plan with priority matrix.

---

*Update this file with every meaningful commit.*
