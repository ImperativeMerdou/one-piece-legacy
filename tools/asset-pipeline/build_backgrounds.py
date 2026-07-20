#!/usr/bin/env python3
"""Build the vertical-slice background plates (1600x900) from private library
pieces + painted atmosphere. Outputs to .private-assets-cache/models/bg/ (local only).

Plates:
  pit_wide_night      <- quest_map_colosseum_exhibition_1_01 (night grade + lanterns)
  pit_cage            <- quest_map_colosseum_underground_1_01 (floor+torch wall composite)
  harbor_night        <- painted composite (mountain silhouette, window lights, water)
  kettle_exterior     <- painted composite (stone street, warm tavern front)
  kettle_interior     <- quest_map_special_rumbar wood + hearth/atmosphere composite
  stove_insert        <- painted pot/steam insert on wood
"""
import json, os, math, random
from PIL import Image, ImageDraw, ImageFilter, ImageEnhance

REPO = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
CFG = json.load(open(os.path.join(REPO, "config", "private-assets.local.json"), encoding="utf-8"))
ROOT = CFG["asset_root"]
MAPS = os.path.join(ROOT, "Area", "Backgrounds", "Maps")
OUT = os.path.join(REPO, ".private-assets-cache", "models", "bg")
W, H = 1600, 900
random.seed(7)


def canvas(c=(10, 14, 22, 255)):
    return Image.new("RGBA", (W, H), c)


def vgrad(im, top, bottom, alpha_top=255, alpha_bottom=255):
    g = Image.new("RGBA", (1, H))
    for y in range(H):
        f = y / (H - 1)
        col = tuple(int(top[i] + (bottom[i] - top[i]) * f) for i in range(3))
        a = int(alpha_top + (alpha_bottom - alpha_top) * f)
        g.putpixel((0, y), col + (a,))
    return g.resize((W, H))


def glow(draw_im, x, y, r, color, strength=0.85):
    gl = Image.new("RGBA", (r * 2, r * 2), (0, 0, 0, 0))
    gd = ImageDraw.Draw(gl)
    for i in range(r, 0, -2):
        a = int(strength * 255 * (1 - i / r) ** 2)
        gd.ellipse([r - i, r - i, r + i, r + i], fill=color + (a,))
    draw_im.alpha_composite(gl, (x - r, y - r))


def grade_night(im, blue=(30, 44, 72), keep=0.58, contrast=1.06):
    base = im.convert("RGB")
    overlay = Image.new("RGB", base.size, blue)
    graded = Image.blend(overlay, base, keep)
    graded = ImageEnhance.Contrast(graded).enhance(contrast)
    graded = ImageEnhance.Brightness(graded).enhance(0.9)
    return graded.convert("RGBA")


def vignette(im, power=0.55):
    m = Image.new("L", (W, H), 0)
    d = ImageDraw.Draw(m)
    d.ellipse([-W * 0.25, -H * 0.35, W * 1.25, H * 1.35], fill=255)
    m = m.filter(ImageFilter.GaussianBlur(160))
    dark = Image.new("RGBA", (W, H), (6, 8, 14, int(255 * power)))
    dark.putalpha(m.point(lambda p: int((255 - p) * power)))
    im.alpha_composite(dark)
    return im


def pit_wide_night():
    src = Image.open(os.path.join(MAPS, "quest_map_colosseum_exhibition_1_01.png")).convert("RGBA")
    crop = src.crop((168, 200, 1024, 1024 - 130))  # 856x694 arena bowl
    plate = crop.resize((W, int(W * crop.height / crop.width)), Image.LANCZOS)
    im = canvas()
    im.alpha_composite(plate, (0, H - plate.height))
    im.alpha_composite(vgrad(im, (16, 24, 44), (16, 24, 44), 150, 0))  # darken sky/top
    im = grade_night(im)
    # lantern pools along the wall line
    for lx in range(140, W, 260):
        glow(im, lx, 386, 120, (255, 190, 110), 0.5)
        d = ImageDraw.Draw(im)
        d.ellipse([lx - 7, 374, lx + 7, 392], fill=(255, 222, 150, 255))
        d.rectangle([lx - 2, 392, lx + 2, 412], fill=(40, 30, 22, 255))
    # moonlight rim on bleachers
    im.alpha_composite(vgrad(im, (90, 120, 170), (0, 0, 0), 60, 0))
    return vignette(im, 0.5)


