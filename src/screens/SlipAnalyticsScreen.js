// Author: -GLOBENXCC-
// OS support: iOS, Android, Web
// Description: Slip analytics screen with deep pattern analysis

import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, View, Text, Pressable, ActivityIndicator, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../components/common';
import { useColors, colors, spacing, typography } from '../theme';
import api from '../services/api';

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const TRIGGER_LABELS = {
    stress: 'Stress', boredom: 'Boredom', social: 'Social Pressure',
    celebration: 'Celebration', loneliness: 'Loneliness', anxiety: 'Anxiety',
    anger: 'Anger', sadness: 'Sadness', habit: 'Habit/Routine',
    temptation: 'Temptation', other: 'Other',
};

const MOOD_DATA = {
    great: { icon: 'happy', label: 'Great', color: '#10B981' },
    good: { icon: 'happy-outline', label: 'Good', color: '#84CC16' },
    okay: { icon: 'remove-circle', label: 'Okay', color: '#F59E0B' },
    low: { icon: 'sad-outline', label: 'Low', color: '#F97316' },
    bad: { icon: 'sad', label: 'Bad', color: '#EF4444' },
};

const getTriggerColor = (i) => ['#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#3B82F6'][i % 5];

export const SlipAnalyticsScreen = ({ navigation }) => {
    const themeColors = useColors();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState(null);
    const [slips, setSlips] = useState([]);
    const [period, setPeriod] = useState(30);

    useEffect(() => { loadData(); }, [period]);

    const loadData = async () => {
        setLoading(true);
        try {
            const [statsRes, slipsRes] = await Promise.all([
                api.getSlipStats(null, period),
                api.getSlips(null, 100, 0),
            ]);
            setStats(statsRes);
            setSlips(slipsRes.slips || []);
        } catch (e) { console.error('Error loading slip analytics:', e); }
        finally { setLoading(false); }
    };

    const moodsBefore = {}, moodsAfter = {};
    slips.forEach(s => {
        if (s.mood_before) moodsBefore[s.mood_before] = (moodsBefore[s.mood_before] || 0) + 1;
        if (s.mood_after) moodsAfter[s.mood_after] = (moodsAfter[s.mood_after] || 0) + 1;
    });

    const dayData = DAYS_OF_WEEK.map((day, i) => {
        const found = stats?.byDayOfWeek?.find(d => parseInt(d.day_of_week) === i);
        return { day, count: found ? parseInt(found.count) : 0 };
    });
    const maxDayCount = Math.max(...dayData.map(d => d.count), 1);

    const recent = slips.slice(0, Math.min(10, slips.length));
    const avgRecent = recent.length > 0 ? recent.reduce((s, x) => s + (x.severity || 3), 0) / recent.length : 0;
    const older = slips.slice(Math.floor(slips.length / 2));
    const avgOlder = older.length > 0 ? older.reduce((s, x) => s + (x.severity || 3), 0) / older.length : avgRecent;
    const trend = avgRecent < avgOlder ? 'improving' : avgRecent > avgOlder ? 'increasing' : 'stable';

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.center}><ActivityIndicator size="large" color={colors.primary.teal} /></View>
            </SafeAreaView>
        );
    }

    const hasData = stats && stats.totalSlips > 0;

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background.primary }]}>
            <View style={styles.header}>
                <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color={themeColors.text.primary} />
                </Pressable>
                <Text style={[styles.title, { color: themeColors.text.primary }]}>Slip Analytics</Text>
                <View style={{ width: 40 }} />
            </View>

            <View style={styles.periodRow}>
                {[7, 30, 90].map(d => (
                    <Pressable key={d} onPress={() => setPeriod(d)} style={[styles.periodBtn, { backgroundColor: themeColors.background.card }, period === d && styles.periodBtnActive]}>
                        <Text style={[styles.periodText, { color: themeColors.text.secondary }, period === d && styles.periodTextActive]}>{d}d</Text>
                    </Pressable>
                ))}
            </View>

            <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
                {!hasData ? (
                    <View style={styles.empty}>
                        <Ionicons name="shield-checkmark" size={64} color={themeColors.primary.teal} />
                        <Text style={[styles.emptyTitle, { color: themeColors.text.primary }]}>No slips recorded</Text>
                        <Text style={[styles.emptyText, { color: themeColors.text.muted }]}>Keep up the great work!</Text>
                    </View>
                ) : (
                    <>
                        {/* Stats Row */}
                        <View style={styles.statsRow}>
                            <Card style={styles.statCard}>
                                <Text style={[styles.statVal, { color: themeColors.primary.violet }]}>{stats.totalSlips}</Text>
                                <Text style={[styles.statLbl, { color: themeColors.text.muted }]}>Total Slips</Text>
                            </Card>
                            <Card style={styles.statCard}>
                                <Text style={[styles.statVal, { color: themeColors.primary.violet }]}>{(stats.averageSeverity || 0).toFixed(1)}</Text>
                                <Text style={[styles.statLbl, { color: themeColors.text.muted }]}>Avg Severity</Text>
                            </Card>
                        </View>

                        {/* Severity Trend */}
                        <Card style={styles.section}>
                            <Text style={[styles.sectionTitle, { color: themeColors.text.primary }]}>Severity Trend</Text>
                            <View style={styles.trendRow}>
                                <View style={styles.trendCircle}>
                                    <Text style={[styles.trendVal, { color: themeColors.primary.violet }]}>{avgRecent.toFixed(1)}</Text>
                                </View>
                                <View style={styles.trendInfo}>
                                    <View style={styles.trendBadge}>
                                        <Ionicons name={trend === 'improving' ? 'trending-down' : trend === 'increasing' ? 'trending-up' : 'remove'} size={18} color={trend === 'improving' ? '#10B981' : trend === 'increasing' ? '#EF4444' : '#F59E0B'} />
                                        <Text style={[styles.trendTxt, { color: trend === 'improving' ? '#10B981' : trend === 'increasing' ? '#EF4444' : '#F59E0B' }]}>
                                            {trend === 'improving' ? 'Improving' : trend === 'increasing' ? 'Higher lately' : 'Stable'}
                                        </Text>
                                    </View>
                                    <Text style={[styles.trendSub, { color: themeColors.text.muted }]}>vs. older slips</Text>
                                </View>
                            </View>
                        </Card>

                        {/* Day of Week */}
                        <Card style={styles.section}>
                            <Text style={[styles.sectionTitle, { color: themeColors.text.primary }]}>When Do Slips Happen?</Text>
                            <View style={styles.dayChart}>
                                {dayData.map(d => (
                                    <View key={d.day} style={styles.dayCol}>
                                        <View style={styles.dayBarWrap}>
                                            <View style={[styles.dayBar, { height: `${Math.max((d.count / maxDayCount) * 100, 5)}%` }]} />
                                        </View>
                                        <Text style={[styles.dayLbl, { color: themeColors.text.muted }]}>{d.day}</Text>
                                        <Text style={[styles.dayCnt, { color: themeColors.text.secondary }]}>{d.count}</Text>
                                    </View>
                                ))}
                            </View>
                        </Card>

                        {/* Top Triggers */}
                        {stats.topTriggers?.length > 0 && (
                            <Card style={styles.section}>
                                <Text style={[styles.sectionTitle, { color: themeColors.text.primary }]}>Top Triggers</Text>
                                {stats.topTriggers.slice(0, 5).map((t, i) => {
                                    const total = stats.topTriggers.reduce((s, x) => s + parseInt(x.count), 0);
                                    const pct = Math.round((parseInt(t.count) / total) * 100);
                                    return (
                                        <View key={t.trigger} style={styles.trigRow}>
                                            <View style={styles.trigInfo}>
                                                <View style={[styles.trigDot, { backgroundColor: getTriggerColor(i) }]} />
                                                <Text style={[styles.trigName, { color: themeColors.text.secondary }]}>{TRIGGER_LABELS[t.trigger] || t.trigger}</Text>
                                            </View>
                                            <View style={styles.trigBarWrap}>
                                                <View style={[styles.trigBar, { width: `${pct}%`, backgroundColor: getTriggerColor(i) }]} />
                                            </View>
                                            <Text style={[styles.trigPct, { color: themeColors.text.muted }]}>{pct}%</Text>
                                        </View>
                                    );
                                })}
                            </Card>
                        )}

                        {/* Mood Correlation */}
                        <Card style={styles.section}>
                            <Text style={[styles.sectionTitle, { color: themeColors.text.primary }]}>Mood Patterns</Text>
                            <Text style={[styles.sectionSub, { color: themeColors.text.muted }]}>Before vs After slips</Text>
                            <View style={styles.moodGrid}>
                                <View style={styles.moodRow}>
                                    <Text style={[styles.moodRowLbl, { color: themeColors.text.muted }]}>Before</Text>
                                    <View style={styles.moodEmojis}>
                                        {Object.keys(MOOD_DATA).map(m => (
                                            <View key={m} style={styles.moodItem}>
                                                <Ionicons name={MOOD_DATA[m].icon} size={22} color={MOOD_DATA[m].color} />
                                                <Text style={[styles.moodCnt, { color: themeColors.text.secondary }]}>{moodsBefore[m] || 0}</Text>
                                            </View>
                                        ))}
                                    </View>
                                </View>
                                <View style={[styles.moodDiv, { backgroundColor: themeColors.background.secondary }]} />
                                <View style={styles.moodRow}>
                                    <Text style={[styles.moodRowLbl, { color: themeColors.text.muted }]}>After</Text>
                                    <View style={styles.moodEmojis}>
                                        {Object.keys(MOOD_DATA).map(m => (
                                            <View key={m} style={styles.moodItem}>
                                                <Ionicons name={MOOD_DATA[m].icon} size={22} color={MOOD_DATA[m].color} />
                                                <Text style={[styles.moodCnt, { color: themeColors.text.secondary }]}>{moodsAfter[m] || 0}</Text>
                                            </View>
                                        ))}
                                    </View>
                                </View>
                            </View>
                        </Card>

                        {/* By Addiction */}
                        {stats.byAddiction?.length > 0 && (
                            <Card style={styles.section}>
                                <Text style={[styles.sectionTitle, { color: themeColors.text.primary }]}>By Addiction</Text>
                                {stats.byAddiction.map(a => (
                                    <View key={a.addiction_id} style={styles.addRow}>
                                        <Text style={[styles.addName, { color: themeColors.text.primary }]}>{a.addiction_name || a.addiction_id}</Text>
                                        <View style={styles.addBadge}><Text style={[styles.addCnt, { color: themeColors.primary.violet }]}>{a.count}</Text></View>
                                    </View>
                                ))}
                            </Card>
                        )}

                        <View style={styles.bottomPad} />
                    </>
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background.primary },
    center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.screenPadding, paddingVertical: spacing.md },
    backBtn: { padding: spacing.xs },
    title: { fontSize: typography.size.xl, fontWeight: typography.weight.bold, color: colors.text.primary },
    periodRow: { flexDirection: 'row', paddingHorizontal: spacing.screenPadding, gap: spacing.sm, marginBottom: spacing.md },
    periodBtn: { flex: 1, paddingVertical: spacing.sm, backgroundColor: colors.background.card, borderRadius: 12, alignItems: 'center' },
    periodBtnActive: { backgroundColor: colors.primary.teal },
    periodText: { fontSize: typography.size.sm, fontWeight: '600', color: colors.text.secondary },
    periodTextActive: { color: '#fff' },
    scroll: { flex: 1 },
    scrollContent: { padding: spacing.screenPadding },
    empty: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 80 },
    emptyTitle: { fontSize: typography.size.xl, fontWeight: typography.weight.bold, color: colors.text.primary, marginTop: spacing.md },
    emptyText: { fontSize: typography.size.base, color: colors.text.muted, marginTop: spacing.sm },
    statsRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.md },
    statCard: { flex: 1, padding: spacing.md, alignItems: 'center' },
    statVal: { fontSize: typography.size['3xl'], fontWeight: typography.weight.bold, color: colors.primary.violet },
    statLbl: { fontSize: typography.size.sm, color: colors.text.muted, marginTop: 4 },
    section: { padding: spacing.md, marginBottom: spacing.md },
    sectionTitle: { fontSize: typography.size.lg, fontWeight: typography.weight.bold, color: colors.text.primary, marginBottom: spacing.xs },
    sectionSub: { fontSize: typography.size.sm, color: colors.text.muted, marginBottom: spacing.md },
    trendRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.sm },
    trendCircle: { width: 60, height: 60, borderRadius: 30, backgroundColor: colors.primary.violet + '20', alignItems: 'center', justifyContent: 'center', marginRight: spacing.md },
    trendVal: { fontSize: typography.size.xl, fontWeight: typography.weight.bold, color: colors.primary.violet },
    trendInfo: { flex: 1 },
    trendBadge: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    trendTxt: { fontSize: typography.size.base, fontWeight: '600' },
    trendSub: { fontSize: typography.size.sm, color: colors.text.muted, marginTop: 2 },
    dayChart: { flexDirection: 'row', justifyContent: 'space-between', height: 100, marginTop: spacing.md },
    dayCol: { alignItems: 'center', flex: 1 },
    dayBarWrap: { flex: 1, width: 20, backgroundColor: colors.background.secondary, borderRadius: 4, justifyContent: 'flex-end', overflow: 'hidden' },
    dayBar: { width: '100%', backgroundColor: colors.primary.violet, borderRadius: 4 },
    dayLbl: { fontSize: typography.size.xs, color: colors.text.muted, marginTop: 4 },
    dayCnt: { fontSize: typography.size.xs, fontWeight: '600', color: colors.text.secondary },
    trigRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm },
    trigInfo: { flexDirection: 'row', alignItems: 'center', width: 100 },
    trigDot: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
    trigName: { fontSize: typography.size.sm, color: colors.text.secondary },
    trigBarWrap: { flex: 1, height: 8, backgroundColor: colors.background.secondary, borderRadius: 4, marginHorizontal: spacing.sm },
    trigBar: { height: '100%', borderRadius: 4 },
    trigPct: { fontSize: typography.size.sm, fontWeight: '600', color: colors.text.muted, width: 36, textAlign: 'right' },
    moodGrid: { marginTop: spacing.sm },
    moodRow: { marginBottom: spacing.sm },
    moodRowLbl: { fontSize: typography.size.sm, color: colors.text.muted, marginBottom: 4 },
    moodEmojis: { flexDirection: 'row', justifyContent: 'space-between' },
    moodItem: { alignItems: 'center' },
    moodEmoji: { fontSize: 22 },
    moodCnt: { fontSize: typography.size.sm, fontWeight: '600', color: colors.text.secondary, marginTop: 2 },
    moodDiv: { height: 1, backgroundColor: colors.background.secondary, marginVertical: spacing.sm },
    addRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: spacing.xs },
    addName: { fontSize: typography.size.base, color: colors.text.primary },
    addBadge: { backgroundColor: colors.primary.violet + '20', paddingHorizontal: spacing.sm, paddingVertical: 4, borderRadius: 12 },
    addCnt: { fontSize: typography.size.sm, fontWeight: '600', color: colors.primary.violet },
    bottomPad: { height: 100 },
});

export default SlipAnalyticsScreen;

// --- End of SlipAnalyticsScreen.js ---
