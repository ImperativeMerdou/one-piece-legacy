#!/usr/bin/env python3
"""Generate contact sheets from the scanned index so thousands of assets can be
inspected visually without opening them one by one.

Groups: top-level folder / subfolder (first two path segments), plus synthetic
groups for probable characters (filename token match), visual families, and
near-duplicate clusters. Near-duplicate variants collapse to their canonical
representative (variants counted in the label) so sheets aren't flooded.

Output: .private-assets-cache/sheets/<group>_<n>.jpg  (10 columns, <=8 rows,
140px cells with id/dims/ext caption strip) + sheets/SHEET_INDEX.md

Usage: python tools/asset-pipeline/make_sheets.py [--group-min 8]
"""
import json, os, math, re, sys, collections
from PIL import Image, ImageDraw, ImageFont

REPO = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
CACHE = os.path.join(REPO, ".private-assets-cache")
SHEETS = os.path.join(CACHE, "sheets")
CELL, CAP, COLS, ROWS = 128, 30, 10, 8

CHAR_TOKENS = [
    "luffy","zoro","nami","usopp","sanji","chopper","robin","franky","brook","jinbe",
    "ace","sabo","shanks","mihawk","buggy","smoker","tashigi","garp","sengoku","kuzan",
    "borsalino","sakazuki","fujitora","crocodile","doflamingo","kuma","hancock","moria",
    "law","kid","killer","hawkins","apoo","drake","bonney","urouge","capone","bege",
    "arlong","kaido","bigmom","linlin","katakuri","cracker","smoothie","perospero",
    "marco","jozu","vista","whitebeard","newgate","teach","blackbeard","shiryu","burgess",
    "lafitte","enel","wiper","bellamy","lucci","kaku","jabra","blueno","kalifa","spandam",
    "iva","inazuma","magellan","hannyabal","shiki","zephyr","tesoro","bullet","cesar",
    "caesar","monet","vergo","pica","trebol","diamante","sugar","violet","rebecca",
    "kyros","ssabo","fukaboshi","shirahoshi","neptune","hody","decken","tamago","pekoms",
    "pedro","carrot","brulee","oven","daifuku","judge","reiju","ichiji","niji","yonji",
    "pudding","chiffon","praline","yasopp","lucky","benn","rayleigh","shakky","hatchan",
    "keimi","pappag","duval","perona","ryuma","oars","kumashi","absalom","hogback",
    "cindry","spandine","wapol","dalton","kureha","hiluluk","vivi","cobra","pell","chaka",
    "bonclay","bentham","galdino","miss","crocus","laboon","johnny","yosaku","kuro",
    "kaya","merry","genzo","nojiko","zeff","patty","carne","gin","krieg","pearl","fullbody",
    "hina","jango","coby","helmeppo","morgan","alvida","gaimon","dorry","broggy","brogy",
    "noland","calgara","conis","pagaya","gan fall","satori","shura","gedatsu","ohm",
    "aisa","laki","kamakiri","braham","genbo","yama","hotori","kotori","pierre","raki",
    "foxy","porche","hamburg","kokoro","chimney","gonbe","iceburg","paulie","peeply",
    "tilestone","mozu","kiwi","zambai","kiev","schollzo","oimo","kashi","baskerville",
    "sentomaru","vegapunk","stussy","kizaru","ryokugyu","weevil","bakkin","toki","oden",
    "hiyori","momonosuke","kinemon","kanjuro","raizo","kikunojo","ashura","denjiro",
    "izo","nekomamushi","inuarashi","yamato","ulti","page one","pageone","sasaki",
    "black maria","blackmaria","jack","queen","king","tama","hiyori","orochi","kyoshiro",
    "komurasaki","toko","yasuie","zunesha","wanda","sicilian","milky","bariete",
    "gancho","otohime","mjosgard","charlos","rosward","shalria","kokoro","camie",
]


def probable_char(name):
    n = re.sub(r"[^a-z]", " ", name.lower())
    for tok in CHAR_TOKENS:
        if tok in n:
            return tok
    return None


def load():
    with open(os.path.join(CACHE, "index.json"), "r", encoding="utf-8") as f:
        return json.load(f)


