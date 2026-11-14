"""Re-check every tool's pricing page and update src/data/tools.json.

    python scripts/pipeline/check_prices.py              # dry run, writes data-review/<date>.md
    python scripts/pipeline/check_prices.py --apply      # also updates tools.json + price-history.json
    python scripts/pipeline/check_prices.py --only otter-ai,asana

A price is only accepted if the exact number appears in the page text. Accepted records are
marked "verified" with today's date; everything else is left unchanged and listed for review.
"""
import argparse, sys
from common import TOOLS, HISTORY, REVIEW, TODAY, load, save, fetch_text, llm_json, number_in_text

SYSTEM = """You extract software pricing from the visible text of a vendor's pricing page.
Rules: use only numbers that appear in the text. Prices are USD per user per month.
'annual' = the per-month price when billed yearly; 'monthly' = the price when billed month to month.
If the page shows only a yearly total, divide by 12 and say so in notes. Use null when not shown.
Set custom=true for 'contact sales' tiers. Free plans have monthly=0 and annual=0.
For every non-null price include 'evidence': the shortest exact snippet from the page containing it."""

SCHEMA = """Return JSON: {"currency": "USD", "plans": [{"name": str, "monthly": number|null, "annual": number|null,
"custom": bool, "notes": str, "evidence": str}], "freePlan": bool, "freePlanDetails": str|null, "trial": str|null}"""


def check(tool):
    text = fetch_text(tool["pricingUrl"])
    out = llm_json(SYSTEM, f"Tool: {tool['name']}\nURL: {tool['pricingUrl']}\n{SCHEMA}\n\nPAGE TEXT:\n{text}")
    if out.get("currency", "USD") != "USD":
        return None, f"page served {out.get('currency')}, not USD (geo pricing)"
    bad = [f"{p['name']} {k}={p[k]}" for p in out.get("plans", []) for k in ("monthly", "annual") if not number_in_text(p.get(k), text)]
    if bad or not out.get("plans"):
        return None, "unverifiable numbers: " + (", ".join(bad) or "no plans found")
    return out, None


def diff(old, new):
    o = {p["name"].lower(): p for p in old}
    changes = []
    for p in new:
        prev = o.get(p["name"].lower())
        for k in ("monthly", "annual"):
            if prev is None or prev.get(k) != p.get(k):
                changes.append({"plan": p["name"], "field": k, "old": None if prev is None else prev.get(k), "new": p.get(k)})
    return changes


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--apply", action="store_true")
    ap.add_argument("--only", default="")
    a = ap.parse_args()
    tools = load(TOOLS)
    history = load(HISTORY, [])
    only = set(filter(None, a.only.split(",")))
    lines = [f"# Price check {TODAY}", ""]
    for t in tools:
        if only and t["slug"] not in only:
            continue
        try:
            new, err = check(t)
        except Exception as e:  # network, robots, LLM errors
            new, err = None, f"{type(e).__name__}: {e}"
        if err:
            lines.append(f"- **{t['name']}**: NOT updated ({err}). [pricing page]({t['pricingUrl']})")
            continue
        changes = diff(t["plans"], new["plans"])
        lines.append(f"- **{t['name']}**: verified, {len(changes)} change(s)" + "".join(f"\n  - {c['plan']} {c['field']}: {c['old']} → {c['new']}" for c in changes))
        if a.apply:
            t["plans"] = [{k: v for k, v in p.items() if k != "evidence"} for p in new["plans"]]
            t["freePlan"] = bool(new.get("freePlan"))
            t["freePlanDetails"] = new.get("freePlanDetails") or t.get("freePlanDetails")
            t["trial"] = new.get("trial") or t.get("trial")
            t["checked"], t["verification"] = TODAY, "verified"
            history += [{"date": TODAY, "slug": t["slug"], **c} for c in changes]
        print(lines[-1], file=sys.stderr)
    REVIEW.mkdir(exist_ok=True)
    report = "\n".join(lines) + "\n\nReview every change against the vendor page before merging.\n"
    (REVIEW / f"{TODAY}.md").write_text(report)
    (REVIEW / "latest.md").write_text(report)
    if a.apply:
        save(TOOLS, tools)
        save(HISTORY, history)


if __name__ == "__main__":
    main()
