// Author: -GLOBENXCC-
// OS support: iOS, Android, Web
// Description: Start date selection screen with Today and custom date picker

import React, { useState } from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, Button } from '../../components/common';
import { colors, spacing, typography } from '../../theme';
import { useUserStore, useSobrietyStore } from '../../store';
import { format, subDays } from 'date-fns';

const QUICK_OPTIONS = [
    { id: 'today', label: 'Today', getDate: () => new Date() },
    { id: 'yesterday', label: 'Yesterday', getDate: () => subDays(new Date(), 1) },
    { id: 'week', label: '1 week ago', getDate: () => subDays(new Date(), 7) },
    { id: 'month', label: '1 month ago', getDate: () => subDays(new Date(), 30) },
];

export const StartDateScreen = ({ navigation, route }) => {
    const { userAddictions, hasCompletedOnboarding, completeOnboarding, setStartDate } = useUserStore();
    const { initializeMultipleAddictions } = useSobrietyStore();
    const targetAddictionId = route.params?.targetAddictionId;

    const [selectedOption, setSelectedOption] = useState('today');
    const [selectedDate, setSelectedDate] = useState(new Date());

    const handleOptionSelect = (option) => {
        setSelectedOption(option.id);
        setSelectedDate(option.getDate());
    };

    const handleComplete = () => {
        if (targetAddictionId) {
            // Editing an existing addiction's date
            setStartDate(targetAddictionId, selectedDate);
            navigation.goBack();
            return;
        }

        // Atomic bulk initialization for new addictions
        initializeMultipleAddictions(userAddictions, selectedDate.toISOString());

        if (hasCompletedOnboarding) {
            // If already onboarded, just go back to Main
            navigation.navigate('Main');
        } else {
            // First time onboarding
            completeOnboarding();
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>
                    {targetAddictionId
                        ? 'Edit Clean Date'
                        : (hasCompletedOnboarding ? 'When did you start this phase?' : 'When did you start your journey?')
                    }
                </Text>
                <Text style={styles.subtitle}>
                    {targetAddictionId
                        ? 'Update your sobriety start date for this addiction.'
                        : (hasCompletedOnboarding
                            ? 'Set the clean date for your new additions.'
                            : 'This helps us track your progress accurately.')
                    }
                </Text>

                {/* Quick options */}
                <View style={styles.optionsContainer}>
                    {QUICK_OPTIONS.map((option) => {
                        const isSelected = selectedOption === option.id;
                        return (
                            <Card
                                key={option.id}
                                style={[
                                    styles.optionCard,
                                    isSelected && styles.optionCardSelected,
                                ]}
                                onPress={() => handleOptionSelect(option)}
                            >
                                <Text style={[
                                    styles.optionLabel,
                                    isSelected && styles.optionLabelSelected,
                                ]}>
                                    {option.label}
                                </Text>
                                <Text style={[
                                    styles.optionDate,
                                    isSelected && styles.optionDateSelected,
                                ]}>
                                    {format(option.getDate(), 'MMM d, yyyy')}
                                </Text>
                                {isSelected && (
                                    <View style={styles.selectedBadge}>
                                        <Text style={styles.selectedCheck}>✓</Text>
                                    </View>
                                )}
                            </Card>
                        );
                    })}
                </View>

                {/* Selected date display */}
                <View style={styles.selectedDateContainer}>
                    <Text style={styles.selectedDateLabel}>Your clean date:</Text>
                    <Text style={styles.selectedDateValue}>
                        {format(selectedDate, 'EEEE, MMMM d, yyyy')}
                    </Text>
                </View>

                {/* Encouragement */}
                <View style={styles.encouragementContainer}>
                    <Ionicons name="sparkles" size={40} color={colors.primary.teal} style={{ marginBottom: spacing.sm }} />
                    <Text style={styles.encouragementText}>
                        Every day counts. You've already made the biggest decision by starting.
                    </Text>
                </View>
            </View>

            <View style={styles.footer}>
                <Button
                    title={targetAddictionId ? 'Save Changes' : (hasCompletedOnboarding ? 'Add to My Journey' : 'Begin My Recovery')}
                    size="large"
                    onPress={handleComplete}
                />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background.primary,
    },
    content: {
        flex: 1,
        padding: spacing.screenPadding,
    },
    title: {
        fontSize: typography.size['2xl'],
        fontWeight: typography.weight.bold,
        color: colors.text.primary,
        marginBottom: spacing.sm,
    },
    subtitle: {
        fontSize: typography.size.base,
        color: colors.text.secondary,
        marginBottom: spacing.xl,
    },
    optionsContainer: {
        gap: spacing.sm,
    },
    optionCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 2,
        borderColor: 'transparent',
    },
    optionCardSelected: {
        borderColor: colors.primary.teal,
        backgroundColor: colors.primary.teal + '08',
    },
    optionLabel: {
        fontSize: typography.size.base,
        fontWeight: typography.weight.semibold,
        color: colors.text.primary,
    },
    optionLabelSelected: {
        color: colors.primary.teal,
    },
    optionDate: {
        fontSize: typography.size.sm,
        color: colors.text.muted,
    },
    optionDateSelected: {
        color: colors.primary.teal,
    },
    selectedBadge: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: colors.primary.teal,
        alignItems: 'center',
        justifyContent: 'center',
    },
    selectedCheck: {
        color: colors.text.inverse,
        fontSize: 16,
        fontWeight: typography.weight.bold,
    },
    selectedDateContainer: {
        marginTop: spacing.xl,
        alignItems: 'center',
    },
    selectedDateLabel: {
        fontSize: typography.size.sm,
        color: colors.text.secondary,
    },
    selectedDateValue: {
        fontSize: typography.size.xl,
        fontWeight: typography.weight.bold,
        color: colors.primary.teal,
        marginTop: spacing.xs,
    },
    encouragementContainer: {
        marginTop: spacing.xl,
        padding: spacing.lg,
        backgroundColor: colors.primary.teal + '10',
        borderRadius: spacing.radius.xl,
        alignItems: 'center',
    },
    encouragementEmoji: {
        marginBottom: spacing.sm,
    },
    encouragementText: {
        fontSize: typography.size.base,
        color: colors.text.secondary,
        textAlign: 'center',
        lineHeight: 24,
    },
    footer: {
        padding: spacing.screenPadding,
        borderTopWidth: 1,
        borderTopColor: colors.background.secondary,
    },
});

export default StartDateScreen;

// --- End of StartDateScreen.js ---
