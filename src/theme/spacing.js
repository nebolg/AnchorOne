// Author: -GLOBENXCC-
// OS support: iOS, Android, Web
// Description: Spacing system based on 4px grid for consistent layouts

export const spacing = {
    // Base spacing values (multiplied by 4)
    0: 0,
    1: 4,
    2: 8,
    3: 12,
    4: 16,
    5: 20,
    6: 24,
    8: 32,
    10: 40,
    12: 48,
    16: 64,
    20: 80,

    // Semantic spacing
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    '2xl': 48,

    // Component-specific
    screenPadding: 20,
    cardPadding: 16,
    cardMargin: 12,
    buttonPadding: 16,
    inputPadding: 12,
    iconSize: {
        sm: 16,
        md: 24,
        lg: 32,
        xl: 48,
    },

    // Border radius
    radius: {
        none: 0,
        sm: 4,
        md: 8,
        lg: 12,
        xl: 16,
        '2xl': 24,
        full: 9999,
    },
};

export default spacing;

// --- End of spacing.js ---
