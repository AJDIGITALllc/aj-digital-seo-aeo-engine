# AJ Digital — Weekly Execution Loop
## Operating Manual for the Authority Engine

**Version:** 1.0
**Last updated:** 2026-04-03
**Owner:** Audio Jones, AJ Digital

This is the weekly operating guide for running the AJ Digital SEO/AEO Authority Engine.
Follow this every week. The system does most of the work. Your job is to review, approve, and course-correct.

---

## THE WEEKLY RHYTHM

```
MON → INTELLIGENCE     Perplexity scans the internet for you
TUE → STRUCTURE        You review the opportunities, pick your targets
WED → GENERATE         Claude writes your articles
THU → APPROVE + PUBLISH  You review in Sanity, send live
FRI → DISTRIBUTE       n8n sends social posts, email, GBP
SAT–SUN → FEEDBACK     GSC + citation check runs automatically
```

---

## MONDAY — INTELLIGENCE DAY

### What happens automatically (07:00 UTC)

The W-01 Intelligence Scan workflow fires:
1. Pulls your top GSC queries from the past 28 days
2. Runs a Perplexity opportunity scan across all 4 topic clusters
3. Scores and ranks every keyword opportunity
4. Queues critical + high priority briefs in Sanity
5. Sends you a Telegram intel report

### What you do

**Check Telegram at 09:00 (your time).**

You'll see something like:
```
🧠 AJ Digital — Weekly Intel Report
📅 Monday, April 7, 2026

📊 Opportunities Queued: 8
🔴 Critical: 3
🟠 High: 5

🏆 Top Keyword: podcast production for coaches
```

**Your decision:** Reply `/generate` to kick off article generation for the top opportunity.
Or wait until Tuesday to review the full list in Sanity before generating.

### Review in Sanity (optional, 10 min)

Go to your Sanity Studio → Content Briefs
You'll see the queued opportunities with scores. You can:
- Reorder priorities
- Manually add a keyword you spotted
- Remove anything irrelevant

---

## TUESDAY — STRUCTURE DAY

### Your job (20–30 min)

Review the opportunity matrix queued in Sanity. For each item:

1. **Does this keyword fit this week's goal?**
   - Building local SEO? Prioritize Miami/South Florida keywords
   - Building AI citation presence? Prioritize informational + AEO-matched keywords
   - Need leads now? Prioritize commercial intent keywords

2. **Pick 2–3 articles to generate this week**
   - 1 critical priority (your main ranking target)
   - 1 high priority (supporting cluster content)
   - 1 local or niche (easy wins, low competition)

3. **Trigger article generation**

Via Telegram: `/generate`
Or via n8n webhook directly:
```
POST https://your-n8n.com/webhook/generate-article
{
  "brief_id": "[sanity-doc-id]",
  "keyword": "podcast production for coaches",
  "intent": "commercial",
  "aeo_question": "What does a podcast production service do for coaches?"
}
```

---

## WEDNESDAY — GENERATION DAY

### What happens automatically

For each triggered brief, the W-02 Article Generator runs:
1. Perplexity deep-dives the specific keyword SERP
2. Claude writes the full article (1,200–2,000 words)
3. AEO Validator checks all 10 rules
4. Draft saved to Sanity
5. You receive a Telegram approval request

### What you do (15–20 min per article)

When you get the Telegram notification, go to Sanity Studio.

**Review the draft against this checklist:**

```
□ H1 includes primary keyword
□ Meta title under 60 chars
□ Opening paragraph answers the question directly (no buildup)
□ Each H2 section opens with an answer block
□ At least 1 comparison table or numbered list
□ FAQ section has 6+ questions
□ Author block visible ("Audio Jones | Published: [date]")
□ CTA is natural, not forced
□ Internal link placeholders make sense (update to real URLs)
□ No factual errors (especially pricing, tool names, stats)
□ Nothing that sounds generic or off-brand
```

**Replace internal link placeholders** before approving:
```
[LINK: /services/podcast-production/ | anchor: podcast production service]
→ Update to: <a href="/services/podcast-production/">podcast production service</a>
```

**Approve if clean. Revise if not.**

Telegram commands:
- `/approve_[doc-id]` — Publishes immediately
- `/reject_[doc-id]` — Archives the draft
- `/revise_[doc-id]` — Flags for Claude revision pass

---

## THURSDAY — PUBLISH DAY

### Schema injection (5 min per article)

Before you approve for publish, confirm the schema is correct in Sanity:

1. **Article schema** — title, datePublished, author (Audio Jones), publisher (AJ Digital)
2. **FAQPage schema** — pairs match the FAQ section exactly
3. **HowTo schema** — add if the article is step-by-step
4. **LocalBusiness schema** — add if it's a Miami/South Florida local article
5. **BreadcrumbList schema** — add the correct path

Use the schema templates in: `skills/content_creation/seo/03-schema-templates.md`

### GSC submission (2 min)

After publish:
1. Go to Google Search Console
2. Inspect URL → Request Indexing
3. Done.

(The monthly W-05 Content Mutation loop automates this for updated articles.)

### Sitemap check

Confirm the new URL appears in your sitemap.
If you're on Sanity + Cloudflare, this is automatic if your sitemap plugin is configured.

---

## FRIDAY — DISTRIBUTION DAY

### What happens automatically

