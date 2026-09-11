"""Swap the white studio background of the symbiote hero shots for the page's near-black.

Only white that is connected to the top/left/right edges counts as background, so the white
lenses of the mask and the white spider on the chest (which touches the bottom edge) survive.
Needs: pip install pillow numpy scipy
Usage: python scripts/darken-bg.py public/img/symbiote/hero-face.jpg public/img/symbiote/hero-mask.jpg
"""

import sys

import numpy as np
from PIL import Image
from scipy import ndimage

BG = np.array([10, 10, 11], dtype=np.float32)  # --color-surface in Symbiote mode


def darken(path: str) -> None:
    img = np.asarray(Image.open(path).convert("RGB")).astype(np.float32)
    lum = img.mean(axis=2)
    sat = img.max(axis=2) - img.min(axis=2)

    # Bright, colourless pixels are background candidates; keep the blobs that touch top/left/right.
    candidate = (lum > 205) & (sat < 30)
    labels, _ = ndimage.label(candidate)
    edge = np.unique(np.concatenate([labels[0, :], labels[:, 0], labels[:, -1]]))
    bg = np.isin(labels, edge[edge > 0])

    # Anti-aliased rims (light, grey, right next to the background) fade out instead of leaving a halo.
    near = ndimage.binary_dilation(bg, iterations=4) & ~bg
    rim = np.clip((lum - 110) / 120, 0, 1) * (sat < 40) * near
    alpha = ndimage.gaussian_filter(np.maximum(bg.astype(np.float32), rim), sigma=0.8)[..., None]

    out = img * (1 - alpha) + BG * alpha
    Image.fromarray(out.round().astype(np.uint8)).save(path, quality=90)
    print(f"{path}: {bg.mean():.0%} background")


for p in sys.argv[1:]:
    darken(p)
