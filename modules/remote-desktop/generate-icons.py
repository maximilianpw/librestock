#!/usr/bin/env python3
"""Generate placeholder icon for Tauri app"""
import os
import sys

# Create a simple SVG icon
svg_content = """<?xml version="1.0" encoding="UTF-8"?>
<svg width="1024" height="1024" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#4F46E5;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#7C3AED;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="1024" height="1024" rx="180" fill="url(#grad)"/>
  <text x="512" y="640" font-family="Arial, sans-serif" font-size="400" font-weight="bold"
        text-anchor="middle" fill="white">RBI</text>
</svg>
"""

# Create src-tauri directory if it doesn't exist
src_tauri_dir = os.path.join(os.path.dirname(__file__), 'src-tauri')
os.makedirs(src_tauri_dir, exist_ok=True)

# Write the SVG file
icon_path = os.path.join(src_tauri_dir, 'app-icon.png')
svg_path = os.path.join(src_tauri_dir, 'app-icon.svg')

with open(svg_path, 'w') as f:
    f.write(svg_content)

print(f"Generated SVG icon at: {svg_path}")
print("Run: pnpm tauri icon app-icon.svg")
sys.exit(0)
