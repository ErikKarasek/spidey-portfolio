#!/bin/sh
# Builds the black-suit variants in public/img/symbiote/ from the red-and-blue originals.
# Only the suit is recoloured: strongly red or blue pixels turn to glossy black (shading kept),
# while skin, hair, the white lenses and the background stay as they are.
set -e
cd "$(dirname "$0")/../public/img"
mkdir -p symbiote

# How red / how blue a pixel is, as a share of its own brightness (skin ≈ .25, lips ≈ .45, suit ≈ .8).
# Red threshold: gentle where there's a face (keeps lips and skin), aggressive elsewhere (no red fringe).
geq() {
  RED="clip(((r(X,Y)-max(g(X,Y),b(X,Y)))/(r(X,Y)+1)-$1)/$2,0,1)"
  BLUE='clip(((b(X,Y)-r(X,Y))/(b(X,Y)+1)-0.3)/0.2,0,1)'
  A="max($RED,$BLUE)"
  LUM='(0.3*r(X,Y)+0.59*g(X,Y)+0.11*b(X,Y))'
  mix() { echo "$1(X,Y)*(1-$A)+$LUM*$2*$A"; }
  echo "geq=r='$(mix r 0.32)':g='$(mix g 0.32)':b='$(mix b 0.36)':a='alpha(X,Y)'"
}

# spidey-* and hero-* now have hand-made AI symbiote versions in symbiote/ (cut out with cutout.py,
# backgrounds darkened with darken-bg.py). This recolour is only the fallback for new pictures.
for f in "$@"; do
  [ -f "$f" ] || continue
  case "$f" in hero-face.jpg) GEQ=$(geq 0.55 0.15) ;; *) GEQ=$(geq 0.22 0.18) ;; esac
  case "$f" in
    *.jpg) ffmpeg -loglevel error -y -i "$f" -vf "format=rgba,$GEQ,format=rgb24" -q:v 3 "symbiote/$f" ;;
    *.webp)
      ffmpeg -loglevel error -y -i "$f" -vf "format=rgba,$GEQ" "/tmp/symbiote-$$.png"
      cwebp -quiet -q 85 -alpha_q 100 "/tmp/symbiote-$$.png" -o "symbiote/$f"
      rm "/tmp/symbiote-$$.png" ;;
  esac
  echo "symbiote/$f"
done
