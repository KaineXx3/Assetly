# MyAssetly - Quick Start Guide

## Project Overview

MyAssetly is a React Native application for tracking personal electronic assets and calculating their daily depreciation cost. The app automatically loads with sample data showing 6 electronics items worth ¥9699 total.

## Quick Setup

### 1. Install and Run

```bash
# Navigate to project directory
cd d:\MyAssetly

# Install dependencies (already done)
npm install

# Start Expo
npm start
```

### 2. Launch on Device/Emulator

```bash
# iOS Simulator
npm run ios

# Android Emulator
npm run android

# Web Browser
npm run web
```

## Key Features at a Glance

### ✨ Home Screen (Assets Tab)
- **Header**: "My Assets" with active asset count
- **Stats**: Total asset value + total daily cost
- **Grid**: 2-column layout of asset cards
- **Cards**: Show icon, name, price, daily cost, and days owned

**Sample Data** (loads automatically):
- iPad 9: ¥1050.00 (832 days old, ¥1.26/day)
- Poco X3 GT: ¥2500.00 (depreciation daily)
- Sony Headphones: ¥1500.00
- MacBook Pro: ¥3999.00
- Canon EOS: ¥2200.00
- Apple Watch: ¥450.00

### ➕ Add Asset (Center Button)
Tap the blue "+" button to open the add asset form:
1. Select icon from 80+ options (8 categories)
2. Choose category
3. Enter name and price
4. Select purchase date
5. Optional: warranty date, custom pricing, usage-based calculation
6. Toggle "In Service" status
7. Tap "Add Asset"

### ⚙️ Settings (My Tab)
- Profile management
- Notification settings
- General app settings
- Theme preferences
- Help & support
- About & version info

## Data Persistence

- Assets are saved locally using AsyncStorage
- No internet required
- Data persists between app sessions
- Backup stored as JSON in local storage

## Calculations Explained

### Daily Cost
```
Formula: Price ÷ Days Owned = Daily Cost
Example: ¥1050 ÷ 832 days = ¥1.26/day
```

### Days Owned
```
Calculated from purchase date to today
Minimum: 1 day
Shown as: "XXXDays" or "XY" (years/days)
```

### Total Daily Cost
- Sum of all active asset daily costs
- Only includes items marked "In Service"
- Updated when adding/editing assets

## File Structure

```
Key Files:
├── app/(tabs)/
│   ├── index.tsx          → Assets home screen
│   ├── my.tsx             → Settings/profile
│   └── _layout.tsx        → Tab navigation + add button
├── app/add-asset.tsx      → Add asset modal
├── components/
│   ├── asset-card.tsx     → Asset display card
│   ├── icon-picker.tsx    → Icon selection
│   ├── date-picker.tsx    → Custom calendar
│   └── ui/                → Reusable components
├── store/
│   └── assetStore.ts      → Data storage
├── types/
│   └── index.ts           → TypeScript definitions
└── utils/
    ├── calculations.ts    → Cost calculations
    └── sample-data.ts     → Initial data
```

## Color Theme

| Element | Color | Hex |
|---------|-------|-----|
| Header | Dark Blue | #0D47A1 |
| Buttons/Links | Primary Blue | #1976D2 |
| Asset Cards | Light Green | #E8F5E9 |
| Modal | Dark Gray | #1A1A1A |
| Text (Primary) | Dark Gray | #333333 |
| Text (Secondary) | Light Gray | #999999 |

## Common Tasks

### ✏️ Add a New Asset

1. Tap the **blue + button** at the bottom
2. Select an icon (tap icon preview)
3. Fill in details:
   - Name: "My Device"
   - Price: "5000"
   - Purchase Date: Select from calendar
4. Toggle "In Service" if retiring
5. Tap "Add Asset"

### 📊 View Statistics

- Open the **Assets tab**
- Stats cards show at the top:
  - **Total Assets**: Sum of all prices (active only)
  - **Total Daily Cost**: Sum of daily depreciation

### 🔍 Search/Filter

- **Search Icon**: Find assets by name
- **Sort Icon**: Reorder asset display
- **Filter Dropdown**: Show specific categories

### 🗑️ Remove Asset

Currently: Mark as "not In Service" in edit mode
Future: Will support full deletion

## Data Format

Assets are stored as JSON objects:
```typescript
{
  id: "uuid",
  name: "iPad 9",
  icon: "digital-tablet",
  category: "Digital",
  price: 1050,
  purchaseDate: "2022-01-01T00:00:00.000Z",
  warrantyDate: null,
  calculateByUsage: false,
  specifiedDailyPrice: null,
  inService: true,
  image: null,
  createdAt: "2024-01-01T12:00:00.000Z",
  updatedAt: "2024-01-01T12:00:00.000Z"
}
```

## Icon Categories

- **Basic** (10): Star, heart, gift, bookmark, bag, cube, flask, leaf, pizza, paw
- **Digital** (10): Laptop, phone, tablet, camera, headphones, watch, desktop, TV, gamepad, battery
- **Clothing** (10): T-shirt, shoes, jacket, hat, pants, dress, socks, gloves, belt, sunglasses
- **Beauty** (10): Perfume, lipstick, brush, mirror, scissors, bottle, soap, comb, nail, mask
- **Brand** (10): Apple, Google, Microsoft, Samsung, Sony, Nike, Adidas, Intel, NVIDIA, Canon
- **Musical** (10): Guitar, piano, drum, saxophone, violin, microphone, speaker, amplifier, tuner, metronome
- **Transport** (10): Car, bike, motorcycle, airplane, boat, train, bus, scooter, skateboard, helmet
- **Fitness** (10): Dumbbell, yoga, running, bike, treadmill, basketball, football, tennis, skates, stopwatch

## Tips & Tricks

✅ **Best Practices:**
- Set realistic purchase dates for accurate calculations
- Use consistent categories for easier filtering
- Enable "In Service" for current assets only
- Check total daily cost to manage depreciation

⚠️ **Known Limitations:**
- Currently no cloud backup (local only)
- Single account/user (no multi-user support)
- Asset photos not yet implemented
- No depreciation curve (linear calculation only)

🔄 **Future Features:**
- Asset editing
- Photo attachments
- Warranty tracking
- Export/import
- Depreciation charts
- Multi-currency support

## Troubleshooting

### App Won't Start
- Clear cache: `npm start -- --clear`
- Reset project: `npm run reset-project`

### Sample Data Missing
- Data auto-loads on first run
- Clear AsyncStorage if needed
- Restart app

### Calculations Seem Wrong
- Check purchase date is correct
- Verify "In Service" is enabled
- Days calculation updates daily automatically

## Contact & Support

For issues or questions:
1. Check the Implementation Guide: `IMPLEMENTATION_GUIDE.md`
2. Review component documentation in code comments
3. Check AsyncStorage for data persistence issues

---

**Version**: 1.0.0  
**Last Updated**: October 2025  
**Built with**: React Native, Expo, TypeScript
