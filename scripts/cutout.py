"""Cut a figure out of a plain background (the AI symbiote art has no transparency) and trim it.

    python scripts/cutout.py IN OUT.png --bg light   # pale/grey studio background
    python scripts/cutout.py IN OUT.png --bg dark --grow 12   # black background with a light halo

Background = pixels of the background tone connected to the image border. --grow then eats up to N px
of non-background pixels next to it (a halo left by an earlier cut-out) without entering the dark
outline of the figure itself. Needs: pip install pillow numpy scipy
"""

import argparse

import numpy as np
from PIL import Image
from scipy import ndimage

ap = argparse.ArgumentParser()
ap.add_argument("src")
ap.add_argument("out")
ap.add_argument("--bg", choices=["light", "dark"], required=True)
ap.add_argument("--grow", type=int, default=0)
args = ap.parse_args()

img = np.asarray(Image.open(args.src).convert("RGB")).astype(np.float32)
lum = img.mean(axis=2)
sat = img.max(axis=2) - img.min(axis=2)

tone = (lum > 170) & (sat < 30) if args.bg == "light" else lum < 45
labels, _ = ndimage.label(tone)
border = np.unique(np.concatenate([labels[0, :], labels[-1, :], labels[:, 0], labels[:, -1]]))
bg = np.isin(labels, border[border > 0])

if args.grow:
    figure_ink = lum < 45  # the suit's own dark outline stops the growth
    grown = bg.copy()
    for _ in range(args.grow):
        grown |= ndimage.binary_dilation(grown) & ~figure_ink
    bg = grown

# Soft 1px edge so the silhouette isn't jagged.
alpha = 1 - ndimage.gaussian_filter(bg.astype(np.float32), sigma=0.7)
alpha[bg] = 0
rgba = np.dstack([img, alpha * 255]).round().astype(np.uint8)

ys, xs = np.nonzero(alpha > 0.05)
pad = 4
crop = rgba[max(ys.min() - pad, 0) : ys.max() + pad, max(xs.min() - pad, 0) : xs.max() + pad]
Image.fromarray(crop).save(args.out)
print(f"{args.out}: {crop.shape[1]}x{crop.shape[0]}, {bg.mean():.0%} background removed")
