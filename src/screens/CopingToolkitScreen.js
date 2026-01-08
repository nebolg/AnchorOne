// Author: -GLOBENXCC-
// OS support: iOS, Android, Web
// Description: Expanded coping toolkit screen with various relaxation techniques

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../components/common';
import { useColors, spacing, typography } from '../theme';

const COPING_TOOLS = [
    {
        id: 'breathing',
        name: 'Breathing Exercises',
        icon: 'leaf',
        color: '#14B8A6',
        description: 'Calm your nervous system with guided breathing',
        screen: 'Breathing',
    },
    {
        id: 'grounding',
        name: '5-4-3-2-1 Grounding',
        icon: 'hand-left',
        color: '#3B82F6',
        description: 'Anchor yourself in the present moment',
        isModal: true,
        content: {
            title: '5-4-3-2-1 Technique',
            steps: [
                { count: 5, sense: 'SEE', prompt: 'Name 5 things you can see around you', icon: 'eye' },
                { count: 4, sense: 'TOUCH', prompt: 'Name 4 things you can touch right now', icon: 'finger-print' },
                { count: 3, sense: 'HEAR', prompt: 'Name 3 things you can hear', icon: 'ear' },
                { count: 2, sense: 'SMELL', prompt: 'Name 2 things you can smell', icon: 'flower' },
                { count: 1, sense: 'TASTE', prompt: 'Name 1 thing you can taste', icon: 'restaurant' },
            ],
        },
    },
    {
        id: 'muscle_relaxation',
        name: 'Muscle Relaxation',
        icon: 'body',
        color: '#8B5CF6',
        description: 'Release tension through progressive relaxation',
        isModal: true,
        content: {
            title: 'Progressive Muscle Relaxation',
            intro: 'Tense each muscle group for 5 seconds, then release and relax for 10 seconds.',
            groups: [
                'Hands - Make fists, then release',
                'Arms - Flex your biceps, then relax',
                'Shoulders - Raise to ears, then drop',
                'Face - Scrunch up, then smooth',
                'Stomach - Tighten, then release',
                'Legs - Tense thighs, then let go',
                'Feet - Curl toes, then spread them',
            ],
        },
    },
    {
        id: 'meditation',
        name: 'Quick Meditation',
        icon: 'flower',
        color: '#EC4899',
        description: 'A 2-minute mindfulness reset',
        isModal: true,
        content: {
            title: '2-Minute Mindfulness',
            steps: [
                'Close your eyes or soften your gaze',
                'Take 3 deep breaths, exhaling slowly',
                'Notice the sensations in your body without judgment',
                'Observe your thoughts like clouds passing by',
                'Bring attention to the present moment',
                'When ready, gently open your eyes',
            ],
        },
    },
    {
        id: 'cold_water',
        name: 'Cold Water Reset',
        icon: 'water',
        color: '#06B6D4',
        description: 'Use cold water to reset your nervous system',
        isModal: true,
        content: {
            title: 'Cold Water Technique',
            description: 'Cold water activates the dive reflex, slowing your heart rate and calming anxiety.',
            options: [
                'Splash cold water on your face',
                'Hold ice cubes in your hands',
                'Place a cold cloth on your neck',
                'Run cold water over your wrists',
            ],
        },
    },
    {
        id: 'movement',
        name: 'Movement Break',
        icon: 'walk',
        color: '#10B981',
        description: 'Shake off tension with simple movement',
        isModal: true,
        content: {
            title: '5-Minute Movement',
            exercises: [
                { name: 'Shake it out', duration: '30 seconds', desc: 'Shake your hands, arms, and whole body' },
                { name: 'Stretch up', duration: '30 seconds', desc: 'Reach for the sky and stretch side to side' },
                { name: 'March in place', duration: '1 minute', desc: 'Get your blood flowing' },
                { name: 'Shoulder rolls', duration: '30 seconds', desc: 'Roll shoulders forward, then backward' },
                { name: 'Deep squats', duration: '1 minute', desc: 'Slow, controlled squats' },
                { name: 'Cool down', duration: '30 seconds', desc: 'Gentle stretching and deep breaths' },
            ],
        },
    },
    {
        id: 'distraction',
        name: 'Distraction Games',
        icon: 'game-controller',
        color: '#F59E0B',
        description: 'Occupy your mind with engaging tasks',
        screen: 'Distraction',
    },
    {
        id: 'safe_place',
        name: 'Safe Place Visualization',
        icon: 'home',
        color: '#6366F1',
        description: 'Imagine a peaceful, calming environment',
        isModal: true,
        content: {
            title: 'Safe Place Visualization',
            script: [
                'Close your eyes and take a deep breath.',
                'Picture a place where you feel completely safe and calm.',
                'It might be a beach, a forest, a cozy room, or somewhere imaginary.',
                'Notice the colors, shapes, and lighting in this place.',
                'Feel the temperature, the textures around you.',
                'Listen to the sounds in this peaceful place.',
                'Breathe in the fresh, clean air.',
                'Know that you can return here anytime you need.',
                'Stay here for a moment, absorbing the peace.',
                'When you\'re ready, slowly return to the present.',
            ],
        },
    },
];

