// Author: -GLOBENXCC-
// OS support: iOS, Android, Web
// Description: Enhanced slip logging modal with triggers, moods, and severity tracking

import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Pressable,
    Modal,
    ScrollView,
    TextInput,
    Alert,
    ActivityIndicator
} from 'react-native';
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { useColors, colors, spacing, typography } from '../../theme';
import { useUserStore } from '../../store';
import api from '../../services/api';

const TRIGGERS = [
    { id: 'stress', label: 'Stress', icon: 'thunderstorm' },
    { id: 'boredom', label: 'Boredom', icon: 'time' },
    { id: 'social', label: 'Social Pressure', icon: 'people' },
    { id: 'celebration', label: 'Celebration', icon: 'gift' },
    { id: 'loneliness', label: 'Loneliness', icon: 'person' },
    { id: 'anxiety', label: 'Anxiety', icon: 'pulse' },
    { id: 'anger', label: 'Anger', icon: 'flame' },
    { id: 'sadness', label: 'Sadness', icon: 'rainy' },
    { id: 'habit', label: 'Habit/Routine', icon: 'repeat' },
    { id: 'temptation', label: 'Saw/Heard Trigger', icon: 'eye' },
    { id: 'other', label: 'Other', icon: 'ellipsis-horizontal' },
];

const MOODS = [
    { id: 'great', icon: 'happy', label: 'Great' },
    { id: 'good', icon: 'happy-outline', label: 'Good' },
    { id: 'okay', icon: 'remove-circle', label: 'Okay' },
    { id: 'low', icon: 'sad-outline', label: 'Low' },
    { id: 'bad', icon: 'sad', label: 'Bad' },
];

const SEVERITY_LEVELS = [
    { level: 1, label: 'Minor slip', desc: 'Brief moment, quickly recovered' },
    { level: 2, label: 'Small setback', desc: 'Gave in briefly but stopped' },
    { level: 3, label: 'Moderate', desc: 'Full incident but contained' },
    { level: 4, label: 'Significant', desc: 'Prolonged relapse' },
    { level: 5, label: 'Major relapse', desc: 'Extended period' },
];

const getAddictionIcon = (addiction, selected) => {
    const color = selected ? '#fff' : colors.text.primary;
    const iconName = addiction.icon;

    // Skip if icon is an emoji (not a valid icon name)
    if (!iconName || iconName.length <= 2) {
        return <Ionicons name="alert-circle" size={22} color={color} />;
    }

    if (addiction.library === 'MaterialCommunityIcons') {
        return <MaterialCommunityIcons name={iconName} size={22} color={color} />;
    } else if (addiction.library === 'MaterialIcons') {
        return <MaterialIcons name={iconName} size={22} color={color} />;
    }
    return <Ionicons name={iconName} size={22} color={color} />;
};

