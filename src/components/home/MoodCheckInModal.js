// Author: -GLOBENXCC-
// OS support: iOS, Android, Web
// Description: Mood check-in modal with sleep and energy tracking

import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, Pressable, TextInput, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColors, spacing, typography } from '../../theme';
import { useMoodStore, MOODS } from '../../store/moodStore';

export const MoodCheckInModal = ({ visible, onClose }) => {
    const colors = useColors();
    const { logMood } = useMoodStore();

    const [step, setStep] = useState(1);
    const [selectedMood, setSelectedMood] = useState(null);
    const [sleepQuality, setSleepQuality] = useState(null);
    const [energyLevel, setEnergyLevel] = useState(null);
    const [notes, setNotes] = useState('');
    const [isComplete, setIsComplete] = useState(false);

    const handleMoodSelect = (moodId) => {
        setSelectedMood(moodId);
        setStep(2);
    };

    const handleSubmit = () => {
        logMood(selectedMood, sleepQuality, energyLevel, notes);
        setIsComplete(true);
    };

    const handleClose = () => {
        setStep(1);
        setSelectedMood(null);
        setSleepQuality(null);
        setEnergyLevel(null);
        setNotes('');
        setIsComplete(false);
        onClose();
    };

    const getTimeGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'morning';
        if (hour < 17) return 'afternoon';
        return 'evening';
    };

    if (isComplete) {
        return (
            <Modal visible={visible} transparent animationType="fade">
                <View style={styles.overlay}>
                    <View style={[styles.container, { backgroundColor: colors.background.card }]}>
                        <View style={styles.successContent}>
                            <View style={[styles.successIcon, { backgroundColor: '#10B98120' }]}>
                                <Ionicons name="checkmark-circle" size={48} color="#10B981" />
                            </View>
                            <Text style={[styles.successTitle, { color: colors.text.primary }]}>
                                Thanks for checking in! 💚
                            </Text>
                            <Text style={[styles.successText, { color: colors.text.secondary }]}>
                                Tracking your mood helps you understand your patterns.
                            </Text>
                            <Pressable
                                onPress={handleClose}
                                style={[styles.doneButton, { backgroundColor: colors.primary.teal }]}
                            >
                                <Text style={styles.doneButtonText}>Done</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>
        );
    }

    return (
        <Modal visible={visible} transparent animationType="slide">
            <View style={styles.overlay}>
                <View style={[styles.container, { backgroundColor: colors.background.card }]}>
                    <View style={styles.header}>
                        <Text style={[styles.title, { color: colors.text.primary }]}>
                            {step === 1 ? `Good ${getTimeGreeting()}!` : 'A few more details'}
                        </Text>
                        <Pressable onPress={handleClose} style={styles.closeButton}>
                            <Ionicons name="close" size={24} color={colors.text.secondary} />
                        </Pressable>
                    </View>

                    {step === 1 && (
                        <>
                            <Text style={[styles.subtitle, { color: colors.text.secondary }]}>
                                How are you feeling right now?
                            </Text>

                            <View style={styles.moodGrid}>
                                {MOODS.map((mood) => (
                                    <Pressable
                                        key={mood.id}
                                        onPress={() => handleMoodSelect(mood.id)}
                                        style={[
                                            styles.moodItem,
                                            {
                                                backgroundColor: colors.background.secondary,
                                                borderColor: selectedMood === mood.id ? mood.color : 'transparent',
                                            },
                                        ]}
                                    >
                                        <Ionicons name={mood.icon} size={32} color={mood.color} />
                                        <Text style={[styles.moodLabel, { color: colors.text.primary }]}>
                                            {mood.label}
                                        </Text>
                                    </Pressable>
                                ))}
                            </View>
                        </>
                    )}

                    {step === 2 && (
                        <ScrollView showsVerticalScrollIndicator={false}>
                            <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
                                How did you sleep last night?
                            </Text>
                            <View style={styles.ratingRow}>
                                {[1, 2, 3, 4, 5].map((val) => (
                                    <Pressable
                                        key={val}
                                        onPress={() => setSleepQuality(val)}
                                        style={[
                                            styles.ratingButton,
                                            {
                                                backgroundColor: sleepQuality === val
                                                    ? colors.primary.teal
                                                    : colors.background.secondary,
                                            },
                                        ]}
                                    >
                                        <Ionicons
                                            name="moon"
                                            size={16}
                                            color={sleepQuality === val ? '#fff' : colors.text.muted}
                                        />
                                        <Text
                                            style={[
                                                styles.ratingText,
                                                { color: sleepQuality === val ? '#fff' : colors.text.secondary },
                                            ]}
                                        >
                                            {val}
                                        </Text>
                                    </Pressable>
                                ))}
                            </View>
                            <View style={styles.ratingLabels}>
                                <Text style={[styles.ratingLabel, { color: colors.text.muted }]}>Poor</Text>
                                <Text style={[styles.ratingLabel, { color: colors.text.muted }]}>Great</Text>
                            </View>

                            <Text style={[styles.sectionTitle, { color: colors.text.primary, marginTop: spacing.lg }]}>
                                Energy level right now?
                            </Text>
                            <View style={styles.ratingRow}>
                                {[1, 2, 3, 4, 5].map((val) => (
                                    <Pressable
                                        key={val}
                                        onPress={() => setEnergyLevel(val)}
                                        style={[
                                            styles.ratingButton,
                                            {
                                                backgroundColor: energyLevel === val
                                                    ? colors.primary.blue
                                                    : colors.background.secondary,
                                            },
                                        ]}
                                    >
                                        <Ionicons
                                            name="flash"
                                            size={16}
                                            color={energyLevel === val ? '#fff' : colors.text.muted}
                                        />
                                        <Text
                                            style={[
                                                styles.ratingText,
                                                { color: energyLevel === val ? '#fff' : colors.text.secondary },
                                            ]}
                                        >
                                            {val}
                                        </Text>
                                    </Pressable>
                                ))}
                            </View>
                            <View style={styles.ratingLabels}>
                                <Text style={[styles.ratingLabel, { color: colors.text.muted }]}>Drained</Text>
                                <Text style={[styles.ratingLabel, { color: colors.text.muted }]}>Energized</Text>
                            </View>

                            <Text style={[styles.sectionTitle, { color: colors.text.primary, marginTop: spacing.lg }]}>
                                Anything on your mind? (optional)
                            </Text>
                            <TextInput
                                style={[
                                    styles.notesInput,
                                    {
                                        backgroundColor: colors.background.secondary,
                                        color: colors.text.primary,
                                    },
                                ]}
                                placeholder="How are you really feeling?"
                                placeholderTextColor={colors.text.muted}
                                value={notes}
                                onChangeText={setNotes}
                                multiline
                                numberOfLines={3}
                            />

                            <Pressable
                                onPress={handleSubmit}
                                style={[styles.submitButton, { backgroundColor: colors.primary.teal }]}
                            >
                                <Text style={styles.submitButtonText}>Save Check-in</Text>
                            </Pressable>

                            <Pressable onPress={() => setStep(1)} style={styles.backButton}>
                                <Text style={[styles.backButtonText, { color: colors.text.muted }]}>
                                    ← Change mood
                                </Text>
                            </Pressable>
                        </ScrollView>
                    )}
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'flex-end',
    },
    container: {
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: spacing.lg,
        maxHeight: '85%',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.sm,
    },
    title: {
        fontSize: typography.size.xl,
        fontWeight: '700',
    },
    closeButton: {
        padding: spacing.xs,
    },
    subtitle: {
        fontSize: typography.size.base,
        marginBottom: spacing.lg,
    },
    moodGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.sm,
        justifyContent: 'center',
    },
    moodItem: {
        width: '30%',
        alignItems: 'center',
        padding: spacing.md,
        borderRadius: 16,
        borderWidth: 2,
    },
    moodLabel: {
        fontSize: typography.size.sm,
        fontWeight: '500',
        marginTop: spacing.sm,
    },
    sectionTitle: {
        fontSize: typography.size.base,
        fontWeight: '600',
        marginBottom: spacing.md,
    },
    ratingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: spacing.sm,
    },
    ratingButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing.md,
        borderRadius: 12,
        gap: 4,
    },
    ratingText: {
        fontSize: typography.size.base,
        fontWeight: '600',
    },
    ratingLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: spacing.xs,
    },
    ratingLabel: {
        fontSize: typography.size.xs,
    },
    notesInput: {
        borderRadius: 12,
        padding: spacing.md,
        fontSize: typography.size.base,
        minHeight: 80,
        textAlignVertical: 'top',
    },
    submitButton: {
        marginTop: spacing.lg,
        padding: spacing.md,
        borderRadius: 12,
        alignItems: 'center',
    },
    submitButtonText: {
        color: '#fff',
        fontSize: typography.size.base,
        fontWeight: '600',
    },
    backButton: {
        alignItems: 'center',
        marginTop: spacing.md,
        padding: spacing.sm,
    },
    backButtonText: {
        fontSize: typography.size.sm,
    },
    successContent: {
        alignItems: 'center',
        padding: spacing.xl,
    },
    successIcon: {
        width: 80,
        height: 80,
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.lg,
    },
    successTitle: {
        fontSize: typography.size.xl,
        fontWeight: '700',
        marginBottom: spacing.sm,
    },
    successText: {
        fontSize: typography.size.base,
        textAlign: 'center',
        marginBottom: spacing.xl,
    },
    doneButton: {
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.xl,
        borderRadius: 12,
    },
    doneButtonText: {
        color: '#fff',
        fontSize: typography.size.base,
        fontWeight: '600',
    },
});

export default MoodCheckInModal;

// --- End of MoodCheckInModal.js ---
