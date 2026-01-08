// Author: -GLOBENXCC-
// OS support: iOS, Android, Web
// Description: Health timeline screen showing body recovery milestones by addiction

import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useColors, spacing, typography } from '../theme';
import { useUserStore } from '../store';
import { HEALTH_TIMELINES, getMilestoneStatus } from '../data/healthData';

export const HealthTimelineScreen = ({ navigation }) => {
    const colors = useColors();
    const { userAddictions } = useUserStore();
    const [selectedAddiction, setSelectedAddiction] = useState(null);

    useEffect(() => {
        if (userAddictions.length > 0 && !selectedAddiction) {
            setSelectedAddiction(userAddictions[0].addictionId);
        }
    }, [userAddictions]);

    const currentTimeline = HEALTH_TIMELINES[selectedAddiction] || HEALTH_TIMELINES.alcohol;
    const currentAddiction = userAddictions.find(a => a.addictionId === selectedAddiction);
    const startDate = currentAddiction?.startDate;

    return (
        <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
            <SafeAreaView edges={['top']} style={styles.safeArea}>
                <View style={[styles.header, { borderBottomColor: colors.border }]}>
                    <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
                    </Pressable>
                    <Text style={[styles.headerTitle, { color: colors.text.primary }]}>Your Body's Recovery</Text>
                    <View style={styles.placeholder} />
                </View>

                {userAddictions.length > 1 && (
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        style={styles.tabsContainer}
                        contentContainerStyle={styles.tabsContent}
                    >
                        {userAddictions.map(addiction => (
                            <Pressable
                                key={addiction.addictionId}
                                onPress={() => setSelectedAddiction(addiction.addictionId)}
                                style={[
                                    styles.tab,
                                    {
                                        backgroundColor: selectedAddiction === addiction.addictionId
                                            ? colors.primary.teal
                                            : colors.background.secondary,
                                    },
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.tabText,
                                        {
                                            color: selectedAddiction === addiction.addictionId
                                                ? '#fff'
                                                : colors.text.secondary,
                                        },
                                    ]}
                                >
                                    {addiction.name}
                                </Text>
                            </Pressable>
                        ))}
                    </ScrollView>
                )}

                <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
                    <View style={styles.introSection}>
                        <Ionicons name="fitness" size={32} color={colors.primary.teal} />
                        <Text style={[styles.introTitle, { color: colors.text.primary }]}>
                            Every moment counts
                        </Text>
                        <Text style={[styles.introText, { color: colors.text.secondary }]}>
                            Your body is healing right now. Here's what's happening inside you.
                        </Text>
                    </View>

                    <View style={styles.timeline}>
                        {currentTimeline.milestones.map((milestone, index) => {
                            const status = startDate
                                ? getMilestoneStatus(milestone.time, startDate)
                                : { completed: false, progress: 0 };

                            return (
                                <MilestoneItem
                                    key={index}
                                    milestone={milestone}
                                    status={status}
                                    isLast={index === currentTimeline.milestones.length - 1}
                                    colors={colors}
                                    index={index}
                                />
                            );
                        })}
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
};

const MilestoneItem = ({ milestone, status, isLast, colors, index }) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(20)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 400,
                delay: index * 80,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 400,
                delay: index * 80,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    const iconColor = status.completed ? '#10B981' : colors.text.muted;
    const bgColor = status.completed ? '#10B98120' : colors.background.secondary;

    return (
        <Animated.View
            style={[
                styles.milestoneItem,
                { opacity: fadeAnim, transform: [{ translateX: slideAnim }] },
            ]}
        >
            <View style={styles.milestoneLeft}>
                <View style={[styles.iconContainer, { backgroundColor: bgColor }]}>
                    <Ionicons name={milestone.icon} size={20} color={iconColor} />
                </View>
                {!isLast && (
                    <View
                        style={[
                            styles.connector,
                            {
                                backgroundColor: status.completed
                                    ? '#10B98150'
                                    : colors.background.tertiary,
                            },
                        ]}
                    />
                )}
            </View>

            <View style={[styles.milestoneContent, { backgroundColor: colors.background.card }]}>
                <View style={styles.timeRow}>
                    <Text style={[styles.timeText, { color: colors.primary.teal }]}>
                        {milestone.time}
                    </Text>
                    {status.completed && (
                        <View style={styles.completedBadge}>
                            <Ionicons name="checkmark-circle" size={16} color="#10B981" />
                            <Text style={styles.completedText}>Achieved</Text>
                        </View>
                    )}
                </View>
                <Text style={[styles.milestoneTitle, { color: colors.text.primary }]}>
                    {milestone.title}
                </Text>
                <Text style={[styles.milestoneDesc, { color: colors.text.secondary }]}>
                    {milestone.description}
                </Text>

                {!status.completed && status.progress > 0 && (
                    <View style={styles.progressContainer}>
                        <View style={[styles.progressBar, { backgroundColor: colors.background.tertiary }]}>
                            <View
                                style={[
                                    styles.progressFill,
                                    {
                                        width: `${status.progress * 100}%`,
                                        backgroundColor: colors.primary.teal,
                                    },
                                ]}
                            />
                        </View>
                        <Text style={[styles.progressText, { color: colors.text.muted }]}>
                            {Math.round(status.progress * 100)}%
                        </Text>
                    </View>
                )}
            </View>
        </Animated.View>
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
    tabsContainer: {
        maxHeight: 50,
    },
    tabsContent: {
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        gap: spacing.sm,
    },
    tab: {
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: 20,
        marginRight: spacing.sm,
    },
    tabText: {
        fontSize: typography.size.sm,
        fontWeight: '600',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: spacing.md,
        paddingBottom: 100,
    },
    introSection: {
        alignItems: 'center',
        marginBottom: spacing.xl,
        paddingVertical: spacing.lg,
    },
    introTitle: {
        fontSize: typography.size.xl,
        fontWeight: '700',
        marginTop: spacing.md,
        marginBottom: spacing.sm,
    },
    introText: {
        fontSize: typography.size.base,
        textAlign: 'center',
        lineHeight: 22,
    },
    timeline: {
        paddingLeft: spacing.sm,
    },
    milestoneItem: {
        flexDirection: 'row',
        marginBottom: spacing.md,
    },
    milestoneLeft: {
        alignItems: 'center',
        marginRight: spacing.md,
    },
    iconContainer: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
    },
    connector: {
        width: 2,
        flex: 1,
        marginTop: spacing.xs,
        borderRadius: 1,
    },
    milestoneContent: {
        flex: 1,
        padding: spacing.md,
        borderRadius: 16,
    },
    timeRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.xs,
    },
    timeText: {
        fontSize: typography.size.sm,
        fontWeight: '700',
    },
    completedBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    completedText: {
        fontSize: typography.size.xs,
        color: '#10B981',
        fontWeight: '600',
    },
    milestoneTitle: {
        fontSize: typography.size.base,
        fontWeight: '600',
        marginBottom: spacing.xs,
    },
    milestoneDesc: {
        fontSize: typography.size.sm,
        lineHeight: 20,
    },
    progressContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: spacing.sm,
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
        fontSize: typography.size.xs,
        fontWeight: '600',
        width: 40,
        textAlign: 'right',
    },
});

export default HealthTimelineScreen;

// --- End of HealthTimelineScreen.js ---
