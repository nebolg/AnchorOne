// Author: -GLOBENXCC-
// OS support: iOS, Android, Web
// Description: Premium floating action button for quick support access - "Anchor Support Button"

import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Pressable, Modal, Animated, Easing } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColors, colors, spacing, typography } from '../../theme';

const QUICK_ACTIONS = [
    { id: 'sos', icon: 'flash', label: 'SOS Help', color: '#EF4444', desc: 'Immediate crisis support' },
    { id: 'breathe', icon: 'leaf', label: 'Breathe', color: colors.primary.teal, desc: 'Calm your mind' },
    { id: 'call', icon: 'call', label: 'Call Someone', color: colors.primary.blue, desc: 'Talk to a person' },
    { id: 'distract', icon: 'game-controller', label: 'Distract Me', color: colors.primary.violet, desc: 'Break the cycle' },
    { id: 'journal', icon: 'create', label: 'Quick Journal', color: '#F59E0B', desc: 'Write it out' },
    { id: 'meeting', icon: 'people', label: 'Find Meeting', color: '#10B981', desc: 'Local support groups' },
];

export const BattleButton = ({
    style,
    onSOSPress,
    onBreathePress,
    onCallPress,
    onDistractPress,
    onJournalPress,
    onMeetingPress,
}) => {
    const themeColors = useColors();
    const [isOpen, setIsOpen] = useState(false);
    const pulseAnim = useRef(new Animated.Value(1)).current;
    const glowAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const pulseLoop = Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1.08,
                    duration: 1200,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 1200,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
            ])
        );

        const glowLoop = Animated.loop(
            Animated.sequence([
                Animated.timing(glowAnim, {
                    toValue: 1,
                    duration: 1500,
                    useNativeDriver: true,
                }),
                Animated.timing(glowAnim, {
                    toValue: 0,
                    duration: 1500,
                    useNativeDriver: true,
                }),
            ])
        );

        pulseLoop.start();
        glowLoop.start();

        return () => {
            pulseLoop.stop();
            glowLoop.stop();
        };
    }, []);

    const handleActionPress = (actionId) => {
        setIsOpen(false);
        switch (actionId) {
            case 'sos': onSOSPress?.(); break;
            case 'breathe': onBreathePress?.(); break;
            case 'call': onCallPress?.(); break;
            case 'distract': onDistractPress?.(); break;
            case 'journal': onJournalPress?.(); break;
            case 'meeting': onMeetingPress?.(); break;
        }
    };

    return (
        <>
            {/* Pulsing Glow Ring */}
            <Animated.View
                style={[
                    styles.glowRing,
                    style,
                    {
                        opacity: glowAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0.3, 0.7]
                        }),
                        transform: [{ scale: pulseAnim }]
                    }
                ]}
            />

            {/* Main FAB */}
            <Animated.View style={[styles.fabWrapper, style, { transform: [{ scale: pulseAnim }] }]}>
                <Pressable
                    onPress={() => setIsOpen(true)}
                    style={({ pressed }) => [
                        styles.fab,
                        pressed && styles.fabPressed,
                    ]}
                >
                    <View style={styles.fabSolid}>
                        <View style={styles.innerCircle}>
                            <Ionicons name="boat" size={26} color={colors.primary.teal} />
                        </View>
                    </View>
                </Pressable>
            </Animated.View>

            {/* Action Menu Modal */}
            <Modal
                visible={isOpen}
                transparent
                animationType="fade"
                onRequestClose={() => setIsOpen(false)}
            >
                <Pressable style={styles.overlay} onPress={() => setIsOpen(false)}>
                    <View style={[styles.menuContainer, { backgroundColor: themeColors.background.card }]}>
                        <View style={styles.menuHeader}>
                            <View style={styles.menuIconContainer}>
                                <Ionicons name="boat" size={28} color={themeColors.primary.teal} />
                            </View>
                            <Text style={[styles.menuTitle, { color: themeColors.text.primary }]}>Drop Anchor</Text>
                            <Text style={[styles.menuSubtitle, { color: themeColors.text.muted }]}>Ground yourself with support</Text>
                        </View>

                        <View style={styles.actionsGrid}>
                            {QUICK_ACTIONS.map((action, index) => (
                                <Pressable
                                    key={action.id}
                                    onPress={() => handleActionPress(action.id)}
                                    style={({ pressed }) => [
                                        styles.actionItem,
                                        { borderLeftColor: action.color, backgroundColor: themeColors.background.secondary },
                                        pressed && styles.actionPressed,
                                    ]}
                                >
                                    <View style={[styles.actionIconBox, { backgroundColor: action.color + '15' }]}>
                                        <Ionicons name={action.icon} size={22} color={action.color} />
                                    </View>
                                    <View style={styles.actionTextBox}>
                                        <Text style={[styles.actionLabel, { color: themeColors.text.primary }]}>{action.label}</Text>
                                        <Text style={[styles.actionDesc, { color: themeColors.text.muted }]}>{action.desc}</Text>
                                    </View>
                                    <Ionicons name="chevron-forward" size={16} color={themeColors.text.muted} />
                                </Pressable>
                            ))}
                        </View>

                        <Pressable
                            onPress={() => setIsOpen(false)}
                            style={[styles.closeButton, { backgroundColor: themeColors.background.secondary }]}
                        >
                            <Text style={[styles.closeText, { color: themeColors.text.primary }]}>I'm okay for now</Text>
                        </Pressable>
                    </View>
                </Pressable>
            </Modal>
        </>
    );
};

