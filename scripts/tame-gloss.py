"""Tone down the symbiote mask's studio highlights once its background is dark.

Rendered on white, the glossy head picks up a bright rim all around and a big white hotspot on the
forehead; on the page's near-black they read as a glowing outline and a bald patch. This compresses
the highlights on the head (the white lenses and everything below the collar are left alone) and
darkens the rim hardest right at the silhouette.

    python scripts/tame-gloss.py public/img/symbiote/hero-mask.jpg   (after darken-bg.py)

Needs: pip install pillow numpy scipy
"""

import sys

import numpy as np
from PIL import Image
from scipy import ndimage

HEAD_BOTTOM = 620  # the collar sits just below; the body comes from the face shot and stays as is

path = sys.argv[1]
img = np.asarray(Image.open(path).convert("RGB"), np.float32)
lum = img.mean(2)
sat = img.max(2) - img.min(2)

# The lenses are the two big white blobs on the head (the chest spider is the third, lower down).
bright = (lum > 150) & (sat < 40)
labels, n = ndimage.label(bright)
sizes = ndimage.sum(bright, labels, range(1, n + 1))
lens = np.isin(labels, [i + 1 for i, s in enumerate(sizes) if s > 6000])
lens[700:] = False
lens = ndimage.binary_fill_holes(ndimage.binary_closing(lens, iterations=6))
keep = ndimage.gaussian_filter(ndimage.binary_dilation(lens, iterations=14).astype(np.float32), 3)

head = np.zeros_like(lum)
head[:HEAD_BOTTOM] = 1
head = ndimage.gaussian_filter(head, 8)

# Backdrop = the dark area connected to the top edge; the rim is measured from it.
labels, _ = ndimage.label(lum < 16)
top = np.unique(labels[0])
backdrop = np.isin(labels, top[top > 0])
rim = np.clip(0.35 + 0.65 * ndimage.distance_transform_edt(~backdrop) / 16, 0.35, 1)

toned = np.where(lum > 80, 80 + (lum - 80) * 0.4, lum) * rim
scale = np.where(lum > 1, toned / np.maximum(lum, 1), 1)
w = (head * (1 - keep))[..., None]
out = img * (1 - w) + img * scale[..., None] * w
Image.fromarray(np.clip(out, 0, 255).round().astype(np.uint8)).save(path, quality=92)
print(f"{path}: highlights toned")
