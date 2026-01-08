// Author: -GLOBENXCC-
// OS support: iOS, Android, Web
// Description: Profile and settings screen with addiction management and privacy controls

import React, { useState } from 'react';
import { StyleSheet, ScrollView, View, Text, Pressable, Switch, Alert, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, Button, IconRenderer } from '../components/common';
import { ThemePickerModal } from '../components/settings';
import { useColors, lightColors as colors, spacing, typography } from '../theme';
import { useUserStore, useSobrietyStore, useCommunityStore, useThemeStore } from '../store';
import { ACCENT_COLORS } from '../store/themeStore';

const SettingRow = ({ icon, title, subtitle, onPress, rightElement, iconColor, colors }) => (
    <Pressable style={styles.settingRow} onPress={onPress}>
        <Ionicons name={icon} size={22} color={iconColor || colors.text.secondary} style={styles.settingIcon} />
        <View style={styles.settingContent}>
            <Text style={[styles.settingTitle, { color: colors.text.primary }]}>{title}</Text>
            {subtitle && <Text style={[styles.settingSubtitle, { color: colors.text.muted }]}>{subtitle}</Text>}
        </View>
        {rightElement || <Ionicons name="chevron-forward" size={20} color={colors.text.muted} />}
    </Pressable>
);

const SettingToggle = ({ icon, title, subtitle, value, onToggle, iconColor, colors }) => (
    <View style={styles.settingRow}>
        <Ionicons name={icon} size={22} color={iconColor || colors.text.secondary} style={styles.settingIcon} />
        <View style={styles.settingContent}>
            <Text style={[styles.settingTitle, { color: colors.text.primary }]}>{title}</Text>
            {subtitle && <Text style={[styles.settingSubtitle, { color: colors.text.muted }]}>{subtitle}</Text>}
        </View>
        <Switch
            value={value}
            onValueChange={onToggle}
            trackColor={{ false: colors.background.secondary, true: colors.primary.teal }}
            thumbColor={colors.text.inverse}
        />
    </View>
);

