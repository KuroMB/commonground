#!/bin/bash
# Run this from the repo root on your local machine:
#   bash scripts/download-images.sh
#
# Downloads the Pexels inspiration images and saves them to images/
# so they're hosted locally instead of depending on the Pexels CDN.

set -e
mkdir -p images

download() {
  local url="$1"
  local file="images/$2.jpg"
  echo "Downloading $2..."
  curl -sL "$url" -o "$file"
  # Basic check — Pexels returns HTML on error
  if ! file "$file" | grep -q "JPEG"; then
    echo "  WARNING: $file may not be a valid JPEG — check manually"
  fi
}

download "https://images.pexels.com/photos/1739321/pexels-photo-1739321.jpeg?auto=compress&cs=tinysrgb&w=800&fit=crop"   "city-museum"
download "https://images.pexels.com/photos/1250452/pexels-photo-1250452.jpeg?auto=compress&cs=tinysrgb&w=800&fit=crop"   "magic-house"
download "https://images.pexels.com/photos/17935410/pexels-photo-17935410.jpeg?auto=compress&cs=tinysrgb&w=800&fit=crop" "urban-air"
download "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1200&fit=crop"  "family-maker-studio"
download "https://images.pexels.com/photos/296301/pexels-photo-296301.jpeg?auto=compress&cs=tinysrgb&w=800&fit=crop"     "union-station"
download "https://images.pexels.com/photos/1813946/pexels-photo-1813946.jpeg?auto=compress&cs=tinysrgb&w=800&fit=crop"   "parent-bar"
download "https://images.pexels.com/photos/2933105/pexels-photo-2933105.jpeg?auto=compress&cs=tinysrgb&w=800&fit=crop"   "ziplines-ropes"
download "https://images.pexels.com/photos/19230314/pexels-photo-19230314.jpeg?auto=compress&cs=tinysrgb&w=1200&fit=crop" "popup-play-space"
download "https://images.pexels.com/photos/1556704/pexels-photo-1556704.jpeg?auto=compress&cs=tinysrgb&w=800&fit=crop"   "dave-busters"
download "https://images.pexels.com/photos/8535214/pexels-photo-8535214.jpeg?auto=compress&cs=tinysrgb&w=800&fit=crop"   "science-center"

echo ""
echo "Done. Files saved to images/"
ls -lh images/*.jpg
