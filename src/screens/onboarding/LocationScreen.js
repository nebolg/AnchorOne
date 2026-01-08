// Author: -GLOBENXCC-
// OS support: iOS, Android, Web
// Description: Enhanced location selection with animations and auto-detect option

import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, Text, Pressable, TextInput, FlatList, Animated, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing, typography } from '../../theme';
import { useUserStore } from '../../store';
import { SUPPORTED_COUNTRIES } from '../../data/crisisResources';
import { TIMING, EASING, SPRING } from '../../utils/animations';
import * as Location from 'expo-location';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const LocationScreen = ({ navigation }) => {
    const { setCountry } = useUserStore();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [detecting, setDetecting] = useState(false);

    // Animation values
    const headerOpacity = useRef(new Animated.Value(0)).current;
    const headerY = useRef(new Animated.Value(20)).current;
    const listOpacity = useRef(new Animated.Value(0)).current;
    const buttonScale = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        // Staggered entrance
        Animated.sequence([
            Animated.parallel([
                Animated.timing(headerOpacity, { toValue: 1, duration: 400, easing: EASING.decelerate, useNativeDriver: true }),
                Animated.timing(headerY, { toValue: 0, duration: 400, easing: EASING.decelerate, useNativeDriver: true }),
            ]),
            Animated.timing(listOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
        ]).start();
    }, []);

    const filteredCountries = SUPPORTED_COUNTRIES.filter(country =>
        country.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSelect = (country) => {
        setSelectedCountry(country);
    };

    const handleDetectLocation = async () => {
        setDetecting(true);
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission Denied', 'Location permission is needed to auto-detect your country.');
                setDetecting(false);
                return;
            }

            // Get location
            const location = await Location.getCurrentPositionAsync({});
            const geocode = await Location.reverseGeocodeAsync({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
            });

            if (geocode && geocode[0]) {
                const isoCountryCode = geocode[0].isoCountryCode;
                const matchedCountry = SUPPORTED_COUNTRIES.find(c => c.code === isoCountryCode);
                if (matchedCountry) {
                    setSelectedCountry(matchedCountry);
                } else {
                    Alert.alert('Detected', `You're in ${geocode[0].country || isoCountryCode}. Please select from the list.`);
                }
            }
        } catch (error) {
            console.error('Location detection error:', error);
            Alert.alert('Error', 'Could not detect your location. Please select manually.');
        } finally {
            setDetecting(false);
        }
    };

    const handleContinue = () => {
        if (selectedCountry) {
            setCountry(selectedCountry.code);
        }
        navigation.navigate('Intent');
    };

    const handleSkip = () => {
        setCountry('OTHER');
        navigation.navigate('Intent');
    };

    const handlePressIn = () => {
        Animated.spring(buttonScale, { toValue: 0.96, ...SPRING.stiff, useNativeDriver: true }).start();
    };

    const handlePressOut = () => {
        Animated.spring(buttonScale, { toValue: 1, ...SPRING.gentle, useNativeDriver: true }).start();
    };

    const renderCountryItem = ({ item, index }) => (
        <Animated.View style={{ opacity: listOpacity }}>
            <Pressable
                onPress={() => handleSelect(item)}
                style={[
                    styles.countryItem,
                    selectedCountry?.code === item.code && styles.countryItemSelected
                ]}
            >
                <Text style={styles.countryFlag}>{item.flag}</Text>
                <Text style={[
                    styles.countryName,
                    selectedCountry?.code === item.code && styles.countryNameSelected
                ]}>
                    {item.name}
                </Text>
                {selectedCountry?.code === item.code && (
                    <Ionicons name="checkmark-circle" size={22} color={colors.primary.teal} />
                )}
            </Pressable>
        </Animated.View>
    );

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={[colors.background.primary, colors.background.secondary]}
                style={StyleSheet.absoluteFill}
            />
            <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
                {/* Header */}
                <View style={styles.header}>
                    <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
                        <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
                    </Pressable>
                    <Pressable onPress={handleSkip}>
                        <Text style={styles.skipText}>Skip</Text>
                    </Pressable>
                </View>

                {/* Title Section */}
                <Animated.View style={[
                    styles.titleSection,
                    { opacity: headerOpacity, transform: [{ translateY: headerY }] }
                ]}>
                    <View style={styles.iconBox}>
                        <Ionicons name="location" size={32} color={colors.primary.teal} />
                    </View>
                    <Text style={styles.title}>Where are you based?</Text>
                    <Text style={styles.subtitle}>
                        This helps us show you local crisis hotlines and support resources.
                    </Text>
                </Animated.View>

                {/* Auto-detect Button */}
                <Animated.View style={[styles.detectContainer, { opacity: listOpacity }]}>
                    <Pressable onPress={handleDetectLocation} style={styles.detectBtn} disabled={detecting}>
                        <Ionicons name={detecting ? 'sync' : 'navigate'} size={18} color={colors.primary.teal} />
                        <Text style={styles.detectText}>
                            {detecting ? 'Detecting...' : 'Auto-detect my location'}
                        </Text>
                    </Pressable>
                </Animated.View>

                {/* Search */}
                <Animated.View style={[styles.searchContainer, { opacity: listOpacity }]}>
                    <Ionicons name="search" size={18} color={colors.text.muted} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search country..."
                        placeholderTextColor={colors.text.muted}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </Animated.View>

                {/* Country List */}
                <FlatList
                    data={filteredCountries}
                    keyExtractor={(item) => item.code}
                    style={styles.list}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    renderItem={renderCountryItem}
                />

                {/* Privacy Info */}
                <View style={styles.infoBox}>
                    <Ionicons name="shield-checkmark" size={16} color={colors.primary.teal} />
                    <Text style={styles.infoText}>
                        Your location is never shared or tracked. It's only used to show relevant support resources.
                    </Text>
                </View>

                {/* Continue Button */}
                <AnimatedPressable
                    onPress={handleContinue}
                    onPressIn={handlePressIn}
                    onPressOut={handlePressOut}
                    disabled={!selectedCountry}
                    style={[
                        styles.continueBtn,
                        !selectedCountry && styles.continueBtnDisabled,
                        { transform: [{ scale: buttonScale }] }
                    ]}
                >
                    <Text style={[
                        styles.continueBtnText,
                        !selectedCountry && styles.continueBtnTextDisabled
                    ]}>
                        Continue
                    </Text>
                    <Ionicons
                        name="arrow-forward"
                        size={20}
                        color={selectedCountry ? colors.text.inverse : colors.text.muted}
                    />
                </AnimatedPressable>
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
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
    },
    backBtn: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    skipText: {
        fontSize: typography.size.sm,
        color: colors.text.muted,
        fontWeight: '600',
    },
    titleSection: {
        alignItems: 'center',
        paddingHorizontal: spacing.xl,
        marginBottom: spacing.md,
    },
    iconBox: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: colors.primary.teal + '15',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.md,
    },
    title: {
        fontSize: typography.size['2xl'],
        fontWeight: typography.weight.bold,
        color: colors.text.primary,
        textAlign: 'center',
        marginBottom: spacing.xs,
    },
    subtitle: {
        fontSize: typography.size.sm,
        color: colors.text.secondary,
        textAlign: 'center',
        lineHeight: 22,
    },
    detectContainer: {
        paddingHorizontal: spacing.md,
        marginBottom: spacing.md,
    },
    detectBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.primary.teal + '15',
        paddingVertical: spacing.sm,
        borderRadius: spacing.radius.lg,
        gap: spacing.xs,
    },
    detectText: {
        fontSize: typography.size.sm,
        fontWeight: '600',
        color: colors.primary.teal,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.background.card,
        marginHorizontal: spacing.md,
        paddingHorizontal: spacing.md,
        borderRadius: spacing.radius.lg,
        marginBottom: spacing.md,
    },
    searchInput: {
        flex: 1,
        paddingVertical: spacing.sm,
        paddingLeft: spacing.sm,
        fontSize: typography.size.base,
        color: colors.text.primary,
    },
    list: {
        flex: 1,
    },
    listContent: {
        paddingHorizontal: spacing.md,
    },
    countryItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.background.card,
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.md,
        borderRadius: spacing.radius.lg,
        marginBottom: spacing.xs,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    countryItemSelected: {
        borderColor: colors.primary.teal,
        backgroundColor: colors.primary.teal + '15',
    },
    countryFlag: {
        fontSize: 28,
        marginRight: spacing.md,
    },
    countryName: {
        flex: 1,
        fontSize: typography.size.base,
        fontWeight: '500',
        color: colors.text.primary,
    },
    countryNameSelected: {
        color: colors.primary.teal,
        fontWeight: '700',
    },
    infoBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.primary.teal + '10',
        marginHorizontal: spacing.md,
        padding: spacing.md,
        borderRadius: spacing.radius.lg,
        marginBottom: spacing.md,
        gap: spacing.sm,
    },
    infoText: {
        flex: 1,
        fontSize: 12,
        color: colors.text.secondary,
        lineHeight: 18,
    },
    continueBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.primary.teal,
        marginHorizontal: spacing.md,
        paddingVertical: spacing.md,
        borderRadius: spacing.radius.xl,
        gap: spacing.xs,
    },
    continueBtnDisabled: {
        backgroundColor: colors.background.secondary,
    },
    continueBtnText: {
        fontSize: typography.size.base,
        fontWeight: '700',
        color: colors.text.inverse,
    },
    continueBtnTextDisabled: {
        color: colors.text.muted,
    },
});

export default LocationScreen;

// --- End of LocationScreen.js ---
