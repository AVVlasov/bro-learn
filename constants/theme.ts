/**
 * BroLearn Theme - Геймифицированный дизайн для обучающего приложения
 */

import { Platform } from 'react-native';
import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';

// Основные цвета приложения
const primaryColor = '#6366F1'; // Indigo
const secondaryColor = '#10B981'; // Green
const accentColor = '#F59E0B'; // Amber
const errorColor = '#EF4444'; // Red

export const Colors = {
  light: {
    text: '#1F2937',
    textSecondary: '#6B7280',
    background: '#F9FAFB',
    surface: '#FFFFFF',
    card: '#FFFFFF',
    border: '#E5E7EB',
    primary: primaryColor,
    secondary: secondaryColor,
    accent: accentColor,
    error: errorColor,
    success: '#10B981',
    warning: '#F59E0B',
    info: '#3B82F6',
    tint: primaryColor,
    icon: '#6B7280',
    tabIconDefault: '#9CA3AF',
    tabIconSelected: primaryColor,
    xpBar: '#10B981',
    streakFire: '#F59E0B',
    levelBadge: '#8B5CF6',
  },
  dark: {
    text: '#F9FAFB',
    textSecondary: '#D1D5DB',
    background: '#111827',
    surface: '#1F2937',
    card: '#1F2937',
    border: '#374151',
    primary: '#818CF8',
    secondary: '#34D399',
    accent: '#FCD34D',
    error: '#F87171',
    success: '#34D399',
    warning: '#FCD34D',
    info: '#60A5FA',
    tint: '#818CF8',
    icon: '#D1D5DB',
    tabIconDefault: '#9CA3AF',
    tabIconSelected: '#818CF8',
    xpBar: '#34D399',
    streakFire: '#FCD34D',
    levelBadge: '#A78BFA',
  },
};

// React Native Paper темы
export const paperTheme = {
  light: {
    ...MD3LightTheme,
    colors: {
      ...MD3LightTheme.colors,
      primary: primaryColor,
      secondary: secondaryColor,
      error: errorColor,
      background: Colors.light.background,
      surface: Colors.light.surface,
      onSurface: Colors.light.text,
    },
  },
  dark: {
    ...MD3DarkTheme,
    colors: {
      ...MD3DarkTheme.colors,
      primary: Colors.dark.primary,
      secondary: Colors.dark.secondary,
      error: Colors.dark.error,
      background: Colors.dark.background,
      surface: Colors.dark.surface,
      onSurface: Colors.dark.text,
    },
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
