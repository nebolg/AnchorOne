// Author: -GLOBENXCC-
// OS support: iOS, Android, Web
// Description: Enhanced reflection modal with prompts, mood, gratitude, and animations

import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, Text, Modal, Pressable, TextInput, ScrollView, KeyboardAvoidingView, Platform, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useColors, colors, spacing, typography } from '../../theme';
import { useSobrietyStore } from '../../store';
import { EASING, SPRING } from '../../utils/animations';

const PROMPTS = [
    { id: 'free', label: 'Free Write', icon: 'create', placeholder: "What's on your mind today?" },
    { id: 'grateful', label: 'Gratitude', icon: 'heart', placeholder: "What are you grateful for today?" },
    { id: 'challenge', label: 'Challenge', icon: 'fitness', placeholder: "What challenge did you overcome?" },
    { id: 'goal', label: 'Goal Check', icon: 'flag', placeholder: "How are you progressing toward your goals?" },
    { id: 'trigger', label: 'Trigger', icon: 'warning', placeholder: "What triggered you today and how did you cope?" },
];

const MOODS = [
    { id: 'great', icon: 'happy', label: 'Great', color: '#10B981' },
    { id: 'good', icon: 'happy-outline', label: 'Good', color: '#22C55E' },
    { id: 'okay', icon: 'remove-circle', label: 'Okay', color: '#F59E0B' },
    { id: 'low', icon: 'sad-outline', label: 'Low', color: '#EF4444' },
    { id: 'anxious', icon: 'sad', label: 'Anxious', color: '#8B5CF6' },
];

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const JournalModal = ({ visible, onClose, navigation }) => {
    const themeColors = useColors();
    const addJournalEntry = useSobrietyStore(state => state.addJournalEntry);

    const [content, setContent] = useState('');
    const [selectedPrompt, setSelectedPrompt] = useState('free');
    const [selectedMood, setSelectedMood] = useState(null);
    const [showSuccess, setShowSuccess] = useState(false);

    // Animations
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(20)).current;
    const saveScale = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        if (visible) {
            setContent('');
            setSelectedPrompt('free');
            setSelectedMood(null);
            setShowSuccess(false);
            Animated.parallel([
                Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
                Animated.timing(slideAnim, { toValue: 0, duration: 300, easing: EASING.decelerate, useNativeDriver: true }),
            ]).start();
        }
    }, [visible]);

    const currentPrompt = PROMPTS.find(p => p.id === selectedPrompt);

    const handleSubmit = () => {
        if (content.trim()) {
            const entryContent = selectedMood
                ? `[${MOODS.find(m => m.id === selectedMood)?.label}] ${content.trim()}`
                : content.trim();
            addJournalEntry(entryContent);
            setShowSuccess(true);
            setTimeout(() => {
                setShowSuccess(false);
                setContent('');
                onClose();
            }, 1500);
        }
    };

    const handleViewHistory = () => {
        onClose();
        if (navigation) {
            navigation.navigate('JournalHistory');
        }
    };

    const handlePressIn = () => {
        Animated.spring(saveScale, { toValue: 0.95, ...SPRING.stiff, useNativeDriver: true }).start();
    };

    const handlePressOut = () => {
        Animated.spring(saveScale, { toValue: 1, ...SPRING.gentle, useNativeDriver: true }).start();
    };

    const wordCount = content.trim().split(/\s+/).filter(Boolean).length;

    if (showSuccess) {
        return (
            <Modal visible={visible} animationType="fade" presentationStyle="pageSheet" onRequestClose={onClose}>
                <SafeAreaView style={[styles.successContainer, { backgroundColor: themeColors.background.primary }]}>
                    <Animated.View style={[styles.successContent, { opacity: fadeAnim }]}>
                        <View style={styles.successIcon}>
                            <Ionicons name="checkmark-circle" size={80} color={themeColors.primary.teal} />
                        </View>
                        <Text style={[styles.successTitle, { color: themeColors.text.primary }]}>Reflection Saved</Text>
                        <Text style={[styles.successSubtitle, { color: themeColors.text.muted }]}>Taking time to reflect builds self-awareness</Text>
                    </Animated.View>
                </SafeAreaView>
            </Modal>
        );
    }

    return (
        <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
            <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background.primary }]}>
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
                    {/* Header */}
                    <View style={[styles.header, { borderBottomColor: themeColors.background.secondary }]}>
                        <Pressable onPress={onClose} style={styles.headerButton}>
                            <Ionicons name="close" size={24} color={themeColors.text.muted} />
                        </Pressable>
                        <Text style={[styles.title, { color: themeColors.text.primary }]}>Reflect</Text>
                        <AnimatedPressable
                            onPress={handleSubmit}
                            onPressIn={handlePressIn}
                            onPressOut={handlePressOut}
                            disabled={!content.trim()}
                            style={[styles.saveButton, !content.trim() && styles.saveButtonDisabled, { transform: [{ scale: saveScale }] }]}
                        >
                            <Text style={styles.saveText}>Save</Text>
                        </AnimatedPressable>
                    </View>

                    <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
                        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>

                            {/* Mood Selector */}
                            <View style={styles.section}>
                                <Text style={[styles.sectionLabel, { color: themeColors.text.muted }]}>How are you feeling?</Text>
                                <View style={styles.moodRow}>
                                    {MOODS.map((mood) => (
                                        <Pressable
                                            key={mood.id}
                                            onPress={() => setSelectedMood(mood.id)}
                                            style={[
                                                styles.moodButton,
                                                { backgroundColor: themeColors.background.card, borderColor: themeColors.background.secondary },
                                                selectedMood === mood.id && { borderColor: mood.color, backgroundColor: mood.color + '15' },
                                            ]}
                                        >
                                            <Ionicons name={mood.icon} size={24} color={selectedMood === mood.id ? mood.color : themeColors.text.muted} />
                                            <Text style={[
                                                styles.moodLabel,
                                                { color: themeColors.text.muted },
                                                selectedMood === mood.id && { color: mood.color }
                                            ]}>
                                                {mood.label}
                                            </Text>
                                        </Pressable>
                                    ))}
                                </View>
                            </View>

                            {/* Prompt Selector */}
                            <View style={styles.section}>
                                <Text style={[styles.sectionLabel, { color: themeColors.text.muted }]}>What would you like to reflect on?</Text>
                                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.promptScroll}>
                                    {PROMPTS.map((prompt) => (
                                        <Pressable
                                            key={prompt.id}
                                            onPress={() => setSelectedPrompt(prompt.id)}
                                            style={[
                                                styles.promptChip,
                                                { backgroundColor: themeColors.background.card, borderColor: themeColors.background.secondary },
                                                selectedPrompt === prompt.id && styles.promptChipSelected,
                                            ]}
                                        >
                                            <Ionicons
                                                name={prompt.icon}
                                                size={16}
                                                color={selectedPrompt === prompt.id ? themeColors.primary.teal : themeColors.text.muted}
                                            />
                                            <Text style={[
                                                styles.promptChipText,
                                                { color: themeColors.text.secondary },
                                                selectedPrompt === prompt.id && styles.promptChipTextSelected,
                                            ]}>
                                                {prompt.label}
                                            </Text>
                                        </Pressable>
                                    ))}
                                </ScrollView>
                            </View>

                            {/* Text Input */}
                            <View style={styles.inputSection}>
                                <TextInput
                                    style={[styles.input, { color: themeColors.text.primary }]}
                                    placeholder={currentPrompt?.placeholder}
                                    placeholderTextColor={themeColors.text.muted}
                                    value={content}
                                    onChangeText={setContent}
                                    multiline
                                    autoFocus
                                    textAlignVertical="top"
                                />
                            </View>

                            {/* Word Count & Stats */}
                            <View style={styles.statsRow}>
                                <Text style={[styles.statText, { color: themeColors.text.muted }]}>{wordCount} words</Text>
                                <View style={[styles.statDivider, { backgroundColor: themeColors.text.muted }]} />
                                <Text style={[styles.statText, { color: themeColors.text.muted }]}>{content.length} characters</Text>
                            </View>

                        </Animated.View>
                    </ScrollView>

                    {/* Footer */}
                    <View style={[styles.footer, { backgroundColor: themeColors.background.card, borderTopColor: themeColors.background.secondary }]}>
                        <Pressable onPress={handleViewHistory} style={styles.historyLink}>
                            <Ionicons name="book" size={18} color={themeColors.primary.teal} />
                            <Text style={[styles.historyText, { color: themeColors.primary.teal }]}>Past Reflections</Text>
                        </Pressable>
                        <View style={styles.privacyBadge}>
                            <Ionicons name="lock-closed" size={12} color={themeColors.text.muted} />
                            <Text style={[styles.privacyText, { color: themeColors.text.muted }]}>Private & Encrypted</Text>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background.primary },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.background.secondary },
    headerButton: { padding: spacing.xs },
    title: { fontSize: typography.size.lg, fontWeight: typography.weight.bold, color: colors.text.primary },
    saveButton: { backgroundColor: colors.primary.teal, paddingHorizontal: 20, paddingVertical: 8, borderRadius: 16 },
    saveButtonDisabled: { opacity: 0.4, backgroundColor: colors.text.muted },
    saveText: { color: '#fff', fontSize: 14, fontWeight: '700' },
    scrollView: { flex: 1 },
    section: { paddingHorizontal: spacing.lg, paddingTop: spacing.lg },
    sectionLabel: { fontSize: 12, fontWeight: '700', color: colors.text.muted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: spacing.sm },
    moodRow: { flexDirection: 'row', justifyContent: 'space-between' },
    moodButton: { alignItems: 'center', padding: spacing.sm, borderRadius: 16, borderWidth: 2, borderColor: colors.background.secondary, backgroundColor: colors.background.card, width: '18%' },
    moodEmoji: { fontSize: 24, marginBottom: 4 },
    moodLabel: { fontSize: 10, fontWeight: '600', color: colors.text.muted },
    promptScroll: { marginHorizontal: -spacing.lg, paddingHorizontal: spacing.lg },
    promptChip: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 14, borderRadius: 20, backgroundColor: colors.background.card, borderWidth: 1.5, borderColor: colors.background.secondary, marginRight: spacing.sm, gap: 6 },
    promptChipSelected: { borderColor: colors.primary.teal, backgroundColor: colors.primary.teal + '10' },
    promptChipText: { fontSize: 13, fontWeight: '500', color: colors.text.secondary },
    promptChipTextSelected: { color: colors.primary.teal },
    inputSection: { padding: spacing.lg, minHeight: 200 },
    input: { fontSize: 18, color: colors.text.primary, lineHeight: 28, minHeight: 180 },
    statsRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: spacing.sm, gap: spacing.sm },
    statText: { fontSize: 12, color: colors.text.muted },
    statDivider: { width: 4, height: 4, borderRadius: 2, backgroundColor: colors.text.muted },
    footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.lg, paddingVertical: spacing.md, borderTopWidth: 1, borderTopColor: colors.background.secondary, backgroundColor: colors.background.card },
    historyLink: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    historyText: { fontSize: 14, fontWeight: '600', color: colors.primary.teal },
    privacyBadge: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    privacyText: { fontSize: 11, color: colors.text.muted },
    successContainer: { flex: 1, backgroundColor: colors.background.primary, justifyContent: 'center', alignItems: 'center' },
    successContent: { alignItems: 'center', padding: spacing.xl },
    successIcon: { marginBottom: spacing.lg },
    successTitle: { fontSize: 24, fontWeight: '700', color: colors.text.primary, marginBottom: spacing.xs },
    successSubtitle: { fontSize: typography.size.sm, color: colors.text.muted, textAlign: 'center' },
});

export default JournalModal;

// --- End of JournalModal.js ---
