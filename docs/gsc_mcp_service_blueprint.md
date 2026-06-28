# Google Search Console MCP Service Blueprint

**Production blueprint for a tenant-aware Google Search Console data service with MCP as one interface.**

---

## Problem

AJ Digital needs a scalable way to inspect Google Search Console data across owned and client properties without exporting CSVs, sharing master credentials, or embedding client operations inside public marketing repos.
The immediate AudioJones use case is stale title and indexing diagnosis, but the durable business need is a repeatable SEO intelligence service for client reporting, alerts, and agent workflows.

---

## Desired Outcome

Create a hosted, multi-tenant Google Search Console service that lets AJ Digital agents, dashboards, and automation workflows query Search Console data through a controlled API and MCP surface.
The service must support per-client OAuth authorization, property discovery, search analytics, URL inspection, sitemap checks, scheduled alerts, and report generation.

---

## Success Criteria

- Clients can connect their own Google Search Console access through OAuth.
- AJ Digital can list connected properties per tenant without using a shared master credential.
- Agents can call read-only MCP tools for properties the tenant has authorized.
- Scheduled jobs can detect stale titles, content decay, traffic drops, CTR opportunities, and index coverage issues.
- Token storage is encrypted and separated from stateless MCP compute.
- `audiojones.com` remains a public marketing surface, not the home for client infrastructure.
- The first production pilot supports AudioJones-owned properties before external client rollout.

---

## Scope

- Google OAuth web application setup.
- Tenant, user, OAuth account, property, report, and audit-log data model.
- Stateless HTTP MCP server deployed to Cloud Run or an equivalent autoscaling container platform.
- Search Console API tools for property listing, search analytics, URL inspection, and sitemap reads.
- Scheduled analysis jobs for quick wins and alerts.
- HTML/PDF report generation as a downstream artifact.
- n8n/webhook integration for operational notifications.

---

## Out Of Scope

- Public marketing copy changes on `audiojones.com`.
- Production deployment without a separate approval gate.
- Google Indexing API in v1, unless the target page type is officially supported.
- Firebase usage.
- Client write operations in Google Search Console.
- Reindex promises or guarantees.
- Storing raw client secrets in docs, prompts, code, or registry files.

---

## Constraints

- Use Postgres for tenant and token metadata. Neon is preferred if this is an AJ Digital service; Supabase Postgres is acceptable only when auth/storage/realtime are required.
- Keep the MCP server stateless. It receives validated user or tenant context and short-lived access tokens from the gateway/auth layer.
- Store refresh tokens encrypted in the auth/data layer, not in the MCP process.
- Use only Search Console scopes required for v1, starting with `https://www.googleapis.com/auth/webmasters`.
- Treat Google OAuth verification as a product launch gate for external clients.
- Design around Search Analytics row limits and URL Inspection API quotas.
- Do not place this runtime inside `C:\dev\audiojones-clean`.

---

## Existing Assets To Inspect

- `C:\dev\aj-digital-seo-aeo-engine`
  - SEO/AEO knowledge, prompts, schemas, n8n workflow specs, and GSC integration references.
- `C:\dev\AJ DIGITAL AGENTS\AJ-DIGITAL-AGENT-OS`
  - Ecosystem registry, domain topology, integration inventory, and orchestration boundaries.
- `C:\dev\audiojones-clean`
  - Public brand surface and first pilot property, but not the runtime service home.

---

## Recommended Repository Boundary

Use the existing `C:\dev\aj-digital-seo-aeo-engine` repo for the strategy, blueprints, schemas, prompts, reports, and operating workflows.
Create runtime code in a separate service repo when implementation starts:

```text
C:\dev\aj-gsc-intelligence-service
```

Register that service in AJ Digital Agent OS as a planned capability.
Keep `audiojones-clean` independent and limited to public offer/onboarding surfaces.

---

## Proposed Architecture

```text
Client or operator
  -> AJ SEO app / agent interface
  -> OAuth broker and tenant API
  -> Postgres tenant/token store
  -> Cloud Run HTTP MCP server
  -> Google Search Console APIs
  -> Reports, alerts, dashboards, and n8n workflows
```

Runtime ownership:

| Layer | Owner | Responsibility |
| --- | --- | --- |
| Marketing surface | `audiojones-clean` | Public explanation, CTA, lead capture |
| Knowledge/workflow layer | `aj-digital-seo-aeo-engine` | Blueprint, prompts, schemas, reports |
| Runtime service | `aj-gsc-intelligence-service` | OAuth, API, MCP, jobs |
| Orchestration registry | `AJ-DIGITAL-AGENT-OS` | Capability metadata and boundaries |

---

## Auth Flow

