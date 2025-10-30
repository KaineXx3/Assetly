# MyAssetly - Visual Architecture & Feature Map

## Application Flow

```
┌─────────────────────────────────────────────────┐
│         App Root (_layout.tsx)                  │
│    ┌──────────────────────────────────────┐   │
│    │   ThemeProvider                      │   │
│    │   AddAssetProvider (Context)         │   │
│    └──────────────────────────────────────┘   │
└────────────┬────────────────────────────────────┘
             │
    ┌────────┴────────┐
    │                 │
┌───▼─────┐    ┌─────▼────┐
│ (tabs)  │    │add-asset │
│  Stack  │    │  Modal   │
└───┬─────┘    └──────────┘
    │
    ├─ index.tsx (Assets Home)
    ├─ assets.tsx (Implementation)
    ├─ dummy.tsx (Add Button Placeholder)
    └─ my.tsx (Settings)
```

## Component Hierarchy

```
AssetsScreen (assets.tsx)
├─ SafeAreaView
│  ├─ Header
│  │  ├─ Title + Badge
│  │  └─ Controls (Search, Sort, Filter)
│  ├─ StatsContainer
│  │  ├─ StatCard (Total Assets)
│  │  └─ StatCard (Total Daily Cost)
│  └─ ScrollView (Assets List)
│     └─ GridContainer
│        └─ AssetCard × N
│           ├─ Icon
│           ├─ Name
│           ├─ Price
│           └─ Daily Cost

AddAssetModal (app/add-asset.tsx)
├─ Modal
│  ├─ SafeAreaView
│  │  ├─ Header (Cancel, Title)
│  │  ├─ ScrollView
│  │  │  ├─ IconSelectButton → IconPicker
│  │  │  ├─ CategorySelector
│  │  │  ├─ Input (Name)
│  │  │  ├─ Input (Price)
│  │  │  ├─ DatePicker (Purchase Date)
│  │  │  ├─ Toggle (Warranty)
│  │  │  │  └─ DatePicker (if enabled)
│  │  │  ├─ Toggle (Calculate by Usage)
│  │  │  │  └─ Input (Usage Count)
│  │  │  ├─ Toggle (Custom Daily Price)
│  │  │  │  └─ Input (Daily Price)
│  │  │  ├─ Toggle (In Service)
│  │  │  └─ Button (Add Asset)
│  │  └─ Spacer
│  └─ IconPicker Modal (Overlay)

IconPicker (icon-picker.tsx)
├─ Modal
│  ├─ Header (Cancel, Title, Sure)
│  ├─ CategoryTabs (Scroll)
│  │  └─ Tab × 8 categories
│  └─ FlatList (Icon Grid)
│     └─ IconItem × 80
│        ├─ Icon
│        └─ Name

DatePicker (date-picker.tsx)
├─ Container
│  ├─ Input (Display Date)
│  └─ Modal (Calendar)
│     ├─ Header
│     ├─ MonthNavigator
│     │  ├─ Previous Month
│     │  ├─ Month/Year
│     │  └─ Next Month
│     ├─ Calendar Grid
│     │  ├─ Weekday Headers
│     │  └─ Day Cells (7×6)
│     └─ Actions (Cancel, Confirm)

UI Components (ui/)
├─ Button (Primary, Secondary, Danger, Outlined)
├─ Input (Label, Error, Placeholder)
└─ Toggle (Label, Value indicator)
```

## Data Flow

