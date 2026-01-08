// Author: -GLOBENXCC-
// OS support: iOS, Android, Web
// Description: Advanced analytics dashboard with comprehensive recovery statistics

import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../components/common';
import { useColors, spacing, typography } from '../theme';
import { useUserStore, useSobrietyStore } from '../store';
import { useMoodStore } from '../store/moodStore';
import { useMoneySavedStore } from '../store/moneySavedStore';
import { IconRenderer } from '../components/common/IconRenderer';
import { differenceInDays, differenceInHours, format, subDays, startOfDay } from 'date-fns';

const StatCard = ({ icon, label, value, subtitle, color, colors }) => (
    <Card style={styles.statCard}>
        <View style={[styles.statIconBg, { backgroundColor: color + '20' }]}>
            <Ionicons name={icon} size={20} color={color} />
        </View>
        <Text style={[styles.statValue, { color: colors.text.primary }]}>{value}</Text>
        <Text style={[styles.statLabel, { color: colors.text.muted }]}>{label}</Text>
        {subtitle && <Text style={[styles.statSubtitle, { color: colors.text.secondary }]}>{subtitle}</Text>}
    </Card>
);

export const AnalyticsDashboardScreen = ({ navigation }) => {
    const colors = useColors();
    const { userAddictions } = useUserStore();
    const { cravingLogs, slipLogs } = useSobrietyStore();
    const { moodEntries, getAverageMood, getMoodTrend } = useMoodStore();
    const { calculateSavings, calculateTotalSavings, formatCurrency } = useMoneySavedStore();

    // Addiction filter: 'all' or addiction.id
    const [selectedAddiction, setSelectedAddiction] = useState('all');

    // Filter addictions based on selection
    const filteredAddictions = useMemo(() => {
        if (selectedAddiction === 'all') return userAddictions;
        return userAddictions.filter(a => a.id === selectedAddiction);
    }, [selectedAddiction, userAddictions]);

    // Filter logs by addiction
    const filteredCravings = useMemo(() => {
        if (selectedAddiction === 'all') return cravingLogs;
        return cravingLogs.filter(c => c.addictionId === selectedAddiction);
    }, [selectedAddiction, cravingLogs]);

    const filteredSlips = useMemo(() => {
        if (selectedAddiction === 'all') return slipLogs || [];
        return (slipLogs || []).filter(s => s.addictionId === selectedAddiction);
    }, [selectedAddiction, slipLogs]);

    const stats = useMemo(() => {
        const totalDaysClean = filteredAddictions.reduce((total, addiction) => {
            if (!addiction.startDate) return total;
            return total + differenceInDays(new Date(), new Date(addiction.startDate));
        }, 0);

        const totalHoursClean = filteredAddictions.reduce((total, addiction) => {
            if (!addiction.startDate) return total;
            return total + differenceInHours(new Date(), new Date(addiction.startDate));
        }, 0);

        const longestStreak = filteredAddictions.reduce((max, addiction) => {
            if (!addiction.startDate) return max;
            const days = differenceInDays(new Date(), new Date(addiction.startDate));
            return Math.max(max, days);
        }, 0);

        const totalCravings = filteredCravings.length;
        const avgCravingIntensity = totalCravings > 0
            ? (filteredCravings.reduce((sum, c) => sum + c.intensity, 0) / totalCravings).toFixed(1)
            : 0;

        const cravingsThisWeek = filteredCravings.filter(c => {
            const date = new Date(c.createdAt);
            return date >= subDays(new Date(), 7);
        }).length;

        const slipsTotal = filteredSlips.length;
        const slipsThisMonth = filteredSlips.filter(s => {
            const date = new Date(s.createdAt);
            return date >= subDays(new Date(), 30);
        }).length;

        // Calculate money saved for selected addiction(s)
        const moneySaved = selectedAddiction === 'all'
            ? calculateTotalSavings(userAddictions)
            : filteredAddictions.reduce((total, a) => total + calculateSavings(a.addictionId, a.startDate), 0);

        const avgMood = getAverageMood(7);
        const moodTrend = getMoodTrend();

        const peakCravingHour = (() => {
            const hourCounts = Array(24).fill(0);
            cravingLogs.forEach(log => {
                const hour = new Date(log.createdAt).getHours();
                hourCounts[hour]++;
            });
            const maxHour = hourCounts.indexOf(Math.max(...hourCounts));
            if (Math.max(...hourCounts) === 0) return null;
            const ampm = maxHour >= 12 ? 'PM' : 'AM';
            const displayHour = maxHour % 12 || 12;
            return `${displayHour} ${ampm}`;
        })();

        const peakCravingDay = (() => {
            const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            const dayCounts = Array(7).fill(0);
            cravingLogs.forEach(log => {
                const day = new Date(log.createdAt).getDay();
                dayCounts[day]++;
            });
            const maxDay = dayCounts.indexOf(Math.max(...dayCounts));
            if (Math.max(...dayCounts) === 0) return null;
            return days[maxDay];
        })();

        return {
            totalDaysClean,
            totalHoursClean,
            longestStreak,
            totalCravings,
            avgCravingIntensity,
            cravingsThisWeek,
            slipsTotal,
            slipsThisMonth,
            moneySaved,
            avgMood,
            moodTrend,
            peakCravingHour,
            peakCravingDay,
        };
    }, [filteredAddictions, filteredCravings, filteredSlips, selectedAddiction, moodEntries]);

    const formatTime = (hours) => {
        const days = Math.floor(hours / 24);
        const remainingHours = hours % 24;
        if (days > 0) {
            return `${days}d ${remainingHours}h`;
        }
        return `${remainingHours}h`;
    };

    const getMoodLabel = (avg) => {
        if (!avg) return 'No data';
        if (avg <= 1.5) return 'Great';
        if (avg <= 2.5) return 'Good';
        if (avg <= 3.5) return 'Okay';
        if (avg <= 4.5) return 'Low';
        return 'Struggling';
    };

    const getTrendIcon = (trend) => {
        switch (trend) {
            case 'improving': return 'trending-up';
            case 'declining': return 'trending-down';
            case 'stable': return 'remove';
            default: return 'help-circle';
        }
    };

    const getTrendColor = (trend) => {
        switch (trend) {
            case 'improving': return '#10B981';
            case 'declining': return '#EF4444';
            case 'stable': return '#FBBF24';
            default: return colors.text.muted;
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
            <SafeAreaView edges={['top']} style={styles.safeArea}>
                <View style={[styles.header, { borderBottomColor: colors.border }]}>
                    <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
                    </Pressable>
                    <Text style={[styles.headerTitle, { color: colors.text.primary }]}>Analytics Dashboard</Text>
                    <View style={styles.placeholder} />
                </View>

                {/* Addiction Filter Tabs */}
                <View style={styles.filterContainer}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
                        <Pressable
                            onPress={() => setSelectedAddiction('all')}
                            style={[
                                styles.filterTab,
                                { backgroundColor: selectedAddiction === 'all' ? colors.primary.teal : colors.background.card }
                            ]}
                        >
                            <Ionicons name="grid" size={14} color={selectedAddiction === 'all' ? '#fff' : colors.text.secondary} />
                            <Text style={[styles.filterTabText, { color: selectedAddiction === 'all' ? '#fff' : colors.text.secondary }]}>All</Text>
                        </Pressable>
                        {userAddictions.map(addiction => (
                            <Pressable
                                key={addiction.id}
                                onPress={() => setSelectedAddiction(addiction.id)}
                                style={[
                                    styles.filterTab,
                                    { backgroundColor: selectedAddiction === addiction.id ? colors.primary.teal : colors.background.card }
                                ]}
                            >
                                <IconRenderer
                                    library={addiction.library || 'Ionicons'}
                                    name={addiction.icon}
                                    size={14}
                                    color={selectedAddiction === addiction.id ? '#fff' : colors.text.secondary}
                                />
                                <Text style={[styles.filterTabText, { color: selectedAddiction === addiction.id ? '#fff' : colors.text.secondary }]}>
                                    {addiction.name.split(' ')[0]}
                                </Text>
                            </Pressable>
                        ))}
                    </ScrollView>
                </View>

                <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
                    {/* Time Recovered */}
                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, { color: colors.text.muted }]}>Time Recovered</Text>
                        <View style={styles.statsRow}>
                            <StatCard
                                icon="time"
                                label="Total Days Clean"
                                value={stats.totalDaysClean}
                                subtitle="across all addictions"
                                color={colors.primary.teal}
                                colors={colors}
                            />
                            <StatCard
                                icon="trophy"
                                label="Longest Streak"
                                value={`${stats.longestStreak} days`}
                                subtitle="personal best"
                                color="#F59E0B"
                                colors={colors}
                            />
                        </View>
                    </View>

                    {/* Financial Impact */}
                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, { color: colors.text.muted }]}>Financial Impact</Text>
                        <Card style={styles.bigStatCard}>
                            <Ionicons name="wallet" size={32} color="#10B981" />
                            <Text style={[styles.bigStatValue, { color: colors.text.primary }]}>
                                {formatCurrency(stats.moneySaved)}
                            </Text>
                            <Text style={[styles.bigStatLabel, { color: colors.text.secondary }]}>
                                Total money saved
                            </Text>
                        </Card>
                    </View>

                    {/* Craving Insights */}
                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, { color: colors.text.muted }]}>Craving Insights</Text>
                        <View style={styles.statsRow}>
                            <StatCard
                                icon="flame"
                                label="Total Cravings"
                                value={stats.totalCravings}
                                subtitle={`${stats.cravingsThisWeek} this week`}
                                color="#F97316"
                                colors={colors}
                            />
                            <StatCard
                                icon="speedometer"
                                label="Avg Intensity"
                                value={`${stats.avgCravingIntensity}/10`}
                                color={colors.primary.blue}
                                colors={colors}
                            />
                        </View>

                        {stats.peakCravingHour && stats.peakCravingDay && (
                            <Card style={styles.patternCard}>
                                <Ionicons name="bulb" size={20} color={colors.primary.teal} />
                                <View style={styles.patternContent}>
                                    <Text style={[styles.patternTitle, { color: colors.text.primary }]}>
                                        Peak Craving Pattern
                                    </Text>
                                    <Text style={[styles.patternText, { color: colors.text.secondary }]}>
                                        Your cravings tend to peak on {stats.peakCravingDay}s around {stats.peakCravingHour}.
                                        Consider planning extra coping strategies for these times.
                                    </Text>
                                </View>
                            </Card>
                        )}
                    </View>

                    {/* Mood & Wellbeing */}
                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, { color: colors.text.muted }]}>Mood & Wellbeing</Text>
                        <View style={styles.statsRow}>
                            <StatCard
                                icon="happy"
                                label="Avg Mood (7d)"
                                value={getMoodLabel(stats.avgMood)}
                                color="#8B5CF6"
                                colors={colors}
                            />
                            <Card style={styles.statCard}>
                                <View style={[styles.statIconBg, { backgroundColor: getTrendColor(stats.moodTrend) + '20' }]}>
                                    <Ionicons name={getTrendIcon(stats.moodTrend)} size={20} color={getTrendColor(stats.moodTrend)} />
                                </View>
                                <Text style={[styles.statValue, { color: colors.text.primary }]}>
                                    {stats.moodTrend === 'improving' ? 'Improving' :
                                        stats.moodTrend === 'declining' ? 'Declining' :
                                            stats.moodTrend === 'stable' ? 'Stable' : 'Need data'}
                                </Text>
                                <Text style={[styles.statLabel, { color: colors.text.muted }]}>Mood Trend</Text>
                            </Card>
                        </View>
                    </View>

                    {/* Slips */}
                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, { color: colors.text.muted }]}>Slip History</Text>
                        <View style={styles.statsRow}>
                            <StatCard
                                icon="reload"
                                label="Total Slips"
                                value={stats.slipsTotal}
                                subtitle={`${stats.slipsThisMonth} this month`}
                                color="#EF4444"
                                colors={colors}
                            />
                            <Pressable
                                onPress={() => navigation.navigate('SlipAnalytics')}
                                style={({ pressed }) => [
                                    styles.actionCard,
                                    { backgroundColor: colors.background.card, opacity: pressed ? 0.9 : 1 }
                                ]}
                            >
                                <Ionicons name="analytics" size={24} color={colors.primary.teal} />
                                <Text style={[styles.actionCardText, { color: colors.text.primary }]}>
                                    View Detailed Analysis
                                </Text>
                                <Ionicons name="chevron-forward" size={20} color={colors.text.muted} />
                            </Pressable>
                        </View>
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
    section: {
        marginBottom: spacing.xl,
    },
    sectionTitle: {
        fontSize: typography.size.sm,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: spacing.sm,
        marginLeft: spacing.xs,
    },
    statsRow: {
        flexDirection: 'row',
        gap: spacing.sm,
    },
    statCard: {
        flex: 1,
        alignItems: 'center',
        padding: spacing.md,
    },
    statIconBg: {
        width: 40,
        height: 40,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.sm,
    },
    statValue: {
        fontSize: typography.size.xl,
        fontWeight: '700',
    },
    statLabel: {
        fontSize: typography.size.xs,
        textTransform: 'uppercase',
        marginTop: 2,
    },
    statSubtitle: {
        fontSize: typography.size.xs,
        marginTop: 4,
    },
    bigStatCard: {
        alignItems: 'center',
        padding: spacing.xl,
    },
    bigStatValue: {
        fontSize: typography.size['3xl'],
        fontWeight: '700',
        marginTop: spacing.md,
    },
    bigStatLabel: {
        fontSize: typography.size.base,
        marginTop: spacing.xs,
    },
    patternCard: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginTop: spacing.sm,
        padding: spacing.md,
        gap: spacing.md,
    },
    patternContent: {
        flex: 1,
    },
    patternTitle: {
        fontSize: typography.size.base,
        fontWeight: '600',
        marginBottom: 4,
    },
    patternText: {
        fontSize: typography.size.sm,
        lineHeight: 20,
    },
    actionCard: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.md,
        borderRadius: 16,
        gap: spacing.sm,
    },
    actionCardText: {
        flex: 1,
        fontSize: typography.size.sm,
        fontWeight: '500',
    },
    bottomPadding: {
        height: 40,
    },
    filterContainer: {
        paddingVertical: spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: 'transparent',
    },
    filterScroll: {
        paddingHorizontal: spacing.md,
        gap: spacing.sm,
    },
    filterTab: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: 20,
        gap: 6,
    },
    filterTabText: {
        fontSize: typography.size.sm,
        fontWeight: '600',
    },
});

export default AnalyticsDashboardScreen;

// --- End of AnalyticsDashboardScreen.js ---
