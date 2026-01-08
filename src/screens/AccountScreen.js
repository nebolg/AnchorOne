// Author: -GLOBENXCC-
// OS support: iOS, Android, Web
// Description: Account settings screen with logout, delete account, export data

import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, Text, Pressable, Animated, ScrollView, Alert, Share } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useColors, colors, spacing, typography } from '../theme';
import { useUserStore, useSobrietyStore } from '../store';
import { Card } from '../components/common';
import { EASING } from '../utils/animations';
import api from '../services/api';

const SettingRow = ({ icon, title, subtitle, onPress, danger = false }) => (
    <Pressable onPress={onPress} style={styles.settingRow}>
        <View style={[styles.settingIcon, danger && styles.settingIconDanger]}>
            <Ionicons name={icon} size={20} color={danger ? '#EF4444' : colors.primary.teal} />
        </View>
        <View style={styles.settingContent}>
            <Text style={[styles.settingTitle, danger && styles.settingTitleDanger]}>{title}</Text>
            {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
        </View>
        <Ionicons name="chevron-forward" size={20} color={colors.text.muted} />
    </Pressable>
);

export const AccountScreen = ({ navigation }) => {
    const themeColors = useColors();
    const { userId, username, isAnonymous, createdAt, resetUser } = useUserStore();
    const { resetSobriety } = useSobrietyStore();
    const [loading, setLoading] = useState(false);

    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(fadeAnim, { toValue: 1, duration: 400, easing: EASING.decelerate, useNativeDriver: true }).start();
    }, []);

    const handleLogout = () => {
        Alert.alert(
            'Log Out',
            'Are you sure you want to log out?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Log Out',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await api.logout();
                        } catch (e) { }
                        await api.clearAuthToken();
                        resetUser();
                        resetSobriety();
                    },
                },
            ]
        );
    };

    const handleExportData = async () => {
        setLoading(true);
        try {
            const data = await api.exportData();
            const jsonString = JSON.stringify(data, null, 2);
            await Share.share({ message: jsonString, title: 'My AnchorOne Data' });
        } catch (error) {
            Alert.alert('Error', error.message || 'Failed to export data');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAccount = () => {
        Alert.alert(
            'Delete Account',
            'This will permanently delete your account and all your data. This action cannot be undone.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => {
                        Alert.alert(
                            'Confirm Deletion',
                            'Are you absolutely sure? All your progress, slips, and data will be permanently deleted.',
                            [
                                { text: 'Cancel', style: 'cancel' },
                                {
                                    text: 'Yes, Delete Everything',
                                    style: 'destructive',
                                    onPress: async () => {
                                        setLoading(true);
                                        try {
                                            await api.deleteAccount();
                                            await api.clearAuthToken();
                                            resetUser();
                                            resetSobriety();
                                        } catch (error) {
                                            Alert.alert('Error', error.message || 'Failed to delete account');
                                        } finally {
                                            setLoading(false);
                                        }
                                    },
                                },
                            ]
                        );
                    },
                },
            ]
        );
    };

    const handleChangePassword = () => {
        navigation.navigate('ChangePassword');
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return 'Unknown';
        return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    };

    return (
        <View style={[styles.container, { backgroundColor: themeColors.background.primary }]}>
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.header}>
                    <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
                        <Ionicons name="arrow-back" size={24} color={themeColors.text.primary} />
                    </Pressable>
                    <Text style={[styles.headerTitle, { color: themeColors.text.primary }]}>Account Settings</Text>
                    <View style={{ width: 40 }} />
                </View>

                <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
                    <Animated.View style={{ opacity: fadeAnim }}>
                        <Card style={styles.infoCard}>
                            <View style={styles.infoRow}>
                                <Text style={styles.infoLabel}>Account Type</Text>
                                <Text style={styles.infoValue}>{isAnonymous ? 'Guest' : 'Registered'}</Text>
                            </View>
                            {username && (
                                <View style={styles.infoRow}>
                                    <Text style={styles.infoLabel}>Username</Text>
                                    <Text style={styles.infoValue}>@{username}</Text>
                                </View>
                            )}
                            <View style={styles.infoRow}>
                                <Text style={styles.infoLabel}>Member Since</Text>
                                <Text style={styles.infoValue}>{formatDate(createdAt)}</Text>
                            </View>
                        </Card>

                        <Text style={styles.sectionTitle}>Security</Text>
                        <Card style={styles.settingsCard}>
                            {!isAnonymous && (
                                <SettingRow
                                    icon="key-outline"
                                    title="Change Password"
                                    subtitle="Update your password"
                                    onPress={handleChangePassword}
                                />
                            )}
                            {isAnonymous && (
                                <SettingRow
                                    icon="person-add-outline"
                                    title="Create Account"
                                    subtitle="Save your progress permanently"
                                    onPress={() => navigation.navigate('Register')}
                                />
                            )}
                        </Card>

                        <Text style={styles.sectionTitle}>Your Data</Text>
                        <Card style={styles.settingsCard}>
                            <SettingRow
                                icon="download-outline"
                                title="Export Data"
                                subtitle="Download all your data"
                                onPress={handleExportData}
                            />
                        </Card>

                        <Text style={styles.sectionTitle}>Danger Zone</Text>
                        <Card style={styles.settingsCard}>
                            <SettingRow
                                icon="log-out-outline"
                                title="Log Out"
                                subtitle="Sign out of your account"
                                onPress={handleLogout}
                                danger
                            />
                            <View style={styles.settingDivider} />
                            <SettingRow
                                icon="trash-outline"
                                title="Delete Account"
                                subtitle="Permanently delete all data"
                                onPress={handleDeleteAccount}
                                danger
                            />
                        </Card>

                        <View style={styles.privacyNote}>
                            <Ionicons name="shield-checkmark" size={16} color={colors.primary.teal} />
                            <Text style={styles.privacyText}>
                                Your data is encrypted and stored securely. We never share your data with third parties.
                            </Text>
                        </View>
                    </Animated.View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background.primary },
    safeArea: { flex: 1 },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.md, paddingVertical: spacing.sm },
    backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
    headerTitle: { fontSize: typography.size.lg, fontWeight: typography.weight.bold, color: colors.text.primary },
    scroll: { flex: 1 },
    scrollContent: { padding: spacing.md, paddingBottom: spacing['2xl'] },
    infoCard: { padding: spacing.md, marginBottom: spacing.lg },
    infoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.sm },
    infoLabel: { fontSize: typography.size.sm, color: colors.text.muted },
    infoValue: { fontSize: typography.size.sm, fontWeight: '600', color: colors.text.primary },
    sectionTitle: { fontSize: typography.size.sm, fontWeight: '600', color: colors.text.muted, marginBottom: spacing.sm, marginTop: spacing.sm, textTransform: 'uppercase', letterSpacing: 1 },
    settingsCard: { padding: 0, overflow: 'hidden', marginBottom: spacing.md },
    settingRow: { flexDirection: 'row', alignItems: 'center', padding: spacing.md },
    settingIcon: { width: 36, height: 36, borderRadius: 10, backgroundColor: colors.primary.teal + '15', alignItems: 'center', justifyContent: 'center', marginRight: spacing.md },
    settingIconDanger: { backgroundColor: '#EF444415' },
    settingContent: { flex: 1 },
    settingTitle: { fontSize: typography.size.base, fontWeight: '500', color: colors.text.primary },
    settingTitleDanger: { color: '#EF4444' },
    settingSubtitle: { fontSize: typography.size.sm, color: colors.text.muted, marginTop: 2 },
    settingDivider: { height: 1, backgroundColor: colors.background.secondary, marginLeft: 60 },
    privacyNote: { flexDirection: 'row', alignItems: 'flex-start', padding: spacing.md, gap: spacing.sm, marginTop: spacing.md },
    privacyText: { flex: 1, fontSize: typography.size.sm, color: colors.text.muted, lineHeight: 20 },
});

export default AccountScreen;

// --- End of AccountScreen.js ---
