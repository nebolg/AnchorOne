// Author: -GLOBENXCC-
// OS support: iOS, Android, Web
// Description: Privacy choice screen - anonymous by default or optional username

import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Pressable, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, Button } from '../../components/common';
import { colors, spacing, typography } from '../../theme';
import { useUserStore } from '../../store';
import { api } from '../../services/api';

export const PrivacyScreen = ({ navigation }) => {
    const { isAnonymous, setAnonymous, username, setUsername, setUser } = useUserStore();
    const [localUsername, setLocalUsername] = useState(username || '');
    const [wantsUsername, setWantsUsername] = useState(!isAnonymous);

    const handleContinue = async () => {
        try {
            // Check if user is already authenticated (e.g., via Google)
            let currentUserId = useUserStore.getState().userId;
            const isGuest = !currentUserId || currentUserId.startsWith('user_');

            if (isGuest) {
                // Ensure we have a backend user and token for guest
                const backendUser = await api.createAnonymousUser();
                currentUserId = backendUser.id;
            }

            if (wantsUsername && localUsername.trim()) {
                await api.setUsername(currentUserId, localUsername.trim());
                setUsername(localUsername.trim());
                setUser(currentUserId, localUsername.trim(), false);
            } else if (isGuest) {
                setAnonymous(true);
                setUser(currentUserId, null, true);
            }

            navigation.navigate('Location');
        } catch (error) {
            console.error('Failed to initialize privacy settings:', error);
            navigation.navigate('Location');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>Your privacy matters</Text>
                <Text style={styles.subtitle}>
                    How would you like to be identified in the community?
                </Text>

                {/* Anonymous option */}
                <Card
                    style={[
                        styles.optionCard,
                        !wantsUsername && styles.optionCardSelected,
                    ]}
                    onPress={() => setWantsUsername(false)}
                >
                    <View style={styles.optionContent}>
                        <Text style={styles.optionIcon}>🎭</Text>
                        <View style={styles.optionTextContainer}>
                            <Text style={styles.optionTitle}>Stay Anonymous</Text>
                            <Text style={styles.optionDescription}>
                                Post and connect without revealing your identity
                            </Text>
                        </View>
                    </View>
                    {!wantsUsername && (
                        <View style={styles.selectedIndicator}>
                            <Text style={styles.selectedCheck}>✓</Text>
                        </View>
                    )}
                </Card>

                {/* Username option */}
                <Card
                    style={[
                        styles.optionCard,
                        wantsUsername && styles.optionCardSelected,
                    ]}
                    onPress={() => setWantsUsername(true)}
                >
                    <View style={styles.optionContent}>
                        <Text style={styles.optionIcon}>👤</Text>
                        <View style={styles.optionTextContainer}>
                            <Text style={styles.optionTitle}>Choose a Username</Text>
                            <Text style={styles.optionDescription}>
                                Create a recovery identity for the community
                            </Text>
                        </View>
                    </View>
                    {wantsUsername && (
                        <View style={styles.selectedIndicator}>
                            <Text style={styles.selectedCheck}>✓</Text>
                        </View>
                    )}
                </Card>

                {/* Username input */}
                {wantsUsername && (
                    <View style={styles.usernameContainer}>
                        <TextInput
                            style={styles.usernameInput}
                            placeholder="Enter your username..."
                            placeholderTextColor={colors.text.muted}
                            value={localUsername}
                            onChangeText={setLocalUsername}
                            autoCapitalize="none"
                            autoCorrect={false}
                            maxLength={20}
                        />
                        <Text style={styles.usernameHint}>
                            {localUsername.length}/20 characters
                        </Text>
                    </View>
                )}

                {/* Privacy note */}
                <View style={styles.noteContainer}>
                    <Text style={styles.noteIcon}>🔒</Text>
                    <Text style={styles.noteText}>
                        Your data is never sold. You can delete your account and all data anytime.
                    </Text>
                </View>
            </View>

            <View style={styles.footer}>
                <Button
                    title="Continue"
                    size="large"
                    onPress={handleContinue}
                    disabled={wantsUsername && !localUsername.trim()}
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
    content: {
        flex: 1,
        padding: spacing.screenPadding,
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
    optionCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: spacing.md,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    optionCardSelected: {
        borderColor: colors.primary.teal,
        backgroundColor: colors.primary.teal + '08',
    },
    optionContent: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    optionIcon: {
        fontSize: 32,
        marginRight: spacing.md,
    },
    optionTextContainer: {
        flex: 1,
    },
    optionTitle: {
        fontSize: typography.size.base,
        fontWeight: typography.weight.semibold,
        color: colors.text.primary,
    },
    optionDescription: {
        fontSize: typography.size.sm,
        color: colors.text.secondary,
        marginTop: 2,
    },
    selectedIndicator: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: colors.primary.teal,
        alignItems: 'center',
        justifyContent: 'center',
    },
    selectedCheck: {
        color: colors.text.inverse,
        fontSize: 16,
        fontWeight: typography.weight.bold,
    },
    usernameContainer: {
        marginTop: spacing.md,
    },
    usernameInput: {
        backgroundColor: colors.background.card,
        borderRadius: spacing.radius.lg,
        padding: spacing.md,
        fontSize: typography.size.base,
        color: colors.text.primary,
        borderWidth: 1,
        borderColor: colors.background.secondary,
    },
    usernameHint: {
        fontSize: typography.size.xs,
        color: colors.text.muted,
        marginTop: spacing.sm,
        textAlign: 'right',
    },
    noteContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: colors.primary.teal + '10',
        padding: spacing.md,
        borderRadius: spacing.radius.lg,
        marginTop: spacing.xl,
    },
    noteIcon: {
        fontSize: 20,
        marginRight: spacing.sm,
    },
    noteText: {
        flex: 1,
        fontSize: typography.size.sm,
        color: colors.text.secondary,
        lineHeight: 20,
    },
    footer: {
        padding: spacing.screenPadding,
        borderTopWidth: 1,
        borderTopColor: colors.background.secondary,
    },
});

export default PrivacyScreen;

// --- End of PrivacyScreen.js ---
