// Author: -GLOBENXCC-
// OS support: iOS, Android, Web
// Description: Progress tracker screen with per-addiction streaks and milestones

import React, { useState } from 'react';
import { StyleSheet, ScrollView, View, Text, Pressable, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Card, Button } from '../components/common';
import { useColors, colors, spacing, typography } from '../theme';
import { useUserStore, useSobrietyStore } from '../store';
import { IconRenderer } from '../components/common/IconRenderer';
import { format } from 'date-fns';
import { useLiveStreak } from '../hooks/useLiveStreak';
import { SlipInsights } from '../components/progress';

const MILESTONE_BADGE = require('../../assets/milestone-badge.png');

const MILESTONES = [
    { days: 1, label: '1 Day', icon: 'leaf' },
    { days: 3, label: '3 Days', icon: 'water' },
    { days: 7, label: '1 Week', icon: 'shield-checkmark' },
    { days: 14, label: '2 Weeks', icon: 'flame' },
    { days: 30, label: '1 Month', icon: 'medal' },
    { days: 60, label: '2 Months', icon: 'ribbon' },
    { days: 90, label: '3 Months', icon: 'diamond' },
    { days: 180, label: '6 Months', icon: 'trophy' },
    { days: 365, label: '1 Year', icon: 'infinite' },
];

const AddictionTab = ({ addiction, isActive, onPress, colors }) => (
    <Pressable
        onPress={onPress}
        style={[styles.tab, { backgroundColor: isActive ? colors.primary.teal : colors.background.secondary }]}
    >
        <IconRenderer
            library={addiction.library || 'Ionicons'}
            name={addiction.icon}
            size={16}
            color={isActive ? colors.text.inverse : colors.text.secondary}
            style={styles.tabIcon}
        />
        <Text style={[styles.tabText, { color: isActive ? colors.text.inverse : colors.text.secondary }]}>
            {addiction.name.split(' ')[0]}
        </Text>
    </Pressable>
);

const MilestoneBadge = ({ milestone, achieved, current, colors }) => (
    <View style={[
        styles.milestoneBadge,
        { backgroundColor: colors.background.card, borderColor: colors.background.secondary },
        achieved && { borderColor: colors.primary.teal + '40', backgroundColor: colors.primary.teal + '05' },
        current && { borderColor: colors.primary.violet, backgroundColor: colors.primary.violet + '05' },
    ]}>
        <View style={styles.badgeIconContainer}>
            <Ionicons
                name={milestone.icon}
                size={24}
                color={achieved ? (current ? colors.primary.violet : colors.primary.teal) : colors.text.muted}
                style={!achieved && { opacity: 0.2 }}
            />
            {achieved && (
                <View style={[styles.achievementOverlay, { backgroundColor: colors.background.card }]}>
                    <Ionicons name="checkmark-circle" size={14} color={colors.primary.teal} />
                </View>
            )}
        </View>
        <Text style={[
            styles.milestoneLabel,
            { color: achieved ? colors.text.primary : colors.text.muted },
        ]}>
            {milestone.label}
        </Text>
    </View>
);

