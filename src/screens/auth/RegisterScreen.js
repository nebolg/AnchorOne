// Author: -GLOBENXCC-
// OS support: iOS, Android, Web
// Description: Registration screen with email/password signup

import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, Pressable, Animated, KeyboardAvoidingView, Platform, Alert, ScrollView, Image } from 'react-native';

const LOGO = require('../../../assets/logo.png');
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../../theme';
import { useUserStore } from '../../store';
import { TIMING, EASING, SPRING } from '../../utils/animations';
import api from '../../services/api';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const RegisterScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [acceptedTerms, setAcceptedTerms] = useState(false);

    const { setUser, syncProfileFromBackend } = useUserStore();

    // Animations
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(30)).current;
    const registerBtnScale = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
            Animated.timing(slideAnim, { toValue: 0, duration: 500, easing: EASING.decelerate, useNativeDriver: true }),
        ]).start();
    }, []);

    const validateForm = () => {
        if (!email || !password || !confirmPassword) {
            Alert.alert('Error', 'Please fill in all required fields');
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            Alert.alert('Error', 'Please enter a valid email address');
            return false;
        }

        if (password.length < 8) {
            Alert.alert('Error', 'Password must be at least 8 characters');
            return false;
        }

        if (password !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match');
            return false;
        }

        if (username && (username.length < 3 || username.length > 20)) {
            Alert.alert('Error', 'Username must be 3-20 characters');
            return false;
        }

        if (username && !/^[a-zA-Z0-9_]+$/.test(username)) {
            Alert.alert('Error', 'Username can only contain letters, numbers, and underscores');
            return false;
        }

        if (!acceptedTerms) {
            Alert.alert('Error', 'Please accept the Terms and Privacy Policy');
            return false;
        }

        return true;
    };

    const handleRegister = async () => {
        if (!validateForm()) return;

        setLoading(true);
        try {
            const data = await api.register(email, password, username || undefined);
            await api.setAuthToken(data.token);
            setUser(data.user.id, data.user.username, data.user.anonymous);
            navigation.replace('AddictionSelect');
        } catch (error) {
            Alert.alert('Error', error.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    const handlePressIn = (scaleAnim) => {
        Animated.spring(scaleAnim, { toValue: 0.96, ...SPRING.stiff, useNativeDriver: true }).start();
    };

    const handlePressOut = (scaleAnim) => {
        Animated.spring(scaleAnim, { toValue: 1, ...SPRING.gentle, useNativeDriver: true }).start();
    };

    const passwordStrength = () => {
        if (password.length === 0) return null;
        if (password.length < 8) return { text: 'Weak', color: '#EF4444' };
        if (password.length < 12) return { text: 'Medium', color: '#F59E0B' };
        return { text: 'Strong', color: '#10B981' };
    };

    const strength = passwordStrength();

    return (
        <LinearGradient colors={[colors.background.primary, colors.background.secondary]} style={styles.gradient}>
            <SafeAreaView style={styles.container}>
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardView}>
                    {/* Back Button */}
                    <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
                        <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
                    </Pressable>

                    <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
                            {/* Header */}
                            <View style={styles.header}>
                                <Image source={LOGO} style={styles.logo} />
                                <Text style={styles.title}>Create Account</Text>
                                <Text style={styles.subtitle}>Start your recovery journey today</Text>
                            </View>

                            {/* Form */}
                            <View style={styles.form}>
                                <View style={styles.inputContainer}>
                                    <Ionicons name="mail-outline" size={20} color={colors.text.muted} style={styles.inputIcon} />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Email *"
                                        placeholderTextColor={colors.text.muted}
                                        value={email}
                                        onChangeText={setEmail}
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                        autoComplete="email"
                                    />
                                </View>

                                <View style={styles.inputContainer}>
                                    <Ionicons name="person-outline" size={20} color={colors.text.muted} style={styles.inputIcon} />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Username (optional)"
                                        placeholderTextColor={colors.text.muted}
                                        value={username}
                                        onChangeText={setUsername}
                                        autoCapitalize="none"
                                        maxLength={20}
                                    />
                                </View>

                                <View style={styles.inputContainer}>
                                    <Ionicons name="lock-closed-outline" size={20} color={colors.text.muted} style={styles.inputIcon} />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Password *"
                                        placeholderTextColor={colors.text.muted}
                                        value={password}
                                        onChangeText={setPassword}
                                        secureTextEntry={!showPassword}
                                        autoCapitalize="none"
                                    />
                                    <Pressable onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
                                        <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color={colors.text.muted} />
                                    </Pressable>
                                </View>

                                {strength && (
                                    <View style={styles.strengthRow}>
                                        <View style={styles.strengthBar}>
                                            <View style={[styles.strengthFill, { width: password.length < 8 ? '33%' : password.length < 12 ? '66%' : '100%', backgroundColor: strength.color }]} />
                                        </View>
                                        <Text style={[styles.strengthText, { color: strength.color }]}>{strength.text}</Text>
                                    </View>
                                )}

                                <View style={styles.inputContainer}>
                                    <Ionicons name="lock-closed-outline" size={20} color={colors.text.muted} style={styles.inputIcon} />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Confirm Password *"
                                        placeholderTextColor={colors.text.muted}
                                        value={confirmPassword}
                                        onChangeText={setConfirmPassword}
                                        secureTextEntry={!showPassword}
                                        autoCapitalize="none"
                                    />
                                    {confirmPassword.length > 0 && (
                                        <Ionicons
                                            name={password === confirmPassword ? 'checkmark-circle' : 'close-circle'}
                                            size={20}
                                            color={password === confirmPassword ? '#10B981' : '#EF4444'}
                                        />
                                    )}
                                </View>

                                {/* Terms */}
                                <Pressable onPress={() => setAcceptedTerms(!acceptedTerms)} style={styles.termsRow}>
                                    <View style={[styles.checkbox, acceptedTerms && styles.checkboxChecked]}>
                                        {acceptedTerms && <Ionicons name="checkmark" size={14} color="#fff" />}
                                    </View>
                                    <Text style={styles.termsText}>
                                        I agree to the <Text style={styles.termsLink}>Terms of Service</Text> and <Text style={styles.termsLink}>Privacy Policy</Text>
                                    </Text>
                                </Pressable>

                                <AnimatedPressable
                                    onPress={handleRegister}
                                    onPressIn={() => handlePressIn(registerBtnScale)}
                                    onPressOut={() => handlePressOut(registerBtnScale)}
                                    disabled={loading}
                                    style={[styles.registerBtn, { transform: [{ scale: registerBtnScale }] }]}
                                >
                                    <Text style={styles.registerBtnText}>{loading ? 'Creating Account...' : 'Create Account'}</Text>
                                </AnimatedPressable>
                            </View>

                            {/* Login Link */}
                            <View style={styles.footer}>
                                <Text style={styles.footerText}>Already have an account? </Text>
                                <Pressable onPress={() => navigation.navigate('Login')}>
                                    <Text style={styles.footerLink}>Sign In</Text>
                                </Pressable>
                            </View>
                        </Animated.View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    gradient: { flex: 1 },
    container: { flex: 1 },
    keyboardView: { flex: 1 },
    backBtn: { padding: spacing.md, alignSelf: 'flex-start' },
    scroll: { flex: 1 },
    scrollContent: { paddingHorizontal: spacing.xl, paddingBottom: spacing['2xl'] },
    header: { marginBottom: spacing.xl, alignItems: 'center' },
    logo: { width: 100, height: 100, resizeMode: 'contain', borderRadius: 24, marginBottom: spacing.md },
    title: { fontSize: 32, fontWeight: '700', color: colors.text.primary, marginBottom: spacing.xs },
    subtitle: { fontSize: typography.size.base, color: colors.text.secondary },
    form: { marginBottom: spacing.lg },
    inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.background.card, borderRadius: 16, marginBottom: spacing.md, paddingHorizontal: spacing.md },
    inputIcon: { marginRight: spacing.sm },
    input: { flex: 1, paddingVertical: spacing.md, fontSize: typography.size.base, color: colors.text.primary },
    eyeBtn: { padding: spacing.xs },
    strengthRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md, marginTop: -spacing.xs },
    strengthBar: { flex: 1, height: 4, backgroundColor: colors.background.secondary, borderRadius: 2, marginRight: spacing.sm },
    strengthFill: { height: '100%', borderRadius: 2 },
    strengthText: { fontSize: typography.size.xs, fontWeight: '600' },
    termsRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: spacing.lg },
    checkbox: { width: 20, height: 20, borderRadius: 6, borderWidth: 2, borderColor: colors.text.muted, marginRight: spacing.sm, alignItems: 'center', justifyContent: 'center' },
    checkboxChecked: { backgroundColor: colors.primary.teal, borderColor: colors.primary.teal },
    termsText: { flex: 1, fontSize: typography.size.sm, color: colors.text.muted, lineHeight: 20 },
    termsLink: { color: colors.primary.teal, fontWeight: '600' },
    registerBtn: { backgroundColor: colors.primary.teal, paddingVertical: spacing.md, borderRadius: 16, alignItems: 'center' },
    registerBtnText: { fontSize: typography.size.base, fontWeight: '700', color: '#fff' },
    footer: { flexDirection: 'row', justifyContent: 'center', marginTop: spacing.lg },
    footerText: { color: colors.text.muted, fontSize: typography.size.sm },
    footerLink: { color: colors.primary.teal, fontSize: typography.size.sm, fontWeight: '600' },
});

export default RegisterScreen;

// --- End of RegisterScreen.js ---
