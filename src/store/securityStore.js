// Author: -GLOBENXCC-
// OS support: iOS, Android, Web
// Description: Security store for biometric lock, panic mode, and auto-lock settings

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useSecurityStore = create(
    persist(
        (set, get) => ({
            biometricEnabled: false,
            panicModeEnabled: false,
            autoLockTimeout: 0,
            isLocked: false,
            panicModeType: 'calculator',
            lastActiveTime: null,

            setBiometricEnabled: (enabled) => set({ biometricEnabled: enabled }),

            setPanicModeEnabled: (enabled) => set({ panicModeEnabled: enabled }),

            setPanicModeType: (type) => set({ panicModeType: type }),

            setAutoLockTimeout: (minutes) => set({ autoLockTimeout: minutes }),

            lock: () => set({ isLocked: true }),

            unlock: () => set({ isLocked: false, lastActiveTime: Date.now() }),

            updateLastActiveTime: () => set({ lastActiveTime: Date.now() }),

            checkAutoLock: () => {
                const { autoLockTimeout, lastActiveTime, biometricEnabled } = get();
                if (!biometricEnabled || autoLockTimeout === 0 || !lastActiveTime) return false;

                const elapsed = Date.now() - lastActiveTime;
                const timeoutMs = autoLockTimeout * 60 * 1000;
                if (elapsed > timeoutMs) {
                    set({ isLocked: true });
                    return true;
                }
                return false;
            },

            reset: () => set({
                biometricEnabled: false,
                panicModeEnabled: false,
                autoLockTimeout: 0,
                isLocked: false,
                panicModeType: 'calculator',
                lastActiveTime: null,
            }),
        }),
        {
            name: 'anchorone-security',
            storage: createJSONStorage(() => AsyncStorage),
            partialize: (state) => ({
                biometricEnabled: state.biometricEnabled,
                panicModeEnabled: state.panicModeEnabled,
                autoLockTimeout: state.autoLockTimeout,
                panicModeType: state.panicModeType,
            }),
        }
    )
);

export default useSecurityStore;

// --- End of securityStore.js ---