1. Tenant admin starts Google connection from the AJ SEO app.
2. Google OAuth requests Search Console access.
3. OAuth callback exchanges the code for access and refresh tokens.
4. Auth layer stores the encrypted refresh token with tenant and Google identity metadata.
5. Property sync lists available Search Console sites for that Google account.
6. Tenant admin selects allowed properties.
7. Agent or dashboard request asks the gateway for a short-lived access token.
8. Gateway calls the stateless MCP service with tenant context and access token.
9. MCP service validates request context, calls Search Console APIs, and returns structured data.

---

## Data Model

Initial tables:

```text
tenants
users
tenant_users
google_oauth_accounts
gsc_properties
gsc_property_access
gsc_query_runs
gsc_url_inspections
seo_alerts
seo_reports
mcp_audit_log
```

Minimum audit fields:

```text
tenant_id
user_id
tool_name
property_url
requested_at
request_status
row_count
quota_cost
error_code
```

---

## MCP Tool Surface

V1 read-only tools:

```text
gsc.list_properties
gsc.search_analytics
gsc.inspect_url
gsc.list_sitemaps
gsc.get_sitemap
gsc.quick_wins
gsc.content_decay
gsc.ctr_opportunities
gsc.traffic_drop_alerts
gsc.stale_title_checks
```

Tool rules:

- Every tool must require tenant context.
- Every property request must be checked against `gsc_property_access`.
- Bulk URL inspection must be batched and quota-aware.
- Report tools must cite date ranges, filters, dimensions, and row limits.

---

## Deployment Model

Preferred production shape:

```text
Cloud Run service: gsc-mcp-api
Postgres: Neon project for tenant and token metadata
Queue/job runner: Cloud Tasks, Cloud Run jobs, or an approved equivalent
Secrets: Google Secret Manager or approved secret store
Notifications: n8n webhook, Slack, or email
Reports: R2 or approved object storage
```

Required environments:

```text
local
staging
production
```

Deployment approval gates:

- Creating OAuth client credentials.
- Adding or changing redirect URIs.
- Creating databases.
- Running migrations.
- Deploying Cloud Run.
- Changing DNS or public URLs.
- Enabling external Google OAuth consent.

---

## Risks

- Google OAuth verification may block external client onboarding.
- URL Inspection API quotas can be exhausted by naive bulk scans.
- Search Analytics row limits require pagination and deterministic sampling.
- Client property permissions can change outside AJ Digital systems.
- Stale Google/Safari snippets may persist even after live metadata is correct.
- Token storage errors create high security risk.

---

## Open Questions

- What public product name should this service use: SEO Intelligence, Search Intelligence, or Founder Search Intelligence?
- Should tenant dashboards live under `seo.ajdigital.app`, `search.ajdigital.app`, or another subdomain?
- Should the first runtime service use Cloud Run jobs or n8n for scheduled scans?
- Which report formats are required for v1: HTML only, PDF, Notion, or dashboard cards?
- Who is the first external pilot client after AudioJones-owned properties?

---

## Implementation Phases

### Phase 0 - Ratify Boundaries

- Confirm runtime repo name.
- Confirm app subdomain.
- Register planned capability in AJ Digital Agent OS.
- Keep `audiojones-clean` unchanged except future public offer/onboarding copy.

### Phase 1 - Runtime Skeleton

- Create service repo.
- Add TypeScript HTTP server.
- Add health check.
- Add OAuth callback stubs.
- Add Postgres schema migrations.
- Add local `.env.example` with blank values only.

### Phase 2 - Google OAuth And Property Sync

- Configure OAuth app.
- Implement encrypted token storage.
- Implement `list_properties`.
- Store property access records per tenant.

### Phase 3 - MCP Read Tools

- Implement Search Analytics query tool.
- Implement URL Inspection tool.
- Implement sitemap tools.
- Add audit logging and rate limits.

### Phase 4 - Intelligence Jobs

- Add quick wins.
- Add content decay.
- Add CTR opportunities.
- Add stale title/index checks.
- Add traffic drop alerts.

### Phase 5 - Reporting And Automation

- Generate HTML reports.
- Add PDF export if required.
- Send report/alert webhooks to n8n.
- Add dashboard-ready summaries.

---

## First Pilot Checklist

- Connect AudioJones Google Search Console property.
- Inspect `https://www.audiojones.com/`.
- Inspect `https://www.audiojones.com/services`.
- Inspect `https://www.audiojones.com/roi-calculator`.
- Inspect `https://www.audiojones.com/founder-intelligence/diagnostic`.
- Inspect the old redirecting `https://www.audiojones.com/applied-intelligence/diagnostic`.
- Compare live title, indexed canonical, user-declared canonical, sitemap inclusion, and last crawl status.
- Produce a short stale-indexing report with recommended operator actions.

---

*Created 2026-06-28 for AJ Digital SEO/AEO Engine planning.*
