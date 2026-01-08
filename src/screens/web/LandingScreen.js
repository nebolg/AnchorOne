// Author: -GLOBENXCC-
// OS support: Web
// Description: Landing page for the AnchorOne web version

import React from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable, Image, Linking, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useColors, spacing, typography } from '../../theme';

const FEATURES = [
    {
        icon: 'shield-checkmark',
        title: 'Safe & Anonymous',
        description: 'Your recovery is private. No judgment, no data selling.',
    },
    {
        icon: 'analytics',
        title: 'Track Progress',
        description: 'Visual sobriety rings and milestone celebrations.',
    },
    {
        icon: 'people',
        title: 'Community Support',
        description: 'Connect with others on the same journey.',
    },
    {
        icon: 'bulb',
        title: 'Smart Insights',
        description: 'Understand your triggers and patterns.',
    },
    {
        icon: 'heart',
        title: 'Mood Tracking',
        description: 'Log how you feel and see correlations.',
    },
    {
        icon: 'flash',
        title: 'Crisis Support',
        description: 'Quick access to help when you need it most.',
    },
];

export const LandingScreen = ({ navigation }) => {
    const colors = useColors();

    const handleTryDemo = () => {
        navigation.navigate('Onboarding');
    };

    const handleDonate = () => {
        navigation.navigate('WebDonate');
    };

    const handlePrivacy = () => {
        navigation.navigate('WebPrivacy');
    };

    const handleAbout = () => {
        navigation.navigate('WebAbout');
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Hero Section */}
                <View style={[styles.hero, { backgroundColor: colors.primary.teal + '10' }]}>
                    <Image
                        source={require('../../../assets/logo.png')}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                    <Text style={[styles.heroTitle, { color: colors.text.primary }]}>
                        AnchorOne
                    </Text>
                    <Text style={[styles.heroSubtitle, { color: colors.text.secondary }]}>
                        Your Safe, Anonymous Recovery Companion
                    </Text>
                    <Text style={[styles.heroDescription, { color: colors.text.muted }]}>
                        A multi-addiction recovery app that treats every slip as data, not failure.
                        Track progress, connect with community, and build lasting change.
                    </Text>
                    <View style={styles.heroButtons}>
                        <Pressable
                            onPress={handleTryDemo}
                            style={[styles.primaryButton, { backgroundColor: colors.primary.teal }]}
                        >
                            <Ionicons name="rocket" size={20} color="#fff" />
                            <Text style={styles.primaryButtonText}>Try Web Demo</Text>
                        </Pressable>
                        <Pressable
                            onPress={handleDonate}
                            style={[styles.secondaryButton, { borderColor: colors.primary.teal }]}
                        >
                            <Ionicons name="heart" size={20} color={colors.primary.teal} />
                            <Text style={[styles.secondaryButtonText, { color: colors.primary.teal }]}>
                                Support This App
                            </Text>
                        </Pressable>
                    </View>
                </View>

                {/* Features Section */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
                        Features
                    </Text>
                    <View style={styles.featuresGrid}>
                        {FEATURES.map((feature, index) => (
                            <View
                                key={index}
                                style={[styles.featureCard, { backgroundColor: colors.background.card }]}
                            >
                                <View style={[styles.featureIcon, { backgroundColor: colors.primary.teal + '15' }]}>
                                    <Ionicons name={feature.icon} size={24} color={colors.primary.teal} />
                                </View>
                                <Text style={[styles.featureTitle, { color: colors.text.primary }]}>
                                    {feature.title}
                                </Text>
                                <Text style={[styles.featureDescription, { color: colors.text.muted }]}>
                                    {feature.description}
                                </Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Why Section */}
                <View style={[styles.section, { backgroundColor: colors.background.card }]}>
                    <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
                        Why AnchorOne?
                    </Text>
                    <View style={styles.whyList}>
                        <View style={styles.whyItem}>
                            <Ionicons name="checkmark-circle" size={20} color={colors.primary.teal} />
                            <Text style={[styles.whyText, { color: colors.text.secondary }]}>
                                No judgment - treat relapse as data, not failure
                            </Text>
                        </View>
                        <View style={styles.whyItem}>
                            <Ionicons name="checkmark-circle" size={20} color={colors.primary.teal} />
                            <Text style={[styles.whyText, { color: colors.text.secondary }]}>
                                Multi-addiction support - track multiple journeys
                            </Text>
                        </View>
                        <View style={styles.whyItem}>
                            <Ionicons name="checkmark-circle" size={20} color={colors.primary.teal} />
                            <Text style={[styles.whyText, { color: colors.text.secondary }]}>
                                Community-driven with anonymous sharing
                            </Text>
                        </View>
                        <View style={styles.whyItem}>
                            <Ionicons name="checkmark-circle" size={20} color={colors.primary.teal} />
                            <Text style={[styles.whyText, { color: colors.text.secondary }]}>
                                Non-medical, non-diagnostic approach
                            </Text>
                        </View>
                    </View>
                </View>

                {/* CTA Section */}
                <View style={styles.section}>
                    <View style={[styles.ctaCard, { backgroundColor: colors.primary.teal + '10', borderColor: colors.primary.teal }]}>
                        <Text style={[styles.ctaTitle, { color: colors.text.primary }]}>
                            Help Us Launch on App Stores
                        </Text>
                        <Text style={[styles.ctaDescription, { color: colors.text.secondary }]}>
                            AnchorOne is an indie project built with care. Your support helps us publish
                            on Google Play and the App Store, reaching more people who need it.
                        </Text>
                        <Pressable
                            onPress={handleDonate}
                            style={[styles.primaryButton, { backgroundColor: colors.primary.teal }]}
                        >
                            <Ionicons name="cafe" size={20} color="#fff" />
                            <Text style={styles.primaryButtonText}>Support the Project</Text>
                        </Pressable>
                    </View>
                </View>

                {/* Footer */}
                <View style={[styles.footer, { borderTopColor: colors.border }]}>
                    <View style={styles.footerLinks}>
                        <Pressable onPress={handlePrivacy}>
                            <Text style={[styles.footerLink, { color: colors.text.muted }]}>Privacy Policy</Text>
                        </Pressable>
                        <Text style={[styles.footerDivider, { color: colors.text.muted }]}>•</Text>
                        <Pressable onPress={handleAbout}>
                            <Text style={[styles.footerLink, { color: colors.text.muted }]}>About</Text>
                        </Pressable>
                        <Text style={[styles.footerDivider, { color: colors.text.muted }]}>•</Text>
                        <Pressable onPress={handleDonate}>
                            <Text style={[styles.footerLink, { color: colors.text.muted }]}>Donate</Text>
                        </Pressable>
                    </View>
                    <Text style={[styles.footerCopyright, { color: colors.text.muted }]}>
                        © 2026 AnchorOne. Built with ❤️ for recovery.
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
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 40,
    },
    hero: {
        padding: spacing.xl,
        alignItems: 'center',
        paddingTop: 60,
        paddingBottom: 40,
    },
    logo: {
        width: 100,
        height: 100,
        borderRadius: 20,
        marginBottom: spacing.md,
    },
    heroTitle: {
        fontSize: 36,
        fontWeight: '800',
        marginBottom: spacing.xs,
        textAlign: 'center',
    },
    heroSubtitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: spacing.md,
        textAlign: 'center',
    },
    heroDescription: {
        fontSize: 15,
        lineHeight: 22,
        textAlign: 'center',
        maxWidth: 500,
        marginBottom: spacing.lg,
    },
    heroButtons: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: spacing.md,
    },
    primaryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingVertical: 14,
        borderRadius: 12,
        gap: spacing.sm,
    },
    primaryButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    secondaryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingVertical: 14,
        borderRadius: 12,
        borderWidth: 2,
        gap: spacing.sm,
    },
    secondaryButtonText: {
        fontSize: 16,
        fontWeight: '600',
    },
    section: {
        padding: spacing.lg,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: '700',
        marginBottom: spacing.lg,
        textAlign: 'center',
    },
    featuresGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: spacing.md,
    },
    featureCard: {
        width: 160,
        padding: spacing.md,
        borderRadius: 16,
        alignItems: 'center',
    },
    featureIcon: {
        width: 48,
        height: 48,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.sm,
    },
    featureTitle: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: spacing.xs,
        textAlign: 'center',
    },
    featureDescription: {
        fontSize: 12,
        textAlign: 'center',
        lineHeight: 16,
    },
    whyList: {
        maxWidth: 500,
        alignSelf: 'center',
        gap: spacing.sm,
    },
    whyItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
    },
    whyText: {
        fontSize: 15,
        flex: 1,
    },
    ctaCard: {
        padding: spacing.lg,
        borderRadius: 20,
        borderWidth: 1,
        alignItems: 'center',
        maxWidth: 500,
        alignSelf: 'center',
    },
    ctaTitle: {
        fontSize: 20,
        fontWeight: '700',
        marginBottom: spacing.sm,
        textAlign: 'center',
    },
    ctaDescription: {
        fontSize: 14,
        lineHeight: 20,
        textAlign: 'center',
        marginBottom: spacing.lg,
    },
    footer: {
        padding: spacing.lg,
        borderTopWidth: 1,
        alignItems: 'center',
        marginTop: spacing.lg,
    },
    footerLinks: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.sm,
    },
    footerLink: {
        fontSize: 14,
        paddingHorizontal: spacing.sm,
    },
    footerDivider: {
        fontSize: 14,
    },
    footerCopyright: {
        fontSize: 12,
    },
});

export default LandingScreen;

// --- End of LandingScreen.js ---
