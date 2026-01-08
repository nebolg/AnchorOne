// Author: -GLOBENXCC-
// OS support: Web
// Description: About page with project info and roadmap

import React from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useColors, spacing } from '../../theme';

const ROADMAP_PHASES = [
    {
        phase: 'Phase 1',
        title: 'Foundation',
        status: 'complete',
        items: ['Core recovery tracking', 'Sobriety rings & milestones', 'Mood & craving logs', 'Journal system'],
    },
    {
        phase: 'Phase 2',
        title: 'Community',
        status: 'complete',
        items: ['Anonymous community feed', 'Support reactions', 'Direct messaging', 'Success stories'],
    },
    {
        phase: 'Phase 3',
        title: 'Web Launch',
        status: 'current',
        items: ['GitHub Pages deployment', 'PWA support', 'Donation integration', 'Landing page'],
    },
    {
        phase: 'Phase 4',
        title: 'App Stores',
        status: 'upcoming',
        items: ['Google Play launch', 'Apple App Store launch', 'Push notifications', 'Widget support'],
    },
    {
        phase: 'Phase 5',
        title: 'Growth',
        status: 'upcoming',
        items: ['Premium features (optional)', 'Therapist integration', 'Multi-language support', 'AI insights'],
    },
];

export const AboutScreen = ({ navigation }) => {
    const colors = useColors();

    const handleBack = () => {
        navigation.goBack();
    };

    const handleDonate = () => {
        navigation.navigate('WebDonate');
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'complete': return colors.primary.teal;
            case 'current': return '#F59E0B';
            case 'upcoming': return colors.text.muted;
            default: return colors.text.muted;
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'complete': return 'checkmark-circle';
            case 'current': return 'play-circle';
            case 'upcoming': return 'ellipse-outline';
            default: return 'ellipse-outline';
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
            {/* Header */}
            <SafeAreaView edges={['top']} style={[styles.header, { borderBottomColor: colors.border }]}>
                <Pressable onPress={handleBack} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
                </Pressable>
                <Text style={[styles.headerTitle, { color: colors.text.primary }]}>About AnchorOne</Text>
                <View style={styles.placeholder} />
            </SafeAreaView>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Mission */}
                <View style={styles.section}>
                    <View style={[styles.iconContainer, { backgroundColor: colors.primary.teal + '15' }]}>
                        <Ionicons name="compass" size={40} color={colors.primary.teal} />
                    </View>
                    <Text style={[styles.missionTitle, { color: colors.text.primary }]}>
                        Our Mission
                    </Text>
                    <Text style={[styles.missionText, { color: colors.text.secondary }]}>
                        Recovery tools should be accessible to everyone. AnchorOne is built to be a
                        safe, anonymous companion on your recovery journey - treating every slip as
                        data, not failure.
                    </Text>
                </View>

                {/* Bootstrap Project Notice */}
                <View style={[styles.noticeCard, { backgroundColor: colors.primary.teal + '10', borderColor: colors.primary.teal }]}>
                    <Ionicons name="rocket" size={24} color={colors.primary.teal} />
                    <View style={styles.noticeContent}>
                        <Text style={[styles.noticeTitle, { color: colors.text.primary }]}>
                            Bootstrap Project
                        </Text>
                        <Text style={[styles.noticeText, { color: colors.text.secondary }]}>
                            AnchorOne is an indie project built with care. We're currently raising funds
                            to launch on the App Store and Google Play. Your support helps us reach
                            more people who need it.
                        </Text>
                        <Pressable
                            onPress={handleDonate}
                            style={[styles.supportButton, { backgroundColor: colors.primary.teal }]}
                        >
                            <Ionicons name="heart" size={16} color="#fff" />
                            <Text style={styles.supportButtonText}>Support the Project</Text>
                        </Pressable>
                    </View>
                </View>

                {/* Values */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
                        Our Values
                    </Text>
                    <View style={styles.valuesList}>
                        {[
                            { icon: 'shield-checkmark', text: 'Privacy First - Your data is yours' },
                            { icon: 'heart', text: 'No Judgment - Progress over perfection' },
                            { icon: 'people', text: 'Community Support - You\'re not alone' },
                            { icon: 'bulb', text: 'Data-Driven - Understand your patterns' },
                            { icon: 'accessibility', text: 'Accessible - Free core features always' },
                        ].map((value, index) => (
                            <View key={index} style={styles.valueItem}>
                                <Ionicons name={value.icon} size={22} color={colors.primary.teal} />
                                <Text style={[styles.valueText, { color: colors.text.secondary }]}>
                                    {value.text}
                                </Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Roadmap */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
                        Development Roadmap
                    </Text>
                    <View style={styles.roadmap}>
                        {ROADMAP_PHASES.map((phase, index) => (
                            <View
                                key={index}
                                style={[
                                    styles.roadmapPhase,
                                    { backgroundColor: colors.background.card }
                                ]}
                            >
                                <View style={styles.phaseHeader}>
                                    <Ionicons
                                        name={getStatusIcon(phase.status)}
                                        size={24}
                                        color={getStatusColor(phase.status)}
                                    />
                                    <View style={styles.phaseInfo}>
                                        <Text style={[styles.phaseLabel, { color: getStatusColor(phase.status) }]}>
                                            {phase.phase}
                                        </Text>
                                        <Text style={[styles.phaseTitle, { color: colors.text.primary }]}>
                                            {phase.title}
                                        </Text>
                                    </View>
                                    {phase.status === 'current' && (
                                        <View style={[styles.currentBadge, { backgroundColor: '#F59E0B' }]}>
                                            <Text style={styles.currentBadgeText}>NOW</Text>
                                        </View>
                                    )}
                                </View>
                                <View style={styles.phaseItems}>
                                    {phase.items.map((item, itemIndex) => (
                                        <View key={itemIndex} style={styles.phaseItem}>
                                            <Text style={[styles.phaseItemDot, { color: getStatusColor(phase.status) }]}>•</Text>
                                            <Text
                                                style={[
                                                    styles.phaseItemText,
                                                    {
                                                        color: phase.status === 'complete' ? colors.text.muted : colors.text.secondary,
                                                        textDecorationLine: phase.status === 'complete' ? 'line-through' : 'none',
                                                    }
                                                ]}
                                            >
                                                {item}
                                            </Text>
                                        </View>
                                    ))}
                                </View>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Credits */}
                <View style={[styles.credits, { borderTopColor: colors.border }]}>
                    <Text style={[styles.creditsText, { color: colors.text.muted }]}>
                        Built with ❤️ by the AnchorOne team
                    </Text>
                    <Text style={[styles.creditsVersion, { color: colors.text.muted }]}>
                        Version 1.0.0
                    </Text>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderBottomWidth: 1,
    },
    backButton: {
        padding: spacing.sm,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
    },
    placeholder: {
        width: 40,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: spacing.lg,
        paddingBottom: 60,
        maxWidth: 700,
        alignSelf: 'center',
        width: '100%',
    },
    section: {
        marginBottom: spacing.xl,
        alignItems: 'center',
    },
    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.md,
    },
    missionTitle: {
        fontSize: 24,
        fontWeight: '700',
        marginBottom: spacing.sm,
        textAlign: 'center',
    },
    missionText: {
        fontSize: 15,
        lineHeight: 22,
        textAlign: 'center',
        maxWidth: 500,
    },
    noticeCard: {
        flexDirection: 'row',
        padding: spacing.lg,
        borderRadius: 16,
        borderWidth: 1,
        marginBottom: spacing.xl,
        gap: spacing.md,
    },
    noticeContent: {
        flex: 1,
    },
    noticeTitle: {
        fontSize: 16,
        fontWeight: '700',
        marginBottom: spacing.xs,
    },
    noticeText: {
        fontSize: 14,
        lineHeight: 20,
        marginBottom: spacing.md,
    },
    supportButton: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 10,
        gap: spacing.xs,
    },
    supportButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        marginBottom: spacing.md,
        textAlign: 'center',
    },
    valuesList: {
        gap: spacing.sm,
        width: '100%',
        maxWidth: 400,
    },
    valueItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
    },
    valueText: {
        fontSize: 15,
        flex: 1,
    },
    roadmap: {
        gap: spacing.md,
        width: '100%',
    },
    roadmapPhase: {
        padding: spacing.md,
        borderRadius: 12,
    },
    phaseHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
        marginBottom: spacing.sm,
    },
    phaseInfo: {
        flex: 1,
    },
    phaseLabel: {
        fontSize: 11,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    phaseTitle: {
        fontSize: 16,
        fontWeight: '600',
    },
    currentBadge: {
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 6,
    },
    currentBadgeText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: '700',
    },
    phaseItems: {
        marginLeft: 32,
    },
    phaseItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
    },
    phaseItemDot: {
        fontSize: 14,
    },
    phaseItemText: {
        fontSize: 13,
    },
    credits: {
        paddingTop: spacing.lg,
        borderTopWidth: 1,
        alignItems: 'center',
    },
    creditsText: {
        fontSize: 14,
    },
    creditsVersion: {
        fontSize: 12,
        marginTop: spacing.xs,
    },
});

export default AboutScreen;

// --- End of AboutScreen.js ---