export const SlipModal = ({ visible, onClose }) => {
    const themeColors = useColors();
    const { userAddictions } = useUserStore();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    // Form state
    const [selectedAddiction, setSelectedAddiction] = useState(null);
    const [severity, setSeverity] = useState(3);
    const [trigger, setTrigger] = useState(null);
    const [moodBefore, setMoodBefore] = useState(null);
    const [moodAfter, setMoodAfter] = useState(null);
    const [notes, setNotes] = useState('');
    const [learned, setLearned] = useState('');

    const resetForm = () => {
        setStep(1);
        setSelectedAddiction(null);
        setSeverity(3);
        setTrigger(null);
        setMoodBefore(null);
        setMoodAfter(null);
        setNotes('');
        setLearned('');
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    const handleNext = () => {
        if (step === 1 && !selectedAddiction) {
            Alert.alert('Select an addiction', 'Please choose which addiction you struggled with.');
            return;
        }
        if (step < 4) {
            setStep(step + 1);
        } else {
            handleSubmit();
        }
    };

    const handleBack = () => {
        if (step > 1) {
            setStep(step - 1);
        }
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const addiction = userAddictions.find(a => a.id === selectedAddiction);
            await api.logSlip({
                addictionId: selectedAddiction,
                addictionName: addiction?.name,
                severity,
                trigger,
                moodBefore,
                moodAfter,
                notes: notes.trim() || null,
                learned: learned.trim() || null,
            });

            Alert.alert(
                "Thank you for being honest",
                "Your progress still matters. Slips are part of learning, not failure.",
                [{ text: "Continue", onPress: handleClose }]
            );
        } catch (error) {
            console.error('Error logging slip:', error);
            Alert.alert('Error', 'Failed to log slip. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const renderStep1 = () => (
        <View style={styles.stepContent}>
            <Text style={[styles.stepTitle, { color: themeColors.text.primary }]}>Had a slip?</Text>
            <Text style={[styles.stepSubtitle, { color: themeColors.text.muted }]}>Log it honestly. Slips are part of learning, not failure.</Text>

            <View style={styles.addictionsList}>
                {userAddictions.map((addiction) => (
                    <Pressable
                        key={addiction.id}
                        onPress={() => setSelectedAddiction(addiction.id)}
                        style={[
                            styles.addictionItem,
                            { backgroundColor: themeColors.background.card },
                            selectedAddiction === addiction.id && styles.addictionItemSelected
                        ]}
                    >
                        {getAddictionIcon(addiction, selectedAddiction === addiction.id)}
                        <Text style={[
                            styles.addictionItemText,
                            { color: themeColors.text.secondary },
                            selectedAddiction === addiction.id && styles.addictionItemTextSelected
                        ]}>
                            {addiction.name}
                        </Text>
                    </Pressable>
                ))}
            </View>
        </View>
    );

    const renderStep2 = () => (
        <View style={styles.stepContent}>
            <Text style={[styles.stepTitle, { color: themeColors.text.primary }]}>How severe was it?</Text>
            <Text style={[styles.stepSubtitle, { color: themeColors.text.muted }]}>This helps you track patterns over time.</Text>

            <View style={styles.severityList}>
                {SEVERITY_LEVELS.map((level) => (
                    <Pressable
                        key={level.level}
                        onPress={() => setSeverity(level.level)}
                        style={[
                            styles.severityItem,
                            { backgroundColor: themeColors.background.card },
                            severity === level.level && styles.severityItemSelected
                        ]}
                    >
                        <View style={[
                            styles.severityDot,
                            severity === level.level && styles.severityDotSelected,
                            { backgroundColor: severity === level.level ? colors.primary.teal : `rgba(20, 184, 166, ${level.level * 0.2})` }
                        ]}>
                            <Text style={styles.severityNumber}>{level.level}</Text>
                        </View>
                        <View style={styles.severityInfo}>
                            <Text style={[
                                styles.severityLabel,
                                { color: themeColors.text.primary },
                                severity === level.level && styles.severityLabelSelected
                            ]}>
                                {level.label}
                            </Text>
                            <Text style={[styles.severityDesc, { color: themeColors.text.muted }]}>{level.desc}</Text>
                        </View>
                    </Pressable>
                ))}
            </View>
        </View>
    );

    const renderStep3 = () => (
        <ScrollView style={styles.stepContent} showsVerticalScrollIndicator={false}>
            <Text style={[styles.stepTitle, { color: themeColors.text.primary }]}>What triggered it?</Text>
            <Text style={[styles.stepSubtitle, { color: themeColors.text.muted }]}>Understanding triggers helps prevent future slips.</Text>

            <View style={styles.triggersList}>
                {TRIGGERS.map((t) => (
                    <Pressable
                        key={t.id}
                        onPress={() => setTrigger(t.id)}
                        style={[
                            styles.triggerItem,
                            { backgroundColor: themeColors.background.card },
                            trigger === t.id && styles.triggerItemSelected
                        ]}
                    >
                        <Ionicons
                            name={t.icon}
                            size={20}
                            color={trigger === t.id ? '#fff' : themeColors.text.muted}
                        />
                        <Text style={[
                            styles.triggerText,
                            { color: themeColors.text.secondary },
                            trigger === t.id && styles.triggerTextSelected
                        ]}>
                            {t.label}
                        </Text>
                    </Pressable>
                ))}
            </View>

            <Text style={[styles.stepTitle, { marginTop: spacing.xl }]}>How did you feel?</Text>

            <Text style={styles.moodLabel}>Before:</Text>
            <View style={styles.moodsRow}>
                {MOODS.map((mood) => (
                    <Pressable
                        key={mood.id}
                        onPress={() => setMoodBefore(mood.id)}
                        style={[
                            styles.moodItem,
                            moodBefore === mood.id && styles.moodItemSelected
                        ]}
                    >
                        <Ionicons name={mood.icon} size={24} color={moodBefore === mood.id ? colors.primary.teal : colors.text.muted} />
                        <Text style={[
                            styles.moodItemLabel,
                            moodBefore === mood.id && styles.moodItemLabelSelected
                        ]}>
                            {mood.label}
                        </Text>
                    </Pressable>
                ))}
            </View>

            <Text style={styles.moodLabel}>After:</Text>
            <View style={styles.moodsRow}>
                {MOODS.map((mood) => (
                    <Pressable
                        key={mood.id}
                        onPress={() => setMoodAfter(mood.id)}
                        style={[
                            styles.moodItem,
                            moodAfter === mood.id && styles.moodItemSelected
                        ]}
                    >
                        <Ionicons name={mood.icon} size={24} color={moodAfter === mood.id ? colors.primary.teal : colors.text.muted} />
                        <Text style={[
                            styles.moodItemLabel,
                            moodAfter === mood.id && styles.moodItemLabelSelected
                        ]}>
                            {mood.label}
                        </Text>
                    </Pressable>
                ))}
            </View>
        </ScrollView>
    );

    const renderStep4 = () => (
        <ScrollView style={styles.stepContent} showsVerticalScrollIndicator={false}>
            <Text style={styles.stepTitle}>Reflect & Learn</Text>
            <Text style={styles.stepSubtitle}>This is optional but helps with self-awareness.</Text>

            <Text style={styles.inputLabel}>What happened? (optional)</Text>
            <TextInput
                style={styles.textInput}
                placeholder="Describe the situation..."
                placeholderTextColor={colors.text.muted}
                multiline
                numberOfLines={3}
                value={notes}
                onChangeText={setNotes}
            />

            <Text style={styles.inputLabel}>What can you learn from this? (optional)</Text>
            <TextInput
                style={styles.textInput}
                placeholder="What would you do differently next time?"
                placeholderTextColor={colors.text.muted}
                multiline
                numberOfLines={3}
                value={learned}
                onChangeText={setLearned}
            />

            <View style={styles.encouragement}>
                <Ionicons name="heart" size={24} color="#EC4899" />
                <Text style={styles.encouragementText}>
                    Remember: Progress isn't linear. What matters is that you're being honest with yourself and continuing forward.
                </Text>
            </View>
        </ScrollView>
    );

    const renderContent = () => {
        switch (step) {
            case 1: return renderStep1();
            case 2: return renderStep2();
            case 3: return renderStep3();
            case 4: return renderStep4();
            default: return null;
        }
    };

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <View style={styles.overlay}>
                <View style={[styles.modal, { backgroundColor: themeColors.background.primary }]}>
                    {/* Header */}
                    <View style={[styles.header, { borderBottomColor: themeColors.background.secondary }]}>
                        <View style={styles.headerLeft}>
                            {step > 1 ? (
                                <Pressable onPress={handleBack} style={styles.backBtn}>
                                    <Ionicons name="arrow-back" size={24} color={themeColors.text.primary} />
                                </Pressable>
                            ) : (
                                <View style={{ width: 40 }} />
                            )}
                        </View>
                        <View style={styles.progressDots}>
                            {[1, 2, 3, 4].map((s) => (
                                <View
                                    key={s}
                                    style={[
                                        styles.progressDot,
                                        { backgroundColor: themeColors.background.secondary },
                                        s <= step && { backgroundColor: themeColors.primary.teal }
                                    ]}
                                />
                            ))}
                        </View>
                        <Pressable onPress={handleClose} style={styles.closeBtn}>
                            <Ionicons name="close" size={24} color={themeColors.text.muted} />
                        </Pressable>
                    </View>

                    {/* Content */}
                    {renderContent()}

                    {/* Footer */}
                    <View style={styles.footer}>
                        <Pressable
                            onPress={handleNext}
                            style={styles.nextBtn}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <>
                                    <Text style={styles.nextBtnText}>
                                        {step === 4 ? 'Log & Continue' : 'Next'}
                                    </Text>
                                    {step < 4 && <Ionicons name="arrow-forward" size={18} color="#fff" />}
                                </>
                            )}
                        </Pressable>
                        {step === 1 && (
                            <Text style={styles.privacyNote}>
                                This stays private. No one else sees your slips.
                            </Text>
                        )}
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'flex-end',
    },
    modal: {
        backgroundColor: colors.background.primary,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        maxHeight: '90%',
        minHeight: '70%',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.background.secondary,
    },
    headerLeft: {
        width: 40,
    },
    backBtn: {
        padding: spacing.xs,
    },
    closeBtn: {
        padding: spacing.xs,
    },
    progressDots: {
        flexDirection: 'row',
        gap: spacing.xs,
    },
    progressDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: colors.background.secondary,
    },
    progressDotActive: {
        backgroundColor: colors.primary.teal,
    },
    stepContent: {
        flex: 1,
        padding: spacing.lg,
    },
    stepTitle: {
        fontSize: typography.size.xl,
        fontWeight: typography.weight.bold,
        color: colors.text.primary,
        marginBottom: spacing.xs,
    },
    stepSubtitle: {
        fontSize: typography.size.sm,
        color: colors.text.muted,
        marginBottom: spacing.lg,
    },
    addictionsList: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.sm,
    },
    addictionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.md,
        backgroundColor: colors.background.card,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.background.secondary,
    },
    addictionItemSelected: {
        backgroundColor: colors.primary.teal,
        borderColor: colors.primary.teal,
    },
    addictionItemText: {
        fontSize: typography.size.sm,
        color: colors.text.primary,
        fontWeight: '500',
    },
    addictionItemTextSelected: {
        color: '#fff',
    },
    severityList: {
        gap: spacing.sm,
    },
    severityItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.md,
        backgroundColor: colors.background.card,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.background.secondary,
    },
    severityItemSelected: {
        borderColor: colors.primary.teal,
    },
    severityDot: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.md,
    },
    severityDotSelected: {
        backgroundColor: colors.primary.teal,
    },
    severityNumber: {
        fontSize: typography.size.base,
        fontWeight: '700',
        color: '#fff',
    },
    severityInfo: {
        flex: 1,
    },
    severityLabel: {
        fontSize: typography.size.base,
        fontWeight: '600',
        color: colors.text.primary,
    },
    severityLabelSelected: {
        color: colors.primary.teal,
    },
    severityDesc: {
        fontSize: typography.size.sm,
        color: colors.text.muted,
        marginTop: 2,
    },
    triggersList: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.sm,
    },
    triggerItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.md,
        backgroundColor: colors.background.card,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: colors.background.secondary,
    },
    triggerItemSelected: {
        backgroundColor: colors.primary.violet,
        borderColor: colors.primary.violet,
    },
    triggerText: {
        fontSize: typography.size.sm,
        color: colors.text.secondary,
    },
    triggerTextSelected: {
        color: '#fff',
    },
    moodLabel: {
        fontSize: typography.size.sm,
        color: colors.text.muted,
        marginBottom: spacing.sm,
        marginTop: spacing.md,
    },
    moodsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    moodItem: {
        alignItems: 'center',
        padding: spacing.sm,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'transparent',
        minWidth: 60,
    },
    moodItemSelected: {
        backgroundColor: colors.background.card,
        borderColor: colors.primary.teal,
    },
    moodEmoji: {
        fontSize: 24,
        marginBottom: 4,
    },
    moodItemLabel: {
        fontSize: typography.size.xs,
        color: colors.text.muted,
    },
    moodItemLabelSelected: {
        color: colors.primary.teal,
    },
    inputLabel: {
        fontSize: typography.size.sm,
        color: colors.text.secondary,
        marginBottom: spacing.sm,
        marginTop: spacing.md,
    },
    textInput: {
        backgroundColor: colors.background.card,
        borderRadius: 12,
        padding: spacing.md,
        fontSize: typography.size.base,
        color: colors.text.primary,
        minHeight: 80,
        textAlignVertical: 'top',
        borderWidth: 1,
        borderColor: colors.background.secondary,
    },
    encouragement: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: spacing.md,
        backgroundColor: '#EC489915',
        padding: spacing.md,
        borderRadius: 12,
        marginTop: spacing.xl,
    },
    encouragementText: {
        flex: 1,
        fontSize: typography.size.sm,
        color: colors.text.secondary,
        lineHeight: 20,
    },
    footer: {
        padding: spacing.lg,
        paddingBottom: 40,
        borderTopWidth: 1,
        borderTopColor: colors.background.secondary,
    },
    nextBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing.sm,
        backgroundColor: colors.primary.teal,
        paddingVertical: spacing.md,
        borderRadius: 12,
    },
    nextBtnText: {
        fontSize: typography.size.base,
        fontWeight: '700',
        color: '#fff',
    },
    privacyNote: {
        fontSize: typography.size.xs,
        color: colors.text.muted,
        textAlign: 'center',
        marginTop: spacing.sm,
    },
});

export default SlipModal;

// --- End of SlipModal.js ---