export const ProgressScreen = ({ navigation }) => {
    const colors = useColors();
    const { userAddictions } = useUserStore();
    const { sobrietyData, logSlip, restartStreak } = useSobrietyStore();
    const [activeTab, setActiveTab] = useState(0);
    const [showSlipModal, setShowSlipModal] = useState(false);

    const activeAddiction = userAddictions[activeTab];
    const addictionData = activeAddiction ? sobrietyData[activeAddiction.id] : null;

    // Use live streak for real-time motivation
    const streak = useLiveStreak(activeAddiction?.id);
    const streakDays = streak?.days || 0;

    const formatTime = (val) => val.toString().padStart(2, '0');

    // Find current and next milestone
    const getCurrentMilestone = () => {
        for (let i = MILESTONES.length - 1; i >= 0; i--) {
            if (streakDays >= MILESTONES[i].days) {
                return MILESTONES[i];
            }
        }
        return null;
    };

    const getNextMilestone = () => {
        for (const milestone of MILESTONES) {
            if (streakDays < milestone.days) {
                return milestone;
            }
        }
        return null;
    };

    const currentMilestone = getCurrentMilestone();
    const nextMilestone = getNextMilestone();
    const daysToNext = nextMilestone ? nextMilestone.days - streakDays : 0;

    const handleSlip = () => {
        if (activeAddiction) {
            logSlip(activeAddiction.id, 'Manual log');
            setShowSlipModal(false);
        }
    };

    if (userAddictions.length === 0) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: colors.background.primary }]}>
                <View style={styles.emptyState}>
                    <IconRenderer library="Ionicons" name="analytics" size={64} color={colors.text.muted} style={{ marginBottom: spacing.md }} />
                    <Text style={[styles.emptyTitle, { color: colors.text.primary }]}>No addictions tracked</Text>
                    <Text style={[styles.emptyText, { color: colors.text.secondary }]}>
                        Add addictions in your profile to start tracking progress
                    </Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background.primary }]}>
            <View style={styles.header}>
                <Text style={[styles.title, { color: colors.text.primary }]}>Your Momentum</Text>
            </View>

            {/* Addiction tabs */}
            <View>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.tabsContainer}
                    contentContainerStyle={styles.tabsContent}
                >
                    {userAddictions.map((addiction, index) => (
                        <AddictionTab
                            key={addiction.id}
                            addiction={addiction}
                            isActive={index === activeTab}
                            onPress={() => setActiveTab(index)}
                            colors={colors}
                        />
                    ))}
                </ScrollView>
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Main streak display */}
                <Card style={[styles.streakCard, { backgroundColor: colors.background.card, borderColor: colors.background.secondary }]}>
                    <Text style={[styles.streakLabel, { color: colors.text.muted }]}>Current Streak</Text>
                    <View style={styles.streakNumberRow}>
                        <Text style={[styles.streakNumber, { color: colors.text.primary }]}>{streakDays}</Text>
                        <Text style={[styles.streakUnit, { color: colors.text.secondary }]}>Days</Text>
                    </View>

                    {streak?.isActive && (
                        <View style={styles.liveTimerContainer}>
                            <View style={styles.timerSegment}>
                                <Text style={[styles.timerValue, { color: colors.primary.teal }]}>{formatTime(streak.hours)}</Text>
                                <Text style={[styles.timerLabel, { color: colors.text.muted }]}>H</Text>
                            </View>
                            <Text style={[styles.timerDivider, { color: colors.primary.teal }]}>:</Text>
                            <View style={styles.timerSegment}>
                                <Text style={[styles.timerValue, { color: colors.primary.teal }]}>{formatTime(streak.minutes)}</Text>
                                <Text style={[styles.timerLabel, { color: colors.text.muted }]}>M</Text>
                            </View>
                            <Text style={[styles.timerDivider, { color: colors.primary.teal }]}>:</Text>
                            <View style={styles.timerSegment}>
                                <Text style={[styles.timerValue, { color: colors.primary.teal }]}>{formatTime(streak.seconds)}</Text>
                                <Text style={[styles.timerLabel, { color: colors.text.muted }]}>S</Text>
                            </View>
                        </View>
                    )}

                    {addictionData && (
                        <View style={[styles.dateBadge, { backgroundColor: colors.background.secondary }]}>
                            <Ionicons name="calendar-outline" size={14} color={colors.text.muted} />
                            <Text style={[styles.startDate, { color: colors.text.muted }]}>
                                Since {format(new Date(addictionData.startDate), 'MMM d, yyyy')}
                            </Text>
                        </View>
                    )}

                    {currentMilestone && (
                        <View style={[styles.currentMilestoneContainer, { backgroundColor: colors.primary.teal + '10', borderColor: colors.primary.teal + '20' }]}>
                            <Ionicons name={currentMilestone.icon} size={16} color={colors.primary.teal} style={{ marginRight: 6 }} />
                            <Text style={[styles.currentMilestoneText, { color: colors.primary.teal }]}>{currentMilestone.label} Milestone</Text>
                        </View>
                    )}
                </Card>

                <View style={styles.dashboardGrid}>
                    {/* Next milestone */}
                    {nextMilestone && (
                        <Card style={[styles.nextMilestoneCard, { backgroundColor: colors.background.card, borderColor: colors.background.secondary }]}>
                            <Text style={[styles.cardHeaderTitle, { color: colors.text.muted }]}>Path to {nextMilestone.label}</Text>
                            <View style={styles.nextValueRow}>
                                <Text style={[styles.nextValue, { color: colors.text.primary }]}>{daysToNext}</Text>
                                <Text style={[styles.nextUnit, { color: colors.text.muted }]}>days left</Text>
                            </View>

                            {/* Progress bar */}
                            <View style={[styles.progressBar, { backgroundColor: colors.background.secondary }]}>
                                <View
                                    style={[
                                        styles.progressFill,
                                        { width: `${Math.min((streakDays / nextMilestone.days) * 100, 100)}%`, backgroundColor: colors.primary.teal }
                                    ]}
                                />
                            </View>
                        </Card>
                    )}

                    {/* Quick Stats */}
                    <Card style={[styles.statsCard, { backgroundColor: colors.background.card, borderColor: colors.background.secondary }]}>
                        <Text style={[styles.cardHeaderTitle, { color: colors.text.muted }]}>Efficiency</Text>
                        <View style={styles.nextValueRow}>
                            <Text style={[styles.nextValue, { color: colors.text.primary }]}>{Math.round(Math.min((streakDays / 365) * 100, 100))}%</Text>
                            <Text style={[styles.nextUnit, { color: colors.text.muted }]}>of target year</Text>
                        </View>
                        <Text style={[styles.statsSubtext, { color: colors.text.muted }]}>Keep the momentum strong</Text>
                    </Card>
                </View>

                {/* Milestones grid */}
                <View style={styles.milestonesSection}>
                    <View style={styles.sectionHeader}>
                        <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Hall of Fame</Text>
                        <Text style={[styles.sectionSubtitle, { color: colors.primary.teal }]}>{MILESTONES.filter(m => streakDays >= m.days).length} Achieved</Text>
                    </View>

                    <View style={styles.milestonesGrid}>
                        {MILESTONES.map((milestone) => (
                            <MilestoneBadge
                                key={milestone.days}
                                milestone={milestone}
                                achieved={streakDays >= milestone.days}
                                current={currentMilestone?.days === milestone.days}
                                colors={colors}
                            />
                        ))}
                    </View>
                </View>

                {/* Slip Insights */}
                <View style={styles.slipInsightsSection}>
                    <SlipInsights addictionId={activeAddiction?.id} navigation={navigation} />
                </View>

                {/* Quick Access */}
                <View style={styles.quickAccessSection}>
                    <Text style={[styles.sectionTitle, { color: colors.text.primary, marginBottom: spacing.md }]}>Quick Access</Text>
                    <View style={styles.quickAccessGrid}>
                        <Pressable
                            onPress={() => navigation.navigate('Achievements')}
                            style={[styles.quickAccessCard, { backgroundColor: colors.background.card }]}
                        >
                            <View style={[styles.quickAccessIcon, { backgroundColor: '#F59E0B' }]}>
                                <Ionicons name="trophy" size={20} color="#fff" />
                            </View>
                            <Text style={[styles.quickAccessTitle, { color: colors.text.primary }]}>Achievements</Text>
                        </Pressable>

                        <Pressable
                            onPress={() => navigation.navigate('AnalyticsDashboard')}
                            style={[styles.quickAccessCard, { backgroundColor: colors.background.card }]}
                        >
                            <View style={[styles.quickAccessIcon, { backgroundColor: '#3B82F6' }]}>
                                <Ionicons name="analytics" size={20} color="#fff" />
                            </View>
                            <Text style={[styles.quickAccessTitle, { color: colors.text.primary }]}>Analytics</Text>
                        </Pressable>

                        <Pressable
                            onPress={() => navigation.navigate('WeeklyProgress')}
                            style={[styles.quickAccessCard, { backgroundColor: colors.background.card }]}
                        >
                            <View style={[styles.quickAccessIcon, { backgroundColor: '#8B5CF6' }]}>
                                <Ionicons name="calendar" size={20} color="#fff" />
                            </View>
                            <Text style={[styles.quickAccessTitle, { color: colors.text.primary }]}>Weekly</Text>
                        </Pressable>
                    </View>
                </View>

                {/* Slip logging */}
                <Card style={styles.slipCard}>
                    <View style={styles.slipHeader}>
                        <Ionicons name="refresh-circle" size={32} color={colors.primary.violet} />
                        <View style={styles.slipContent}>
                            <Text style={styles.slipTitle}>Fresh Start?</Text>
                            <Text style={styles.slipText}>
                                Recovery is a journey. Every day is a new beginning.
                            </Text>
                        </View>
                    </View>
                    <Button
                        title="Log a Setback"
                        variant="outline"
                        size="small"
                        onPress={() => setShowSlipModal(true)}
                        style={styles.slipButton}
                    />
                </Card>

                <View style={styles.bottomPadding} />
            </ScrollView>
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
        paddingTop: spacing.md,
        paddingBottom: spacing.sm,
    },
    title: {
        fontSize: typography.size['2xl'],
        fontWeight: typography.weight.bold,
        color: colors.text.primary,
        letterSpacing: -0.5,
    },
    tabsContainer: {
        flexGrow: 0,
        marginBottom: spacing.md,
    },
    tabsContent: {
        paddingHorizontal: spacing.screenPadding,
        gap: spacing.sm,
    },
    tab: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 16,
        backgroundColor: colors.background.secondary,
        borderRadius: 12,
        marginRight: spacing.sm,
    },
    tabActive: {
        backgroundColor: colors.primary.teal,
    },
    tabIcon: {
        marginRight: 6,
    },
    tabText: {
        fontSize: typography.size.sm,
        color: colors.text.secondary,
        fontWeight: 'bold',
    },
    tabTextActive: {
        color: colors.text.inverse,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: spacing.screenPadding,
        paddingTop: 0,
    },
    streakCard: {
        alignItems: 'center',
        paddingVertical: spacing.xl,
        marginBottom: spacing.md,
        backgroundColor: colors.background.card,
        borderWidth: 1,
        borderColor: colors.background.secondary,
        borderRadius: 24,
    },
    streakLabel: {
        fontSize: typography.size.xs,
        fontWeight: 'bold',
        color: colors.text.muted,
        textTransform: 'uppercase',
        letterSpacing: 1.5,
    },
    streakNumberRow: {
        flexDirection: 'row',
        alignItems: 'baseline',
        marginVertical: spacing.xs,
    },
    streakNumber: {
        fontSize: 84,
        fontWeight: '900',
        color: colors.text.primary,
        letterSpacing: -2,
    },
    streakUnit: {
        fontSize: typography.size.xl,
        fontWeight: 'bold',
        color: colors.text.secondary,
        marginLeft: 4,
    },
    liveTimerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: -spacing.sm,
        marginBottom: spacing.md,
    },
    timerSegment: {
        alignItems: 'center',
        paddingHorizontal: 8,
    },
    timerValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.primary.teal,
        fontVariant: ['tabular-nums'],
    },
    timerLabel: {
        fontSize: 8,
        fontWeight: 'bold',
        color: colors.text.muted,
        textTransform: 'uppercase',
        marginTop: -2,
    },
    timerDivider: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.primary.teal + '40',
        marginBottom: 8,
    },
    dateBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.background.secondary,
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: spacing.radius.full,
        marginTop: spacing.xs,
    },
    startDate: {
        fontSize: 12,
        fontWeight: 'bold',
        color: colors.text.muted,
        marginLeft: 4,
    },
    currentMilestoneContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.primary.teal + '10',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 8,
        marginTop: spacing.md,
        borderWidth: 1,
        borderColor: colors.primary.teal + '20',
    },
    currentMilestoneText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: colors.primary.teal,
        textTransform: 'uppercase',
    },
    dashboardGrid: {
        flexDirection: 'row',
        gap: spacing.md,
        marginBottom: spacing.md,
    },
    nextMilestoneCard: {
        flex: 1.5,
        padding: spacing.lg,
        borderRadius: 20,
    },
    statsCard: {
        flex: 1,
        padding: spacing.lg,
        borderRadius: 20,
        backgroundColor: colors.primary.violet + '05',
    },
    cardHeaderTitle: {
        fontSize: 10,
        fontWeight: 'bold',
        color: colors.text.muted,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    nextValueRow: {
        flexDirection: 'row',
        alignItems: 'baseline',
        marginTop: 4,
    },
    nextValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.text.primary,
    },
    nextUnit: {
        fontSize: 10,
        fontWeight: '600',
        color: colors.text.secondary,
        marginLeft: 4,
    },
    statsSubtext: {
        fontSize: 10,
        color: colors.text.muted,
        marginTop: 4,
    },
    progressBar: {
        height: 6,
        backgroundColor: colors.background.secondary,
        borderRadius: 3,
        marginTop: spacing.md,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: colors.primary.teal,
        borderRadius: 3,
    },
    milestonesSection: {
        marginTop: spacing.sm,
        marginBottom: spacing.md,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        marginBottom: spacing.md,
    },
    sectionTitle: {
        fontSize: typography.size.lg,
        fontWeight: 'bold',
        color: colors.text.primary,
    },
    sectionSubtitle: {
        fontSize: 12,
        fontWeight: 'bold',
        color: colors.primary.teal,
    },
    milestonesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.sm,
    },
    milestoneBadge: {
        width: '31%',
        alignItems: 'center',
        paddingVertical: spacing.md,
        backgroundColor: colors.background.card,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: colors.background.secondary,
    },
    milestoneBadgeAchieved: {
        borderColor: colors.primary.teal + '40',
        backgroundColor: colors.primary.teal + '05',
    },
    milestoneBadgeCurrent: {
        borderColor: colors.primary.violet,
        backgroundColor: colors.primary.violet + '05',
    },
    badgeIconContainer: {
        width: 48,
        height: 48,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 4,
    },
    achievementOverlay: {
        position: 'absolute',
        bottom: 4,
        right: 4,
        backgroundColor: colors.background.card,
        borderRadius: 7,
    },
    milestoneLabel: {
        fontSize: 10,
        fontWeight: 'bold',
        color: colors.text.muted,
        textAlign: 'center',
    },
    milestoneLabelAchieved: {
        color: colors.text.primary,
    },
    slipCard: {
        marginTop: spacing.sm,
        padding: spacing.lg,
        borderRadius: 20,
        borderStyle: 'dashed',
        borderWidth: 1,
        borderColor: colors.primary.violet + '40',
    },
    slipHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    slipContent: {
        flex: 1,
        marginLeft: spacing.md,
    },
    slipTitle: {
        fontSize: typography.size.base,
        fontWeight: 'bold',
        color: colors.text.primary,
    },
    slipText: {
        fontSize: 12,
        color: colors.text.secondary,
        marginTop: 2,
    },
    slipButton: {
        marginTop: spacing.md,
        borderColor: colors.primary.violet,
    },
    emptyState: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing.xl,
    },
    emptyTitle: {
        fontSize: typography.size.xl,
        fontWeight: typography.weight.bold,
        color: colors.text.primary,
        marginBottom: spacing.sm,
    },
    emptyText: {
        fontSize: typography.size.base,
        color: colors.text.secondary,
        textAlign: 'center',
    },
    slipInsightsSection: {
        marginTop: spacing.md,
        marginBottom: spacing.md,
    },
    bottomPadding: {
        height: 100,
    },
    quickAccessSection: {
        marginTop: spacing.md,
        marginBottom: spacing.md,
    },
    quickAccessGrid: {
        flexDirection: 'row',
        gap: spacing.sm,
    },
    quickAccessCard: {
        flex: 1,
        alignItems: 'center',
        padding: spacing.md,
        borderRadius: 16,
    },
    quickAccessIcon: {
        width: 44,
        height: 44,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.sm,
    },
    quickAccessTitle: {
        fontSize: typography.size.xs,
        fontWeight: '600',
        textAlign: 'center',
    },
});

export default ProgressScreen;

// --- End of ProgressScreen.js ---
