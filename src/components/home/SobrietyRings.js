// Author: -GLOBENXCC-
// OS support: iOS, Android, Web
// Description: Circular sobriety rings showing progress per addiction

import React, { useRef } from 'react';
import { StyleSheet, Text, View, Pressable, Animated } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';
import { Card } from '../common';
import { useColors, colors, spacing, typography } from '../../theme';
import { useUserStore, useSobrietyStore } from '../../store';
import { IconRenderer } from '../common/IconRenderer';
import { useNavigation } from '@react-navigation/native';
import { useLiveStreak } from '../../hooks/useLiveStreak';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const RING_SIZE = 160; // Increased for prominence
const STROKE_WIDTH = 12;
const SMALL_RING_SIZE = 50;
const SMALL_STROKE_WIDTH = 6;

const CircularProgress = ({
    size = RING_SIZE,
    strokeWidth = STROKE_WIDTH,
    progress = 0,
    color,
    children,
    bgColor,
}) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
        <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
            <Svg width={size} height={size} style={StyleSheet.absoluteFill}>
                <G rotation="-90" origin={`${size / 2}, ${size / 2}`}>
                    <Circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        stroke={bgColor}
                        strokeWidth={strokeWidth}
                        fill="transparent"
                    />
                    <Circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        stroke={color}
                        strokeWidth={strokeWidth}
                        fill="transparent"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                    />
                </G>
            </Svg>
            {children}
        </View>
    );
};

export const SobrietyRings = ({ style }) => {
    const themeColors = useColors();
    const navigation = useNavigation();
    const { userAddictions } = useUserStore();
    const getStreak = useSobrietyStore(state => state.getStreak);

    // Animation for smooth press
    const scaleAnim = useRef(new Animated.Value(1)).current;

    const handlePressIn = () => {
        Animated.spring(scaleAnim, {
            toValue: 0.97,
            useNativeDriver: true,
            tension: 100,
            friction: 10,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scaleAnim, {
            toValue: 1,
            useNativeDriver: true,
            tension: 100,
            friction: 10,
        }).start();
    };

    // Get the primary addiction (first one) for main ring
    const primaryAddiction = userAddictions[0];
    const primaryStreak = useLiveStreak(primaryAddiction?.id);

    // Secondary addictions for small rings (non-live for performance, they only show days)
    const secondaryAddictions = userAddictions.slice(1, 4);

    // Calculate progress (capped at 100 for 30 day milestone)
    // Use total hours for smoother progress if needed, but days is standard for milestones
    const getProgress = (days) => Math.min((days / 30) * 100, 100);

    const formatTime = (val) => val.toString().padStart(2, '0');

    return (
        <AnimatedPressable
            onPress={() => navigation.navigate('Progress')}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            style={[
                styles.pressableContainer,
                { transform: [{ scale: scaleAnim }] }
            ]}
        >
            <Card style={[styles.card, style, { backgroundColor: themeColors.background.card, borderColor: themeColors.background.secondary }]}>
                <Text style={[styles.heading, { color: themeColors.text.secondary }]}>Your Current Momentum</Text>

                <View style={styles.ringsContainer}>
                    {/* Main ring */}
                    <CircularProgress
                        progress={getProgress(primaryStreak?.days || 0)}
                        color={primaryAddiction ? themeColors.addiction[primaryAddiction.addictionId] || themeColors.primary.teal : themeColors.primary.teal}
                        bgColor={themeColors.text.muted + '30'}
                    >
                        <View style={styles.centerContent}>
                            <Text style={[styles.dayCount, { color: themeColors.text.primary }]}>{primaryStreak?.days || 0}</Text>
                            <Text style={[styles.dayLabel, { color: themeColors.text.muted }]}>Days</Text>
                            {primaryStreak?.isActive && (
                                <Text style={[styles.timer, { color: themeColors.primary.teal }]}>
                                    {formatTime(primaryStreak.hours)}:{formatTime(primaryStreak.minutes)}:{formatTime(primaryStreak.seconds)}
                                </Text>
                            )}
                        </View>
                    </CircularProgress>

                    {/* Secondary rings */}
                    <View style={styles.smallRingsContainer}>
                        {secondaryAddictions.map((addiction) => {
                            const streak = getStreak(addiction.id);
                            return (
                                <View key={addiction.id} style={styles.smallRingWrapper}>
                                    <CircularProgress
                                        size={SMALL_RING_SIZE}
                                        strokeWidth={SMALL_STROKE_WIDTH}
                                        progress={getProgress(streak.days)}
                                        color={themeColors.addiction[addiction.addictionId] || themeColors.primary.violet}
                                        bgColor={themeColors.text.muted + '30'}
                                    >
                                        <IconRenderer
                                            library={addiction.library || 'Ionicons'}
                                            name={addiction.icon}
                                            size={20}
                                            color={themeColors.addiction[addiction.addictionId] || themeColors.primary.violet}
                                        />
                                    </CircularProgress>
                                    <Text style={[styles.smallLabel, { color: themeColors.text.muted }]}>{streak.days}d</Text>
                                </View>
                            );
                        })}
                    </View>
                </View>

                {primaryAddiction && (
                    <View style={[styles.addictionLabelContainer, { backgroundColor: themeColors.background.secondary }]}>
                        <IconRenderer
                            library={primaryAddiction.library || 'Ionicons'}
                            name={primaryAddiction.icon}
                            size={18}
                            color={themeColors.text.secondary}
                        />
                        <Text style={[styles.addictionLabelText, { color: themeColors.text.primary }]}>
                            {primaryAddiction.name}
                        </Text>
                    </View>
                )}
            </Card>
        </AnimatedPressable>
    );
};

const styles = StyleSheet.create({
    pressableContainer: {
        width: '100%',
    },
    card: {
        padding: spacing.xl,
        marginHorizontal: spacing.screenPadding,
        marginVertical: spacing.md,
        alignItems: 'center',
        backgroundColor: colors.background.card,
        borderWidth: 1,
        borderColor: colors.background.secondary,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.03,
        shadowRadius: 10,
        elevation: 2,
    },
    heading: {
        fontSize: typography.size.base,
        fontWeight: typography.weight.bold,
        color: colors.text.secondary,
        marginBottom: spacing.xl,
        textTransform: 'uppercase',
        letterSpacing: 1.2,
    },
    ringsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
    centerContent: {
        alignItems: 'center',
    },
    dayCount: {
        fontSize: 48,
        fontWeight: '900',
        color: colors.text.primary,
        letterSpacing: -1,
    },
    dayLabel: {
        fontSize: 10,
        fontWeight: 'bold',
        color: colors.text.muted,
        textTransform: 'uppercase',
        marginTop: -4,
    },
    timer: {
        fontSize: 12,
        fontWeight: '600',
        color: colors.primary.teal,
        fontVariant: ['tabular-nums'],
        marginTop: 2,
    },
    smallRingsContainer: {
        marginLeft: spacing.xl,
        gap: spacing.md,
    },
    smallRingWrapper: {
        alignItems: 'center',
    },
    smallIcon: {
        fontSize: 18,
    },
    smallLabel: {
        fontSize: 10,
        fontWeight: 'bold',
        color: colors.text.muted,
        marginTop: 4,
    },
    addictionLabelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: spacing.xl,
        backgroundColor: colors.background.secondary,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    addictionLabelText: {
        fontSize: typography.size.xs,
        fontWeight: 'bold',
        color: colors.text.primary,
        marginLeft: spacing.xs,
        textTransform: 'uppercase',
    },
});

export default SobrietyRings;

// --- End of SobrietyRings.js ---
