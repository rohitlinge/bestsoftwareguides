# Content plan: getting cited by ChatGPT and other AI assistants

Written 2026-11-14 after studying itechguides.com, a software directory that answer engines cite heavily. We copied its **techniques**, not its text or data.

## Why AI assistants cite itechguides

| # | Technique on itechguides | Why it gets cited | Our status |
|---|---|---|---|
| 1 | **Breadth.** 4,600+ "best X" lists, including long-tail ones like "Mac CRM", "Small Business CRM" and "VPNs for Xbox" | AI assistants split a question into narrower searches ("best CRM for a real estate agent"). A page that matches the narrow search gets the citation. | **Built:** use-case rankings (`useCases` in `categories.json`). 6 live. Needs more tools per category to grow. |
| 2 | **Depth.** 238 CRMs in one ranking | Counts like "77 of 238 have a free plan" only carry weight with large lists | **Gap.** We have 5 tools per category. Biggest priority (see below). |
| 3 | **Answer first:** "X is the top-ranked of N (9.4/10, free plan); Y is runner-up; Z is the best free option" | The opening sentence answers the question directly, so it is easy to quote | **Built:** ranking pages now name the #1 pick, the runner-up and the highest-ranked free plan. |
| 4 | **Numbers from the data:** "Of 238 CRMs, 108 publish a price; lowest $4.25, typical $23. Checked Sept 2026" | AI assistants prefer specific, dated figures | **Built:** "Buyer's guide: the numbers" section and FAQ on every ranking (cost range, median, free-plan count, which features differ). |
| 5 | **Head-to-head checks:** "A leads on 3 checks, B on 1, 4 even" | Gives a short, quotable verdict | **Built:** comparison scoreboard plus a verdict line and an FAQ answer. |
| 6 | **Product fact sheet** with "Facts checked [date]", founded, HQ, compliance, integrations | Each fact is short and labelled | **Built:** optional fields (`founded`, `hq`, `integrations`, `compliance`, `support`) are shown when present, and `draft_tool.py` now fills them. Every tool page shows its check date and source. |
| 7 | **Heavy internal links:** "Also ranked in", "More in this topic", product → pricing / alternatives / compare | Crawlers find every page, and topical authority builds up | **Built:** "Also ranked in", sibling rankings, guide → ranking links, related guides. |
| 8 | **Detailed llms.txt:** what is verifiable, what is not, what each page type answers | Tells a model which URL answers which question, and how far to trust it | **Built:** rewritten llms.txt. |
| 9 | **robots.txt `Content-Signal: search=yes, ai-input=yes, ai-train=yes`** plus every AI crawler allowed by name | Removes any doubt about permission | **Built.** |
| 10 | **Schema:** CollectionPage + ItemList + FAQPage on lists; SoftwareApplication + Review + Rating on products; WebSite/Organization `@id` graph; Person author with `sameAs` | Clean, machine-readable facts | **Built.** Person author activates once you set `editor.type: 'Person'` in `site.config.mjs`. |
| 11 | **Named human author** (founder bio, LinkedIn `sameAs`, 20+ years in IT) | Trust signal for search engines and answer engines (E-E-A-T) | **Your action:** add a real name, bio and LinkedIn to `site.config.mjs` → `editor`, and update `/about/`. |
| 12 | **2,400+ guides** in How-To / Fix It / Explained / Reviews / Buying Guides, written in first person ("I ran dcdiag on…"), with screenshots and commands | First-hand experience on long-tail problems; many AI answers come from these guides | **Built:** guide `type` + `category` frontmatter, reading time, a CTA from each guide to its ranking, and a guides index grouped by type. **Content:** calendar below. |
| 13 | **Bing verification** (two `msvalidate.01` tags) | ChatGPT search draws heavily on Bing's index | **Your action:** put your code in `site.config.mjs` → `verification.bing`, or verify by DNS. |
| 14 | **Domain age and backlinks** (site has run for years) | Strongest signal of all, and it cannot be copied | Only time, consistent publishing and earned mentions build this. |

What we deliberately did **not** copy: paid rank positions (they sell "#1 for $149/mo"), "free PC scan" ads inside guides, and scores without a published formula. Our "no paid ranks, published formula, open data" position is a reason to cite us that they cannot claim.

## Publishing rules (every page)

1. **First 2 sentences answer the question** with a name, a number and a date.
2. **Every price has a source and a check date.** Use `draft_tool.py`, then check by hand. Never publish a guessed price.
3. **One question per H2**, written the way people ask it ("How much does X cost?").
4. **A table** whenever 3+ items share attributes.
5. **Guides link to a ranking** (set `category:` in frontmatter). Rankings link to guides.
6. **How-to and Fix It guides are first-hand:** do the steps yourself, write "I", add screenshots and exact menu paths or commands, and give the app or OS version you tested on.
7. **Update the date only when facts change.** The weekly price check does this.

## Guide frontmatter

```yaml
---
title: "How to Move from LastPass to Bitwarden (2026)"
description: "Export, import and clean up your vault in about 10 minutes. Tested on Bitwarden 2026.11."
type: "how-to"          # pricing-report | buying-guide | how-to | fix-it | explained
category: "password-managers"   # optional: links the guide to that ranking
updated: "2026-12-10"
---
```

Then add `{ "slug": "...", "day": N }` to `src/data/schedule.json`. The daily build publishes it on `launchDate + N`.

## Top priority: go deeper before going wider

