// Author: -GLOBENXCC-
// OS support: iOS, Android, Web
// Description: Animated money saved display card for home dashboard

import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Animated, Modal, TextInput, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColors, spacing, typography } from '../../theme';
import { useUserStore } from '../../store';
import { useMoneySavedStore } from '../../store/moneySavedStore';
import { IconRenderer } from '../common/IconRenderer';

export const MoneySavedCard = () => {
    const colors = useColors();
    const { userAddictions } = useUserStore();
    const { calculateSavings, calculateTotalSavings, formatCurrency, costs, setCost, currencySymbol } = useMoneySavedStore();

    const [showSettings, setShowSettings] = useState(false);
    const [editingCosts, setEditingCosts] = useState({});
    const [selectedView, setSelectedView] = useState('all'); // 'all' or addiction.id
    const animatedValue = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(1)).current;

    const totalSavings = calculateTotalSavings(userAddictions);

    // Calculate per-addiction savings
    const addictionSavings = userAddictions.map(addiction => ({
        ...addiction,
        savings: calculateSavings(addiction.addictionId, addiction.startDate)
    }));

    // Display amount based on selection
    const displayAmount = selectedView === 'all'
        ? totalSavings
        : addictionSavings.find(a => a.id === selectedView)?.savings || 0;

    useEffect(() => {
        animatedValue.setValue(0);
        Animated.timing(animatedValue, {
            toValue: displayAmount,
            duration: 1000,
            useNativeDriver: false,
        }).start();
    }, [displayAmount]);

    const handlePressIn = () => {
        Animated.spring(scaleAnim, { toValue: 0.98, useNativeDriver: true }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }).start();
    };

    const handleOpenSettings = () => {
        const currentCosts = {};
        userAddictions.forEach(a => {
            currentCosts[a.addictionId] = costs[a.addictionId]?.daily?.toString() || '0';
        });
        setEditingCosts(currentCosts);
        setShowSettings(true);
    };

    const handleSaveSettings = () => {
        Object.keys(editingCosts).forEach(id => {
            const value = parseFloat(editingCosts[id]) || 0;
            setCost(id, value);
        });
        setShowSettings(false);
    };

    const updateCost = (addictionId, value) => {
        setEditingCosts(prev => ({ ...prev, [addictionId]: value }));
    };

    if (userAddictions.length === 0) return null;

    return (
        <>
            <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                <Pressable
                    onPress={handleOpenSettings}
                    onPressIn={handlePressIn}
                    onPressOut={handlePressOut}
                    style={[styles.container, { backgroundColor: colors.background.card }]}
                >
                    <View style={styles.mainRow}>
                        <View style={styles.iconContainer}>
                            <View style={[styles.iconBg, { backgroundColor: '#10B98120' }]}>
                                <Ionicons name="wallet" size={24} color="#10B981" />
                            </View>
                        </View>

                        <View style={styles.content}>
                            <Text style={[styles.label, { color: colors.text.secondary }]}>Money Saved</Text>
                            <View style={styles.amountRow}>
                                <Text style={[styles.currencySymbol, { color: '#10B981' }]}>{currencySymbol}</Text>
                                <AnimatedNumber value={displayAmount} colors={colors} />
                            </View>
                        </View>

                        <Ionicons name="settings-outline" size={20} color={colors.text.muted} />
                    </View>

                    {/* Per-addiction tabs - only show when multiple addictions exist */}
                    {userAddictions.length > 1 && (
                        <View style={styles.tabsContainer}>
                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={styles.tabsScroll}
                            >
                                <Pressable
                                    onPress={(e) => { e.stopPropagation(); setSelectedView('all'); }}
                                    style={[
                                        styles.tab,
                                        { backgroundColor: selectedView === 'all' ? '#10B981' : colors.background.secondary }
                                    ]}
                                >
                                    <Ionicons name="grid" size={12} color={selectedView === 'all' ? '#fff' : colors.text.muted} />
                                    <Text style={[styles.tabText, { color: selectedView === 'all' ? '#fff' : colors.text.muted }]}>All</Text>
                                </Pressable>
                                {addictionSavings.map(addiction => (
                                    <Pressable
                                        key={addiction.id}
                                        onPress={(e) => { e.stopPropagation(); setSelectedView(addiction.id); }}
                                        style={[
                                            styles.tab,
                                            { backgroundColor: selectedView === addiction.id ? '#10B981' : colors.background.secondary }
                                        ]}
                                    >
                                        <IconRenderer
                                            library={addiction.library || 'Ionicons'}
                                            name={addiction.icon}
                                            size={12}
                                            color={selectedView === addiction.id ? '#fff' : colors.text.muted}
                                        />
                                        <Text style={[styles.tabText, { color: selectedView === addiction.id ? '#fff' : colors.text.muted }]}>
                                            {currencySymbol}{addiction.savings.toFixed(0)}
                                        </Text>
                                    </Pressable>
                                ))}
                            </ScrollView>
                        </View>
                    )}
                </Pressable>
            </Animated.View>

            <Modal visible={showSettings} transparent animationType="slide">
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { backgroundColor: colors.background.card }]}>
                        <View style={styles.modalHeader}>
                            <Text style={[styles.modalTitle, { color: colors.text.primary }]}>Configure Daily Costs</Text>
                            <Pressable onPress={() => setShowSettings(false)}>
                                <Ionicons name="close" size={24} color={colors.text.secondary} />
                            </Pressable>
                        </View>

                        <Text style={[styles.modalSubtitle, { color: colors.text.muted }]}>
                            Set how much you typically spent per day on each habit. Default values are based on 2024 research averages.
                        </Text>

                        <ScrollView style={styles.costsList}>
                            {userAddictions.map(addiction => {
                                const defaultCost = costs[addiction.addictionId];
                                return (
                                    <View key={addiction.addictionId} style={[styles.costItem, { borderBottomColor: colors.border }]}>
                                        <View style={styles.costLabelRow}>
                                            <IconRenderer
                                                library={addiction.library || 'Ionicons'}
                                                name={addiction.icon}
                                                size={18}
                                                color={colors.text.secondary}
                                            />
                                            <View style={styles.costLabelInfo}>
                                                <Text style={[styles.costLabel, { color: colors.text.primary }]}>{addiction.name}</Text>
                                                {defaultCost?.description && (
                                                    <Text style={[styles.costDesc, { color: colors.text.muted }]}>{defaultCost.description}</Text>
                                                )}
                                            </View>
                                        </View>
                                        <View style={styles.costInputWrapper}>
                                            <Text style={[styles.currencyPrefix, { color: colors.text.muted }]}>{currencySymbol}</Text>
                                            <TextInput
                                                style={[styles.costInput, { color: colors.text.primary, backgroundColor: colors.background.secondary }]}
                                                value={editingCosts[addiction.addictionId] || ''}
                                                onChangeText={(v) => updateCost(addiction.addictionId, v)}
                                                keyboardType="numeric"
                                                placeholder={defaultCost?.daily?.toString() || '0'}
                                                placeholderTextColor={colors.text.muted}
                                            />
                                            <Text style={[styles.costSuffix, { color: colors.text.muted }]}>/day</Text>
                                        </View>
                                    </View>
                                );
                            })}

                            {/* Yearly projection */}
                            <View style={[styles.projectionCard, { backgroundColor: colors.background.secondary }]}>
                                <Ionicons name="trending-up" size={20} color="#10B981" />
                                <View style={styles.projectionContent}>
                                    <Text style={[styles.projectionTitle, { color: colors.text.primary }]}>Yearly Projection</Text>
                                    <Text style={[styles.projectionValue, { color: '#10B981' }]}>
                                        {currencySymbol}{(Object.keys(editingCosts).reduce((sum, k) => sum + (parseFloat(editingCosts[k]) || 0), 0) * 365).toLocaleString()}
                                    </Text>
                                    <Text style={[styles.projectionDesc, { color: colors.text.muted }]}>
                                        Potential savings per year if you stay sober
                                    </Text>
                                </View>
                            </View>
                        </ScrollView>

                        <Pressable
                            style={[styles.saveButton, { backgroundColor: '#10B981' }]}
                            onPress={handleSaveSettings}
                        >
                            <Text style={styles.saveButtonText}>Save Changes</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
        </>
    );
};

