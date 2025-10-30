import { IconConfig, IconCategory } from '../types';

/**
 * Icon categories
 */
export const ICON_CATEGORIES: IconCategory[] = [
  'Basic',
  'Digital',
  'Clothing',
  'Beauty',
  'Brand',
  'Musical',
  'Transport',
  'Fitness',
];

/**
 * Icon configuration database
 */
export const ICON_DATABASE: IconConfig[] = [
  // Basic Icons
  { id: 'basic-star', name: 'Star', category: 'Basic', iconName: 'star', iconSet: 'Ionicons' },
  { id: 'basic-heart', name: 'Heart', category: 'Basic', iconName: 'heart', iconSet: 'Ionicons' },
  { id: 'basic-gift', name: 'Gift', category: 'Basic', iconName: 'gift', iconSet: 'Ionicons' },
  { id: 'basic-bookmark', name: 'Bookmark', category: 'Basic', iconName: 'bookmark', iconSet: 'Ionicons' },
  { id: 'basic-bag', name: 'Bag', category: 'Basic', iconName: 'bag', iconSet: 'Ionicons' },
  { id: 'basic-cube', name: 'Cube', category: 'Basic', iconName: 'cube', iconSet: 'Ionicons' },
  { id: 'basic-flask', name: 'Flask', category: 'Basic', iconName: 'flask', iconSet: 'Ionicons' },
  { id: 'basic-leaf', name: 'Leaf', category: 'Basic', iconName: 'leaf', iconSet: 'Ionicons' },
  { id: 'basic-pizza', name: 'Pizza', category: 'Basic', iconName: 'pizza', iconSet: 'Ionicons' },
  { id: 'basic-paw', name: 'Paw', category: 'Basic', iconName: 'paw', iconSet: 'Ionicons' },

  // Digital - Electronics & Gadgets
  { id: 'digital-laptop', name: 'Laptop', category: 'Digital', iconName: 'laptop', iconSet: 'Ionicons' },
  { id: 'digital-phone', name: 'Phone', category: 'Digital', iconName: 'phone-portrait', iconSet: 'Ionicons' },
  { id: 'digital-tablet', name: 'Tablet', category: 'Digital', iconName: 'tablet-landscape', iconSet: 'Ionicons' },
  { id: 'digital-camera', name: 'Camera', category: 'Digital', iconName: 'camera', iconSet: 'Ionicons' },
  { id: 'digital-headphones', name: 'Headphones', category: 'Digital', iconName: 'headset', iconSet: 'Ionicons' },
  { id: 'digital-watch', name: 'Watch', category: 'Digital', iconName: 'watch', iconSet: 'Ionicons' },
  { id: 'digital-desktop', name: 'Desktop', category: 'Digital', iconName: 'desktop', iconSet: 'Ionicons' },
  { id: 'digital-tv', name: 'TV', category: 'Digital', iconName: 'tv', iconSet: 'Ionicons' },
  { id: 'digital-gamepad', name: 'Gamepad', category: 'Digital', iconName: 'game-controller', iconSet: 'Ionicons' },
  { id: 'digital-battery', name: 'Battery', category: 'Digital', iconName: 'battery-half', iconSet: 'Ionicons' },

  // Clothing
  { id: 'clothing-shirt', name: 'T-Shirt', category: 'Clothing', iconName: 'shirt', iconSet: 'Ionicons' },
  { id: 'clothing-shoes', name: 'Shoes', category: 'Clothing', iconName: 'footsteps', iconSet: 'Ionicons' },
  { id: 'clothing-jacket', name: 'Jacket', category: 'Clothing', iconName: 'bag', iconSet: 'Ionicons' },
  { id: 'clothing-hat', name: 'Hat', category: 'Clothing', iconName: 'aperture', iconSet: 'Ionicons' },
  { id: 'clothing-pants', name: 'Pants', category: 'Clothing', iconName: 'layers', iconSet: 'Ionicons' },
  { id: 'clothing-dress', name: 'Dress', category: 'Clothing', iconName: 'person', iconSet: 'Ionicons' },
  { id: 'clothing-socks', name: 'Socks', category: 'Clothing', iconName: 'flame', iconSet: 'Ionicons' },
  { id: 'clothing-gloves', name: 'Gloves', category: 'Clothing', iconName: 'thumbs-up', iconSet: 'Ionicons' },
  { id: 'clothing-belt', name: 'Belt', category: 'Clothing', iconName: 'radio-button-on', iconSet: 'Ionicons' },
  { id: 'clothing-sunglasses', name: 'Sunglasses', category: 'Clothing', iconName: 'eye', iconSet: 'Ionicons' },

  // Beauty
  { id: 'beauty-perfume', name: 'Perfume', category: 'Beauty', iconName: 'flask', iconSet: 'Ionicons' },
  { id: 'beauty-lipstick', name: 'Lipstick', category: 'Beauty', iconName: 'heart', iconSet: 'Ionicons' },
  { id: 'beauty-brush', name: 'Brush', category: 'Beauty', iconName: 'brush', iconSet: 'Ionicons' },
  { id: 'beauty-mirror', name: 'Mirror', category: 'Beauty', iconName: 'search', iconSet: 'Ionicons' },
  { id: 'beauty-scissors', name: 'Scissors', category: 'Beauty', iconName: 'cut', iconSet: 'Ionicons' },
  { id: 'beauty-bottle', name: 'Bottle', category: 'Beauty', iconName: 'water', iconSet: 'Ionicons' },
  { id: 'beauty-soap', name: 'Soap', category: 'Beauty', iconName: 'water-outline', iconSet: 'Ionicons' },
  { id: 'beauty-comb', name: 'Comb', category: 'Beauty', iconName: 'list', iconSet: 'Ionicons' },
  { id: 'beauty-nail', name: 'Nail', category: 'Beauty', iconName: 'flower', iconSet: 'Ionicons' },
  { id: 'beauty-mask', name: 'Mask', category: 'Beauty', iconName: 'eye', iconSet: 'Ionicons' },

  // Brand
  { id: 'brand-apple', name: 'Apple', category: 'Brand', iconName: 'logo-apple', iconSet: 'Ionicons' },
  { id: 'brand-google', name: 'Google', category: 'Brand', iconName: 'logo-google', iconSet: 'Ionicons' },
  { id: 'brand-microsoft', name: 'Microsoft', category: 'Brand', iconName: 'logo-windows', iconSet: 'Ionicons' },
  { id: 'brand-samsung', name: 'Samsung', category: 'Brand', iconName: 'phone-portrait', iconSet: 'Ionicons' },
  { id: 'brand-sony', name: 'Sony', category: 'Brand', iconName: 'headset', iconSet: 'Ionicons' },
  { id: 'brand-nike', name: 'Nike', category: 'Brand', iconName: 'settings', iconSet: 'Ionicons' },
  { id: 'brand-adidas', name: 'Adidas', category: 'Brand', iconName: 'shirt', iconSet: 'Ionicons' },
  { id: 'brand-intel', name: 'Intel', category: 'Brand', iconName: 'cube', iconSet: 'Ionicons' },
  { id: 'brand-nvidia', name: 'NVIDIA', category: 'Brand', iconName: 'game-controller', iconSet: 'Ionicons' },
  { id: 'brand-canon', name: 'Canon', category: 'Brand', iconName: 'camera', iconSet: 'Ionicons' },

  // Musical
  { id: 'musical-guitar', name: 'Guitar', category: 'Musical', iconName: 'musical-note', iconSet: 'Ionicons' },
  { id: 'musical-piano', name: 'Piano', category: 'Musical', iconName: 'musical-notes', iconSet: 'Ionicons' },
  { id: 'musical-drum', name: 'Drum', category: 'Musical', iconName: 'disc', iconSet: 'Ionicons' },
  { id: 'musical-saxophone', name: 'Saxophone', category: 'Musical', iconName: 'musical-note', iconSet: 'Ionicons' },
  { id: 'musical-violin', name: 'Violin', category: 'Musical', iconName: 'volume-high', iconSet: 'Ionicons' },
  { id: 'musical-microphone', name: 'Microphone', category: 'Musical', iconName: 'megaphone', iconSet: 'Ionicons' },
  { id: 'musical-speaker', name: 'Speaker', category: 'Musical', iconName: 'volume-high', iconSet: 'Ionicons' },
  { id: 'musical-amplifier', name: 'Amplifier', category: 'Musical', iconName: 'volume-low', iconSet: 'Ionicons' },
  { id: 'musical-tuner', name: 'Tuner', category: 'Musical', iconName: 'settings', iconSet: 'Ionicons' },
  { id: 'musical-metronome', name: 'Metronome', category: 'Musical', iconName: 'timer', iconSet: 'Ionicons' },

  // Transport
  { id: 'transport-car', name: 'Car', category: 'Transport', iconName: 'car', iconSet: 'Ionicons' },
  { id: 'transport-bike', name: 'Bike', category: 'Transport', iconName: 'bicycle', iconSet: 'Ionicons' },
  { id: 'transport-motorcycle', name: 'Motorcycle', category: 'Transport', iconName: 'car', iconSet: 'Ionicons' },
  { id: 'transport-plane', name: 'Airplane', category: 'Transport', iconName: 'airplane', iconSet: 'Ionicons' },
  { id: 'transport-boat', name: 'Boat', category: 'Transport', iconName: 'boat', iconSet: 'Ionicons' },
  { id: 'transport-train', name: 'Train', category: 'Transport', iconName: 'train', iconSet: 'Ionicons' },
  { id: 'transport-bus', name: 'Bus', category: 'Transport', iconName: 'bus', iconSet: 'Ionicons' },
  { id: 'transport-scooter', name: 'Scooter', category: 'Transport', iconName: 'flash', iconSet: 'Ionicons' },
  { id: 'transport-skateboard', name: 'Skateboard', category: 'Transport', iconName: 'disc', iconSet: 'Ionicons' },
  { id: 'transport-helmet', name: 'Helmet', category: 'Transport', iconName: 'shield', iconSet: 'Ionicons' },

  // Fitness
  { id: 'fitness-dumbbell', name: 'Dumbbell', category: 'Fitness', iconName: 'barbell-outline', iconSet: 'Ionicons' },
  { id: 'fitness-yoga', name: 'Yoga Mat', category: 'Fitness', iconName: 'body', iconSet: 'Ionicons' },
  { id: 'fitness-running', name: 'Running', category: 'Fitness', iconName: 'walk', iconSet: 'Ionicons' },
  { id: 'fitness-bike', name: 'Exercise Bike', category: 'Fitness', iconName: 'bicycle', iconSet: 'Ionicons' },
  { id: 'fitness-treadmill', name: 'Treadmill', category: 'Fitness', iconName: 'flash', iconSet: 'Ionicons' },
  { id: 'fitness-basketball', name: 'Basketball', category: 'Fitness', iconName: 'basketball', iconSet: 'Ionicons' },
  { id: 'fitness-football', name: 'Football', category: 'Fitness', iconName: 'football', iconSet: 'Ionicons' },
  { id: 'fitness-tennis', name: 'Tennis Racket', category: 'Fitness', iconName: 'game-controller', iconSet: 'Ionicons' },
  { id: 'fitness-skates', name: 'Skates', category: 'Fitness', iconName: 'accessibility', iconSet: 'Ionicons' },
  { id: 'fitness-stopwatch', name: 'Stopwatch', category: 'Fitness', iconName: 'timer', iconSet: 'Ionicons' },
];

/**
 * Get icons by category
 */
export function getIconsByCategory(category: IconCategory): IconConfig[] {
  return ICON_DATABASE.filter((icon) => icon.category === category);
}

/**
 * Get icon by ID
 */
export function getIconById(id: string): IconConfig | undefined {
  return ICON_DATABASE.find((icon) => icon.id === id);
}

/**
 * Get all icons
 */
export function getAllIcons(): IconConfig[] {
  return ICON_DATABASE;
}
