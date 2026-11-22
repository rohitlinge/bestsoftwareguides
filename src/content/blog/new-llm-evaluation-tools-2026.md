---
title: "New LLM Evaluation Tools in 2026: 4 Launches Priced"
description: "Judgment Labs, Raindrop, Coval and Scorecard raised new rounds or launched in the past year. What they do, what their free tiers include, from $80 a month."
type: "buying-guide"
category: "llm-evaluation-tools"
updated: "2026-11-22"
---

**Short answer:** Four agent evaluation tools launched or raised large rounds between October 2025 and November 2026: [Scorecard](/tools/scorecard/) (public launch, October 2025), [Judgment Labs](/tools/judgment-labs/) ($32M, May 2026), [Coval](/tools/coval/) ($28M Series A, June 2026) and [Raindrop](/tools/raindrop/) (Series A bringing it to $50M raised, September 2026). **Three have free plans**: Judgment Labs and Scorecard both allow unlimited users, and Raindrop's Hobby plan covers 1,000 events a month. Paid plans start at **$80 a month (Coval Starter, billed yearly)** and go up to $299 for Raindrop and Scorecard. All four focus on **agents** rather than single prompts. Prices were read on each vendor's pricing page or plan docs on November 22, 2026.

## What do the new tools focus on?

The established tools in our [LLM evaluation ranking](/best/llm-evaluation-tools/), such as [Langfuse](/tools/langfuse/), [Comet Opik](/tools/opik/) and [Braintrust](/tools/braintrust/), started with prompt tracing and datasets. The new tools each pick one agent problem:

| Tool | Main job | Example |
|---|---|---|
| [Judgment Labs](/tools/judgment-labs/) | Trace agents, score traces with judges, gate pull requests | Block a release if a test suite's judge scores drop |
| [Raindrop](/tools/raindrop/) | Find failures in production that throw no error | Flag tool loops, wrong answers and frustrated users |
| [Coval](/tools/coval/) | Simulate callers against voice and chat agents | Test turn-taking, interruptions and audio quality |
| [Scorecard](/tools/scorecard/) | Run agents against test sets and score outputs | Compare prompt versions in a playground before release |

## How do the four compare?

| Tool | Free plan | Cheapest paid plan | Open source | Self-host | Our rank (of 14) |
|---|---|---|---|---|---|
| [Judgment Labs](/tools/judgment-labs/) | Yes, unlimited users, 1 GB, 10K evaluator runs | Pro $250/mo, includes $250 model credits | SDK only (Apache-2.0) | Enterprise (your cloud) | #11 |
| [Coval](/tools/coval/) | No; 7-day trial, card needed | Starter $100/mo, $80 yearly | No | Enterprise (VPC) | #12 |
| [Scorecard](/tools/scorecard/) | Yes, unlimited users, 100,000 scores | Growth $299/mo, 1M scores | No | Not mentioned | #13 |
| [Raindrop](/tools/raindrop/) | Yes, 1,000 events/mo | Pro $299/mo plus $0.003 per event | No | Not stated | #14 |

They rank below the incumbents mainly because our [score](/methodology/) rewards an open-source core, self-hosting and prompt management, which most of the new tools don't offer, and because their entry plans cost more than [Opik](/tools/opik/pricing/) ($19) or [Langfuse](/tools/langfuse/pricing/) ($29).

## What does Judgment Labs cost?

**Beginner is free** with unlimited users, projects, datasets and tests, 1 GB of trace ingest and 10,000 evaluator runs a month, and 14-day retention. **Pro is $250 a month** for unlimited users and includes $250 of model credits for LLM judges, 50 GB of ingest and 180-day retention. Judgment lists SOC 2 Type II and HIPAA on every plan, including the free one. One recent change: dataset test runs were retired on November 12, 2026, and datasets now have to be moved into test suites. See [Judgment Labs pricing](/tools/judgment-labs/pricing/) or [Braintrust vs Judgment Labs](/compare/braintrust-vs-judgment-labs/).

## What does Raindrop cost?

Raindrop's **Hobby plan is free for 1,000 events a month**; ingestion then stops until the next month. **Pro is $299 a month plus metered events** at $0.003 each up to 1 million, so 100,000 events add about $300. Signals are written in plain language and Raindrop turns them into classifiers. Simulations, in early access, replay production events against a pull request. There's no prompt management or offline eval runner. See [Raindrop pricing](/tools/raindrop/pricing/) or [LangSmith vs Raindrop](/compare/langsmith-vs-raindrop/).

## What does Coval cost?

Coval has **no free plan**. Starter is **$100 a month** with 100 simulation minutes; Growth is $500 with 1,000 minutes. Coval states a 20% discount for annual billing, which works out to $80 and $400. Extra simulation minutes cost $0.40 on Starter and $0.25 on Growth. Every plan has unlimited seats. It connects to LiveKit, Pipecat, OpenAI Realtime, Gemini Live and phone numbers. Enterprise starts at $4,500 a month. See [Coval pricing](/tools/coval/pricing/).

## What does Scorecard cost?

**Starter is free** with unlimited users and 100,000 scores. **Growth is $299 a month** with 1 million scores, then $1 per 5,000. Metrics can be AI-judged, human-reviewed or written in Python or TypeScript, and a GitHub Actions integration runs evals in CI. The pricing page doesn't list data retention. See [Scorecard pricing](/tools/scorecard/pricing/) or [Braintrust vs Scorecard](/compare/braintrust-vs-scorecard/).

## Which new tool should you pick?

- **You want CI gates and judge scoring with compliance on the free plan:** Judgment Labs.
- **Your agent is in production and you need to find silent failures:** Raindrop.
- **You build voice agents:** Coval.
- **You want test sets, a prompt playground and a large free score allowance:** Scorecard.
- **You need open source or free self-hosting:** none of these; see [open-source LLM evaluation tools](/best/open-source-llm-evaluation-tools/).

## Which tools did we leave out?

- **Respan (formerly Keywords AI):** its March 2026 change was a new name and a $5M seed, and its docs show no evaluator or dataset features.
- **Future AGI:** it launched in February 2025, before this window.
- **Galileo, Helicone and Patronus AI:** we left these out of the main ranking earlier; Galileo is now part of Splunk.

## How did we check these tools?

We read each vendor's pricing page or plan documentation on November 22, 2026. Raindrop's /pricing URL returned an error, so we used the plans page in its docs. Coval's annual prices are our calculation from the discount it states. Launch dates and funding come from vendor announcements and press coverage, linked on each tool's page.
