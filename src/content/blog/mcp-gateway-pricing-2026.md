---
title: "MCP Gateway Pricing 2026: Free, Per-User and Per-Call"
description: "What 10 MCP gateways cost: four are free and open source, others charge per user or per tool call. Costs for a 3-person and a 10-person team, checked Nov 2026."
type: "pricing-report"
category: "mcp-gateways"
updated: "2026-11-18"
---

**Short answer:** Four of the 10 MCP gateways we priced are **free and open source**: [Docker MCP Gateway](/tools/docker-mcp-gateway/pricing/), [Obot](/tools/obot/pricing/) Community (up to 100 users), [IBM ContextForge](/tools/ibm-contextforge/pricing/) and [Microsoft MCP Gateway](/tools/microsoft-mcp-gateway/pricing/). You pay only for the servers you run them on. Hosted gateways charge per user ([Composio](/tools/composio/pricing/) $18 and [TrueFoundry](/tools/truefoundry-mcp-gateway/pricing/) $25 a month), per tool call ([Arcade](/tools/arcade/pricing/), $25 a month plus $0.01 a call) or per task ([Zapier MCP](/tools/zapier-mcp/pricing/), from $19.99 a month on annual billing). A 3-person team can run on free tiers; a 10-person team making 20,000 tool calls a month pays about **$180 to $250 a month** on the hosted options. Prices were checked on each vendor's pricing page or repository on November 18, 2026.

## How are MCP gateways priced?

MCP gateways use five pricing models:

| Pricing model | Gateways | What you pay for |
|---|---|---|
| Free, open source | Docker MCP Gateway, Obot Community, IBM ContextForge, Microsoft MCP Gateway | Your own hosting (servers, Kubernetes, Azure) |
| Per user | Composio, TrueFoundry | A monthly fee for each seat, with an allowance of calls or requests per seat |
| Per tool call | Arcade | A small platform fee plus a price per call |
| Per task | Zapier MCP | A monthly task allowance; each successful MCP tool call uses 2 tasks |
| Platform plus usage | Kong AI Gateway | A base fee plus gateway requests, control planes and models |

Three others are quote-only: Mintive (formerly MintMCP), Obot Cloud and Docker's invite-only AI Governance product.

## What does each hosted MCP gateway cost?

| Gateway and plan | Price | Includes | Extra usage |
|---|---|---|---|
| [Composio](/tools/composio/pricing/) Standard | $18 per seat a month | 10,000 tool calls per seat, pooled; SSO | $0.005 per tool call |
| [TrueFoundry](/tools/truefoundry-mcp-gateway/pricing/) Pro | $25 per user a month | 20,000 requests per user; SSO | $20 per 100,000 requests |
| [Arcade](/tools/arcade/pricing/) Team | $25 a month flat | Platform fee | $0.01 per tool call |
| [Zapier MCP](/tools/zapier-mcp/pricing/) Professional | $29.99 a month ($19.99 billed annually) | 750 tasks (about 375 tool calls), 1 user | Higher task tiers |
| [Zapier MCP](/tools/zapier-mcp/pricing/) Team | $103.50 a month ($69 billed annually) | 2,000 tasks (about 1,000 tool calls), up to 25 users | Higher task tiers |
| [Kong AI Gateway](/tools/kong-ai-gateway/pricing/) Plus | From $25 a month | 1M gateway requests, 5 LLMs | $200 per 1M requests |
| [Mintive](/tools/mintive/pricing/) | Quote | Per-user licence plus platform fee | — |

One catch with Kong: its pricing page says MCP traffic is included in Plus, but its plugin docs list the AI MCP Proxy and AI MCP OAuth2 plugins as Enterprise-only. Check with Kong before you plan around the $25 plan.

## What does a small team pay?

**3 people, about 1,000 tool calls a month:**

| Gateway | Plan | Monthly cost |
|---|---|---|
| Composio | Free (up to 3 members, 10,000 calls) | $0 |
| TrueFoundry | Developer (free for up to 3 users) | $0 |
| Arcade | Free (2,000 calls) | $0 |
| Zapier MCP | Team (2,000 tasks = about 1,000 calls) | $69 billed annually, $103.50 monthly |
| Open-source gateways | Self-hosted | $0 plus hosting |

Zapier's Free and Professional plans are for a single user, so a team of 3 needs Team. And because each tool call uses two tasks, the Free plan's 100 tasks cover only about 50 calls.

## What does a 10-person team pay?

**10 people, about 20,000 tool calls a month:**

| Gateway | How it adds up | Monthly cost |
|---|---|---|
| Composio Standard | 10 seats × $18; the 100,000 pooled calls cover 20,000 | **$180** |
| Arcade Team | $25 + 20,000 calls × $0.01 | **$225** |
| TrueFoundry Pro | 10 users × $25 | **$250** |
| Zapier MCP | 40,000 tasks a month: above the Team plan's 2,000 | Higher tier or Enterprise |
| Open-source gateways | Free software | Hosting only |

At this size, Composio is the cheapest hosted option, and its price stays flat until the team's pooled allowance is used up. Arcade becomes cheaper than Composio below about 15,500 calls a month for 10 people, but costs more as calls grow, because every call is billed.

## Is a free open-source MCP gateway enough?

Often, yes, if you have someone to run it:

- **Docker MCP Gateway** (MIT): a CLI plugin that ships with Docker Desktop's MCP Toolkit, with a catalog of 300+ MCP servers.
- **Obot Community** (MIT): self-hosted, free for up to 100 users; an Enterprise licence removes the cap.
- **IBM ContextForge** (Apache 2.0): installs from PyPI, a Docker image or a Helm chart.
- **Microsoft MCP Gateway** (MIT): runs on your own Kubernetes cluster or Azure; Azure resource costs are separate.

What you give up compared with hosted plans: managed OAuth sign-in for hundreds of apps, vendor support, and compliance paperwork such as SOC 2 reports.

## When do SSO and enterprise controls kick in?

- **Composio and TrueFoundry** include SSO on their entry paid plans ($18 and $25 per user).
- **Arcade, Zapier, Kong and Obot** put SSO, RBAC or admin controls such as action restrictions on Enterprise plans, which are quote-only.
- **Self-hosting inside your own VPC** is Enterprise-only on Composio, TrueFoundry and Arcade.

See how they compare on features in our [MCP gateways ranking](/best/mcp-gateways/), or go straight to the [open-source](/best/open-source-mcp-gateways/) and [self-hosted](/best/self-hosted-mcp-gateways/) lists.

*Prices are from each vendor's pricing page, docs or GitHub repository, checked November 18, 2026. The monthly costs above use list prices and assume every tool call is billed; real bills also depend on retries, model costs and hosting. Confirm on the vendor's site before you buy.*
