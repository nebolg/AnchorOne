// Author: -GLOBENXCC-
// OS support: iOS, Android, Web
// Description: Daily affirmation card with inspiring quotes

import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../common';
import { useColors, colors, spacing, typography } from '../../theme';

const AFFIRMATIONS = [
    "Recovery is not a straight line. But it's worth it.",
    "You don't have to be perfect. You just have to keep trying.",
    "Every moment is a fresh beginning.",
    "You are stronger than your cravings.",
    "One day at a time. That's all you need to do.",
    "Your past doesn't define your future.",
    "Progress, not perfection.",
    "You are not alone in this journey.",
    "Today is another chance to change your life.",
    "Small steps lead to big changes.",
    "You've survived 100% of your worst days.",
    "Healing takes time, and that's okay.",
    "You are worthy of a better life.",
    "Each day clean is a victory.",
    "The struggle you're in today is developing the strength you need for tomorrow.",
];

export const AffirmationCard = ({ style }) => {
    const themeColors = useColors();
    const [affirmation, setAffirmation] = useState('');

    useEffect(() => {
        // Get a new affirmation once per day based on date
        const today = new Date();
        const dayOfYear = Math.floor(
            (today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24)
        );
        const index = dayOfYear % AFFIRMATIONS.length;
        setAffirmation(AFFIRMATIONS[index]);
    }, []);

    return (
        <Card style={[styles.card, style, { backgroundColor: themeColors.background.card, borderColor: themeColors.background.secondary }]}>
            <View style={styles.content}>
                <View style={styles.header}>
                    <Ionicons name="sparkles" size={12} color={themeColors.primary.teal} style={{ marginRight: 4 }} />
                    <Text style={[styles.label, { color: themeColors.primary.teal }]}>Daily Spark</Text>
                </View>
                <Text style={[styles.affirmation, { color: themeColors.text.primary }]}>{affirmation}</Text>
            </View>
            <View style={styles.decorationContainer}>
                <View style={[styles.circleDecoration, { backgroundColor: themeColors.primary.teal + '08' }]} />
            </View>
        </Card>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: colors.background.card,
        padding: spacing.xl,
        marginHorizontal: spacing.screenPadding,
        marginVertical: spacing.md,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: colors.background.secondary,
        overflow: 'hidden',
    },
    content: {
        zIndex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.sm,
    },
    label: {
        color: colors.primary.teal,
        fontSize: 10,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    affirmation: {
        color: colors.text.primary,
        fontSize: 20,
        fontWeight: '700',
        lineHeight: 28,
        letterSpacing: -0.5,
    },
    decorationContainer: {
        position: 'absolute',
        top: -20,
        right: -20,
    },
    circleDecoration: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: colors.primary.teal + '08',
    },
});

export default AffirmationCard;

// --- End of AffirmationCard.js ---
