// Author: -GLOBENXCC-
// OS support: iOS, Android, Web
// Description: Milestone celebration modal with soft, non-competitive messaging

import React, { useRef, useEffect } from 'react';
import { StyleSheet, View, Text, Modal, Pressable, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColors, colors, spacing, typography } from '../../theme';
import { NOTIFICATION_COPY } from '../../constants/NotificationCopy';

export const MilestoneModal = ({ visible, onClose, milestone }) => {
    const themeColors = useColors();
    const scaleAnim = useRef(new Animated.Value(0.8)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (visible) {
            Animated.parallel([
                Animated.spring(scaleAnim, {
                    toValue: 1,
                    tension: 50,
                    friction: 7,
                    useNativeDriver: true,
                }),
                Animated.timing(opacityAnim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start();
        } else {
            scaleAnim.setValue(0.8);
            opacityAnim.setValue(0);
        }
    }, [visible]);

    const handleClose = () => {
        Animated.timing(opacityAnim, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
        }).start(() => onClose());
    };

    if (!milestone) return null;

    return (
        <Modal
            visible={visible}
            transparent
            animationType="none"
            onRequestClose={handleClose}
        >
            <View style={styles.overlay}>
                <Animated.View
                    style={[
                        styles.container,
                        { backgroundColor: themeColors.background.card },
                        { transform: [{ scale: scaleAnim }], opacity: opacityAnim },
                    ]}
                >
                    <View style={[styles.iconContainer, { backgroundColor: themeColors.primary.teal + '15' }]}>
                        <Ionicons name={milestone.icon || 'trophy'} size={48} color={themeColors.primary.teal} />
                    </View>

                    <Text style={[styles.title, { color: themeColors.text.primary }]}>
                        {NOTIFICATION_COPY.MILESTONE.title}
                    </Text>

                    <Text style={[styles.body, { color: themeColors.text.secondary }]}>
                        {NOTIFICATION_COPY.MILESTONE.getBody(milestone.label)}
                    </Text>

                    <Pressable
                        onPress={handleClose}
                        style={({ pressed }) => [
                            styles.button,
                            { backgroundColor: themeColors.primary.teal },
                            pressed && { opacity: 0.9 },
                        ]}
                    >
                        <Text style={styles.buttonText}>{NOTIFICATION_COPY.MILESTONE.button}</Text>
                    </Pressable>
                </Animated.View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing.xl,
    },
    container: {
        width: '100%',
        maxWidth: 320,
        borderRadius: 24,
        padding: spacing.xl,
        alignItems: 'center',
    },
    iconContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.lg,
    },
    title: {
        fontSize: typography.size.xl,
        fontWeight: typography.weight.bold,
        color: colors.text.primary,
        textAlign: 'center',
        marginBottom: spacing.sm,
    },
    body: {
        fontSize: typography.size.base,
        color: colors.text.secondary,
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: spacing.xl,
    },
    button: {
        width: '100%',
        paddingVertical: spacing.md,
        borderRadius: 16,
        alignItems: 'center',
    },
    buttonText: {
        fontSize: typography.size.base,
        fontWeight: typography.weight.bold,
        color: '#fff',
    },
});

export default MilestoneModal;

// --- End of MilestoneModal.js ---
