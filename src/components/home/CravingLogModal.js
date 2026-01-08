// Author: -GLOBENXCC-
// OS support: iOS, Android, Web
// Description: Enhanced craving log modal with smooth animations, coping suggestions, and notes

import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, Text, Modal, Pressable, ScrollView, Animated, TextInput, Vibration, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useColors, colors, spacing, typography } from '../../theme';
import { Button, IconRenderer } from '../common';
import { useUserStore, useSobrietyStore } from '../../store';
import { EASING, SPRING } from '../../utils/animations';

const TRIGGERS = [
    { id: 'stress', label: 'Stress', icon: 'thunderstorm', color: '#EF4444' },
    { id: 'boredom', label: 'Boredom', icon: 'hourglass', color: '#F59E0B' },
    { id: 'social', label: 'Social', icon: 'people', color: '#3B82F6' },
    { id: 'anxiety', label: 'Anxiety', icon: 'pulse', color: '#8B5CF6' },
    { id: 'loneliness', label: 'Lonely', icon: 'person', color: '#EC4899' },
    { id: 'habit', label: 'Routine', icon: 'refresh', color: '#10B981' },
    { id: 'celebration', label: 'Celebrate', icon: 'sparkles', color: '#F97316' },
    { id: 'tired', label: 'Tired', icon: 'moon', color: '#6366F1' },
];

