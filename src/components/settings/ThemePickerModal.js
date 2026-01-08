// Author: -GLOBENXCC-
// OS support: iOS, Android, Web
// Description: Theme color picker modal for selecting accent colors

import React from 'react';
import { View, Text, StyleSheet, Modal, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColors, spacing, typography } from '../../theme';
import { useThemeStore, ACCENT_COLORS } from '../../store/themeStore';

export const ThemePickerModal = ({ visible, onClose }) => {
    const colors = useColors();
    const { accentId, setAccentColor } = useThemeStore();

    const handleSelectColor = async (colorId) => {
        await setAccentColor(colorId);
        onClose();
    };

    return (
        <Modal visible={visible} transparent animationType="fade">
            <Pressable style={styles.overlay} onPress={onClose}>
                <Pressable style={[styles.container, { backgroundColor: colors.background.card }]}>
                    <View style={styles.header}>
                        <Text style={[styles.title, { color: colors.text.primary }]}>Choose Accent Color</Text>
                        <Pressable onPress={onClose} style={styles.closeButton}>
                            <Ionicons name="close" size={24} color={colors.text.secondary} />
                        </Pressable>
                    </View>

                    <Text style={[styles.subtitle, { color: colors.text.muted }]}>
                        Personalize your app with your favorite color
                    </Text>

                    <View style={styles.colorsGrid}>
                        {ACCENT_COLORS.map((accent) => (
                            <Pressable
                                key={accent.id}
                                onPress={() => handleSelectColor(accent.id)}
                                style={[
                                    styles.colorItem,
                                    {
                                        backgroundColor: colors.background.secondary,
                                        borderColor: accentId === accent.id ? accent.color : 'transparent',
                                    },
                                ]}
                            >
                                <View style={[styles.colorSwatch, { backgroundColor: accent.color }]}>
                                    {accentId === accent.id && (
                                        <Ionicons name="checkmark" size={20} color="#fff" />
                                    )}
                                </View>
                                <Text style={[styles.colorName, { color: colors.text.primary }]}>
                                    {accent.name}
                                </Text>
                            </Pressable>
                        ))}
                    </View>

                    <View style={[styles.previewSection, { borderTopColor: colors.border }]}>
                        <Text style={[styles.previewLabel, { color: colors.text.muted }]}>Preview</Text>
                        <View style={styles.previewRow}>
                            <View
                                style={[
                                    styles.previewButton,
                                    { backgroundColor: ACCENT_COLORS.find(a => a.id === accentId)?.color || '#14B8A6' },
                                ]}
                            >
                                <Text style={styles.previewButtonText}>Primary Button</Text>
                            </View>
                            <View
                                style={[
                                    styles.previewBadge,
                                    { backgroundColor: (ACCENT_COLORS.find(a => a.id === accentId)?.color || '#14B8A6') + '20' },
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.previewBadgeText,
                                        { color: ACCENT_COLORS.find(a => a.id === accentId)?.color || '#14B8A6' },
                                    ]}
                                >
                                    Badge
                                </Text>
                            </View>
                        </View>
                    </View>
                </Pressable>
            </Pressable>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing.lg,
    },
    container: {
        width: '100%',
        maxWidth: 400,
        borderRadius: 24,
        padding: spacing.lg,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.xs,
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
    colorsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.sm,
        marginBottom: spacing.lg,
    },
    colorItem: {
        width: '30%',
        alignItems: 'center',
        padding: spacing.md,
        borderRadius: 16,
        borderWidth: 2,
    },
    colorSwatch: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.sm,
    },
    colorName: {
        fontSize: typography.size.sm,
        fontWeight: '500',
        textAlign: 'center',
    },
    previewSection: {
        paddingTop: spacing.lg,
        borderTopWidth: 1,
    },
    previewLabel: {
        fontSize: typography.size.xs,
        textTransform: 'uppercase',
        fontWeight: '600',
        marginBottom: spacing.sm,
    },
    previewRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
    },
    previewButton: {
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.sm,
        borderRadius: 12,
    },
    previewButtonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: typography.size.sm,
    },
    previewBadge: {
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.xs,
        borderRadius: 8,
    },
    previewBadgeText: {
        fontWeight: '600',
        fontSize: typography.size.sm,
    },
});

export default ThemePickerModal;

// --- End of ThemePickerModal.js ---
