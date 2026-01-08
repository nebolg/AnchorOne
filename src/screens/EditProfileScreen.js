// Author: -GLOBENXCC-
// OS support: iOS, Android, Web
// Description: Premium Edit Profile screen for travelers to customize their identity

import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, ScrollView, Pressable, KeyboardAvoidingView, Platform, Alert, ActivityIndicator, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useColors, colors, spacing, typography } from '../theme';
import { Card, Button, GradientBackground } from '../components/common';
import { useUserStore } from '../store';
import { api } from '../services/api';

const AVATAR_ICONS = [
    'compass', 'boat-outline', 'leaf', 'water', 'flame',
    'shield-checkmark', 'heart', 'star', 'planet',
    'image-outline', 'infinite', 'flash'
];

const AVATAR_COLORS = [
    '#14B8A6', // Teal
    '#3B82F6', // Blue
    '#8B5CF6', // Violet
    '#F43F5E', // Rose
    '#F59E0B', // Amber
    '#10B981', // Emerald
    '#6366F1', // Indigo
    '#06B6D4', // Cyan
];

export const EditProfileScreen = ({ navigation }) => {
    const themeColors = useColors();
    const {
        userId,
        username: currentUsername,
        avatarId: currentAvatarId,
        avatarColor: currentAvatarColor,
        avatarUrl: currentAvatarUrl,
        bio: currentBio,
        catchphrase: currentCatchphrase,
        lastUsernameChange,
        updateProfileStore
    } = useUserStore();

    const [username, setUsername] = useState(currentUsername || '');
    const [avatarId, setAvatarId] = useState(currentAvatarId || 'compass');
    const [avatarColor, setAvatarColor] = useState(currentAvatarColor || colors.primary.teal);
    const [avatarUrl, setAvatarUrl] = useState(currentAvatarUrl || null);
    const [bio, setBio] = useState(currentBio || '');
    const [catchphrase, setCatchphrase] = useState(currentCatchphrase || '');
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const canChangeUsername = () => {
        if (!lastUsernameChange) return true;
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        return new Date(lastUsernameChange) <= oneWeekAgo;
    };

    const pickImage = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permissionResult.granted) {
            Alert.alert('Permission Required', 'Please allow access to your photo library to upload an avatar.');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled && result.assets[0]) {
            try {
                setIsUploading(true);
                console.log('Uploading avatar from:', result.assets[0].uri);
                const response = await api.uploadAvatar(result.assets[0].uri);
                console.log('Upload response:', response);
                setAvatarUrl(response.avatarUrl);
                useUserStore.setState({ avatarUrl: response.avatarUrl });
                Alert.alert('Success', 'Your photo has been uploaded!');
            } catch (error) {
                console.error('Avatar Upload Error:', error);
                Alert.alert('Upload Failed', error.message || 'Could not upload photo. Make sure the backend is running.');
            } finally {
                setIsUploading(false);
            }
        }
    };

    const handleSave = async () => {
        if (!username.trim()) {
            Alert.alert('Error', 'Username cannot be empty');
            return;
        }

        try {
            setIsSaving(true);
            const updates = {
                avatarId,
                avatarColor,
                bio,
                catchphrase,
            };

            // Only include username if it changed and is allowed
            if (username !== currentUsername) {
                if (!canChangeUsername()) {
                    Alert.alert('Stability Rule', 'You can only change your username once a week to keep the community stable.');
                    setIsSaving(false);
                    return;
                }
                updates.username = username;
            }

            const data = await api.updateProfile(updates);

            // Update store
            updateProfileStore(data.user);

            Alert.alert('Success', 'Your traveler profile has been updated.', [
                { text: 'Great', onPress: () => navigation.goBack() }
            ]);
        } catch (error) {
            console.error('Update Profile Error:', error);
            Alert.alert('Error', error.message || 'Failed to update profile');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: themeColors.background.primary }]}>
            <SafeAreaView edges={['top']} style={styles.safeArea}>
                <View style={[styles.header, { borderBottomColor: themeColors.background.secondary }]}>
                    <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
                        <Ionicons name="arrow-back" size={24} color={themeColors.text.primary} />
                    </Pressable>
                    <Text style={[styles.title, { color: themeColors.text.primary }]}>Refine Identity</Text>
                    <Pressable onPress={handleSave} disabled={isSaving}>
                        {isSaving ? (
                            <ActivityIndicator size="small" color={themeColors.primary.teal} />
                        ) : (
                            <Text style={[styles.saveText, { color: themeColors.primary.teal }]}>Save</Text>
                        )}
                    </Pressable>
                </View>

                <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                >
                    <ScrollView
                        style={styles.scrollView}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.scrollContent}
                    >
                        {/* Avatar Preview */}
                        <View style={styles.previewSection}>
                            <Pressable onPress={pickImage} style={[styles.previewAvatar, { backgroundColor: avatarColor + '20', borderColor: avatarColor }]}>
                                {isUploading ? (
                                    <ActivityIndicator size="large" color={avatarColor} />
                                ) : avatarUrl ? (
                                    <Image source={{ uri: avatarUrl }} style={styles.avatarImage} />
                                ) : (
                                    <Ionicons name={avatarId} size={48} color={avatarColor} />
                                )}
                                <View style={styles.cameraBadge}>
                                    <Ionicons name="camera" size={14} color={colors.text.inverse} />
                                </View>
                            </Pressable>
                            <Text style={styles.previewLabel}>Tap to Upload Photo</Text>
                        </View>

                        {/* Customization Panels */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Visual Identity</Text>
                            <Card style={styles.customCard}>
                                <Text style={styles.label}>Choose Mark (fallback if no photo)</Text>
                                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.iconGrid}>
                                    {AVATAR_ICONS.map((icon) => (
                                        <Pressable
                                            key={icon}
                                            onPress={() => setAvatarId(icon)}
                                            style={[
                                                styles.iconItem,
                                                avatarId === icon && { backgroundColor: avatarColor, borderColor: avatarColor }
                                            ]}
                                        >
                                            <Ionicons
                                                name={icon}
                                                size={22}
                                                color={avatarId === icon ? colors.text.inverse : colors.text.muted}
                                            />
                                        </Pressable>
                                    ))}
                                </ScrollView>

                                <Text style={[styles.label, { marginTop: spacing.lg }]}>Energy Color</Text>
                                <View style={styles.colorGrid}>
                                    {AVATAR_COLORS.map((color) => (
                                        <Pressable
                                            key={color}
                                            onPress={() => setAvatarColor(color)}
                                            style={[
                                                styles.colorItem,
                                                { backgroundColor: color },
                                                avatarColor === color && styles.colorItemActive
                                            ]}
                                        >
                                            {avatarColor === color && (
                                                <Ionicons name="checkmark" size={16} color={colors.text.inverse} />
                                            )}
                                        </Pressable>
                                    ))}
                                </View>
                            </Card>
                        </View>

                        {/* Text Content */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Identity Details</Text>
                            <Card style={styles.formCard}>
                                <View style={styles.inputGroup}>
                                    <Text style={styles.hintLabel}>Username</Text>
                                    <TextInput
                                        style={[styles.input, !canChangeUsername() && styles.inputDisabled]}
                                        value={username}
                                        onChangeText={setUsername}
                                        placeholder="Traveler Name"
                                        placeholderTextColor={colors.text.muted}
                                        editable={canChangeUsername()}
                                    />
                                    {!canChangeUsername() && (
                                        <Text style={styles.errorHint}>🔒 On cooldown (1 week change limit)</Text>
                                    )}
                                </View>

                                <View style={styles.inputGroup}>
                                    <Text style={styles.hintLabel}>Catchphrase</Text>
                                    <TextInput
                                        style={styles.input}
                                        value={catchphrase}
                                        onChangeText={setCatchphrase}
                                        placeholder="Keep moving forward..."
                                        placeholderTextColor={colors.text.muted}
                                        maxLength={50}
                                    />
                                </View>

                                <View style={styles.inputGroup}>
                                    <Text style={styles.hintLabel}>Bio</Text>
                                    <TextInput
                                        style={[styles.input, styles.textArea]}
                                        value={bio}
                                        onChangeText={setBio}
                                        placeholder="Share your traveler's story..."
                                        placeholderTextColor={colors.text.muted}
                                        multiline
                                        numberOfLines={4}
                                        maxLength={200}
                                    />
                                </View>
                            </Card>
                        </View>

                        <View style={{ height: 40 }} />
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background.primary,
    },
    safeArea: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.md,
        height: 56,
        borderBottomWidth: 1,
        borderBottomColor: colors.background.secondary,
    },
    backBtn: {
        padding: spacing.xs,
    },
    title: {
        fontSize: typography.size.base,
        fontWeight: 'bold',
        color: colors.text.primary,
    },
    saveText: {
        fontSize: typography.size.base,
        fontWeight: 'bold',
        color: colors.primary.teal,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: spacing.md,
    },
    previewSection: {
        alignItems: 'center',
        marginVertical: spacing.xl,
    },
    previewAvatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 3,
        overflow: 'hidden',
    },
    avatarImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    cameraBadge: {
        position: 'absolute',
        bottom: 4,
        right: 4,
        backgroundColor: colors.primary.teal,
        width: 28,
        height: 28,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: colors.background.primary,
    },
    previewLabel: {
        marginTop: spacing.sm,
        fontSize: 12,
        fontWeight: 'bold',
        color: colors.text.muted,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    section: {
        marginBottom: spacing.xl,
    },
    sectionTitle: {
        fontSize: typography.size.sm,
        fontWeight: '900',
        color: colors.text.primary,
        marginBottom: spacing.md,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    customCard: {
        padding: spacing.lg,
    },
    label: {
        fontSize: 12,
        fontWeight: 'bold',
        color: colors.text.secondary,
        marginBottom: spacing.md,
    },
    iconGrid: {
        gap: spacing.md,
        paddingBottom: 4,
    },
    iconItem: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: colors.background.secondary,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: colors.background.secondary,
    },
    colorGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.md,
    },
    colorItem: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    colorItemActive: {
        borderWidth: 3,
        borderColor: 'rgba(0,0,0,0.1)',
    },
    formCard: {
        padding: spacing.lg,
    },
    inputGroup: {
        marginBottom: spacing.lg,
    },
    hintLabel: {
        fontSize: 10,
        fontWeight: 'bold',
        color: colors.text.muted,
        textTransform: 'uppercase',
        marginBottom: 8,
        marginLeft: 4,
    },
    input: {
        backgroundColor: colors.background.secondary + '50',
        borderRadius: 12,
        padding: spacing.md,
        fontSize: 15,
        color: colors.text.primary,
        borderWidth: 1,
        borderColor: colors.background.secondary,
    },
    inputDisabled: {
        opacity: 0.6,
        backgroundColor: colors.background.secondary,
    },
    textArea: {
        minHeight: 100,
        textAlignVertical: 'top',
    },
    errorHint: {
        fontSize: 10,
        color: colors.status.error,
        marginTop: 4,
        marginLeft: 8,
        fontWeight: '600',
    },
});

export default EditProfileScreen;

// --- End of EditProfileScreen.js ---
