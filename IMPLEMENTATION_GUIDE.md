# MyAssetly - Personal Asset Tracker

A React Native mobile application built with Expo for tracking personal electronics and calculating their daily depreciation cost.

## Features

### Core Features
- **Asset Management**: Track electronic devices with purchase price, purchase date, and other details
- **Automatic Daily Cost Calculation**: Calculates cost per day based on (Purchase Price) / (Days Since Purchase)
- **Total Statistics**: Displays total asset value and total daily cost across all active assets
- **Asset Status**: Track whether items are "In Service" or retired
- **Flexible Pricing Options**:
  - Auto-calculated daily cost (default)
  - Custom daily price
  - Usage count-based calculation

### UI Components
- **Home Screen**: Asset list with grid layout, search, filter, and statistics
- **Add Asset Modal**: Dark-themed form with multiple options
- **Icon Picker**: 80+ icons organized by category
- **Asset Cards**: Beautiful green cards displaying asset info and daily cost
- **Date Picker**: Custom calendar for selecting purchase dates
- **Settings Screen**: Profile and app settings

## Technical Stack

- **React Native 0.81.5**
- **Expo SDK 54**
- **Expo Router** (file-based routing)
- **TypeScript**
- **AsyncStorage** (data persistence)
- **date-fns** (date calculations)
- **UUID** (unique asset IDs)
- **Ionicons** (vector icons)

## Project Structure

```
d:/MyAssetly/
├── app/
│   ├── _layout.tsx              # Root layout with providers
│   ├── (tabs)/
│   │   ├── _layout.tsx          # Tab navigation with center add button
│   │   ├── index.tsx            # Home (assets screen)
│   │   ├── assets.tsx           # Assets screen implementation
│   │   ├── my.tsx               # Settings/profile screen
│   │   └── dummy.tsx            # Placeholder for center button
│   └── add-asset.tsx            # Add asset modal screen
├── components/
│   ├── asset-card.tsx           # Asset card component
│   ├── stat-card.tsx            # Statistics card
│   ├── date-picker.tsx          # Custom date picker
│   ├── icon-picker.tsx          # Icon selection modal
│   └── ui/
│       ├── button.tsx           # Button component
│       ├── input.tsx            # Text input component
│       └── toggle.tsx           # Toggle switch component
├── constants/
│   ├── icons.ts                 # Icon database
│   └── theme.ts                 # Theme colors
├── contexts/
│   └── add-asset.tsx            # Asset modal context
├── store/
│   └── assetStore.ts            # AsyncStorage management
├── types/
│   └── index.ts                 # TypeScript types
├── utils/
│   ├── calculations.ts          # Asset calculations
│   └── sample-data.ts           # Sample data for testing
├── hooks/
│   ├── use-color-scheme.ts
│   └── use-theme-color.ts
└── package.json
```

## Key Types

```typescript
interface Asset {
  id: string;                          // UUID
  name: string;
  icon: string;                        // Icon identifier
  category: string;
  price: number;
  purchaseDate: string;                // ISO string
  warrantyDate: string | null;
  calculateByUsage: boolean;
  usageCount?: number;
  specifiedDailyPrice: number | null;
  inService: boolean;
  image: string | null;
  createdAt: string;
  updatedAt: string;
}

interface AssetCalculations {
  daysOwned: number;
  dailyCost: number;
  displayDailyPrice: string;
}
```

## Installation

1. **Install dependencies**:
```bash
npm install
```

2. **Install required packages** (already done):
```bash
npm install @react-native-async-storage/async-storage date-fns uuid @react-native-community/datetimepicker
```

## Running the App

```bash
# Start Expo development server
npm start

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android

# Run on web
npm run web
```

## Usage

### Adding Assets
1. Tap the blue "+" button at the bottom center
2. Select an icon from the 80+ available options
3. Fill in asset details (name, price, purchase date)
4. Configure optional settings:
   - Warranty date
   - Custom daily price
   - Usage-based calculation
   - In Service status
5. Tap "Add Asset"

### Viewing Statistics
- Home screen displays:
  - Total asset value
  - Total daily depreciation cost
  - Number of active assets

### Filtering and Search
- Use the search icon to find assets
- Use the sort icon to reorder
- Use the filter dropdown to show specific asset types

## Calculations

### Daily Cost Calculation
```
daysOwned = floor((today - purchaseDate) / (1000 * 60 * 60 * 24))
dailyCost = price / daysOwned
```

### Summary Statistics
- Only includes assets where `inService === true`
- Total Daily Cost = sum of all daily costs
- Total Assets = sum of all asset prices

## Sample Data

On first app launch, sample data is automatically loaded:
- iPad 9 (¥1050)
- Poco X3 GT (¥2500)
- Sony Headphones (¥1500)
- MacBook Pro (¥3999)
- Canon EOS Camera (¥2200)
- Apple Watch (¥450)

Total: ¥9699 value

## Asset Categories

Icons are organized into 8 categories:
- **Basic**: General items (star, heart, gift, etc.)
- **Digital**: Electronics (laptop, phone, tablet, camera, headphones, watch, TV, gamepad)
- **Clothing**: Apparel items
- **Beauty**: Personal care products
- **Brand**: Popular brands (Apple, Samsung, Nike, etc.)
- **Musical**: Instruments and audio equipment
- **Transport**: Vehicles and transportation items
- **Fitness**: Exercise and sports equipment

## Color Scheme

- **Primary Blue**: #1976D2
- **Header Blue**: #0D47A1
- **Asset Card Green**: #E8F5E9
- **Dark Modal**: #1A1A1A
- **Text Dark**: #333333
- **Text Light**: #999999
- **Border Light**: #E0E0E0

## Component Highlights

### AssetCard
- Displays icon, name, price, and daily cost
- Shows days owned in top-right badge
- Indicates retired status
- Green rounded design

### DatePicker
- Custom calendar implementation
- Month navigation
- Works on all platforms
- Defaults to today's date

### IconPicker
- 80+ categorized icons
- Tab-based category selection
- Grid layout (5 columns)
- Scrollable for all platforms

### Toggle
- Green when on, gray when off
- Smooth animation
- Label support

## Data Persistence

- Uses AsyncStorage for persistent data storage
- Automatically loads on app start
- Saves after every add/update/delete operation
- JSON serialization for asset objects

## Responsive Design

- Works on all screen sizes
- Bottom tab navigation with center floating action button
- Grid-based asset layout (2 columns)
- Adaptive padding and spacing

## Future Enhancements

Potential features to add:
- Asset edit functionality
- Asset deletion with confirmation
- Photo/image support
- Notification for warranty expiry
- Export/import data
- Dark theme support
- Asset history and depreciation charts
- Backup to cloud storage
- Multiple currency support
- Asset usage tracking

## Browser & Platform Support

- **iOS**: 12.0+
- **Android**: 5.0+ (API level 21+)
- **Web**: Modern browsers (Chrome, Safari, Firefox, Edge)

## Development Notes

- All components use functional components with hooks
- TypeScript for type safety
- Clean separation of concerns
- Reusable UI components library
- AsyncStorage for offline-first approach
- No external backend required

## License

This project is created for personal asset tracking.

## Support

For issues or feature requests, please create an issue in the project repository.
