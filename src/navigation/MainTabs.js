// Author: -GLOBENXCC-
// OS support: iOS, Android, Web
// Description: Main tab navigator with bottom navigation bar

import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import {
    HomeScreen,
    ProgressScreen,
    CommunityScreen,
    InsightsScreen,
    ProfileScreen,
} from '../screens';
import { useColors, colors, spacing, typography } from '../theme';

const Tab = createBottomTabNavigator();

const TabIcon = ({ name, label, focused, colors }) => (
    <View style={styles.tabIconContainer}>
        <Ionicons
            name={focused ? name : `${name}-outline`}
            size={24}
            color={focused ? colors.primary.teal : colors.text.secondary}
            style={focused ? styles.tabIconFocused : styles.tabIcon}
        />
        <Text style={[styles.tabLabel, { color: focused ? colors.primary.teal : colors.text.muted }]}>
            {label}
        </Text>
    </View>
);

export const MainTabs = () => {
    const colors = useColors();

    const tabBarStyle = {
        position: 'absolute',
        backgroundColor: colors.background.card,
        borderTopWidth: 0,
        height: 85,
        paddingTop: spacing.xs,
        paddingBottom: spacing.sm,
        shadowColor: colors.shadow.color,
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 8,
    };

    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarStyle: tabBarStyle,
                tabBarShowLabel: false,
            }}
        >
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <TabIcon name="home" label="Home" focused={focused} colors={colors} />
                    ),
                }}
            />
            <Tab.Screen
                name="Progress"
                component={ProgressScreen}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <TabIcon name="stats-chart" label="Progress" focused={focused} colors={colors} />
                    ),
                }}
            />
            <Tab.Screen
                name="Community"
                component={CommunityScreen}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <TabIcon name="people" label="Community" focused={focused} colors={colors} />
                    ),
                }}
            />
            <Tab.Screen
                name="Insights"
                component={InsightsScreen}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <TabIcon name="bulb" label="Insights" focused={focused} colors={colors} />
                    ),
                }}
            />
            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <TabIcon name="settings" label="Settings" focused={focused} colors={colors} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
};

const styles = StyleSheet.create({
    tabBar: {
        position: 'absolute',
        backgroundColor: colors.background.card,
        borderTopWidth: 0,
        height: 85, // Increased height
        paddingTop: spacing.xs,
        paddingBottom: spacing.sm, // Add bottom padding for better centering
        shadowColor: colors.shadow.color,
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 8,
    },
    tabIconContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 80, // Fixed width to prevent shifting
    },
    tabIcon: {
        fontSize: 24,
        opacity: 0.5,
    },
    tabIconFocused: {
        opacity: 1,
    },
    tabLabel: {
        fontSize: 10, // Slightly smaller to prevent cut-off
        color: colors.text.muted,
        marginTop: 4,
        textAlign: 'center',
    },
    tabLabelFocused: {
        color: colors.primary.teal,
        fontWeight: typography.weight.medium,
    },
});

export default MainTabs;

// --- End of MainTabs.js ---
