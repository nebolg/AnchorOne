// Author: -GLOBENXCC-
// OS support: iOS, Android, Web
// Description: Quick action buttons for Log Craving, Journal, and Need Help Now

import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColors, colors, spacing, typography } from '../../theme';

const ActionButton = ({ icon, label, color, onPress, isEmergency = false, themeColors }) => {
    if (isEmergency) {
        return (
            <Pressable
                onPress={onPress}
                style={({ pressed }) => [
                    styles.actionButton,
                    styles.emergencyButton,
                    pressed && styles.buttonPressed,
                ]}
            >
                <Ionicons name={icon} size={24} color={themeColors.text.inverse} style={styles.iconEmergency} />
                <Text style={[styles.emergencyLabel, { color: themeColors.text.inverse }]}>{label}</Text>
            </Pressable>
        );
    }

    return (
        <Pressable
            onPress={onPress}
            style={({ pressed }) => [
                styles.actionButton,
                { backgroundColor: color + '15' },
                pressed && styles.buttonPressed,
            ]}
        >
            <Ionicons name={icon} size={24} color={color} style={styles.iconNormal} />
            <Text style={[styles.label, { color }]}>{label}</Text>
        </Pressable>
    );
};

export const QuickActions = ({
    style,
    onLogCraving,
    onJournal,
    onNeedHelp,
}) => {
    const themeColors = useColors();

    return (
        <View style={[styles.container, style]}>
            <ActionButton
                icon="book"
                label="Log Craving"
                color={themeColors.primary.blue}
                onPress={onLogCraving}
                themeColors={themeColors}
            />
            <ActionButton
                icon="create"
                label="Journal"
                color={themeColors.primary.violet}
                onPress={onJournal}
                themeColors={themeColors}
            />
            <ActionButton
                icon="flash"
                label="Need Help Now"
                color={themeColors.status.error}
                onPress={onNeedHelp}
                isEmergency
                themeColors={themeColors}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.screenPadding,
        marginVertical: spacing.md,
    },
    actionButton: {
        flex: 1,
        marginHorizontal: spacing.xs,
        borderRadius: spacing.radius.lg,
        overflow: 'hidden',
    },
    emergencyButton: {
        backgroundColor: '#EF4444',
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.sm,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#EF4444',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.35,
        shadowRadius: 6,
        elevation: 5,
    },
    buttonPressed: {
        opacity: 0.8,
        transform: [{ scale: 0.97 }],
    },
    iconNormal: {
        textAlign: 'center',
        marginTop: spacing.md,
        marginBottom: spacing.xs,
    },
    iconEmergency: {
        textAlign: 'center',
        marginTop: spacing.xs,
        marginBottom: spacing.xs,
    },
    label: {
        fontSize: typography.size.xs,
        fontWeight: typography.weight.medium,
        textAlign: 'center',
        paddingBottom: spacing.md,
    },
    emergencyLabel: {
        fontSize: typography.size.xs,
        fontWeight: typography.weight.bold,
        color: colors.text.inverse,
        textAlign: 'center',
        paddingBottom: spacing.sm,
    },
});

export default QuickActions;

// --- End of QuickActions.js ---