```
┌────────────────────────────────────┐
│     User Action (Add Asset)        │
└────────────┬───────────────────────┘
             │
             ▼
┌────────────────────────────────────┐
│  AddAssetModal (Component State)   │
│  ├─ assetName                      │
│  ├─ price                          │
│  ├─ purchaseDate                   │
│  ├─ category                       │
│  ├─ inService                      │
│  └─ ... other fields               │
└────────────┬───────────────────────┘
             │
             ▼
┌────────────────────────────────────┐
│   assetStore.addAsset(newAsset)   │
│   ├─ Generate UUID                 │
│   ├─ Add timestamps                │
│   ├─ Save to AsyncStorage          │
│   └─ Update local state            │
└────────────┬───────────────────────┘
             │
             ▼
┌────────────────────────────────────┐
│   AsyncStorage (Persistent)       │
│   └─ JSON serialized assets        │
└────────────┬───────────────────────┘
             │
             ▼
┌────────────────────────────────────┐
│   useFocusEffect Hook              │
│   └─ Reload assets on screen focus │
└────────────┬───────────────────────┘
             │
             ▼
┌────────────────────────────────────┐
│   AssetsScreen (Re-render)        │
│   ├─ Load assets from store        │
│   ├─ Calculate statistics          │
│   ├─ Update state                  │
│   └─ Display updated list          │
└────────────────────────────────────┘
```

## Calculation Pipeline

```
┌─────────────────────────────────┐
│   Asset Object                  │
│   ├─ price: 1050                │
│   ├─ purchaseDate: ISO string   │
│   └─ ... other fields           │
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│ getAssetCalculations()          │
│ 1. Check specifiedDailyPrice   │ ──→ Use it if set
│ 2. Check calculateByUsage       │ ──→ Use usageCount
│ 3. Default: Calculate by days   │
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│ calculateDaysOwned()            │
│ days = (today - purchaseDate)   │
│      = differenceInDays(...)    │
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│ calculateDailyCost()            │
│ dailyCost = price / daysOwned   │
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│ formatCurrency()                │
│ return "¥X.XX" format           │
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│ AssetCalculations               │
│ {                               │
│   daysOwned: 832                │
│   dailyCost: 1.26              │
│   displayDailyPrice: "¥1.26"   │
│ }                               │
└─────────────────────────────────┘
```

## State Management

```
Global State (Context)
├─ AddAssetContext
│  ├─ showAddModal: boolean
│  ├─ openAddModal(): void
│  └─ closeAddModal(): void
│
Component State (useState)
├─ AssetsScreen
│  ├─ assets: Asset[]
│  ├─ summary: AssetSummary
│  ├─ loading: boolean
│  └─ refreshing: boolean
│
├─ AddAssetModal
│  ├─ selectedIcon: string
│  ├─ assetName: string
│  ├─ price: string
│  ├─ purchaseDate: string
│  ├─ category: string
│  ├─ setWarrantyMode: boolean
│  ├─ calculateByUsage: boolean
│  ├─ specifiedDailyPrice: boolean
│  └─ inService: boolean
│
├─ IconPicker
│  ├─ selectedCategory: IconCategory
│  └─ tempSelected: string
│
└─ DatePicker
   ├─ showPicker: boolean
   ├─ tempDate: Date
   └─ currentMonth: Date

Persistent State (AsyncStorage)
└─ '@myassetly_assets': Asset[]
```

## Calculation Examples

### Example 1: Standard Daily Cost
```
Asset: iPad 9
├─ Price: ¥1050
├─ Purchase Date: 832 days ago
│
├─ Calculation:
│  Days Owned = 832
│  Daily Cost = 1050 ÷ 832
│            = 1.262... → ¥1.26
│
└─ Display:
   - Card shows: "¥1050.00" (price)
   - Card shows: "¥1.26/Day" (daily cost)
   - Badge shows: "832Days"
```

### Example 2: Statistics Summary
```
Active Assets:
├─ iPad: ¥1050 (¥1.26/day)
├─ Phone: ¥2500 (¥5.00/day)
├─ Headphones: ¥1500 (¥4.11/day)
├─ Laptop: ¥3999 (¥19.99/day)
├─ Camera: ¥2200 (¥3.67/day)
└─ Watch: ¥450 (¥3.00/day)

Summary:
├─ Total Assets: ¥11699.00
└─ Total Daily Cost: ¥37.03
```