When Sanity fires the publish webhook, W-03 Distribution Engine runs:
1. Claude generates 3 social posts (LinkedIn, Instagram, Twitter/X)
2. Claude generates an email digest
3. Claude generates a GBP (Google Business Profile) post
4. Claude generates a short-form video script
5. Telegram sends you the distribution pack preview

### What you do (15–20 min)

**Review the distribution pack in Sanity or via Telegram.**

**LinkedIn:** Copy, paste, post. Check that the article link is correct. No edits needed unless tone is off.

**Instagram:** Copy, paste, add your image. The hook line is your caption. Hashtags are pre-generated.

**Twitter/X:** Ready to post. Under 240 chars. Check the link works.

**Email:** Copy into your email platform (ConvertKit, Beehiiv, etc.). The subject line and preview text are ready. Send Thursday evening or Friday morning (highest open rates for business content).

**GBP Post:** Log into Google Business Profile → Add Update → Paste the post → Add an image → Set CTA to "Learn More" → Publish.

**Short-form script:** Use this for Reels, TikTok, or YouTube Shorts. Record Friday or weekend, post the following week.

---

## WEEKEND — FEEDBACK DAY

### What happens automatically (Sunday 08:00 UTC)

W-04 Feedback Collector runs:
1. Pulls GSC data for this week vs last week
2. Checks Perplexity for AI citations of weareajdigital.com
3. Scores article performance
4. Flags underperformers for re-optimization
5. Sends you a Sunday feedback report

### What you do (10 min)

**Read the Sunday Telegram report:**
```
📊 AJ Digital — Weekly Feedback
Week of April 7–13, 2026

🔼 Clicks: +23% vs last week
🔼 Impressions: +18% vs last week
📈 New rankings (top 20): 3 keywords
🤖 AI Citations: 1 new citation detected
   → Perplexity cited: weareajdigital.com/blog/podcast-production-cost/
   → Query: "how much does podcast production cost"

⚠️ Underperformers flagged for revision:
   → /blog/ai-tools-entrepreneurs/ (position 34, no improvement)
```

**Action items from the report:**
- Celebrate citations (they compound)
- Queue underperformers for the monthly mutation loop
- Note which keywords are climbing — they may need pillar page support

---

## MONTHLY — CONTENT MUTATION DAY

**When:** 1st of every month (automatic via W-05)

### What happens automatically

1. GSC pulls your top 5 articles by organic clicks
2. Perplexity re-queries each topic for new data
3. Claude adds an "Updated [Month Year]" section with new stats
4. Sanity saves as new revision
5. `dateModified` is updated in Article JSON-LD
6. GSC Indexing API is called for each URL
7. Telegram sends mutation summary

### Why this matters

Google and AI engines favor recently updated content.
A 6-month-old article updated with fresh data outperforms a new article on the same topic.
This is the compounding effect of the mutation loop.

---

## THE CONTENT CALENDAR (YEAR 1)

Based on `02-25-article-briefs.md`:

| Phase | Articles | Timeline |
|-------|---------|----------|
| Launch | 01, 02, 03, 07, 08, 12, 15, 18 | Weeks 1–2 |
| Month 1 | 04, 05, 06, 09, 10, 11, 13, 14, 16, 17, 19, 20 | Weeks 3–8 |
| Month 2–3 | 21, 22, 23, 24, 25 | Weeks 9–16 |

**Cadence:** 2 articles/week (via Wednesday generation day)
**Local pages:** Build 1 per week alongside articles (6 total in Month 1)

---

## KEY METRICS DASHBOARD

Check these weekly (GSC + GA4):

| Metric | Tool | Target (90 days) |
|--------|------|-----------------|
| Organic sessions | GA4 | 500/mo |
| Keywords top 20 | Search Console | 15+ |
| AI citations | Perplexity manual check | 3+ |
| Leads from organic | CRM / Booking | 5+/mo |
| GBP views | GBP Insights | 200+/mo |
| LCP | PageSpeed | ≤ 2.5s |

---

## WHEN THINGS GO WRONG

### Perplexity returns malformed JSON
- Check the Perplexity node response in n8n
- Retry with a manual webhook call
- If persistent: switch model to `sonar` (faster, more reliable for structured output)

### Claude article fails AEO validation twice
- Review the issues array in n8n output
- Fix in Sanity manually before approving
- Log the issue type — if it repeats, update the prompt in `claude-article-prompt.md`

### Telegram approval times out
- Article stays as `pending_approval` in Sanity indefinitely (safe)
- Go to Sanity directly to approve or archive
- Telegram commands expire after 48 hours

### GSC OAuth fails
- Re-authenticate in n8n → Credentials → Google Search Console
- This happens every 6 months on average

### n8n workflow stops running
- Check n8n execution log for the failed run
- Most common cause: API rate limits (Perplexity or Claude)
- Fix: add a Wait node (5s delay) before Perplexity and Claude nodes

---

## CONTACTS + RESOURCES

- **n8n dashboard:** https://your-n8n.com (self-hosted or n8n.cloud)
- **Sanity Studio:** https://[project-id].sanity.studio
- **Google Search Console:** https://search.google.com/search-console
- **Perplexity API docs:** https://docs.perplexity.ai
- **Claude API docs:** https://docs.anthropic.com
- **Telegram Bot:** @[your-bot-name]

---

*AJ Digital Authority Engine — Weekly Ops Guide v1.0*
*Maintained alongside `workflows/n8n/seo-aeo-engine-workflow.md`*
