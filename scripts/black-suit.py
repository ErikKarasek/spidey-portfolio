"""Turn the red masked render into a black-suit one with exactly the same head.

The Gemini symbiote mask had no chin and a neck as wide as its jaw, so on the hero it read as a big
helmet. Recolouring the red mask instead keeps the head shape (and the lens alignment) that already
fits the face; head-swap.py then puts it on the symbiote body.

    python scripts/black-suit.py ~/Downloads/585fe0d9a0414c96c02e3eb19ac67895.webp OUT.png
    python scripts/head-swap.py FACE_SYMBIOTE OUT.png public/img/symbiote/hero-mask.jpg --dx -16 --dy 56
    python scripts/darken-bg.py public/img/symbiote/hero-mask.jpg

Needs: pip install pillow numpy scipy
"""

import sys

import numpy as np
from PIL import Image
from scipy import ndimage

src = np.asarray(Image.open(sys.argv[1]).convert("RGB"), np.float32)
bg = src[5:40, 5:40].reshape(-1, 3).mean(0)
r, g, b = src[..., 0], src[..., 1], src[..., 2]

# Only the red fabric (and its dark web lines) changes; lenses, their black rims and the backdrop stay.
reddish = r > np.maximum(g, b) + 15
# Antialiased edges are part suit, part backdrop; green says how much backdrop, so the edge can be
# recoloured without leaving a pink fringe.
alpha = np.where(reddish, np.clip((bg[1] - g) / (bg[1] - 20), 0, 1), 0)
suit = np.clip(np.where(alpha > 0.05, (r - (1 - alpha) * bg[0]) / np.maximum(alpha, 0.05), 0), 0, 255)

suit = ndimage.median_filter(suit, size=5)  # knit texture gone, web lines kept
lum = (suit / 255.0) ** 2.4 * 26
broad = ndimage.gaussian_filter(suit, 5)
sheen = np.clip((broad - 165) / 90, 0, 1) ** 2 * 150  # broad soft highlights, like latex
grey = np.clip(lum + sheen, 0, 255)
black = np.stack([grey, grey, grey * 1.05], -1)

out = np.where(reddish[..., None], black * alpha[..., None] + (1 - alpha[..., None]) * bg, src)
Image.fromarray(np.clip(out, 0, 255).round().astype(np.uint8)).save(sys.argv[2])
print(f"{sys.argv[2]}: black suit from {sys.argv[1].split('/')[-1]}")
