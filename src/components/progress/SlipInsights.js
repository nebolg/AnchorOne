// Author: -GLOBENXCC-
// OS support: iOS, Android, Web
// Description: Slip insights component showing history and analytics

import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Pressable, ActivityIndicator, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColors, colors, spacing, typography } from '../../theme';
import { Card } from '../common';
import api from '../../services/api';

const TRIGGER_LABELS = {
    stress: 'Stress',
    boredom: 'Boredom',
    social: 'Social Pressure',
    celebration: 'Celebration',
    loneliness: 'Loneliness',
    anxiety: 'Anxiety',
    anger: 'Anger',
    sadness: 'Sadness',
    habit: 'Habit/Routine',
    temptation: 'Saw/Heard Trigger',
    other: 'Other',
};

const TRIGGER_ICONS = {
    stress: 'thunderstorm',
    boredom: 'time',
    social: 'people',
    celebration: 'gift',
    loneliness: 'person',
    anxiety: 'pulse',
    anger: 'flame',
    sadness: 'rainy',
    habit: 'repeat',
    temptation: 'eye',
    other: 'ellipsis-horizontal',
};

const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = Math.floor((now - date) / (1000 * 60 * 60 * 24));

    if (diff === 0) return 'Today';
    if (diff === 1) return 'Yesterday';
    if (diff < 7) return `${diff} days ago`;

    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const SlipItem = ({ slip }) => (
    <View style={styles.slipItem}>
        <View style={styles.slipItemHeader}>
            <View style={[styles.severityBadge, { backgroundColor: getSeverityColor(slip.severity) }]}>
                <Text style={styles.severityText}>{slip.severity}</Text>
            </View>
            <View style={styles.slipItemInfo}>
                <Text style={styles.slipItemTitle}>{slip.addiction_name || 'Slip'}</Text>
                <Text style={styles.slipItemDate}>{formatDate(slip.slip_date)}</Text>
            </View>
            {slip.trigger && (
                <View style={styles.triggerBadge}>
                    <Ionicons name={TRIGGER_ICONS[slip.trigger] || 'alert-circle'} size={14} color={colors.primary.violet} />
                    <Text style={styles.triggerBadgeText}>{TRIGGER_LABELS[slip.trigger] || slip.trigger}</Text>
                </View>
            )}
        </View>
        {slip.notes && (
            <Text style={styles.slipNotes} numberOfLines={2}>{slip.notes}</Text>
        )}
    </View>
);

const getSeverityColor = (severity) => {
    const colors = {
        1: '#10B981', // green - minor
        2: '#84CC16', // lime
        3: '#F59E0B', // amber
        4: '#F97316', // orange
        5: '#EF4444', // red - major
    };
    return colors[severity] || colors[3];
};

const TriggerChart = ({ triggers }) => {
    if (!triggers || triggers.length === 0) return null;

    const maxCount = Math.max(...triggers.map(t => parseInt(t.count)));

    return (
        <View style={styles.triggerChart}>
            {triggers.slice(0, 4).map((trigger) => (
                <View key={trigger.trigger} style={styles.triggerBar}>
                    <View style={styles.triggerBarLabel}>
                        <Ionicons
                            name={TRIGGER_ICONS[trigger.trigger] || 'alert-circle'}
                            size={16}
                            color={colors.primary.violet}
                        />
                        <Text style={styles.triggerLabel}>{TRIGGER_LABELS[trigger.trigger] || trigger.trigger}</Text>
                    </View>
                    <View style={styles.triggerBarTrack}>
                        <View
                            style={[
                                styles.triggerBarFill,
                                { width: `${(parseInt(trigger.count) / maxCount) * 100}%` }
                            ]}
                        />
                    </View>
                    <Text style={styles.triggerCount}>{trigger.count}</Text>
                </View>
            ))}
        </View>
    );
};

