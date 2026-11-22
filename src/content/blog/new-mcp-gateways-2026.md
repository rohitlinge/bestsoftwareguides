---
title: "New MCP Gateways in 2026: 4 Launches Compared"
description: "Cloudflare MCP server portals, Zuplo, Speakeasy and Metorial launched in the past year. Free tiers, prices and which suits a team of 10."
type: "buying-guide"
category: "mcp-gateways"
updated: "2026-11-22"
---

**Short answer:** Four MCP gateways launched or reached general availability between November 2025 and November 2026: [Metorial](/tools/metorial/) (Y Combinator, November 2025), [Speakeasy MCP Gateway](/tools/speakeasy-mcp-gateway/) (March 2026), [Zuplo MCP Gateway](/tools/zuplo-mcp-gateway/) (generally available August 2026) and [Cloudflare MCP server portals](/tools/cloudflare-mcp-server-portals/) (generally available September 24, 2026). **Metorial ranks highest, at #6 of 14** in our [MCP gateway ranking](/best/mcp-gateways/): it's open source and its free plan includes 500,000 tool calls a month. **Cloudflare is the cheapest for a team**: Cloudflare One is free for up to 50 users and $7 per user a month after that. Speakeasy bills only for usage, and Zuplo is quote-only. Prices were read on each vendor's pricing page on November 22, 2026.

## How do the four compare?

| Gateway | Launched | Free plan | Paid pricing | Open source | Our rank (of 14) |
|---|---|---|---|---|---|
| [Metorial](/tools/metorial/) | Nov 2025 | Yes, 500,000 tool calls/mo, 2 team members | Scale $250/mo | Yes (Apache 2.0) | #6 |
| [Cloudflare MCP server portals](/tools/cloudflare-mcp-server-portals/) | GA Sep 2026 | Yes, up to 50 users | $7/user/mo | No | #7 |
| [Zuplo MCP Gateway](/tools/zuplo-mcp-gateway/) | GA Aug 2026 | No; trial on request | Quote only | No | #10 |
| [Speakeasy MCP Gateway](/tools/speakeasy-mcp-gateway/) | Mar 2026 | No; free trial | No platform fee; $20 per GiB egress | Not stated | #13 |

Ranks come from our [published score](/methodology/). The four all offer OAuth or credential management, per-user or per-tool access control, tool-call logs, remote endpoints and tool filtering, so price and openness decide most of the order.

## What does a 10-person team pay?

| Gateway | How it adds up | Monthly cost |
|---|---|---|
| Cloudflare MCP server portals | Cloudflare One Free covers up to 50 users | **$0** |
| Metorial | Dev plan allows 2 team members; Scale has the higher limits | **$250** on Scale |
| Speakeasy | Usage only: egress, session storage, risk scanning | Depends on traffic |
| Zuplo | Annual Enterprise contract | Quote |

One caution on Cloudflare: its changelog says portals are available to all customers, but its pricing page doesn't mention portals or list limits per plan. Logpush export of portal logs needs Enterprise.

## What are Cloudflare MCP server portals?

A portal groups several remote MCP servers behind one URL. Users sign in through Cloudflare Access, admins turn individual tools and prompts on or off, and each tool call is logged with time, status, server and duration. Routing through Cloudflare Gateway adds HTTP logging and data-loss scanning. Only remote HTTP servers are supported, so local stdio servers have to be put behind HTTP first. See [Cloudflare MCP server portals pricing](/tools/cloudflare-mcp-server-portals/pricing/) or [Composio vs Cloudflare](/compare/composio-vs-cloudflare-mcp-server-portals/).

## What is Metorial?

Metorial, from Vienna, gives each user one MCP URL that connects their AI client to the tools they're allowed to use, with managed OAuth, per-tool read, write or off settings, and a log of every call. The platform is open source under Apache 2.0 and can be self-hosted. **The free Dev plan includes 500,000 tool calls and 10,000 callbacks a month**, with up to 2 team members and 10 provider integrations. **Scale is $250 a month** for 2.5 million calls. RBAC, SAML SSO and SOC 2 are Enterprise features. See [Metorial pricing](/tools/metorial/pricing/) or [Composio vs Metorial](/compare/composio-vs-metorial/).

## What do Zuplo and Speakeasy offer?

- **Zuplo MCP Gateway** puts remote MCP servers behind one OAuth-protected endpoint, stores each user's upstream tokens so raw tokens never reach the AI client, and filters tools by route, user, role or group. It runs on Zuplo's edge, a dedicated instance or your own servers. Only an Enterprise plan is listed, and SSO, role-based access and self-hosting are add-ons. See [Zuplo vs Kong AI Gateway](/compare/zuplo-mcp-gateway-vs-kong-ai-gateway/).
- **Speakeasy MCP Gateway** replaced Speakeasy's Gram platform in March 2026. Employees sign in through their identity provider, IdP groups decide which servers and tools each person gets, and audit logs stream to Datadog, Splunk, Grafana or any OpenTelemetry collector. It blocks unapproved MCP servers by default. Pay-as-you-go has no platform fee, but usage pricing makes the bill hard to predict. See [Arcade vs Speakeasy](/compare/arcade-vs-speakeasy-mcp-gateway/).

## Which new gateway should you pick?

- **You already use Cloudflare, or want the lowest cost for up to 50 people:** Cloudflare MCP server portals.
- **You want open source with a hosted option:** Metorial, or see [open-source MCP gateways](/best/open-source-mcp-gateways/).
- **You already run your API gateway on Zuplo:** Zuplo MCP Gateway.
- **Security wants every MCP server approved and every call streamed to the SIEM:** Speakeasy.

## Which gateways did we leave out?

- **Portkey:** its pricing page now redirects to a Palo Alto Networks Prisma AIRS contact form.
- **AWS AgentCore Gateway, Azure API Management and Apigee:** MCP features inside large cloud platforms rather than standalone gateways.
- **Runlayer:** no public pricing; demo only.
- **Smithery:** its hosted proxy shut down on October 31, 2026.

## How did we check these gateways?

We read each vendor's pricing page, docs and changelog or repository on November 22, 2026, and linked every source on each tool's page. Launch dates come from vendor changelogs, launch posts and Y Combinator's launch page; Metorial's YC post gives only an approximate date, so we list it as November 2025.
