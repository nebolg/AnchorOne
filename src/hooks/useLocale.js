// Author: -GLOBENXCC-
// OS support: iOS, Android, Web
// Description: Hook to detect and manage user locale for localized resources

import { useState, useEffect } from 'react';
import { Platform, NativeModules } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LOCALE_OVERRIDE_KEY = 'user_locale_override';

// Get device locale
const getDeviceLocale = () => {
    let locale = 'US'; // Default fallback

    try {
        if (Platform.OS === 'ios') {
            locale = NativeModules.SettingsManager?.settings?.AppleLocale ||
                NativeModules.SettingsManager?.settings?.AppleLanguages?.[0] ||
                'en_US';
        } else if (Platform.OS === 'android') {
            locale = NativeModules.I18nManager?.localeIdentifier || 'en_US';
        } else {
            // Web
            locale = navigator?.language || 'en-US';
        }
    } catch (e) {
        console.log('[useLocale] Could not detect locale:', e);
    }

    // Extract country code from locale string (e.g., "en_US" -> "US", "en-GB" -> "GB")
    const parts = locale.replace('-', '_').split('_');
    return parts.length > 1 ? parts[1].toUpperCase() : 'US';
};

export const useLocale = () => {
    const [countryCode, setCountryCode] = useState(getDeviceLocale());
    const [isOverridden, setIsOverridden] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadSavedLocale();
    }, []);

    const loadSavedLocale = async () => {
        try {
            const savedLocale = await AsyncStorage.getItem(LOCALE_OVERRIDE_KEY);
            if (savedLocale) {
                setCountryCode(savedLocale);
                setIsOverridden(true);
            }
        } catch (error) {
            console.log('[useLocale] Error loading saved locale:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const setLocaleOverride = async (code) => {
        try {
            if (code) {
                await AsyncStorage.setItem(LOCALE_OVERRIDE_KEY, code.toUpperCase());
                setCountryCode(code.toUpperCase());
                setIsOverridden(true);
            } else {
                await AsyncStorage.removeItem(LOCALE_OVERRIDE_KEY);
                setCountryCode(getDeviceLocale());
                setIsOverridden(false);
            }
        } catch (error) {
            console.log('[useLocale] Error saving locale:', error);
        }
    };

    const resetToDeviceLocale = async () => {
        await setLocaleOverride(null);
    };

    return {
        countryCode,
        isOverridden,
        isLoading,
        setLocaleOverride,
        resetToDeviceLocale,
        deviceLocale: getDeviceLocale(),
    };
};

export default useLocale;

// --- End of useLocale.js ---
