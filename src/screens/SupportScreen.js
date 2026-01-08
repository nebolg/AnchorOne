// Author: -GLOBENXCC-
// OS support: iOS, Android, Web
// Description: Support Resources - Gentle, localized crisis support with privacy-first design

import React, { useState, useMemo } from 'react';
import { StyleSheet, ScrollView, View, Text, Pressable, Linking, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../components/common';
import { useColors, colors, spacing, typography } from '../theme';
import { useUserStore } from '../store';
import {
    getResourcesForCountry,
    getTypeLabel,
    getTypeColor,
    RESOURCE_TYPES,
    INTERNATIONAL_RESOURCES,
    SUPPORTED_COUNTRIES
} from '../data/crisisResources';

const ResourceCard = ({ resource, onAction, themeColors }) => {
    const [showContact, setShowContact] = useState(false);
    const typeColor = getTypeColor(resource.type);

    const handlePress = () => {
        if (resource.contactType === 'url') {
            onAction(resource);
        } else {
            setShowContact(true);
        }
    };

    const handleAction = () => {
        onAction(resource);
    };

    const getActionLabel = () => {
        switch (resource.contactType) {
            case 'phone': return 'Call';
            case 'sms': return resource.actionText || 'Text';
            case 'url': return 'Visit';
            default: return 'Connect';
        }
    };

    return (
        <Pressable
            onPress={handlePress}
            style={({ pressed }) => [
                styles.resourceCard,
                { borderLeftColor: typeColor, backgroundColor: themeColors.background.card },
                pressed && styles.resourceCardPressed
            ]}
        >
            <View style={[styles.resourceIconBox, { backgroundColor: typeColor + '15' }]}>
                <Ionicons name={resource.icon} size={22} color={typeColor} />
            </View>

            <View style={styles.resourceContent}>
                <Text style={[styles.resourceName, { color: themeColors.text.primary }]}>{resource.name}</Text>
                <Text style={[styles.resourceDesc, { color: themeColors.text.muted }]}>{resource.description}</Text>
                <View style={styles.resourceMeta}>
                    <Ionicons name="time-outline" size={12} color={themeColors.text.muted} />
                    <Text style={[styles.resourceAvailability, { color: themeColors.text.muted }]}>{resource.availability}</Text>
                </View>
            </View>

            {showContact && resource.contactType !== 'url' ? (
                <Pressable
                    onPress={handleAction}
                    style={[styles.actionButton, { backgroundColor: typeColor }]}
                >
                    <Text style={styles.actionButtonText}>{getActionLabel()}</Text>
                </Pressable>
            ) : (
                <Ionicons name="chevron-forward" size={18} color={themeColors.text.muted} />
            )}
        </Pressable>
    );
};

export const SupportScreen = ({ navigation }) => {
    const themeColors = useColors();
    const { country: userCountry } = useUserStore();
    const [activeFilter, setActiveFilter] = useState('all');

    const countryCode = userCountry || 'OTHER';
    const selectedCountryData = SUPPORTED_COUNTRIES.find(c => c.code === countryCode);

    const { country, resources, hasLocalResources } = useMemo(() => {
        return getResourcesForCountry(countryCode);
    }, [countryCode]);

    const filteredResources = useMemo(() => {
        if (activeFilter === 'all') return resources;
        return resources.filter(r => r.type === activeFilter);
    }, [resources, activeFilter]);

    const handleResourceAction = (resource) => {
        switch (resource.contactType) {
            case 'phone':
                // Remove all non-numeric chars except + for international prefix
                const cleanNumber = resource.contact.replace(/[^\d+]/g, '');
                Linking.openURL(`tel:${cleanNumber}`);
                break;
            case 'sms':
                const cleanSmsNumber = resource.contact.replace(/[^\d+]/g, '');
                Linking.openURL(`sms:${cleanSmsNumber}`);
                break;
            case 'url':
                Linking.openURL(resource.contact);
                break;
        }
    };

    const handleBreathing = () => {
        navigation.navigate('Breathing');
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background.primary }]} edges={['top']}>
            <View style={[styles.header, { borderBottomColor: themeColors.background.secondary }]}>
                <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color={themeColors.text.primary} />
                </Pressable>
                <Text style={[styles.title, { color: themeColors.text.primary }]}>Support Resources</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Gentle Intro */}
                <View style={[styles.introSection, { backgroundColor: themeColors.background.card }]}>
                    <View style={[styles.introIconBox, { backgroundColor: themeColors.primary.teal + '15' }]}>
                        <Ionicons name="boat" size={28} color={themeColors.primary.teal} />
                    </View>
                    <Text style={[styles.introText, { color: themeColors.text.secondary }]}>
                        If things feel heavy or unsafe, you don't have to go through it alone. These resources are free and confidential.
                    </Text>
                </View>

                {/* Location Badge */}
                <View style={[styles.locationBadge, { backgroundColor: themeColors.background.secondary }]}>
                    <Text style={styles.locationFlag}>{selectedCountryData?.flag || '🌍'}</Text>
                    <Text style={[styles.locationText, { color: themeColors.text.muted }]}>
                        Showing resources for {country}
                    </Text>
                </View>

                {/* Filter Pills */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.filterContainer}
                >
                    <Pressable
                        onPress={() => setActiveFilter('all')}
                        style={[styles.filterPill, { backgroundColor: themeColors.background.card, borderColor: themeColors.background.secondary }, activeFilter === 'all' && styles.filterPillActive]}
                    >
                        <Text style={[styles.filterText, { color: themeColors.text.secondary }, activeFilter === 'all' && styles.filterTextActive]}>All</Text>
                    </Pressable>
                    <Pressable
                        onPress={() => setActiveFilter(RESOURCE_TYPES.VOICE)}
                        style={[styles.filterPill, { backgroundColor: themeColors.background.card, borderColor: themeColors.background.secondary }, activeFilter === RESOURCE_TYPES.VOICE && styles.filterPillActive]}
                    >
                        <Ionicons name="call" size={14} color={activeFilter === RESOURCE_TYPES.VOICE ? colors.text.inverse : themeColors.text.secondary} />
                        <Text style={[styles.filterText, { color: themeColors.text.secondary }, activeFilter === RESOURCE_TYPES.VOICE && styles.filterTextActive]}>Voice</Text>
                    </Pressable>
                    <Pressable
                        onPress={() => setActiveFilter(RESOURCE_TYPES.TEXT)}
                        style={[styles.filterPill, { backgroundColor: themeColors.background.card, borderColor: themeColors.background.secondary }, activeFilter === RESOURCE_TYPES.TEXT && styles.filterPillActive]}
                    >
                        <Ionicons name="chatbubble-ellipses" size={14} color={activeFilter === RESOURCE_TYPES.TEXT ? colors.text.inverse : themeColors.text.secondary} />
                        <Text style={[styles.filterText, { color: themeColors.text.secondary }, activeFilter === RESOURCE_TYPES.TEXT && styles.filterTextActive]}>Text</Text>
                    </Pressable>
                    <Pressable
                        onPress={() => setActiveFilter(RESOURCE_TYPES.PEER)}
                        style={[styles.filterPill, { backgroundColor: themeColors.background.card, borderColor: themeColors.background.secondary }, activeFilter === RESOURCE_TYPES.PEER && styles.filterPillActive]}
                    >
                        <Ionicons name="people" size={14} color={activeFilter === RESOURCE_TYPES.PEER ? colors.text.inverse : themeColors.text.secondary} />
                        <Text style={[styles.filterText, { color: themeColors.text.secondary }, activeFilter === RESOURCE_TYPES.PEER && styles.filterTextActive]}>Peer</Text>
                    </Pressable>
                </ScrollView>

                {/* Resources List */}
                <View style={styles.resourcesSection}>
                    {filteredResources.map((resource) => (
                        <ResourceCard
                            key={resource.id}
                            resource={resource}
                            onAction={handleResourceAction}
                            themeColors={themeColors}
                        />
                    ))}
                </View>

                {/* International Fallback Notice */}
                {!hasLocalResources && (
                    <View style={[styles.fallbackNotice, { backgroundColor: themeColors.background.secondary }]}>
                        <Ionicons name="globe-outline" size={16} color={themeColors.text.muted} />
                        <Text style={[styles.fallbackText, { color: themeColors.text.muted }]}>
                            If local resources are limited, these international options may still help.
                        </Text>
                    </View>
                )}

                {/* International Resources Section (Always Visible) */}
                {hasLocalResources && (
                    <View style={styles.internationalSection}>
                        <View style={styles.internationalHeader}>
                            <Ionicons name="globe" size={18} color={themeColors.primary.violet} />
                            <Text style={[styles.internationalTitle, { color: themeColors.text.primary }]}>International Resources</Text>
                        </View>
                        <Text style={[styles.internationalSubtitle, { color: themeColors.text.muted }]}>
                            Global support options available worldwide
                        </Text>
                        <View style={styles.internationalList}>
                            {INTERNATIONAL_RESOURCES.map((resource) => (
                                <ResourceCard
                                    key={resource.id}
                                    resource={resource}
                                    onAction={handleResourceAction}
                                    themeColors={themeColors}
                                />
                            ))}
                        </View>
                    </View>
                )}

                {/* Breathing Exercise Card */}
                <Card style={styles.breatheCard}>
                    <View style={[styles.breatheIconBox, { backgroundColor: themeColors.primary.teal + '15' }]}>
                        <Ionicons name="leaf" size={24} color={themeColors.primary.teal} />
                    </View>
                    <View style={styles.breatheContent}>
                        <Text style={[styles.breatheTitle, { color: themeColors.text.primary }]}>Need to calm down?</Text>
                        <Text style={[styles.breatheDesc, { color: themeColors.text.muted }]}>A simple breathing exercise can help</Text>
                    </View>
                    <Pressable onPress={handleBreathing} style={styles.breatheBtn}>
                        <Text style={styles.breatheBtnText}>Try it</Text>
                    </Pressable>
                </Card>

                {/* Gentle Disclaimer */}
                <View style={styles.disclaimer}>
                    <Text style={[styles.disclaimerText, { color: themeColors.text.muted }]}>
                        AnchorOne does not provide medical or emergency services. These resources are offered for support and connection.
                    </Text>
                </View>

                <View style={{ height: 40 }} />
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background.primary,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: colors.background.secondary,
    },
    backBtn: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: typography.size.lg,
        fontWeight: typography.weight.bold,
        color: colors.text.primary,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: spacing.md,
    },
    introSection: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: colors.primary.teal + '10',
        padding: spacing.md,
        borderRadius: spacing.radius.lg,
        marginBottom: spacing.md,
    },
    introIconBox: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: colors.primary.teal + '20',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.md,
    },
    introText: {
        flex: 1,
        fontSize: typography.size.sm,
        color: colors.text.secondary,
        lineHeight: 22,
    },
    locationBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginBottom: spacing.md,
    },
    locationText: {
        fontSize: 12,
        color: colors.text.muted,
    },
    filterContainer: {
        gap: spacing.xs,
        marginBottom: spacing.lg,
        paddingVertical: 4,
    },
    filterPill: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: spacing.md,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: colors.background.secondary,
    },
    filterPillActive: {
        backgroundColor: colors.primary.teal,
    },
    filterText: {
        fontSize: 13,
        fontWeight: '600',
        color: colors.text.secondary,
    },
    filterTextActive: {
        color: colors.text.inverse,
    },
    resourcesSection: {
        gap: spacing.xs,
        marginBottom: spacing.lg,
    },
    resourceCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.background.card,
        padding: spacing.md,
        borderRadius: spacing.radius.lg,
        borderLeftWidth: 3,
        borderWidth: 1,
        borderColor: colors.background.secondary,
    },
    resourceCardPressed: {
        opacity: 0.8,
    },
    resourceIconBox: {
        width: 44,
        height: 44,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.sm,
    },
    resourceContent: {
        flex: 1,
    },
    resourceName: {
        fontSize: typography.size.sm,
        fontWeight: typography.weight.semibold,
        color: colors.text.primary,
    },
    resourceDesc: {
        fontSize: 12,
        color: colors.text.muted,
        marginTop: 2,
    },
    resourceMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginTop: 6,
    },
    resourceAvailability: {
        fontSize: 11,
        color: colors.text.muted,
    },
    actionButton: {
        paddingHorizontal: spacing.md,
        paddingVertical: 8,
        borderRadius: 16,
    },
    actionButtonText: {
        fontSize: 13,
        fontWeight: '700',
        color: colors.text.inverse,
    },
    fallbackNotice: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        padding: spacing.md,
        backgroundColor: colors.background.secondary,
        borderRadius: spacing.radius.md,
        marginBottom: spacing.lg,
    },
    fallbackText: {
        flex: 1,
        fontSize: 12,
        color: colors.text.muted,
        lineHeight: 18,
    },
    breatheCard: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.lg,
    },
    breatheIconBox: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: colors.primary.teal + '15',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.md,
    },
    breatheContent: {
        flex: 1,
    },
    breatheTitle: {
        fontSize: typography.size.sm,
        fontWeight: typography.weight.semibold,
        color: colors.text.primary,
    },
    breatheDesc: {
        fontSize: 12,
        color: colors.text.muted,
        marginTop: 2,
    },
    breatheBtn: {
        paddingHorizontal: spacing.md,
        paddingVertical: 8,
        backgroundColor: colors.primary.teal + '15',
        borderRadius: 16,
    },
    breatheBtnText: {
        fontSize: 13,
        fontWeight: '600',
        color: colors.primary.teal,
    },
    disclaimer: {
        padding: spacing.md,
    },
    disclaimerText: {
        fontSize: 11,
        color: colors.text.muted,
        textAlign: 'center',
        lineHeight: 16,
    },
    locationFlag: {
        fontSize: 16,
    },
    internationalSection: {
        marginBottom: spacing.lg,
        padding: spacing.md,
        backgroundColor: colors.primary.violet + '08',
        borderRadius: spacing.radius.lg,
        borderWidth: 1,
        borderColor: colors.primary.violet + '20',
    },
    internationalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
        marginBottom: 4,
    },
    internationalTitle: {
        fontSize: typography.size.sm,
        fontWeight: typography.weight.semibold,
        color: colors.primary.violet,
    },
    internationalSubtitle: {
        fontSize: 12,
        color: colors.text.muted,
        marginBottom: spacing.md,
    },
    internationalList: {
        gap: spacing.xs,
    },
});

export default SupportScreen;

// --- End of SupportScreen.js ---
