---
title: "New AI Testing Tools in 2026: 4 Launches Priced"
description: "TestSprite, Thunders, e2e and Bug0 launched or raised in the past 18 months. From a free open-source runner to a $2,500-a-month managed service."
type: "buying-guide"
category: "ai-test-automation-tools"
updated: "2026-11-22"
---

**Short answer:** Four AI test automation tools launched or raised their first big rounds between June 2025 and November 2026: [Thunders](/tools/thunders/) ($9M seed, June 2025), [TestSprite](/tools/testsprite/) ($6.7M seed and version 2.0, October 2025), [e2e](/tools/e2e/) (open-source launch, October 2026) and [Bug0](/tools/bug0/) (QA Agent library, October 2026). **TestSprite now ranks #1 of 14** in our [AI test automation ranking](/best/ai-test-automation-tools/), with a free plan and paid plans from $19 per seat a month. **e2e is free and open source**; you pay only for the AI model it calls. At the top end, Bug0's managed service costs $2,500 a month. Prices were read on each vendor's pricing page on November 22, 2026.

## How do the four compare?

| Tool | Launched | Type | Free plan | Cheapest paid plan | Our rank (of 14) |
|---|---|---|---|---|---|
| [TestSprite](/tools/testsprite/) | Oct 2025 | Cloud + CLI + MCP server | Yes, 150 credits/mo | Starter $19/seat/mo, first month free | #1 |
| [Thunders](/tools/thunders/) | Jun 2025 | Cloud platform, optional QA service | No; 14-day trial | Starter $375/mo yearly, $479 monthly | #3 |
| [e2e](/tools/e2e/) | Oct 2026 | Open-source framework | Yes, all of it | None; bring your own model | #7 |
| [Bug0](/tools/bug0/) | Oct 2026 | Managed service | No; discounted 60-day pilot | $2,500/mo, month to month | #13 |

Ranks come from our [published score](/methodology/), which weighs the eight testing features we track, price, the free plan and price transparency.

## What does TestSprite do and cost?

TestSprite reads a plain-language description, a PRD or a ticket, writes end-to-end frontend and backend tests, runs them against your live app and reports failures with a suggested fix. It works through a web app, an open-source CLI, an MCP server and plugins for coding agents, and can test every GitHub pull request. **The free plan has 150 credits a month and PR testing on one repo. Starter is $19 per seat a month** (first month free) with 400 credits, Standard $39 and Pro $69. Annual billing saves 35%, but the page doesn't print annual prices. Mobile app testing isn't described. See [TestSprite pricing](/tools/testsprite/pricing/) or [TestSprite vs Momentic](/compare/testsprite-vs-momentic/).

## What does Thunders do and cost?

Thunders, formerly Thunder Code, is based in Paris. It turns plain-language requirements into test journeys that AI agents run and repair when the UI changes, across web, API, mobile and desktop apps. **Starter is $479 a month, or $375 a month billed yearly**, with 300 credits and up to 3 seats; iOS and Android testing start at Pro ($1,000 a month yearly). It lists ISO 27001, SOC 2, GDPR and EU data residency on every plan. An optional QA-as-a-service has specialists write and maintain tests. See [Thunders pricing](/tools/thunders/pricing/) or [Momentic vs Thunders](/compare/momentic-vs-thunders/).

## What is e2e?

e2e is an Apache-2.0 test framework from the team behind TesterArmy, which shuts down on January 15, 2027. Tests can use exact locators, natural-language goals that an agent carries out, or both, on Chromium, Firefox, WebKit, iOS simulators and Android emulators. **Successful agent steps are cached and replayed without model calls**, so repeat runs are cheaper and faster, and the agent steps in again when the app changes. There's no hosted cloud yet; the team says one is planned for 2027. It raised EUR 7M in November 2026. See [e2e vs QA Wolf](/compare/e2e-vs-qa-wolf/).

## What does Bug0 cost?

Bug0 is a managed service: a forward-deployed engineer plans coverage and builds Playwright tests with Bug0's AI engine, then reviews failures and files bugs. **It costs a flat $2,500 a month**, month to month, for up to 500 user flows, with no charges for runs, AI credits or engineer hours. In October 2026 it published its test engine as QA Agent, a source-available Playwright library. It lists SOC 2 and offers BAAs. See [Bug0 pricing](/tools/bug0/pricing/) or [Bug0 vs QA Wolf](/compare/bug0-vs-qa-wolf/).

## Which new tool should you pick?

- **A low-cost start, or tests run from your coding agent:** TestSprite.
- **No vendor bill at all, and you're happy running the tests yourself:** e2e.
- **Web, API and mobile in one platform with EU data residency:** Thunders.
- **You want someone else to write and maintain the tests:** Bug0 or Thunders' QA service, or see [managed QA services](/best/managed-qa-services/).
- **Native mobile apps:** e2e (simulators and emulators) or Thunders Pro; see [AI mobile app testing tools](/best/ai-mobile-app-testing-tools/).

## Which tools did we leave out?

- **TesterArmy:** it's shutting down in January 2027, and its team now builds e2e.
- **Octomind:** it shut down.
- **Spur and Ranger:** both launched before mid-2025 and publish no prices.
- **Endform:** a fast Playwright test runner billed per test minute, not an AI testing tool.

## How did we check these tools?

We read each vendor's pricing and product pages on November 22, 2026; e2e has no pricing page, so we used its site, docs and GitHub repository. Thunders' page shows two Starter figures without labels; we took the higher one as the monthly price and noted that on its pricing page. Launch dates and funding come from vendor posts and press coverage, linked on each tool's page.
