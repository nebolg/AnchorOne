// Author: -GLOBENXCC-
// OS support: iOS, Android, Web
// Description: Root navigator with onboarding and main app stacks

import React, { useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MainTabs } from './MainTabs';
import {
    WelcomeScreen,
    AddictionSelectScreen,
    PrivacyScreen,
    LocationScreen,
    IntentScreen,
    StartDateScreen,
    SupportScreen,
    MessagesScreen,
    BreathingScreen,
    CommentsScreen,
    UserProfileScreen,
    EditProfileScreen,
    JournalHistoryScreen,
    DistractionScreen,
    SlipAnalyticsScreen,
    AccountScreen,
    LoginScreen,
    RegisterScreen,
    HealthTimelineScreen,
    AnalyticsDashboardScreen,
    TriggerProfileScreen,
    ChallengesScreen,
    AchievementsScreen,
    CopingToolkitScreen,
    NotificationSettingsScreen,
    WeeklyProgressScreen,
    AccessibilitySettingsScreen,
    SuccessStoriesScreen,
    GuidedProgramsScreen,
    LiveSupportScreen,
    FeedbackScreen,
    LandingScreen,
    DonateScreen,
    PrivacyPolicyScreen,
    AboutScreen,
} from '../screens';
import { useUserStore } from '../store';

const Stack = createNativeStackNavigator();
const isWeb = Platform.OS === 'web';

const OnboardingStack = () => (
    <Stack.Navigator
        screenOptions={{
            headerShown: false,
            animation: 'slide_from_right',
        }}
    >
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="AddictionSelect" component={AddictionSelectScreen} />
        <Stack.Screen name="Privacy" component={PrivacyScreen} />
        <Stack.Screen name="Location" component={LocationScreen} />
        <Stack.Screen name="Intent" component={IntentScreen} />
        <Stack.Screen name="StartDate" component={StartDateScreen} />
    </Stack.Navigator>
);

