// Author: -GLOBENXCC-
// OS support: iOS, Android, Web
// Description: Insights screen with real data analytics, pattern recognition, and heatmap visualization

import React, { useMemo } from 'react';
import { StyleSheet, ScrollView, View, Text, Dimensions, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../components/common';
import { useColors, colors, spacing, typography, lightColors as defaultColors } from '../theme';
import { useUserStore, useSobrietyStore } from '../store';
import { startOfDay, endOfDay, eachDayOfInterval, subDays, format, getHours, getDay } from 'date-fns';

const { width } = Dimensions.get('window');

const InsightCard = ({ icon, title, value, description, color, colors }) => (
    <Card style={styles.insightCard}>
        <View style={[styles.insightIconContainer, { backgroundColor: color + '20' }]}>
            <Ionicons name={icon} size={18} color={color} />
        </View>
        <Text style={[styles.insightTitle, { color: colors.text.muted }]}>{title}</Text>
        <Text style={[styles.insightValue, { color }]}>{value}</Text>
        <Text style={[styles.insightDescription, { color: colors.text.muted }]}>{description}</Text>
    </Card>
);

const HeatmapCell = ({ intensity, colors }) => {
    const opacity = intensity === 0 ? 0.05 : Math.min(0.2 + (intensity / 10) * 0.8, 1);
    const bgColor = intensity === 0 ? colors.background.secondary : colors.primary.teal;

    return (
        <View style={[
            styles.heatmapCell,
            { backgroundColor: bgColor, opacity }
        ]} />
    );
};

export const InsightsScreen = ({ navigation }) => {
    const themeColors = useColors();
    const { cravingLogs, moodLogs } = useSobrietyStore();
    const { userAddictions } = useUserStore();

    const stats = useMemo(() => {
        const totalCravings = cravingLogs.length;
        const avgIntensity = totalCravings > 0
            ? (cravingLogs.reduce((sum, c) => sum + c.intensity, 0) / totalCravings).toFixed(1)
            : 0;
        const avgMood = moodLogs.length > 0
            ? (moodLogs.reduce((sum, m) => sum + m.mood, 0) / moodLogs.length).toFixed(1)
            : 0;

        // Process Heatmap (Last 7 Days)
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const heatmap = days.map((dayName, index) => {
            // Hours are 0-23. We'll bucket them into 2-hour blocks for better UI fit (12 blocks)
            const hours = Array(12).fill(0);

            cravingLogs.forEach(log => {
                const date = new Date(log.createdAt);
                if (getDay(date) === index) {
                    const hourBlock = Math.floor(getHours(date) / 2);
                    hours[hourBlock] = Math.max(hours[hourBlock], log.intensity);
                }
            });

            return { day: dayName, hours };
        });

        // Trigger Analysis
        const triggerCounts = {};
        cravingLogs.forEach(log => {
            if (log.trigger) {
                triggerCounts[log.trigger] = (triggerCounts[log.trigger] || 0) + 1;
            }
        });

        const sortedTriggers = Object.entries(triggerCounts)
            .map(([name, count]) => ({
                name,
                percentage: Math.round((count / totalCravings) * 100),
                color: defaultColors.primary.teal
            }))
            .sort((a, b) => b.percentage - a.percentage)
            .slice(0, 4);

        // Fallback for empty triggers
        const displayTriggers = sortedTriggers.length > 0 ? sortedTriggers : [
            { name: 'No triggers logged yet', percentage: 0, color: defaultColors.text.muted }
        ];

        // AI Pattern recognition
        let peakText = "Steady as she goes. No major craving peaks detected yet.";
        if (totalCravings > 0) {
            const hourCounts = Array(24).fill(0);
            cravingLogs.forEach(log => {
                const hour = getHours(new Date(log.createdAt));
                hourCounts[hour]++;
            });
            const peakHour = hourCounts.indexOf(Math.max(...hourCounts));
            const ampm = peakHour >= 12 ? 'PM' : 'AM';
            const displayHour = peakHour % 12 || 12;

            if (Math.max(...hourCounts) > 1) {
                peakText = `Your cravings peak around ${displayHour} ${ampm}. Consider scheduling a distraction like a walk or meditation during this window.`;
            }
        }

        return {
            totalCravings,
            avgIntensity,
            avgMood,
            heatmap,
            triggers: displayTriggers,
            aiText: peakText
        };
    }, [cravingLogs, moodLogs]);

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background.primary }]}>
            <View style={styles.header}>
                <Text style={[styles.title, { color: themeColors.text.primary }]}>Insights</Text>
                <Text style={[styles.subtitle, { color: themeColors.text.secondary }]}>Patterns to help you understand your habits better</Text>
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Quick stats */}
                <View style={styles.statsGrid}>
                    <InsightCard
                        icon="bar-chart"
                        title="Total Cravings"
                        value={stats.totalCravings}
                        description="All-time logs"
                        color={themeColors.primary.blue}
                        colors={themeColors}
                    />
                    <InsightCard
                        icon="flame"
                        title="Avg Intensity"
                        value={`${stats.avgIntensity}/10`}
                        description="Craving strength"
                        color={themeColors.status.warning}
                        colors={themeColors}
                    />
                    <InsightCard
                        icon="happy"
                        title="Avg Mood"
                        value={`${stats.avgMood}/5`}
                        description="Daily average"
                        color={themeColors.status.success}
                        colors={themeColors}
                    />
                </View>

                {/* Health Timeline Card */}
                <Pressable
                    onPress={() => navigation.navigate('HealthTimeline')}
                    style={({ pressed }) => [
                        styles.healthCard,
                        { backgroundColor: themeColors.background.card, opacity: pressed ? 0.9 : 1 }
                    ]}
                >
                    <View style={[styles.healthIconBg, { backgroundColor: '#10B98120' }]}>
                        <Ionicons name="fitness" size={24} color="#10B981" />
                    </View>
                    <View style={styles.healthContent}>
                        <Text style={[styles.healthTitle, { color: themeColors.text.primary }]}>Your Body's Recovery</Text>
                        <Text style={[styles.healthSubtitle, { color: themeColors.text.secondary }]}>See how your body is healing</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color={themeColors.text.muted} />
                </Pressable>

                {/* Craving Heatmap */}
                <Card style={styles.heatmapCard}>
                    <Text style={[styles.sectionTitle, { color: themeColors.text.primary }]}>Craving Heatmap</Text>
                    <Text style={[styles.sectionSubtitle, { color: themeColors.text.muted }]}>Intensity patterns by time of day</Text>

                    <View style={styles.heatmapContainer}>
                        {/* Time labels - perfectly aligned with 12 blocks (2hrs each) */}
                        <View style={styles.heatmapTimeLabels}>
                            {['12a', '4a', '8a', '12p', '4p', '8p'].map((time, i) => (
                                <Text key={i} style={styles.heatmapTimeLabel}>{time}</Text>
                            ))}
                        </View>

                        {/* Grid */}
                        <View style={styles.heatmapGrid}>
                            {stats.heatmap.map((dayData, dayIndex) => (
                                <View key={dayIndex} style={styles.heatmapRow}>
                                    <Text style={styles.heatmapDayLabel}>{dayData.day}</Text>
                                    <View style={styles.cellsRow}>
                                        {dayData.hours.map((intensity, hourIndex) => (
                                            <HeatmapCell key={hourIndex} intensity={intensity} colors={colors} />
                                        ))}
                                    </View>
                                </View>
                            ))}
                        </View>
                    </View>

                    <View style={styles.heatmapLegend}>
                        <Text style={styles.legendLabel}>Low</Text>
                        <View style={styles.legendGradient}>
                            {[0, 3, 5, 8, 10].map((val, i) => (
                                <HeatmapCell key={i} intensity={val} colors={colors} />
                            ))}
                        </View>
                        <Text style={styles.legendLabel}>High</Text>
                    </View>
                </Card>

                {/* Trigger Analysis */}
                <Card style={styles.triggerCard}>
                    <Text style={styles.sectionTitle}>Common Triggers</Text>
                    <Text style={styles.sectionSubtitle}>Situations that spark cravings</Text>

                    {stats.triggers.map((trigger, index) => (
                        <View key={index} style={styles.triggerItem}>
                            <View style={styles.triggerInfo}>
                                <Text style={styles.triggerName}>{trigger.name}</Text>
                                <Text style={styles.triggerPercentage}>{trigger.percentage}%</Text>
                            </View>
                            <View style={styles.triggerBar}>
                                <View
                                    style={[
                                        styles.triggerFill,
                                        {
                                            width: `${Math.max(trigger.percentage, 2)}%`,
                                            backgroundColor: trigger.color,
                                        }
                                    ]}
                                />
                            </View>
                        </View>
                    ))}
                </Card>

                {/* Pattern Insight */}
                <Card style={styles.aiCard}>
                    <View style={styles.aiHeader}>
                        <Ionicons name="bulb" size={20} color={colors.primary.teal} style={{ marginRight: spacing.sm }} />
                        <Text style={styles.aiTitle}>Pattern insight</Text>
                    </View>
                    <Text style={styles.aiText}>
                        "{stats.aiText}"
                    </Text>
                    <View style={styles.patternDisclaimer}>
                        <Ionicons name="information-circle-outline" size={14} color={themeColors.text.muted} style={{ marginRight: 6 }} />
                        <Text style={[styles.patternDisclaimerText, { color: themeColors.text.muted }]}>
                            This is based on your recent logs. It's meant for reflection, not medical advice.
                        </Text>
                    </View>
                </Card>

                {/* Quick Access */}
                <View style={styles.quickAccessSection}>
                    <Text style={[styles.sectionTitle, { color: themeColors.text.primary }]}>Quick Access</Text>
                    <View style={styles.quickAccessRow}>
                        <Pressable
                            onPress={() => navigation.navigate('TriggerProfile')}
                            style={[styles.quickAccessCard, { backgroundColor: themeColors.background.card }]}
                        >
                            <View style={[styles.quickAccessIcon, { backgroundColor: '#EF4444' }]}>
                                <Ionicons name="flame" size={18} color="#fff" />
                            </View>
                            <Text style={[styles.quickAccessTitle, { color: themeColors.text.primary }]}>My Triggers</Text>
                        </Pressable>

                        <Pressable
                            onPress={() => navigation.navigate('Challenges')}
                            style={[styles.quickAccessCard, { backgroundColor: themeColors.background.card }]}
                        >
                            <View style={[styles.quickAccessIcon, { backgroundColor: '#10B981' }]}>
                                <Ionicons name="fitness" size={18} color="#fff" />
                            </View>
                            <Text style={[styles.quickAccessTitle, { color: themeColors.text.primary }]}>Challenges</Text>
                        </Pressable>

                        <Pressable
                            onPress={() => navigation.navigate('CopingToolkit')}
                            style={[styles.quickAccessCard, { backgroundColor: themeColors.background.card }]}
                        >
                            <View style={[styles.quickAccessIcon, { backgroundColor: '#8B5CF6' }]}>
                                <Ionicons name="medkit" size={18} color="#fff" />
                            </View>
                            <Text style={[styles.quickAccessTitle, { color: themeColors.text.primary }]}>Coping Kit</Text>
                        </Pressable>

                        <Pressable
                            onPress={() => navigation.navigate('GuidedPrograms')}
                            style={[styles.quickAccessCard, { backgroundColor: themeColors.background.card }]}
                        >
                            <View style={[styles.quickAccessIcon, { backgroundColor: '#F59E0B' }]}>
                                <Ionicons name="school" size={18} color="#fff" />
                            </View>
                            <Text style={[styles.quickAccessTitle, { color: themeColors.text.primary }]}>Programs</Text>
                        </Pressable>
                    </View>
                </View>

                {/* Disclaimer */}
                <View style={styles.disclaimer}>
                    <Ionicons name="lock-closed" size={12} color={colors.text.muted} style={{ marginRight: 4 }} />
                    <Text style={styles.disclaimerText}>
                        Your data is stored locally. Only you can see these patterns.
                    </Text>
                </View>

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
        paddingVertical: spacing.md,
    },
    title: {
        fontSize: typography.size['2xl'],
        fontWeight: typography.weight.bold,
        color: colors.text.primary,
    },
    subtitle: {
        fontSize: typography.size.sm,
        color: colors.text.secondary,
        marginTop: spacing.xs,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: spacing.screenPadding,
    },
    statsGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: spacing.md,
    },
    healthCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.md,
        borderRadius: 16,
        marginBottom: spacing.md,
        borderWidth: 1,
        borderColor: '#10B98130',
    },
    healthIconBg: {
        width: 48,
        height: 48,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.md,
    },
    healthContent: {
        flex: 1,
    },
    healthTitle: {
        fontSize: typography.size.base,
        fontWeight: typography.weight.semibold,
    },
    healthSubtitle: {
        fontSize: typography.size.sm,
        marginTop: 2,
    },
    insightCard: {
        width: '31%',
        alignItems: 'center',
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.xs,
    },
    insightIconContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.xs,
    },
    insightIcon: {
        fontSize: 18,
    },
    insightTitle: {
        fontSize: 10,
        fontWeight: typography.weight.medium,
        color: colors.text.muted,
        textAlign: 'center',
        textTransform: 'uppercase',
    },
    insightValue: {
        fontSize: typography.size.lg,
        fontWeight: typography.weight.bold,
        marginVertical: 2,
    },
    insightDescription: {
        fontSize: 9,
        color: colors.text.muted,
        textAlign: 'center',
    },
    heatmapCard: {
        marginBottom: spacing.md,
    },
    sectionTitle: {
        fontSize: typography.size.base,
        fontWeight: typography.weight.bold,
        color: colors.text.primary,
    },
    sectionSubtitle: {
        fontSize: typography.size.xs,
        color: colors.text.muted,
        marginTop: 2,
        marginBottom: spacing.md,
    },
    heatmapContainer: {
        paddingLeft: spacing.xs,
    },
    heatmapTimeLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginLeft: 35, // Match day label width
        marginBottom: spacing.xs,
        paddingRight: spacing.xs,
    },
    heatmapTimeLabel: {
        fontSize: 9,
        color: colors.text.muted,
        width: 25,
        textAlign: 'center',
    },
    heatmapGrid: {
        width: '100%',
    },
    heatmapRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    heatmapDayLabel: {
        width: 30,
        fontSize: 10,
        fontWeight: typography.weight.semibold,
        color: colors.text.muted,
        marginRight: 5,
    },
    cellsRow: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    heatmapCell: {
        flex: 1,
        height: 18,
        marginHorizontal: 1,
        borderRadius: 3,
    },
    heatmapLegend: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        marginTop: spacing.md,
    },
    legendLabel: {
        fontSize: 10,
        color: colors.text.muted,
        marginHorizontal: spacing.xs,
    },
    legendGradient: {
        flexDirection: 'row',
        width: 80,
    },
    triggerCard: {
        marginBottom: spacing.md,
    },
    triggerItem: {
        marginBottom: spacing.sm,
    },
    triggerInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    triggerName: {
        fontSize: typography.size.sm,
        color: colors.text.primary,
    },
    triggerPercentage: {
        fontSize: typography.size.sm,
        fontWeight: typography.weight.bold,
        color: colors.primary.teal,
    },
    triggerBar: {
        height: 6,
        backgroundColor: colors.background.secondary,
        borderRadius: 3,
        overflow: 'hidden',
    },
    triggerFill: {
        height: '100%',
        borderRadius: 3,
    },
    aiCard: {
        backgroundColor: colors.primary.teal + '08',
        borderLeftWidth: 4,
        borderLeftColor: colors.primary.teal,
        marginBottom: spacing.md,
    },
    aiHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.xs,
    },
    aiIcon: {
        fontSize: 20,
        marginRight: spacing.sm,
    },
    aiTitle: {
        fontSize: typography.size.sm,
        fontWeight: typography.weight.bold,
        color: colors.primary.teal,
    },
    aiText: {
        fontSize: typography.size.sm,
        color: colors.text.primary,
        lineHeight: 20,
    },
    aiDisclaimer: {
        fontSize: 10,
        color: colors.text.muted,
        marginTop: spacing.sm,
        fontStyle: 'italic',
    },
    patternDisclaimer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginTop: spacing.md,
        paddingTop: spacing.sm,
        borderTopWidth: 1,
        borderTopColor: colors.background.secondary,
    },
    patternDisclaimerText: {
        flex: 1,
        fontSize: typography.size.xs,
        color: colors.text.muted,
        lineHeight: 16,
    },
    disclaimer: {
        padding: spacing.md,
        alignItems: 'center',
    },
    disclaimerText: {
        fontSize: typography.size.xs,
        color: colors.text.muted,
        textAlign: 'center',
    },
    bottomPadding: {
        height: 100,
    },
    quickAccessSection: {
        marginTop: spacing.lg,
        marginBottom: spacing.md,
    },
    quickAccessRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.sm,
        marginTop: spacing.sm,
    },
    quickAccessCard: {
        width: '48%',
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.md,
        borderRadius: 14,
    },
    quickAccessIcon: {
        width: 36,
        height: 36,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.sm,
    },
    quickAccessTitle: {
        fontSize: typography.size.sm,
        fontWeight: '600',
    },
});

export default InsightsScreen;

// --- End of InsightsScreen.js ---
