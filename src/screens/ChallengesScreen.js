// Author: -GLOBENXCC-
// OS support: iOS, Android, Web
// Description: Challenges screen with active challenges and available templates

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Modal, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../components/common';
import { useColors, spacing, typography } from '../theme';
import { useChallengeStore, CHALLENGE_TEMPLATES } from '../store/challengeStore';

export const ChallengesScreen = ({ navigation }) => {
    const colors = useColors();
    const {
        getActiveChallenges,
        getChallengeProgress,
        joinChallenge,
        logDailyProgress,
        abandonChallenge,
        completedChallenges,
    } = useChallengeStore();

    const activeChallenges = getActiveChallenges();
    const [showJoinModal, setShowJoinModal] = useState(false);

    const handleJoinChallenge = (templateId) => {
        const alreadyActive = activeChallenges.find(c => c.templateId === templateId);
        if (alreadyActive) {
            Alert.alert('Already Active', 'You are already participating in this challenge.');
            return;
        }
        joinChallenge(templateId);
        setShowJoinModal(false);
    };

    const handleLogProgress = (challengeId) => {
        const progress = getChallengeProgress(challengeId);
        const todaysProgress = useChallengeStore.getState().getTodaysProgress();
        const alreadyLogged = todaysProgress.find(p => p.challengeId === challengeId)?.completed;

        if (alreadyLogged) {
            Alert.alert('Already Logged', "You've already logged today's progress for this challenge.");
            return;
        }

        logDailyProgress(challengeId, true);

        if (progress && progress.completedDays + 1 >= progress.totalDays) {
            Alert.alert(
                '🎉 Challenge Complete!',
                "Congratulations! You've completed this challenge. Keep up the amazing work!",
                [{ text: 'Celebrate!' }]
            );
            useChallengeStore.getState().completeChallenge(challengeId);
        }
    };

    const handleAbandon = (challengeId, name) => {
        Alert.alert(
            'Leave Challenge?',
            `Are you sure you want to leave "${name}"? Your progress will be lost.`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Leave',
                    style: 'destructive',
                    onPress: () => abandonChallenge(challengeId),
                },
            ]
        );
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
            <SafeAreaView edges={['top']} style={styles.safeArea}>
                <View style={[styles.header, { borderBottomColor: colors.border }]}>
                    <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
                    </Pressable>
                    <Text style={[styles.headerTitle, { color: colors.text.primary }]}>Challenges</Text>
                    <Pressable onPress={() => setShowJoinModal(true)} style={styles.addButton}>
                        <Ionicons name="add" size={24} color={colors.primary.teal} />
                    </Pressable>
                </View>

                <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
                    {activeChallenges.length === 0 ? (
                        <View style={styles.emptyState}>
                            <Ionicons name="trophy-outline" size={64} color={colors.text.muted} />
                            <Text style={[styles.emptyTitle, { color: colors.text.primary }]}>
                                No Active Challenges
                            </Text>
                            <Text style={[styles.emptyText, { color: colors.text.secondary }]}>
                                Join a challenge to stay motivated and track your progress
                            </Text>
                            <Pressable
                                onPress={() => setShowJoinModal(true)}
                                style={[styles.emptyButton, { backgroundColor: colors.primary.teal }]}
                            >
                                <Text style={styles.emptyButtonText}>Browse Challenges</Text>
                            </Pressable>
                        </View>
                    ) : (
                        <>
                            <Text style={[styles.sectionTitle, { color: colors.text.muted }]}>Active Challenges</Text>
                            {activeChallenges.map((challenge) => {
                                const progress = getChallengeProgress(challenge.id);
                                const todaysProgress = useChallengeStore.getState().getTodaysProgress();
                                const loggedToday = todaysProgress.find(p => p.challengeId === challenge.id)?.completed;

                                return (
                                    <Card key={challenge.id} style={styles.challengeCard}>
                                        <View style={styles.challengeHeader}>
                                            <View style={[styles.challengeIcon, { backgroundColor: challenge.color + '20' }]}>
                                                <Ionicons name={challenge.icon} size={24} color={challenge.color} />
                                            </View>
                                            <View style={styles.challengeInfo}>
                                                <Text style={[styles.challengeName, { color: colors.text.primary }]}>
                                                    {challenge.name}
                                                </Text>
                                                <Text style={[styles.challengeDesc, { color: colors.text.muted }]}>
                                                    {progress?.completedDays || 0} of {progress?.totalDays} days
                                                </Text>
                                            </View>
                                            <Pressable
                                                onPress={() => handleAbandon(challenge.id, challenge.name)}
                                                style={styles.moreButton}
                                            >
                                                <Ionicons name="ellipsis-horizontal" size={20} color={colors.text.muted} />
                                            </Pressable>
                                        </View>

                                        <View style={styles.progressSection}>
                                            <View style={[styles.progressBar, { backgroundColor: colors.background.secondary }]}>
                                                <View
                                                    style={[
                                                        styles.progressFill,
                                                        {
                                                            width: `${progress?.percentage || 0}%`,
                                                            backgroundColor: challenge.color,
                                                        },
                                                    ]}
                                                />
                                            </View>
                                            <Text style={[styles.progressPercent, { color: challenge.color }]}>
                                                {Math.round(progress?.percentage || 0)}%
                                            </Text>
                                        </View>

                                        <Pressable
                                            onPress={() => handleLogProgress(challenge.id)}
                                            disabled={loggedToday}
                                            style={[
                                                styles.logButton,
                                                {
                                                    backgroundColor: loggedToday ? colors.background.secondary : challenge.color,
                                                },
                                            ]}
                                        >
                                            <Ionicons
                                                name={loggedToday ? 'checkmark-circle' : 'add-circle'}
                                                size={20}
                                                color={loggedToday ? colors.text.muted : '#fff'}
                                            />
                                            <Text
                                                style={[
                                                    styles.logButtonText,
                                                    { color: loggedToday ? colors.text.muted : '#fff' },
                                                ]}
                                            >
                                                {loggedToday ? 'Logged Today' : "Log Today's Progress"}
                                            </Text>
                                        </Pressable>
                                    </Card>
                                );
                            })}
                        </>
                    )}

                    {completedChallenges.length > 0 && (
                        <>
                            <Text style={[styles.sectionTitle, { color: colors.text.muted, marginTop: spacing.xl }]}>
                                Completed ({completedChallenges.length})
                            </Text>
                            {completedChallenges.slice(0, 3).map((challenge) => (
                                <View
                                    key={challenge.id}
                                    style={[styles.completedCard, { backgroundColor: colors.background.card }]}
                                >
                                    <Ionicons name="trophy" size={20} color="#F59E0B" />
                                    <Text style={[styles.completedName, { color: colors.text.primary }]}>
                                        {challenge.name}
                                    </Text>
                                    <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                                </View>
                            ))}
                        </>
                    )}

                    <View style={styles.bottomPadding} />
                </ScrollView>
            </SafeAreaView>

            <Modal visible={showJoinModal} transparent animationType="slide">
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { backgroundColor: colors.background.card }]}>
                        <View style={styles.modalHeader}>
                            <Text style={[styles.modalTitle, { color: colors.text.primary }]}>
                                Join a Challenge
                            </Text>
                            <Pressable onPress={() => setShowJoinModal(false)}>
                                <Ionicons name="close" size={24} color={colors.text.secondary} />
                            </Pressable>
                        </View>

                        <ScrollView>
                            {CHALLENGE_TEMPLATES.map((template) => (
                                <Pressable
                                    key={template.id}
                                    onPress={() => handleJoinChallenge(template.id)}
                                    style={[styles.templateCard, { backgroundColor: colors.background.secondary }]}
                                >
                                    <View style={[styles.templateIcon, { backgroundColor: template.color + '20' }]}>
                                        <Ionicons name={template.icon} size={24} color={template.color} />
                                    </View>
                                    <View style={styles.templateInfo}>
                                        <Text style={[styles.templateName, { color: colors.text.primary }]}>
                                            {template.name}
                                        </Text>
                                        <Text style={[styles.templateDesc, { color: colors.text.muted }]}>
                                            {template.description}
                                        </Text>
                                        <Text style={[styles.templateDuration, { color: template.color }]}>
                                            {template.duration} days
                                        </Text>
                                    </View>
                                    <Ionicons name="chevron-forward" size={20} color={colors.text.muted} />
                                </Pressable>
                            ))}
                        </ScrollView>
                    </View>
                </View>
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
    addButton: {
        padding: spacing.xs,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: spacing.md,
        paddingBottom: 100,
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: spacing.xl * 2,
    },
    emptyTitle: {
        fontSize: typography.size.xl,
        fontWeight: '700',
        marginTop: spacing.lg,
    },
    emptyText: {
        fontSize: typography.size.base,
        textAlign: 'center',
        marginTop: spacing.sm,
        marginBottom: spacing.xl,
    },
    emptyButton: {
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.xl,
        borderRadius: 12,
    },
    emptyButtonText: {
        color: '#fff',
        fontWeight: '600',
    },
    sectionTitle: {
        fontSize: typography.size.sm,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: spacing.sm,
        marginLeft: spacing.xs,
    },
    challengeCard: {
        marginBottom: spacing.md,
    },
    challengeHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    challengeIcon: {
        width: 48,
        height: 48,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.md,
    },
    challengeInfo: {
        flex: 1,
    },
    challengeName: {
        fontSize: typography.size.base,
        fontWeight: '600',
    },
    challengeDesc: {
        fontSize: typography.size.sm,
        marginTop: 2,
    },
    moreButton: {
        padding: spacing.sm,
    },
    progressSection: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: spacing.md,
        gap: spacing.sm,
    },
    progressBar: {
        flex: 1,
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
        fontWeight: '600',
        width: 40,
        textAlign: 'right',
    },
    logButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing.md,
        borderRadius: 12,
        marginTop: spacing.md,
        gap: spacing.sm,
    },
    logButtonText: {
        fontWeight: '600',
    },
    completedCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.md,
        borderRadius: 12,
        marginBottom: spacing.sm,
        gap: spacing.md,
    },
    completedName: {
        flex: 1,
        fontSize: typography.size.base,
        fontWeight: '500',
    },
    bottomPadding: {
        height: 40,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: spacing.lg,
        maxHeight: '80%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.lg,
    },
    modalTitle: {
        fontSize: typography.size.xl,
        fontWeight: '700',
    },
    templateCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.md,
        borderRadius: 12,
        marginBottom: spacing.sm,
    },
    templateIcon: {
        width: 48,
        height: 48,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.md,
    },
    templateInfo: {
        flex: 1,
    },
    templateName: {
        fontSize: typography.size.base,
        fontWeight: '600',
    },
    templateDesc: {
        fontSize: typography.size.xs,
        marginTop: 2,
    },
    templateDuration: {
        fontSize: typography.size.xs,
        fontWeight: '600',
        marginTop: 4,
    },
});

export default ChallengesScreen;

// --- End of ChallengesScreen.js ---
