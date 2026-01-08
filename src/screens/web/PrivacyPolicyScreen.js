// Author: -GLOBENXCC-
// OS support: Web
// Description: Privacy Policy page (AdSense-ready)

import React from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useColors, spacing, typography } from '../../theme';

const LAST_UPDATED = 'January 8, 2026';
const CONTACT_EMAIL = 'globencastro2004@gmail.com';

export const PrivacyPolicyScreen = ({ navigation }) => {
    const colors = useColors();

    const handleBack = () => {
        navigation.goBack();
    };

    const Section = ({ title, children }) => (
        <View style={styles.policySection}>
            <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>{title}</Text>
            {children}
        </View>
    );

    const Paragraph = ({ children }) => (
        <Text style={[styles.paragraph, { color: colors.text.secondary }]}>{children}</Text>
    );

    const BulletList = ({ items }) => (
        <View style={styles.bulletList}>
            {items.map((item, index) => (
                <View key={index} style={styles.bulletItem}>
                    <Text style={[styles.bullet, { color: colors.primary.teal }]}>•</Text>
                    <Text style={[styles.bulletText, { color: colors.text.secondary }]}>{item}</Text>
                </View>
            ))}
        </View>
    );

    return (
        <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
            {/* Header */}
            <SafeAreaView edges={['top']} style={[styles.header, { borderBottomColor: colors.border }]}>
                <Pressable onPress={handleBack} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
                </Pressable>
                <Text style={[styles.headerTitle, { color: colors.text.primary }]}>Privacy Policy</Text>
                <View style={styles.placeholder} />
            </SafeAreaView>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <Text style={[styles.lastUpdated, { color: colors.text.muted }]}>
                    Last Updated: {LAST_UPDATED}
                </Text>

                <Section title="Introduction">
                    <Paragraph>
                        AnchorOne ("we", "our", or "us") is committed to protecting your privacy.
                        This Privacy Policy explains how we collect, use, and safeguard your information
                        when you use our web application and mobile apps.
                    </Paragraph>
                    <Paragraph>
                        AnchorOne is designed as a safe, anonymous recovery companion. We understand
                        the sensitive nature of addiction recovery and take your privacy seriously.
                    </Paragraph>
                </Section>

                <Section title="Information We Collect">
                    <Paragraph>We collect the following types of information:</Paragraph>
                    <BulletList items={[
                        'Account Data: Optional username, email (if registered)',
                        'Recovery Data: Sobriety dates, mood logs, journal entries (stored locally or in your account)',
                        'Usage Data: App interactions, features used (anonymized)',
                        'Device Info: Device type, OS version (for compatibility)',
                    ]} />
                </Section>

                <Section title="How We Use Your Information">
                    <Paragraph>Your information is used to:</Paragraph>
                    <BulletList items={[
                        'Provide and improve the AnchorOne service',
                        'Sync your data across devices (if you create an account)',
                        'Generate anonymized insights and statistics',
                        'Send optional motivational notifications',
                        'Respond to support requests',
                    ]} />
                </Section>

                <Section title="Data Storage & Security">
                    <Paragraph>
                        Your recovery data is primarily stored locally on your device. If you create
                        an account, data is encrypted in transit and at rest on our secure servers.
                    </Paragraph>
                    <Paragraph>
                        We use industry-standard security measures to protect your information.
                        However, no method of transmission over the Internet is 100% secure.
                    </Paragraph>
                </Section>

                <Section title="Anonymous Usage">
                    <Paragraph>
                        You can use AnchorOne completely anonymously. No email or personal information
                        is required. Anonymous users' data stays on their device only.
                    </Paragraph>
                </Section>

                <Section title="Third-Party Services">
                    <Paragraph>We may use the following third-party services:</Paragraph>
                    <BulletList items={[
                        'Analytics: To understand how the app is used (anonymized data only)',
                        'Advertising: Google AdSense may be used to display non-intrusive ads',
                        'Payment Processors: Ko-fi, Buy Me a Coffee, PayPal for donations',
                    ]} />
                    <Paragraph>
                        These services have their own privacy policies governing their use of your data.
                    </Paragraph>
                </Section>

                <Section title="Advertising (Google AdSense)">
                    <Paragraph>
                        We may display advertisements through Google AdSense. Google may use cookies
                        to serve ads based on your prior visits to our website or other websites.
                        You can opt out of personalized advertising by visiting Google Ad Settings.
                    </Paragraph>
                    <Paragraph>
                        Ads will never be intrusive or block content. They are optional and help
                        fund the continued development of AnchorOne.
                    </Paragraph>
                </Section>

                <Section title="Your Rights">
                    <Paragraph>You have the right to:</Paragraph>
                    <BulletList items={[
                        'Access your personal data',
                        'Export your data at any time',
                        'Delete your account and all associated data',
                        'Opt out of analytics and personalized ads',
                    ]} />
                </Section>

                <Section title="Children's Privacy">
                    <Paragraph>
                        AnchorOne is not intended for children under 13 years of age. We do not
                        knowingly collect personal information from children under 13.
                    </Paragraph>
                </Section>

                <Section title="Changes to This Policy">
                    <Paragraph>
                        We may update this Privacy Policy from time to time. We will notify you
                        of any changes by posting the new Privacy Policy on this page and updating
                        the "Last Updated" date.
                    </Paragraph>
                </Section>

                <Section title="Contact Us">
                    <Paragraph>
                        If you have any questions about this Privacy Policy, please contact us at:
                    </Paragraph>
                    <Text style={[styles.contactEmail, { color: colors.primary.teal }]}>
                        {CONTACT_EMAIL}
                    </Text>
                </Section>
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
    lastUpdated: {
        fontSize: 13,
        marginBottom: spacing.lg,
        textAlign: 'center',
    },
    policySection: {
        marginBottom: spacing.xl,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: spacing.sm,
    },
    paragraph: {
        fontSize: 14,
        lineHeight: 22,
        marginBottom: spacing.sm,
    },
    bulletList: {
        marginTop: spacing.xs,
        marginBottom: spacing.sm,
    },
    bulletItem: {
        flexDirection: 'row',
        marginBottom: spacing.xs,
    },
    bullet: {
        fontSize: 14,
        marginRight: spacing.sm,
        marginTop: 2,
    },
    bulletText: {
        fontSize: 14,
        lineHeight: 20,
        flex: 1,
    },
    contactEmail: {
        fontSize: 15,
        fontWeight: '600',
        marginTop: spacing.xs,
    },
});

export default PrivacyPolicyScreen;

// --- End of PrivacyPolicyScreen.js ---
