// Author: -GLOBENXCC-
// OS support: iOS, Android, Web
// Description: Mood selector with 5 emoji faces for daily check-in

import React, { useState } from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../common';
import { useColors, colors, spacing, typography } from '../../theme';
import { useSobrietyStore } from '../../store';

const MOODS = [
    { value: 1, icon: 'rainy', label: 'Struggling' },
    { value: 2, icon: 'cloudy', label: 'Low' },
    { value: 3, icon: 'partly-sunny', label: 'Okay' },
    { value: 4, icon: 'sunny', label: 'Good' },
    { value: 5, icon: 'sparkles', label: 'Great' },
];

export const MoodSelector = ({ style, onMoodSelect }) => {
    const themeColors = useColors();
    const [selectedMood, setSelectedMood] = useState(null);
    const logMood = useSobrietyStore(state => state.logMood);

    const handleMoodPress = (mood) => {
        setSelectedMood(mood.value);
        logMood(mood.value);
        onMoodSelect?.(mood);
    };

    return (
        <Card style={[styles.card, style, { backgroundColor: themeColors.background.card, borderColor: themeColors.background.secondary }]}>
            <Text style={[styles.question, { color: themeColors.text.secondary }]}>How are you feeling today?</Text>
            <Text style={[styles.helperText, { color: themeColors.text.muted }]}>There's no right or wrong answer.</Text>

            <View style={styles.moodsContainer}>
                {MOODS.map((mood) => (
                    <Pressable
                        key={mood.value}
                        onPress={() => handleMoodPress(mood)}
                        style={({ pressed }) => [
                            styles.moodButton,
                            { backgroundColor: themeColors.background.secondary },
                            selectedMood === mood.value && styles.moodButtonSelected,
                            selectedMood === mood.value && { backgroundColor: themeColors.mood[mood.value] + '20' },
                            pressed && styles.moodButtonPressed,
                        ]}
                    >
                        <Ionicons
                            name={mood.icon}
                            size={28}
                            color={selectedMood === mood.value ? themeColors.mood[mood.value] : themeColors.text.muted}
                        />
                    </Pressable>
                ))}
            </View>

            {selectedMood && (
                <Text style={[styles.moodLabel, { color: themeColors.text.primary }]}>
                    {MOODS.find(m => m.value === selectedMood)?.label}
                </Text>
            )}
        </Card>
    );
};

const styles = StyleSheet.create({
    card: {
        padding: spacing.xl,
        marginHorizontal: spacing.screenPadding,
        marginVertical: spacing.sm,
        alignItems: 'center',
        backgroundColor: colors.background.card,
        borderRadius: spacing.radius.xl,
        borderWidth: 1,
        borderColor: colors.background.secondary,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.02,
        shadowRadius: 8,
        elevation: 1,
    },
    question: {
        fontSize: typography.size.base,
        fontWeight: typography.weight.bold,
        color: colors.text.secondary,
        marginBottom: spacing.xs,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    helperText: {
        fontSize: typography.size.sm,
        color: colors.text.muted,
        marginBottom: spacing.lg,
    },
    moodsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    moodButton: {
        width: 56,
        height: 56,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.background.secondary,
    },
    moodButtonSelected: {
        transform: [{ scale: 1.15 }],
    },
    moodButtonPressed: {
        opacity: 0.8,
        transform: [{ scale: 0.95 }],
    },
    emoji: {
        fontSize: 28,
        opacity: 0.7,
    },
    emojiSelected: {
        opacity: 1,
    },
    moodLabel: {
        fontSize: typography.size.sm,
        fontWeight: 'bold',
        color: colors.text.primary,
        marginTop: spacing.md,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
});

export default MoodSelector;

// --- End of MoodSelector.js ---
