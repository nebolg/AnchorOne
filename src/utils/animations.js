// Author: -GLOBENXCC-
// OS support: iOS, Android, Web
// Description: Reusable animation utilities and presets for smooth UI

import { Animated, Easing } from 'react-native';

// Animation timing configurations
export const TIMING = {
    fast: 150,
    normal: 300,
    slow: 500,
    verySlow: 800,
};

// Easing presets
export const EASING = {
    smooth: Easing.bezier(0.4, 0, 0.2, 1),
    bounce: Easing.bezier(0.68, -0.55, 0.265, 1.55),
    decelerate: Easing.out(Easing.cubic),
    accelerate: Easing.in(Easing.cubic),
};

// Spring configurations
export const SPRING = {
    gentle: { tension: 40, friction: 7 },
    wobbly: { tension: 180, friction: 12 },
    stiff: { tension: 210, friction: 20 },
    soft: { tension: 100, friction: 10 },
};

/**
 * Create a fade-in animation
 */
export const fadeIn = (animValue, duration = TIMING.normal, delay = 0) => {
    return Animated.timing(animValue, {
        toValue: 1,
        duration,
        delay,
        easing: EASING.smooth,
        useNativeDriver: true,
    });
};

/**
 * Create a fade-out animation
 */
export const fadeOut = (animValue, duration = TIMING.normal) => {
    return Animated.timing(animValue, {
        toValue: 0,
        duration,
        easing: EASING.smooth,
        useNativeDriver: true,
    });
};

/**
 * Create a slide-up animation
 */
export const slideUp = (animValue, distance = 30, duration = TIMING.normal, delay = 0) => {
    return Animated.timing(animValue, {
        toValue: 0,
        duration,
        delay,
        easing: EASING.decelerate,
        useNativeDriver: true,
    });
};

/**
 * Create a spring animation
 */
export const springTo = (animValue, toValue, config = SPRING.gentle) => {
    return Animated.spring(animValue, {
        toValue,
        ...config,
        useNativeDriver: true,
    });
};

/**
 * Create a scale animation
 */
export const scaleTo = (animValue, toValue, duration = TIMING.fast) => {
    return Animated.timing(animValue, {
        toValue,
        duration,
        easing: EASING.smooth,
        useNativeDriver: true,
    });
};

/**
 * Create a pulse animation (scale up and back)
 */
export const pulse = (animValue, maxScale = 1.1, duration = TIMING.normal) => {
    return Animated.sequence([
        Animated.timing(animValue, {
            toValue: maxScale,
            duration: duration / 2,
            easing: EASING.decelerate,
            useNativeDriver: true,
        }),
        Animated.timing(animValue, {
            toValue: 1,
            duration: duration / 2,
            easing: EASING.accelerate,
            useNativeDriver: true,
        }),
    ]);
};

/**
 * Create a loop animation
 */
export const loop = (animation, iterations = -1) => {
    return Animated.loop(animation, { iterations });
};

/**
 * Staggered entrance animation for lists
 */
export const staggeredEntrance = (animValues, staggerDelay = 50, duration = TIMING.normal) => {
    return Animated.stagger(
        staggerDelay,
        animValues.map((anim, index) =>
            Animated.parallel([
                fadeIn(anim.opacity, duration),
                slideUp(anim.translateY, 20, duration),
            ])
        )
    );
};

/**
 * Create a floating animation (up and down)
 */
export const createFloatingAnimation = (animValue, distance = 10, duration = 2000) => {
    return Animated.loop(
        Animated.sequence([
            Animated.timing(animValue, {
                toValue: -distance,
                duration: duration / 2,
                easing: Easing.inOut(Easing.sin),
                useNativeDriver: true,
            }),
            Animated.timing(animValue, {
                toValue: distance,
                duration: duration / 2,
                easing: Easing.inOut(Easing.sin),
                useNativeDriver: true,
            }),
        ])
    );
};

/**
 * Create a rotation animation
 */
export const rotate = (animValue, duration = 3000) => {
    return Animated.loop(
        Animated.timing(animValue, {
            toValue: 1,
            duration,
            easing: Easing.linear,
            useNativeDriver: true,
        })
    );
};

/**
 * Press feedback animation for buttons
 */
export const pressIn = (scaleAnim) => {
    Animated.spring(scaleAnim, {
        toValue: 0.96,
        ...SPRING.stiff,
        useNativeDriver: true,
    }).start();
};

export const pressOut = (scaleAnim) => {
    Animated.spring(scaleAnim, {
        toValue: 1,
        ...SPRING.gentle,
        useNativeDriver: true,
    }).start();
};

/**
 * Interpolation helpers
 */
export const interpolateRotation = (animValue) =>
    animValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

export const interpolateOpacity = (animValue, from = 0, to = 1) =>
    animValue.interpolate({
        inputRange: [0, 1],
        outputRange: [from, to],
    });

export default {
    TIMING,
    EASING,
    SPRING,
    fadeIn,
    fadeOut,
    slideUp,
    springTo,
    scaleTo,
    pulse,
    loop,
    staggeredEntrance,
    createFloatingAnimation,
    rotate,
    pressIn,
    pressOut,
    interpolateRotation,
    interpolateOpacity,
};

// --- End of animations.js ---
