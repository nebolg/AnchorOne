// Author: -GLOBENXCC-
// OS support: iOS, Android, Web
// Description: Weekly progress summary screen with stats and insights

import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../components/common';
import { useColors, spacing, typography } from '../theme';
import { useUserStore, useSobrietyStore } from '../store';
import { useMoodStore } from '../store/moodStore';
import { useMoneySavedStore } from '../store/moneySavedStore';
import { useChallengeStore } from '../store/challengeStore';
import { useAchievementStore } from '../store/achievementStore';
import { differenceInDays, subDays, format } from 'date-fns';

export const WeeklyProgressScreen = ({ navigation }) => {
    const colors = useColors();
    const { userAddictions } = useUserStore();
    const { cravingLogs, slipLogs } = useSobrietyStore();
    const { getWeeklyMoods, getAverageMood, getMoodTrend } = useMoodStore();
    const { calculateTotalSavings, formatCurrency } = useMoneySavedStore();
    const { getActiveChallenges, getChallengeProgress } = useChallengeStore();
    const { getUnlockedCount, newUnlocks, clearNewUnlocks } = useAchievementStore();

    const weekStart = subDays(new Date(), 7);
    const weekEnd = new Date();

    const weeklyStats = useMemo(() => {
        const daysCleanThisWeek = userAddictions.reduce((total, addiction) => {
            if (!addiction.startDate) return total;
            const startDate = new Date(addiction.startDate);
            if (startDate > weekEnd) return total;
            const daysActive = Math.min(7, differenceInDays(weekEnd, Math.max(startDate, weekStart)));
            return total + Math.max(0, daysActive);
        }, 0);

        const cravingsThisWeek = cravingLogs.filter(c => {
            const date = new Date(c.createdAt);
            return date >= weekStart;
        });

        const slipsThisWeek = (slipLogs || []).filter(s => {
            const date = new Date(s.createdAt);
            return date >= weekStart;
        });

        const avgCravingIntensity = cravingsThisWeek.length > 0
            ? cravingsThisWeek.reduce((sum, c) => sum + c.intensity, 0) / cravingsThisWeek.length
            : 0;

        const weeklyMoods = getWeeklyMoods();
        const avgMood = getAverageMood(7);
        const moodTrend = getMoodTrend();

        const moneySaved = calculateTotalSavings(userAddictions);
        const weeklySavings = moneySaved / Math.max(1, differenceInDays(weekEnd, weekStart));

        const activeChallenges = getActiveChallenges();
        const challengeProgress = activeChallenges.map(c => ({
            name: c.name,
            progress: getChallengeProgress(c.id),
        }));

        const newAchievements = newUnlocks.length;

        return {
            daysCleanThisWeek,
            cravingsCount: cravingsThisWeek.length,
            slipsCount: slipsThisWeek.length,
            avgCravingIntensity,
            moodCheckIns: weeklyMoods.length,
            avgMood,
            moodTrend,
            moneySaved,
            weeklySavings: weeklySavings * 7,
            challengeProgress,
            newAchievements,
            totalAchievements: getUnlockedCount(),
        };
    }, [userAddictions, cravingLogs, slipLogs]);

    const getMoodLabel = (avg) => {
        if (!avg) return 'No data';
        if (avg <= 1.5) return 'Great';
        if (avg <= 2.5) return 'Good';
        if (avg <= 3.5) return 'Okay';
        if (avg <= 4.5) return 'Low';
        return 'Struggling';
    };

    const getTrendEmoji = (trend) => {
        switch (trend) {
            case 'improving': return '📈';
            case 'declining': return '📉';
            case 'stable': return '➡️';
            default: return '❓';
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
            <SafeAreaView edges={['top']} style={styles.safeArea}>
                <View style={[styles.header, { borderBottomColor: colors.border }]}>
                    <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
                    </Pressable>
                    <Text style={[styles.headerTitle, { color: colors.text.primary }]}>Weekly Progress</Text>
                    <View style={styles.placeholder} />
                </View>

                <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
                    {/* Date Range */}
                    <Text style={[styles.dateRange, { color: colors.text.muted }]}>
                        {format(weekStart, 'MMM d')} - {format(weekEnd, 'MMM d, yyyy')}
                    </Text>

                    {/* Hero Stats */}
                    <Card style={styles.heroCard}>
                        <Ionicons name="trophy" size={40} color="#F59E0B" />
                        <Text style={[styles.heroTitle, { color: colors.text.primary }]}>
                            {weeklyStats.daysCleanThisWeek} Clean Days
                        </Text>
                        <Text style={[styles.heroSubtitle, { color: colors.text.secondary }]}>
                            This week you stayed strong!
                        </Text>
                    </Card>

                    {/* Quick Stats Grid */}
                    <View style={styles.statsGrid}>
                        <View style={[styles.statBox, { backgroundColor: colors.background.card }]}>
                            <Ionicons name="flame" size={24} color="#F97316" />
                            <Text style={[styles.statValue, { color: colors.text.primary }]}>
                                {weeklyStats.cravingsCount}
                            </Text>
                            <Text style={[styles.statLabel, { color: colors.text.muted }]}>Cravings</Text>
                        </View>

                        <View style={[styles.statBox, { backgroundColor: colors.background.card }]}>
                            <Ionicons name="reload" size={24} color="#EF4444" />
                            <Text style={[styles.statValue, { color: colors.text.primary }]}>
                                {weeklyStats.slipsCount}
                            </Text>
                            <Text style={[styles.statLabel, { color: colors.text.muted }]}>Slips</Text>
                        </View>

                        <View style={[styles.statBox, { backgroundColor: colors.background.card }]}>
                            <Ionicons name="happy" size={24} color="#8B5CF6" />
                            <Text style={[styles.statValue, { color: colors.text.primary }]}>
                                {weeklyStats.moodCheckIns}
                            </Text>
                            <Text style={[styles.statLabel, { color: colors.text.muted }]}>Check-ins</Text>
                        </View>

                        <View style={[styles.statBox, { backgroundColor: colors.background.card }]}>
                            <Ionicons name="star" size={24} color="#F59E0B" />
                            <Text style={[styles.statValue, { color: colors.text.primary }]}>
                                {weeklyStats.newAchievements}
                            </Text>
                            <Text style={[styles.statLabel, { color: colors.text.muted }]}>New Badges</Text>
                        </View>
                    </View>

                    {/* Mood Summary */}
                    <Text style={[styles.sectionTitle, { color: colors.text.muted }]}>Mood Summary</Text>
                    <Card style={styles.moodCard}>
                        <View style={styles.moodRow}>
                            <View>
                                <Text style={[styles.moodLabel, { color: colors.text.secondary }]}>
                                    Average Mood
                                </Text>
                                <Text style={[styles.moodValue, { color: colors.text.primary }]}>
                                    {getMoodLabel(weeklyStats.avgMood)}
                                </Text>
                            </View>
                            <View>
                                <Text style={[styles.moodLabel, { color: colors.text.secondary }]}>
                                    Trend
                                </Text>
                                <Text style={[styles.moodValue, { color: colors.text.primary }]}>
                                    {getTrendEmoji(weeklyStats.moodTrend)} {weeklyStats.moodTrend || 'Need more data'}
                                </Text>
                            </View>
                        </View>
                    </Card>

                    {/* Money Saved */}
                    <Text style={[styles.sectionTitle, { color: colors.text.muted }]}>Financial Impact</Text>
                    <Card style={styles.moneyCard}>
                        <Ionicons name="wallet" size={32} color="#10B981" />
                        <View style={styles.moneyContent}>
                            <Text style={[styles.moneyValue, { color: colors.text.primary }]}>
                                {formatCurrency(weeklyStats.weeklySavings)}
                            </Text>
                            <Text style={[styles.moneyLabel, { color: colors.text.secondary }]}>
                                Saved this week
                            </Text>
                        </View>
                    </Card>

                    {/* Challenge Progress */}
                    {weeklyStats.challengeProgress.length > 0 && (
                        <>
                            <Text style={[styles.sectionTitle, { color: colors.text.muted }]}>
                                Active Challenges
                            </Text>
                            {weeklyStats.challengeProgress.map((challenge, i) => (
                                <View
                                    key={i}
                                    style={[styles.challengeRow, { backgroundColor: colors.background.card }]}
                                >
                                    <Text style={[styles.challengeName, { color: colors.text.primary }]}>
                                        {challenge.name}
                                    </Text>
                                    <View style={styles.challengeProgress}>
                                        <View style={[styles.progressBar, { backgroundColor: colors.background.secondary }]}>
                                            <View
                                                style={[
                                                    styles.progressFill,
                                                    {
                                                        width: `${challenge.progress?.percentage || 0}%`,
                                                        backgroundColor: colors.primary.teal,
                                                    },
                                                ]}
                                            />
                                        </View>
                                        <Text style={[styles.progressText, { color: colors.text.muted }]}>
                                            {Math.round(challenge.progress?.percentage || 0)}%
                                        </Text>
                                    </View>
                                </View>
                            ))}
                        </>
                    )}

                    {/* Encouragement */}
                    <Card style={[styles.encouragementCard, { borderColor: colors.primary.teal }]}>
                        <Ionicons name="heart" size={24} color={colors.primary.teal} />
                        <Text style={[styles.encouragementText, { color: colors.text.primary }]}>
                            Every day is progress. Keep going - you're doing amazing! 💪
                        </Text>
                    </Card>

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
    dateRange: {
        fontSize: typography.size.sm,
        textAlign: 'center',
        marginBottom: spacing.md,
    },
    heroCard: {
        alignItems: 'center',
        padding: spacing.xl,
        marginBottom: spacing.lg,
    },
    heroTitle: {
        fontSize: typography.size['2xl'],
        fontWeight: '700',
        marginTop: spacing.md,
    },
    heroSubtitle: {
        fontSize: typography.size.base,
        marginTop: spacing.xs,
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.sm,
        marginBottom: spacing.lg,
    },
    statBox: {
        width: '48%',
        alignItems: 'center',
        padding: spacing.md,
        borderRadius: 16,
    },
    statValue: {
        fontSize: typography.size.xl,
        fontWeight: '700',
        marginTop: spacing.sm,
    },
    statLabel: {
        fontSize: typography.size.xs,
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
    moodCard: {
        marginBottom: spacing.lg,
    },
    moodRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    moodLabel: {
        fontSize: typography.size.sm,
    },
    moodValue: {
        fontSize: typography.size.lg,
        fontWeight: '600',
        marginTop: 4,
    },
    moneyCard: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
        marginBottom: spacing.lg,
    },
    moneyContent: {
        flex: 1,
    },
    moneyValue: {
        fontSize: typography.size.xl,
        fontWeight: '700',
    },
    moneyLabel: {
        fontSize: typography.size.sm,
    },
    challengeRow: {
        padding: spacing.md,
        borderRadius: 12,
        marginBottom: spacing.sm,
    },
    challengeName: {
        fontSize: typography.size.base,
        fontWeight: '500',
        marginBottom: spacing.sm,
    },
    challengeProgress: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
    },
    progressBar: {
        flex: 1,
        height: 6,
        borderRadius: 3,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        borderRadius: 3,
    },
    progressText: {
        fontSize: typography.size.sm,
        width: 36,
    },
    encouragementCard: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
        marginTop: spacing.lg,
        borderWidth: 1,
    },
    encouragementText: {
        flex: 1,
        fontSize: typography.size.base,
        lineHeight: 22,
    },
    bottomPadding: {
        height: 40,
    },
});

export default WeeklyProgressScreen;

// --- End of WeeklyProgressScreen.js ---