export const SlipInsights = ({ addictionId, navigation }) => {
    const themeColors = useColors();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState(null);
    const [slips, setSlips] = useState([]);
    const [showHistory, setShowHistory] = useState(false);

    useEffect(() => {
        loadData();
    }, [addictionId]);

    const loadData = async () => {
        setLoading(true);
        try {
            const [statsRes, slipsRes] = await Promise.all([
                api.getSlipStats(addictionId, 30),
                api.getSlips(addictionId, 10, 0),
            ]);
            setStats(statsRes);
            setSlips(slipsRes.slips || []);
        } catch (error) {
            console.error('Error loading slip data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Card style={styles.container}>
                <ActivityIndicator size="small" color={themeColors.primary.teal} />
            </Card>
        );
    }

    if (!stats || stats.totalSlips === 0) {
        return (
            <Card style={styles.container}>
                <View style={styles.emptyState}>
                    <Ionicons name="checkmark-circle" size={32} color={themeColors.primary.teal} />
                    <Text style={[styles.emptyTitle, { color: themeColors.text.primary }]}>No slips recorded</Text>
                    <Text style={[styles.emptyText, { color: themeColors.text.muted }]}>Keep up the great work! 💪</Text>
                </View>
            </Card>
        );
    }

    return (
        <View style={styles.container}>
            {/* Stats Overview */}
            <Card style={styles.statsCard}>
                <View style={styles.statsHeader}>
                    <Text style={[styles.statsTitle, { color: themeColors.text.primary }]}>Slip Insights</Text>
                    <Text style={[styles.statsPeriod, { color: themeColors.text.muted }]}>Last 30 days</Text>
                </View>

                <View style={styles.statsRow}>
                    <View style={styles.statItem}>
                        <Text style={[styles.statValue, { color: themeColors.primary.violet }]}>{stats.totalSlips}</Text>
                        <Text style={[styles.statLabel, { color: themeColors.text.muted }]}>Total Slips</Text>
                    </View>
                    <View style={[styles.statDivider, { backgroundColor: themeColors.background.secondary }]} />
                    <View style={styles.statItem}>
                        <Text style={[styles.statValue, { color: themeColors.primary.violet }]}>{stats.averageSeverity?.toFixed(1) || '0'}</Text>
                        <Text style={[styles.statLabel, { color: themeColors.text.muted }]}>Avg Severity</Text>
                    </View>
                </View>
            </Card>

            {/* Common Triggers */}
            {stats.topTriggers && stats.topTriggers.length > 0 && (
                <Card style={styles.triggersCard}>
                    <Text style={[styles.cardTitle, { color: themeColors.text.primary }]}>Common Triggers</Text>
                    <TriggerChart triggers={stats.topTriggers} />
                </Card>
            )}

            {/* View Full Analytics */}
            {navigation && (
                <Pressable onPress={() => navigation.navigate('SlipAnalytics')} style={[styles.viewAllBtn, { backgroundColor: themeColors.background.card }]}>
                    <Ionicons name="analytics" size={20} color={themeColors.primary.violet} />
                    <Text style={[styles.viewAllText, { color: themeColors.primary.violet }]}>View Full Analytics</Text>
                    <Ionicons name="chevron-forward" size={18} color={themeColors.text.muted} />
                </Pressable>
            )}

            {/* Slip History Toggle */}
            <Pressable onPress={() => setShowHistory(!showHistory)} style={[styles.historyToggle, { backgroundColor: themeColors.background.card }]}>
                <View style={styles.historyToggleLeft}>
                    <Ionicons name="list" size={20} color={themeColors.text.secondary} />
                    <Text style={[styles.historyToggleText, { color: themeColors.text.primary }]}>Slip History</Text>
                </View>
                <Ionicons
                    name={showHistory ? 'chevron-up' : 'chevron-down'}
                    size={20}
                    color={themeColors.text.muted}
                />
            </Pressable>

            {/* History List */}
            {showHistory && (
                <View style={styles.historyList}>
                    {slips.map((slip) => (
                        <SlipItem key={slip.id} slip={slip} />
                    ))}
                    {slips.length === 0 && (
                        <Text style={[styles.noHistoryText, { color: themeColors.text.muted }]}>No slips recorded yet</Text>
                    )}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: spacing.md,
    },
    statsCard: {
        padding: spacing.md,
        marginBottom: spacing.sm,
    },
    statsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    statsTitle: {
        fontSize: typography.size.lg,
        fontWeight: typography.weight.bold,
        color: colors.text.primary,
    },
    statsPeriod: {
        fontSize: typography.size.xs,
        color: colors.text.muted,
    },
    statsRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
    },
    statValue: {
        fontSize: typography.size['2xl'],
        fontWeight: typography.weight.bold,
        color: colors.primary.violet,
    },
    statLabel: {
        fontSize: typography.size.xs,
        color: colors.text.muted,
        marginTop: 4,
    },
    statDivider: {
        width: 1,
        height: 40,
        backgroundColor: colors.background.secondary,
    },
    triggersCard: {
        padding: spacing.md,
        marginBottom: spacing.sm,
    },
    cardTitle: {
        fontSize: typography.size.base,
        fontWeight: typography.weight.semibold,
        color: colors.text.primary,
        marginBottom: spacing.md,
    },
    triggerChart: {
        gap: spacing.sm,
    },
    triggerBar: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    triggerBarLabel: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
        width: 120,
    },
    triggerLabel: {
        fontSize: typography.size.sm,
        color: colors.text.secondary,
    },
    triggerBarTrack: {
        flex: 1,
        height: 8,
        backgroundColor: colors.background.secondary,
        borderRadius: 4,
        marginHorizontal: spacing.sm,
    },
    triggerBarFill: {
        height: '100%',
        backgroundColor: colors.primary.violet,
        borderRadius: 4,
    },
    triggerCount: {
        fontSize: typography.size.sm,
        fontWeight: '600',
        color: colors.text.muted,
        width: 24,
        textAlign: 'right',
    },
    historyToggle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: colors.background.card,
        padding: spacing.md,
        borderRadius: 12,
    },
    historyToggleLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
    },
    historyToggleText: {
        fontSize: typography.size.base,
        fontWeight: '500',
        color: colors.text.secondary,
    },
    historyList: {
        marginTop: spacing.sm,
        gap: spacing.sm,
    },
    slipItem: {
        backgroundColor: colors.background.card,
        padding: spacing.md,
        borderRadius: 12,
        borderLeftWidth: 3,
        borderLeftColor: colors.primary.violet,
    },
    slipItemHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    severityBadge: {
        width: 28,
        height: 28,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.sm,
    },
    severityText: {
        fontSize: typography.size.sm,
        fontWeight: '700',
        color: '#fff',
    },
    slipItemInfo: {
        flex: 1,
    },
    slipItemTitle: {
        fontSize: typography.size.base,
        fontWeight: '600',
        color: colors.text.primary,
    },
    slipItemDate: {
        fontSize: typography.size.xs,
        color: colors.text.muted,
    },
    triggerBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: colors.primary.violet + '15',
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 12,
    },
    triggerBadgeText: {
        fontSize: typography.size.xs,
        color: colors.primary.violet,
    },
    slipNotes: {
        fontSize: typography.size.sm,
        color: colors.text.muted,
        marginTop: spacing.sm,
        fontStyle: 'italic',
    },
    emptyState: {
        alignItems: 'center',
        padding: spacing.lg,
    },
    emptyTitle: {
        fontSize: typography.size.base,
        fontWeight: '600',
        color: colors.text.primary,
        marginTop: spacing.sm,
    },
    emptyText: {
        fontSize: typography.size.sm,
        color: colors.text.muted,
        marginTop: spacing.xs,
    },
    noHistoryText: {
        fontSize: typography.size.sm,
        color: colors.text.muted,
        textAlign: 'center',
        padding: spacing.md,
    },
    viewAllBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: colors.primary.violet + '15',
        padding: spacing.md,
        borderRadius: 12,
        marginBottom: spacing.sm,
    },
    viewAllText: {
        flex: 1,
        fontSize: typography.size.base,
        fontWeight: '600',
        color: colors.primary.violet,
        marginLeft: spacing.sm,
    },
});

export default SlipInsights;

// --- End of SlipInsights.js ---
