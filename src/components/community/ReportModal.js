// Author: -GLOBENXCC-
// OS support: iOS, Android, Web
// Description: Report modal for community content moderation

import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, Pressable, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColors, spacing, typography } from '../../theme';
import { api } from '../../services/api';

const REPORT_REASONS = [
    { id: 'harmful', label: 'Harmful or Dangerous', icon: 'warning', description: 'Content that promotes self-harm or is dangerous' },
    { id: 'spam', label: 'Spam', icon: 'mail-unread', description: 'Repetitive or irrelevant content' },
    { id: 'harassment', label: 'Harassment', icon: 'person-remove', description: 'Targeting or bullying another user' },
    { id: 'misinformation', label: 'Misinformation', icon: 'alert-circle', description: 'False or misleading information' },
    { id: 'inappropriate', label: 'Inappropriate', icon: 'eye-off', description: 'Content not suitable for recovery community' },
    { id: 'other', label: 'Other', icon: 'ellipsis-horizontal', description: 'Another reason not listed' },
];

export const ReportModal = ({ visible, onClose, contentId, contentType = 'post' }) => {
    const colors = useColors();
    const [selectedReason, setSelectedReason] = useState(null);
    const [additionalNotes, setAdditionalNotes] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = async () => {
        if (!selectedReason) {
            Alert.alert('Select a reason', 'Please select a reason for your report.');
            return;
        }

        setIsSubmitting(true);
        try {
            await api.submitReport({
                contentId,
                contentType,
                reason: selectedReason,
                notes: additionalNotes,
            });
            setIsSubmitted(true);
        } catch (error) {
            console.log('Report submission error:', error);
            setIsSubmitted(true);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        setSelectedReason(null);
        setAdditionalNotes('');
        setIsSubmitted(false);
        onClose();
    };

    if (isSubmitted) {
        return (
            <Modal visible={visible} transparent animationType="fade">
                <Pressable style={styles.overlay} onPress={handleClose}>
                    <View style={[styles.container, { backgroundColor: colors.background.card }]}>
                        <View style={styles.successContent}>
                            <View style={[styles.successIcon, { backgroundColor: '#10B98120' }]}>
                                <Ionicons name="checkmark-circle" size={48} color="#10B981" />
                            </View>
                            <Text style={[styles.successTitle, { color: colors.text.primary }]}>
                                Report Submitted
                            </Text>
                            <Text style={[styles.successText, { color: colors.text.secondary }]}>
                                Thank you for helping keep our community safe. We'll review this content soon.
                            </Text>
                            <Pressable
                                onPress={handleClose}
                                style={[styles.doneButton, { backgroundColor: colors.primary.teal }]}
                            >
                                <Text style={styles.doneButtonText}>Done</Text>
                            </Pressable>
                        </View>
                    </View>
                </Pressable>
            </Modal>
        );
    }

    return (
        <Modal visible={visible} transparent animationType="slide">
            <Pressable style={styles.overlay} onPress={handleClose}>
                <Pressable style={[styles.container, { backgroundColor: colors.background.card }]}>
                    <View style={styles.header}>
                        <Text style={[styles.title, { color: colors.text.primary }]}>Report Content</Text>
                        <Pressable onPress={handleClose} style={styles.closeButton}>
                            <Ionicons name="close" size={24} color={colors.text.secondary} />
                        </Pressable>
                    </View>

                    <Text style={[styles.subtitle, { color: colors.text.muted }]}>
                        Why are you reporting this {contentType}?
                    </Text>

                    <View style={styles.reasonsList}>
                        {REPORT_REASONS.map((reason) => (
                            <Pressable
                                key={reason.id}
                                onPress={() => setSelectedReason(reason.id)}
                                style={[
                                    styles.reasonItem,
                                    {
                                        backgroundColor: colors.background.secondary,
                                        borderColor: selectedReason === reason.id
                                            ? colors.primary.teal
                                            : 'transparent',
                                    },
                                ]}
                            >
                                <Ionicons
                                    name={reason.icon}
                                    size={20}
                                    color={selectedReason === reason.id ? colors.primary.teal : colors.text.secondary}
                                />
                                <View style={styles.reasonContent}>
                                    <Text style={[styles.reasonLabel, { color: colors.text.primary }]}>
                                        {reason.label}
                                    </Text>
                                    <Text style={[styles.reasonDesc, { color: colors.text.muted }]}>
                                        {reason.description}
                                    </Text>
                                </View>
                                {selectedReason === reason.id && (
                                    <Ionicons name="checkmark-circle" size={20} color={colors.primary.teal} />
                                )}
                            </Pressable>
                        ))}
                    </View>

                    {selectedReason && (
                        <View style={styles.notesSection}>
                            <Text style={[styles.notesLabel, { color: colors.text.secondary }]}>
                                Additional details (optional)
                            </Text>
                            <TextInput
                                style={[
                                    styles.notesInput,
                                    {
                                        backgroundColor: colors.background.secondary,
                                        color: colors.text.primary,
                                    },
                                ]}
                                placeholder="Tell us more about this issue..."
                                placeholderTextColor={colors.text.muted}
                                value={additionalNotes}
                                onChangeText={setAdditionalNotes}
                                multiline
                                numberOfLines={3}
                            />
                        </View>
                    )}

                    <Pressable
                        onPress={handleSubmit}
                        disabled={!selectedReason || isSubmitting}
                        style={[
                            styles.submitButton,
                            {
                                backgroundColor: selectedReason ? colors.status.error : colors.background.secondary,
                                opacity: isSubmitting ? 0.6 : 1,
                            },
                        ]}
                    >
                        <Text style={[
                            styles.submitButtonText,
                            { color: selectedReason ? '#fff' : colors.text.muted }
                        ]}>
                            {isSubmitting ? 'Submitting...' : 'Submit Report'}
                        </Text>
                    </Pressable>

                    <Text style={[styles.disclaimer, { color: colors.text.muted }]}>
                        False reports may result in your account being restricted.
                    </Text>
                </Pressable>
            </Pressable>
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
        maxHeight: '90%',
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
        fontSize: typography.size.sm,
        marginBottom: spacing.lg,
    },
    reasonsList: {
        gap: spacing.sm,
    },
    reasonItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.md,
        borderRadius: 12,
        borderWidth: 2,
        gap: spacing.md,
    },
    reasonContent: {
        flex: 1,
    },
    reasonLabel: {
        fontSize: typography.size.base,
        fontWeight: '600',
    },
    reasonDesc: {
        fontSize: typography.size.xs,
        marginTop: 2,
    },
    notesSection: {
        marginTop: spacing.lg,
    },
    notesLabel: {
        fontSize: typography.size.sm,
        marginBottom: spacing.sm,
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
        fontSize: typography.size.base,
        fontWeight: '600',
    },
    disclaimer: {
        fontSize: typography.size.xs,
        textAlign: 'center',
        marginTop: spacing.md,
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
        lineHeight: 22,
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

export default ReportModal;

// --- End of ReportModal.js ---
