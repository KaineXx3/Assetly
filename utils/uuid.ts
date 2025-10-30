/**
 * Simple UUID v4 generator for React Native
 * This doesn't use the crypto module, making it compatible with React Native
 */
export function generateUUID(): string {
  const chars = '0123456789abcdef';
  let uuid = '';

  for (let i = 0; i < 36; i++) {
    if (i === 8 || i === 13 || i === 18 || i === 23) {
      uuid += '-';
    } else if (i === 14) {
      uuid += '4'; // version 4
    } else if (i === 19) {
      uuid += chars[(Math.random() * 4 | 0 | 0x8)];
    } else {
      uuid += chars[Math.floor(Math.random() * 16)];
    }
  }

  return uuid;
}
