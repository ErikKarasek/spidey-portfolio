"""Build the hero's masked layer from the face shot's body plus only the head of the masked shot.

Two AI renders never agree on the suit: the masked one had a longer neck and lower shoulders, so the
body jumped when the cursor peeled the mask off. Taking the whole suit from the face shot makes the
two layers identical except for the head, like the original site's pair.

The seam follows the face shot's collar: everything above the collar line comes from the masked shot,
everything from the collar down from the face shot. The masked neck is first stretched (or squeezed)
sideways to the real neck's width, so it fills the collar opening exactly instead of leaving white
notches beside it or overhanging it.

    python scripts/head-swap.py FACE MASK_SRC OUT --scale 1.0 --dx -16 --dy 56

MASK_SRC is placed on the 1600x896 canvas (scaled, then offset so its lenses sit on the pupils).
Needs: pip install pillow numpy scipy
"""

import argparse

import numpy as np
from PIL import Image
from scipy import ndimage

ap = argparse.ArgumentParser()
ap.add_argument("face")
ap.add_argument("mask_src")
ap.add_argument("out")
ap.add_argument("--scale", type=float, default=1.0)
ap.add_argument("--dx", type=int, default=0)
ap.add_argument("--dy", type=int, default=0)
ap.add_argument("--neck-row", type=int, default=552, help="a row through the neck just above the collar, where both necks are measured")
ap.add_argument("--warp-from", type=int, default=440, help="the neck warp fades in from this row (the head above stays untouched)")
ap.add_argument("--chest-row", type=int, default=660, help="a row that is suit across the neck in the face shot; the collar is found by scanning up from it")
ap.add_argument("--debug", help="also write the blend weight here")
args = ap.parse_args()

W, H = 1600, 896
face = Image.open(args.face).convert("RGB").resize((W, H), Image.LANCZOS)
src = Image.open(args.mask_src).convert("RGB")
w = round(W * args.scale)
h = round(src.height * W / src.width * args.scale)
canvas = Image.new("RGB", (W, H), src.getpixel((5, 5)))
canvas.paste(src.resize((w, h), Image.LANCZOS), (args.dx, args.dy))

# The renders' "white" studio backgrounds differ slightly; match them so the seam doesn't show.
mask = np.asarray(canvas, np.float32)
face = np.asarray(face, np.float32)
mask = np.clip(mask * (face[5:40, 5:40].reshape(-1, 3).mean(0) / mask[5:40, 5:40].reshape(-1, 3).mean(0)), 0, 255)

bg_colour = face[5:40, 5:40].reshape(-1, 3).mean(0)


def is_bg(img):
    return np.abs(img - bg_colour).max(-1) < 28


def neck_edges(img, row):
    """Left and right edge of the neck (the non-background run through the canvas centre) around `row`."""
    lefts, rights = [], []
    for y in range(row - 6, row + 7):
        solid = ~is_bg(img[y])
        c = W // 2
        l = c
        while l > 0 and solid[l - 1]:
            l -= 1
        r = c
        while r < W - 1 and solid[r + 1]:
            r += 1
        lefts.append(l)
        rights.append(r)
    return float(np.median(lefts)), float(np.median(rights))


# 1. Stretch the masked neck to the real neck's width. Rows above --warp-from are left alone, then the
#    warp eases in so the head's lower half widens smoothly instead of kinking.
mL, mR = neck_edges(mask, args.neck_row)
fL, fR = neck_edges(face, args.neck_row)
xs = np.arange(W, dtype=np.float32)
warped = mask.copy()
for y in range(args.warp_from, H):
    t = min(1.0, (y - args.warp_from) / max(1, args.neck_row - 20 - args.warp_from))
    t = t * t * (3 - 2 * t)
    dst = [0, fL * t + mL * (1 - t), fR * t + mR * (1 - t), W - 1]
    src_x = np.interp(xs, dst, [0, mL, mR, W - 1])
    for c in range(3):
        warped[y, :, c] = np.interp(src_x, xs, mask[y, :, c])
mask = warped

# 2. Find the face shot's collar: scan up each column from the chest until the suit gives way to skin
#    (or background). Going by the green/red ratio holds up in the shadow under the chin too: skin sits
#    around 0.4-0.75, the red suit below 0.3 and the black suit near 1.
r, g = face[..., 0], face[..., 1]
skin = (r > 25) & (g > r * 0.35) & (g < r * 0.8) & ~is_bg(face)
suit = ~skin & ~is_bg(face)
collar = np.full(W, args.chest_row)
for x in range(W):
    if not suit[args.chest_row, x]:
        continue
    y, gap = args.chest_row, 0
    top = y
    while y > 0 and gap < 4:
        y -= 1
        if suit[y, x]:
            top, gap = y, 0
        else:
            gap += 1
    collar[x] = top

# Beside the neck both shots are background above their shoulders, so the seam can drop to whichever
# shoulder starts higher; that way neither shot's shoulder is ever cut off by the other's backdrop.
first_solid = lambda img, x: next((y for y in range(args.neck_row, H) if not is_bg(img[y, x])), H)
for x in range(W):
    if round(fL) - 4 <= x <= round(fR) + 4:
        continue
    # A few rows of margin so the blur below doesn't smear the higher shoulder's edge into a halo.
    collar[x] = min(collar[x], first_solid(face, x), first_solid(mask, x)) - 6
collar = ndimage.median_filter(collar, size=9)

# 3. Above the collar line: masked shot. From it down: face shot.
weight = (np.arange(H)[:, None] < collar[None, :]).astype(np.float32)
weight = ndimage.gaussian_filter(weight, sigma=2.5)[..., None]
out = mask * weight + face * (1 - weight)
Image.fromarray(out.round().astype(np.uint8)).save(args.out, quality=92)
if args.debug:
    Image.fromarray((weight[..., 0] * 255).astype(np.uint8)).save(args.debug)
print(f"{args.out}: neck {mL:.0f}-{mR:.0f} -> {fL:.0f}-{fR:.0f}, collar centre at row {collar[W // 2]}")