export const CopingToolkitScreen = ({ navigation }) => {
    const colors = useColors();
    const [selectedTool, setSelectedTool] = useState(null);
    const [groundingStep, setGroundingStep] = useState(0);

    const handleToolPress = (tool) => {
        if (tool.screen) {
            navigation.navigate(tool.screen);
        } else if (tool.isModal) {
            setSelectedTool(tool);
            setGroundingStep(0);
        }
    };

    const renderModalContent = () => {
        if (!selectedTool) return null;

        const content = selectedTool.content;

        if (selectedTool.id === 'grounding') {
            const step = content.steps[groundingStep];
            return (
                <View style={styles.groundingContent}>
                    <View style={[styles.groundingNumber, { backgroundColor: selectedTool.color }]}>
                        <Text style={styles.groundingNumberText}>{step.count}</Text>
                    </View>
                    <Text style={[styles.groundingSense, { color: selectedTool.color }]}>{step.sense}</Text>
                    <Text style={[styles.groundingPrompt, { color: colors.text.primary }]}>{step.prompt}</Text>

                    <View style={styles.groundingNav}>
                        {groundingStep > 0 && (
                            <Pressable
                                onPress={() => setGroundingStep(s => s - 1)}
                                style={[styles.groundingButton, { backgroundColor: colors.background.secondary }]}
                            >
                                <Ionicons name="arrow-back" size={20} color={colors.text.primary} />
                            </Pressable>
                        )}
                        {groundingStep < content.steps.length - 1 ? (
                            <Pressable
                                onPress={() => setGroundingStep(s => s + 1)}
                                style={[styles.groundingButton, { backgroundColor: selectedTool.color }]}
                            >
                                <Text style={styles.groundingButtonText}>Next</Text>
                                <Ionicons name="arrow-forward" size={20} color="#fff" />
                            </Pressable>
                        ) : (
                            <Pressable
                                onPress={() => setSelectedTool(null)}
                                style={[styles.groundingButton, { backgroundColor: '#10B981' }]}
                            >
                                <Text style={styles.groundingButtonText}>Done</Text>
                                <Ionicons name="checkmark" size={20} color="#fff" />
                            </Pressable>
                        )}
                    </View>
                </View>
            );
        }

        if (selectedTool.id === 'muscle_relaxation') {
            return (
                <View style={styles.listContent}>
                    <Text style={[styles.contentIntro, { color: colors.text.secondary }]}>
                        {content.intro}
                    </Text>
                    {content.groups.map((group, i) => (
                        <View key={i} style={[styles.listItem, { backgroundColor: colors.background.secondary }]}>
                            <Text style={[styles.listNumber, { color: selectedTool.color }]}>{i + 1}</Text>
                            <Text style={[styles.listText, { color: colors.text.primary }]}>{group}</Text>
                        </View>
                    ))}
                </View>
            );
        }

        if (selectedTool.id === 'meditation' || selectedTool.id === 'safe_place') {
            const steps = content.steps || content.script;
            return (
                <View style={styles.listContent}>
                    {steps.map((step, i) => (
                        <View key={i} style={[styles.stepItem, { backgroundColor: colors.background.secondary }]}>
                            <View style={[styles.stepDot, { backgroundColor: selectedTool.color }]} />
                            <Text style={[styles.stepText, { color: colors.text.primary }]}>{step}</Text>
                        </View>
                    ))}
                </View>
            );
        }

        if (selectedTool.id === 'cold_water') {
            return (
                <View style={styles.listContent}>
                    <Text style={[styles.contentIntro, { color: colors.text.secondary }]}>
                        {content.description}
                    </Text>
                    {content.options.map((option, i) => (
                        <View key={i} style={[styles.optionItem, { backgroundColor: colors.background.secondary }]}>
                            <Ionicons name="water" size={20} color={selectedTool.color} />
                            <Text style={[styles.optionText, { color: colors.text.primary }]}>{option}</Text>
                        </View>
                    ))}
                </View>
            );
        }

        if (selectedTool.id === 'movement') {
            return (
                <View style={styles.listContent}>
                    {content.exercises.map((ex, i) => (
                        <View key={i} style={[styles.exerciseItem, { backgroundColor: colors.background.secondary }]}>
                            <View style={styles.exerciseHeader}>
                                <Text style={[styles.exerciseName, { color: colors.text.primary }]}>{ex.name}</Text>
                                <Text style={[styles.exerciseDuration, { color: selectedTool.color }]}>{ex.duration}</Text>
                            </View>
                            <Text style={[styles.exerciseDesc, { color: colors.text.muted }]}>{ex.desc}</Text>
                        </View>
                    ))}
                </View>
            );
        }

        return null;
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
            <SafeAreaView edges={['top']} style={styles.safeArea}>
                <View style={[styles.header, { borderBottomColor: colors.border }]}>
                    <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
                    </Pressable>
                    <Text style={[styles.headerTitle, { color: colors.text.primary }]}>Coping Toolkit</Text>
                    <View style={styles.placeholder} />
                </View>

                <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
                    <Text style={[styles.introText, { color: colors.text.secondary }]}>
                        When cravings hit or you feel overwhelmed, try one of these evidence-based techniques.
                    </Text>

                    <View style={styles.toolsGrid}>
                        {COPING_TOOLS.map((tool) => (
                            <Pressable
                                key={tool.id}
                                onPress={() => handleToolPress(tool)}
                                style={({ pressed }) => [
                                    styles.toolCard,
                                    {
                                        backgroundColor: colors.background.card,
                                        opacity: pressed ? 0.9 : 1,
                                    },
                                ]}
                            >
                                <View style={[styles.toolIcon, { backgroundColor: tool.color + '20' }]}>
                                    <Ionicons name={tool.icon} size={28} color={tool.color} />
                                </View>
                                <Text style={[styles.toolName, { color: colors.text.primary }]}>{tool.name}</Text>
                                <Text style={[styles.toolDesc, { color: colors.text.muted }]} numberOfLines={2}>
                                    {tool.description}
                                </Text>
                            </Pressable>
                        ))}
                    </View>

                    <View style={styles.bottomPadding} />
                </ScrollView>
            </SafeAreaView>

            <Modal visible={!!selectedTool} transparent animationType="slide">
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { backgroundColor: colors.background.card }]}>
                        <View style={styles.modalHeader}>
                            <View style={[styles.modalIconHeader, { backgroundColor: selectedTool?.color + '20' }]}>
                                <Ionicons name={selectedTool?.icon} size={24} color={selectedTool?.color} />
                            </View>
                            <Text style={[styles.modalTitle, { color: colors.text.primary }]}>
                                {selectedTool?.content?.title}
                            </Text>
                            <Pressable onPress={() => setSelectedTool(null)} style={styles.closeButton}>
                                <Ionicons name="close" size={24} color={colors.text.secondary} />
                            </Pressable>
                        </View>

                        <ScrollView style={styles.modalScroll}>
                            {renderModalContent()}
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
    introText: {
        fontSize: typography.size.base,
        lineHeight: 22,
        marginBottom: spacing.lg,
    },
    toolsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.sm,
    },
    toolCard: {
        width: '48%',
        padding: spacing.md,
        borderRadius: 16,
    },
    toolIcon: {
        width: 56,
        height: 56,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.sm,
    },
    toolName: {
        fontSize: typography.size.base,
        fontWeight: '600',
        marginBottom: 4,
    },
    toolDesc: {
        fontSize: typography.size.xs,
        lineHeight: 16,
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
        maxHeight: '85%',
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.lg,
        gap: spacing.md,
    },
    modalIconHeader: {
        width: 40,
        height: 40,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalTitle: {
        flex: 1,
        fontSize: typography.size.lg,
        fontWeight: '700',
    },
    closeButton: {
        padding: spacing.xs,
    },
    modalScroll: {
        padding: spacing.lg,
        paddingTop: 0,
    },
    groundingContent: {
        alignItems: 'center',
        paddingVertical: spacing.xl,
    },
    groundingNumber: {
        width: 80,
        height: 80,
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.lg,
    },
    groundingNumberText: {
        fontSize: 40,
        fontWeight: '700',
        color: '#fff',
    },
    groundingSense: {
        fontSize: typography.size.lg,
        fontWeight: '700',
        marginBottom: spacing.sm,
    },
    groundingPrompt: {
        fontSize: typography.size.base,
        textAlign: 'center',
        marginBottom: spacing.xl,
    },
    groundingNav: {
        flexDirection: 'row',
        gap: spacing.md,
    },
    groundingButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.lg,
        borderRadius: 12,
        gap: spacing.sm,
    },
    groundingButtonText: {
        color: '#fff',
        fontWeight: '600',
    },
    listContent: {
        paddingBottom: spacing.xl,
    },
    contentIntro: {
        fontSize: typography.size.base,
        lineHeight: 22,
        marginBottom: spacing.lg,
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.md,
        borderRadius: 12,
        marginBottom: spacing.sm,
        gap: spacing.md,
    },
    listNumber: {
        fontSize: typography.size.lg,
        fontWeight: '700',
        width: 24,
    },
    listText: {
        flex: 1,
        fontSize: typography.size.base,
    },
    stepItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        padding: spacing.md,
        borderRadius: 12,
        marginBottom: spacing.sm,
        gap: spacing.md,
    },
    stepDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginTop: 6,
    },
    stepText: {
        flex: 1,
        fontSize: typography.size.base,
        lineHeight: 22,
    },
    optionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.md,
        borderRadius: 12,
        marginBottom: spacing.sm,
        gap: spacing.md,
    },
    optionText: {
        flex: 1,
        fontSize: typography.size.base,
    },
    exerciseItem: {
        padding: spacing.md,
        borderRadius: 12,
        marginBottom: spacing.sm,
    },
    exerciseHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    exerciseName: {
        fontSize: typography.size.base,
        fontWeight: '600',
    },
    exerciseDuration: {
        fontSize: typography.size.sm,
        fontWeight: '600',
    },
    exerciseDesc: {
        fontSize: typography.size.sm,
    },
});

export default CopingToolkitScreen;

// --- End of CopingToolkitScreen.js ---
