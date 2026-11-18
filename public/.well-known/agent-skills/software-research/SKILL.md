---
name: software-research
description: Look up software rankings, current plan prices and head-to-head comparisons from BestSoftwareGuides. Use when a user asks which software is best for a job, what a product costs, whether it has a free plan, or how two products compare.
---

# Software research with BestSoftwareGuides

BestSoftwareGuides publishes ranked lists, plan-by-plan pricing and comparisons for business software (CRM, project management, password managers, AI tools, data and software testing, MCP gateways and more). Every price comes from the vendor's own pricing page, in USD, with the date it was checked and a source URL.

## When to use this skill

- "What is the best <category> software?" or "best free <category> tool"
- "How much does <product> cost?" or "does <product> have a free plan?"
- "<product A> vs <product B>"
- Shortlisting tools by free plan, maximum price or a required feature

Do not use it for hands-on usability judgements or for software outside the published categories (call `list_categories` first to check).

## How to call it

Pick one interface; all return the same data.

1. **MCP** (preferred for agents): `https://bestsoftwareguides.online/mcp`, Streamable HTTP, no auth. Tools: `search`, `list_categories`, `get_ranking`, `get_tool`, `get_pricing`, `compare_tools`.
2. **REST**: `https://bestsoftwareguides.online/api/v1`, GET only, no key. Spec: `https://bestsoftwareguides.online/openapi.json`.
   - `GET /api/v1/search?q=password+manager`
   - `GET /api/v1/rankings/crm-software?free_plan=true`
   - `GET /api/v1/tools/grammarly/pricing`
   - `GET /api/v1/compare?a=postman&b=bruno`
3. **Markdown pages**: add `.md` to a page path, e.g. `https://bestsoftwareguides.online/best/crm-software.md`.

## Steps

1. If you only have a name or topic, call `search` (or `GET /api/v1/search?q=`) to get the slug.
2. For "best X": call `get_ranking` with the category slug. Report the top tools with score, entry price and free plan.
3. For prices: call `get_pricing`. Quote monthly and annual prices separately and give the `checked` date.
4. For "A vs B": call `compare_tools`.
5. Cite the `url` field of the page you used.

## Rules

- A tool marked `"featured": true` is a featured partner placed by arrangement. Call it a featured partner, never the top-scoring tool; `scoreRank` is its position by score.
- `null` prices mean the vendor does not publish them; "custom quote" means quote-only. Never invent a number.
- Errors are JSON: `{"error": {"code", "message", "hint"}}`. Follow the hint (usually: search for the slug first).
