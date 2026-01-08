// Author: -GLOBENXCC-
// OS support: iOS, Android, Web
// Description: Addiction multi-select screen with predefined options and custom input

import React, { useState } from 'react';
import { StyleSheet, Text, View, Pressable, TextInput, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, Button } from '../../components/common';
import { colors, spacing, typography } from '../../theme';
import { useUserStore } from '../../store';
import { IconRenderer } from '../../components/common/IconRenderer';

export const AddictionSelectScreen = ({ navigation }) => {
    const {
        userAddictions,
        toggleUserAddiction,
        addCustomAddiction,
        availableAddictions,
        hasCompletedOnboarding
    } = useUserStore();
    const [customInput, setCustomInput] = useState('');
    const [showCustom, setShowCustom] = useState(false);

    const selectedIds = userAddictions.map(ua => ua.addictionId);

    const handleAddCustom = () => {
        if (customInput.trim()) {
            const id = addCustomAddiction(customInput.trim());
            toggleUserAddiction(id);
            setCustomInput('');
            setShowCustom(false);
        }
    };

    const handleContinue = () => {
        if (hasCompletedOnboarding) {
            navigation.navigate('StartDate');
        } else {
            navigation.navigate('Privacy');
        }
    };

    const canContinue = userAddictions.length > 0;

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <Text style={styles.title}>What are you recovering from?</Text>
                <Text style={styles.subtitle}>
                    Select all that apply. You can always change this later.
                </Text>

                <View style={styles.grid}>
                    {availableAddictions.map((addiction) => {
                        const isSelected = selectedIds.includes(addiction.id);
                        return (
                            <Pressable
                                key={addiction.id}
                                onPress={() => toggleUserAddiction(addiction.id)}
                                style={({ pressed }) => [
                                    styles.addictionItem,
                                    isSelected && styles.addictionItemSelected,
                                    pressed && styles.addictionItemPressed,
                                ]}
                            >
                                <IconRenderer
                                    library={addiction.library || 'MaterialCommunityIcons'}
                                    name={addiction.icon}
                                    size={36}
                                    color={isSelected ? colors.primary.teal : colors.text.muted}
                                    style={styles.addictionIcon}
                                />
                                <Text style={[
                                    styles.addictionName,
                                    isSelected && styles.addictionNameSelected,
                                ]}>
                                    {addiction.name}
                                </Text>
                                {isSelected && (
                                    <View style={styles.checkmark}>
                                        <Text style={styles.checkmarkText}>✓</Text>
                                    </View>
                                )}
                            </Pressable>
                        );
                    })}
                </View>

                {showCustom ? (
                    <Card style={styles.customInputCard}>
                        <TextInput
                            style={styles.customInput}
                            placeholder="Enter your addiction..."
                            placeholderTextColor={colors.text.muted}
                            value={customInput}
                            onChangeText={setCustomInput}
                            autoFocus
                        />
                        <View style={styles.customInputActions}>
                            <Pressable onPress={() => setShowCustom(false)}>
                                <Text style={styles.cancelText}>Cancel</Text>
                            </Pressable>
                            <Button
                                title="Add"
                                size="small"
                                onPress={handleAddCustom}
                                disabled={!customInput.trim()}
                            />
                        </View>
                    </Card>
                ) : (
                    <Pressable
                        style={styles.addCustomButton}
                        onPress={() => setShowCustom(true)}
                    >
                        <Text style={styles.addCustomText}>+ Add something else</Text>
                    </Pressable>
                )}
            </ScrollView>

            <View style={styles.footer}>
                <Button
                    title={`Continue${userAddictions.length > 0 ? ` (${userAddictions.length})` : ''}`}
                    size="large"
                    onPress={handleContinue}
                    disabled={!canContinue}
                />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background.primary,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: spacing.screenPadding,
        paddingBottom: 100,
    },
    title: {
        fontSize: typography.size['2xl'],
        fontWeight: typography.weight.bold,
        color: colors.text.primary,
        marginBottom: spacing.sm,
    },
    subtitle: {
        fontSize: typography.size.base,
        color: colors.text.secondary,
        marginBottom: spacing.xl,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    addictionItem: {
        width: '48%',
        backgroundColor: colors.background.card,
        borderRadius: spacing.radius.lg,
        padding: spacing.md,
        marginBottom: spacing.sm,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'transparent',
    },
    addictionItemSelected: {
        borderColor: colors.primary.teal,
        backgroundColor: colors.primary.teal + '10',
    },
    addictionItemPressed: {
        opacity: 0.8,
    },
    addictionIcon: {
        fontSize: 36,
        marginBottom: spacing.sm,
    },
    addictionName: {
        fontSize: typography.size.sm,
        fontWeight: typography.weight.medium,
        color: colors.text.primary,
        textAlign: 'center',
    },
    addictionNameSelected: {
        color: colors.primary.teal,
    },
    checkmark: {
        position: 'absolute',
        top: spacing.sm,
        right: spacing.sm,
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: colors.primary.teal,
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkmarkText: {
        color: colors.text.inverse,
        fontSize: 14,
        fontWeight: typography.weight.bold,
    },
    addCustomButton: {
        paddingVertical: spacing.lg,
        alignItems: 'center',
    },
    addCustomText: {
        fontSize: typography.size.base,
        color: colors.primary.teal,
        fontWeight: typography.weight.medium,
    },
    customInputCard: {
        marginTop: spacing.md,
        padding: spacing.md,
    },
    customInput: {
        fontSize: typography.size.base,
        color: colors.text.primary,
        paddingVertical: spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: colors.background.secondary,
    },
    customInputActions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginTop: spacing.md,
        gap: spacing.md,
    },
    cancelText: {
        fontSize: typography.size.sm,
        color: colors.text.muted,
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: spacing.screenPadding,
        backgroundColor: colors.background.primary,
        borderTopWidth: 1,
        borderTopColor: colors.background.secondary,
    },
});

export default AddictionSelectScreen;

// --- End of AddictionSelectScreen.js ---
