#!/usr/bin/env python3
"""Build optimized runtime copies for every role in config/asset-roles.local.json.

For each role whose entry names an asset index `id` (and optional crop/flip/trim),
this script: loads the source from the private root, applies crop, optional
alpha-trim, downscales to sane runtime bounds, saves PNG into
.private-assets-cache/runtime/<role>.png, and rewrites the role's `src` to the
served path. Raw sources never enter tracked directories.

Bounds: backgrounds max 1920w · characters max 1100h · vfx/ui max 1024 · icons 256.

Usage: python tools/asset-pipeline/build_runtime.py
"""
import json, os
from PIL import Image, ImageOps

REPO = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
CFG = json.load(open(os.path.join(REPO, "config", "private-assets.local.json"), encoding="utf-8"))
ROLES_PATH = os.path.join(REPO, "config", "asset-roles.local.json")
CACHE = os.path.join(REPO, CFG.get("cache_dir", ".private-assets-cache"))
RUNTIME = os.path.join(CACHE, "runtime")
INDEX = json.load(open(os.path.join(CACHE, "index.json"), encoding="utf-8"))
BYID = {r["id"]: r for r in INDEX["records"]}


def bounds_for(role):
    if role.startswith("bg."):
        return (1920, 1080)
    if role.startswith(("char.", "npc.")):
        return (900, 1100)
    if role.startswith("icon."):
        return (256, 256)
    return (1024, 1024)


def trim_alpha(img):
    if img.mode != "RGBA":
        return img
    bbox = img.getchannel("A").getbbox()
    if bbox and bbox != (0, 0, img.width, img.height):
        pad = 4
        bbox = (max(0, bbox[0] - pad), max(0, bbox[1] - pad),
                min(img.width, bbox[2] + pad), min(img.height, bbox[3] + pad))
        return img.crop(bbox)
    return img


def main():
    roles = json.load(open(ROLES_PATH, encoding="utf-8"))
    os.makedirs(RUNTIME, exist_ok=True)
    built, missing = 0, []
    for role, spec in roles["roles"].items():
        rid = spec.get("id")
        if not rid:
            continue
        rec = BYID.get(rid)
        if not rec:
            missing.append((role, rid)); continue
        img = Image.open(rec["abs"]).convert("RGBA")
        if spec.get("crop"):
            x, y, w, h = spec["crop"]
            img = img.crop((x, y, x + w, y + h))
        if spec.get("trim", True) and role.startswith(("char.", "npc.", "vfx.", "prop.")):
            img = trim_alpha(img)
        if spec.get("flip"):
            img = ImageOps.mirror(img)
        bw, bh = bounds_for(role)
        if img.width > bw or img.height > bh:
            img.thumbnail((bw, bh), Image.LANCZOS)
        fn = role.replace("/", "_") + ".png"
        img.save(os.path.join(RUNTIME, fn), optimize=True)
        spec["src"] = "../.private-assets-cache/runtime/" + fn
        spec["kind"] = spec.get("kind", "image") if spec.get("kind") != "svg-fallback" else "image"
        built += 1
    roles["mode"] = "private"
    json.dump(roles, open(ROLES_PATH, "w", encoding="utf-8"), indent=1)
    print("built %d runtime assets -> %s" % (built, RUNTIME))
    for role, rid in missing:
        print("MISSING id %s for role %s" % (rid, role))


if __name__ == "__main__":
    main()
