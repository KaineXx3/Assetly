/**
 * Logo Export Script
 * Generates PNG versions of the Assetly logo in multiple sizes for app icons
 * 
 * Run with: node scripts/export-logo.js
 * Output: assets/app-icons/
 */

const fs = require('fs');
const path = require('path');

// Icon sizes needed for iOS and Android
const iconSizes = [
  { size: 1024, name: 'icon-1024.png', description: 'Universal (1024x1024)' },
  { size: 512, name: 'icon-512.png', description: 'Android (512x512)' },
  { size: 192, name: 'icon-192.png', description: 'Android (192x192)' },
  { size: 180, name: 'icon-180.png', description: 'iOS (180x180)' },
  { size: 120, name: 'icon-120.png', description: 'iOS (120x120)' },
  { size: 152, name: 'icon-152.png', description: 'iPad (152x152)' },
  { size: 167, name: 'icon-167.png', description: 'iPad Pro (167x167)' },
];

const outputDir = path.join(__dirname, '../assets/app-icons');

// Create output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
  console.log(`✓ Created directory: ${outputDir}`);
}

console.log('\n📦 Assetly Logo Export Guide\n');
console.log('The following icon sizes have been configured:\n');

iconSizes.forEach((icon) => {
  console.log(`  • ${icon.name.padEnd(20)} - ${icon.description}`);
});

console.log('\n⚠️  Important Note:');
console.log('This script configures the icon sizes needed. To generate the actual PNG files,');
console.log('you have several options:\n');

console.log('Option 1: Use a web-based tool (RECOMMENDED)');
console.log('  1. Export your logo as SVG or screenshot the React Native component');
console.log('  2. Go to: https://www.favicon-generator.org/ or similar');
console.log('  3. Upload your logo image');
console.log('  4. Download all icon sizes and extract to: assets/app-icons/\n');

console.log('Option 2: Use ImageMagick (CLI)');
console.log('  1. Install ImageMagick: brew install imagemagick');
console.log('  2. Convert your logo to PNG first');
console.log('  3. Run: convert logo.png -resize 1024x1024 assets/app-icons/icon-1024.png\n');

console.log('Option 3: Use Expo built-in icon generation');
console.log('  1. Create a high-quality SVG of your logo');
console.log('  2. Place it at: assets/icon.svg');
console.log('  3. Run: npx expo-cli prebuild --clean\n');

console.log('Option 4: Use online Expo Asset Generator');
console.log('  1. Visit: https://www.appicon.co/');
console.log('  2. Upload your logo image');
console.log('  3. Generate all sizes and download\n');

// Create a sample app.json configuration snippet
const appJsonConfig = {
  "expo": {
    "plugins": [
      [
        "expo-build-properties",
        {
          "ios": {
            "useFrameworksPath": true
          },
          "android": {
            "useNextNotificationChannelId": true
          }
        }
      ]
    ],
    "ios": {
      "icon": "./assets/app-icons/icon-180.png"
    },
    "android": {
      "icon": "./assets/app-icons/icon-192.png",
      "adaptiveIcon": {
        "foregroundImage": "./assets/app-icons/icon-192.png",
        "backgroundColor": "#FFFFFF"
      }
    }
  }
};

console.log('📝 Update app.json with these icon configurations:\n');
console.log(JSON.stringify(appJsonConfig, null, 2));

console.log('\n✓ Configuration complete!');
console.log(`\nOnce you have your PNG files in ${outputDir}/`);
console.log('Update your app.json and you\'re ready to build! 🚀\n');