def font(sz):
    try:
        return ImageFont.truetype("consola.ttf", sz)
    except Exception:
        return ImageFont.load_default()


F1 = font(11)


def make_sheet(recs, title, path):
    per = COLS * ROWS
    n = len(recs)
    w = COLS * (CELL + 12) + 12
    h = min(ROWS, math.ceil(n / COLS)) * (CELL + CAP + 12) + 34
    im = Image.new("RGB", (w, h), (24, 26, 32))
    d = ImageDraw.Draw(im)
    d.text((10, 8), "%s  (%d)" % (title, n), fill=(230, 230, 220), font=font(14))
    for k, r in enumerate(recs[:per]):
        cx = 12 + (k % COLS) * (CELL + 12)
        cy = 34 + (k // COLS) * (CELL + CAP + 12)
        tp = os.path.join(CACHE, "thumbs", r["id"] + ".png")
        try:
            t = Image.open(tp).convert("RGBA")
            bgc = Image.new("RGBA", (CELL, CELL), (44, 46, 56, 255))
            ox, oy = (CELL - t.width) // 2, (CELL - t.height) // 2
            bgc.alpha_composite(t, (max(ox, 0), max(oy, 0)))
            im.paste(bgc.convert("RGB"), (cx, cy))
        except Exception:
            d.rectangle([cx, cy, cx + CELL, cy + CELL], fill=(60, 30, 30))
        cap = "%s %sx%s%s" % (r["id"], r.get("w"), r.get("h"), r["ext"].replace(".", " ."))
        sub = r["rel"].split("/")[-2][:20] if "/" in r["rel"] else ""
        extra = ("+%d var" % r["_variants"]) if r.get("_variants") else sub
        d.text((cx, cy + CELL + 2), cap, fill=(200, 205, 215), font=F1)
        d.text((cx, cy + CELL + 15), extra, fill=(140, 150, 165), font=F1)
    im.save(path, quality=82)


def main():
    gmin = 8
    if "--group-min" in sys.argv:
        gmin = int(sys.argv[sys.argv.index("--group-min") + 1])
    idx = load()
    recs = [r for r in idx["records"] if r.get("dhash")]
    # collapse near-dup variants to canonical
    seen_groups = {}
    coll = []
    var_count = collections.Counter()
    for r in recs:
        g = r.get("dup_near")
        if g:
            var_count[g] += 1
    for r in recs:
        g = r.get("dup_near")
        if not g:
            coll.append(r)
        elif r.get("dup_role") == "canonical":
            r["_variants"] = var_count[g] - 1
            coll.append(r)
    groups = collections.defaultdict(list)
    for r in coll:
        parts = r["rel"].split("/")
        key = "/".join(parts[:2]) if len(parts) > 2 else parts[0]
        groups["folder__" + key.replace("/", "_")].append(r)
        ch = probable_char(r["name"])
        if ch and r["cat"] in ("battle-sprite", "cutscene-char", "portrait-card", "cutscene-portrait"):
            groups["char__" + ch].append(r)
        groups["family__" + r["family"]].append(r)
    os.makedirs(SHEETS, exist_ok=True)
    index_lines = ["# CONTACT SHEET INDEX", ""]
    per = COLS * ROWS
    made = 0
    for key in sorted(groups):
        rs = groups[key]
        if len(rs) < gmin and not key.startswith("char__"):
            continue
        rs.sort(key=lambda r: ((r.get("w") or 0) * (r.get("h") or 0)), reverse=True)
        pages = math.ceil(len(rs) / per)
        for p in range(pages):
            fn = "%s_%02d.jpg" % (key, p + 1)
            make_sheet(rs[p * per:(p + 1) * per], "%s p%d/%d" % (key, p + 1, pages),
                       os.path.join(SHEETS, fn))
            made += 1
        index_lines.append("- `%s` — %d assets, %d sheet(s)" % (key, len(rs), pages))
    with open(os.path.join(SHEETS, "SHEET_INDEX.md"), "w", encoding="utf-8") as f:
        f.write("\n".join(index_lines) + "\n")
    print("made %d sheets for %d groups -> %s" % (made, len(index_lines) - 2, SHEETS))


if __name__ == "__main__":
    main()
