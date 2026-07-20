#!/usr/bin/env python3
"""Build TEMP_VISUAL_MODEL character sprites for the vertical slice from private
library sources (never committed; outputs land in .private-assets-cache/models/).

Merdou  <- scenario_chara1024_oven0103_01.png   (hair removed, bald dome painted,
           full dark beard added, chest scar, crimson grade, 12 expression variants)
Ashren  <- scenario_chara1024_niji0101_01.png   (silver hair, charcoal coat, visor
           replaced with painted eyes, antennae removed, expression variants)
Marn    <- scenario_chara1024_chiffon0103_01.png (iron-gray hair, wool grade)
Brakko  <- scenario_chara1024_kelly0102_01.png   (as-is grade + moods)
Collectors <- capone0101 / vergo0101 (gray coat grade)

All painting is done at 4x supersample and composited back. Every output carries
TEMP_VISUAL_MODEL provenance in ASSET_MODEL_NOTES.json.
"""
import json, os, math
from PIL import Image, ImageDraw, ImageFilter, ImageOps, ImageEnhance

REPO = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
CFG = json.load(open(os.path.join(REPO, "config", "private-assets.local.json"), encoding="utf-8"))
ROOT = CFG["asset_root"]
SRC = os.path.join(ROOT, "Cutscenes", "Characters")
OUT = os.path.join(REPO, ".private-assets-cache", "models")
S = 4  # supersample factor for painted patches
XOFF = 130  # Merdou head x-shift (true face center is ~x530, not ~x400)

INK = (26, 19, 14, 255)          # outline ink
BEARD = (43, 35, 28, 255)        # full dark beard base
BEARD_HI = (74, 62, 50, 255)
SKIN = (238, 196, 155, 255)
SKIN_SH = (216, 163, 119, 255)
SKIN_HI = (248, 220, 187, 255)
WHITE = (245, 242, 235, 255)
IRIS = (58, 42, 30, 255)


def load(name):
    return Image.open(os.path.join(SRC, name)).convert("RGBA")


def hue_of(r, g, b):
    import colorsys
    h, s, v = colorsys.rgb_to_hsv(r / 255, g / 255, b / 255)
    return h * 360, s, v


def poly(draw, pts, fill, outline=None, width=0):
    draw.polygon([(x * S, y * S) for x, y in pts], fill=fill)
    if outline:
        draw.line([(x * S, y * S) for x, y in pts] + [(pts[0][0] * S, pts[0][1] * S)],
                  fill=outline, width=width * S, joint="curve")


def hi_layer(size):
    im = Image.new("RGBA", (size[0] * S, size[1] * S), (0, 0, 0, 0))
    return im, ImageDraw.Draw(im)


