#!/usr/bin/env python3
"""Full recursive scanner/indexer for the private One Piece asset library.

Reads config/private-assets.local.json, walks the asset root, and writes to the
gitignored cache:
  .private-assets-cache/index.json          — one record per file
  .private-assets-cache/unsupported.log     — files logged, not silently skipped
  .private-assets-cache/scan_progress.txt   — live progress (for background runs)
  .private-assets-cache/thumbs/<id>.png     — 128px thumbnails (images only)

Duplicate handling: exact groups by MD5; near-duplicate groups by dHash with
16-bit band LSH bucketing + Hamming<=6 verification. Canonical representative =
largest area, then largest file.

Usage: python tools/asset-pipeline/scan_assets.py [--no-thumbs] [--limit N]
"""
import hashlib, json, os, re, sys, time, datetime, collections

from PIL import Image, ImageOps
Image.MAX_IMAGE_PIXELS = None  # trusted local library

REPO = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
CFG_PATH = os.path.join(REPO, "config", "private-assets.local.json")
IMG_EXT = {".png", ".jpg", ".jpeg", ".webp", ".gif", ".bmp"}
AUD_EXT = {".ogg", ".wav", ".mp3", ".m4a", ".flac"}


def load_cfg():
    with open(CFG_PATH, "r", encoding="utf-8") as f:
        return json.load(f)


def sid(md5hex, relpath):
    return md5hex[:10]


def dhash(img, size=8):
    g = img.convert("L").resize((size + 1, size), Image.LANCZOS)
    px = list(g.getdata())
    bits = 0
    for r in range(size):
        for c in range(size):
            bits = (bits << 1) | (1 if px[r * (size + 1) + c] > px[r * (size + 1) + c + 1] else 0)
    return bits


def hamming(a, b):
    return bin(a ^ b).count("1")


def palette_of(img):
    try:
        small = img.convert("RGB").resize((32, 32))
        q = small.quantize(4)
        pal = q.getpalette()[:12]
        counts = sorted(q.getcolors(), reverse=True)
        out = []
        for _, idx in counts[:4]:
            r, g, b = pal[idx * 3:idx * 3 + 3]
            out.append("#%02x%02x%02x" % (r, g, b))
        return out
    except Exception:
        return []


def alpha_info(img):
    try:
        if img.mode in ("RGBA", "LA") or (img.mode == "P" and "transparency" in img.info):
            a = img.convert("RGBA").getchannel("A").resize((32, 32))
            lo, hi = a.getextrema()
            if lo < 250:
                # edge check: fully transparent border suggests clean cutout
                return True, lo == 0
        return False, False
    except Exception:
        return False, False


FRAME_RE = re.compile(r"^(.*?)[_-](\d{2,4})$")


def family_key(relpath):
    stem = os.path.splitext(os.path.basename(relpath))[0]
    m = FRAME_RE.match(stem)
    base = m.group(1) if m else stem
    return os.path.dirname(relpath).replace("\\", "/") + "//" + base


def categorize(rel, ext, w, h, has_alpha):
    p = rel.replace("\\", "/").lower()
    top = p.split("/")[0]
    if ext in AUD_EXT or top == "audio":
        return "audio", "audio", 0.95
    if top == "one piece research":
        return "research-doc", "text", 0.9
    if top == "area":
        return ("bg-island" if "island" in p else "bg-arena"), "arena-bg", 0.85
    if top == "cutscenes":
        if "/characters/" in p:
            return "cutscene-char", "cutscene-anime", 0.85
        if "/conversations/" in p:
            return "cutscene-portrait", "cutscene-anime", 0.85
        if "/effects/" in p:
            return "vfx", "vfx", 0.8
        if "/props/" in p:
            return "prop", "cutscene-anime", 0.8
        return "cutscene", "cutscene-anime", 0.7
    if top == "portrait":
        if "/items/" in p or "/skillbooks/" in p:
            return "icon-item", "ui-flat", 0.85
        return "portrait-card", "optc-portrait", 0.85
    if top == "sprites":
        if "/effects/" in p:
            return "vfx", "vfx", 0.85
        return "battle-sprite", "optc-sprite", 0.9
    if top == "skills":
        if "skill name" in p:
            return "skill-name-card", "ui-flat", 0.85
        return "vfx-skill", "vfx", 0.8
    if top == "ui":
        return "ui", "ui-flat", 0.85
    if top == "artworks":
        return ("icon-item" if "/items/" in p else "artwork"), "artwork", 0.75
    if top == "ships":
        return "ship", "optc-sprite", 0.8
    if top == "collaborations":
        return "collab", "optc-portrait", 0.6
    if top == "v13":
        return "collection", "optc-portrait", 0.6
    return "unknown", "unknown", 0.3


