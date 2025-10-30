# Assetly Logo - App Icon Generation Guide

## Quick Start

Your logo is ready to be converted to app icons! Follow these steps:

### Step 1: Generate PNGs from SVG

**Option A: Online Tool (Easiest)**
1. Go to https://www.favicon-generator.org/ or https://www.appicon.co/
2. Upload the SVG file from: `assets/logo.svg`
3. Download all icon sizes
4. Extract the PNGs to: `assets/app-icons/`

**Option B: Using Convertio (Online, No Installation)**
1. Visit https://convertio.co/svg-png/
2. Upload `assets/logo.svg`
3. Select output format: PNG
4. Generate sizes 1024x1024, 512x512, 192x192, 180x180, 120x120, 152x152, 167x167
5. Download and organize files

**Option C: Using ImageMagick (Command Line)**
```bash
# Install ImageMagick (macOS)
brew install imagemagick

# Install ImageMagick (Windows - using Chocolatey)
choco install imagemagick

# Convert SVG to PNG at different sizes
mkdir -p assets/app-icons
convert assets/logo.svg -resize 1024x1024 assets/app-icons/icon-1024.png
convert assets/logo.svg -resize 512x512 assets/app-icons/icon-512.png
convert assets/logo.svg -resize 192x192 assets/app-icons/icon-192.png
convert assets/logo.svg -resize 180x180 assets/app-icons/icon-180.png
convert assets/logo.svg -resize 120x120 assets/app-icons/icon-120.png
convert assets/logo.svg -resize 152x152 assets/app-icons/icon-152.png
convert assets/logo.svg -resize 167x167 assets/app-icons/icon-167.png
```

**Option D: Using Node.js with Sharp (Programmatic)**
```bash
npm install sharp
node scripts/export-logo.js
```

### Step 2: Update app.json

Once you have the PNG files in `assets/app-icons/`, update your `app.json`:

```json
{
  "expo": {
    "name": "Assetly",
    "slug": "assetly",
    "version": "1.0.0",
    "ios": {
      "supportsTabletMode": true,
      "bundleIdentifier": "com.assetly.app",
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
}
```

### Step 3: Build Your App

```bash
# For Expo Go (quick test)
npx expo start

# For iOS build
eas build --platform ios

# For Android build
eas build --platform android

# For local build
npx expo prebuild --clean
```

## Icon Size Reference

| Size | Platform | Usage |
|------|----------|-------|
| 1024x1024 | Universal | Store listing, high DPI displays |
| 512x512 | Android | Google Play Store |
| 192x192 | Android | Home screen, notifications |
| 180x180 | iOS | Home screen (non-Retina) |
| 120x120 | iOS | Home screen (Retina) |
| 152x152 | iPad | Home screen |
| 167x167 | iPad Pro | Home screen |

## Files Created

- `assets/logo.svg` - Vector version of your logo
- `assets/app-icons/` - Directory for all PNG icon sizes
- `scripts/export-logo.js` - Icon generation guide script

## What Your Logo Includes

✅ Clean "A" letter (primary mark)  
✅ Upward arrow accent (growth/assets)  
✅ Growth chart bars (finance theme)  
✅ Professional rounded square background  
✅ Subtle shadow effect  

Your logo is now ready for production! 🚀
