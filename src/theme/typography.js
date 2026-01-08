// Author: -GLOBENXCC-
// OS support: iOS, Android, Web
// Description: Typography system with font sizes and weights for AnchorOne

import { Platform } from 'react-native';

const fontFamily = Platform.select({
    ios: 'System',
    android: 'Roboto',
    default: 'System',
});

export const typography = {
    fontFamily,

    // Font sizes
    size: {
        xs: 12,
        sm: 14,
        base: 16,
        lg: 18,
        xl: 20,
        '2xl': 24,
        '3xl': 30,
        '4xl': 36,
    },

    // Line heights
    lineHeight: {
        tight: 1.2,
        normal: 1.5,
        relaxed: 1.75,
    },

    // Font weights
    weight: {
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
    },

    // Predefined text styles
    styles: {
        hero: {
            fontSize: 36,
            fontWeight: '700',
            lineHeight: 44,
        },
        heading: {
            fontSize: 24,
            fontWeight: '700',
            lineHeight: 32,
        },
        subheading: {
            fontSize: 20,
            fontWeight: '600',
            lineHeight: 28,
        },
        body: {
            fontSize: 16,
            fontWeight: '400',
            lineHeight: 24,
        },
        bodyBold: {
            fontSize: 16,
            fontWeight: '600',
            lineHeight: 24,
        },
        caption: {
            fontSize: 14,
            fontWeight: '400',
            lineHeight: 20,
        },
        small: {
            fontSize: 12,
            fontWeight: '400',
            lineHeight: 16,
        },
        affirmation: {
            fontSize: 20,
            fontWeight: '500',
            fontStyle: 'italic',
            lineHeight: 28,
        },
        counter: {
            fontSize: 48,
            fontWeight: '700',
            lineHeight: 56,
        },
    },
};

export default typography;

// --- End of typography.js ---
