// Author: -GLOBENXCC-
// OS support: iOS, Android, Web
// Description: Premium Welcome screen with smooth animations and polished UI

import React, { useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Image, Animated, Dimensions, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing, typography } from '../../theme';
import { Ionicons } from '@expo/vector-icons';
import * as Google from 'expo-auth-session/providers/google';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { useUserStore } from '../../store';
import { TIMING, EASING, SPRING, createFloatingAnimation } from '../../utils/animations';

WebBrowser.maybeCompleteAuthSession();

const { width, height } = Dimensions.get('window');
const LOGO = require('../../../assets/logo.png');

const FEATURES = [
    { icon: 'shield-checkmark', label: 'Private', color: '#10B981' },
    { icon: 'people', label: 'Community', color: '#8B5CF6' },
    { icon: 'stats-chart', label: 'Progress', color: '#3B82F6' },
    { icon: 'heart', label: 'Support', color: '#EC4899' },
];

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const WelcomeScreen = ({ navigation }) => {
    // Animation values
    const logoOpacity = useRef(new Animated.Value(0)).current;
    const logoScale = useRef(new Animated.Value(0.8)).current;
    const taglineOpacity = useRef(new Animated.Value(0)).current;
    const taglineY = useRef(new Animated.Value(20)).current;
    const subtaglineOpacity = useRef(new Animated.Value(0)).current;
    const featuresOpacity = useRef(new Animated.Value(0)).current;
    const featuresY = useRef(new Animated.Value(30)).current;
    const buttonsOpacity = useRef(new Animated.Value(0)).current;
    const buttonsY = useRef(new Animated.Value(40)).current;
    const floatAnim = useRef(new Animated.Value(0)).current;
    const pulseAnim = useRef(new Animated.Value(1)).current;
    const googleScale = useRef(new Animated.Value(1)).current;
    const guestScale = useRef(new Animated.Value(1)).current;

    const loginWithGoogle = useUserStore(state => state.loginWithGoogle);

    const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
        clientId: '2909982316-ab5d0rdfoshmnls2kq7i6h6r10sg2aek.apps.googleusercontent.com',
        webClientId: '2909982316-ab5d0rdfoshmnls2kq7i6h6r10sg2aek.apps.googleusercontent.com',
        iosClientId: '2909982316-ab5d0rdfoshmnls2kq7i6h6r10sg2aek.apps.googleusercontent.com',
        androidClientId: '2909982316-ab5d0rdfoshmnls2kq7i6h6r10sg2aek.apps.googleusercontent.com',
        redirectUri: AuthSession.makeRedirectUri({
            native: 'https://auth.expo.io/@beneb/anchorone',
            useProxy: true,
        }),
    });

    useEffect(() => {
        // Staggered entrance animations
        Animated.sequence([
            // Logo entrance
            Animated.parallel([
                Animated.timing(logoOpacity, {
                    toValue: 1,
                    duration: 600,
                    easing: EASING.decelerate,
                    useNativeDriver: true,
                }),
                Animated.spring(logoScale, {
                    toValue: 1,
                    ...SPRING.gentle,
                    useNativeDriver: true,
                }),
            ]),
            // Tagline
            Animated.parallel([
                Animated.timing(taglineOpacity, {
                    toValue: 1,
                    duration: 400,
                    useNativeDriver: true,
                }),
                Animated.timing(taglineY, {
                    toValue: 0,
                    duration: 400,
                    easing: EASING.decelerate,
                    useNativeDriver: true,
                }),
            ]),
            // Subtagline
            Animated.timing(subtaglineOpacity, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }),
            // Features
            Animated.parallel([
                Animated.timing(featuresOpacity, {
                    toValue: 1,
                    duration: 400,
                    useNativeDriver: true,
                }),
                Animated.timing(featuresY, {
                    toValue: 0,
                    duration: 400,
                    easing: EASING.decelerate,
                    useNativeDriver: true,
                }),
            ]),
            // Buttons
            Animated.parallel([
                Animated.timing(buttonsOpacity, {
                    toValue: 1,
                    duration: 400,
                    useNativeDriver: true,
                }),
                Animated.timing(buttonsY, {
                    toValue: 0,
                    duration: 400,
                    easing: EASING.decelerate,
                    useNativeDriver: true,
                }),
            ]),
        ]).start();

        // Start floating animation
        createFloatingAnimation(floatAnim, 8, 3000).start();

        // Pulse animation for accent
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1.1,
                    duration: 1500,
                    easing: EASING.smooth,
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 1500,
                    easing: EASING.smooth,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, []);

    useEffect(() => {
        if (response?.type === 'success') {
            const { id_token } = response.params;
            handleGoogleSuccess(id_token);
        }
    }, [response]);

    const handleGoogleSuccess = async (idToken) => {
        try {
            await loginWithGoogle(idToken);
            navigation.navigate('AddictionSelect');
        } catch (error) {
            console.error('Google Auth Failed:', error);
        }
    };

    const handlePressIn = (scaleAnim) => {
        Animated.spring(scaleAnim, {
            toValue: 0.95,
            ...SPRING.stiff,
            useNativeDriver: true,
        }).start();
    };

    const handlePressOut = (scaleAnim) => {
        Animated.spring(scaleAnim, {
            toValue: 1,
            ...SPRING.gentle,
            useNativeDriver: true,
        }).start();
    };

    return (
        <LinearGradient
            colors={[colors.background.primary, colors.background.secondary]}
            style={styles.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
        >
            {/* Animated Background Orbs */}
            <Animated.View style={[styles.orb, styles.orb1, { transform: [{ translateY: floatAnim }] }]} />
            <Animated.View style={[styles.orb, styles.orb2, { transform: [{ scale: pulseAnim }] }]} />
            <Animated.View style={[styles.orb, styles.orb3]} />

            <SafeAreaView style={styles.container}>
                <View style={styles.content}>
                    {/* Logo Section */}
                    <Animated.View style={[
                        styles.logoSection,
                        {
                            opacity: logoOpacity,
                            transform: [{ scale: logoScale }, { translateY: floatAnim }]
                        }
                    ]}>
                        <Image source={LOGO} style={styles.logo} />
                    </Animated.View>

                    {/* Tagline */}
                    <Animated.View style={[
                        styles.taglineSection,
                        { opacity: taglineOpacity, transform: [{ translateY: taglineY }] }
                    ]}>
                        <Text style={styles.tagline}>Welcome to</Text>
                        <Text style={styles.taglineHighlight}>AnchorOne</Text>
                    </Animated.View>

                    {/* Subtagline */}
                    <Animated.Text style={[styles.subtagline, { opacity: subtaglineOpacity }]}>
                        This is a space for honesty, progress, and support.{"\n"}No judgment. No pressure. Just one day at a time.
                    </Animated.Text>

                    {/* Features */}
                    <Animated.View style={[
                        styles.featuresRow,
                        { opacity: featuresOpacity, transform: [{ translateY: featuresY }] }
                    ]}>
                        {FEATURES.map((feature, index) => (
                            <View key={feature.label} style={styles.featureItem}>
                                <View style={[styles.featureIcon, { backgroundColor: feature.color + '20' }]}>
                                    <Ionicons name={feature.icon} size={22} color={feature.color} />
                                </View>
                                <Text style={styles.featureLabel}>{feature.label}</Text>
                            </View>
                        ))}
                    </Animated.View>
                </View>

                {/* Action Buttons */}
                <Animated.View style={[
                    styles.actionSection,
                    { opacity: buttonsOpacity, transform: [{ translateY: buttonsY }] }
                ]}>
                    <AnimatedPressable
                        style={[styles.googleButton, { transform: [{ scale: googleScale }] }]}
                        onPressIn={() => handlePressIn(googleScale)}
                        onPressOut={() => handlePressOut(googleScale)}
                        onPress={() => promptAsync()}
                    >
                        <View style={styles.googleIconWrap}>
                            <Ionicons name="logo-google" size={20} color="#fff" />
                        </View>
                        <Text style={styles.googleButtonText}>Continue with Google</Text>
                    </AnimatedPressable>

                    <AnimatedPressable
                        style={[styles.guestButton, { transform: [{ scale: guestScale }] }]}
                        onPressIn={() => handlePressIn(guestScale)}
                        onPressOut={() => handlePressOut(guestScale)}
                        onPress={() => navigation.navigate('AddictionSelect')}
                    >
                        <Text style={styles.guestButtonText}>Get started</Text>
                        <Ionicons name="arrow-forward" size={18} color={colors.primary.teal} />
                    </AnimatedPressable>

                    <Text style={styles.disclaimer}>
                        By continuing, you agree to our{' '}
                        <Text style={styles.link}>Terms</Text> and{' '}
                        <Text style={styles.link}>Privacy Policy</Text>
                    </Text>
                </Animated.View>
            </SafeAreaView>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    gradient: {
        flex: 1,
    },
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: spacing.xl,
    },
    orb: {
        position: 'absolute',
        borderRadius: 999,
    },
    orb1: {
        width: 300,
        height: 300,
        backgroundColor: colors.primary.teal + '15',
        top: -100,
        left: -100,
    },
    orb2: {
        width: 200,
        height: 200,
        backgroundColor: colors.primary.violet + '12',
        top: height * 0.3,
        right: -80,
    },
    orb3: {
        width: 250,
        height: 250,
        backgroundColor: colors.primary.blue + '10',
        bottom: -50,
        left: -80,
    },
    logoSection: {
        alignItems: 'center',
        marginBottom: spacing.xl,
    },
    logo: {
        width: 140,
        height: 140,
        resizeMode: 'contain',
        borderRadius: 32,
    },
    taglineSection: {
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    tagline: {
        fontSize: 32,
        fontWeight: '300',
        color: colors.text.secondary,
        letterSpacing: -0.5,
    },
    taglineHighlight: {
        fontSize: 42,
        fontWeight: '700',
        color: colors.primary.teal,
        letterSpacing: -1,
        marginTop: -4,
    },
    subtagline: {
        fontSize: 16,
        color: colors.text.muted,
        textAlign: 'center',
        lineHeight: 24,
        paddingHorizontal: spacing.xl,
        marginBottom: spacing['2xl'],
    },
    featuresRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: spacing.lg,
        flexWrap: 'wrap',
    },
    featureItem: {
        alignItems: 'center',
        width: 70,
    },
    featureIcon: {
        width: 50,
        height: 50,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.xs,
    },
    featureLabel: {
        fontSize: 11,
        fontWeight: '600',
        color: colors.text.muted,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    actionSection: {
        paddingHorizontal: spacing.xl,
        paddingBottom: spacing['2xl'],
    },
    googleButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 56,
        borderRadius: 16,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 5,
    },
    googleIconWrap: {
        width: 28,
        height: 28,
        borderRadius: 8,
        backgroundColor: '#4285F4',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.sm,
    },
    googleButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1F2937',
    },
    guestButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 56,
        borderRadius: 16,
        backgroundColor: 'transparent',
        borderWidth: 1.5,
        borderColor: colors.primary.teal + '50',
        marginTop: spacing.md,
        gap: spacing.xs,
    },
    guestButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.primary.teal,
    },
    disclaimer: {
        fontSize: 12,
        color: colors.text.muted,
        textAlign: 'center',
        marginTop: spacing.xl,
        lineHeight: 18,
    },
    link: {
        color: colors.primary.teal,
        fontWeight: '600',
    },
});

export default WelcomeScreen;

// --- End of WelcomeScreen.js ---
