"""Build the hero's masked layer from the face shot's body plus only the head of the masked shot.

Two AI renders never agree on the suit: the masked one had a longer neck and lower shoulders, so the
body jumped when the cursor peeled the mask off. Taking everything below the chin from the face shot
makes the two layers identical except for the head, like the original site's pair.

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
ap.add_argument("--head-bottom", type=int, default=560, help="above this row the mask is used across the full width")
ap.add_argument("--neck-bottom", type=int, default=660, help="the mask's neck column ends here, inside the face shot's collar")
ap.add_argument("--neck", type=int, nargs=2, default=[650, 950], help="x range of the neck column at --head-bottom")
ap.add_argument("--neck-end", type=int, nargs=2, default=[705, 895], help="x range at --neck-bottom (tapers so the mask's shoulder flare isn't clipped into bumps)")
args = ap.parse_args()

W, H = 1600, 896
face = Image.open(args.face).convert("RGB").resize((W, H), Image.LANCZOS)
src = Image.open(args.mask_src).convert("RGB")
w = round(W * args.scale)
h = round(src.height * W / src.width * args.scale)
mask = Image.new("RGB", (W, H), src.getpixel((5, 5)))
mask.paste(src.resize((w, h), Image.LANCZOS), (args.dx, args.dy))

# The renders' "white" studio backgrounds differ slightly; match them so the seam doesn't show.
mask_bg = np.asarray(mask, np.float32)[5:40, 5:40].reshape(-1, 3).mean(0)
face_bg = np.asarray(face, np.float32)[5:40, 5:40].reshape(-1, 3).mean(0)
mask = Image.fromarray(np.clip(np.asarray(mask, np.float32) * (face_bg / mask_bg), 0, 255).astype(np.uint8))

# 1 = take the masked shot (head, plus a neck column down into the collar), 0 = keep the face shot.
weight = np.zeros((H, W), np.float32)
weight[: args.head_bottom] = 1
for y in range(args.head_bottom, args.neck_bottom):
    t = (y - args.head_bottom) / (args.neck_bottom - args.head_bottom)
    left = round(args.neck[0] + (args.neck_end[0] - args.neck[0]) * t)
    right = round(args.neck[1] + (args.neck_end[1] - args.neck[1]) * t)
    weight[y, left:right] = 1
weight = ndimage.gaussian_filter(weight, sigma=10)[..., None]

out = np.asarray(mask, np.float32) * weight + np.asarray(face, np.float32) * (1 - weight)
Image.fromarray(out.round().astype(np.uint8)).save(args.out, quality=92)
print(f"{args.out}: head from {args.mask_src.split('/')[-1]}, body from {args.face.split('/')[-1]}")
