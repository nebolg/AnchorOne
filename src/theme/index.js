// Author: -GLOBENXCC-
// OS support: iOS, Android, Web
// Description: Centralized theme export for AnchorOne app with dark mode support

import { useThemeStore } from '../store/themeStore';
import { useAccessibilityStore, TEXT_SIZES } from '../store/accessibilityStore';
import { lightColors, darkColors, getColors } from './colors';
import { typography as baseTypography } from './typography';
export { typography, default as Typography } from './typography';
export { spacing, default as Spacing } from './spacing';
export { lightColors, darkColors, getColors } from './colors';

// Hook to get current theme colors
export const useColors = () => {
    const isDarkMode = useThemeStore((state) => state.isDarkMode);
    const highContrast = useAccessibilityStore((state) => state.highContrast);
    const colors = getColors(isDarkMode);

    if (highContrast) {
        return {
            ...colors,
            text: {
                ...colors.text,
                primary: isDarkMode ? '#FFFFFF' : '#000000',
                secondary: isDarkMode ? '#E0E0E0' : '#333333',
            },
        };
    }
    return colors;
};

// Hook to get scaled typography based on accessibility settings
export const useAccessibleTypography = () => {
    const textSize = useAccessibilityStore((state) => state.textSize);
    const boldText = useAccessibilityStore((state) => state.boldText);
    const scale = TEXT_SIZES[textSize]?.scale || 1.0;

    const scaledSize = {};
    Object.keys(baseTypography.size).forEach(key => {
        scaledSize[key] = Math.round(baseTypography.size[key] * scale);
    });

    return {
        ...baseTypography,
        size: scaledSize,
        weight: boldText ? {
            ...baseTypography.weight,
            normal: '500',
            medium: '600',
            semibold: '700',
            bold: '800',
        } : baseTypography.weight,
    };
};

// Export static colors for backwards compatibility (light mode default)
export const colors = lightColors;
export { default as Colors } from './colors';

export const theme = {
    colors: lightColors,
    typography: require('./typography').default,
    spacing: require('./spacing').default,
};

export default theme;

// --- End of index.js ---