export const ProfileScreen = ({ navigation }) => {
    const colors = useColors();
    const {
        username,
        isAnonymous,
        userAddictions,
        avatarId,
        avatarColor,
        avatarUrl,
        catchphrase,
        resetUser,
        removeUserAddiction,
    } = useUserStore();
    const { resetSobriety, deleteSobrietyData } = useSobrietyStore();
    const { resetCommunity } = useCommunityStore();
    const { isDarkMode, toggleTheme, accentId, accentColor } = useThemeStore();

    const [showThemePicker, setShowThemePicker] = useState(false);

    const [dailyReminder, setDailyReminder] = useState(true);
    const [weeklyReport, setWeeklyReport] = useState(false);

    const handleEditProfile = () => {
        navigation.navigate('EditProfile');
    };

    const handleDeleteAccount = () => {
        Alert.alert(
            'Delete Account',
            'This will permanently delete all your data. This action cannot be undone.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => {
                        resetUser();
                        resetSobriety();
                        resetCommunity();
                    },
                },
            ]
        );
    };

    const handleExportData = () => {
        Alert.alert(
            'Export Data',
            'Your data will be prepared for download. This feature is coming soon.',
            [{ text: 'OK' }]
        );
    };

    const handleAddAddiction = () => {
        navigation.navigate('AddictionSelect');
    };

    const handlePrivacy = () => {
        navigation.navigate('Privacy');
    };

    const handleFeedback = () => {
        navigation.navigate('Feedback');
    };

    const handleManageAddiction = (addiction) => {
        Alert.alert(
            `Manage ${addiction.name}`,
            'What would you like to do?',
            [
                {
                    text: 'Edit Clean Date',
                    onPress: () => navigation.navigate('StartDate', { targetAddictionId: addiction.id })
                },
                {
                    text: 'Delete Addiction',
                    style: 'destructive',
                    onPress: () => {
                        Alert.alert(
                            'Are you sure?',
                            `This will permanently delete all logs and streaks for ${addiction.name}.`,
                            [
                                { text: 'Cancel', style: 'cancel' },
                                {
                                    text: 'Delete',
                                    style: 'destructive',
                                    onPress: () => {
                                        removeUserAddiction(addiction.id);
                                        deleteSobrietyData(addiction.id);
                                    }
                                }
                            ]
                        );
                    }
                },
                { text: 'Cancel', style: 'cancel' }
            ]
        );
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background.primary }]}>
            <View style={styles.header}>
                <Text style={[styles.title, { color: colors.text.primary }]}>Profile</Text>
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* User info */}
                <Card style={styles.profileCard}>
                    <View style={styles.avatarContainer}>
                        <View style={[styles.avatar, { backgroundColor: avatarColor + '20', borderColor: avatarColor, borderWidth: 2, overflow: 'hidden' }]}>
                            {avatarUrl ? (
                                <Image source={{ uri: avatarUrl }} style={styles.avatarImage} />
                            ) : (
                                <Ionicons
                                    name={avatarId || (isAnonymous ? "glasses-outline" : "person-outline")}
                                    size={32}
                                    color={avatarColor || colors.primary.teal}
                                />
                            )}
                        </View>
                        <View style={styles.profileInfo}>
                            <Text style={[styles.username, { color: colors.text.primary }]}>
                                {isAnonymous ? 'Anonymous' : `@${username}`}
                            </Text>
                            {catchphrase ? (
                                <Text style={[styles.catchphrase, { color: colors.text.secondary }]} numberOfLines={1}>{catchphrase}</Text>
                            ) : null}
                            <Pressable onPress={handleEditProfile} style={styles.editProfileLink}>
                                <Text style={[styles.editProfileText, { color: colors.primary.teal }]}>Edit Identity</Text>
                                <Ionicons name="arrow-forward" size={12} color={colors.primary.teal} />
                            </Pressable>
                        </View>
                    </View>
                    {isAnonymous && (
                        <View style={styles.securityAlert}>
                            <Ionicons name="warning-outline" size={20} color={colors.status.warning} />
                            <Text style={styles.securityText}>Your data isn't backed up yet.</Text>
                            <Pressable
                                style={styles.linkButton}
                                onPress={() => {/* Google logic here would be same as WelcomeScreen */ }}
                            >
                                <Text style={styles.linkButtonText}>Secure with Google</Text>
                            </Pressable>
                        </View>
                    )}
                </Card>

                {/* My Addictions */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.text.muted }]}>My Recovery Journey</Text>
                    <Card style={[styles.sectionCard, { backgroundColor: colors.background.card }]}>
                        {userAddictions.map((addiction, index) => (
                            <Pressable
                                key={addiction.id}
                                onLongPress={() => handleManageAddiction(addiction)}
                                delayLongPress={500}
                                style={({ pressed }) => [
                                    styles.addictionRow,
                                    pressed && { backgroundColor: colors.background.secondary },
                                    index !== userAddictions.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.background.secondary },
                                ]}
                            >
                                <IconRenderer
                                    library={addiction.library || 'Ionicons'}
                                    name={addiction.icon}
                                    size={24}
                                    color={colors.text.secondary}
                                />
                                <Text style={[styles.addictionName, { color: colors.text.primary }]}>{addiction.name}</Text>
                                <Text style={[styles.addictionStatus, { color: colors.primary.teal }]}>Active</Text>
                            </Pressable>
                        ))}
                        <Pressable style={styles.addButton} onPress={handleAddAddiction}>
                            <Text style={[styles.addButtonText, { color: colors.primary.teal }]}>+ Add addiction</Text>
                        </Pressable>
                    </Card>
                    <Text style={[styles.hintText, { color: colors.text.muted }]}>Long press to edit or delete</Text>
                </View>

                {/* Appearance */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.text.muted }]}>Appearance</Text>
                    <Card style={[styles.sectionCard, { backgroundColor: colors.background.card }]}>
                        <SettingToggle
                            icon="moon"
                            title="Dark Mode"
                            subtitle={isDarkMode ? 'Dark theme active' : 'Light theme active'}
                            value={isDarkMode}
                            onToggle={toggleTheme}
                            iconColor={colors.primary.violet}
                            colors={colors}
                        />
                        <View style={[styles.divider, { backgroundColor: colors.background.secondary }]} />
                        <SettingRow
                            icon="color-palette"
                            title="Accent Color"
                            subtitle={ACCENT_COLORS.find(a => a.id === accentId)?.name || 'Teal'}
                            onPress={() => setShowThemePicker(true)}
                            iconColor={accentColor}
                            rightElement={
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <View style={[styles.colorDot, { backgroundColor: accentColor }]} />
                                    <Ionicons name="chevron-forward" size={20} color={colors.text.muted} />
                                </View>
                            }
                            colors={colors}
                        />
                    </Card>
                </View>

                {/* Quick Access */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.text.muted }]}>Quick Access</Text>
                    <Card style={[styles.sectionCard, { backgroundColor: colors.background.card }]}>
                        <SettingRow
                            icon="trophy"
                            title="Achievements"
                            subtitle={`View your progress & badges`}
                            onPress={() => navigation.navigate('Achievements')}
                            iconColor="#F59E0B"
                            colors={colors}
                        />
                        <View style={[styles.divider, { backgroundColor: colors.background.secondary }]} />
                        <SettingRow
                            icon="fitness"
                            title="Challenges"
                            subtitle="Join group challenges"
                            onPress={() => navigation.navigate('Challenges')}
                            iconColor="#10B981"
                            colors={colors}
                        />
                        <View style={[styles.divider, { backgroundColor: colors.background.secondary }]} />
                        <SettingRow
                            icon="medkit"
                            title="Coping Toolkit"
                            subtitle="Breathing, grounding & more"
                            onPress={() => navigation.navigate('CopingToolkit')}
                            iconColor="#8B5CF6"
                            colors={colors}
                        />
                        <View style={[styles.divider, { backgroundColor: colors.background.secondary }]} />
                        <SettingRow
                            icon="analytics"
                            title="Analytics Dashboard"
                            subtitle="View detailed stats"
                            onPress={() => navigation.navigate('AnalyticsDashboard')}
                            iconColor="#3B82F6"
                            colors={colors}
                        />
                        <View style={[styles.divider, { backgroundColor: colors.background.secondary }]} />
                        <SettingRow
                            icon="book"
                            title="Success Stories"
                            subtitle="Read inspiring recovery stories"
                            onPress={() => navigation.navigate('SuccessStories')}
                            iconColor="#EC4899"
                            colors={colors}
                        />
                        <View style={[styles.divider, { backgroundColor: colors.background.secondary }]} />
                        <SettingRow
                            icon="school"
                            title="Guided Programs"
                            subtitle="Structured recovery journeys"
                            onPress={() => navigation.navigate('GuidedPrograms')}
                            iconColor="#F59E0B"
                            colors={colors}
                        />
                        <View style={[styles.divider, { backgroundColor: colors.background.secondary }]} />
                        <SettingRow
                            icon="chatbubbles"
                            title="Live Support Groups"
                            subtitle="Join moderated chat rooms"
                            onPress={() => navigation.navigate('LiveSupport')}
                            iconColor="#14B8A6"
                            colors={colors}
                        />
                    </Card>
                </View>

                {/* Notifications */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.text.muted }]}>Notifications</Text>
                    <Card style={[styles.sectionCard, { backgroundColor: colors.background.card }]}>
                        <SettingToggle
                            icon="notifications"
                            title="Daily check-in reminder"
                            subtitle="Reminder at 8:00 PM"
                            value={dailyReminder}
                            onToggle={setDailyReminder}
                            colors={colors}
                        />
                        <View style={[styles.divider, { backgroundColor: colors.background.secondary }]} />
                        <SettingToggle
                            icon="analytics"
                            title="Weekly progress report"
                            subtitle="Every Sunday"
                            value={weeklyReport}
                            onToggle={setWeeklyReport}
                            colors={colors}
                        />
                        <View style={[styles.divider, { backgroundColor: colors.background.secondary }]} />
                        <SettingRow
                            icon="settings"
                            title="All Notification Settings"
                            subtitle="Customize all reminders"
                            onPress={() => navigation.navigate('NotificationSettings')}
                            colors={colors}
                        />
                    </Card>
                </View>

                {/* Accessibility */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.text.muted }]}>Accessibility</Text>
                    <Card style={[styles.sectionCard, { backgroundColor: colors.background.card }]}>
                        <SettingRow
                            icon="text"
                            title="Text & Display"
                            subtitle="Text size, motion, contrast"
                            onPress={() => navigation.navigate('AccessibilitySettings')}
                            iconColor="#6366F1"
                            colors={colors}
                        />
                    </Card>
                </View>

                {/* Privacy & Data */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.text.muted }]}>Privacy & Data</Text>
                    <Card style={[styles.sectionCard, { backgroundColor: colors.background.card }]}>
                        <SettingRow
                            icon="person-circle"
                            title="Account settings"
                            subtitle="Manage your account"
                            onPress={() => navigation.navigate('Account')}
                            colors={colors}
                        />
                        <View style={[styles.divider, { backgroundColor: colors.background.secondary }]} />
                        <SettingRow
                            icon="shield-checkmark"
                            title="Privacy settings"
                            subtitle="Anonymous by default"
                            onPress={handlePrivacy}
                            colors={colors}
                        />
                        <View style={[styles.divider, { backgroundColor: colors.background.secondary }]} />
                        <SettingRow
                            icon="cloud-download"
                            title="Export my data"
                            subtitle="Download all your data"
                            onPress={handleExportData}
                            colors={colors}
                        />
                        <View style={[styles.divider, { backgroundColor: colors.background.secondary }]} />
                        <SettingRow
                            icon="trash"
                            title="Delete account"
                            subtitle="Permanently remove all data"
                            onPress={handleDeleteAccount}
                            iconColor={colors.status.error}
                            rightElement={<Ionicons name="chevron-forward" size={20} color={colors.status.error} />}
                            colors={colors}
                        />
                    </Card>
                </View>

                {/* Support */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Support</Text>
                    <Card style={styles.sectionCard}>
                        <SettingRow
                            icon="help-circle"
                            title="24/7 Support Resources"
                            subtitle="Crisis lines & meetings"
                            onPress={() => navigation.navigate('Support')}
                            colors={colors}
                        />
                        <View style={[styles.divider, { backgroundColor: colors.background.secondary }]} />
                        <SettingRow
                            icon="mail"
                            title="Send feedback"
                            subtitle="Help us improve"
                            onPress={handleFeedback}
                            colors={colors}
                        />
                        <View style={[styles.divider, { backgroundColor: colors.background.secondary }]} />
                        <SettingRow
                            icon="information-circle"
                            title="About AnchorOne"
                            subtitle="Version 1.0.0"
                            colors={colors}
                        />
                    </Card>
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <Ionicons name="heart" size={16} color={colors.primary.violet} style={{ marginBottom: spacing.xs }} />
                    <Text style={styles.footerText}>
                        Dedicated to those in recovery
                    </Text>
                    <Text style={styles.footerDisclaimer}>
                        AnchorOne is not a medical service and does not provide
                        diagnoses, treatment, or medical advice.
                    </Text>
                </View>

                <View style={styles.bottomPadding} />
            </ScrollView>

            <ThemePickerModal
                visible={showThemePicker}
                onClose={() => setShowThemePicker(false)}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background.primary,
    },
    header: {
        paddingHorizontal: spacing.screenPadding,
        paddingVertical: spacing.md,
    },
    title: {
        fontSize: typography.size['2xl'],
        fontWeight: typography.weight.bold,
        color: colors.text.primary,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: spacing.screenPadding,
    },
    profileCard: {
        marginBottom: spacing.lg,
    },
    avatarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 56,
        height: 56,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.md,
    },
    avatarImage: {
        width: 56,
        height: 56,
        borderRadius: 28,
    },
    profileInfo: {
        marginLeft: spacing.md,
        flex: 1,
    },
    securityAlert: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.status.warning + '10',
        marginTop: spacing.lg,
        padding: spacing.md,
        borderRadius: spacing.radius.md,
        borderWidth: 1,
        borderColor: colors.status.warning + '20',
    },
    securityText: {
        flex: 1,
        fontSize: typography.size.xs,
        color: colors.text.secondary,
        marginHorizontal: spacing.sm,
    },
    linkButton: {
        backgroundColor: colors.background.primary,
        paddingVertical: spacing.xs,
        paddingHorizontal: spacing.sm,
        borderRadius: spacing.radius.full,
        borderWidth: 1,
        borderColor: colors.background.secondary,
    },
    linkButtonText: {
        fontSize: 12,
        fontWeight: '600',
        color: colors.primary.teal,
    },
    username: {
        fontSize: typography.size.xl,
        fontWeight: typography.weight.bold,
        color: colors.text.primary,
    },
    catchphrase: {
        fontSize: typography.size.sm,
        color: colors.text.secondary,
        marginTop: 2,
        fontStyle: 'italic',
    },
    editProfileLink: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: spacing.sm,
        gap: 4,
    },
    editProfileText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: colors.primary.teal,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    profileSubtext: {
        fontSize: typography.size.sm,
        color: colors.text.secondary,
        marginTop: spacing.xs,
    },
    section: {
        marginBottom: spacing.lg,
    },
    sectionTitle: {
        fontSize: typography.size.sm,
        fontWeight: typography.weight.semibold,
        color: colors.text.muted,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: spacing.sm,
        marginLeft: spacing.xs,
    },
    sectionCard: {
        padding: 0,
        overflow: 'hidden',
    },
    addictionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.md,
    },
    addictionRowBorder: {
        borderBottomWidth: 1,
        borderBottomColor: colors.background.secondary,
    },
    addictionIcon: {
        fontSize: 24,
        marginRight: spacing.sm,
    },
    addictionName: {
        flex: 1,
        fontSize: typography.size.base,
        color: colors.text.primary,
    },
    addictionStatus: {
        fontSize: typography.size.sm,
        color: colors.status.success,
        fontWeight: typography.weight.medium,
    },
    addButton: {
        padding: spacing.md,
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: colors.background.secondary,
    },
    addButtonText: {
        fontSize: typography.size.base,
        color: colors.primary.teal,
        fontWeight: typography.weight.medium,
    },
    hintText: {
        fontSize: typography.size.xs,
        color: colors.text.muted,
        textAlign: 'center',
        marginTop: spacing.xs,
        fontStyle: 'italic',
    },
    settingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.md,
    },
    settingIcon: {
        fontSize: 20,
        marginRight: spacing.sm,
    },
    settingContent: {
        flex: 1,
    },
    settingTitle: {
        fontSize: typography.size.base,
        color: colors.text.primary,
    },
    settingSubtitle: {
        fontSize: typography.size.sm,
        color: colors.text.muted,
        marginTop: 2,
    },
    settingArrow: {
        fontSize: 24,
        color: colors.text.muted,
    },
    divider: {
        height: 1,
        backgroundColor: colors.background.secondary,
        marginHorizontal: spacing.md,
    },
    colorDot: {
        width: 20,
        height: 20,
        borderRadius: 10,
        marginRight: spacing.sm,
    },
    footer: {
        alignItems: 'center',
        paddingVertical: spacing.xl,
    },
    footerText: {
        fontSize: typography.size.sm,
        color: colors.text.secondary,
    },
    footerDisclaimer: {
        fontSize: typography.size.xs,
        color: colors.text.muted,
        textAlign: 'center',
        marginTop: spacing.sm,
        paddingHorizontal: spacing.lg,
        lineHeight: 18,
    },
    bottomPadding: {
        height: 100,
    },
});

export default ProfileScreen;

// --- End of ProfileScreen.js ---
