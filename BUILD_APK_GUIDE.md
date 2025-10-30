# How to Build an APK for Assetly

## Prerequisites

Before building, make sure you have:
1. **Expo CLI** installed globally
2. **EAS CLI** installed for Expo builds
3. **Node.js** and **npm** installed
4. A **GitHub account** (optional but recommended for EAS)

## Installation

```bash
# Install Expo CLI globally
npm install -g expo-cli

# Install EAS CLI globally
npm install -g eas-cli

# Or use npx without installing globally
npx expo@latest start
npx eas-cli@latest build
```

## Option 1: Build with EAS (Recommended - Cloud Build)

### Step 1: Create an Expo Account
```bash
expo login
# or
eas login
```

### Step 2: Initialize EAS (if not already done)
```bash
cd d:\MyAssetly
eas build:configure
```

### Step 3: Build the APK
```bash
# Build APK for Android
eas build --platform android

# Or for a specific preview
eas build --platform android --profile preview
```

### Step 4: Download Your APK
- The build will run on Expo's servers
- You'll get a download link when complete
- APK will be available at the link provided in terminal

**Pros:**
- Works on any OS (Windows, Mac, Linux)
- No local setup needed
- Fast and reliable

**Cons:**
- Requires internet connection
- Takes 10-20 minutes per build
- Free tier has limited builds

---

## Option 2: Local Build with Expo Prebuild

### Step 1: Install Dependencies
```bash
cd d:\MyAssetly

# Install Android development dependencies (Windows)
npm install -g expo-dev-client
```

### Step 2: Install Android SDK (One-time setup)
```bash
# Download Android Studio from: https://developer.android.com/studio
# Or install Android SDK via Android Studio

# Set up environment variables
# ANDROID_HOME = C:\Users\YourUsername\AppData\Local\Android\sdk
# Add to PATH: %ANDROID_HOME%\platform-tools
```

### Step 3: Prebuild for Android
```bash
cd d:\MyAssetly
npx expo prebuild --platform android --clean
```

### Step 4: Build APK Locally
```bash
cd d:\MyAssetly\android

# Using Gradle
./gradlew assembleRelease

# Or with npx
npx eas build --platform android --local
```

### Step 5: Locate Your APK
```
d:\MyAssetly\android\app\build\outputs\apk\release\app-release.apk
```

**Pros:**
- Full control
- No internet needed after first setup
- Faster subsequent builds

**Cons:**
- Complex setup
- Requires Android SDK
- More disk space needed

---

## Option 3: Fast Development Build

For testing during development:

```bash
# Start development server
npx expo start --android

# Or build a debug APK
npx eas build --platform android --profile preview

# Then install on device
adb install path/to/app-debug.apk
```

---

## Quick Start (Fastest Way)

1. **Login to Expo:**
```bash
expo login
```

2. **Configure EAS (first time only):**
```bash
cd d:\MyAssetly
eas build:configure
```

3. **Build APK:**
```bash
eas build --platform android
```

4. **Wait for build completion** (~10-20 min)

5. **Download and install:**
```bash
# Download link will be provided in terminal
# Then install with:
adb install app-release.apk
```

---

## Troubleshooting

### Issue: "expo login not found"
```bash
npm install -g expo-cli
```

### Issue: "Android SDK not found"
- Download Android Studio: https://developer.android.com/studio
- Run Android Studio and install SDK tools

### Issue: Build fails with credentials
```bash
eas logout
eas login
eas build:configure --reset
```

### Issue: APK is too large
- This is normal for React Native apps (typically 40-80MB)
- Users can reduce download size through Play Store compression

---

## Install APK on Device

### Via ADB (Android Debug Bridge)
```bash
# Connect device via USB
adb devices

# Install APK
adb install path/to/app-release.apk

# Or directly launch
adb install -r app-release.apk
```

### Via Email/File Transfer
1. Copy APK file to your Android device
2. Tap the APK file
3. Allow installation from unknown sources
4. Tap "Install"

---

## Next: Deploy to Play Store

Once you have a working APK:

1. **Create Google Play Developer Account** ($25 one-time)
2. **Generate signing key** (EAS handles this)
3. **Upload to Play Store**:
```bash
eas build --platform android --auto-submit
```

---

## Common Build Commands

```bash
# Preview build (testable, not for store)
eas build --platform android --profile preview

# Production build (for Play Store)
eas build --platform android --profile production

# Check build status
eas build:list

# View build logs
eas build:view <build-id>

# Cancel build
eas build:cancel <build-id>
```

---

## Recommended: EAS Build Profile Configuration

Add to `eas.json`:
```json
{
  "build": {
    "preview": {
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "android": {
        "buildType": "aab"
      }
    }
  }
}
```

---

## Support

- **Expo Docs:** https://docs.expo.dev/
- **EAS Build Docs:** https://docs.expo.dev/build/introduction/
- **React Native Docs:** https://reactnative.dev/

Happy building! 🚀