const AnimatedNumber = ({ value, colors }) => {
    const [displayValue, setDisplayValue] = useState('0.00');
    const animRef = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        animRef.setValue(0);
        Animated.timing(animRef, {
            toValue: value,
            duration: 1200,
            useNativeDriver: false,
        }).start();

        const listener = animRef.addListener(({ value: v }) => {
            setDisplayValue(v.toFixed(2));
        });

        return () => animRef.removeListener(listener);
    }, [value]);

    return (
        <Text style={[styles.amount, { color: colors.text.primary }]}>{displayValue}</Text>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        marginHorizontal: spacing.screenPadding,
        marginVertical: spacing.sm,
        padding: spacing.md,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#10B98130',
        overflow: 'hidden',
    },
    iconContainer: {
        marginRight: spacing.md,
    },
    iconBg: {
        width: 48,
        height: 48,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    content: {
        flex: 1,
    },
    label: {
        fontSize: typography.size.sm,
        fontWeight: '500',
    },
    amountRow: {
        flexDirection: 'row',
        alignItems: 'baseline',
    },
    currencySymbol: {
        fontSize: typography.size.xl,
        fontWeight: '700',
        marginRight: 2,
    },
    amount: {
        fontSize: typography.size['3xl'],
        fontWeight: '700',
        letterSpacing: -1,
    },
    hint: {
        fontSize: typography.size.xs,
        marginTop: 2,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: spacing.lg,
        maxHeight: '80%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.sm,
    },
    modalTitle: {
        fontSize: typography.size.xl,
        fontWeight: '700',
    },
    modalSubtitle: {
        fontSize: typography.size.sm,
        marginBottom: spacing.lg,
    },
    costsList: {
        maxHeight: 300,
    },
    costItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: spacing.md,
        borderBottomWidth: 1,
    },
    costLabel: {
        fontSize: typography.size.base,
        fontWeight: '500',
        flex: 1,
    },
    costInputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    currencyPrefix: {
        fontSize: typography.size.base,
        marginRight: 4,
    },
    costInput: {
        width: 80,
        height: 40,
        borderRadius: 8,
        paddingHorizontal: spacing.sm,
        fontSize: typography.size.base,
        textAlign: 'right',
    },
    costSuffix: {
        fontSize: typography.size.sm,
        marginLeft: 4,
    },
    saveButton: {
        marginTop: spacing.lg,
        padding: spacing.md,
        borderRadius: 12,
        alignItems: 'center',
    },
    saveButtonText: {
        color: '#fff',
        fontSize: typography.size.base,
        fontWeight: '600',
    },
    mainRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    tabsContainer: {
        marginTop: spacing.sm,
        borderTopWidth: 1,
        borderTopColor: '#10B98120',
        paddingTop: spacing.sm,
    },
    tabsScroll: {
        gap: spacing.xs,
    },
    tab: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 4,
        paddingHorizontal: 10,
        borderRadius: 12,
        gap: 4,
        backgroundColor: 'transparent',
    },
    tabText: {
        fontSize: typography.size.xs,
        fontWeight: '600',
    },
    costLabelRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: spacing.sm,
        flex: 1,
    },
    costLabelInfo: {
        flex: 1,
    },
    costDesc: {
        fontSize: typography.size.xs,
        marginTop: 2,
    },
    projectionCard: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginTop: spacing.lg,
        padding: spacing.md,
        borderRadius: 12,
        gap: spacing.md,
    },
    projectionContent: {
        flex: 1,
    },
    projectionTitle: {
        fontSize: typography.size.sm,
        fontWeight: '600',
    },
    projectionValue: {
        fontSize: typography.size.xl,
        fontWeight: '700',
        marginTop: 4,
    },
    projectionDesc: {
        fontSize: typography.size.xs,
        marginTop: 4,
    },
});

export default MoneySavedCard;

// --- End of MoneySavedCard.js ---
