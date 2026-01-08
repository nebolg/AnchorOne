// Author: -GLOBENXCC-
// OS support: Web
// Description: Donation page with ethical, non-pushy donation options

import React from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useColors, spacing, typography } from '../../theme';

const DONATION_OPTIONS = [
    {
        name: 'Ko-fi',
        icon: 'cafe',
        description: 'Buy us a coffee - one-time or monthly support',
        color: '#FF5E5B',
        url: 'https://ko-fi.com/globencabildo',
    },
    {
        name: 'PayPal',
        icon: 'card',
        description: 'Direct donation via PayPal',
        color: '#003087',
        url: 'https://paypal.me/GlobenXanderCabildo',
    },
];

const ROADMAP = [
    { done: true, text: 'Core app development' },
    { done: true, text: 'Community features' },
    { done: true, text: 'Web demo version' },
    { done: false, text: 'Google Play Store launch' },
    { done: false, text: 'Apple App Store launch' },
    { done: false, text: 'Premium features (optional)' },
];

export const DonateScreen = ({ navigation }) => {
    const colors = useColors();

    const handleDonate = (url) => {
        Linking.openURL(url);
    };

    const handleBack = () => {
        navigation.goBack();
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
            {/* Header */}
            <SafeAreaView edges={['top']} style={[styles.header, { borderBottomColor: colors.border }]}>
                <Pressable onPress={handleBack} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
                </Pressable>
                <Text style={[styles.headerTitle, { color: colors.text.primary }]}>Support AnchorOne</Text>
                <View style={styles.placeholder} />
            </SafeAreaView>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Introduction */}
                <View style={styles.intro}>
                    <View style={[styles.iconContainer, { backgroundColor: colors.primary.teal + '15' }]}>
                        <Ionicons name="heart" size={40} color={colors.primary.teal} />
                    </View>
                    <Text style={[styles.introTitle, { color: colors.text.primary }]}>
                        Help Us Reach More People
                    </Text>
                    <Text style={[styles.introText, { color: colors.text.secondary }]}>
                        AnchorOne is built by a small indie team who believes recovery tools should be
                        accessible to everyone. Your support directly funds our journey to the app stores.
                    </Text>
                </View>

                {/* What Your Support Does */}
                <View style={[styles.section, { backgroundColor: colors.background.card }]}>
                    <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
                        What Your Support Does
                    </Text>
                    <View style={styles.impactList}>
                        <View style={styles.impactItem}>
                            <Ionicons name="logo-google-playstore" size={20} color={colors.primary.teal} />
                            <Text style={[styles.impactText, { color: colors.text.secondary }]}>
                                Google Play developer fee ($25 one-time)
                            </Text>
                        </View>
                        <View style={styles.impactItem}>
                            <Ionicons name="logo-apple" size={20} color={colors.primary.teal} />
                            <Text style={[styles.impactText, { color: colors.text.secondary }]}>
                                Apple Developer Program ($99/year)
                            </Text>
                        </View>
                        <View style={styles.impactItem}>
                            <Ionicons name="server" size={20} color={colors.primary.teal} />
                            <Text style={[styles.impactText, { color: colors.text.secondary }]}>
                                Server costs for community features
                            </Text>
                        </View>
                        <View style={styles.impactItem}>
                            <Ionicons name="code-slash" size={20} color={colors.primary.teal} />
                            <Text style={[styles.impactText, { color: colors.text.secondary }]}>
                                Continued development & improvements
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Donation Options */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
                        Ways to Support
                    </Text>
                    <View style={styles.donationGrid}>
                        {DONATION_OPTIONS.map((option, index) => (
                            <Pressable
                                key={index}
                                onPress={() => handleDonate(option.url)}
                                style={[styles.donationCard, { backgroundColor: option.color }]}
                            >
                                <Ionicons
                                    name={option.icon}
                                    size={28}
                                    color={option.textColor || '#fff'}
                                />
                                <Text style={[styles.donationName, { color: option.textColor || '#fff' }]}>
                                    {option.name}
                                </Text>
                                <Text style={[styles.donationDescription, { color: (option.textColor || '#fff') + 'CC' }]}>
                                    {option.description}
                                </Text>
                                <View style={[styles.donationArrow, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                                    <Ionicons
                                        name="open-outline"
                                        size={16}
                                        color={option.textColor || '#fff'}
                                    />
                                </View>
                            </Pressable>
                        ))}
                    </View>
                </View>

                {/* Roadmap */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
                        Our Roadmap
                    </Text>
                    <View style={[styles.roadmapCard, { backgroundColor: colors.background.card }]}>
                        {ROADMAP.map((item, index) => (
                            <View key={index} style={styles.roadmapItem}>
                                <Ionicons
                                    name={item.done ? 'checkmark-circle' : 'ellipse-outline'}
                                    size={20}
                                    color={item.done ? colors.primary.teal : colors.text.muted}
                                />
                                <Text
                                    style={[
                                        styles.roadmapText,
                                        {
                                            color: item.done ? colors.text.secondary : colors.text.muted,
                                            textDecorationLine: item.done ? 'line-through' : 'none',
                                        }
                                    ]}
                                >
                                    {item.text}
                                </Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* No Pressure Note */}
                <View style={[styles.noteCard, { borderColor: colors.primary.teal + '40' }]}>
                    <Ionicons name="information-circle" size={20} color={colors.primary.teal} />
                    <Text style={[styles.noteText, { color: colors.text.secondary }]}>
                        There's no pressure to donate. AnchorOne will always have a free version.
                        Your recovery matters more than any contribution.
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
    },
    intro: {
        alignItems: 'center',
        marginBottom: spacing.xl,
    },
    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.md,
    },
    introTitle: {
        fontSize: 24,
        fontWeight: '700',
        marginBottom: spacing.sm,
        textAlign: 'center',
    },
    introText: {
        fontSize: 15,
        lineHeight: 22,
        textAlign: 'center',
        maxWidth: 400,
    },
    section: {
        marginBottom: spacing.xl,
        padding: spacing.lg,
        borderRadius: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: spacing.md,
    },
    impactList: {
        gap: spacing.sm,
    },
    impactItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
    },
    impactText: {
        fontSize: 14,
        flex: 1,
    },
    donationGrid: {
        gap: spacing.md,
    },
    donationCard: {
        padding: spacing.lg,
        borderRadius: 16,
        position: 'relative',
    },
    donationName: {
        fontSize: 18,
        fontWeight: '700',
        marginTop: spacing.sm,
    },
    donationDescription: {
        fontSize: 13,
        marginTop: spacing.xs,
    },
    donationArrow: {
        position: 'absolute',
        right: spacing.md,
        top: spacing.md,
        width: 28,
        height: 28,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    roadmapCard: {
        padding: spacing.md,
        borderRadius: 12,
        gap: spacing.sm,
    },
    roadmapItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
    },
    roadmapText: {
        fontSize: 14,
    },
    noteCard: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        padding: spacing.md,
        borderRadius: 12,
        borderWidth: 1,
        gap: spacing.sm,
    },
    noteText: {
        fontSize: 13,
        lineHeight: 18,
        flex: 1,
    },
});

export default DonateScreen;

// --- End of DonateScreen.js ---
