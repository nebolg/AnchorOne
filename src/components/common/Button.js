// Author: -GLOBENXCC-
// OS support: iOS, Android, Web
// Description: Button component with smooth spring animations

import React, { useRef } from 'react';
import { StyleSheet, Text, Pressable, ActivityIndicator, View, Animated } from 'react-native';
import { useColors, colors, spacing, typography } from '../../theme';
import { SPRING } from '../../utils/animations';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const Button = ({
    title,
    onPress,
    variant = 'primary',
    size = 'medium',
    disabled = false,
    loading = false,
    icon,
    style,
}) => {
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const buttonSize = sizes[size];

    const handlePressIn = () => {
        Animated.spring(scaleAnim, {
            toValue: 0.96,
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

    const content = (
        <View style={styles.content}>
            {loading ? (
                <ActivityIndicator
                    color={variant === 'outline' ? colors.primary.teal : colors.text.inverse}
                    size="small"
                />
            ) : (
                <>
                    {icon && <View style={styles.iconContainer}>{icon}</View>}
                    <Text style={[
                        styles.text,
                        buttonSize.text,
                        variant === 'outline' && styles.outlineText,
                        variant === 'secondary' && styles.secondaryText,
                        disabled && styles.disabledText,
                    ]}>
                        {title}
                    </Text>
                </>
            )}
        </View>
    );

    return (
        <AnimatedPressable
            onPress={onPress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            disabled={disabled || loading}
            style={[
                styles.button,
                buttonSize.button,
                styles[variant],
                disabled && styles.disabled,
                { transform: [{ scale: scaleAnim }] },
                style,
            ]}
        >
            {content}
        </AnimatedPressable>
    );
};

const sizes = {
    small: {
        button: {
            paddingVertical: spacing[2],
            paddingHorizontal: spacing[4],
            borderRadius: spacing.radius.md,
        },
        text: {
            fontSize: typography.size.sm,
        },
    },
    medium: {
        button: {
            paddingVertical: spacing[3],
            paddingHorizontal: spacing[6],
            borderRadius: spacing.radius.lg,
        },
        text: {
            fontSize: typography.size.base,
        },
    },
    large: {
        button: {
            paddingVertical: spacing[4],
            paddingHorizontal: spacing[8],
            borderRadius: spacing.radius.xl,
        },
        text: {
            fontSize: typography.size.lg,
        },
    },
};

const styles = StyleSheet.create({
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconContainer: {
        marginRight: spacing[2],
    },
    text: {
        color: colors.text.inverse,
        fontWeight: typography.weight.semibold,
        textAlign: 'center',
    },
    primary: {
        backgroundColor: colors.primary.teal,
        shadowColor: colors.primary.teal,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    secondary: {
        backgroundColor: colors.background.secondary,
    },
    secondaryText: {
        color: colors.text.primary,
    },
    outline: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: colors.primary.teal,
    },
    outlineText: {
        color: colors.primary.teal,
    },
    disabled: {
        backgroundColor: colors.background.secondary,
        opacity: 0.6,
    },
    disabledText: {
        color: colors.text.muted,
    },
});

export default Button;

// --- End of Button.js ---
