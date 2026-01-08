// Author: -GLOBENXCC-
// OS support: iOS, Android, Web
// Description: Store for accessibility settings and preferences

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const TEXT_SIZES = {
    small: { label: 'Small', scale: 0.85 },
    default: { label: 'Default', scale: 1.0 },
    large: { label: 'Large', scale: 1.15 },
    extraLarge: { label: 'Extra Large', scale: 1.3 },
};

export const FONT_WEIGHTS = {
    regular: { label: 'Regular', weight: '400' },
    medium: { label: 'Medium', weight: '500' },
    bold: { label: 'Bold', weight: '700' },
};

export const useAccessibilityStore = create(
    persist(
        (set, get) => ({
            textSize: 'default',
            fontWeight: 'regular',
            reduceMotion: false,
            highContrast: false,
            screenReaderOptimized: false,
            hapticFeedbackEnabled: true,
            boldText: false,
            largerTouchTargets: false,
            autoplayMedia: true,
            showAnimations: true,

            setTextSize: (size) => {
                if (TEXT_SIZES[size]) {
                    set({ textSize: size });
                }
            },

            setFontWeight: (weight) => {
                if (FONT_WEIGHTS[weight]) {
                    set({ fontWeight: weight });
                }
            },

            setReduceMotion: (enabled) => set({ reduceMotion: enabled, showAnimations: !enabled }),

            setHighContrast: (enabled) => set({ highContrast: enabled }),

            setScreenReaderOptimized: (enabled) => set({ screenReaderOptimized: enabled }),

            setHapticFeedbackEnabled: (enabled) => set({ hapticFeedbackEnabled: enabled }),

            setBoldText: (enabled) => set({ boldText: enabled }),

            setLargerTouchTargets: (enabled) => set({ largerTouchTargets: enabled }),

            setAutoplayMedia: (enabled) => set({ autoplayMedia: enabled }),

            setShowAnimations: (enabled) => set({ showAnimations: enabled }),

            getTextScale: () => TEXT_SIZES[get().textSize]?.scale || 1.0,

            getFontWeight: () => FONT_WEIGHTS[get().fontWeight]?.weight || '400',

            getTouchTargetMin: () => get().largerTouchTargets ? 56 : 44,

            getAnimationDuration: () => {
                const { reduceMotion, showAnimations } = get();
                if (reduceMotion || !showAnimations) return 0;
                return 300;
            },

            getScaledFontSize: (baseSize) => {
                const scale = get().getTextScale();
                return Math.round(baseSize * scale);
            },

            reset: () => set({
                textSize: 'default',
                fontWeight: 'regular',
                reduceMotion: false,
                highContrast: false,
                screenReaderOptimized: false,
                hapticFeedbackEnabled: true,
                boldText: false,
                largerTouchTargets: false,
                autoplayMedia: true,
                showAnimations: true,
            }),
        }),
        {
            name: 'anchorone-accessibility',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);

export default useAccessibilityStore;

// --- End of accessibilityStore.js ---
