// Author: -GLOBENXCC-
// OS support: iOS, Android, Web
// Description: Trigger profile screen for managing triggers and coping strategies

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../components/common';
import { useColors, spacing, typography } from '../theme';
import { useTriggerStore, DEFAULT_COPING_STRATEGIES } from '../store/triggerStore';

export const TriggerProfileScreen = ({ navigation }) => {
    const colors = useColors();
    const {
        getAllTriggers,
        getTriggerProfile,
        setTriggerCopingPlan,
        getStrategySuccessRate,
    } = useTriggerStore();

    const triggers = getAllTriggers();
    const [selectedTrigger, setSelectedTrigger] = useState(null);
    const [showStrategyModal, setShowStrategyModal] = useState(false);
    const [selectedStrategies, setSelectedStrategies] = useState([]);
    const [notes, setNotes] = useState('');

    const handleTriggerPress = (trigger) => {
        const profile = getTriggerProfile(trigger.id);
        setSelectedTrigger(trigger);
        setSelectedStrategies(profile.strategies || []);
        setNotes(profile.notes || '');
        setShowStrategyModal(true);
    };

    const toggleStrategy = (strategyId) => {
        setSelectedStrategies(prev =>
            prev.includes(strategyId)
                ? prev.filter(s => s !== strategyId)
                : [...prev, strategyId]
        );
    };

    const handleSave = () => {
        if (selectedTrigger) {
            setTriggerCopingPlan(selectedTrigger.id, selectedStrategies, notes);
        }
        setShowStrategyModal(false);
        setSelectedTrigger(null);
    };

    const getProfileStatus = (triggerId) => {
        const profile = getTriggerProfile(triggerId);
        if (profile.strategies?.length > 0) {
            return { hasProfile: true, count: profile.strategies.length };
        }
        return { hasProfile: false, count: 0 };
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
            <SafeAreaView edges={['top']} style={styles.safeArea}>
                <View style={[styles.header, { borderBottomColor: colors.border }]}>
                    <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
                    </Pressable>
                    <Text style={[styles.headerTitle, { color: colors.text.primary }]}>Trigger Profiles</Text>
                    <View style={styles.placeholder} />
                </View>

                <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
                    <View style={styles.introSection}>
                        <Ionicons name="shield" size={32} color={colors.primary.teal} />
                        <Text style={[styles.introTitle, { color: colors.text.primary }]}>
                            Know Your Triggers
                        </Text>
                        <Text style={[styles.introText, { color: colors.text.secondary }]}>
                            Create personalized coping plans for each trigger. When you feel triggered,
                            you'll know exactly what to do.
                        </Text>
                    </View>

                    <Text style={[styles.sectionTitle, { color: colors.text.muted }]}>Your Triggers</Text>

                    {triggers.map((trigger) => {
                        const status = getProfileStatus(trigger.id);
                        return (
                            <Pressable
                                key={trigger.id}
                                onPress={() => handleTriggerPress(trigger)}
                                style={({ pressed }) => [
                                    styles.triggerCard,
                                    {
                                        backgroundColor: colors.background.card,
                                        opacity: pressed ? 0.9 : 1,
                                    },
                                ]}
                            >
                                <View style={[styles.triggerIcon, { backgroundColor: trigger.color + '20' }]}>
                                    <Ionicons name={trigger.icon} size={24} color={trigger.color} />
                                </View>
                                <View style={styles.triggerContent}>
                                    <Text style={[styles.triggerName, { color: colors.text.primary }]}>
                                        {trigger.name}
                                    </Text>
                                    <Text style={[styles.triggerStatus, { color: colors.text.muted }]}>
                                        {status.hasProfile
                                            ? `${status.count} coping strategies`
                                            : 'No plan yet — tap to add'}
                                    </Text>
                                </View>
                                <View style={styles.triggerIndicator}>
                                    {status.hasProfile ? (
                                        <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                                    ) : (
                                        <Ionicons name="add-circle-outline" size={20} color={colors.text.muted} />
                                    )}
                                </View>
                            </Pressable>
                        );
                    })}

                    <View style={styles.bottomPadding} />
                </ScrollView>
            </SafeAreaView>

            <Modal visible={showStrategyModal} transparent animationType="slide">
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { backgroundColor: colors.background.card }]}>
                        <View style={styles.modalHeader}>
                            <Text style={[styles.modalTitle, { color: colors.text.primary }]}>
                                Coping Plan for {selectedTrigger?.name}
                            </Text>
                            <Pressable onPress={() => setShowStrategyModal(false)}>
                                <Ionicons name="close" size={24} color={colors.text.secondary} />
                            </Pressable>
                        </View>

                        <Text style={[styles.modalSubtitle, { color: colors.text.muted }]}>
                            Select strategies that work for you
                        </Text>

                        <ScrollView style={styles.strategiesList}>
                            {DEFAULT_COPING_STRATEGIES.map((strategy) => {
                                const isSelected = selectedStrategies.includes(strategy.id);
                                const successRate = getStrategySuccessRate(strategy.id);

                                return (
                                    <Pressable
                                        key={strategy.id}
                                        onPress={() => toggleStrategy(strategy.id)}
                                        style={[
                                            styles.strategyItem,
                                            {
                                                backgroundColor: isSelected
                                                    ? colors.primary.teal + '20'
                                                    : colors.background.secondary,
                                                borderColor: isSelected ? colors.primary.teal : 'transparent',
                                            },
                                        ]}
                                    >
                                        <Ionicons
                                            name={strategy.icon}
                                            size={20}
                                            color={isSelected ? colors.primary.teal : colors.text.secondary}
                                        />
                                        <View style={styles.strategyContent}>
                                            <Text style={[styles.strategyName, { color: colors.text.primary }]}>
                                                {strategy.name}
                                            </Text>
                                            <Text style={[styles.strategyDuration, { color: colors.text.muted }]}>
                                                {strategy.duration}
                                                {successRate !== null && ` • ${Math.round(successRate)}% success rate`}
                                            </Text>
                                        </View>
                                        {isSelected && (
                                            <Ionicons name="checkmark" size={20} color={colors.primary.teal} />
                                        )}
                                    </Pressable>
                                );
                            })}
                        </ScrollView>

                        <Text style={[styles.notesLabel, { color: colors.text.secondary }]}>
                            Personal notes (optional)
                        </Text>
                        <TextInput
                            style={[
                                styles.notesInput,
                                {
                                    backgroundColor: colors.background.secondary,
                                    color: colors.text.primary,
                                },
                            ]}
                            placeholder="Reminders, phone numbers, mantras..."
                            placeholderTextColor={colors.text.muted}
                            value={notes}
                            onChangeText={setNotes}
                            multiline
                            numberOfLines={2}
                        />

                        <Pressable
                            onPress={handleSave}
                            style={[styles.saveButton, { backgroundColor: colors.primary.teal }]}
                        >
                            <Text style={styles.saveButtonText}>Save Coping Plan</Text>
                        </Pressable>
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
    sectionTitle: {
        fontSize: typography.size.sm,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: spacing.sm,
        marginLeft: spacing.xs,
    },
    triggerCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.md,
        borderRadius: 16,
        marginBottom: spacing.sm,
    },
    triggerIcon: {
        width: 48,
        height: 48,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.md,
    },
    triggerContent: {
        flex: 1,
    },
    triggerName: {
        fontSize: typography.size.base,
        fontWeight: '600',
    },
    triggerStatus: {
        fontSize: typography.size.sm,
        marginTop: 2,
    },
    triggerIndicator: {
        marginLeft: spacing.sm,
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
        maxHeight: '85%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.sm,
    },
    modalTitle: {
        fontSize: typography.size.lg,
        fontWeight: '700',
    },
    modalSubtitle: {
        fontSize: typography.size.sm,
        marginBottom: spacing.md,
    },
    strategiesList: {
        maxHeight: 300,
    },
    strategyItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.md,
        borderRadius: 12,
        marginBottom: spacing.sm,
        borderWidth: 2,
        gap: spacing.md,
    },
    strategyContent: {
        flex: 1,
    },
    strategyName: {
        fontSize: typography.size.base,
        fontWeight: '500',
    },
    strategyDuration: {
        fontSize: typography.size.xs,
        marginTop: 2,
    },
    notesLabel: {
        fontSize: typography.size.sm,
        marginTop: spacing.md,
        marginBottom: spacing.sm,
    },
    notesInput: {
        borderRadius: 12,
        padding: spacing.md,
        fontSize: typography.size.base,
        minHeight: 60,
        textAlignVertical: 'top',
    },
    saveButton: {
        marginTop: spacing.lg,
        padding: spacing.md,
        borderRadius: 12,
        alignItems: 'center',
    },
    saveButtonText: {
        color: '#fff',
        fontSize: typography.size.base,
        fontWeight: '600',
    },
});

export default TriggerProfileScreen;

// --- End of TriggerProfileScreen.js ---
