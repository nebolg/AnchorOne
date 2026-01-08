// Author: -GLOBENXCC-
// OS support: iOS, Android, Web
// Description: Gradient background component using teal-blue-violet colors

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../theme';

export const GradientBackground = ({
    children,
    style,
    colors: customColors,
    start = { x: 0, y: 0 },
    end = { x: 1, y: 1 },
}) => {
    return (
        <LinearGradient
            colors={customColors || colors.gradients.main}
            start={start}
            end={end}
            style={[styles.container, style]}
        >
            {children}
        </LinearGradient>
    );
};

export const SoftGradientBackground = ({ children, style }) => (
    <GradientBackground
        colors={colors.gradients.soft}
        style={style}
    >
        {children}
    </GradientBackground>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

export default GradientBackground;

// --- End of GradientBackground.js ---
