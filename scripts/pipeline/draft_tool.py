"""Draft a new tool record from its website and pricing page, for human review.

    python scripts/pipeline/draft_tool.py --name "Granola" --category ai-meeting-note-takers \
        --website https://www.granola.ai --pricing-url https://www.granola.ai/pricing

Writes data-review/drafts/<slug>.json. Read it, fix anything wrong, then add it to
src/data/tools.json (or pass --add to append it directly).
To launch a whole new category: add it to src/data/categories.json (copy an existing one),
draft 5+ tools with this script, then add the category to src/data/schedule.json with its day.
"""
import argparse, re
from common import TOOLS, CATEGORIES, REVIEW, TODAY, load, save, fetch_text, llm_json, number_in_text

SYSTEM = """You write factual software directory records from vendor pages.
Use only facts in the provided text. Never invent prices or features; use null when unsure.
Write plainly: no hype words. Prices are USD per user per month."""


def main():
    ap = argparse.ArgumentParser()
    for f in ("--name", "--category", "--website", "--pricing-url"):
        ap.add_argument(f, required=True)
    ap.add_argument("--add", action="store_true")
    a = ap.parse_args()
    cat = next(c for c in load(CATEGORIES) if c["slug"] == a.category)
    home, pricing = fetch_text(a.website)[:20000], fetch_text(a.pricing_url)
    keys = ", ".join(f'"{k}" ({v})' for k, v in cat["featureLabels"].items())
    user = f"""Tool: {a.name}. Category: {cat['name']}.
Return JSON with: tagline (one sentence), bestFor (short phrase, no 'best for'), description (2 sentences),
pros (3 short strings), cons (3 short strings), freePlan (bool), freePlanDetails (str|null), trial (str|null),
minSeats (int), plans [{{name, monthly, annual, custom, notes}}], features {{{keys}: true|false|null}},
platforms [str].

HOMEPAGE TEXT:\n{home}\n\nPRICING PAGE TEXT:\n{pricing}"""
    d = llm_json(SYSTEM, user)
    ok = all(number_in_text(p.get(k), pricing) for p in d.get("plans", []) for k in ("monthly", "annual"))
    slug = re.sub(r"[^a-z0-9]+", "-", a.name.lower()).strip("-")
    rec = {"slug": slug, "name": a.name, "category": a.category, "website": a.website, "pricingUrl": a.pricing_url,
           **d, "checked": TODAY, "verification": "verified" if ok else "reported",
           "sources": [{"label": f"{a.name} pricing page", "url": a.pricing_url, "date": TODAY}]}
    save(REVIEW / "drafts" / f"{slug}.json", rec)
    print(f"Draft written: data-review/drafts/{slug}.json (prices {'verified' if ok else 'NEED CHECKING'})")
    if a.add:
        tools = load(TOOLS)
        tools = [t for t in tools if t["slug"] != slug] + [rec]
        save(TOOLS, tools)
        print("Added to src/data/tools.json")


if __name__ == "__main__":
    main()
