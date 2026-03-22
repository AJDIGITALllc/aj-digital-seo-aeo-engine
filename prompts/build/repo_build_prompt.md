# Repo Build Prompt

**Prompt for creating structured knowledge repositories and system documentation using AI-assisted development.**

---

## Purpose

This prompt produces a well-architected knowledge repository or system documentation structure. Use it when building new Skill OS modules, client documentation systems, or internal process libraries.

---

## Context Requirements

Before running this prompt, provide:

1. **System name** — what this repository/system is called
2. **Purpose** — what it does and who uses it
3. **Domain** — what knowledge area it covers
4. **Scope** — what's included and excluded
5. **Audience** — who will read and use these docs
6. **Integration** — how it connects to other systems

---

## The Prompt

```
You are a senior systems architect and technical writer responsible for designing
internal knowledge infrastructure. Your task is to create a structured, production-grade
repository that encodes domain expertise into modular, maintainable documentation.

SYSTEM CONTEXT:
- System name: [NAME]
- Purpose: [WHAT THIS SYSTEM DOES AND WHY IT EXISTS]
- Domain: [KNOWLEDGE AREA — e.g., web building, sales, branding]
- Scope: [WHAT'S IN AND WHAT'S OUT]
- Primary audience: [WHO USES THIS — e.g., developers, designers, sales team]
- Integration: [HOW THIS CONNECTS TO OTHER SYSTEMS — e.g., "referenced by Claude Code builds"]

ARCHITECTURE REQUIREMENTS:

1. REPOSITORY STRUCTURE
   Design a directory structure that:
   - Groups related files by domain or function
   - Never nests more than 2 levels deep
   - Uses clear, descriptive directory names (lowercase, underscores)
   - Separates knowledge (skills), process (workflows), and tools (templates/prompts)
   - Follows the layer model in `system/repo_architecture.md`: System → Skills → Prompts → Templates

2. FILE DESIGN
   For each file in the structure:
   - Define its purpose (one sentence)
   - Define its sections using the standard skill file structure:
     Purpose → Scope → Principles → Frameworks → Checklists/Templates
   - Ensure it is self-contained (readable without needing other files)
   - Ensure it is composable (can be combined with other files for larger workflows)
   - Follow the markdown formatting rules in `system/standards.md`

3. STANDARDS
   Apply these rules (from Skill OS standards):
   - File naming: lowercase, underscores, `.md` extension, descriptive
   - Directory naming: lowercase, underscores, max 2 levels deep
   - Every file starts with `# Title` + `**One-line purpose**` + `---`
   - No placeholder content, no TODO/TBD/WIP
   - Every section must be actionable, not just descriptive
   - Tables for structured comparisons, code blocks for structures

4. GOVERNANCE
   Define:
   - Who can modify files and how (PR process, review requirements)
   - How new files are added (validate against standards before merge)
   - How the system stays current (quarterly review cadence)

OUTPUT REQUIREMENTS:
- Full directory tree with file descriptions
- README.md with overview, structure, usage instructions
- Standards document with enforceable rules
- Template for creating new files (consistent structure)
- Onboarding guide for new users

QUALITY BAR:
- Every file must be immediately useful — no placeholders or "TBD"
- Structure must scale to 10× current size without reorganization
- A new team member should understand the system within 30 minutes of reading
- AI tools should be able to reference any file and produce quality output
- Naming is intuitive — someone unfamiliar can find what they need by directory name alone

FORMAT:
- Clean markdown
- Use tables for structured comparisons
- Use code blocks for structural representations
- Use headers consistently (# for title, ## for sections, ### for subsections)
- Horizontal rules (---) between major sections
```

---

## Expected Output

A complete repository design containing:

1. **Directory tree** with purpose annotations for every file and folder
2. **README.md** that explains the system, its structure, and how to use it
3. **Standards file** with specific, enforceable rules for all content
4. **File templates** that ensure consistency across all new additions
5. **Onboarding guide** that gets a new user productive quickly

---

## Customization Points

| Placeholder          | Customize For                                 |
|----------------------|-----------------------------------------------|
| System name          | The specific system being built                |
| Domain               | The knowledge area (affects file structure)    |
| Audience             | Who reads this (affects terminology and depth) |
| Integration          | How it connects (affects cross-references)     |
| Scale expectations   | How much this will grow (affects architecture) |

---

*Use this prompt when building new knowledge systems from scratch. The architecture decisions made here determine the system's long-term viability.*
