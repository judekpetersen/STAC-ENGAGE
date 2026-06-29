#!/usr/bin/env node
/* ============================================================
   STAC Engage — Icon Generator
   Run: node generate-icons.js
   Requires: npm install sharp (or use the SVG directly)
   ============================================================ */

const fs   = require('fs');
const path = require('path');

const SIZES = [72, 96, 128, 144, 152, 192, 384, 512];

/* Generate the icon SVG at any size */
function iconSVG(size) {
  const radius   = size * 0.18;
  const fontSize = size * 0.52;
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" rx="${radius}" fill="#6b1a1a"/>
  <rect x="${size*0.08}" y="${size*0.08}" width="${size*0.84}" height="${size*0.84}" rx="${radius*0.7}" fill="#c8b560" opacity="0.15"/>
  <text
    x="${size/2}" y="${size*0.67}"
    text-anchor="middle"
    font-family="Georgia, serif"
    font-size="${fontSize}"
    font-weight="700"
    fill="#c8b560"
  >S</text>
</svg>`;
}

/* Write SVG versions (fallback if sharp not available) */
const iconsDir = path.join(__dirname, 'icons');
if (!fs.existsSync(iconsDir)) fs.mkdirSync(iconsDir);

SIZES.forEach(size => {
  const svgPath = path.join(iconsDir, `icon-${size}.svg`);
  fs.writeFileSync(svgPath, iconSVG(size));
  console.log(`Written: icons/icon-${size}.svg`);
});

/* Convert to PNG with sharp if available */
try {
  const sharp = require('sharp');
  Promise.all(SIZES.map(size => {
    const svg  = Buffer.from(iconSVG(size));
    const dest = path.join(iconsDir, `icon-${size}.png`);
    return sharp(svg).png().toFile(dest).then(() => console.log(`PNG: icons/icon-${size}.png`));
  })).then(() => console.log('\nAll icons generated!'));
} catch(e) {
  console.log('\nSharp not installed — SVG icons written.');
  console.log('To generate PNGs: npm install sharp && node generate-icons.js');
  console.log('Or convert the SVGs online at: cloudconvert.com/svg-to-png');
}
