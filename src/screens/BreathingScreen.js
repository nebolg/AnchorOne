// Author: -GLOBENXCC-
// OS support: iOS, Android, Web
// Description: Breathing exercise screen for crisis support

import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, Pressable, Animated, Easing } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../components/common';
import { useColors, colors, spacing, typography } from '../theme';

const BREATH_PHASES = [
    { name: 'Breathe In', duration: 4000, instruction: 'Slowly inhale through your nose' },
    { name: 'Hold', duration: 4000, instruction: 'Hold your breath gently' },
    { name: 'Breathe Out', duration: 4000, instruction: 'Slowly exhale through your mouth' },
    { name: 'Hold', duration: 2000, instruction: 'Rest before the next breath' },
];

export const BreathingScreen = ({ navigation }) => {
    const themeColors = useColors();
    const [isActive, setIsActive] = useState(false);
    const [currentPhase, setCurrentPhase] = useState(0);
    const [cycleCount, setCycleCount] = useState(0);
    const scaleAnim = useRef(new Animated.Value(0.6)).current;
    const opacityAnim = useRef(new Animated.Value(0.5)).current;

    useEffect(() => {
        if (!isActive) {
            scaleAnim.setValue(0.6);
            opacityAnim.setValue(0.5);
            return;
        }

        const runPhase = (phaseIndex) => {
            const phase = BREATH_PHASES[phaseIndex];

            // Animate based on phase
            if (phase.name === 'Breathe In') {
                Animated.parallel([
                    Animated.timing(scaleAnim, {
                        toValue: 1,
                        duration: phase.duration,
                        easing: Easing.inOut(Easing.ease),
                        useNativeDriver: true,
                    }),
                    Animated.timing(opacityAnim, {
                        toValue: 1,
                        duration: phase.duration,
                        useNativeDriver: true,
                    }),
                ]).start();
            } else if (phase.name === 'Breathe Out') {
                Animated.parallel([
                    Animated.timing(scaleAnim, {
                        toValue: 0.6,
                        duration: phase.duration,
                        easing: Easing.inOut(Easing.ease),
                        useNativeDriver: true,
                    }),
                    Animated.timing(opacityAnim, {
                        toValue: 0.5,
                        duration: phase.duration,
                        useNativeDriver: true,
                    }),
                ]).start();
            }
        };

        runPhase(currentPhase);

        const timer = setTimeout(() => {
            const nextPhase = (currentPhase + 1) % BREATH_PHASES.length;
            setCurrentPhase(nextPhase);

            if (nextPhase === 0) {
                setCycleCount(c => c + 1);
            }
        }, BREATH_PHASES[currentPhase].duration);

        return () => clearTimeout(timer);
    }, [isActive, currentPhase]);

    const handleStart = () => {
        setIsActive(true);
        setCurrentPhase(0);
        setCycleCount(0);
    };

    const handleStop = () => {
        setIsActive(false);
        setCurrentPhase(0);
    };

    const phase = BREATH_PHASES[currentPhase];

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background.primary }]}>
            <View style={styles.header}>
                <Pressable onPress={() => navigation.goBack()} style={styles.closeButton}>
                    <Text style={[styles.closeIcon, { color: themeColors.text.secondary }]}>✕</Text>
                </Pressable>
                <Text style={[styles.title, { color: themeColors.text.primary }]}>Breathing Exercise</Text>
                <View style={{ width: 44 }} />
            </View>

            <View style={styles.content}>
                {/* Animated circle */}
                <View style={styles.circleContainer}>
                    <Animated.View
                        style={[
                            styles.breathCircle,
                            {
                                transform: [{ scale: scaleAnim }],
                                opacity: opacityAnim,
                            }
                        ]}
                    >
                        <View style={styles.innerCircle}>
                            {isActive ? (
                                <>
                                    <Text style={styles.phaseText}>{phase.name}</Text>
                                    <Text style={styles.instructionText}>{phase.instruction}</Text>
                                </>
                            ) : (
                                <>
                                    <Text style={styles.readyEmoji}>🧘</Text>
                                    <Text style={styles.readyText}>Ready to begin?</Text>
                                </>
                            )}
                        </View>
                    </Animated.View>
                </View>

                {/* Cycle counter */}
                {isActive && (
                    <View style={styles.cycleContainer}>
                        <Text style={styles.cycleLabel}>Cycles completed</Text>
                        <Text style={styles.cycleCount}>{cycleCount}</Text>
                    </View>
                )}

                {/* Controls */}
                <View style={styles.controls}>
                    {isActive ? (
                        <Button
                            title="Stop"
                            variant="secondary"
                            size="large"
                            onPress={handleStop}
                        />
                    ) : (
                        <Button
                            title="Start Breathing"
                            size="large"
                            onPress={handleStart}
                        />
                    )}
                </View>

                {/* Tips */}
                <View style={[styles.tips, { backgroundColor: themeColors.background.card }]}>
                    <Text style={[styles.tipsTitle, { color: themeColors.text.primary }]}>💡 Tips</Text>
                    <Text style={[styles.tipText, { color: themeColors.text.secondary }]}>• Find a comfortable position</Text>
                    <Text style={[styles.tipText, { color: themeColors.text.secondary }]}>• Close your eyes if comfortable</Text>
                    <Text style={[styles.tipText, { color: themeColors.text.secondary }]}>• Focus only on your breath</Text>
                    <Text style={[styles.tipText, { color: themeColors.text.secondary }]}>• 5-10 cycles usually help reduce cravings</Text>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background.primary,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing.screenPadding,
        paddingVertical: spacing.md,
    },
    closeButton: {
        width: 44,
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
    },
    closeIcon: {
        fontSize: 24,
        color: colors.text.secondary,
    },
    title: {
        fontSize: typography.size.lg,
        fontWeight: typography.weight.semibold,
        color: colors.text.primary,
    },
    content: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: spacing.screenPadding,
    },
    circleContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    breathCircle: {
        width: 280,
        height: 280,
        borderRadius: 140,
        backgroundColor: colors.primary.teal,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: colors.primary.teal,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 30,
        elevation: 10,
    },
    innerCircle: {
        width: 200,
        height: 200,
        borderRadius: 100,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing.lg,
    },
    phaseText: {
        fontSize: typography.size['2xl'],
        fontWeight: typography.weight.bold,
        color: colors.text.inverse,
        textAlign: 'center',
        marginBottom: spacing.sm,
    },
    instructionText: {
        fontSize: typography.size.sm,
        color: colors.text.inverse,
        textAlign: 'center',
        opacity: 0.9,
    },
    readyEmoji: {
        fontSize: 48,
        marginBottom: spacing.sm,
    },
    readyText: {
        fontSize: typography.size.base,
        color: colors.text.inverse,
        textAlign: 'center',
    },
    cycleContainer: {
        alignItems: 'center',
        marginBottom: spacing.xl,
    },
    cycleLabel: {
        fontSize: typography.size.sm,
        color: colors.text.muted,
    },
    cycleCount: {
        fontSize: typography.size['3xl'],
        fontWeight: typography.weight.bold,
        color: colors.primary.teal,
    },
    controls: {
        width: '100%',
        marginBottom: spacing.xl,
    },
    tips: {
        backgroundColor: colors.background.card,
        borderRadius: spacing.radius.lg,
        padding: spacing.lg,
        width: '100%',
        marginBottom: spacing.lg,
    },
    tipsTitle: {
        fontSize: typography.size.base,
        fontWeight: typography.weight.semibold,
        color: colors.text.primary,
        marginBottom: spacing.sm,
    },
    tipText: {
        fontSize: typography.size.sm,
        color: colors.text.secondary,
        marginBottom: spacing.xs,
        lineHeight: 20,
    },
});

export default BreathingScreen;

// --- End of BreathingScreen.js ---
