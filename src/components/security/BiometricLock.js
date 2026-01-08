// Author: -GLOBENXCC-
// OS support: iOS, Android, Web
// Description: Biometric lock screen component for app security

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Platform, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as LocalAuthentication from 'expo-local-authentication';
import { useColors, spacing, typography } from '../../theme';
import { useSecurityStore } from '../../store/securityStore';

export const BiometricLock = ({ children }) => {
    const colors = useColors();
    const { biometricEnabled, isLocked, unlock, panicModeEnabled, panicModeType } = useSecurityStore();
    const [showPanicMode, setShowPanicMode] = useState(false);
    const [tapCount, setTapCount] = useState(0);
    const [authFailed, setAuthFailed] = useState(false);

    useEffect(() => {
        if (biometricEnabled && isLocked) {
            authenticate();
        }
    }, [isLocked, biometricEnabled]);

    const authenticate = async () => {
        try {
            const hasHardware = await LocalAuthentication.hasHardwareAsync();
            const isEnrolled = await LocalAuthentication.isEnrolledAsync();

            if (!hasHardware || !isEnrolled) {
                unlock();
                return;
            }

            const result = await LocalAuthentication.authenticateAsync({
                promptMessage: 'Unlock AnchorOne',
                cancelLabel: 'Cancel',
                fallbackLabel: 'Use Passcode',
                disableDeviceFallback: false,
            });

            if (result.success) {
                setAuthFailed(false);
                unlock();
            } else {
                setAuthFailed(true);
            }
        } catch (error) {
            console.log('Biometric auth error:', error);
            setAuthFailed(true);
        }
    };

    const handleLogoTap = () => {
        if (!panicModeEnabled) return;

        const newCount = tapCount + 1;
        setTapCount(newCount);

        if (newCount >= 3) {
            setShowPanicMode(false);
            setTapCount(0);
            authenticate();
        }

        setTimeout(() => setTapCount(0), 1500);
    };

    if (!biometricEnabled) {
        return children;
    }

    if (isLocked) {
        if (showPanicMode && panicModeEnabled) {
            return (
                <PanicModeScreen
                    type={panicModeType}
                    onLogoTap={handleLogoTap}
                    colors={colors}
                    tapCount={tapCount}
                />
            );
        }

        return (
            <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
                <View style={styles.content}>
                    <View style={[styles.iconContainer, { backgroundColor: colors.primary.teal + '20' }]}>
                        <Ionicons name="lock-closed" size={48} color={colors.primary.teal} />
                    </View>
                    <Text style={[styles.title, { color: colors.text.primary }]}>AnchorOne is Locked</Text>
                    <Text style={[styles.subtitle, { color: colors.text.secondary }]}>
                        Use biometrics to unlock
                    </Text>

                    {authFailed && (
                        <View style={styles.failedContainer}>
                            <Ionicons name="alert-circle" size={20} color={colors.status.error} />
                            <Text style={[styles.failedText, { color: colors.status.error }]}>
                                Authentication failed
                            </Text>
                        </View>
                    )}

                    <Pressable
                        onPress={authenticate}
                        style={[styles.unlockButton, { backgroundColor: colors.primary.teal }]}
                    >
                        <Ionicons name="finger-print" size={24} color="#fff" />
                        <Text style={styles.unlockButtonText}>Unlock</Text>
                    </Pressable>

                    {panicModeEnabled && (
                        <Pressable
                            onPress={() => setShowPanicMode(true)}
                            style={styles.panicButton}
                        >
                            <Text style={[styles.panicButtonText, { color: colors.text.muted }]}>
                                Hide App
                            </Text>
                        </Pressable>
                    )}
                </View>
            </View>
        );
    }

    return children;
};

