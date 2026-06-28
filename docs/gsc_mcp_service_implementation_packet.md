# GSC MCP Service Implementation Packet

**Packet owner:** Codex
**Planning source:** `docs/gsc_mcp_service_blueprint.md`
**Target runtime repo:** `C:\dev\aj-gsc-intelligence-service`
**Status:** Draft implementation packet
**Created:** 2026-06-28

---

## Objective

Create the first runtime implementation slice for a tenant-aware Google Search Console intelligence service with an HTTP API and MCP-compatible read tools.

This packet starts the runtime service foundation only. It must not create Google OAuth clients, request live credentials, deploy infrastructure, or modify `audiojones-clean`.

---

## Current Planning State

- SEO/AEO blueprint is landed in `aj-digital-seo-aeo-engine`.
- Agent OS registry/domain/integration plan is landed in `AJ-DIGITAL-AGENT-OS`.
- The service boundary is `C:\dev\aj-gsc-intelligence-service`.
- `seo.ajdigital.app` is the planned product subdomain.
- `{clientname}.seo.ajdigital.app` is the planned tenant pattern.
- Runtime implementation is separate from public marketing surfaces.

---

## Required Scope

Create or update only the future runtime service repo:

```text
C:\dev\aj-gsc-intelligence-service
```

Allowed first-slice files:

```text
AGENTS.md
README.md
.gitignore
.env.example
package.json
tsconfig.json
src/server.ts
src/health.ts
src/config.ts
src/tenant-context.ts
src/gsc/client.ts
src/mcp/tools.ts
src/audit/audit-log.ts
tests/*.test.ts
docs/*.md
```

If the repo does not exist, create it as a local runtime skeleton only. Do not connect a remote unless explicitly approved.

---

## Out Of Scope

- No production deploy.
- No OAuth client creation.
- No real Google credentials.
- No live GSC API calls.
- No database provisioning.
- No migrations against a live database.
- No DNS changes.
- No `audiojones-clean` edits.
- No client data import.
- No Firebase.
- No Indexing API.

---

## Required Architecture

Build a small TypeScript service skeleton with these boundaries:

- HTTP health/readiness endpoint.
- Tenant context validation module.
- Google Search Console client wrapper with mocked/testable transport.
- MCP tool definitions for read-only GSC operations.
- Audit-log interface that records tool name, tenant, property URL, status, row count, quota cost, and error code.
- Config loader that reads variable names from environment but does not require real secrets for local tests.

The MCP layer must be stateless. It must receive tenant context and a caller-provided access-token placeholder from the gateway/auth layer. Refresh-token storage is not part of this slice.

---

## V1 Tool Contract

Stub and test these read-only tools:

```text
gsc.list_properties
gsc.search_analytics
gsc.inspect_url
gsc.list_sitemaps
gsc.get_sitemap
```

Do not implement intelligence jobs yet:

```text
gsc.quick_wins
gsc.content_decay
gsc.ctr_opportunities
gsc.traffic_drop_alerts
gsc.stale_title_checks
```

Those remain Phase 4.

---

## Security Rules

- Every tool must require tenant context.
- Every property-scoped request must require an approved property URL.
- Missing tenant context must fail closed.
- Missing access token must fail closed.
- Tool responses must not include OAuth tokens.
- `.env.example` may name variables but values must stay blank.
- Tests must use fake tokens and mocked transports only.

Required placeholder variables:

```text
PORT=
NODE_ENV=
DATABASE_URL=
GSC_GOOGLE_CLIENT_ID=
GSC_GOOGLE_CLIENT_SECRET=
GSC_GOOGLE_REDIRECT_URI=
GSC_TOKEN_ENCRYPTION_KEY=
```

---

## First Implementation Steps

1. Create the runtime repo skeleton.
2. Add TypeScript strict configuration.
3. Add config parsing with blank-safe `.env.example`.
4. Add health and readiness endpoints.
5. Add `TenantContext` and property-access guard.
6. Add GSC client wrapper with injectable fetch/transport.
7. Add MCP tool registry with the five V1 read-only stubs.
8. Add audit-log interface and in-memory test implementation.
9. Add unit tests for fail-closed tenant/token/property behavior.
10. Add README runbook with local commands and approval gates.

---

## Validation Requirements

Minimum local validation:

```text
npm run typecheck
npm test
npm run build
```

If no dependency install is approved, stop after scaffolding docs and report that package validation is pending install approval.

Secret scan:

```text
Search changed files for token-looking values:
api_key, client_secret, access_token, refresh_token, private_key, -----BEGIN, ya29., AIza, ghp_
```

No live network validation is required for this packet.

---

## Completion Criteria

The first implementation slice is complete when:

- Runtime repo exists locally.
- Service starts locally without real secrets.
- Health endpoint returns OK.
- Tenant/property/access-token guards are covered by tests.
- V1 MCP tool names are registered and return deterministic mocked responses.
- README documents setup, env placeholders, approval gates, and non-goals.
- No live Google, database, deployment, or secret work was performed.

---

## Follow-Up Packets

### Phase 2 - OAuth And Property Sync

- Add OAuth callback flow.
- Store encrypted refresh-token metadata.
- Implement live `list_properties`.
- Add tenant property selection.

### Phase 3 - Live Read Tools

- Implement live Search Analytics.
- Implement live URL Inspection.
- Implement sitemap reads.
- Add quota-aware batching and audit logging.

### Phase 4 - Intelligence Jobs

- Add quick wins.
- Add content decay.
- Add CTR opportunities.
- Add traffic drop alerts.
- Add stale title and indexing checks.

### Phase 5 - Reporting

- Generate HTML reports.
- Add PDF export only if required.
- Send report and alert webhooks to n8n.
- Add dashboard-ready summaries.

---

## Operator Approval Gates

Require explicit approval before:

- Creating a remote repo.
- Installing dependencies.
- Creating OAuth credentials.
- Reading or writing secrets.
- Creating a database.
- Running migrations.
- Calling live Google APIs.
- Deploying.
- Changing DNS or public URLs.
- Touching `audiojones-clean`.

Approval word: `proceed`.