const styles = StyleSheet.create({
    glowRing: {
        position: 'absolute',
        bottom: 96,
        right: spacing.screenPadding - 4,
        width: 68,
        height: 68,
        borderRadius: 34,
        backgroundColor: colors.primary.teal,
    },
    fabWrapper: {
        position: 'absolute',
        bottom: 100,
        right: spacing.screenPadding,
        width: 60,
        height: 60,
        borderRadius: 30,
    },
    fab: {
        width: 60,
        height: 60,
        borderRadius: 30,
        shadowColor: colors.primary.teal,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
        elevation: 10,
    },
    fabSolid: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: colors.primary.teal,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 3,
    },
    innerCircle: {
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: colors.background.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    fabPressed: {
        transform: [{ scale: 0.95 }],
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing.screenPadding,
    },
    menuContainer: {
        backgroundColor: colors.background.card,
        borderRadius: spacing.radius['2xl'],
        padding: spacing.lg,
        width: '100%',
        maxWidth: 380,
        borderWidth: 1,
        borderColor: colors.background.secondary,
    },
    menuHeader: {
        alignItems: 'center',
        marginBottom: spacing.lg,
    },
    menuIconContainer: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: colors.primary.teal + '15',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.sm,
    },
    menuTitle: {
        fontSize: typography.size.xl,
        fontWeight: typography.weight.bold,
        color: colors.text.primary,
        letterSpacing: -0.5,
    },
    menuSubtitle: {
        fontSize: typography.size.sm,
        color: colors.text.muted,
        marginTop: 4,
    },
    actionsGrid: {
        gap: spacing.xs,
    },
    actionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.background.secondary + '50',
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.md,
        borderRadius: spacing.radius.lg,
        borderLeftWidth: 3,
    },
    actionPressed: {
        opacity: 0.8,
        transform: [{ scale: 0.98 }],
    },
    actionIconBox: {
        width: 40,
        height: 40,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.sm,
    },
    actionTextBox: {
        flex: 1,
    },
    actionLabel: {
        fontSize: typography.size.sm,
        fontWeight: typography.weight.semibold,
        color: colors.text.primary,
    },
    actionDesc: {
        fontSize: 11,
        color: colors.text.muted,
        marginTop: 1,
    },
    closeButton: {
        marginTop: spacing.lg,
        paddingVertical: spacing.md,
        alignItems: 'center',
        backgroundColor: colors.background.secondary,
        borderRadius: spacing.radius.lg,
    },
    closeText: {
        fontSize: typography.size.sm,
        color: colors.text.secondary,
        fontWeight: typography.weight.medium,
    },
});

export default BattleButton;

// --- End of BattleButton.js ---
