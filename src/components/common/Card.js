// Author: -GLOBENXCC-
// OS support: iOS, Android, Web
// Description: Reusable card component with fade-in animation and press feedback

import React, { useRef, useEffect } from 'react';
import { StyleSheet, View, Pressable, Animated } from 'react-native';
import { useColors, spacing } from '../../theme';
import { TIMING, EASING, SPRING } from '../../utils/animations';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const Card = ({
    children,
    style,
    onPress,
    variant = 'default',
    padding = spacing.cardPadding,
    animated = true,
    delay = 0,
}) => {
    const colors = useColors();
    const fadeAnim = useRef(new Animated.Value(animated ? 0 : 1)).current;
    const slideAnim = useRef(new Animated.Value(animated ? 15 : 0)).current;
    const scaleAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        if (animated) {
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: TIMING.normal,
                    delay,
                    easing: EASING.decelerate,
                    useNativeDriver: true,
                }),
                Animated.timing(slideAnim, {
                    toValue: 0,
                    duration: TIMING.normal,
                    delay,
                    easing: EASING.decelerate,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [animated, delay]);

    const handlePressIn = () => {
        Animated.spring(scaleAnim, {
            toValue: 0.98,
            ...SPRING.stiff,
            useNativeDriver: true,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scaleAnim, {
            toValue: 1,
            ...SPRING.gentle,
            useNativeDriver: true,
        }).start();
    };

    const dynamicCardStyle = {
        backgroundColor: colors.background.card,
        shadowColor: colors.shadow.color,
        shadowOpacity: colors.shadow.opacity,
    };

    const cardStyles = [
        styles.card,
        dynamicCardStyle,
        styles[variant],
        variant === 'flat' && { borderColor: colors.background.secondary },
        { padding },
        style,
    ];

    const animatedStyle = {
        opacity: fadeAnim,
        transform: [
            { translateY: slideAnim },
            { scale: onPress ? scaleAnim : 1 },
        ],
    };

    if (onPress) {
        return (
            <AnimatedPressable
                onPress={onPress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                style={[cardStyles, animatedStyle]}
            >
                {children}
            </AnimatedPressable>
        );
    }

    return (
        <Animated.View style={[cardStyles, animatedStyle]}>
            {children}
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    card: {
        borderRadius: spacing.radius.xl,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 12,
        elevation: 4,
    },
    default: {},
    elevated: {
        shadowOffset: { width: 0, height: 8 },
        shadowRadius: 24,
        elevation: 8,
    },
    flat: {
        shadowOpacity: 0,
        elevation: 0,
        borderWidth: 1,
    },
    gradient: {
        overflow: 'hidden',
    },
});

export default Card;

// --- End of Card.js ---
