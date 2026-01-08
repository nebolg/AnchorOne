// Author: -GLOBENXCC-
// OS support: iOS, Android, Web
// Description: Notification settings screen with toggle controls for each notification type

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Switch, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../components/common';
import { useColors, spacing, typography } from '../theme';
import { useNotificationStore, NOTIFICATION_TYPES } from '../store/notificationStore';
import notificationService from '../services/notificationService';

const NOTIFICATION_SETTINGS = [
    {
        type: NOTIFICATION_TYPES.DAILY_CHECKIN,
        title: 'Daily Check-in',
        description: 'Morning reminder to check in with yourself',
        icon: 'sunny',
        color: '#F59E0B',
        hasTime: true,
    },
    {
        type: NOTIFICATION_TYPES.MOOD_CHECKIN,
        title: 'Mood Check-ins',
        description: 'Periodic reminders to log your mood',
        icon: 'happy',
        color: '#8B5CF6',
    },
    {
        type: NOTIFICATION_TYPES.CHALLENGE_REMINDER,
        title: 'Challenge Reminders',
        description: 'Evening reminder to log challenge progress',
        icon: 'trophy',
        color: '#10B981',
        hasTime: true,
    },
    {
        type: NOTIFICATION_TYPES.MILESTONE,
        title: 'Milestone Celebrations',
        description: 'Notifications when you reach milestones',
        icon: 'star',
        color: '#F59E0B',
    },
    {
        type: NOTIFICATION_TYPES.WEEKLY_SUMMARY,
        title: 'Weekly Progress Summary',
        description: 'Weekly overview of your progress',
        icon: 'analytics',
        color: '#3B82F6',
    },
    {
        type: NOTIFICATION_TYPES.CRAVING_SUPPORT,
        title: 'Support Notifications',
        description: 'Helpful reminders during tough times',
        icon: 'heart',
        color: '#EC4899',
    },
    {
        type: NOTIFICATION_TYPES.COMMUNITY_ACTIVITY,
        title: 'Community Activity',
        description: 'Updates on comments and reactions',
        icon: 'people',
        color: '#6366F1',
    },
];