def pit_cage():
    src = Image.open(os.path.join(MAPS, "quest_map_colosseum_underground_1_01.png")).convert("RGBA")
    wall = src.crop((168, 0, 1024, 170)).resize((W, 320), Image.LANCZOS)
    floor = src.crop((168, 520, 1024, 1024)).resize((W, 700), Image.LANCZOS)
    im = canvas((8, 9, 14, 255))
    im.alpha_composite(wall, (0, 40))
    im.alpha_composite(floor, (0, H - 700 + 60))
    im = grade_night(im, blue=(26, 30, 48), keep=0.62)
    glow(im, 330, 118, 150, (255, 176, 96), 0.65)
    glow(im, 1180, 108, 150, (255, 176, 96), 0.65)
    return vignette(im, 0.6)


def mountain_pts(x0, x1, ytop, ybase, n=22, seed=1):
    rnd = random.Random(seed)
    pts = [(x0, ybase)]
    for i in range(n + 1):
        x = x0 + (x1 - x0) * i / n
        t = i / n
        y = ybase - (ybase - ytop) * math.sin(t * math.pi) ** 0.8 + rnd.randint(-26, 26)
        pts.append((x, y))
    pts.append((x1, ybase))
    return pts


def harbor_night():
    im = canvas()
    im.alpha_composite(vgrad(im, (18, 26, 48), (36, 44, 66)))
    d = ImageDraw.Draw(im)
    rnd = random.Random(3)
    for i in range(90):  # stars
        x, y = rnd.randint(0, W), rnd.randint(0, 330)
        d.point((x, y), fill=(210, 220, 235, rnd.randint(90, 200)))
    d.ellipse([1210, 90, 1300, 180], fill=(226, 232, 242, 235))
    glow(im, 1255, 135, 130, (200, 214, 235), 0.35)
    # mountain island silhouette
    d.polygon(mountain_pts(-100, 1700, 150, 640, seed=5), fill=(20, 26, 40, 255))
    d.polygon(mountain_pts(200, 1500, 260, 640, seed=9), fill=(26, 34, 52, 255))
    # terraces of window lights climbing the mountain
    rnd = random.Random(11)
    for i in range(210):
        x = rnd.randint(260, 1380)
        yb = 620 - abs(x - 820) * 0.32
        y = rnd.randint(int(yb - 190), int(yb))
        if y < 240:
            continue
        w2 = rnd.choice([3, 3, 4])
        c = rnd.choice([(255, 214, 140), (255, 196, 110), (240, 226, 170)])
        d.rectangle([x, y, x + w2, y + w2 + 2], fill=c + (rnd.randint(150, 235),))
    # crown silhouette at summit with one lit window
    d.polygon([(760, 168), (800, 128), (860, 122), (900, 158), (884, 208), (776, 212)],
              fill=(14, 18, 30, 255))
    d.rectangle([846, 152, 858, 170], fill=(255, 216, 140, 235))
    glow(im, 852, 160, 60, (255, 206, 120), 0.5)
    # sea
    sea = vgrad(im, (30, 44, 66), (12, 18, 30))
    im.alpha_composite(sea.crop((0, 0, W, 260)), (0, 640))
    rnd = random.Random(23)
    for i in range(60):  # reflections
        x = rnd.randint(240, 1400)
        y = rnd.randint(660, 880)
        ln = rnd.randint(10, 44)
        d.line([(x - ln // 2, y), (x + ln // 2, y)], fill=(214, 190, 130, rnd.randint(26, 80)), width=2)
    # jetty + boats silhouettes
    d.polygon([(0, 852), (560, 830), (560, 900), (0, 900)], fill=(16, 18, 26, 255))
    for bx in (200, 420, 640, 900, 1160):
        d.polygon([(bx, 828), (bx + 90, 828), (bx + 78, 850), (bx + 10, 850)], fill=(14, 16, 24, 255))
        d.line([(bx + 44, 764), (bx + 44, 828)], fill=(14, 16, 24, 255), width=5)
    for lx, ly in [(120, 812), (350, 806), (560, 818), (1240, 812)]:
        d.ellipse([lx - 5, ly - 5, lx + 5, ly + 5], fill=(255, 216, 140, 240))
        glow(im, lx, ly, 70, (255, 200, 120), 0.55)
    im = im.filter(ImageFilter.GaussianBlur(0.6))
    return vignette(im, 0.42)


def kettle_exterior():
    im = canvas()
    im.alpha_composite(vgrad(im, (16, 22, 40), (30, 36, 52)))
    d = ImageDraw.Draw(im)
    rnd = random.Random(31)
    for i in range(50):
        d.point((rnd.randint(0, W), rnd.randint(0, 240)), fill=(210, 220, 235, rnd.randint(80, 180)))
    # street of stepped stone houses (silhouette with a few lit windows)
    x = -40
    while x < W:
        hw = rnd.randint(150, 260)
        hh = rnd.randint(240, 420)
        d.rectangle([x, 560 - hh, x + hw, 640], fill=(22, 26, 40, 255))
        d.polygon([(x - 8, 560 - hh), (x + hw // 2, 560 - hh - rnd.randint(40, 90)), (x + hw + 8, 560 - hh)],
                  fill=(18, 22, 34, 255))
        for wcount in range(rnd.randint(0, 3)):
            wx = x + rnd.randint(16, hw - 30)
            wy = 560 - rnd.randint(40, hh - 60)
            d.rectangle([wx, wy, wx + 14, wy + 20], fill=(255, 208, 130, 200))
        x += hw + rnd.randint(8, 40)
    # foreground: the Kettle front — warm windows, door, hanging sign
    d.rectangle([520, 300, 1120, 900], fill=(38, 30, 26, 255))
    d.polygon([(500, 300), (820, 210), (1140, 300)], fill=(30, 24, 20, 255))
    for wx, wy in [(580, 420), (760, 420), (940, 420)]:
        d.rectangle([wx, wy, wx + 120, wy + 150], fill=(255, 196, 110, 255))
        d.line([(wx + 60, wy), (wx + 60, wy + 150)], fill=(52, 38, 30, 255), width=8)
        d.line([(wx, wy + 75), (wx + 120, wy + 75)], fill=(52, 38, 30, 255), width=8)
        glow(im, wx + 60, wy + 75, 170, (255, 190, 110), 0.42)
    d.rectangle([700, 640, 860, 900], fill=(24, 18, 14, 255))
    d.rectangle([716, 656, 844, 900], fill=(46, 34, 26, 255))
    # copper kettle sign
    d.line([(920, 300), (920, 350)], fill=(60, 50, 42, 255), width=6)
    d.ellipse([870, 350, 970, 430], fill=(160, 96, 60, 255))
    d.ellipse([884, 364, 956, 416], fill=(196, 128, 80, 255))
    d.arc([850, 340, 990, 440], 200, 340, fill=(120, 70, 44, 255), width=8)
    glow(im, 920, 390, 90, (255, 176, 96), 0.4)
    # wet cobbles
    for i in range(180):
        cx, cy = rnd.randint(0, W), rnd.randint(640, 900)
        cw = rnd.randint(18, 44)
        d.ellipse([cx, cy, cx + cw, cy + 12], outline=(52, 56, 72, 90), width=2)
    im.alpha_composite(vgrad(im, (0, 0, 0), (10, 12, 20), 0, 140))
    return vignette(im, 0.5)


def kettle_interior():
    src = Image.open(os.path.join(MAPS, "quest_map_special_rumbar_1_01.png")).convert("RGBA")
    floor = src.crop((260, 430, 1010, 1010))  # plank field (some props at edges)
    floor = floor.resize((W, int(W * floor.height / floor.width)), Image.LANCZOS)
    im = canvas((16, 12, 10, 255))
    im.alpha_composite(floor, (0, H - floor.height + 80))
    # wall band: reuse plank texture, darker, as timber wall
    wall = src.crop((300, 620, 1000, 900)).resize((W, 420), Image.LANCZOS)
    wall = ImageEnhance.Brightness(wall).enhance(0.5)
    im.alpha_composite(wall, (0, 0))
    d = ImageDraw.Draw(im)
    # shelf band with bottles/mugs silhouettes
    d.rectangle([0, 250, W, 268], fill=(30, 20, 14, 255))
    rnd = random.Random(41)
    for bx in range(30, W, 46):
        bh = rnd.randint(26, 54)
        col = rnd.choice([(70, 46, 30), (58, 60, 42), (74, 38, 32), (48, 42, 56)])
        d.rectangle([bx, 250 - bh, bx + rnd.randint(14, 24), 250], fill=col + (255,))
    # timber beams
    for bx in (170, 640, 1120, 1520):
        d.rectangle([bx, 0, bx + 44, 480], fill=(26, 17, 12, 255))
    d.rectangle([0, 470, W, 500], fill=(26, 17, 12, 255))
    # hearth at right
    d.rectangle([1260, 300, 1560, 500], fill=(30, 22, 18, 255))
    d.rectangle([1290, 340, 1530, 500], fill=(12, 8, 6, 255))
    for fx, fh in [(1330, 70), (1380, 96), (1430, 82), (1480, 60)]:
        d.polygon([(fx, 500), (fx + 18, 500 - fh), (fx + 36, 500)], fill=(255, 150, 60, 235))
        d.polygon([(fx + 8, 500), (fx + 18, 500 - fh + 26), (fx + 28, 500)], fill=(255, 214, 120, 235))
    glow(im, 1408, 452, 260, (255, 160, 70), 0.6)
    # warm lamps
    for lx in (300, 800):
        d.ellipse([lx - 10, 96, lx + 10, 120], fill=(255, 216, 140, 245))
        d.line([(lx, 0), (lx, 96)], fill=(30, 20, 14, 255), width=4)
        glow(im, lx, 130, 190, (255, 196, 110), 0.5)
    # long table + benches silhouettes mid-ground
    d.polygon([(120, 700), (1000, 680), (1080, 740), (60, 764)], fill=(44, 30, 20, 255))
    d.polygon([(120, 700), (1000, 680), (1000, 672), (120, 692)], fill=(66, 46, 30, 255))
    for mx in (240, 420, 610, 800):
        d.ellipse([mx, 676, mx + 34, 692], fill=(80, 56, 34, 255))
        d.rectangle([mx + 12, 660, mx + 22, 682], fill=(80, 56, 34, 255))
    im = grade_night(im, blue=(46, 32, 22), keep=0.72, contrast=1.05)
    return vignette(im, 0.5)


def stove_insert():
    im = canvas((20, 14, 10, 255))
    d = ImageDraw.Draw(im)
    # wood counter
    for y in range(560, 900, 34):
        d.rectangle([0, y, W, y + 30], fill=(56, 38, 24, 255))
        d.line([(0, y), (W, y)], fill=(34, 22, 14, 255), width=4)
    # big pot
    d.ellipse([480, 300, 1120, 780], fill=(38, 40, 46, 255))
    d.ellipse([500, 320, 1100, 500], fill=(24, 26, 32, 255))
    d.ellipse([520, 340, 1080, 480], fill=(120, 74, 40, 255))
    for bx, by in [(600, 380), (720, 400), (860, 370), (960, 410), (700, 430)]:
        d.ellipse([bx, by, bx + 70, by + 34], fill=(180, 120, 66, 255))
        d.ellipse([bx + 10, by + 6, bx + 40, by + 20], fill=(214, 160, 96, 255))
    d.arc([440, 280, 1160, 820], 160, 380, fill=(70, 74, 84, 255), width=14)
    # steam
    for sx in (620, 800, 980):
        for i, r in enumerate((46, 66, 88)):
            d.ellipse([sx - r // 2, 300 - i * 90 - r, sx + r // 2, 300 - i * 90],
                      outline=(235, 235, 240, 90 - i * 22), width=10)
    glow(im, 800, 420, 340, (255, 160, 80), 0.5)
    im = im.filter(ImageFilter.GaussianBlur(0.8))
    return vignette(im, 0.45)


def main():
    os.makedirs(OUT, exist_ok=True)
    for name, fn in [("pit_wide_night", pit_wide_night), ("pit_cage", pit_cage),
                     ("harbor_night", harbor_night), ("kettle_exterior", kettle_exterior),
                     ("kettle_interior", kettle_interior), ("stove_insert", stove_insert)]:
        fn().convert("RGB").save(os.path.join(OUT, name + ".jpg"), quality=90)
        print("built", name)
    # review board
    board = Image.new("RGB", (1620, 1400), (24, 26, 32))
    for i, name in enumerate(["pit_wide_night", "pit_cage", "harbor_night",
                              "kettle_exterior", "kettle_interior", "stove_insert"]):
        im = Image.open(os.path.join(OUT, name + ".jpg")).resize((790, 445))
        board.paste(im, (10 + (i % 2) * 800, 10 + (i // 2) * 460))
    board.save(os.path.join(OUT, "BG_BOARD.jpg"), quality=85)
    print("board ->", os.path.join(OUT, "BG_BOARD.jpg"))


if __name__ == "__main__":
    main()
