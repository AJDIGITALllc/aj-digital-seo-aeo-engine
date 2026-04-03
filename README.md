# AJ Digital SEO/AEO Engine

**A client-deployable SEO + AEO + GEO content intelligence system.**

Automates keyword research, opportunity scoring, article brief generation, schema injection, internal linking, and AI citation optimization — for any client, on any niche.

---

## What This Engine Does

1. **Researches** — uses Perplexity to scan live SERPs, competitor gaps, PAA questions, and AI citation patterns
2. **Scores** — normalizes every opportunity with a weighted formula (volume + difficulty + intent + local + AEO)
3. **Generates** — uses Claude to write fully AEO-optimized articles that rank on Google and get cited by AI engines
4. **Validates** — runs a 16-point quality gate before any content reaches a CMS
5. **Distributes** — auto-generates social posts, email digests, GBP posts, and short-form scripts on publish
6. **Optimizes** — weekly feedback loop tracks citation rate, CTR gaps, and rank-without-citation signals

---

## Inputs

Every client deployment requires three input contract files:

| File | Purpose |
|------|---------|
| `clients/{slug}/client-profile.json` | Brand identity, services, geo targets, author |
| `clients/{slug}/brand-dna.json` | Voice, tone rules, CTAs, value proposition |
| `clients/{slug}/deployment-config.json` | API targets, publish schedule, fast-track rules |

Schemas for all three live in `schemas/`. Blank templates live in `clients/_template/`.

---

## Outputs

Every engine run produces a fixed output set (defined in `docs/output-spec.md`):

| Output | Schema |
|--------|--------|
| Opportunity matrix | `schemas/opportunity-matrix.schema.json` |
| Topic map | `schemas/topic-map.schema.json` |
| Article briefs | `schemas/page-brief.schema.json` |
| AEO citation briefs | `schemas/ai-citation-brief.schema.json` |
| Internal linking map | `schemas/internal-linking-map.schema.json` |
| Publish queue | `schemas/publish-queue.schema.json` |
| Schema pack (JSON-LD) | `schemas/schema-pack.schema.json` |

---

## How to Deploy for a New Client

```bash
# 1. Copy the blank client template
cp -r clients/_template clients/your-client-slug

# 2. Fill in the three input contracts
#    clients/your-client-slug/client-profile.json
#    clients/your-client-slug/brand-dna.json
#    clients/your-client-slug/deployment-config.json

# 3. Set environment variables (see .env.example)
#    Required: CLIENT_SITE_URL, CLIENT_AUTHOR_NAME, CLIENT_LOCAL_CITIES + all API keys

# 4. Import the n8n workflow
#    workflows/n8n/seo-aeo-engine-workflow.json
#    Replace REPLACE_* placeholders with your credential IDs

# 5. Update the Set Brand Config node in n8n with values from client-profile.json

# 6. Run W-01 (Intelligence Scan) manually to verify the pipeline
```

---

## Repository Structure

```
aj-digital-seo-aeo-engine/
├── clients/
│   ├── _template/              ← Blank input contracts (copy to onboard)
│   └── weareajdigital/         ← AJ Digital reference deployment
│
├── schemas/                    ← JSON Schemas: 3 inputs + 7 outputs
├── workflows/n8n/              ← n8n workflow JSON + code node source
├── skills/content_creation/seo/ ← Perplexity research skill
├── prompts/                    ← AI prompt library
├── docs/                       ← Output spec + weekly ops guide
├── examples/                   ← Concrete output examples
├── scripts/                    ← Repo health check + PR automation
├── .env.example                ← All required environment variables
└── CLAUDE.md                   ← AI behavior contract
```

---

## Workflow Map

| ID | Workflow | Trigger | Runtime |
|----|---------|---------|---------|
| W-01 | Intelligence Scan | Monday 07:00 UTC | ~3–5 min |
| W-02 | Article Generator | Webhook | ~90–120 sec |
| W-03 | Distribution Engine | Sanity publish event | ~30 sec |
| W-04 | Feedback Collector | Sunday 08:00 UTC | ~2–4 min |
| W-05 | Content Mutation | 1st of month 09:00 UTC | ~5 min |

Full node-by-node spec: `workflows/n8n/seo-aeo-engine-workflow.md`

---

## Key Environment Variables

```bash
# Client identity (set per deployment)
CLIENT_SITE_URL=https://example.com
CLIENT_BRAND_NAME=Example Brand
CLIENT_AUTHOR_NAME=Jane Smith
CLIENT_AUTHOR_TITLE=Founder & CEO
CLIENT_PRIMARY_CITY=Austin
CLIENT_LOCAL_CITIES=Austin,San Antonio,Houston

# API keys
PERPLEXITY_API_KEY=
ANTHROPIC_API_KEY=
OPENAI_API_KEY=
GSC_SITE_URL=https://example.com
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REFRESH_TOKEN=
TELEGRAM_BOT_TOKEN=
TELEGRAM_CHAT_ID=
SANITY_PROJECT_ID=
SANITY_DATASET=production
SANITY_API_TOKEN=
```

---

## Deployed Clients

| Client | Slug | Domain | Status |
|--------|------|--------|--------|
| AJ Digital | `weareajdigital` | weareajdigital.com | Active |

---

**Engine version:** 2.0 — Phase 5 Productized | See `CHANGELOG.md`

*Built by AJ Digital LLC. See LICENSE.md for terms.*
