#!/usr/bin/env python3
"""Generate the private runtime role manifest (gitignored):
  .private-assets-cache/runtime/  — alpha-trimmed optimized sprites + bg copies
  .private-assets-cache/runtime/roles.js — window.PRIVATE_ROLES manifest
Also writes config/asset-roles.local.json for tooling parity.
"""
import json, os
from PIL import Image

REPO = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
CACHE = os.path.join(REPO, ".private-assets-cache")
MODELS = os.path.join(CACHE, "models")
RT = os.path.join(CACHE, "runtime")
os.makedirs(RT, exist_ok=True)

ROLES = {}


def add_char(base, folder, moods, h):
    for mood in moods:
        src = os.path.join(MODELS, folder, mood + ".png")
        if not os.path.exists(src):
            continue
        img = Image.open(src).convert("RGBA")
        bbox = img.getchannel("A").getbbox()
        if bbox:
            img = img.crop(bbox)
        if img.height > 1100:
            img.thumbnail((1100, 1100), Image.LANCZOS)
        fn = (base + "." + mood).replace("/", "_") + ".png"
        img.save(os.path.join(RT, fn), optimize=True)
        ROLES[base + "." + mood] = {"src": "../.private-assets-cache/runtime/" + fn,
                                    "w": img.width, "h": h, "kind": "image"}


def add_cast(role, name, h):
    src = os.path.join(MODELS, "cast", name + ".png")
    img = Image.open(src).convert("RGBA")
    bbox = img.getchannel("A").getbbox()
    if bbox:
        img = img.crop(bbox)
    fn = role.replace(".", "_") + ".png"
    img.save(os.path.join(RT, fn), optimize=True)
    ROLES[role + ".base"] = {"src": "../.private-assets-cache/runtime/" + fn,
                             "w": img.width, "h": h, "kind": "image"}


def add_bg(role, name):
    src = os.path.join(MODELS, "bg", name + ".jpg")
    fn = role.replace(".", "_") + ".jpg"
    Image.open(src).save(os.path.join(RT, fn), quality=88)
    ROLES[role] = {"src": "../.private-assets-cache/runtime/" + fn, "kind": "image"}


MOODS_M = ["base", "neutral", "talk", "shout", "laugh", "grin", "angry", "combat",
           "serious", "shock", "smug", "hurt", "embarrassed", "disgust"]
MOODS_A = ["base", "neutral", "smug", "talk", "serious", "angry", "flustered", "shock", "hurt"]

add_char("char.merdou", "merdou", MOODS_M, 1010)
add_char("char.ashren", "ashren", MOODS_A, 930)
add_cast("npc.brakko", "brakko", 1000)
add_cast("npc.marn", "marn", 800)
add_cast("npc.collector1", "collector1", 960)
add_cast("npc.collector2", "collector2", 960)
add_bg("bg.cointoss.pit.wide.night", "pit_wide_night")
add_bg("bg.cointoss.pit.cage", "pit_cage")
add_bg("bg.cointoss.harbor.night", "harbor_night")
add_bg("bg.cointoss.kettle.exterior", "kettle_exterior")
add_bg("bg.cointoss.kettle.interior", "kettle_interior")
add_bg("insert.stove", "stove_insert")

with open(os.path.join(RT, "roles.js"), "w", encoding="utf-8") as f:
    f.write("window.PRIVATE_ROLES=" + json.dumps(ROLES) + ";\n")
with open(os.path.join(REPO, "config", "asset-roles.local.json"), "w", encoding="utf-8") as f:
    json.dump({"mode": "private", "generated": True, "roles": ROLES}, f, indent=1)
print("roles:", len(ROLES), "->", os.path.join(RT, "roles.js"))
