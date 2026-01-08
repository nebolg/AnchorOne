// Author: -GLOBENXCC-
// OS support: iOS, Android, Web
// Description: Theme color palette with light and dark modes for AnchorOne recovery app

// Light mode colors (original cozy palette)
export const lightColors = {
    // Primary gradient colors
    primary: {
        teal: '#14B8A6',
        blue: '#3B82F6',
        violet: '#8B5CF6',
    },

    // Gradient definitions
    gradients: {
        main: ['#14B8A6', '#3B82F6', '#8B5CF6'],
        soft: ['#5EEAD4', '#93C5FD', '#C4B5FD'],
        warm: ['#14B8A6', '#06B6D4', '#3B82F6'],
    },

    // Background colors
    background: {
        primary: '#F8FAFC',
        secondary: '#F1F5F9',
        card: '#FFFFFF',
    },

    // Text colors
    text: {
        primary: '#1E293B',
        secondary: '#64748B',
        muted: '#94A3B8',
        inverse: '#FFFFFF',
    },

    // Status colors
    status: {
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        info: '#3B82F6',
    },

    // Addiction category colors
    addiction: {
        alcohol: '#F97316',
        cigarettes: '#6B7280',
        drugs: '#EF4444',
        porn: '#EC4899',
        gambling: '#8B5CF6',
        gaming: '#10B981',
        socialMedia: '#3B82F6',
        sugar: '#F59E0B',
        custom: '#14B8A6',
    },

    // Mood colors
    mood: {
        1: '#EF4444',
        2: '#F97316',
        3: '#F59E0B',
        4: '#84CC16',
        5: '#10B981',
    },

    // Reaction colors
    reaction: {
        hearYou: '#EC4899',
        stayStrong: '#F97316',
        proud: '#10B981',
    },

    // Shadow
    shadow: {
        color: '#000000',
        opacity: 0.08,
    },
};

// Dark mode colors (cozy dark palette)
export const darkColors = {
    // Primary gradient colors (unchanged for brand consistency)
    primary: {
        teal: '#14B8A6',
        blue: '#3B82F6',
        violet: '#8B5CF6',
    },

    // Gradient definitions
    gradients: {
        main: ['#14B8A6', '#3B82F6', '#8B5CF6'],
        soft: ['#0D9488', '#2563EB', '#7C3AED'],
        warm: ['#14B8A6', '#06B6D4', '#3B82F6'],
    },

    // Background colors (deep navy/charcoal for cozy feel)
    background: {
        primary: '#0F172A',
        secondary: '#1E293B',
        card: '#1E293B',
    },

    // Text colors (light for readability)
    text: {
        primary: '#F1F5F9',
        secondary: '#CBD5E1',
        muted: '#64748B',
        inverse: '#0F172A',
    },

    // Status colors (slightly brighter for dark mode visibility)
    status: {
        success: '#10B981',
        warning: '#FBBF24',
        error: '#F87171',
        info: '#60A5FA',
    },

    // Addiction category colors
    addiction: {
        alcohol: '#FB923C',
        cigarettes: '#9CA3AF',
        drugs: '#F87171',
        porn: '#F472B6',
        gambling: '#A78BFA',
        gaming: '#34D399',
        socialMedia: '#60A5FA',
        sugar: '#FBBF24',
        custom: '#2DD4BF',
    },

    // Mood colors
    mood: {
        1: '#F87171',
        2: '#FB923C',
        3: '#FBBF24',
        4: '#A3E635',
        5: '#34D399',
    },

    // Reaction colors
    reaction: {
        hearYou: '#F472B6',
        stayStrong: '#FB923C',
        proud: '#34D399',
    },

    // Shadow
    shadow: {
        color: '#000000',
        opacity: 0.3,
    },
};

// Get colors based on dark mode
export const getColors = (isDarkMode) => isDarkMode ? darkColors : lightColors;

// Default export (light mode for backwards compatibility)
export const colors = lightColors;

export default colors;

// --- End of colors.js ---
