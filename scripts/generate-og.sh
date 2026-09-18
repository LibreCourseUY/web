#!/usr/bin/env bash
# Generates the 1200x630 Open Graph image from the hero asset.
# Requires ImageMagick 7 (`magick`).
set -euo pipefail

root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$root"

magick_bin="$(command -v magick || command -v convert)"
font="/usr/share/fonts/liberation/LiberationSans-Bold.ttf"
tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT

"$magick_bin" src/assets/ascii-hero.png -resize 1200x630^ -gravity center -extent 1200x630 "$tmp/hero.png"
"$magick_bin" -size 630x1200 gradient:'rgba(11,13,12,0)-rgba(11,13,12,0.94)' -rotate 90 "$tmp/scrim.png"

"$magick_bin" -size 1200x630 xc:'#0b0d0c' \
	\( "$tmp/hero.png" -alpha set -channel A -evaluate multiply 0.32 +channel \) -composite \
	"$tmp/scrim.png" -composite \
	-fill '#5ec2af' -draw 'rectangle 0,0 6,630' \
	\( src/assets/hero_icon.png -resize x116 \) -gravity NorthWest -geometry +88+96 -composite \
	-font "$font" -pointsize 70 -fill '#f7f7f0' -gravity NorthWest -annotate +86+300 'LibreCourseUY' \
	-font "$font" -pointsize 28 -fill '#8fd8c6' -gravity NorthWest -annotate +90+392 'Open source community · Uruguay' \
	-font "$font" -pointsize 23 -fill 'rgba(247,247,240,0.55)' -gravity NorthWest -annotate +90+552 'librecourse.uy' \
	-strip -interlace Plane -quality 85 \
	public/og.jpg

echo "Wrote public/og.jpg"
