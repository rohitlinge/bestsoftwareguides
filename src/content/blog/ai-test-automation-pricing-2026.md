---
title: "AI Test Automation Pricing 2026: Per Run, Step or Credit"
description: "What 10 AI test automation tools cost and how each one bills: per test run, per step, credits or per agent. Half publish no price. Checked Nov 2026."
type: "pricing-report"
category: "ai-test-automation-tools"
updated: "2026-11-18"
---

**Short answer:** Only 5 of the 10 AI test automation tools we priced publish their prices. Among those, the cheapest paid plans are [KaneAI](/tools/kaneai/pricing/) Starter at **$17 per agent a month** (billed annually) and [Functionize](/tools/functionize/pricing/) Growth at **$20 a month**. [Autify Aximo](/tools/autify-aximo/pricing/) Core costs $99 a month on annual billing, and [Momentic](/tools/momentic/pricing/) Scale $500 a month. [QA Wolf](/tools/qa-wolf/pricing/) charges per run instead: **$1 per 5 minutes** of a web test. testRigor, mabl, Checksum, Testsigma and Reflect are quote-only. Four tools have a free plan: Momentic, testRigor, Functionize and Autify Aximo. Prices are from each vendor's pricing page, checked November 18, 2026.

## How is AI test automation priced?

These tools bill in at least five different units, which makes headline prices hard to compare:

| Billing unit | Tools | What drives the bill |
|---|---|---|
| Per test run | QA Wolf | Number and length of runs: $1 per 5-minute block on web, $2 on mobile and desktop |
| Per test step | Momentic | Steps executed: $0.0125 each, $0.025 for AI-generated or recovery steps |
| Credits | Functionize, Autify Aximo, Reflect, mabl | A monthly credit allowance consumed by cloud runs |
| Per agent | KaneAI | Each AI agent licence, with a monthly credit allowance |
| Per workflow or parallel run | Checksum, testRigor | Number of maintained tests (Checksum) or parallel AI agents (testRigor) |

The billing unit matters more than the entry price. A team that runs a big suite on every pull request will burn through step- or run-based pricing far faster than a team that runs a nightly check.

## What does each tool cost?

| Tool and plan | Monthly billing | Annual billing (per month) | What's included |
|---|---|---|---|
| [KaneAI](/tools/kaneai/pricing/) Starter | $19 per agent | $17 per agent | 2,000 credits (about 25 tests of 40 steps), local authoring |
| [Functionize](/tools/functionize/pricing/) Growth | $20 | — | 3,200,000 credits, SSO and RBAC |
| [KaneAI](/tools/kaneai/pricing/) Pro | $99 per agent | $89 per agent | 12,000 credits, cloud web authoring |
| [Functionize](/tools/functionize/pricing/) Scale | $100 | — | 20,000,000 credits |
| [Autify Aximo](/tools/autify-aximo/pricing/) Core | $120 | $99 | 6,000 credits a month, 5 web and 2 mobile concurrent runs |
| [KaneAI](/tools/kaneai/pricing/) Max | $199 per agent | $179 per agent | 25,000 credits, web and mobile authoring |
| [Momentic](/tools/momentic/pricing/) Scale | $500 (usage balance) | — | $500 of usage, 25 concurrent browsers |
| [Autify Aximo](/tools/autify-aximo/pricing/) Team | $550 | $450 | 30,000 credits a month, script generation |
| [QA Wolf](/tools/qa-wolf/pricing/) Pay as you go | Per run | — | $1 per 5-minute web run, $2 mobile or desktop |
| [testRigor](/tools/testrigor/pricing/), [mabl](/tools/mabl/pricing/), [Checksum](/tools/checksum/pricing/), [Testsigma](/tools/testsigma/pricing/), [Reflect](/tools/reflect/pricing/) | Quote | Quote | See each tool's plans |

Credits are not comparable between vendors: Functionize's 3.2 million credits and Aximo's 6,000 measure different things. Ask each vendor how many of your own tests a plan covers.

## What does a real test suite cost on usage pricing?

Two vendors publish enough to estimate a monthly bill:

- **QA Wolf:** its own example of 50 web tests run daily comes to **$1,083 a month**. Up to 3 attempts per run are billed once, and you can set a monthly spending cap.
- **Momentic:** a test of 40 plain steps costs $0.50 per run. Run 50 such tests every weekday (about 22 days) and that is about **$550 a month**, just above the $500 Scale balance. AI-generated and recovery steps cost double, and triage or auto-healing calls cost $1.25 each, so a flaky suite costs more.

## What do the free plans include?

| Free plan | What you get | Catch |
|---|---|---|
| Functionize Free | 800,000 credits a month, 5 parallel runs, team workspace | None stated; no time limit |
| Momentic Free | $50 of usage a month, 5 concurrent browsers, 2 Android + 2 iOS devices | Runs pause when the $50 runs out |
| Autify Aximo Individual User | 2,000 credits, 1 web and 1 mobile concurrent run | One-time credits, not monthly |
| testRigor Public | Free forever, 1 parallel run | Your tests and results are public |

The other six offer trials instead: 30 days on Checksum; 14 days on mabl, KaneAI and Reflect; free starter runs on QA Wolf; and a trial of unstated length on Testsigma.

## What about managed QA services?

QA Wolf and Checksum don't just sell software; their own teams write and maintain your end-to-end tests. QA Wolf's Coverage-as-a-Service also runs the tests, investigates failures and guarantees 80%+ coverage. Checksum prices by the number of maintained workflows: 50 on Emerging, 200 on Scaling and 400+ on Enterprise, with each workflow a test of up to 30 actions. Both are quote-only. Compare a quote with the cost of a QA engineer's time, not with a self-serve tool's plan price.

## Which plan is the best value?

- **Cheapest published paid plan:** KaneAI Starter at $17 per agent a month (annual), though its 2,000 credits cover only about 25 tests.
- **Most generous free plan:** Functionize Free, with 800,000 credits a month and no time limit.
- **Most predictable bill:** Autify Aximo Core or Functionize Growth, both flat monthly prices with set credit allowances.
- **Pay only for what you run:** QA Wolf, at $1 per 5-minute web run with an optional spending cap.

See how they rank on features in our [AI test automation tools ranking](/best/ai-test-automation-tools/), or narrow it down to [tools for mobile apps](/best/ai-mobile-app-testing-tools/), [plain-English test tools](/best/plain-english-test-automation-tools/) or [managed QA services](/best/managed-qa-services/).

*Prices are from each vendor's pricing page, checked November 18, 2026. Functionize and Autify Aximo don't say whether their prices are per team or per user. Usage-based prices depend on test length, retries and how often you run, so ask for an estimate based on your own suite before you buy.*
