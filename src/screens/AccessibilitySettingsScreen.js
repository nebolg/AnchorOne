// Author: -GLOBENXCC-
// OS support: iOS, Android, Web
// Description: Accessibility settings screen with text size, motion, and contrast controls

import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../components/common';
import { useColors, spacing, typography } from '../theme';
import { useAccessibilityStore, TEXT_SIZES } from '../store/accessibilityStore';

export const AccessibilitySettingsScreen = ({ navigation }) => {
    const colors = useColors();
    const {
        textSize,
        reduceMotion,
        highContrast,
        hapticFeedbackEnabled,
        boldText,
        largerTouchTargets,
        showAnimations,
        setTextSize,
        setReduceMotion,
        setHighContrast,
        setHapticFeedbackEnabled,
        setBoldText,
        setLargerTouchTargets,
        setShowAnimations,
        getTextScale,
    } = useAccessibilityStore();

    const settings = [
        {
            id: 'reduceMotion',
            title: 'Reduce Motion',
            description: 'Minimize animations throughout the app',
            icon: 'flash-off',
            color: '#8B5CF6',
            value: reduceMotion,
            onToggle: setReduceMotion,
        },
        {
            id: 'highContrast',
            title: 'High Contrast',
            description: 'Increase contrast for better visibility',
            icon: 'contrast',
            color: '#3B82F6',
            value: highContrast,
            onToggle: setHighContrast,
        },
        {
            id: 'boldText',
            title: 'Bold Text',
            description: 'Use bolder fonts for improved readability',
            icon: 'text',
            color: '#10B981',
            value: boldText,
            onToggle: setBoldText,
        },
        {
            id: 'largerTouchTargets',
            title: 'Larger Touch Targets',
            description: 'Increase button and tap target sizes',
            icon: 'finger-print',
            color: '#F59E0B',
            value: largerTouchTargets,
            onToggle: setLargerTouchTargets,
        },
        {
            id: 'hapticFeedback',
            title: 'Haptic Feedback',
            description: 'Feel vibrations for button presses',
            icon: 'radio-button-on',
            color: '#EC4899',
            value: hapticFeedbackEnabled,
            onToggle: setHapticFeedbackEnabled,
        },
        {
            id: 'showAnimations',
            title: 'Show Animations',
            description: 'Enable UI animations and transitions',
            icon: 'sparkles',
            color: '#6366F1',
            value: showAnimations,
            onToggle: setShowAnimations,
        },
    ];

    const scale = getTextScale();

    return (
        <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
            <SafeAreaView edges={['top']} style={styles.safeArea}>
                <View style={[styles.header, { borderBottomColor: colors.border }]}>
                    <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
                    </Pressable>
                    <Text style={[styles.headerTitle, { color: colors.text.primary }]}>Accessibility</Text>
                    <View style={styles.placeholder} />
                </View>

                <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
                    {/* Text Size Section */}
                    <Text style={[styles.sectionTitle, { color: colors.text.muted }]}>Text Size</Text>
                    <Card style={styles.textSizeCard}>
                        <Text
                            style={[
                                styles.previewText,
                                {
                                    color: colors.text.primary,
                                    fontSize: Math.round(typography.size.base * scale),
                                },
                            ]}
                        >
                            Preview: This is how text will appear
                        </Text>

                        <View style={styles.textSizeOptions}>
                            {Object.entries(TEXT_SIZES).map(([key, value]) => (
                                <Pressable
                                    key={key}
                                    onPress={() => setTextSize(key)}
                                    style={[
                                        styles.textSizeOption,
                                        {
                                            backgroundColor: textSize === key
                                                ? colors.primary.teal
                                                : colors.background.secondary,
                                        },
                                    ]}
                                >
                                    <Text
                                        style={[
                                            styles.textSizeLabel,
                                            {
                                                color: textSize === key ? '#fff' : colors.text.secondary,
                                                fontSize: 12 * value.scale,
                                            },
                                        ]}
                                    >
                                        {value.label}
                                    </Text>
                                </Pressable>
                            ))}
                        </View>
                    </Card>

                    {/* Settings Toggles */}
                    <Text style={[styles.sectionTitle, { color: colors.text.muted }]}>Display & Motion</Text>
                    {settings.map((setting) => (
                        <View
                            key={setting.id}
                            style={[styles.settingCard, { backgroundColor: colors.background.card }]}
                        >
                            <View style={[styles.settingIcon, { backgroundColor: setting.color + '20' }]}>
                                <Ionicons name={setting.icon} size={20} color={setting.color} />
                            </View>
                            <View style={styles.settingContent}>
                                <Text style={[styles.settingTitle, { color: colors.text.primary }]}>
                                    {setting.title}
                                </Text>
                                <Text style={[styles.settingDesc, { color: colors.text.muted }]}>
                                    {setting.description}
                                </Text>
                            </View>
                            <Switch
                                value={setting.value}
                                onValueChange={setting.onToggle}
                                trackColor={{ false: colors.background.tertiary, true: setting.color }}
                                thumbColor="#fff"
                            />
                        </View>
                    ))}

                    {/* Info Section */}
                    <View style={styles.infoCard}>
                        <Ionicons name="information-circle" size={20} color={colors.text.muted} />
                        <Text style={[styles.infoText, { color: colors.text.muted }]}>
                            These settings help make AnchorOne more comfortable to use. Changes apply
                            immediately throughout the app.
                        </Text>
                    </View>

                    <View style={styles.bottomPadding} />
                </ScrollView>
            </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    safeArea: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.md,
        borderBottomWidth: 1,
    },
    backButton: {
        padding: spacing.xs,
    },
    headerTitle: {
        fontSize: typography.size.lg,
        fontWeight: '700',
    },
    placeholder: {
        width: 32,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: spacing.md,
        paddingBottom: 100,
    },
    sectionTitle: {
        fontSize: typography.size.sm,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: spacing.sm,
        marginLeft: spacing.xs,
        marginTop: spacing.md,
    },
    textSizeCard: {
        marginBottom: spacing.md,
    },
    previewText: {
        textAlign: 'center',
        marginBottom: spacing.lg,
    },
    textSizeOptions: {
        flexDirection: 'row',
        gap: spacing.sm,
    },
    textSizeOption: {
        flex: 1,
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.xs,
        borderRadius: 10,
        alignItems: 'center',
    },
    textSizeLabel: {
        fontWeight: '600',
    },
    settingCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.md,
        borderRadius: 16,
        marginBottom: spacing.sm,
    },
    settingIcon: {
        width: 40,
        height: 40,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.md,
    },
    settingContent: {
        flex: 1,
    },
    settingTitle: {
        fontSize: typography.size.base,
        fontWeight: '500',
    },
    settingDesc: {
        fontSize: typography.size.xs,
        marginTop: 2,
    },
    infoCard: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: spacing.sm,
        marginTop: spacing.lg,
    },
    infoText: {
        flex: 1,
        fontSize: typography.size.sm,
        lineHeight: 20,
    },
    bottomPadding: {
        height: 40,
    },
});

export default AccessibilitySettingsScreen;

// --- End of AccessibilitySettingsScreen.js ---
