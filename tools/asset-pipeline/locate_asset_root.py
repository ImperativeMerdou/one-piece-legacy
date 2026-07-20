#!/usr/bin/env python3
"""Locate the private asset root ('ONE PIECE ASSETS AND RESEARCH') and write/update
config/private-assets.local.json. Searches the repository's parent directories and
their immediate children, preferring the nearest match. Never touches tracked files.

Usage: python tools/asset-pipeline/locate_asset_root.py
"""
import json, os, sys, datetime

TARGET = "ONE PIECE ASSETS AND RESEARCH"
REPO = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
LOCAL = os.path.join(REPO, "config", "private-assets.local.json")
EXAMPLE = os.path.join(REPO, "config", "private-assets.example.json")


def find_root():
    seen = []
    d = REPO
    for _ in range(6):  # walk up to 6 levels
        parent = os.path.dirname(d)
        if parent == d:
            break
        d = parent
        seen.append(d)
        cand = os.path.join(d, TARGET)
        if os.path.isdir(cand):
            return cand
        # immediate children of each ancestor (nearest first)
        try:
            for child in os.listdir(d):
                p = os.path.join(d, child)
                if os.path.isdir(p) and child == TARGET:
                    return p
        except OSError:
            pass
    return None


def main():
    root = find_root()
    if not root:
        print("NOT FOUND: no directory named %r near %s" % (TARGET, REPO))
        print("Searched upward from the repository. Ask Mert for the location.")
        sys.exit(1)
    cfg = {}
    src = LOCAL if os.path.exists(LOCAL) else EXAMPLE
    if os.path.exists(src):
        with open(src, "r", encoding="utf-8") as f:
            cfg = json.load(f)
    cfg.pop("_doc", None)
    cfg["asset_root"] = root
    cfg.setdefault("cache_dir", ".private-assets-cache")
    cfg["located_at"] = datetime.datetime.now().isoformat(timespec="seconds")
    os.makedirs(os.path.dirname(LOCAL), exist_ok=True)
    with open(LOCAL, "w", encoding="utf-8") as f:
        json.dump(cfg, f, indent=2)
    print("asset_root:", root)
    print("wrote:", LOCAL)


if __name__ == "__main__":
    main()
