// Author: -GLOBENXCC-
// OS support: iOS, Android, Web
// Description: Login screen with email/password and Google sign-in

import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, Pressable, Animated, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../../theme';
import { useUserStore } from '../../store';
import { TIMING, EASING, SPRING } from '../../utils/animations';
import * as Google from 'expo-auth-session/providers/google';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import api from '../../services/api';

WebBrowser.maybeCompleteAuthSession();

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const { setUser, setUsername, syncProfileFromBackend } = useUserStore();

    // Animations
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(30)).current;
    const loginBtnScale = useRef(new Animated.Value(1)).current;
    const googleBtnScale = useRef(new Animated.Value(1)).current;

    const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
        clientId: '2909982316-ab5d0rdfoshmnls2kq7i6h6r10sg2aek.apps.googleusercontent.com',
        webClientId: '2909982316-ab5d0rdfoshmnls2kq7i6h6r10sg2aek.apps.googleusercontent.com',
        redirectUri: AuthSession.makeRedirectUri({ useProxy: true }),
    });

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
            Animated.timing(slideAnim, { toValue: 0, duration: 500, easing: EASING.decelerate, useNativeDriver: true }),
        ]).start();
    }, []);

    useEffect(() => {
        if (response?.type === 'success') {
            handleGoogleSuccess(response.params.id_token);
        }
    }, [response]);

    const handleGoogleSuccess = async (idToken) => {
        setLoading(true);
        try {
            const data = await api.loginWithGoogle(idToken);
            await api.setAuthToken(data.token);
            setUser(data.user.id, data.user.username, data.user.anonymous);
            await syncProfileFromBackend();
            navigation.replace('Main');
        } catch (error) {
            Alert.alert('Error', error.message || 'Google sign-in failed');
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please enter email and password');
            return;
        }

        setLoading(true);
        try {
            const data = await api.login(email, password);
            await api.setAuthToken(data.token);
            setUser(data.user.id, data.user.username, data.user.anonymous);
            await syncProfileFromBackend();
            navigation.replace('Main');
        } catch (error) {
            Alert.alert('Error', error.message || 'Login failed');
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

    return (
        <LinearGradient colors={[colors.background.primary, colors.background.secondary]} style={styles.gradient}>
            <SafeAreaView style={styles.container}>
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardView}>
                    {/* Back Button */}
                    <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
                        <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
                    </Pressable>

                    <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
                        {/* Header */}
                        <View style={styles.header}>
                            <Text style={styles.title}>Welcome Back</Text>
                            <Text style={styles.subtitle}>Sign in to continue your journey</Text>
                        </View>

                        {/* Form */}
                        <View style={styles.form}>
                            <View style={styles.inputContainer}>
                                <Ionicons name="mail-outline" size={20} color={colors.text.muted} style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Email"
                                    placeholderTextColor={colors.text.muted}
                                    value={email}
                                    onChangeText={setEmail}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    autoComplete="email"
                                />
                            </View>

                            <View style={styles.inputContainer}>
                                <Ionicons name="lock-closed-outline" size={20} color={colors.text.muted} style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Password"
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

                            <AnimatedPressable
                                onPress={handleLogin}
                                onPressIn={() => handlePressIn(loginBtnScale)}
                                onPressOut={() => handlePressOut(loginBtnScale)}
                                disabled={loading}
                                style={[styles.loginBtn, { transform: [{ scale: loginBtnScale }] }]}
                            >
                                <Text style={styles.loginBtnText}>{loading ? 'Signing in...' : 'Sign In'}</Text>
                            </AnimatedPressable>
                        </View>

                        {/* Divider */}
                        <View style={styles.divider}>
                            <View style={styles.dividerLine} />
                            <Text style={styles.dividerText}>or</Text>
                            <View style={styles.dividerLine} />
                        </View>

                        {/* Google Sign In */}
                        <AnimatedPressable
                            onPress={() => promptAsync()}
                            onPressIn={() => handlePressIn(googleBtnScale)}
                            onPressOut={() => handlePressOut(googleBtnScale)}
                            disabled={loading}
                            style={[styles.googleBtn, { transform: [{ scale: googleBtnScale }] }]}
                        >
                            <Ionicons name="logo-google" size={20} color="#fff" />
                            <Text style={styles.googleBtnText}>Continue with Google</Text>
                        </AnimatedPressable>

                        {/* Register Link */}
                        <View style={styles.footer}>
                            <Text style={styles.footerText}>Don't have an account? </Text>
                            <Pressable onPress={() => navigation.navigate('Register')}>
                                <Text style={styles.footerLink}>Sign Up</Text>
                            </Pressable>
                        </View>

                        {/* Guest Option */}
                        <Pressable onPress={() => navigation.navigate('AddictionSelect')} style={styles.guestLink}>
                            <Text style={styles.guestText}>Continue as Guest</Text>
                        </Pressable>
                    </Animated.View>
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
    content: { flex: 1, paddingHorizontal: spacing.xl, justifyContent: 'center' },
    header: { marginBottom: spacing['2xl'] },
    title: { fontSize: 32, fontWeight: '700', color: colors.text.primary, marginBottom: spacing.xs },
    subtitle: { fontSize: typography.size.base, color: colors.text.secondary },
    form: { marginBottom: spacing.xl },
    inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.background.card, borderRadius: 16, marginBottom: spacing.md, paddingHorizontal: spacing.md },
    inputIcon: { marginRight: spacing.sm },
    input: { flex: 1, paddingVertical: spacing.md, fontSize: typography.size.base, color: colors.text.primary },
    eyeBtn: { padding: spacing.xs },
    loginBtn: { backgroundColor: colors.primary.teal, paddingVertical: spacing.md, borderRadius: 16, alignItems: 'center', marginTop: spacing.sm },
    loginBtnText: { fontSize: typography.size.base, fontWeight: '700', color: '#fff' },
    divider: { flexDirection: 'row', alignItems: 'center', marginVertical: spacing.lg },
    dividerLine: { flex: 1, height: 1, backgroundColor: colors.background.secondary },
    dividerText: { paddingHorizontal: spacing.md, color: colors.text.muted, fontSize: typography.size.sm },
    googleBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#4285F4', paddingVertical: spacing.md, borderRadius: 16, gap: spacing.sm },
    googleBtnText: { fontSize: typography.size.base, fontWeight: '600', color: '#fff' },
    footer: { flexDirection: 'row', justifyContent: 'center', marginTop: spacing.xl },
    footerText: { color: colors.text.muted, fontSize: typography.size.sm },
    footerLink: { color: colors.primary.teal, fontSize: typography.size.sm, fontWeight: '600' },
    guestLink: { alignItems: 'center', marginTop: spacing.lg },
    guestText: { color: colors.text.muted, fontSize: typography.size.sm, textDecorationLine: 'underline' },
});

export default LoginScreen;

// --- End of LoginScreen.js ---