const COPING_SUGGESTIONS = [
    { icon: 'water', text: 'Drink a glass of water', color: '#3B82F6' },
    { icon: 'walk', text: 'Take a 5-min walk', color: '#10B981' },
    { icon: 'musical-notes', text: 'Listen to calming music', color: '#8B5CF6' },
    { icon: 'call', text: 'Call someone you trust', color: '#EC4899' },
    { icon: 'fitness', text: 'Do 10 deep breaths', color: '#14B8A6' },
];

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const CravingLogModal = ({ visible, onClose }) => {
    const themeColors = useColors();
    const { userAddictions } = useUserStore();
    const logCraving = useSobrietyStore(state => state.logCraving);

    const [selectedAddiction, setSelectedAddiction] = useState(userAddictions[0]?.id);
    const [intensity, setIntensity] = useState(5);
    const [selectedTriggers, setSelectedTriggers] = useState([]);
    const [notes, setNotes] = useState('');
    const [step, setStep] = useState(1);
    const [showCoping, setShowCoping] = useState(false);

    // Animations
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(30)).current;
    const submitScale = useRef(new Animated.Value(1)).current;
    const progressAnim = useRef(new Animated.Value(0.33)).current;

    useEffect(() => {
        if (visible) {
            setStep(1);
            setSelectedAddiction(userAddictions[0]?.id);
            setIntensity(5);
            setSelectedTriggers([]);
            setNotes('');
            setShowCoping(false);
            Animated.parallel([
                Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
                Animated.timing(slideAnim, { toValue: 0, duration: 300, easing: EASING.decelerate, useNativeDriver: true }),
            ]).start();
        }
    }, [visible]);

    useEffect(() => {
        Animated.timing(progressAnim, {
            toValue: step / 3,
            duration: 300,
            easing: EASING.smooth,
            useNativeDriver: false,
        }).start();
    }, [step]);

    const handleToggleTrigger = (triggerId) => {
        setSelectedTriggers(prev =>
            prev.includes(triggerId)
                ? prev.filter(t => t !== triggerId)
                : [...prev, triggerId]
        );
    };

    const handleIntensityChange = (val) => {
        setIntensity(val);
        if (Platform.OS !== 'web') {
            Vibration.vibrate(10);
        }
    };

    const handleNext = () => {
        if (step < 3) {
            setStep(step + 1);
            Animated.sequence([
                Animated.timing(slideAnim, { toValue: -20, duration: 150, useNativeDriver: true }),
                Animated.timing(slideAnim, { toValue: 0, duration: 200, easing: EASING.decelerate, useNativeDriver: true }),
            ]).start();
        }
    };

    const handleBack = () => {
        if (step > 1) {
            setStep(step - 1);
        }
    };

    const handleSubmit = () => {
        if (selectedAddiction) {
            const triggerLabels = selectedTriggers.map(id => TRIGGERS.find(t => t.id === id)?.label).filter(Boolean).join(', ');
            logCraving(selectedAddiction, intensity, notes || null, triggerLabels || null);
            setShowCoping(true);
        }
    };

    const handleComplete = () => {
        setShowCoping(false);
        onClose();
    };

    const getIntensityColor = (val) => {
        if (val <= 3) return '#10B981';
        if (val <= 6) return '#F59E0B';
        return '#EF4444';
    };

    const getIntensityLabel = (val) => {
        if (val <= 3) return 'Mild';
        if (val <= 6) return 'Moderate';
        if (val <= 8) return 'Strong';
        return 'Intense';
    };

    const handlePressIn = () => {
        Animated.spring(submitScale, { toValue: 0.96, ...SPRING.stiff, useNativeDriver: true }).start();
    };

    const handlePressOut = () => {
        Animated.spring(submitScale, { toValue: 1, ...SPRING.gentle, useNativeDriver: true }).start();
    };

    if (showCoping) {
        return (
            <Modal visible={visible} animationType="fade" presentationStyle="pageSheet" onRequestClose={handleComplete}>
                <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background.primary }]}>
                    <View style={styles.copingContainer}>
                        <View style={styles.successIcon}>
                            <Ionicons name="checkmark-circle" size={64} color={themeColors.primary.teal} />
                        </View>
                        <Text style={[styles.copingTitle, { color: themeColors.text.primary }]}>Craving Logged</Text>
                        <Text style={[styles.copingSubtitle, { color: themeColors.text.muted }]}>You're building awareness. Here are some quick coping strategies:</Text>

                        <View style={styles.copingList}>
                            {COPING_SUGGESTIONS.map((item, index) => (
                                <View key={index} style={[styles.copingItem, { backgroundColor: themeColors.background.card }]}>
                                    <View style={[styles.copingIcon, { backgroundColor: item.color + '15' }]}>
                                        <Ionicons name={item.icon} size={20} color={item.color} />
                                    </View>
                                    <Text style={[styles.copingText, { color: themeColors.text.primary }]}>{item.text}</Text>
                                </View>
                            ))}
                        </View>

                        <Button title="Got It" onPress={handleComplete} style={styles.copingButton} />
                    </View>
                </SafeAreaView>
            </Modal>
        );
    }

    return (
        <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
            <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background.primary }]}>
                {/* Header */}
                <View style={styles.header}>
                    <Pressable onPress={step > 1 ? handleBack : onClose} style={styles.headerButton}>
                        <Ionicons name={step > 1 ? 'arrow-back' : 'close'} size={24} color={themeColors.text.muted} />
                    </Pressable>
                    <Text style={[styles.title, { color: themeColors.text.primary }]}>Log a craving</Text>
                    <Text style={[styles.stepIndicator, { color: themeColors.text.muted }]}>{step}/3</Text>
                </View>

                {/* Progress Bar */}
                <View style={styles.progressBar}>
                    <Animated.View style={[styles.progressFill, {
                        width: progressAnim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] })
                    }]} />
                </View>

                <ScrollView style={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
                    <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>

                        {/* Step 1: Select Addiction */}
                        {step === 1 && (
                            <>
                                <Text style={[styles.stepTitle, { color: themeColors.text.primary }]}>What are you craving?</Text>
                                <Text style={[styles.stepSubtitle, { color: themeColors.text.muted }]}>This is for awareness, not judgment. You're doing your best.</Text>

                                <View style={styles.addictionGrid}>
                                    {userAddictions.map((addiction) => (
                                        <Pressable
                                            key={addiction.id}
                                            onPress={() => setSelectedAddiction(addiction.id)}
                                            style={[
                                                styles.addictionCard,
                                                { backgroundColor: themeColors.background.card, borderColor: themeColors.background.secondary },
                                                selectedAddiction === addiction.id && styles.addictionCardSelected,
                                            ]}
                                        >
                                            <IconRenderer
                                                library={addiction.library || 'Ionicons'}
                                                name={addiction.icon}
                                                size={32}
                                                color={selectedAddiction === addiction.id ? themeColors.primary.teal : themeColors.text.muted}
                                            />
                                            <Text style={[
                                                styles.addictionCardName,
                                                { color: themeColors.text.secondary },
                                                selectedAddiction === addiction.id && styles.addictionCardNameSelected
                                            ]}>
                                                {addiction.name}
                                            </Text>
                                            {selectedAddiction === addiction.id && (
                                                <View style={styles.checkBadge}>
                                                    <Ionicons name="checkmark" size={14} color="#fff" />
                                                </View>
                                            )}
                                        </Pressable>
                                    ))}
                                </View>
                            </>
                        )}

                        {/* Step 2: Intensity & Triggers */}
                        {step === 2 && (
                            <>
                                <Text style={styles.stepTitle}>How strong is it?</Text>
                                <Text style={styles.stepSubtitle}>Rate the intensity of your craving</Text>

                                {/* Intensity Slider Visual */}
                                <View style={styles.intensityContainer}>
                                    <View style={[styles.intensityDisplay, { backgroundColor: getIntensityColor(intensity) + '15' }]}>
                                        <Text style={[styles.intensityNumber, { color: getIntensityColor(intensity) }]}>{intensity}</Text>
                                        <Text style={[styles.intensityLabel, { color: getIntensityColor(intensity) }]}>{getIntensityLabel(intensity)}</Text>
                                    </View>

                                    <View style={styles.intensityButtons}>
                                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((val) => (
                                            <Pressable
                                                key={val}
                                                onPress={() => handleIntensityChange(val)}
                                                style={[
                                                    styles.intensityButton,
                                                    intensity >= val && { backgroundColor: getIntensityColor(val) },
                                                ]}
                                            />
                                        ))}
                                    </View>
                                    <View style={styles.intensityLabels}>
                                        <Text style={styles.intensityLabelText}>Mild</Text>
                                        <Text style={styles.intensityLabelText}>Intense</Text>
                                    </View>
                                </View>

                                <Text style={[styles.stepTitle, { marginTop: spacing.xl, color: themeColors.text.primary }]}>What triggered this?</Text>
                                <Text style={[styles.stepSubtitle, { color: themeColors.text.muted }]}>Select all that apply</Text>

                                <View style={styles.triggerGrid}>
                                    {TRIGGERS.map((trigger) => (
                                        <Pressable
                                            key={trigger.id}
                                            onPress={() => handleToggleTrigger(trigger.id)}
                                            style={[
                                                styles.triggerChip,
                                                { backgroundColor: themeColors.background.card, borderColor: themeColors.background.secondary },
                                                selectedTriggers.includes(trigger.id) && { borderColor: trigger.color, backgroundColor: trigger.color + '10' },
                                            ]}
                                        >
                                            <Ionicons
                                                name={trigger.icon}
                                                size={16}
                                                color={selectedTriggers.includes(trigger.id) ? trigger.color : themeColors.text.muted}
                                            />
                                            <Text style={[
                                                styles.triggerChipText,
                                                { color: themeColors.text.secondary },
                                                selectedTriggers.includes(trigger.id) && { color: trigger.color }
                                            ]}>
                                                {trigger.label}
                                            </Text>
                                        </Pressable>
                                    ))}
                                </View>
                            </>
                        )}

                        {/* Step 3: Notes & Submit */}
                        {step === 3 && (
                            <>
                                <Text style={[styles.stepTitle, { color: themeColors.text.primary }]}>Any notes? (Optional)</Text>
                                <Text style={[styles.stepSubtitle, { color: themeColors.text.muted }]}>Add context to help you understand patterns</Text>

                                <TextInput
                                    style={[styles.notesInput, { backgroundColor: themeColors.background.card, borderColor: themeColors.background.secondary, color: themeColors.text.primary }]}
                                    placeholder="What were you doing? How did you feel?"
                                    placeholderTextColor={themeColors.text.muted}
                                    value={notes}
                                    onChangeText={setNotes}
                                    multiline
                                    numberOfLines={4}
                                    textAlignVertical="top"
                                />

                                {/* Summary */}
                                <View style={[styles.summaryCard, { backgroundColor: themeColors.background.card, borderColor: themeColors.background.secondary }]}>
                                    <Text style={[styles.summaryTitle, { color: themeColors.text.primary }]}>Summary</Text>
                                    <View style={styles.summaryRow}>
                                        <Text style={[styles.summaryLabel, { color: themeColors.text.muted }]}>Craving</Text>
                                        <Text style={[styles.summaryValue, { color: themeColors.text.primary }]}>{userAddictions.find(a => a.id === selectedAddiction)?.name}</Text>
                                    </View>
                                    <View style={styles.summaryRow}>
                                        <Text style={[styles.summaryLabel, { color: themeColors.text.muted }]}>Intensity</Text>
                                        <View style={[styles.summaryBadge, { backgroundColor: getIntensityColor(intensity) }]}>
                                            <Text style={styles.summaryBadgeText}>{intensity}/10</Text>
                                        </View>
                                    </View>
                                    {selectedTriggers.length > 0 && (
                                        <View style={styles.summaryRow}>
                                            <Text style={[styles.summaryLabel, { color: themeColors.text.muted }]}>Triggers</Text>
                                            <Text style={[styles.summaryValue, { color: themeColors.text.primary }]}>{selectedTriggers.map(id => TRIGGERS.find(t => t.id === id)?.label).join(', ')}</Text>
                                        </View>
                                    )}
                                </View>
                            </>
                        )}

                    </Animated.View>
                </ScrollView>

                {/* Footer Buttons */}
                <View style={styles.footer}>
                    {step < 3 ? (
                        <AnimatedPressable
                            onPress={handleNext}
                            onPressIn={handlePressIn}
                            onPressOut={handlePressOut}
                            disabled={!selectedAddiction}
                            style={[styles.nextButton, { transform: [{ scale: submitScale }] }]}
                        >
                            <Text style={styles.nextButtonText}>Continue</Text>
                            <Ionicons name="arrow-forward" size={20} color="#fff" />
                        </AnimatedPressable>
                    ) : (
                        <AnimatedPressable
                            onPress={handleSubmit}
                            onPressIn={handlePressIn}
                            onPressOut={handlePressOut}
                            style={[styles.submitButton, { transform: [{ scale: submitScale }] }]}
                        >
                            <Text style={styles.submitButtonText}>Log Craving</Text>
                            <Ionicons name="checkmark-circle" size={20} color="#fff" />
                        </AnimatedPressable>
                    )}
                </View>
            </SafeAreaView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background.primary },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.md, paddingVertical: spacing.sm },
    headerButton: { padding: spacing.xs },
    title: { fontSize: typography.size.lg, fontWeight: typography.weight.bold, color: colors.text.primary },
    stepIndicator: { fontSize: typography.size.sm, fontWeight: '600', color: colors.text.muted },
    progressBar: { height: 4, backgroundColor: colors.background.secondary, marginHorizontal: spacing.md, borderRadius: 2 },
    progressFill: { height: '100%', backgroundColor: colors.primary.teal, borderRadius: 2 },
    content: { flex: 1, padding: spacing.lg },
    stepTitle: { fontSize: 24, fontWeight: '700', color: colors.text.primary, marginBottom: spacing.xs },
    stepSubtitle: { fontSize: typography.size.sm, color: colors.text.muted, marginBottom: spacing.lg },
    addictionGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
    addictionCard: { width: '47%', padding: spacing.md, borderRadius: 16, backgroundColor: colors.background.card, borderWidth: 2, borderColor: colors.background.secondary, alignItems: 'center' },
    addictionCardSelected: { borderColor: colors.primary.teal, backgroundColor: colors.primary.teal + '08' },
    addictionCardIcon: { fontSize: 32, marginBottom: spacing.sm },
    addictionCardName: { fontSize: typography.size.sm, fontWeight: '600', color: colors.text.secondary, textAlign: 'center' },
    addictionCardNameSelected: { color: colors.primary.teal },
    checkBadge: { position: 'absolute', top: 8, right: 8, width: 22, height: 22, borderRadius: 11, backgroundColor: colors.primary.teal, alignItems: 'center', justifyContent: 'center' },
    intensityContainer: { alignItems: 'center', marginVertical: spacing.md },
    intensityDisplay: { width: 100, height: 100, borderRadius: 50, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.lg },
    intensityNumber: { fontSize: 40, fontWeight: '700' },
    intensityLabel: { fontSize: 12, fontWeight: '600', textTransform: 'uppercase' },
    intensityButtons: { flexDirection: 'row', gap: 6 },
    intensityButton: { width: 28, height: 12, borderRadius: 6, backgroundColor: colors.background.secondary },
    intensityLabels: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginTop: spacing.sm, paddingHorizontal: spacing.xs },
    intensityLabelText: { fontSize: 11, color: colors.text.muted, textTransform: 'uppercase', fontWeight: '600' },
    triggerGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
    triggerChip: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 14, borderRadius: 20, backgroundColor: colors.background.card, borderWidth: 1.5, borderColor: colors.background.secondary, gap: 6 },
    triggerChipText: { fontSize: 13, fontWeight: '500', color: colors.text.secondary },
    notesInput: { backgroundColor: colors.background.card, borderRadius: 16, padding: spacing.md, fontSize: typography.size.base, color: colors.text.primary, minHeight: 120, borderWidth: 1, borderColor: colors.background.secondary },
    summaryCard: { backgroundColor: colors.background.card, borderRadius: 16, padding: spacing.md, marginTop: spacing.lg, borderWidth: 1, borderColor: colors.background.secondary },
    summaryTitle: { fontSize: 12, fontWeight: '700', color: colors.text.muted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: spacing.sm },
    summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: spacing.xs },
    summaryLabel: { fontSize: typography.size.sm, color: colors.text.muted },
    summaryValue: { fontSize: typography.size.sm, fontWeight: '600', color: colors.text.primary },
    summaryBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
    summaryBadgeText: { fontSize: 12, fontWeight: '700', color: '#fff' },
    footer: { padding: spacing.md, paddingBottom: spacing.lg },
    nextButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primary.teal, paddingVertical: spacing.md, borderRadius: 16, gap: spacing.xs },
    nextButtonText: { fontSize: typography.size.base, fontWeight: '700', color: '#fff' },
    submitButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primary.violet, paddingVertical: spacing.md, borderRadius: 16, gap: spacing.xs },
    submitButtonText: { fontSize: typography.size.base, fontWeight: '700', color: '#fff' },
    copingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl },
    successIcon: { marginBottom: spacing.lg },
    copingTitle: { fontSize: 24, fontWeight: '700', color: colors.text.primary, marginBottom: spacing.xs },
    copingSubtitle: { fontSize: typography.size.sm, color: colors.text.muted, textAlign: 'center', marginBottom: spacing.xl },
    copingList: { width: '100%', gap: spacing.sm },
    copingItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.background.card, padding: spacing.md, borderRadius: 16, gap: spacing.md },
    copingIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
    copingText: { fontSize: typography.size.base, color: colors.text.primary, fontWeight: '500' },
    copingButton: { marginTop: spacing.xl, width: '100%' },
});

export default CravingLogModal;

// --- End of CravingLogModal.js ---
