"""Shared helpers: paths, page fetching (robots-aware, JS fallback) and LLM JSON calls."""
import json, os, re, datetime, urllib.robotparser
from pathlib import Path
from urllib.parse import urlparse

import requests
from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parents[2]
TOOLS = ROOT / "src/data/tools.json"
CATEGORIES = ROOT / "src/data/categories.json"
HISTORY = ROOT / "src/data/price-history.json"
REVIEW = ROOT / "data-review"
UA = "BestSoftwareGuidesBot/1.0 (+https://bestsoftwareguides.online/methodology/)"
TODAY = datetime.date.today().isoformat()


def load(p, default=None):
    return json.loads(p.read_text()) if p.exists() else default


def save(p, data):
    p.parent.mkdir(parents=True, exist_ok=True)
    p.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n")


def allowed(url):
    u = urlparse(url)
    rp = urllib.robotparser.RobotFileParser()
    rp.set_url(f"{u.scheme}://{u.netloc}/robots.txt")
    try:
        rp.read()
    except Exception:
        return True
    return rp.can_fetch(UA, url)


def _clean(html):
    soup = BeautifulSoup(html, "html.parser")
    for t in soup(["script", "style", "noscript", "svg"]):
        t.decompose()
    text = re.sub(r"\n\s*\n+", "\n", soup.get_text("\n"))
    return text.strip()


def fetch_text(url, force_browser=False):
    """Return visible page text. Falls back to a headless browser for JS-rendered pricing pages."""
    if not allowed(url):
        raise PermissionError(f"robots.txt disallows {url}")
    text = ""
    if not force_browser:
        r = requests.get(url, headers={"User-Agent": UA, "Accept-Language": "en-US"}, timeout=30)
        r.raise_for_status()
        text = _clean(r.text)
    if force_browser or len(text) < 1500 or "$" not in text:
        from playwright.sync_api import sync_playwright
        with sync_playwright() as p:
            b = p.chromium.launch()
            pg = b.new_page(user_agent=UA, locale="en-US")
            pg.goto(url, wait_until="networkidle", timeout=60000)
            text = _clean(pg.content())
            b.close()
    return text[:60000]


def llm_json(system, user):
    """Ask the configured LLM for a JSON object. LLM_PROVIDER=openai|anthropic, LLM_MODEL optional."""
    provider = os.getenv("LLM_PROVIDER", "openai")
    if provider == "anthropic":
        import anthropic
        client = anthropic.Anthropic()
        msg = client.messages.create(
            model=os.getenv("LLM_MODEL", "claude-haiku-5-5"), max_tokens=4000, system=system,
            messages=[{"role": "user", "content": user + "\n\nReturn only a JSON object."}],
        )
        raw = msg.content[0].text
    else:
        from openai import OpenAI
        client = OpenAI()
        r = client.chat.completions.create(
            model=os.getenv("LLM_MODEL", "gpt-5-mini"),
            response_format={"type": "json_object"},
            messages=[{"role": "system", "content": system}, {"role": "user", "content": user}],
        )
        raw = r.choices[0].message.content
    m = re.search(r"\{.*\}", raw, re.S)
    return json.loads(m.group(0) if m else raw)


def number_in_text(n, text):
    """True if the price literally appears on the page (guards against LLM hallucination)."""
    if n is None or n == 0:
        return True
    forms = {f"{n:g}", f"{n:.2f}", f"{n:,.2f}", f"{n:,.0f}" if float(n).is_integer() else f"{n:g}"}
    return any(re.search(r"(?<![\d.])" + re.escape(f) + r"(?![\d])", text) for f in forms)
