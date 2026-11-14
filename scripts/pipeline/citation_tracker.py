"""Track whether AI answer engines cite bestsoftwareguides.online.

    OPENAI_API_KEY=... python scripts/pipeline/citation_tracker.py
    PERPLEXITY_API_KEY=... python scripts/pipeline/citation_tracker.py --engine perplexity

Runs each prompt in prompts.txt through an engine with web search, records the cited URLs,
and appends a row per prompt to data-review/citations.csv. Run it weekly and watch the trend.
Note: API answers approximate, but do not exactly match, what users see in the ChatGPT app.
Also check your server logs for OAI-SearchBot and ChatGPT-User, and analytics for chatgpt.com referrals.
"""
import argparse, csv, os, re
from pathlib import Path
import requests
from common import REVIEW, TODAY

DOMAIN = "bestsoftwareguides.online"
PROMPTS = Path(__file__).with_name("prompts.txt")


def ask_openai(prompt):
    from openai import OpenAI
    r = OpenAI().responses.create(model=os.getenv("CITE_MODEL", "gpt-5-mini"), tools=[{"type": "web_search"}], input=prompt)
    urls = []
    for item in r.output:
        for c in getattr(item, "content", []) or []:
            for ann in getattr(c, "annotations", []) or []:
                if getattr(ann, "url", None):
                    urls.append(ann.url)
    return urls


def ask_perplexity(prompt):
    r = requests.post("https://api.perplexity.ai/chat/completions", timeout=120,
                      headers={"Authorization": f"Bearer {os.environ['PERPLEXITY_API_KEY']}"},
                      json={"model": os.getenv("CITE_MODEL", "sonar"), "messages": [{"role": "user", "content": prompt}]})
    r.raise_for_status()
    j = r.json()
    return j.get("citations") or [s.get("url") for s in j.get("search_results", [])]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--engine", choices=["openai", "perplexity"], default="openai")
    a = ap.parse_args()
    ask = ask_openai if a.engine == "openai" else ask_perplexity
    prompts = [p.strip() for p in PROMPTS.read_text().splitlines() if p.strip() and not p.startswith("#")]
    REVIEW.mkdir(exist_ok=True)
    out = REVIEW / "citations.csv"
    new = not out.exists()
    hits = 0
    with out.open("a", newline="") as f:
        w = csv.writer(f)
        if new:
            w.writerow(["date", "engine", "prompt", "cited", "our_urls", "all_domains"])
        for p in prompts:
            try:
                urls = ask(p)
            except Exception as e:
                print("ERROR", p, e)
                continue
            ours = [u for u in urls if DOMAIN in u]
            domains = sorted({re.sub(r"^www\.", "", u.split("/")[2]) for u in urls if "//" in u})
            hits += bool(ours)
            w.writerow([TODAY, a.engine, p, bool(ours), " ".join(ours), " ".join(domains)])
            print(("CITED  " if ours else "-      ") + p)
    print(f"\n{hits}/{len(prompts)} prompts cited {DOMAIN}")


if __name__ == "__main__":
    main()
