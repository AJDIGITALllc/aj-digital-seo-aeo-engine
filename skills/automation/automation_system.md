# Automation System

**Framework for identifying, designing, and implementing workflow automations for AJ Digital and its clients.**

---

## Purpose

Automation eliminates repetitive manual work, reduces human error, and makes processes scalable. This skill defines how AJ Digital approaches automation — both for internal operations and client deliverables.

---

## Scope

**Included:**
- Automation principles and decision framework
- Client-facing automation patterns
- Internal operations automation
- Integration architecture
- Automation quality standards

**Not included:**
- Specific platform tutorials (Zapier, Make, n8n — future modules)
- Custom API development (covered in web building)
- AI/ML model training (future module)

---

## Principles

### 1. Automate the Repeated, Not the Rare

If a task happens more than 3 times per week and follows a predictable pattern, it's a candidate for automation. One-off tasks are not worth automating.

### 2. Reliability Over Sophistication

A simple automation that runs correctly 100% of the time is worth more than a complex one that fails 5% of the time. Start simple, add complexity only when proven necessary.

### 3. Humans Handle Exceptions

Automate the happy path. Route exceptions to humans with clear context about what happened and what decision is needed. Don't try to automate edge cases that require judgment.

### 4. Visibility Is Non-Negotiable

Every automation must be observable — you need to know when it runs, what it processes, and when it fails. Silent failures are worse than no automation.

### 5. Document Before Building

If you can't write down the exact trigger, steps, and expected outcome, you're not ready to automate. The documentation IS the specification.

---

## Automation Decision Framework

### When to Automate

| Signal                                  | Action                              |
|-----------------------------------------|-------------------------------------|
| Task happens 3+ times per week          | Strong automation candidate         |
| Task follows exact same steps every time | Strong automation candidate         |
| Task involves copying data between systems | Strong automation candidate       |
| Task requires human judgment mid-process | Automate up to the decision point  |
| Task happens once per quarter           | Don't automate — checklist instead |
| Task varies significantly each time     | Don't automate — create a template |

### ROI Calculation

```
Time saved per occurrence × Frequency per month × 12 months = Annual time saved
Annual time saved × Hourly rate = Annual value
```

If annual value > 10× the setup cost, automate immediately.
If annual value > 3× the setup cost, automate when convenient.
If annual value < 3× the setup cost, use a checklist instead.

---

## Client-Facing Automation Patterns

### Lead Capture → CRM → Notification

```
TRIGGER: Form submission on website
  → STEP 1: Create/update contact in CRM (HubSpot, Pipedrive, etc.)
  → STEP 2: Send confirmation email to lead
  → STEP 3: Notify sales team (Slack/email) with lead details
  → STEP 4: Add to nurture email sequence (if not ready to buy)
```

### Appointment Booking

```
TRIGGER: Booking made via Calendly/Cal.com
  → STEP 1: Create CRM record with meeting details
  → STEP 2: Send confirmation + prep materials to client
  → STEP 3: Create meeting brief in project management tool
  → STEP 4: Send reminder 24 hours before meeting
```

### Client Onboarding

```
TRIGGER: Contract signed / payment received
  → STEP 1: Create project in project management tool
  → STEP 2: Send welcome email with next steps
  → STEP 3: Create shared drive/folder for client assets
  → STEP 4: Schedule kickoff call
  → STEP 5: Assign team members and set initial tasks
```

### Website Monitoring

```
TRIGGER: Scheduled (daily/weekly)
  → STEP 1: Check uptime status
  → STEP 2: Run Core Web Vitals audit
  → STEP 3: Check SSL certificate expiration
  → STEP 4: Monitor form submissions for anomalies
  → STEP 5: Report → Slack/email if issues found
```

---

## Internal Operations Automation

### Project Status Reporting

```
TRIGGER: Weekly (Monday 9 AM)
  → STEP 1: Pull active projects from project management tool
  → STEP 2: Aggregate status, deadlines, blockers
  → STEP 3: Format into weekly summary
  → STEP 4: Post to team Slack channel
```

### Invoice Generation

```
TRIGGER: Project milestone completed
  → STEP 1: Pull project hours/deliverables from tracking system
  → STEP 2: Generate invoice in accounting system
  → STEP 3: Send to client with payment link
  → STEP 4: Schedule follow-up reminder at 7 and 14 days
```

### Content Publishing

```
TRIGGER: Blog post marked "Ready" in CMS
  → STEP 1: Run SEO checklist validation
  → STEP 2: Generate social media posts from content
  → STEP 3: Schedule social posts across platforms
  → STEP 4: Submit URL to Google Search Console for indexing
  → STEP 5: Notify team of publication
```

---

## Integration Architecture

### Hub-and-Spoke Model

Use a central automation platform (Make, Zapier, or n8n) as the hub that connects all tools:

```
                    ┌─── CRM ───┐
                    │            │
Website Forms ──→ ──┤            ├── Email Platform
                    │ AUTOMATION │
Calendar ────── ──→ ┤    HUB    ├── Slack
                    │            │
Payment ─────── ──→ ┤            ├── Project Management
                    │            │
Analytics ──── ──→ ─┤            ├── Reporting
                    └────────────┘
```

### Integration Rules

1. **One source of truth per data type:** Contact data lives in the CRM. Project data lives in the PM tool. Don't duplicate.
2. **Unidirectional when possible:** Data flows in one direction to avoid sync conflicts.
3. **Error handling on every step:** Define what happens when a step fails — retry, skip, or alert.
4. **Rate limit awareness:** Respect API limits. Batch operations when possible.
5. **Authentication security:** Use OAuth when available. Rotate API keys quarterly. Never hardcode credentials.

---

## Automation Quality Standards

### Before Deployment

- [ ] Automation is documented: trigger, steps, expected outcome, error handling
- [ ] Tested with real data (not just test data)
- [ ] Error notifications configured — failures are visible
- [ ] Rate limits verified — won't hit API throttling under normal load
- [ ] Credentials stored securely (not in automation steps as plain text)
- [ ] Edge cases identified and handled (empty fields, duplicate data, timeouts)

### After Deployment

- [ ] Monitored for 1 week without intervention
- [ ] Success/failure logs reviewed
- [ ] Performance baseline established (average execution time, success rate)
- [ ] Handoff documentation written (how to maintain, modify, troubleshoot)

---

## Automation Specification Template

Document every automation before building it:

```
Automation name: [DESCRIPTIVE NAME]
Owner: [WHO MAINTAINS THIS]
Platform: [Zapier / Make / n8n / custom]

Trigger:
  Event: [WHAT STARTS IT]
  Source: [WHICH SYSTEM]
  Frequency: [HOW OFTEN IT FIRES]

Steps:
  1. [ACTION] → [SYSTEM] → [EXPECTED RESULT]
  2. [ACTION] → [SYSTEM] → [EXPECTED RESULT]
  3. [ACTION] → [SYSTEM] → [EXPECTED RESULT]

Error handling:
  On failure at step ___: [RETRY / SKIP / ALERT via ___]

Success criteria:
  - [WHAT MUST BE TRUE FOR THIS TO BE "WORKING"]

ROI estimate:
  Time saved per run: ___ minutes
  Runs per month: ___
  Annual value: $___
```

If you cannot fill out this template, the automation is not ready to build.

---

*Automate the predictable. Elevate the human. Monitor everything.*
