// Author: -GLOBENXCC-
// OS support: iOS, Android, Web
// Description: Guided Recovery Programs screen with program cards and day tracking

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../components/common';
import { useColors, spacing, typography } from '../theme';
import { useGuidedProgramsStore } from '../store/guidedProgramsStore';

export const GuidedProgramsScreen = ({ navigation }) => {
    const colors = useColors();
    const {
        programs,
        enrollInProgram,
        unenrollFromProgram,
        isEnrolled,
        getProgramProgress,
        getCurrentDay,
        getDayActivities,
        completeDay,
        isDayCompleted,
    } = useGuidedProgramsStore();

    const [selectedProgram, setSelectedProgram] = useState(null);
    const [selectedDay, setSelectedDay] = useState(null);

    const ProgramCard = ({ program }) => {
        const enrolled = isEnrolled(program.id);
        const progress = getProgramProgress(program.id);
        const currentDay = getCurrentDay(program.id);

        return (
            <Pressable
                onPress={() => setSelectedProgram(program)}
                style={({ pressed }) => [
                    styles.programCard,
                    {
                        backgroundColor: colors.background.card,
                        opacity: pressed ? 0.9 : 1,
                        borderColor: enrolled ? program.color : 'transparent',
                        borderWidth: enrolled ? 2 : 0,
                    },
                ]}
            >
                <View style={[styles.programIcon, { backgroundColor: program.color + '20' }]}>
                    <Ionicons name={program.icon} size={28} color={program.color} />
                </View>

                <View style={styles.programInfo}>
                    <Text style={[styles.programName, { color: colors.text.primary }]}>{program.name}</Text>
                    <Text style={[styles.programDesc, { color: colors.text.muted }]} numberOfLines={2}>
                        {program.description}
                    </Text>
                    <View style={styles.programMeta}>
                        <View style={styles.metaItem}>
                            <Ionicons name="calendar" size={14} color={colors.text.muted} />
                            <Text style={[styles.metaText, { color: colors.text.muted }]}>{program.duration} days</Text>
                        </View>
                        <View style={styles.metaItem}>
                            <Ionicons name="fitness" size={14} color={colors.text.muted} />
                            <Text style={[styles.metaText, { color: colors.text.muted }]}>{program.difficulty}</Text>
                        </View>
                    </View>
                </View>

                {enrolled && (
                    <View style={styles.progressSection}>
                        <Text style={[styles.progressText, { color: program.color }]}>
                            Day {currentDay}/{program.duration}
                        </Text>
                        <View style={[styles.progressBar, { backgroundColor: colors.background.secondary }]}>
                            <View
                                style={[styles.progressFill, { width: `${progress.percentage}%`, backgroundColor: program.color }]}
                            />
                        </View>
                    </View>
                )}
            </Pressable>
        );
    };

    const renderDayModal = () => {
        if (!selectedDay || !selectedProgram) return null;

        const dayData = getDayActivities(selectedProgram.id, selectedDay);
        const completed = isDayCompleted(selectedProgram.id, selectedDay);

        return (
            <Modal visible={!!selectedDay} transparent animationType="slide">
                <View style={styles.modalOverlay}>
                    <View style={[styles.dayModal, { backgroundColor: colors.background.card }]}>
                        <View style={styles.dayModalHeader}>
                            <View>
                                <Text style={[styles.dayNumber, { color: selectedProgram.color }]}>
                                    Day {selectedDay}
                                </Text>
                                <Text style={[styles.dayTitle, { color: colors.text.primary }]}>
                                    {dayData?.title}
                                </Text>
                            </View>
                            <Pressable onPress={() => setSelectedDay(null)}>
                                <Ionicons name="close" size={24} color={colors.text.secondary} />
                            </Pressable>
                        </View>

                        <Text style={[styles.activitiesLabel, { color: colors.text.muted }]}>
                            Today's Activities
                        </Text>

                        {dayData?.activities.map((activity, i) => (
                            <View key={i} style={[styles.activityItem, { backgroundColor: colors.background.secondary }]}>
                                <View style={[styles.activityNumber, { backgroundColor: selectedProgram.color }]}>
                                    <Text style={styles.activityNumberText}>{i + 1}</Text>
                                </View>
                                <Text style={[styles.activityText, { color: colors.text.primary }]}>{activity}</Text>
                            </View>
                        ))}

                        <Pressable
                            onPress={() => {
                                if (!completed) {
                                    completeDay(selectedProgram.id, selectedDay);
                                }
                                setSelectedDay(null);
                            }}
                            style={[
                                styles.completeButton,
                                {
                                    backgroundColor: completed ? colors.background.secondary : selectedProgram.color,
                                },
                            ]}
                        >
                            <Ionicons
                                name={completed ? 'checkmark-circle' : 'checkmark'}
                                size={20}
                                color={completed ? colors.text.muted : '#fff'}
                            />
                            <Text style={[styles.completeButtonText, { color: completed ? colors.text.muted : '#fff' }]}>
                                {completed ? 'Completed' : 'Mark as Complete'}
                            </Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
        );
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
            <SafeAreaView edges={['top']} style={styles.safeArea}>
                <View style={[styles.header, { borderBottomColor: colors.border }]}>
                    <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
                    </Pressable>
                    <Text style={[styles.headerTitle, { color: colors.text.primary }]}>Guided Programs</Text>
                    <View style={styles.placeholder} />
                </View>

                <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
                    <Text style={[styles.introText, { color: colors.text.secondary }]}>
                        Structured programs to guide your recovery journey with daily activities and support.
                    </Text>

                    {programs.map((program) => (
                        <ProgramCard key={program.id} program={program} />
                    ))}

                    <View style={styles.bottomPadding} />
                </ScrollView>
            </SafeAreaView>

            {/* Program Detail Modal */}
            <Modal visible={!!selectedProgram && !selectedDay} animationType="slide">
                {selectedProgram && (
                    <View style={[styles.modalContainer, { backgroundColor: colors.background.primary }]}>
                        <SafeAreaView edges={['top']} style={styles.safeArea}>
                            <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
                                <Pressable onPress={() => setSelectedProgram(null)} style={styles.backButton}>
                                    <Ionicons name="close" size={24} color={colors.text.primary} />
                                </Pressable>
                                <Text style={[styles.headerTitle, { color: colors.text.primary }]}>
                                    {selectedProgram.name}
                                </Text>
                                <Pressable
                                    onPress={() => {
                                        if (isEnrolled(selectedProgram.id)) {
                                            unenrollFromProgram(selectedProgram.id);
                                        } else {
                                            enrollInProgram(selectedProgram.id);
                                        }
                                    }}
                                    style={[
                                        styles.enrollButton,
                                        {
                                            backgroundColor: isEnrolled(selectedProgram.id)
                                                ? colors.background.secondary
                                                : selectedProgram.color,
                                        },
                                    ]}
                                >
                                    <Text
                                        style={[
                                            styles.enrollButtonText,
                                            { color: isEnrolled(selectedProgram.id) ? colors.text.muted : '#fff' },
                                        ]}
                                    >
                                        {isEnrolled(selectedProgram.id) ? 'Leave' : 'Join'}
                                    </Text>
                                </Pressable>
                            </View>

                            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
                                {selectedProgram.modules.map((module) => (
                                    <View key={module.id} style={styles.moduleSection}>
                                        <Text style={[styles.moduleName, { color: colors.text.primary }]}>
                                            {module.name}
                                        </Text>

                                        <View style={styles.daysGrid}>
                                            {module.days.map((day) => {
                                                const completed = isDayCompleted(selectedProgram.id, day.day);
                                                const current = getCurrentDay(selectedProgram.id) === day.day;

                                                return (
                                                    <Pressable
                                                        key={day.day}
                                                        onPress={() => setSelectedDay(day.day)}
                                                        style={[
                                                            styles.dayCard,
                                                            {
                                                                backgroundColor: completed
                                                                    ? selectedProgram.color
                                                                    : current
                                                                        ? selectedProgram.color + '30'
                                                                        : colors.background.card,
                                                                borderColor: current ? selectedProgram.color : 'transparent',
                                                                borderWidth: current ? 2 : 0,
                                                            },
                                                        ]}
                                                    >
                                                        <Text
                                                            style={[
                                                                styles.dayCardNumber,
                                                                { color: completed ? '#fff' : colors.text.primary },
                                                            ]}
                                                        >
                                                            {day.day}
                                                        </Text>
                                                        <Text
                                                            style={[
                                                                styles.dayCardTitle,
                                                                { color: completed ? '#fff' : colors.text.muted },
                                                            ]}
                                                            numberOfLines={2}
                                                        >
                                                            {day.title}
                                                        </Text>
                                                        {completed && (
                                                            <Ionicons name="checkmark-circle" size={16} color="#fff" />
                                                        )}
                                                    </Pressable>
                                                );
                                            })}
                                        </View>
                                    </View>
                                ))}

                                <View style={styles.bottomPadding} />
                            </ScrollView>
                        </SafeAreaView>
                    </View>
                )}
            </Modal>

            {renderDayModal()}
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
    scrollView: { flex: 1 },
    scrollContent: { padding: spacing.md, paddingBottom: 100 },
    introText: { fontSize: typography.size.base, lineHeight: 22, marginBottom: spacing.lg },
    programCard: { padding: spacing.md, borderRadius: 16, marginBottom: spacing.md },
    programIcon: { width: 56, height: 56, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.sm },
    programInfo: { marginBottom: spacing.sm },
    programName: { fontSize: typography.size.lg, fontWeight: '600', marginBottom: 4 },
    programDesc: { fontSize: typography.size.sm, lineHeight: 18 },
    programMeta: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.sm },
    metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    metaText: { fontSize: typography.size.xs },
    progressSection: { marginTop: spacing.sm },
    progressText: { fontSize: typography.size.sm, fontWeight: '600', marginBottom: 4 },
    progressBar: { height: 6, borderRadius: 3, overflow: 'hidden' },
    progressFill: { height: '100%', borderRadius: 3 },
    bottomPadding: { height: 40 },
    modalContainer: { flex: 1 },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.md,
        borderBottomWidth: 1,
    },
    enrollButton: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: 20 },
    enrollButtonText: { fontSize: typography.size.sm, fontWeight: '600' },
    moduleSection: { marginBottom: spacing.xl },
    moduleName: { fontSize: typography.size.base, fontWeight: '600', marginBottom: spacing.md },
    daysGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
    dayCard: { width: '30%', padding: spacing.sm, borderRadius: 12, alignItems: 'center' },
    dayCardNumber: { fontSize: typography.size.lg, fontWeight: '700' },
    dayCardTitle: { fontSize: 10, textAlign: 'center', marginTop: 4 },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
    dayModal: { borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: spacing.lg, maxHeight: '80%' },
    dayModalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: spacing.lg },
    dayNumber: { fontSize: typography.size.sm, fontWeight: '600' },
    dayTitle: { fontSize: typography.size.xl, fontWeight: '700' },
    activitiesLabel: { fontSize: typography.size.sm, fontWeight: '600', marginBottom: spacing.sm, textTransform: 'uppercase' },
    activityItem: { flexDirection: 'row', alignItems: 'center', padding: spacing.md, borderRadius: 12, marginBottom: spacing.sm, gap: spacing.md },
    activityNumber: { width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
    activityNumberText: { color: '#fff', fontWeight: '600', fontSize: 12 },
    activityText: { flex: 1, fontSize: typography.size.base },
    completeButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: spacing.md, borderRadius: 12, marginTop: spacing.lg, gap: spacing.sm },
    completeButtonText: { fontSize: typography.size.base, fontWeight: '600' },
});

export default GuidedProgramsScreen;

// --- End of GuidedProgramsScreen.js ---
