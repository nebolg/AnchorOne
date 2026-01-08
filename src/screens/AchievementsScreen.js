// Author: -GLOBENXCC-
// OS support: iOS, Android, Web
// Description: Achievements screen with badges and progress tracking

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../components/common';
import { useColors, spacing, typography } from '../theme';
import { useAchievementStore, ACHIEVEMENTS } from '../store/achievementStore';

const CATEGORIES = [
    { id: 'streak', name: 'Streaks', icon: 'flame' },
    { id: 'activity', name: 'Activity', icon: 'fitness' },
    { id: 'community', name: 'Community', icon: 'people' },
    { id: 'challenge', name: 'Challenges', icon: 'trophy' },
];

export const AchievementsScreen = ({ navigation }) => {
    const colors = useColors();
    const {
        unlockedAchievements,
        getAchievementProgress,
        getUnlockedCount,
        getTotalCount,
    } = useAchievementStore();

    const [selectedCategory, setSelectedCategory] = useState('streak');
    const [selectedAchievement, setSelectedAchievement] = useState(null);

    const categoryAchievements = ACHIEVEMENTS.filter(a => a.category === selectedCategory);
    const overallProgress = (getUnlockedCount() / getTotalCount()) * 100;

    return (
        <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
            <SafeAreaView edges={['top']} style={styles.safeArea}>
                <View style={[styles.header, { borderBottomColor: colors.border }]}>
                    <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
                    </Pressable>
                    <Text style={[styles.headerTitle, { color: colors.text.primary }]}>Achievements</Text>
                    <View style={styles.placeholder} />
                </View>

                <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
                    {/* Overall Progress */}
                    <Card style={styles.progressCard}>
                        <View style={styles.progressHeader}>
                            <Ionicons name="star" size={24} color="#F59E0B" />
                            <Text style={[styles.progressTitle, { color: colors.text.primary }]}>
                                Your Progress
                            </Text>
                        </View>
                        <Text style={[styles.progressCount, { color: colors.text.primary }]}>
                            {getUnlockedCount()} / {getTotalCount()}
                        </Text>
                        <View style={[styles.progressBar, { backgroundColor: colors.background.secondary }]}>
                            <View
                                style={[
                                    styles.progressFill,
                                    { width: `${overallProgress}%`, backgroundColor: '#F59E0B' },
                                ]}
                            />
                        </View>
                        <Text style={[styles.progressPercent, { color: colors.text.muted }]}>
                            {Math.round(overallProgress)}% Complete
                        </Text>
                    </Card>

                    {/* Category Tabs */}
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        style={styles.categoryTabs}
                        contentContainerStyle={styles.categoryTabsContent}
                    >
                        {CATEGORIES.map((cat) => (
                            <Pressable
                                key={cat.id}
                                onPress={() => setSelectedCategory(cat.id)}
                                style={[
                                    styles.categoryTab,
                                    {
                                        backgroundColor: selectedCategory === cat.id
                                            ? colors.primary.teal
                                            : colors.background.secondary,
                                    },
                                ]}
                            >
                                <Ionicons
                                    name={cat.icon}
                                    size={16}
                                    color={selectedCategory === cat.id ? '#fff' : colors.text.secondary}
                                />
                                <Text
                                    style={[
                                        styles.categoryTabText,
                                        { color: selectedCategory === cat.id ? '#fff' : colors.text.secondary },
                                    ]}
                                >
                                    {cat.name}
                                </Text>
                            </Pressable>
                        ))}
                    </ScrollView>

                    {/* Achievements Grid */}
                    <View style={styles.achievementsGrid}>
                        {categoryAchievements.map((achievement) => {
                            const isUnlocked = unlockedAchievements.includes(achievement.id);
                            const progress = getAchievementProgress(achievement.id);

                            return (
                                <Pressable
                                    key={achievement.id}
                                    onPress={() => setSelectedAchievement(achievement)}
                                    style={[
                                        styles.achievementCard,
                                        {
                                            backgroundColor: colors.background.card,
                                            borderColor: isUnlocked ? achievement.color : 'transparent',
                                        },
                                    ]}
                                >
                                    <View
                                        style={[
                                            styles.achievementIcon,
                                            {
                                                backgroundColor: isUnlocked
                                                    ? achievement.color + '20'
                                                    : colors.background.tertiary,
                                            },
                                        ]}
                                    >
                                        <Ionicons
                                            name={achievement.icon}
                                            size={28}
                                            color={isUnlocked ? achievement.color : colors.text.muted}
                                        />
                                    </View>
                                    <Text
                                        style={[
                                            styles.achievementName,
                                            { color: isUnlocked ? colors.text.primary : colors.text.muted },
                                        ]}
                                        numberOfLines={2}
                                    >
                                        {achievement.name}
                                    </Text>
                                    {isUnlocked ? (
                                        <Ionicons name="checkmark-circle" size={16} color="#10B981" />
                                    ) : progress && (
                                        <Text style={[styles.achievementProgress, { color: colors.text.muted }]}>
                                            {progress.current}/{progress.total}
                                        </Text>
                                    )}
                                </Pressable>
                            );
                        })}
                    </View>

                    <View style={styles.bottomPadding} />
                </ScrollView>
            </SafeAreaView>

            {/* Achievement Detail Modal */}
            <Modal visible={!!selectedAchievement} transparent animationType="fade">
                <Pressable style={styles.modalOverlay} onPress={() => setSelectedAchievement(null)}>
                    <Pressable style={[styles.modalContent, { backgroundColor: colors.background.card }]}>
                        {selectedAchievement && (() => {
                            const isUnlocked = unlockedAchievements.includes(selectedAchievement.id);
                            const progress = getAchievementProgress(selectedAchievement.id);

                            return (
                                <>
                                    <View
                                        style={[
                                            styles.modalIcon,
                                            {
                                                backgroundColor: isUnlocked
                                                    ? selectedAchievement.color + '20'
                                                    : colors.background.secondary,
                                            },
                                        ]}
                                    >
                                        <Ionicons
                                            name={selectedAchievement.icon}
                                            size={48}
                                            color={isUnlocked ? selectedAchievement.color : colors.text.muted}
                                        />
                                    </View>
                                    <Text style={[styles.modalTitle, { color: colors.text.primary }]}>
                                        {selectedAchievement.name}
                                    </Text>
                                    <Text style={[styles.modalDesc, { color: colors.text.secondary }]}>
                                        {selectedAchievement.description}
                                    </Text>

                                    {isUnlocked ? (
                                        <View style={styles.unlockedBadge}>
                                            <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                                            <Text style={styles.unlockedText}>Unlocked!</Text>
                                        </View>
                                    ) : progress && (
                                        <View style={styles.progressSection}>
                                            <View style={[styles.modalProgressBar, { backgroundColor: colors.background.secondary }]}>
                                                <View
                                                    style={[
                                                        styles.modalProgressFill,
                                                        {
                                                            width: `${progress.percentage}%`,
                                                            backgroundColor: selectedAchievement.color,
                                                        },
                                                    ]}
                                                />
                                            </View>
                                            <Text style={[styles.modalProgressText, { color: colors.text.muted }]}>
                                                {progress.current} / {progress.total} ({Math.round(progress.percentage)}%)
                                            </Text>
                                        </View>
                                    )}

                                    <Pressable
                                        onPress={() => setSelectedAchievement(null)}
                                        style={[styles.closeModalButton, { backgroundColor: colors.background.secondary }]}
                                    >
                                        <Text style={[styles.closeModalText, { color: colors.text.primary }]}>Close</Text>
                                    </Pressable>
                                </>
                            );
                        })()}
                    </Pressable>
                </Pressable>
            </Modal>
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
    progressCard: {
        alignItems: 'center',
        padding: spacing.xl,
        marginBottom: spacing.lg,
    },
    progressHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
        marginBottom: spacing.md,
    },
    progressTitle: {
        fontSize: typography.size.lg,
        fontWeight: '700',
    },
    progressCount: {
        fontSize: typography.size['3xl'],
        fontWeight: '700',
        marginBottom: spacing.md,
    },
    progressBar: {
        width: '100%',
        height: 8,
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        borderRadius: 4,
    },
    progressPercent: {
        fontSize: typography.size.sm,
        marginTop: spacing.sm,
    },
    categoryTabs: {
        marginBottom: spacing.md,
    },
    categoryTabsContent: {
        gap: spacing.sm,
    },
    categoryTab: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.md,
        borderRadius: 20,
        gap: 6,
    },
    categoryTabText: {
        fontSize: typography.size.sm,
        fontWeight: '600',
    },
    achievementsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.sm,
    },
    achievementCard: {
        width: '31%',
        alignItems: 'center',
        padding: spacing.md,
        borderRadius: 16,
        borderWidth: 2,
    },
    achievementIcon: {
        width: 56,
        height: 56,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.sm,
    },
    achievementName: {
        fontSize: typography.size.xs,
        fontWeight: '600',
        textAlign: 'center',
        marginBottom: spacing.xs,
        height: 32,
    },
    achievementProgress: {
        fontSize: typography.size.xs,
    },
    bottomPadding: {
        height: 40,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing.lg,
    },
    modalContent: {
        width: '100%',
        maxWidth: 320,
        borderRadius: 24,
        padding: spacing.xl,
        alignItems: 'center',
    },
    modalIcon: {
        width: 96,
        height: 96,
        borderRadius: 48,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.lg,
    },
    modalTitle: {
        fontSize: typography.size.xl,
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: spacing.sm,
    },
    modalDesc: {
        fontSize: typography.size.base,
        textAlign: 'center',
        marginBottom: spacing.lg,
    },
    unlockedBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
        marginBottom: spacing.lg,
    },
    unlockedText: {
        fontSize: typography.size.base,
        fontWeight: '600',
        color: '#10B981',
    },
    progressSection: {
        width: '100%',
        marginBottom: spacing.lg,
    },
    modalProgressBar: {
        height: 8,
        borderRadius: 4,
        overflow: 'hidden',
        marginBottom: spacing.sm,
    },
    modalProgressFill: {
        height: '100%',
        borderRadius: 4,
    },
    modalProgressText: {
        fontSize: typography.size.sm,
        textAlign: 'center',
    },
    closeModalButton: {
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.xl,
        borderRadius: 12,
    },
    closeModalText: {
        fontWeight: '600',
    },
});

export default AchievementsScreen;

// --- End of AchievementsScreen.js ---
