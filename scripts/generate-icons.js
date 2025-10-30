#!/usr/bin/env node

const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const svgPath = path.join(__dirname, '../assets/logo.svg');
const outputDir = path.join(__dirname, '../assets');

// Icon sizes needed for Android and iOS
const sizes = [
  { name: 'icon.png', size: 1024 }, // iOS App Icon
  { name: 'android-icon.png', size: 192 }, // Android icon
  { name: 'icon-192.png', size: 192 },
  { name: 'icon-512.png', size: 512 },
];

async function generateIcons() {
  try {
    console.log('Generating icons from logo.svg...');
    
    for (const { name, size } of sizes) {
      const outputPath = path.join(outputDir, name);
      
      // Convert SVG to PNG
      await sharp(svgPath)
        .png()
        .resize(size, size, {
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 1 }
        })
        .toFile(outputPath);
      
      console.log(`✓ Generated ${name} (${size}x${size})`);
    }
    
    console.log('\n✅ All icons generated successfully!');
  } catch (error) {
    console.error('❌ Error generating icons:', error);
    process.exit(1);
  }
}

generateIcons();