### Example 3: Usage-Based Calculation
```
Asset: Gym Equipment
├─ Price: ¥2000
├─ Calculate by Usage: ON
├─ Usage Count: 100 (usage days)
│
├─ Calculation:
│  Daily Cost = 2000 ÷ 100
│            = ¥20/day
│
└─ Display:
   - Always shows: "¥20.00/Day"
```

## Icon Categories Distribution

```
BASIC (10)        DIGITAL (10)       CLOTHING (10)     BEAUTY (10)
- Star            - Laptop           - T-Shirt         - Perfume
- Heart           - Phone            - Shoes           - Lipstick
- Gift            - Tablet           - Jacket          - Brush
- Bookmark        - Camera           - Hat             - Mirror
- Bag             - Headphones       - Pants           - Scissors
- Cube            - Watch            - Dress           - Bottle
- Flask           - Desktop          - Socks           - Soap
- Leaf            - TV               - Gloves          - Comb
- Pizza           - Gamepad          - Belt            - Nail
- Paw             - Battery          - Sunglasses      - Mask

BRAND (10)        MUSICAL (10)       TRANSPORT (10)    FITNESS (10)
- Apple           - Guitar           - Car             - Dumbbell
- Google          - Piano            - Bike            - Yoga Mat
- Microsoft       - Drum             - Motorcycle      - Running
- Samsung         - Saxophone        - Airplane        - Exercise Bike
- Sony            - Violin           - Boat            - Treadmill
- Nike            - Microphone       - Train           - Basketball
- Adidas          - Speaker          - Bus             - Football
- Intel           - Amplifier        - Scooter         - Tennis Racket
- NVIDIA          - Tuner            - Skateboard      - Skates
- Canon           - Metronome        - Helmet          - Stopwatch
```

## Navigation Structure

```
RootLayout (app/_layout.tsx)
├─ Stack Navigator
│  ├─ (tabs) - TabLayout
│  │  └─ Tabs Navigator
│  │     ├─ Screen: index (Assets)
│  │     ├─ Screen: dummy (Center Button)
│  │     └─ Screen: my (Settings)
│  │
│  ├─ add-asset - Modal Screen
│  │  └─ AddAssetModal Component
│  │
│  └─ modal - Original Modal
│
└─ StatusBar (auto style)
```

## Color Palette

```
Primary Blues
├─ Dark Blue: #0D47A1 (Header background)
├─ Medium Blue: #1976D2 (Buttons, links)
└─ Light Blue: #E3F2FD (Badge background)

Greens (Asset Cards)
├─ Light Green: #E8F5E9 (Card background)
├─ Medium Green: #2E7D32 (Text)
└─ Dark Green: #1B5E20 (Card accent)

Neutrals
├─ White: #FFFFFF (Card background)
├─ Light Gray: #F9FAFB (Screen background)
├─ Medium Gray: #CCCCCC (Border, inactive)
└─ Dark Gray: #333333 (Text)

Darks
├─ Modal Dark: #1A1A1A (Modal background)
├─ Dark Input: #2A2A2A (Form inputs)
└─ Dark Border: #333333 (Separators)

Danger
├─ Red: #D32F2F (Delete/danger)
└─ Light Red: #FFE0E0 (Danger button background)
```

## Key Metrics

```
Typography
├─ Header Title: 28px, Bold (700)
├─ Section Title: 16px, Semibold (600)
├─ Body Text: 14px, Normal (400)
└─ Small Text: 12px, Medium (500)

Spacing
├─ Section Padding: 16px
├─ Component Gap: 12px
├─ Card Padding: 12px
└─ Border Radius: 6-12px

Shadows
├─ Light: 0.1 opacity, 2-4px radius
├─ Medium: 0.25 opacity, 4px radius
└─ Dark: 0.5 opacity, 8px radius

Tab Bar
├─ Height: 64px
├─ Padding: 8px top/bottom
├─ Label Size: 11px
└─ Icon Size: 24px

Grid
├─ Columns: 2
├─ Item Width: 50%
├─ Margin: 4px
└─ Aspect Ratio: 1:1
```

---

This visual guide helps understand the complete architecture, data flow, and component structure of MyAssetly.
