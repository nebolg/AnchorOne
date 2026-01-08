// Author: -GLOBENXCC-
// OS support: iOS, Android, Web
// Description: Theme store for dark/light mode and accent color management with persistence

import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appearance } from 'react-native';

const THEME_STORAGE_KEY = 'anchorone_theme';
const ACCENT_STORAGE_KEY = 'anchorone_accent';

export const ACCENT_COLORS = [
    { id: 'teal', name: 'Teal', color: '#14B8A6' },
    { id: 'blue', name: 'Ocean Blue', color: '#3B82F6' },
    { id: 'violet', name: 'Lavender', color: '#8B5CF6' },
    { id: 'rose', name: 'Rose', color: '#F43F5E' },
    { id: 'amber', name: 'Amber', color: '#F59E0B' },
    { id: 'emerald', name: 'Emerald', color: '#10B981' },
];

export const useThemeStore = create((set, get) => ({
    isDarkMode: false,
    isInitialized: false,
    accentColor: '#14B8A6',
    accentId: 'teal',

    initializeTheme: async () => {
        try {
            const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
            const savedAccent = await AsyncStorage.getItem(ACCENT_STORAGE_KEY);

            let isDark = false;
            if (savedTheme !== null) {
                isDark = savedTheme === 'dark';
            } else {
                const systemTheme = Appearance.getColorScheme();
                isDark = systemTheme === 'dark';
            }

            let accentColor = '#14B8A6';
            let accentId = 'teal';
            if (savedAccent) {
                const accent = ACCENT_COLORS.find(a => a.id === savedAccent);
                if (accent) {
                    accentColor = accent.color;
                    accentId = accent.id;
                }
            }

            set({ isDarkMode: isDark, isInitialized: true, accentColor, accentId });
        } catch (error) {
            console.log('Failed to load theme preference:', error);
            set({ isInitialized: true });
        }
    },

    toggleTheme: async () => {
        const { isDarkMode } = get();
        const newMode = !isDarkMode;
        set({ isDarkMode: newMode });
        try {
            await AsyncStorage.setItem(THEME_STORAGE_KEY, newMode ? 'dark' : 'light');
        } catch (error) {
            console.log('Failed to save theme preference:', error);
        }
    },

    setTheme: async (isDark) => {
        set({ isDarkMode: isDark });
        try {
            await AsyncStorage.setItem(THEME_STORAGE_KEY, isDark ? 'dark' : 'light');
        } catch (error) {
            console.log('Failed to save theme preference:', error);
        }
    },

    setAccentColor: async (accentId) => {
        const accent = ACCENT_COLORS.find(a => a.id === accentId);
        if (!accent) return;

        set({ accentColor: accent.color, accentId: accent.id });
        try {
            await AsyncStorage.setItem(ACCENT_STORAGE_KEY, accentId);
        } catch (error) {
            console.log('Failed to save accent color:', error);
        }
    },
}));

export default useThemeStore;

// --- End of themeStore.js ---

