// Author: -GLOBENXCC-
// OS support: iOS, Android, Web
// Description: Main App entry point for AnchorOne recovery app

import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { RootNavigator } from './src/navigation';
import { useThemeStore, useUserStore } from './src/store';
import { analytics } from './src/services/analytics';

export default function App() {
    const { isDarkMode, initializeTheme } = useThemeStore();
    const userId = useUserStore(state => state.userId);

    useEffect(() => {
        initializeTheme();
        // Initialize analytics with user ID
        analytics.init(userId);
    }, [userId]);

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaProvider>
                <StatusBar style={isDarkMode ? 'light' : 'dark'} />
                <RootNavigator />
            </SafeAreaProvider>
        </GestureHandlerRootView>
    );
}

// --- End of App.js ---
