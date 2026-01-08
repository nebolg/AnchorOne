// Author: -GLOBENXCC-
// OS support: iOS, Android, Web
// Description: Crisis support inline card with gentle messaging

import React from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../common';
import { useColors, colors, spacing, typography } from '../../theme';
import { NOTIFICATION_COPY } from '../../constants/NotificationCopy';

export const CrisisSupportCard = ({ onPress, style }) => {
    const themeColors = useColors();

    return (
        <Card style={[styles.card, style, { backgroundColor: themeColors.background.card, borderColor: themeColors.primary.violet + '30' }]}>
            <View style={styles.content}>
                <View style={[styles.iconContainer, { backgroundColor: themeColors.primary.violet + '15' }]}>
                    <Ionicons name="heart" size={20} color={themeColors.primary.violet} />
                </View>
                <View style={styles.textContainer}>
                    <Text style={[styles.title, { color: themeColors.text.primary }]}>
                        {NOTIFICATION_COPY.CRISIS_SUPPORT.title}
                    </Text>
                    <Text style={[styles.body, { color: themeColors.text.muted }]}>
                        {NOTIFICATION_COPY.CRISIS_SUPPORT.body}
                    </Text>
                </View>
            </View>
            <Pressable
                onPress={onPress}
                style={({ pressed }) => [
                    styles.button,
                    { borderColor: themeColors.primary.violet },
                    pressed && { backgroundColor: themeColors.primary.violet + '10' },
                ]}
            >
                <Text style={[styles.buttonText, { color: themeColors.primary.violet }]}>
                    {NOTIFICATION_COPY.CRISIS_SUPPORT.button}
                </Text>
                <Ionicons name="arrow-forward" size={14} color={themeColors.primary.violet} />
            </Pressable>
        </Card>
    );
};

const styles = StyleSheet.create({
    card: {
        padding: spacing.md,
        borderWidth: 1,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: spacing.md,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.md,
    },
    textContainer: {
        flex: 1,
    },
    title: {
        fontSize: typography.size.base,
        fontWeight: typography.weight.bold,
        color: colors.text.primary,
        marginBottom: spacing.xs,
    },
    body: {
        fontSize: typography.size.sm,
        color: colors.text.muted,
        lineHeight: 20,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: spacing.sm,
        borderRadius: 12,
        borderWidth: 1.5,
        gap: spacing.xs,
    },
    buttonText: {
        fontSize: typography.size.sm,
        fontWeight: typography.weight.bold,
    },
});

export default CrisisSupportCard;

// --- End of CrisisSupportCard.js ---