def paste_hi(base, layer, box=(0, 0)):
    small = layer.resize((layer.width // S, layer.height // S), Image.LANCZOS)
    base.alpha_composite(small, box)


# ============================================================ MERDOU
M = dict(  # tunable source-space coordinates (oven0103)
    erase_top=100, erase_bottom=402, erase_l=240, erase_r=960,
    face_keep=(332, 262, 472, 402),        # protect face while erasing hair
    dome=[(338, 306), (340, 268), (352, 232), (376, 210), (400, 202), (426, 208),
          (450, 228), (462, 258), (466, 300)],
    dome_bottom_l=(338, 306), dome_bottom_r=(466, 300),
    brow_y=292, chin=(402, 394),
    beard_outer=[(336, 300), (332, 330), (340, 360), (356, 384), (378, 400),
                 (402, 408), (428, 400), (450, 382), (464, 356), (470, 328), (468, 298)],
    beard_inner=[(352, 312), (350, 336), (360, 356), (378, 366), (402, 370),
                 (428, 364), (444, 352), (452, 334), (452, 310)],
    mouth_keep=(352, 312, 456, 356),
    ear_l=(330, 306), ear_r=(472, 302),
    scar=[(468, 540), (530, 648)],
)
def _shift_pts(v):
    if isinstance(v, tuple) and len(v) == 2 and all(isinstance(i, (int, float)) for i in v):
        return (v[0] + XOFF, v[1])
    if isinstance(v, tuple) and len(v) == 4:
        return (v[0] + XOFF, v[1], v[2] + XOFF, v[3])
    if isinstance(v, list):
        return [_shift_pts(i) for i in v]
    return v
for _k in ("face_keep", "dome", "dome_bottom_l", "dome_bottom_r", "beard_outer",
           "beard_inner", "mouth_keep", "ear_l", "ear_r"):
    M[_k] = _shift_pts(M[_k])


def build_merdou_base():
    img = load("scenario_chara1024_oven0103_01.png")
    px = img.load()
    fx0, fy0, fx1, fy1 = M["face_keep"]
    # 1) erase hair: orange/red/yellow hues in the crest region
    for y in range(M["erase_top"], M["erase_bottom"]):
        for x in range(M["erase_l"], M["erase_r"]):
            r, g, b, a = px[x, y]
            if a == 0:
                continue
            if fx0 < x < fx1 and fy0 < y < fy1:
                continue
            h, s, v = hue_of(r, g, b)
            if (h < 55 or h > 340) and s > 0.45 and v > 0.35:
                px[x, y] = (0, 0, 0, 0)
            elif v < 0.42 and s > 0.3 and (h < 60 or h > 330):  # dark hair shadows/outlines
                px[x, y] = (0, 0, 0, 0)
    # cleanup speckle: one erosion-ish pass on alpha in that region
    reg = img.crop((M["erase_l"], M["erase_top"], M["erase_r"], M["erase_bottom"]))
    a = reg.getchannel("A").filter(ImageFilter.MinFilter(3)).filter(ImageFilter.MaxFilter(3))
    reg.putalpha(a)
    img.paste(reg, (M["erase_l"], M["erase_top"]))

    # face-side hair (sideburn columns) removal inside face box edges
    for y in range(fy0, fy1):
        for x in list(range(fx0, fx0 + 26)) + list(range(fx1 - 26, fx1)):
            r, g, b, a = px[x, y]
            if a == 0:
                continue
            h, s, v = hue_of(r, g, b)
            if (h < 55 or h > 340) and s > 0.5 and v > 0.45:
                px[x, y] = (0, 0, 0, 0)

    # 1b) fringe erase: orange hairline remnants INSIDE the face box (top band + edges)
    for y in range(fy0, 302):
        for x in range(fx0, fx1):
            r, g, b, a = px[x, y]
            if a == 0:
                continue
            h2, s2, v2 = hue_of(r, g, b)
            if (h2 < 58 or h2 > 338) and s2 > 0.42 and v2 > 0.3:
                px[x, y] = (0, 0, 0, 0)

    # 2) paint skull dome + ears + beard on hi-res layer
    layer, d = hi_layer((1024, 1024))
    dome_pts = M["dome"]
    # skull fill
    d.polygon([(x * S, y * S) for x, y in dome_pts] +
              [(M["dome_bottom_r"][0] * S, M["dome_bottom_r"][1] * S),
               (M["dome_bottom_l"][0] * S, M["dome_bottom_l"][1] * S)], fill=SKIN)
    # side shading
    d.polygon([(x * S, y * S) for x, y in [(338+XOFF, 306), (340+XOFF, 268), (352+XOFF, 232), (360+XOFF, 240),
               (350+XOFF, 272), (348+XOFF, 306)]], fill=SKIN_SH)
    d.polygon([(x * S, y * S) for x, y in [(466+XOFF, 300), (462+XOFF, 258), (450+XOFF, 228), (442+XOFF, 236),
               (454+XOFF, 262), (456+XOFF, 300)]], fill=SKIN_SH)
    # top highlight arc
    d.arc([(352+XOFF) * S, 210 * S, (452+XOFF) * S, 300 * S], start=200, end=320, fill=SKIN_HI, width=7 * S)
    # dome outline
    d.line([(x * S, y * S) for x, y in dome_pts], fill=INK, width=3 * S, joint="curve")
    # ears
    for (ex, ey), flip in [(M["ear_l"], 1), (M["ear_r"], -1)]:
        d.ellipse([(ex - 9) * S, (ey - 2) * S, (ex + 9) * S, (ey + 26) * S], fill=SKIN, outline=INK, width=2 * S)
        d.arc([(ex - 5) * S, (ey + 4) * S, (ex + 5) * S, (ey + 20) * S], 90, 270, fill=SKIN_SH, width=2 * S)
    # beard: outer ring minus mouth
    outer = M["beard_outer"]
    # zigzag bottom edge
    zig = []
    for i, (x, y) in enumerate(outer):
        if 355+XOFF < x < 450+XOFF and y > 380:
            zig.append((x, y + (8 if i % 2 == 0 else -2)))
        else:
            zig.append((x, y))
    inner = M["beard_inner"]
    d.polygon([(x * S, y * S) for x, y in zig] +
              [(x * S, y * S) for x, y in reversed(inner)], fill=BEARD)
    d.line([(x * S, y * S) for x, y in zig], fill=INK, width=3 * S, joint="curve")
    # mustache band
    d.polygon([(x * S, y * S) for x, y in [(352+XOFF, 310), (402+XOFF, 304), (454+XOFF, 308), (452+XOFF, 318),
               (402+XOFF, 313), (354+XOFF, 320)]], fill=BEARD)
    # strand highlights
    for sx, sy, ex2, ey2 in [(348+XOFF, 340, 356+XOFF, 372), (452+XOFF, 336, 446+XOFF, 368), (382+XOFF, 392, 390+XOFF, 402),
                             (416+XOFF, 392, 410+XOFF, 402), (368+XOFF, 316, 372+XOFF, 330), (436+XOFF, 314, 432+XOFF, 328)]:
        d.line([(sx * S, sy * S), (ex2 * S, ey2 * S)], fill=BEARD_HI, width=2 * S)
    paste_hi(img, layer)

    # 3) chest scar
    layer, d = hi_layer((1024, 1024))
    (sx, sy), (ex2, ey2) = M["scar"]
    d.line([(sx * S, sy * S), (ex2 * S, ey2 * S)], fill=(198, 122, 95, 255), width=9 * S)
    d.line([(sx * S, sy * S), (ex2 * S, ey2 * S)], fill=(138, 74, 58, 255), width=3 * S)
    for t in range(5):
        f = t / 4
        mx, my = sx + (ex2 - sx) * f, sy + (ey2 - sy) * f
        d.line([((mx - 8) * S, (my + 5) * S), ((mx + 8) * S, (my - 5) * S)],
               fill=(138, 74, 58, 255), width=2 * S)
    paste_hi(img, layer)

    # 4) crimson grade: shift cape/bow oranges+yellows toward crimson
    px = img.load()
    import colorsys
    for y in range(380, 1024):
        for x in range(0, 1024):
            r, g, b, a = px[x, y]
            if a == 0:
                continue
            h, s, v = hue_of(r, g, b)
            if 18 < h < 55 and s > 0.5 and v > 0.3:   # orange cape / yellow bow
                nh = 356 / 360
                nr, ng, nb = colorsys.hsv_to_rgb(nh, min(1, s * 0.9), v * 0.82)
                px[x, y] = (int(nr * 255), int(ng * 255), int(nb * 255), a)
    return img


# ---- Merdou expression patches (drawn over base face) ----
FACE_BOX = (330+XOFF, 258, 476+XOFF, 410)  # x0,y0,x1,y1 patch region


def face_layer():
    w, h = FACE_BOX[2] - FACE_BOX[0], FACE_BOX[3] - FACE_BOX[1]
    im = Image.new("RGBA", (w * S, h * S), (0, 0, 0, 0))
    return im, ImageDraw.Draw(im)


def fp(x, y):  # face-space point (pre-shift coords) -> patch hi-res
    return ((x + XOFF - FACE_BOX[0]) * S, (y - FACE_BOX[1]) * S)


def clear_face_region(img, box):
    """Fill the inner face (between dome and beard) with flat skin to repaint features."""
    layer, d = hi_layer((1024, 1024))
    d.polygon([((x+XOFF) * S, y * S) for x, y in [(350, 300), (402, 294), (456, 298), (452, 336),
               (430, 362), (402, 368), (374, 362), (352, 338)]], fill=SKIN)
    d.polygon([((x+XOFF) * S, y * S) for x, y in [(352, 300), (360, 296), (360, 308), (352, 310)]], fill=SKIN_SH)
    paste_hi(img, layer)


def draw_eyes(d, kind):
    ly, ry = 306, 304
    lx, rx = 372, 432
    if kind == "closed":
        for x in (lx, rx):
            d.arc([fp(x - 13, ly - 6)[0], fp(x - 13, ly - 6)[1], fp(x + 13, ly + 10)[0], fp(x + 13, ly + 10)[1]],
                  20, 160, fill=INK, width=3 * S)
    elif kind == "round":
        for x in (lx, rx):
            d.ellipse([*fp(x - 11, ly - 10), *fp(x + 11, ly + 12)], fill=WHITE, outline=INK, width=2 * S)
            d.ellipse([*fp(x - 3, ly - 2), *fp(x + 3, ly + 6)], fill=INK)
    elif kind == "halflid":
        for x in (lx, rx):
            d.ellipse([*fp(x - 11, ly - 8), *fp(x + 11, ly + 10)], fill=WHITE, outline=INK, width=2 * S)
            d.ellipse([*fp(x - 4, ly - 2), *fp(x + 4, ly + 8)], fill=IRIS)
            d.rectangle([*fp(x - 12, ly - 9), *fp(x + 12, ly - 1)], fill=SKIN)
            d.line([fp(x - 12, ly - 1), fp(x + 12, ly - 1)], fill=INK, width=3 * S)
    elif kind == "squeeze":
        for x in (lx, rx):
            d.line([fp(x - 11, ly - 4), fp(x + 11, ly + 2)], fill=INK, width=4 * S)
            d.line([fp(x - 11, ly + 4), fp(x + 11, ly - 2)], fill=INK, width=4 * S)
    else:  # open
        for x in (lx, rx):
            d.ellipse([*fp(x - 10, ly - 8), *fp(x + 10, ly + 10)], fill=WHITE, outline=INK, width=2 * S)
            d.ellipse([*fp(x - 4, ly - 1), *fp(x + 4, ly + 9)], fill=IRIS)


def draw_brows(d, kind):
    if kind == "angry":
        d.line([fp(352, 286), fp(390, 297)], fill=INK, width=5 * S)
        d.line([fp(452, 285), fp(414, 296)], fill=INK, width=5 * S)
    elif kind == "raised":
        d.arc([*fp(354, 278), *fp(392, 296)], 190, 350, fill=INK, width=4 * S)
        d.arc([*fp(412, 276), *fp(450, 294)], 190, 350, fill=INK, width=4 * S)
    elif kind == "flat":
        d.line([fp(354, 292), fp(390, 290)], fill=INK, width=4 * S)
        d.line([fp(414, 289), fp(450, 291)], fill=INK, width=4 * S)
    elif kind == "worried":
        d.line([fp(356, 288), fp(390, 294)], fill=INK, width=4 * S)
        d.line([fp(414, 293), fp(448, 287)], fill=INK, width=4 * S)


def draw_mouth(d, kind):
    if kind == "grit":       # keep native look: wide teeth grid
        d.polygon([fp(358, 320), fp(402, 316), fp(448, 319), fp(444, 350), fp(402, 356), fp(362, 351)],
                  fill=WHITE)
        d.line([fp(358, 320), fp(402, 316), fp(448, 319)], fill=INK, width=3 * S)
        d.line([fp(362, 351), fp(402, 356), fp(444, 350)], fill=INK, width=3 * S)
        d.line([fp(360, 335), fp(446, 334)], fill=INK, width=2 * S)
        for x in (374, 390, 406, 422, 436):
            d.line([fp(x, 318), fp(x, 353)], fill=INK, width=2 * S)
    elif kind == "shout":
        d.polygon([fp(366, 320), fp(402, 315), fp(440, 320), fp(434, 358), fp(402, 366), fp(370, 357)],
                  fill=(70, 24, 22, 255))
        d.polygon([fp(370, 321), fp(402, 317), fp(436, 321), fp(432, 330), fp(402, 332), fp(374, 330)],
                  fill=WHITE)
        d.polygon([fp(382, 352), fp(402, 348), fp(422, 352), fp(414, 360), fp(390, 360)],
                  fill=(150, 62, 58, 255))
        d.line([fp(366, 320), fp(402, 315), fp(440, 320)], fill=INK, width=3 * S)
    elif kind == "laugh":
        d.polygon([fp(360, 322), fp(402, 314), fp(446, 321), fp(438, 362), fp(402, 372), fp(366, 361)],
                  fill=(70, 24, 22, 255))
        d.polygon([fp(364, 323), fp(402, 316), fp(442, 322), fp(440, 334), fp(402, 337), fp(366, 333)],
                  fill=WHITE)
        d.line([fp(360, 322), fp(402, 314), fp(446, 321)], fill=INK, width=3 * S)
    elif kind == "closed":
        d.line([fp(372, 342), fp(402, 346), fp(432, 341)], fill=INK, width=4 * S)
        d.line([fp(384, 356), fp(420, 356)], fill=SKIN_SH, width=3 * S)
    elif kind == "smirk":
        d.line([fp(372, 344), fp(404, 348), fp(436, 334)], fill=INK, width=4 * S)
    elif kind == "grimace":
        d.polygon([fp(366, 330), fp(402, 326), fp(436, 336), fp(430, 352), fp(398, 356), fp(372, 348)],
                  fill=WHITE)
        d.line([fp(366, 330), fp(402, 326), fp(436, 336)], fill=INK, width=3 * S)
        d.line([fp(372, 348), fp(398, 356), fp(430, 352)], fill=INK, width=3 * S)
        for x in (382, 398, 414):
            d.line([fp(x, 328), fp(x, 354)], fill=INK, width=2 * S)


EXPRESSIONS = {
    # mood: (brows, eyes, mouth, extras)
    "angry":    ("angry", "open", "grit", []),
    "combat":   ("angry", "open", "grit", ["vein"]),
    "shout":    ("angry", "open", "shout", []),
    "talk":     ("raised", "open", "shout", []),
    "grin":     ("raised", "halflid", "laugh", []),
    "laugh":    ("raised", "closed", "laugh", []),
    "neutral":  ("flat", "open", "closed", []),
    "serious":  ("flat", "halflid", "closed", []),
    "shock":    ("raised", "round", "shout", ["sweat"]),
    "smug":     ("flat", "halflid", "smirk", []),
    "hurt":     ("worried", "squeeze", "grimace", ["plaster"]),
    "embarrassed": ("angry", "open", "grimace", ["blush"]),
    "disgust":  ("angry", "squeeze", "grimace", ["sweat"]),
}


def merdou_expression(base, mood):
    img = base.copy()
    if True:  # repaint every mood for expression consistency (native face kept fringe artifacts)
        clear_face_region(img, FACE_BOX)
        layer, d = face_layer()
        brows, eyes, mouth, extras = EXPRESSIONS[mood]
        # nose
        d.line([fp(400, 308), fp(396, 318)], fill=INK, width=2 * S)
        draw_brows(d, brows)
        draw_eyes(d, eyes)
        draw_mouth(d, mouth)
        paste_hi(img, layer, (FACE_BOX[0], FACE_BOX[1]))
    layer, d = face_layer()
    extras = EXPRESSIONS[mood][3]
    if "blush" in extras:
        for bx in (352, 428):
            for i in range(4):
                d.line([fp(bx + i * 7, 322), fp(bx + i * 7 - 6, 334)], fill=(214, 106, 96, 200), width=2 * S)
    if "sweat" in extras:
        d.polygon([fp(346, 286), fp(352, 300), fp(340, 298)], fill=(176, 216, 240, 230))
    if "vein" in extras:
        for a0 in (0, 90, 180, 270):
            x0, y0 = 446, 276
            d.arc([*fp(x0 - 8, y0 - 8), *fp(x0 + 8, y0 + 8)], a0, a0 + 60, fill=(180, 90, 80, 255), width=2 * S)
    if "plaster" in extras:
        d.line([fp(356, 328), fp(374, 340)], fill=(222, 205, 180, 255), width=5 * S)
    paste_hi(img, layer, (FACE_BOX[0], FACE_BOX[1]))
    return img


# ============================================================ ASHREN
A = dict(
    hair_box=(300, 220, 700, 480),
    coat_region=(60, 380, 960, 1024),
    visor=(456, 336, 570, 380),      # orange visor band to repaint
    antenna_boxes=[(548, 250, 620, 345), (520, 300, 560, 350)],
    ear_piece=(536, 340, 596, 410),
)


def build_ashren_base():
    img = load("scenario_chara1024_niji0101_01.png")
    px = img.load()
    import colorsys
    w, h = img.size
    # 0) antennae erase on RAW (thin golden spikes over blue hair)
    for y in range(210, 345):
        for x in range(500, 660):
            r, g, b, a = px[x, y]
            if a == 0:
                continue
            hh, s, v = hue_of(r, g, b)
            if 15 < hh < 60 and s > 0.35:
                px[x, y] = (0, 0, 0, 0)
    # 1) visor removal on RAW: erase frame (orange) + lenses (dark) inside band box
    VX0, VY0, VX1, VY1 = 458, 330, 598, 384
    marked = set()
    for y in range(VY0, 400):
        for x in range(VX0, VX1):
            if y >= VY1 and x < 545:
                continue  # protect nose/mouth center below band
            r, g, b, a = px[x, y]
            if a == 0:
                continue
            hh, s, v = hue_of(r, g, b)
            if 195 < hh < 262 and s > 0.3:
                continue  # blue hair strands stay
            marked.add((x, y))
    # per-column skin fill for marked pixels, sampled below the band
    for x in range(VX0, VX1):
        # find sample color below band (first opaque skin-ish pixel scanning down)
        samp = None
        for sy in range(VY1, VY1 + 40):
            r, g, b, a = px[x, sy]
            if a > 200:
                hh, s, v = hue_of(r, g, b)
                if 10 < hh < 50 and s > 0.15 and v > 0.5:
                    samp = (r, g, b)
                    break
        for y in range(VY0, 400):
            if (x, y) in marked:
                if samp:
                    f = 1.0 - 0.14 * (VY1 - y) / (VY1 - VY0)  # slightly darker toward brow
                    px[x, y] = (int(samp[0] * f), int(samp[1] * f), int(samp[2] * f), 255)
                else:
                    px[x, y] = (0, 0, 0, 0)
    # 1c) erase earcup badge remnants (bright ring right of face)
    for y in range(330, 404):
        for x in range(556, 606):
            r, g, b, a = px[x, y]
            if a and r > 190 and g > 190 and b > 190:
                px[x, y] = (0, 0, 0, 0)
    # 1d) smooth the filled skin band (kill per-column banding noise)
    from PIL import ImageFilter as _IF
    band = img.crop((VX0, 332, 546, 376)).filter(_IF.MedianFilter(3)).filter(_IF.GaussianBlur(0.8))
    img.paste(band, (VX0, 332))
    # 2) features: left eye + swept fringe covering the right eye (theatrical one-eye)
    layer, d = hi_layer((1024, 1024))
    ex = 492
    d.line([(ex - 14) * S, 356 * S, (ex + 12) * S, 353 * S], fill=INK, width=3 * S)
    d.ellipse([(ex - 5) * S, 356 * S, (ex + 4) * S, 369 * S], fill=(88, 82, 118, 255), outline=INK, width=1 * S)
    d.line([(ex - 12) * S, 370 * S, (ex + 10) * S, 369 * S], fill=(196, 148, 116, 255), width=2 * S)
    HAIR = (236, 240, 246, 255); HAIR_SH = (204, 214, 226, 255); HAIR_SH2 = (176, 188, 204, 255)
    # three overlapping tapered locks, rooted under the top hair mass
    lockA = [(506, 238), (556, 248), (586, 296), (598, 344), (588, 392), (566, 420), (552, 428),
             (558, 392), (556, 348), (538, 300), (510, 262)]
    lockB = [(542, 276), (576, 296), (590, 336), (582, 380), (566, 408), (560, 380), (560, 340), (548, 300)]
    lockC = [(520, 276), (544, 296), (556, 336), (552, 380), (540, 402), (536, 368), (532, 324), (516, 292)]
    d.polygon([(x * S, y * S) for x, y in lockA], fill=HAIR)
    d.polygon([(x * S, y * S) for x, y in lockB], fill=HAIR_SH)
    d.polygon([(x * S, y * S) for x, y in lockC], fill=HAIR_SH)
    for pts, c in [([(548, 300), (560, 348), (556, 396)], HAIR_SH2), ([(530, 300), (540, 344), (536, 384)], HAIR_SH2)]:
        d.line([(x * S, y * S) for x, y in pts], fill=c, width=2 * S, joint="curve")
    edge = [(506, 238), (556, 248), (586, 296), (598, 344), (588, 392), (566, 420), (552, 428)]
    d.line([(x * S, y * S) for x, y in edge], fill=INK, width=2 * S, joint="curve")
    paste_hi(img, layer)
    # 3) global recolors
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if a == 0:
                continue
            hh, s, v = hue_of(r, g, b)
            if y < 360 and 195 < hh < 250 and s > 0.35 and v > 0.25:
                nv = min(1.0, v * 1.35 + 0.28)
                nr, ng, nb = colorsys.hsv_to_rgb(210 / 360, 0.06, nv)
                px[x, y] = (int(nr * 255), int(ng * 255), int(nb * 255), a)
            elif y >= 360 and 195 < hh < 250 and s > 0.35 and v > 0.2:
                nr, ng, nb = colorsys.hsv_to_rgb(215 / 360, 0.14, v * 0.38 + 0.05)
                px[x, y] = (int(nr * 255), int(ng * 255), int(nb * 255), a)
            elif 30 < hh < 60 and s > 0.4 and v > 0.4:
                nr, ng, nb = colorsys.hsv_to_rgb(220 / 360, 0.08, v * 0.62)
                px[x, y] = (int(nr * 255), int(ng * 255), int(nb * 255), a)
            elif 10 < hh < 30 and s > 0.5:
                nr, ng, nb = colorsys.hsv_to_rgb(220 / 360, 0.12, v * 0.4)
                px[x, y] = (int(nr * 255), int(ng * 255), int(nb * 255), a)
            elif 300 < y < 430 and 500 < x < 640 and (hh > 330 or hh < 12) and s > 0.4:
                nr, ng, nb = colorsys.hsv_to_rgb(215 / 360, 0.1, v * 0.4)
                px[x, y] = (int(nr * 255), int(ng * 255), int(nb * 255), a)
    return img


ASHREN_FACE = (440, 320, 600, 460)


def ashren_expression(base, mood):
    img = base.copy()
    layer, d = hi_layer((1024, 1024))
    if mood == "smug":
        d.line([500 * S, 424 * S, 528 * S, 428 * S, 556 * S, 414 * S], fill=INK, width=3 * S)
    elif mood == "talk":
        d.ellipse([508 * S, 412 * S, 544 * S, 438 * S], fill=(88, 40, 40, 255), outline=INK, width=2 * S)
    elif mood == "serious":
        d.line([498 * S, 422 * S, 552 * S, 422 * S], fill=INK, width=3 * S)
    elif mood == "angry":
        d.line([476 * S, 344 * S, 506 * S, 352 * S], fill=INK, width=4 * S)
        d.line([560 * S, 342 * S, 530 * S, 351 * S], fill=INK, width=4 * S)
        d.ellipse([506 * S, 410 * S, 548 * S, 442 * S], fill=(88, 40, 40, 255), outline=INK, width=2 * S)
    elif mood == "flustered":
        for sx, sy in [(430, 300), (610, 330), (450, 260), (590, 260)]:
            d.line([(sx - 8) * S, sy * S, (sx + 8) * S, sy * S], fill=(255, 176, 84, 255), width=3 * S)
            d.line([sx * S, (sy - 8) * S, sx * S, (sy + 8) * S], fill=(255, 176, 84, 255), width=3 * S)
        d.arc([500 * S, 416 * S, 552 * S, 444 * S], 200, 340, fill=INK, width=3 * S)
    elif mood == "shock":
        d.ellipse([484 * S, 352 * S, 502 * S, 372 * S], fill=WHITE, outline=INK, width=2 * S)
        d.ellipse([532 * S, 350 * S, 550 * S, 370 * S], fill=WHITE, outline=INK, width=2 * S)
        d.ellipse([514 * S, 414 * S, 540 * S, 440 * S], fill=(88, 40, 40, 255), outline=INK, width=2 * S)
    elif mood == "hurt":
        d.line([484 * S, 354 * S, 504 * S, 364 * S], fill=INK, width=4 * S)
        d.line([484 * S, 364 * S, 504 * S, 354 * S], fill=INK, width=4 * S)
        d.line([498 * S, 428 * S, 552 * S, 424 * S], fill=INK, width=3 * S)
    paste_hi(img, layer)
    return img


# ============================================================ SUPPORT CAST
def build_marn():
    img = load("scenario_chara1024_chiffon0103_01.png")
    px = img.load()
    import colorsys
    w, h = img.size
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if a == 0:
                continue
            hh, s, v = hue_of(r, g, b)
            if (hh < 30 or hh > 330) and s > 0.18 and v > 0.5 and y < 470:  # pink hair -> iron gray
                nr, ng, nb = colorsys.hsv_to_rgb(220 / 360, 0.05, v * 0.78)
                px[x, y] = (int(nr * 255), int(ng * 255), int(nb * 255), a)
            elif 190 < hh < 240 and s > 0.3:  # blue cardigan -> petal-dyed wool (deep teal kept muted)
                nr, ng, nb = colorsys.hsv_to_rgb(200 / 360, s * 0.55, v * 0.72)
                px[x, y] = (int(nr * 255), int(ng * 255), int(nb * 255), a)
    return img


def build_brakko():
    img = load("scenario_chara1024_kelly0102_01.png")
    px = img.load()
    import colorsys
    w, h = img.size
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if a == 0:
                continue
            hh, s, v = hue_of(r, g, b)
            if (335 < hh or hh < 15) and s > 0.5 and v > 0.35:  # red gloves/pants -> iron gray-blue
                nr, ng, nb = colorsys.hsv_to_rgb(215 / 360, 0.25, v * 0.6)
                px[x, y] = (int(nr * 255), int(ng * 255), int(nb * 255), a)
    return img


def build_collector(name, fn):
    img = load(fn)
    px = img.load()
    import colorsys
    w, h = img.size
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if a == 0:
                continue
            hh, s, v = hue_of(r, g, b)
            if 8 < hh < 48 and v > 0.45 and 0.12 < s < 0.62:
                continue  # protect skin
            if s > 0.35 and v > 0.25:  # saturated colors -> somber coat tones
                nr, ng, nb = colorsys.hsv_to_rgb(220 / 360, min(s, 0.22), v * 0.8)
                px[x, y] = (int(nr * 255), int(ng * 255), int(nb * 255), a)
            elif s < 0.2 and v > 0.72:  # bright whites -> charcoal coat
                nr, ng, nb = colorsys.hsv_to_rgb(220 / 360, 0.1, v * 0.34)
                px[x, y] = (int(nr * 255), int(ng * 255), int(nb * 255), a)
    return img


# ============================================================ MAIN
def sheet(dirpath, names, out, cols=5, cell=300):
    ims = []
    for n in names:
        p = os.path.join(dirpath, n + ".png")
        im = Image.open(p).convert("RGBA")
        im.thumbnail((cell, cell), Image.LANCZOS)
        ims.append((n, im))
    rows = math.ceil(len(ims) / cols)
    W, H = cols * (cell + 8) + 8, rows * (cell + 26) + 8
    board = Image.new("RGB", (W, H), (28, 30, 38))
    d = ImageDraw.Draw(board)
    for i, (n, im) in enumerate(ims):
        x = 8 + (i % cols) * (cell + 8)
        y = 8 + (i // cols) * (cell + 26)
        board.paste(im, (x + (cell - im.width) // 2, y + (cell - im.height) // 2), im)
        d.text((x + 4, y + cell + 4), n, fill=(220, 220, 210))
    board.save(out)


def main():
    os.makedirs(os.path.join(OUT, "merdou"), exist_ok=True)
    os.makedirs(os.path.join(OUT, "ashren"), exist_ok=True)
    os.makedirs(os.path.join(OUT, "cast"), exist_ok=True)
    notes = {"TEMP_VISUAL_MODEL": True, "models": {}}

    base = build_merdou_base()
    base.save(os.path.join(OUT, "merdou", "base.png"))
    for mood in EXPRESSIONS:
        merdou_expression(base, mood).save(os.path.join(OUT, "merdou", mood + ".png"))
    notes["models"]["merdou"] = {"source": "scenario_chara1024_oven0103_01.png",
                                 "ops": "hair-removal, bald dome, full dark beard, chest scar, crimson grade",
                                 "moods": list(EXPRESSIONS)}
    sheet(os.path.join(OUT, "merdou"), ["base"] + list(EXPRESSIONS),
          os.path.join(OUT, "MERDOU_MODEL_SHEET.jpg"))

    ab = build_ashren_base()
    ab.save(os.path.join(OUT, "ashren", "base.png"))
    for mood in ["neutral", "smug", "talk", "serious", "angry", "flustered", "shock", "hurt"]:
        (ab if mood == "neutral" else ashren_expression(ab, mood)).save(
            os.path.join(OUT, "ashren", mood + ".png"))
    notes["models"]["ashren"] = {"source": "scenario_chara1024_niji0101_01.png",
                                 "ops": "silver hair, pewter trim, charcoal grade, antennae removed, visor->eyes"}
    sheet(os.path.join(OUT, "ashren"),
          ["base", "smug", "talk", "serious", "angry", "flustered", "shock", "hurt"],
          os.path.join(OUT, "ASHREN_MODEL_SHEET.jpg"))

    build_marn().save(os.path.join(OUT, "cast", "marn.png"))
    build_brakko().save(os.path.join(OUT, "cast", "brakko.png"))
    build_collector("collector1", "scenario_chara1024_capone0201_01.png").save(
        os.path.join(OUT, "cast", "collector1.png"))
    build_collector("collector2", "scenario_chara1024_vergo0101_02.png").save(
        os.path.join(OUT, "cast", "collector2.png"))
    notes["models"]["cast"] = {"marn": "chiffon0103 iron-gray grade", "brakko": "kelly0102 iron grade",
                               "collectors": "capone0101/vergo0101 somber grade"}
    sheet(os.path.join(OUT, "cast"), ["marn", "brakko", "collector1", "collector2"],
          os.path.join(OUT, "CAST_MODEL_SHEET.jpg"), cols=4)

    json.dump(notes, open(os.path.join(OUT, "ASSET_MODEL_NOTES.json"), "w", encoding="utf-8"), indent=1)
    print("models built ->", OUT)


if __name__ == "__main__":
    main()