Use-case lists only reach search engines once **3+ tools** meet the rule, and counts like "N of M have a free plan" only matter when M is large. Before adding many new categories, **bring every category to 15–25 tools** with `draft_tool.py`. Each batch of new tools also re-ranks the list, updates the counts and refreshes `dateModified`, which keeps pages fresh.

Suggested additions (draft each with `draft_tool.py`, verify, then add):

- **AI meeting note takers:** Granola, Avoma, Krisp, MeetGeek, Jamie, Notta, Sembly, Supernormal, Grain, Bluedot
- **Project management:** Jira, Wrike, Basecamp, Smartsheet, Teamwork, Airtable, Linear, Height, Zoho Projects, Todoist
- **CRM:** Close, Copper, Attio, Less Annoying CRM, Capsule, Nutshell, Insightly, Bigin, Folk, monday CRM
- **Password managers:** Keeper, RoboForm, Enpass, LastPass, KeePassXC, Zoho Vault, Sticky Password, NordPass Business, Psono, Passbolt

Once each category has 15+ tools, add 3–5 more use-case lists to it, for example:

- **AI note takers:** for sales teams (`crmSync`), free with unlimited recordings (`unlimitedFreeRecordings`), with SSO (`sso`), for Mac (`platform: macOS`)
- **Project management:** with Gantt charts (`timelineGantt`), with time tracking (`timeTracking`), for Linux, free
- **CRM:** with built-in calling (`builtInCalling`), with AI assistant, for Android/iOS
- **Password managers:** open source (`openSource`), self-hosted (`selfHost`), with breach monitoring

New rule types (for example "for real estate", "for nonprofits") need a new feature key in `featureLabels`, plus data for every tool in the category.

## 10-week calendar (from 2026-12-07)

`launchDate` is 2026-11-16, so 2026-12-07 is day 21. The current schedule covers days 0–16.

**Weekly rhythm:**
- **Mon:** new category (ranking, tools, pricing and alternatives pages)
- **Tue:** pricing report for that category
- **Wed:** its comparisons, free page and first 2–3 use-case lists
- **Thu:** How-To or Fix It guide
- **Fri:** depth day (add 5 tools to an older category)
- **Sat:** Explained or Buying Guide

| Week (day) | New category (Mon) | Pricing report (Tue) | How-To / Fix It (Thu) | Explained / Buying guide (Sat) | Depth (Fri) |
|---|---|---|---|---|---|
| 1 (21) | AI Writing Tools | AI writing tool pricing 2026: per-word vs per-seat | How to stop an AI note taker joining your calls (Zoom, Meet, Teams) | What a BAA is and why HIPAA note takers need one | +5 AI note takers |
| 2 (28) | Email Marketing Software | Email marketing cost per 1,000 / 10,000 contacts | How to move from LastPass to Bitwarden | Passkeys explained: which password managers support them | +5 password managers |
| 3 (35) | Website Builders | Website builder renewal prices vs first-year promos | How to set up a free HubSpot CRM pipeline in 30 minutes | Per-seat vs flat pricing: which costs less at 5, 10, 25 users | +5 CRMs |
| 4 (42) | VPNs | VPN prices after the first term (2-year plans unpacked) | Fix: Fireflies or Otter bot not joining Google Meet | Free vs paid VPN: what you give up | +5 PM tools |
| 5 (49) | Help Desk Software | Help desk pricing per agent, 2026 | How to export Trello boards to Asana or ClickUp | What is a CRM? A plain-English guide with real costs | +5 AI writing tools |
| 6 (56) | AI Image Generators | AI image generator credits explained (cost per image) | Fix: Bitwarden autofill not working on Android | Open-source vs closed password managers | +5 email marketing |
| 7 (63) | AI Coding Assistants | AI coding assistant pricing: Copilot, Cursor and others | How to share passwords safely with family | How AI meeting notes are stored and who can read them | +5 website builders |
| 8 (70) | Accounting Software | Small business accounting software cost 2026 | How to migrate contacts from spreadsheets into a CRM | Annual vs monthly: when monthly is worth it | +5 VPNs |
| 9 (77) | Video Editing Software | Video editor subscriptions vs one-time licences | Fix: ClickUp or Asana notifications not arriving | What SOC 2 and SSO mean on a pricing page | +5 help desk |
| 10 (84) | HR & Payroll Software | Payroll software cost per employee | How to cancel and get a refund (top 10 tools) | Q1 2027 software price changes report | +5 AI image generators |

After week 10: one new category every week, as above. Every quarter, publish a **"Software price changes this quarter"** report from `price-history.json`. Data-led reports like this are among the most-cited formats.

## Measure

- `scripts/pipeline/citation_tracker.py` runs the prompts in `prompts.txt` weekly. Add 3–5 prompts per new category or use-case list, phrased the way people ask (for example "best password manager for Linux").
- Check Bing Webmaster Tools and Google Search Console weekly: which rankings and guides get impressions, and for which queries.
- A page that gets impressions but no citations needs a clearer first sentence, a more specific number, or a question H2 that matches the prompt.

## Do once (owner actions)

1. Put a real editor in `site.config.mjs` (`type: 'Person'`, `jobTitle`, `bio`, `sameAs`: LinkedIn) and on `/about/`.
2. Add a Bing verification code (or verify by DNS), submit `sitemap.xml` to Bing and Google, then run `node scripts/indexnow.mjs --all`.
3. Add the site's social profiles to `sameAs` in `site.config.mjs`.
4. Draft 10 tools for one existing category with `draft_tool.py` and check them by hand. That unlocks the first long-tail lists.
