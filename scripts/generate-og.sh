#!/usr/bin/env bash
# Generates the 1200x630 Open Graph image from the brand logo, plus the favicons.
# Requires ImageMagick 7 (`magick`).
set -euo pipefail

root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$root"

magick_bin="$(command -v magick || command -v convert)"
tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT

# Brand logo with wordmark, centered on a white 1200x630 canvas.
"$magick_bin" src/assets/logo_with_text.png -fuzz 5% -trim +repage \
	-filter Lanczos -resize 1040x470 \
	-background white -gravity center -extent 1200x630 \
	-strip -interlace Plane -quality 90 \
	public/og.jpg

"$magick_bin" src/assets/hero_icon.png -resize 512x512 -background none -gravity center -extent 512x512 -strip public/icon.png

# Favicons from the brand logo: square vector icon, multi-size ICO and Apple touch icon.
sed -e 's/width="545" height="439" viewBox="0 0 545 439"/viewBox="0 -53 545 545"/' src/assets/lcuy_logo.svg >public/favicon.svg
"$magick_bin" src/assets/logo_white_background.png -fuzz 5% -trim +repage -background white -gravity center -extent 580x580 "$tmp/logo-square.png"
"$magick_bin" "$tmp/logo-square.png" -define icon:auto-resize=48,32,16 public/favicon.ico
"$magick_bin" "$tmp/logo-square.png" -resize 160x160 -background white -gravity center -extent 180x180 -strip public/apple-touch-icon.png

echo "Wrote public/og.jpg, public/icon.png and favicons"
