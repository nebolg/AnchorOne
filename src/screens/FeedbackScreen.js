// Author: -GLOBENXCC-
// OS support: iOS, Android, Web
// Description: Feedback screen for submitting and viewing user feedback

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput, Modal, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../components/common';
import { useColors, spacing, typography } from '../theme';
import { useFeedbackStore, FEEDBACK_TYPES, FEEDBACK_AREAS } from '../store/feedbackStore';
import { format } from 'date-fns';

export const FeedbackScreen = ({ navigation }) => {
    const colors = useColors();
    const {
        submitFeedback,
        getMyFeedback,
        deleteFeedback,
        isSubmitting,
        getStats,
    } = useFeedbackStore();

    const [showSubmitModal, setShowSubmitModal] = useState(false);
    const [selectedType, setSelectedType] = useState(null);
    const [selectedArea, setSelectedArea] = useState(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [activeTab, setActiveTab] = useState('submit'); // 'submit' | 'history'

    const myFeedback = getMyFeedback();
    const stats = getStats();

    const handleSubmit = async () => {
        if (!selectedType || !title.trim() || !description.trim()) {
            Alert.alert('Missing Information', 'Please fill in all required fields.');
            return;
        }

        try {
            await submitFeedback({
                type: selectedType,
                area: selectedArea || 'general',
                title: title.trim(),
                description: description.trim(),
            });

            Alert.alert(
                'Thank You! 🙏',
                'Your feedback has been submitted. We appreciate you helping us improve AnchorOne!',
                [{
                    text: 'OK', onPress: () => {
                        setShowSubmitModal(false);
                        resetForm();
                    }
                }]
            );
        } catch (error) {
            Alert.alert('Error', 'Failed to submit feedback. Please try again.');
        }
    };

    const resetForm = () => {
        setSelectedType(null);
        setSelectedArea(null);
        setTitle('');
        setDescription('');
    };

    const handleDelete = (id) => {
        Alert.alert(
            'Delete Feedback',
            'Are you sure you want to delete this feedback?',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Delete', style: 'destructive', onPress: () => deleteFeedback(id) },
            ]
        );
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return '#F59E0B';
            case 'reviewed': return '#3B82F6';
            case 'implemented': return '#10B981';
            case 'closed': return colors.text.muted;
            default: return colors.text.muted;
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case 'pending': return 'Pending Review';
            case 'reviewed': return 'Under Review';
            case 'implemented': return 'Implemented';
            case 'closed': return 'Closed';
            default: return 'Unknown';
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
            <SafeAreaView edges={['top']} style={styles.safeArea}>
                <View style={[styles.header, { borderBottomColor: colors.border }]}>
                    <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
                    </Pressable>
                    <Text style={[styles.headerTitle, { color: colors.text.primary }]}>Feedback</Text>
                    <View style={styles.placeholder} />
                </View>

                {/* Tab Switcher */}
                <View style={[styles.tabsContainer, { backgroundColor: colors.background.secondary }]}>
                    <Pressable
                        onPress={() => setActiveTab('submit')}
                        style={[
                            styles.tabButton,
                            activeTab === 'submit' && { backgroundColor: colors.primary.teal }
                        ]}
                    >
                        <Ionicons
                            name="add-circle"
                            size={18}
                            color={activeTab === 'submit' ? '#fff' : colors.text.muted}
                        />
                        <Text style={[
                            styles.tabText,
                            { color: activeTab === 'submit' ? '#fff' : colors.text.muted }
                        ]}>Submit</Text>
                    </Pressable>
                    <Pressable
                        onPress={() => setActiveTab('history')}
                        style={[
                            styles.tabButton,
                            activeTab === 'history' && { backgroundColor: colors.primary.teal }
                        ]}
                    >
                        <Ionicons
                            name="time"
                            size={18}
                            color={activeTab === 'history' ? '#fff' : colors.text.muted}
                        />
                        <Text style={[
                            styles.tabText,
                            { color: activeTab === 'history' ? '#fff' : colors.text.muted }
                        ]}>History ({myFeedback.length})</Text>
                    </Pressable>
                </View>

                <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
                    {activeTab === 'submit' ? (
                        <>
                            {/* Stats */}
                            <View style={styles.statsRow}>
                                <Card style={[styles.statCard, { backgroundColor: colors.background.card }]}>
                                    <Text style={[styles.statValue, { color: colors.text.primary }]}>{stats.total}</Text>
                                    <Text style={[styles.statLabel, { color: colors.text.muted }]}>Submitted</Text>
                                </Card>
                                <Card style={[styles.statCard, { backgroundColor: colors.background.card }]}>
                                    <Text style={[styles.statValue, { color: '#F59E0B' }]}>{stats.pending}</Text>
                                    <Text style={[styles.statLabel, { color: colors.text.muted }]}>Pending</Text>
                                </Card>
                                <Card style={[styles.statCard, { backgroundColor: colors.background.card }]}>
                                    <Text style={[styles.statValue, { color: '#10B981' }]}>{stats.implemented}</Text>
                                    <Text style={[styles.statLabel, { color: colors.text.muted }]}>Implemented</Text>
                                </Card>
                            </View>

                            {/* Info Card */}
                            <Card style={[styles.infoCard, { backgroundColor: colors.primary.teal + '10', borderColor: colors.primary.teal }]}>
                                <Ionicons name="heart" size={24} color={colors.primary.teal} />
                                <View style={styles.infoContent}>
                                    <Text style={[styles.infoTitle, { color: colors.text.primary }]}>
                                        Help Us Improve
                                    </Text>
                                    <Text style={[styles.infoText, { color: colors.text.secondary }]}>
                                        Your feedback helps us make AnchorOne better for everyone on their recovery journey.
                                    </Text>
                                </View>
                            </Card>

                            {/* Feedback Type Selection */}
                            <Text style={[styles.sectionTitle, { color: colors.text.muted }]}>What would you like to share?</Text>
                            <View style={styles.typesGrid}>
                                {FEEDBACK_TYPES.map(type => (
                                    <Pressable
                                        key={type.id}
                                        onPress={() => {
                                            setSelectedType(type.id);
                                            setShowSubmitModal(true);
                                        }}
                                        style={[
                                            styles.typeCard,
                                            { backgroundColor: colors.background.card, borderColor: type.color + '40' }
                                        ]}
                                    >
                                        <View style={[styles.typeIcon, { backgroundColor: type.color + '20' }]}>
                                            <Ionicons name={type.icon} size={24} color={type.color} />
                                        </View>
                                        <Text style={[styles.typeLabel, { color: colors.text.primary }]}>{type.label}</Text>
                                    </Pressable>
                                ))}
                            </View>
                        </>
                    ) : (
                        <>
                            {/* Feedback History */}
                            {myFeedback.length === 0 ? (
                                <View style={styles.emptyState}>
                                    <Ionicons name="chatbubble-ellipses-outline" size={64} color={colors.text.muted} />
                                    <Text style={[styles.emptyTitle, { color: colors.text.primary }]}>No Feedback Yet</Text>
                                    <Text style={[styles.emptyText, { color: colors.text.muted }]}>
                                        Your submitted feedback will appear here
                                    </Text>
                                </View>
                            ) : (
                                myFeedback.map(feedback => {
                                    const typeInfo = FEEDBACK_TYPES.find(t => t.id === feedback.type);
                                    return (
                                        <Card key={feedback.id} style={[styles.feedbackCard, { borderLeftColor: typeInfo?.color }]}>
                                            <View style={styles.feedbackHeader}>
                                                <View style={[styles.typeTag, { backgroundColor: typeInfo?.color + '20' }]}>
                                                    <Ionicons name={typeInfo?.icon} size={14} color={typeInfo?.color} />
                                                    <Text style={[styles.typeTagText, { color: typeInfo?.color }]}>
                                                        {typeInfo?.label}
                                                    </Text>
                                                </View>
                                                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(feedback.status) + '20' }]}>
                                                    <Text style={[styles.statusText, { color: getStatusColor(feedback.status) }]}>
                                                        {getStatusLabel(feedback.status)}
                                                    </Text>
                                                </View>
                                            </View>
                                            <Text style={[styles.feedbackTitle, { color: colors.text.primary }]}>{feedback.title}</Text>
                                            <Text style={[styles.feedbackDesc, { color: colors.text.secondary }]} numberOfLines={2}>
                                                {feedback.description}
                                            </Text>
                                            <View style={styles.feedbackFooter}>
                                                <Text style={[styles.feedbackDate, { color: colors.text.muted }]}>
                                                    {format(new Date(feedback.createdAt), 'MMM d, yyyy')}
                                                </Text>
                                                <Pressable onPress={() => handleDelete(feedback.id)}>
                                                    <Ionicons name="trash-outline" size={18} color={colors.text.muted} />
                                                </Pressable>
                                            </View>
                                            {feedback.response && (
                                                <View style={[styles.responseBox, { backgroundColor: colors.background.secondary }]}>
                                                    <Text style={[styles.responseLabel, { color: colors.primary.teal }]}>Response:</Text>
                                                    <Text style={[styles.responseText, { color: colors.text.primary }]}>{feedback.response}</Text>
                                                </View>
                                            )}
                                        </Card>
                                    );
                                })
                            )}
                        </>
                    )}

                    <View style={styles.bottomPadding} />
                </ScrollView>
            </SafeAreaView>

            {/* Submit Modal */}
            <Modal visible={showSubmitModal} transparent animationType="slide">
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { backgroundColor: colors.background.card }]}>
                        <View style={styles.modalHeader}>
                            <Text style={[styles.modalTitle, { color: colors.text.primary }]}>
                                {FEEDBACK_TYPES.find(t => t.id === selectedType)?.label}
                            </Text>
                            <Pressable onPress={() => { setShowSubmitModal(false); resetForm(); }}>
                                <Ionicons name="close" size={24} color={colors.text.secondary} />
                            </Pressable>
                        </View>

                        <ScrollView style={styles.modalScroll}>
                            {/* Area Selection */}
                            <Text style={[styles.inputLabel, { color: colors.text.secondary }]}>Area (optional)</Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.areasScroll}>
                                {FEEDBACK_AREAS.map(area => (
                                    <Pressable
                                        key={area.id}
                                        onPress={() => setSelectedArea(area.id)}
                                        style={[
                                            styles.areaChip,
                                            {
                                                backgroundColor: selectedArea === area.id ? colors.primary.teal : colors.background.secondary,
                                            }
                                        ]}
                                    >
                                        <Text style={[
                                            styles.areaChipText,
                                            { color: selectedArea === area.id ? '#fff' : colors.text.secondary }
                                        ]}>
                                            {area.label}
                                        </Text>
                                    </Pressable>
                                ))}
                            </ScrollView>

                            {/* Title */}
                            <Text style={[styles.inputLabel, { color: colors.text.secondary }]}>Title *</Text>
                            <TextInput
                                style={[styles.input, { color: colors.text.primary, backgroundColor: colors.background.secondary }]}
                                value={title}
                                onChangeText={setTitle}
                                placeholder="Brief summary..."
                                placeholderTextColor={colors.text.muted}
                            />

                            {/* Description */}
                            <Text style={[styles.inputLabel, { color: colors.text.secondary }]}>Description *</Text>
                            <TextInput
                                style={[styles.textArea, { color: colors.text.primary, backgroundColor: colors.background.secondary }]}
                                value={description}
                                onChangeText={setDescription}
                                placeholder="Please describe in detail..."
                                placeholderTextColor={colors.text.muted}
                                multiline
                                numberOfLines={5}
                                textAlignVertical="top"
                            />
                        </ScrollView>

                        <Pressable
                            style={[
                                styles.submitButton,
                                { backgroundColor: colors.primary.teal },
                                isSubmitting && { opacity: 0.6 }
                            ]}
                            onPress={handleSubmit}
                            disabled={isSubmitting}
                        >
                            <Text style={styles.submitButtonText}>
                                {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
                            </Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    safeArea: { flex: 1 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.md,
        borderBottomWidth: 1,
    },
    backButton: { padding: spacing.xs },
    headerTitle: { fontSize: typography.size.lg, fontWeight: '700' },
    placeholder: { width: 32 },
    tabsContainer: {
        flexDirection: 'row',
        margin: spacing.md,
        borderRadius: 12,
        padding: 4,
    },
    tabButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: spacing.sm,
        borderRadius: 10,
        gap: 6,
    },
    tabText: {
        fontSize: typography.size.sm,
        fontWeight: '600',
    },
    scrollView: { flex: 1 },
    scrollContent: { padding: spacing.md, paddingBottom: 100 },
    statsRow: {
        flexDirection: 'row',
        gap: spacing.sm,
        marginBottom: spacing.lg,
    },
    statCard: {
        flex: 1,
        padding: spacing.md,
        alignItems: 'center',
    },
    statValue: {
        fontSize: typography.size['2xl'],
        fontWeight: '700',
    },
    statLabel: {
        fontSize: typography.size.xs,
        marginTop: 4,
    },
    infoCard: {
        flexDirection: 'row',
        gap: spacing.md,
        padding: spacing.md,
        borderWidth: 1,
        marginBottom: spacing.lg,
    },
    infoContent: { flex: 1 },
    infoTitle: {
        fontSize: typography.size.base,
        fontWeight: '600',
        marginBottom: 4,
    },
    infoText: {
        fontSize: typography.size.sm,
        lineHeight: 20,
    },
    sectionTitle: {
        fontSize: typography.size.sm,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: spacing.md,
    },
    typesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.sm,
    },
    typeCard: {
        width: '48%',
        padding: spacing.md,
        borderRadius: 16,
        alignItems: 'center',
        borderWidth: 1,
    },
    typeIcon: {
        width: 48,
        height: 48,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.sm,
    },
    typeLabel: {
        fontSize: typography.size.sm,
        fontWeight: '600',
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: spacing.xl * 2,
    },
    emptyTitle: {
        fontSize: typography.size.lg,
        fontWeight: '700',
        marginTop: spacing.md,
    },
    emptyText: {
        fontSize: typography.size.sm,
        marginTop: spacing.xs,
    },
    feedbackCard: {
        marginBottom: spacing.md,
        padding: spacing.md,
        borderLeftWidth: 4,
    },
    feedbackHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: spacing.sm,
    },
    typeTag: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        gap: 4,
    },
    typeTagText: {
        fontSize: typography.size.xs,
        fontWeight: '600',
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    statusText: {
        fontSize: typography.size.xs,
        fontWeight: '600',
    },
    feedbackTitle: {
        fontSize: typography.size.base,
        fontWeight: '600',
        marginBottom: 4,
    },
    feedbackDesc: {
        fontSize: typography.size.sm,
        lineHeight: 20,
    },
    feedbackFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: spacing.sm,
    },
    feedbackDate: {
        fontSize: typography.size.xs,
    },
    responseBox: {
        marginTop: spacing.sm,
        padding: spacing.sm,
        borderRadius: 8,
    },
    responseLabel: {
        fontSize: typography.size.xs,
        fontWeight: '600',
        marginBottom: 4,
    },
    responseText: {
        fontSize: typography.size.sm,
    },
    bottomPadding: { height: 40 },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: spacing.lg,
        maxHeight: '85%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.lg,
    },
    modalTitle: {
        fontSize: typography.size.xl,
        fontWeight: '700',
    },
    modalScroll: {
        maxHeight: 400,
    },
    inputLabel: {
        fontSize: typography.size.sm,
        fontWeight: '600',
        marginBottom: spacing.xs,
        marginTop: spacing.md,
    },
    areasScroll: {
        flexGrow: 0,
    },
    areaChip: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        marginRight: spacing.xs,
    },
    areaChipText: {
        fontSize: typography.size.sm,
        fontWeight: '500',
    },
    input: {
        padding: spacing.md,
        borderRadius: 12,
        fontSize: typography.size.base,
    },
    textArea: {
        padding: spacing.md,
        borderRadius: 12,
        fontSize: typography.size.base,
        minHeight: 120,
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
});

export default FeedbackScreen;

// --- End of FeedbackScreen.js ---