def suitability(cat, fam, w, h, has_alpha):
    s = {"portrait": 0, "background": 0, "ui": 0, "vfx": 0}
    ar = (w / h) if h else 0
    if cat in ("cutscene-char", "battle-sprite") and has_alpha:
        s["portrait"] = 3
    if cat in ("portrait-card", "cutscene-portrait"):
        s["portrait"] = 2
    if cat.startswith("bg-") or (cat in ("cutscene", "artwork") and w >= 900 and 1.2 < ar < 2.4):
        s["background"] = 3
    if cat in ("ui", "skill-name-card", "icon-item"):
        s["ui"] = 3
    if cat in ("vfx", "vfx-skill") and has_alpha:
        s["vfx"] = 3
    return s


def main():
    args = sys.argv[1:]
    do_thumbs = "--no-thumbs" not in args
    limit = 0
    if "--limit" in args:
        limit = int(args[args.index("--limit") + 1])
    cfg = load_cfg()
    root = cfg["asset_root"]
    cache = os.path.join(REPO, cfg.get("cache_dir", ".private-assets-cache"))
    thumbs = os.path.join(cache, "thumbs")
    os.makedirs(thumbs, exist_ok=True)
    progress = os.path.join(cache, "scan_progress.txt")
    unsup = open(os.path.join(cache, "unsupported.log"), "w", encoding="utf-8")

    files = []
    for dirpath, _dirnames, filenames in os.walk(root):
        for fn in filenames:
            files.append(os.path.join(dirpath, fn))
    files.sort()
    if limit:
        files = files[:limit]
    total = len(files)
    records, t0 = [], time.time()

    for i, path in enumerate(files):
        if i % 250 == 0:
            with open(progress, "w", encoding="utf-8") as pf:
                pf.write("%d/%d  %.1fs elapsed\n" % (i, total, time.time() - t0))
        rel = os.path.relpath(path, root)
        ext = os.path.splitext(path)[1].lower()
        try:
            size = os.path.getsize(path)
        except OSError as e:
            unsup.write("STAT-FAIL\t%s\t%s\n" % (rel, e)); continue
        h = hashlib.md5()
        try:
            with open(path, "rb") as f:
                for chunk in iter(lambda: f.read(1 << 20), b""):
                    h.update(chunk)
        except OSError as e:
            unsup.write("READ-FAIL\t%s\t%s\n" % (rel, e)); continue
        md5 = h.hexdigest()
        rec = {
            "id": sid(md5, rel), "abs": path, "rel": rel.replace("\\", "/"),
            "name": os.path.basename(path), "ext": ext, "size": size, "md5": md5,
            "w": None, "h": None, "aspect": None, "alpha": False, "cutout": False,
            "frames": 1, "cat": None, "top": rel.replace("\\", "/").split("/")[0],
            "palette": [], "dhash": None, "family": None, "famkey": family_key(rel),
            "suit": {}, "private": True, "runtime": "disabled", "tags": [], "conf": 0.0,
        }
        if ext in IMG_EXT:
            try:
                with Image.open(path) as img:
                    img.load()
                    w, hgt = img.size
                    rec["w"], rec["h"] = w, hgt
                    rec["aspect"] = round(w / hgt, 3) if hgt else None
                    rec["frames"] = getattr(img, "n_frames", 1)
                    rec["alpha"], rec["cutout"] = alpha_info(img)
                    rec["dhash"] = "%016x" % dhash(img)
                    rec["palette"] = palette_of(img)
                    cat, fam, conf = categorize(rel, ext, w, hgt, rec["alpha"])
                    rec["cat"], rec["family"], rec["conf"] = cat, fam, conf
                    rec["suit"] = suitability(cat, fam, w, hgt, rec["alpha"])
                    rec["runtime"] = "candidate"
                    if do_thumbs:
                        t = img.convert("RGBA")
                        t.thumbnail((128, 128), Image.LANCZOS)
                        t.save(os.path.join(thumbs, rec["id"] + ".png"))
            except Exception as e:
                unsup.write("DECODE-FAIL\t%s\t%s\n" % (rel, e))
                cat, fam, conf = categorize(rel, ext, 0, 0, False)
                rec["cat"], rec["family"], rec["conf"] = "corrupt-" + cat, fam, 0.1
        elif ext in AUD_EXT:
            rec["cat"], rec["family"], rec["conf"] = "audio", "audio", 0.95
            rec["runtime"] = "disabled"  # no sound in this game
        else:
            rec["cat"], rec["family"], rec["conf"] = "other", "text", 0.5
            unsup.write("UNSUPPORTED-EXT\t%s\n" % rel)
        records.append(rec)

    # exact duplicate groups
    by_md5 = collections.defaultdict(list)
    for r in records:
        by_md5[r["md5"]].append(r)
    gid = 0
    for md5, group in by_md5.items():
        if len(group) > 1:
            gid += 1
            for r in group:
                r["dup_exact"] = "E%04d" % gid

    # near-duplicate groups via dHash LSH (4x16-bit bands), Hamming<=6
    imgs = [r for r in records if r.get("dhash")]
    buckets = collections.defaultdict(list)
    for idx, r in enumerate(imgs):
        hv = int(r["dhash"], 16)
        for b in range(4):
            buckets[(b, (hv >> (16 * b)) & 0xFFFF)].append(idx)
    parent = list(range(len(imgs)))

    def find(x):
        while parent[x] != x:
            parent[x] = parent[parent[x]]; x = parent[x]
        return x

    def union(a, b):
        ra, rb = find(a), find(b)
        if ra != rb:
            parent[rb] = ra

    for key, members in buckets.items():
        if len(members) < 2 or len(members) > 400:
            continue
        for i2 in range(len(members)):
            hi = int(imgs[members[i2]]["dhash"], 16)
            for j2 in range(i2 + 1, len(members)):
                hj = int(imgs[members[j2]]["dhash"], 16)
                if hamming(hi, hj) <= 6:
                    union(members[i2], members[j2])
    groups = collections.defaultdict(list)
    for idx in range(len(imgs)):
        groups[find(idx)].append(idx)
    ng = 0
    for _root_idx, members in groups.items():
        if len(members) > 1:
            ng += 1
            grp = "N%05d" % ng
            best = max(members, key=lambda k: ((imgs[k]["w"] or 0) * (imgs[k]["h"] or 0), imgs[k]["size"]))
            for m in members:
                imgs[m]["dup_near"] = grp
                imgs[m]["dup_role"] = "canonical" if m == best else "variant"

    # animation families (frame sequences)
    fam_counts = collections.Counter(r["famkey"] for r in records if r.get("dhash"))
    for r in records:
        if r.get("dhash") and fam_counts[r["famkey"]] > 1:
            r["anim_family"] = True

    cfg["index_version"] = cfg.get("index_version", 0) + 1
    cfg["last_scan"] = datetime.datetime.now().isoformat(timespec="seconds")
    with open(CFG_PATH, "w", encoding="utf-8") as f:
        json.dump(cfg, f, indent=2)
    out = {
        "version": cfg["index_version"], "scanned": cfg["last_scan"], "root": root,
        "total": total, "records": records,
    }
    with open(os.path.join(cache, "index.json"), "w", encoding="utf-8") as f:
        json.dump(out, f)
    unsup.close()
    with open(progress, "w", encoding="utf-8") as pf:
        pf.write("DONE %d/%d in %.1fs\n" % (total, total, time.time() - t0))
    print("scanned %d files in %.1fs -> %s" % (total, time.time() - t0, os.path.join(cache, "index.json")))


if __name__ == "__main__":
    main()