const PanicModeScreen = ({ type, onLogoTap, colors, tapCount }) => {
    const [displayValue, setDisplayValue] = useState('0');

    const handlePress = (value) => {
        if (value === 'C') {
            setDisplayValue('0');
        } else if (value === '=') {
            try {
                const result = eval(displayValue);
                setDisplayValue(String(result));
            } catch {
                setDisplayValue('Error');
            }
        } else {
            setDisplayValue(prev => prev === '0' ? value : prev + value);
        }
    };

    if (type === 'calculator') {
        const buttons = [
            ['C', '±', '%', '÷'],
            ['7', '8', '9', '×'],
            ['4', '5', '6', '-'],
            ['1', '2', '3', '+'],
            ['0', '.', '='],
        ];

        return (
            <View style={[styles.panicContainer, { backgroundColor: '#000' }]}>
                <View style={styles.calculatorDisplay}>
                    <Text style={styles.calculatorValue}>{displayValue}</Text>
                </View>
                <View style={styles.calculatorButtons}>
                    {buttons.map((row, rowIndex) => (
                        <View key={rowIndex} style={styles.calculatorRow}>
                            {row.map((btn) => (
                                <Pressable
                                    key={btn}
                                    onPress={() => btn === '0' && tapCount < 2 ? onLogoTap() : handlePress(btn)}
                                    onLongPress={btn === '0' ? onLogoTap : undefined}
                                    style={[
                                        styles.calcButton,
                                        btn === '0' && styles.calcButtonWide,
                                        ['÷', '×', '-', '+', '='].includes(btn) && styles.calcButtonOrange,
                                        ['C', '±', '%'].includes(btn) && styles.calcButtonGray,
                                    ]}
                                >
                                    <Text style={[
                                        styles.calcButtonText,
                                        ['C', '±', '%'].includes(btn) && styles.calcButtonTextDark,
                                    ]}>
                                        {btn}
                                    </Text>
                                </Pressable>
                            ))}
                        </View>
                    ))}
                </View>
                <Text style={styles.panicHint}>Triple-tap 0 to return</Text>
            </View>
        );
    }

    return (
        <View style={[styles.panicContainer, { backgroundColor: colors.background.primary }]}>
            <Pressable onPress={onLogoTap} style={styles.panicLogoArea}>
                <Ionicons name="document-text" size={64} color={colors.text.muted} />
                <Text style={[styles.panicTitle, { color: colors.text.secondary }]}>Notes</Text>
            </Pressable>
            <Text style={styles.panicHint}>Triple-tap logo to return</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        alignItems: 'center',
        padding: spacing.xl,
    },
    iconContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.lg,
    },
    title: {
        fontSize: typography.size['2xl'],
        fontWeight: '700',
        marginBottom: spacing.sm,
    },
    subtitle: {
        fontSize: typography.size.base,
        textAlign: 'center',
        marginBottom: spacing.xl,
    },
    failedContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.lg,
        gap: spacing.sm,
    },
    failedText: {
        fontSize: typography.size.sm,
        fontWeight: '500',
    },
    unlockButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.xl,
        borderRadius: 16,
        gap: spacing.sm,
    },
    unlockButtonText: {
        color: '#fff',
        fontSize: typography.size.lg,
        fontWeight: '600',
    },
    panicButton: {
        marginTop: spacing.lg,
        padding: spacing.md,
    },
    panicButtonText: {
        fontSize: typography.size.sm,
    },
    panicContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    panicLogoArea: {
        alignItems: 'center',
    },
    panicTitle: {
        fontSize: typography.size.lg,
        marginTop: spacing.md,
    },
    panicHint: {
        position: 'absolute',
        bottom: 50,
        color: '#333',
        fontSize: 10,
    },
    calculatorDisplay: {
        width: '100%',
        padding: spacing.xl,
        alignItems: 'flex-end',
    },
    calculatorValue: {
        color: '#fff',
        fontSize: 64,
        fontWeight: '300',
    },
    calculatorButtons: {
        width: '100%',
        padding: spacing.sm,
    },
    calculatorRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: spacing.sm,
    },
    calcButton: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#333',
        alignItems: 'center',
        justifyContent: 'center',
    },
    calcButtonWide: {
        width: 170,
        borderRadius: 40,
    },
    calcButtonOrange: {
        backgroundColor: '#FF9500',
    },
    calcButtonGray: {
        backgroundColor: '#A5A5A5',
    },
    calcButtonText: {
        color: '#fff',
        fontSize: 32,
        fontWeight: '400',
    },
    calcButtonTextDark: {
        color: '#000',
    },
});

export default BiometricLock;

// --- End of BiometricLock.js ---
