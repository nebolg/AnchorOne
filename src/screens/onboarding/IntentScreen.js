// Author: -GLOBENXCC-
// OS support: iOS, Android, Web
// Description: Intent setting screen - "Why do you want to quit?"

import React, { useState } from 'react';
import { StyleSheet, Text, View, Pressable, TextInput, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Card, Button } from '../../components/common';
import { colors, spacing, typography } from '../../theme';
import { useUserStore } from '../../store';

const INTENT_OPTIONS = [
    { id: 'health', icon: 'fitness', text: 'For my health' },
    { id: 'family', icon: 'people', text: 'For my family' },
    { id: 'money', icon: 'wallet', text: 'To save money' },
    { id: 'mental', icon: 'bulb', text: 'For my mental health' },
    { id: 'control', icon: 'locate', text: 'To regain control' },
    { id: 'future', icon: 'star', text: 'For a better future' },
    { id: 'relationships', icon: 'heart', text: 'For my relationships' },
    { id: 'self', icon: 'person', text: 'For myself' },
];

export const IntentScreen = ({ navigation }) => {
    const { setIntent } = useUserStore();
    const [selectedReasons, setSelectedReasons] = useState([]);
    const [customReason, setCustomReason] = useState('');

    const toggleReason = (id) => {
        setSelectedReasons(prev =>
            prev.includes(id)
                ? prev.filter(r => r !== id)
                : [...prev, id]
        );
    };

    const handleContinue = () => {
        const reasons = selectedReasons.map(id =>
            INTENT_OPTIONS.find(o => o.id === id)?.text
        ).filter(Boolean);

        if (customReason.trim()) {
            reasons.push(customReason.trim());
        }

        setIntent(reasons.join(', '), selectedReasons);
        navigation.navigate('StartDate');
    };

    const hasSelection = selectedReasons.length > 0 || customReason.trim();

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <Text style={styles.title}>Why do you want to quit?</Text>
                <Text style={styles.subtitle}>
                    Understanding your "why" helps during tough moments.
                </Text>

                <View style={styles.optionsGrid}>
                    {INTENT_OPTIONS.map((option) => {
                        const isSelected = selectedReasons.includes(option.id);
                        return (
                            <Pressable
                                key={option.id}
                                onPress={() => toggleReason(option.id)}
                                style={({ pressed }) => [
                                    styles.optionItem,
                                    isSelected && styles.optionItemSelected,
                                    pressed && styles.optionItemPressed,
                                ]}
                            >
                                <View style={[styles.optionIconWrap, isSelected && styles.optionIconWrapSelected]}>
                                    <Ionicons name={option.icon} size={20} color={isSelected ? colors.primary.violet : colors.text.muted} />
                                </View>
                                <Text style={[
                                    styles.optionText,
                                    isSelected && styles.optionTextSelected,
                                ]}>
                                    {option.text}
                                </Text>
                            </Pressable>
                        );
                    })}
                </View>

                {/* Custom reason input */}
                <View style={styles.customContainer}>
                    <Text style={styles.customLabel}>Or tell us in your own words:</Text>
                    <TextInput
                        style={styles.customInput}
                        placeholder="I want to quit because..."
                        placeholderTextColor={colors.text.muted}
                        value={customReason}
                        onChangeText={setCustomReason}
                        multiline
                        numberOfLines={3}
                    />
                </View>

                {/* Encouragement */}
                <View style={styles.encouragementContainer}>
                    <Ionicons name="leaf" size={16} color={colors.primary.teal} style={{ marginRight: 6 }} />
                    <Text style={styles.encouragementText}>
                        Whatever your reason, it's valid. You're taking a brave step.
                    </Text>
                </View>
            </ScrollView>

            <View style={styles.footer}>
                <Button
                    title="Continue"
                    size="large"
                    onPress={handleContinue}
                    disabled={!hasSelection}
                />
                <Pressable
                    style={styles.skipButton}
                    onPress={() => navigation.navigate('StartDate')}
                >
                    <Text style={styles.skipText}>Skip for now</Text>
                </Pressable>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background.primary,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: spacing.screenPadding,
        paddingBottom: 150,
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
    optionsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    optionItem: {
        width: '48%',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.background.card,
        borderRadius: spacing.radius.lg,
        padding: spacing.md,
        marginBottom: spacing.sm,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    optionItemSelected: {
        borderColor: colors.primary.violet,
        backgroundColor: colors.primary.violet + '10',
    },
    optionItemPressed: {
        opacity: 0.8,
    },
    optionIcon: {
        fontSize: 24,
        marginRight: spacing.sm,
    },
    optionIconWrap: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: colors.background.secondary,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.sm,
    },
    optionIconWrapSelected: {
        backgroundColor: colors.primary.violet + '20',
    },
    optionText: {
        flex: 1,
        fontSize: typography.size.sm,
        fontWeight: typography.weight.medium,
        color: colors.text.primary,
    },
    optionTextSelected: {
        color: colors.primary.violet,
    },
    customContainer: {
        marginTop: spacing.xl,
    },
    customLabel: {
        fontSize: typography.size.sm,
        color: colors.text.secondary,
        marginBottom: spacing.sm,
    },
    customInput: {
        backgroundColor: colors.background.card,
        borderRadius: spacing.radius.lg,
        padding: spacing.md,
        fontSize: typography.size.base,
        color: colors.text.primary,
        minHeight: 80,
        textAlignVertical: 'top',
        borderWidth: 1,
        borderColor: colors.background.secondary,
    },
    encouragementContainer: {
        marginTop: spacing.xl,
        padding: spacing.md,
        backgroundColor: colors.primary.teal + '10',
        borderRadius: spacing.radius.lg,
    },
    encouragementText: {
        fontSize: typography.size.sm,
        color: colors.text.secondary,
        fontStyle: 'italic',
        textAlign: 'center',
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: spacing.screenPadding,
        backgroundColor: colors.background.primary,
        borderTopWidth: 1,
        borderTopColor: colors.background.secondary,
    },
    skipButton: {
        paddingVertical: spacing.md,
        alignItems: 'center',
    },
    skipText: {
        fontSize: typography.size.sm,
        color: colors.text.muted,
    },
});

export default IntentScreen;

// --- End of IntentScreen.js ---
