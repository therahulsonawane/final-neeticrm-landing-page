#!/usr/bin/env python3
"""Renders a branded 1200x630 share card per entry in scripts/og-cards.json into assets/img/og/.
Run from anywhere:  python3 scripts/make-og.py   (needs Python Playwright + Chrome/Chromium).
Set CHROME=/path/to/chrome if the browser is not at /usr/bin/google-chrome."""
import asyncio, base64, html, io, json, os
from pathlib import Path
from playwright.async_api import async_playwright
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / 'assets/img/og'
b64 = lambda p: base64.b64encode((ROOT / p).read_bytes()).decode()
FONT, MARK = b64('assets/fonts/jakarta-latin.woff2'), b64('assets/img/mark-64.png')

def card(c):
    t = html.escape(c['title']); k = html.escape(c['kicker'])
    size = 66 if len(c['title']) <= 38 else 58 if len(c['title']) <= 58 else 50
    return f"""<!doctype html><meta charset="utf-8"><style>
@font-face{{font-family:J;src:url(data:font/woff2;base64,{FONT}) format('woff2');font-weight:200 800}}
*{{margin:0;box-sizing:border-box}}
body{{width:1200px;height:630px;font-family:J,sans-serif;color:#fff;position:relative;overflow:hidden;
background:radial-gradient(700px 420px at 100% 0%,rgba(42,53,251,.55),transparent 65%),radial-gradient(520px 320px at 0% 100%,rgba(201,241,88,.16),transparent 70%),#0a0b1e}}
.in{{position:absolute;inset:0;padding:64px 72px;display:flex;flex-direction:column;justify-content:space-between}}
.brand{{display:flex;align-items:center;gap:14px;font-weight:800;font-size:34px;letter-spacing:-.02em}}
.brand img{{width:46px;height:43px}}
.brand span{{background:#2a35fb;border-radius:10px;padding:2px 12px;font-size:26px}}
.k{{color:#c9f158;font-weight:800;font-size:24px;letter-spacing:.14em;text-transform:uppercase;margin-bottom:22px}}
h1{{font-weight:800;font-size:{size}px;line-height:1.08;letter-spacing:-.035em;max-width:1010px;text-wrap:balance}}
.f{{display:flex;justify-content:space-between;align-items:center;color:rgba(255,255,255,.7);font-size:24px;font-weight:600}}
.f b{{color:#c9f158}}
</style><div class="in"><div class="brand"><img src="data:image/png;base64,{MARK}">Neeti <span>CRM</span></div>
<div><div class="k">{k}</div><h1>{t}</h1></div>
<div class="f"><div>AI-Powered Sales Intelligence System for Real Estate</div><b>neeticrm.com</b></div></div>"""

async def main():
    cards = json.loads((ROOT / 'scripts/og-cards.json').read_text())
    OUT.mkdir(parents=True, exist_ok=True)
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path=os.environ.get('CHROME', '/usr/bin/google-chrome'), args=['--no-sandbox'])
        pg = await b.new_page(viewport={'width': 1200, 'height': 630})
        for c in cards:
            await pg.set_content(card(c)); await pg.wait_for_timeout(150)
            png = await pg.screenshot(type='png')
            Image.open(io.BytesIO(png)).convert('RGB').save(OUT / f"{c['file']}.jpg", 'JPEG', quality=84, optimize=True)
            print('wrote', c['file'] + '.jpg')
        await b.close()
asyncio.run(main())