export const RootNavigator = () => {
    const { hasCompletedOnboarding, syncProfile } = useUserStore();
    const navigationRef = useRef();
    const routeNameRef = useRef();

    useEffect(() => {
        if (hasCompletedOnboarding) {
            syncProfile();
        }
    }, [hasCompletedOnboarding]);

    const onNavigationReady = () => {
        routeNameRef.current = navigationRef.current?.getCurrentRoute()?.name;
    };

    const onNavigationStateChange = async () => {
        const previousRouteName = routeNameRef.current;
        const currentRouteName = navigationRef.current?.getCurrentRoute()?.name;

        if (previousRouteName !== currentRouteName && currentRouteName) {
            // Track screen view
            const { analytics } = await import('../services/analytics');
            analytics.trackScreen(currentRouteName);
        }

        routeNameRef.current = currentRouteName;
    };

    return (
        <NavigationContainer
            ref={navigationRef}
            onReady={onNavigationReady}
            onStateChange={onNavigationStateChange}
        >
            <Stack.Navigator
                screenOptions={{
                    headerShown: false,
                }}
            >
                {!hasCompletedOnboarding ? (
                    <Stack.Screen name="Onboarding" component={OnboardingStack} />
                ) : (
                    <>
                        <Stack.Screen name="Main" component={MainTabs} />
                        <Stack.Screen
                            name="Support"
                            component={SupportScreen}
                            options={{
                                presentation: 'modal',
                                animation: 'slide_from_bottom',
                            }}
                        />
                        <Stack.Screen
                            name="Messages"
                            component={MessagesScreen}
                            options={{
                                presentation: 'modal',
                                animation: 'slide_from_right',
                            }}
                        />
                        <Stack.Screen
                            name="Breathing"
                            component={BreathingScreen}
                            options={{
                                presentation: 'modal',
                                animation: 'fade',
                            }}
                        />
                        <Stack.Screen
                            name="JournalHistory"
                            component={JournalHistoryScreen}
                            options={{
                                title: 'Reflections',
                                animation: 'slide_from_right',
                            }}
                        />
                        <Stack.Screen
                            name="Comments"
                            component={CommentsScreen}
                            options={{
                                title: 'Comments',
                                animation: 'slide_from_right',
                            }}
                        />
                        <Stack.Screen
                            name="UserProfile"
                            component={UserProfileScreen}
                            options={{
                                headerShown: false,
                                animation: 'slide_from_right',
                            }}
                        />
                        <Stack.Screen
                            name="EditProfile"
                            component={EditProfileScreen}
                            options={{
                                headerShown: false,
                                animation: 'slide_from_bottom',
                            }}
                        />
                        <Stack.Screen
                            name="AddictionSelect"
                            component={AddictionSelectScreen}
                            options={{
                                title: 'Add Addiction',
                                animation: 'slide_from_bottom',
                            }}
                        />
                        <Stack.Screen
                            name="Privacy"
                            component={PrivacyScreen}
                            options={{
                                title: 'Privacy Policies',
                                animation: 'slide_from_right',
                            }}
                        />
                        <Stack.Screen
                            name="Intent"
                            component={IntentScreen}
                            options={{
                                title: 'My Intent',
                                animation: 'slide_from_right',
                            }}
                        />
                        <Stack.Screen
                            name="StartDate"
                            component={StartDateScreen}
                            options={{
                                title: 'Start Date',
                                animation: 'slide_from_right',
                            }}
                        />
                        <Stack.Screen
                            name="Distraction"
                            component={DistractionScreen}
                            options={{
                                headerShown: false,
                                presentation: 'modal',
                                animation: 'slide_from_bottom',
                            }}
                        />
                        <Stack.Screen
                            name="SlipAnalytics"
                            component={SlipAnalyticsScreen}
                            options={{
                                headerShown: false,
                                animation: 'slide_from_right',
                            }}
                        />
                        <Stack.Screen
                            name="Account"
                            component={AccountScreen}
                            options={{
                                headerShown: false,
                                animation: 'slide_from_right',
                            }}
                        />
                        <Stack.Screen
                            name="HealthTimeline"
                            component={HealthTimelineScreen}
                            options={{
                                headerShown: false,
                                animation: 'slide_from_right',
                            }}
                        />
                        <Stack.Screen
                            name="AnalyticsDashboard"
                            component={AnalyticsDashboardScreen}
                            options={{
                                headerShown: false,
                                animation: 'slide_from_right',
                            }}
                        />
                        <Stack.Screen
                            name="TriggerProfile"
                            component={TriggerProfileScreen}
                            options={{
                                headerShown: false,
                                animation: 'slide_from_right',
                            }}
                        />
                        <Stack.Screen
                            name="Challenges"
                            component={ChallengesScreen}
                            options={{
                                headerShown: false,
                                animation: 'slide_from_right',
                            }}
                        />
                        <Stack.Screen
                            name="Achievements"
                            component={AchievementsScreen}
                            options={{
                                headerShown: false,
                                animation: 'slide_from_right',
                            }}
                        />
                        <Stack.Screen
                            name="CopingToolkit"
                            component={CopingToolkitScreen}
                            options={{
                                headerShown: false,
                                animation: 'slide_from_right',
                            }}
                        />
                        <Stack.Screen
                            name="NotificationSettings"
                            component={NotificationSettingsScreen}
                            options={{
                                headerShown: false,
                                animation: 'slide_from_right',
                            }}
                        />
                        <Stack.Screen
                            name="WeeklyProgress"
                            component={WeeklyProgressScreen}
                            options={{
                                headerShown: false,
                                animation: 'slide_from_right',
                            }}
                        />
                        <Stack.Screen
                            name="AccessibilitySettings"
                            component={AccessibilitySettingsScreen}
                            options={{
                                headerShown: false,
                                animation: 'slide_from_right',
                            }}
                        />
                        <Stack.Screen
                            name="SuccessStories"
                            component={SuccessStoriesScreen}
                            options={{
                                headerShown: false,
                                animation: 'slide_from_right',
                            }}
                        />
                        <Stack.Screen
                            name="GuidedPrograms"
                            component={GuidedProgramsScreen}
                            options={{
                                headerShown: false,
                                animation: 'slide_from_right',
                            }}
                        />
                        <Stack.Screen
                            name="LiveSupport"
                            component={LiveSupportScreen}
                            options={{
                                headerShown: false,
                                animation: 'slide_from_right',
                            }}
                        />
                        <Stack.Screen
                            name="Feedback"
                            component={FeedbackScreen}
                            options={{
                                headerShown: false,
                                animation: 'slide_from_right',
                            }}
                        />
                        {/* Web-specific routes */}
                        {isWeb && (
                            <>
                                <Stack.Screen
                                    name="WebLanding"
                                    component={LandingScreen}
                                    options={{
                                        headerShown: false,
                                    }}
                                />
                                <Stack.Screen
                                    name="WebDonate"
                                    component={DonateScreen}
                                    options={{
                                        headerShown: false,
                                    }}
                                />
                                <Stack.Screen
                                    name="WebPrivacy"
                                    component={PrivacyPolicyScreen}
                                    options={{
                                        headerShown: false,
                                    }}
                                />
                                <Stack.Screen
                                    name="WebAbout"
                                    component={AboutScreen}
                                    options={{
                                        headerShown: false,
                                    }}
                                />
                            </>
                        )}
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default RootNavigator;

// --- End of RootNavigator.js ---
