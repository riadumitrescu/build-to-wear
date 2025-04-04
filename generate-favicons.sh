#!/bin/bash

# Create output directory if it doesn't exist
mkdir -p assets/favicon

# Convert SVG to PNG for various sizes
magick convert assets/favicon/logo.svg -background none -resize 16x16 assets/favicon/favicon-16x16.png
magick convert assets/favicon/logo.svg -background none -resize 32x32 assets/favicon/favicon-32x32.png
magick convert assets/favicon/logo.svg -background none -resize 180x180 assets/favicon/apple-touch-icon.png
magick convert assets/favicon/logo.svg -background none -resize 192x192 assets/favicon/android-chrome-192x192.png
magick convert assets/favicon/logo.svg -background none -resize 512x512 assets/favicon/android-chrome-512x512.png
magick convert assets/favicon/logo.svg -background none -resize 150x150 assets/favicon/mstile-150x150.png

# Create Safari pinned tab SVG
cp assets/favicon/logo.svg assets/favicon/safari-pinned-tab.svg

# Convert favicon.ico to PNG and back to ICO for better quality
magick convert assets/favicon/favicon.ico assets/favicon/favicon.png
magick convert assets/favicon/favicon.png -define icon:auto-resize=16,32,48,64 assets/favicon/favicon.ico

echo "Favicon generation complete!" 