# bestsoftwareguides.online

A fast static software directory built to be **cited by AI search** (ChatGPT, Perplexity, Claude, Gemini, Copilot) and to rank in Google and Bing.
Built with Astro. Content goes live on a schedule (drip publishing). Prices are re-checked weekly by an LLM pipeline that you review before merging.

## What's included

| Page type | URL pattern | Count at full launch |
|---|---|---|
| Category ranking | `/best/{category}/` | 4 |
| Use-case ranking | `/best/{use-case}/` (e.g. `password-managers-for-linux`) | 6 |
| Free-plan ranking | `/best/free-{category}/` | 4 |
| Tool review | `/tools/{tool}/` | 20 |
| Tool pricing | `/tools/{tool}/pricing/` | 20 |
| Tool alternatives | `/tools/{tool}/alternatives/` | 20 |
| Head-to-head | `/compare/{a}-vs-{b}/` | 40 |
| Guides (blog) | `/blog/{slug}/` | 5 |
| Hubs, policies, 404 | `/best/`, `/compare/`, `/blog/`, `/methodology/` … | 10 |
| Machine files | `/sitemap.xml`, `/robots.txt`, `/llms.txt`, `/rss.xml`, `/data/tools.json`, `/urls.json` | 6 |

### Features aimed at AI citations
See **[CONTENT_PLAN.md](CONTENT_PLAN.md)** for the techniques taken from itechguides.com and the 10-week publishing calendar.

- **Answer box first** on every page: one or two quotable sentences with the verdict and price.
- **Use-case rankings** (`useCases` in `categories.json`): filtered lists with a printed rule, the tools left out and why. Indexed only with 3+ matching tools.
- **Numbers from the data** on every ranking ("4 of 5 have a free plan; median entry $14/user/mo") and a **scoreboard** on every comparison ("A leads on 3 checks").
- **Guide types** (`type:` how-to, fix-it, explained, buying-guide, pricing-report) and `category:` frontmatter, which links each guide to its ranking.
- **Tables** for pricing, features and comparisons, plus FAQs generated from the same data, so they never contradict the tables.
- **JSON-LD** on every page: `ItemList`, `SoftwareApplication` + `AggregateOffer`, `FAQPage`, `BreadcrumbList`, `Article`/`BlogPosting`, `Organization`.
- **Dated, sourced prices.** Each price shows its checked date and status (*verified* on the vendor page, or *reported* from published breakdowns), with source links.
- **Transparent score.** A fixed formula (`src/lib/data.ts`, explained on `/methodology/`). No paid ranks.
- **Quality gate.** Stale data (over 120 days) or empty records are automatically set to `noindex` and kept out of the sitemap.
- **AI crawlers allowed** in `robots.txt`, an `llms.txt` site map, open data at `/data/tools.json`, and an IndexNow ping on every deploy.

## Drip-publishing plan

Set in `src/data/schedule.json`. Days count from `launchDate` in `site.config.mjs`.

| Day | Goes live |
|---|---|
| 0 | AI Meeting Note Takers + Project Management (rankings, 10 tools, pricing + alternatives pages), guide: AI note taker pricing |
| 2 | AI note taker comparisons (10) + free AI note takers page |
| 3 | Guide: free project management plans |
| 4 | Project management comparisons (10) + free page |
| 5 | Guide: annual vs monthly billing |
| 7 | CRM Software category (5 tools) |
| 8 | Guide: how much a CRM costs |
| 9 | CRM comparisons + free page |
| 14 | Password Managers category (5 tools) |
| 15 | Guide: password manager price changes |
| 16 | Password manager comparisons + free page |

The daily GitHub Action rebuilds at 07:00 IST, so each item appears on its day without manual work. **Set `launchDate` to the day you go live.**

Suggested next categories (one every 7 days): AI writing tools, website builders, email marketing, VPNs, help desk software, AI image generators, video editing, accounting software, HR/payroll, AI coding assistants. Add each with `draft_tool.py` (below) and a new line in `schedule.json`.

## Run locally

```bash
npm install
npm run dev                  # http://localhost:4321 (shows only content live today)
npm run build:preview        # builds everything, ignoring the schedule (noindex), into dist/
LAUNCH_DATE=2026-11-16 BUILD_DATE=2026-11-30 npm run build   # see the site as it will look on a given day
```

## Deploy (Cloudflare Workers, free)

The site is a static Cloudflare Worker named `bestsoftwareguides`, configured in `wrangler.jsonc`. Two things deploy it, and both use that file:

- **Every push to `main`**: Cloudflare Workers Builds (the Worker is connected to this GitHub repo) builds and deploys.
- **Every day at 07:00 IST**: the GitHub Action **Daily publish** rebuilds and deploys, so scheduled pages go live on their date even with no push. Then it pings IndexNow.