export const NotificationSettingsScreen = ({ navigation }) => {
    const colors = useColors();
    const {
        pushEnabled,
        permissionGranted,
        preferences,
        setPushEnabled,
        setPermissionGranted,
        setExpoPushToken,
        toggleNotificationType,
        updatePreference,
    } = useNotificationStore();

    const [isLoading, setIsLoading] = useState(false);

    const handleEnablePush = async () => {
        if (Platform.OS === 'web') {
            Alert.alert('Not Available', 'Push notifications are only available on mobile devices.');
            return;
        }

        setIsLoading(true);
        try {
            const token = await notificationService.registerForPushNotifications();
            if (token) {
                setExpoPushToken(token);
                setPermissionGranted(true);
                setPushEnabled(true);
                await scheduleDefaultNotifications();
            } else {
                Alert.alert(
                    'Permission Required',
                    'Please enable notifications in your device settings to receive reminders.',
                );
            }
        } catch (error) {
            console.error('Error enabling push:', error);
            Alert.alert('Error', 'Could not enable notifications. Please try again.');
        }
        setIsLoading(false);
    };

    const handleDisablePush = async () => {
        Alert.alert(
            'Disable Notifications?',
            'You will no longer receive reminders and updates.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Disable',
                    style: 'destructive',
                    onPress: async () => {
                        await notificationService.cancelAllNotifications();
                        setPushEnabled(false);
                    },
                },
            ]
        );
    };

    const scheduleDefaultNotifications = async () => {
        const prefs = preferences;

        if (prefs[NOTIFICATION_TYPES.DAILY_CHECKIN]?.enabled) {
            await notificationService.scheduleDailyCheckIn(prefs[NOTIFICATION_TYPES.DAILY_CHECKIN].time);
        }

        if (prefs[NOTIFICATION_TYPES.MOOD_CHECKIN]?.enabled) {
            await notificationService.scheduleMoodCheckIns(prefs[NOTIFICATION_TYPES.MOOD_CHECKIN].times);
        }

        if (prefs[NOTIFICATION_TYPES.CHALLENGE_REMINDER]?.enabled) {
            await notificationService.scheduleChallengeReminder(prefs[NOTIFICATION_TYPES.CHALLENGE_REMINDER].time);
        }

        if (prefs[NOTIFICATION_TYPES.WEEKLY_SUMMARY]?.enabled) {
            await notificationService.scheduleWeeklySummary(
                prefs[NOTIFICATION_TYPES.WEEKLY_SUMMARY].dayOfWeek,
                prefs[NOTIFICATION_TYPES.WEEKLY_SUMMARY].time
            );
        }
    };

    const handleToggle = async (type) => {
        toggleNotificationType(type);

        if (!pushEnabled) return;

        const newEnabled = !preferences[type]?.enabled;

        if (newEnabled) {
            switch (type) {
                case NOTIFICATION_TYPES.DAILY_CHECKIN:
                    await notificationService.scheduleDailyCheckIn(preferences[type].time);
                    break;
                case NOTIFICATION_TYPES.CHALLENGE_REMINDER:
                    await notificationService.scheduleChallengeReminder(preferences[type].time);
                    break;
                case NOTIFICATION_TYPES.WEEKLY_SUMMARY:
                    await notificationService.scheduleWeeklySummary(
                        preferences[type].dayOfWeek,
                        preferences[type].time
                    );
                    break;
            }
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
            <SafeAreaView edges={['top']} style={styles.safeArea}>
                <View style={[styles.header, { borderBottomColor: colors.border }]}>
                    <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
                    </Pressable>
                    <Text style={[styles.headerTitle, { color: colors.text.primary }]}>Notifications</Text>
                    <View style={styles.placeholder} />
                </View>

                <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
                    {/* Master Toggle */}
                    <Card style={styles.masterCard}>
                        <View style={styles.masterRow}>
                            <View style={[styles.masterIcon, { backgroundColor: colors.primary.teal + '20' }]}>
                                <Ionicons name="notifications" size={24} color={colors.primary.teal} />
                            </View>
                            <View style={styles.masterContent}>
                                <Text style={[styles.masterTitle, { color: colors.text.primary }]}>
                                    Push Notifications
                                </Text>
                                <Text style={[styles.masterDesc, { color: colors.text.muted }]}>
                                    {pushEnabled
                                        ? 'You will receive reminders and updates'
                                        : 'Enable to receive helpful reminders'}
                                </Text>
                            </View>
                            <Switch
                                value={pushEnabled}
                                onValueChange={pushEnabled ? handleDisablePush : handleEnablePush}
                                trackColor={{ false: colors.background.tertiary, true: colors.primary.teal }}
                                thumbColor="#fff"
                                disabled={isLoading}
                            />
                        </View>
                    </Card>

                    {pushEnabled && (
                        <>
                            <Text style={[styles.sectionTitle, { color: colors.text.muted }]}>
                                Notification Types
                            </Text>

                            {NOTIFICATION_SETTINGS.map((setting) => {
                                const pref = preferences[setting.type] || { enabled: false };

                                return (
                                    <View
                                        key={setting.type}
                                        style={[styles.settingCard, { backgroundColor: colors.background.card }]}
                                    >
                                        <View style={styles.settingRow}>
                                            <View style={[styles.settingIcon, { backgroundColor: setting.color + '20' }]}>
                                                <Ionicons name={setting.icon} size={20} color={setting.color} />
                                            </View>
                                            <View style={styles.settingContent}>
                                                <Text style={[styles.settingTitle, { color: colors.text.primary }]}>
                                                    {setting.title}
                                                </Text>
                                                <Text style={[styles.settingDesc, { color: colors.text.muted }]}>
                                                    {setting.description}
                                                </Text>
                                            </View>
                                            <Switch
                                                value={pref.enabled}
                                                onValueChange={() => handleToggle(setting.type)}
                                                trackColor={{ false: colors.background.tertiary, true: setting.color }}
                                                thumbColor="#fff"
                                            />
                                        </View>

                                        {setting.hasTime && pref.enabled && (
                                            <View style={[styles.timeRow, { borderTopColor: colors.border }]}>
                                                <Text style={[styles.timeLabel, { color: colors.text.secondary }]}>
                                                    Reminder time
                                                </Text>
                                                <Pressable
                                                    style={[styles.timeButton, { backgroundColor: colors.background.secondary }]}
                                                >
                                                    <Ionicons name="time" size={16} color={colors.text.secondary} />
                                                    <Text style={[styles.timeText, { color: colors.text.primary }]}>
                                                        {pref.time || '09:00'}
                                                    </Text>
                                                </Pressable>
                                            </View>
                                        )}
                                    </View>
                                );
                            })}
                        </>
                    )}

                    <View style={styles.infoCard}>
                        <Ionicons name="information-circle" size={20} color={colors.text.muted} />
                        <Text style={[styles.infoText, { color: colors.text.muted }]}>
                            Notifications help you stay on track with your recovery goals. You can customize
                            which notifications you receive at any time.
                        </Text>
                    </View>

                    <View style={styles.bottomPadding} />
                </ScrollView>
            </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    safeArea: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.md,
        borderBottomWidth: 1,
    },
    backButton: {
        padding: spacing.xs,
    },
    headerTitle: {
        fontSize: typography.size.lg,
        fontWeight: '700',
    },
    placeholder: {
        width: 32,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: spacing.md,
        paddingBottom: 100,
    },
    masterCard: {
        marginBottom: spacing.lg,
    },
    masterRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    masterIcon: {
        width: 48,
        height: 48,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.md,
    },
    masterContent: {
        flex: 1,
    },
    masterTitle: {
        fontSize: typography.size.base,
        fontWeight: '600',
    },
    masterDesc: {
        fontSize: typography.size.sm,
        marginTop: 2,
    },
    sectionTitle: {
        fontSize: typography.size.sm,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: spacing.sm,
        marginLeft: spacing.xs,
    },
    settingCard: {
        borderRadius: 16,
        marginBottom: spacing.sm,
        overflow: 'hidden',
    },
    settingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.md,
    },
    settingIcon: {
        width: 40,
        height: 40,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.md,
    },
    settingContent: {
        flex: 1,
    },
    settingTitle: {
        fontSize: typography.size.base,
        fontWeight: '500',
    },
    settingDesc: {
        fontSize: typography.size.xs,
        marginTop: 2,
    },
    timeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderTopWidth: 1,
    },
    timeLabel: {
        fontSize: typography.size.sm,
    },
    timeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: spacing.xs,
        paddingHorizontal: spacing.sm,
        borderRadius: 8,
        gap: 4,
    },
    timeText: {
        fontSize: typography.size.sm,
        fontWeight: '500',
    },
    infoCard: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: spacing.sm,
        marginTop: spacing.lg,
    },
    infoText: {
        flex: 1,
        fontSize: typography.size.sm,
        lineHeight: 20,
    },
    bottomPadding: {
        height: 40,
    },
});

export default NotificationSettingsScreen;

// --- End of NotificationSettingsScreen.js ---
