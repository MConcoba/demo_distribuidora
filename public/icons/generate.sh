#!/bin/bash
# Create simple colored square icons for PWA
sizes=(72 96 128 144 152 192 384 512)
for size in "${sizes[@]}"; do
  magick -size ${size}x${size} xc:"#2563eb" -gravity center -pointsize $((size/3)) -fill white -font "DejaVu-Sans-Bold" -annotate +0+0 "SD" public/icons/icon-${size}x${size}.png 2>/dev/null || \
  convert -size ${size}x${size} xc:"#2563eb" -gravity center -pointsize $((size/3)) -fill white -font "DejaVu-Sans-Bold" -annotate +0+0 "SD" public/icons/icon-${size}x${size}.png 2>/dev/null || \
  echo "Creating placeholder for ${size}x${size}"
done