One-time setup for the daily job (GitHub → Settings → Secrets and variables → Actions):
1. **Secret** `CLOUDFLARE_API_TOKEN`: Cloudflare → My Profile → API Tokens → Create Token → template **Edit Cloudflare Workers**.
2. **Variable** `CLOUDFLARE_ACCOUNT_ID`: your Cloudflare account ID (Workers & Pages overview, right-hand side).
3. Actions tab → **Daily publish** → **Run workflow** once to check it.
4. For the weekly price check, also add `OPENAI_API_KEY` (or `ANTHROPIC_API_KEY` plus a variable `LLM_PROVIDER=anthropic`).

Dates are resolved in `astro.config.mjs` (in Node) and baked into the build. Don't read `new Date()` or `process.env` at module level in `src/`: Workers Builds prerenders inside the Workers runtime, where module-level time is 1970-01-01 and would hide every scheduled page.

## After the first deploy (do these once)

1. **Bing Webmaster Tools:** add the site and submit `https://bestsoftwareguides.online/sitemap.xml`. ChatGPT search has historically relied heavily on Bing's index, so this matters.
2. **Google Search Console:** verify the domain (DNS) and submit the sitemap.
3. Run `node scripts/indexnow.mjs --all` once.
4. Replace the placeholder text on `/about/` with real editor names and bios, and review `/privacy/` and `/terms/`.
5. Create `hello@bestsoftwareguides.online` (Cloudflare Email Routing is free) or change `contactEmail` in `site.config.mjs`.

## Keeping data fresh (the moat)

```bash
pip install -r scripts/pipeline/requirements.txt && python -m playwright install chromium
export OPENAI_API_KEY=...            # or ANTHROPIC_API_KEY + LLM_PROVIDER=anthropic
python scripts/pipeline/check_prices.py            # dry run → data-review/<date>.md
python scripts/pipeline/check_prices.py --apply    # update tools.json + price-history.json
```

- A price is accepted only if the exact number appears on the vendor's page. Accepted records become **verified** with today's date.
- The **Weekly price check** workflow does this every Monday and opens a pull request. Review it and merge; the next daily build publishes it.
- Pages served in another currency (some vendors price by IP) are skipped and listed for manual checking.

**Launch data status:** all 20 launch records are marked *reported*. They come from breakdowns of each vendor's pricing page published in 2026 (sources are linked on every page), and were not read directly from the vendor pages. Run `check_prices.py --apply` before launch so as many as possible become *verified*. Records the script cannot verify (JS-heavy pages, geo pricing) need a quick manual check.

### Add a tool or a new category
```bash
python scripts/pipeline/draft_tool.py --name "Granola" --category ai-meeting-note-takers \
  --website https://www.granola.ai --pricing-url https://www.granola.ai/pricing
```
For a new category: copy an entry in `src/data/categories.json` (name, intro, buying tips, 5 feature labels), draft at least 5 tools, then add `{ "slug": "...", "day": N, "comparesDay": N+2 }` to `schedule.json`.

Then fetch the new tools' official icons: `node scripts/find-logos.mjs` reads each vendor homepage's declared icon and stores its URL as `logo` in `tools.json` (only tools without one; `--all` re-checks every tool). Pages load the icon straight from the vendor's server, with no referrer, and fall back to a lettered tile if it fails. Set `logo` by hand to override a bad pick, or to `""` to keep the tile. Tools hosted on GitHub are skipped.

## MCP server for AI assistants

`https://bestsoftwareguides.online/mcp` is a read-only [MCP](https://modelcontextprotocol.io) server (Streamable HTTP, no key). AI assistants call tools such as `get_pricing` or `get_ranking` and get a few hundred tokens of JSON instead of reading whole pages (~6,000 tokens each). People opening `/mcp` in a browser are sent to the docs page, `/ai/`.

- `worker/index.js`: the server. `wrangler.jsonc` runs it only for `/mcp`; every other URL is served from `dist/` as before.
- `src/pages/mcp-data.json.ts`: the snapshot it answers from, built with the site, so it follows the publishing schedule and featured-partner labels automatically. No extra deploy step.
- Tools: `search`, `list_categories`, `get_ranking` (filters: free plan, max price, features), `get_tool`, `get_pricing`, `compare_tools`.
- Try it: `curl -s https://bestsoftwareguides.online/mcp -H "Content-Type: application/json" -d '{"jsonrpc":"2.0","id":1,"method":"tools/list"}'`

## Measure ChatGPT citations
```bash
python scripts/pipeline/citation_tracker.py                      # OpenAI with web search
python scripts/pipeline/citation_tracker.py --engine perplexity  # needs PERPLEXITY_API_KEY
```
Results are appended to `data-review/citations.csv`. Also watch server logs for `OAI-SearchBot` and `ChatGPT-User`, and analytics for `chatgpt.com` referrals.

## Monetization (later)
Add affiliate links to `website` fields once you join programs. If you sell sponsorships, show them in a separate box labeled "Sponsored", and never inside the ranked list or the score. That is what keeps the site trustworthy and citable, and it is what the disclosure page promises.

## Honest expectations
- New domains usually take 3-6 months to rank in Google. Bing and AI-search citations can start within weeks of indexing.
- What gets cited is **specific, fresh, sourced data**. Keep the weekly checks running, add a category every week, and get links by publishing data people want to reference (price-change roundups, cost-per-team tables).
