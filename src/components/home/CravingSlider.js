// Author: -GLOBENXCC-
// OS support: iOS, Android, Web
// Description: Craving intensity slider for logging cravings

import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Slider from '@react-native-community/slider';
import { Card } from '../common';
import { useColors, colors, spacing, typography } from '../../theme';

const CRAVING_LABELS = {
    1: 'None',
    2: 'Mild',
    3: 'Mild',
    4: 'Moderate',
    5: 'Moderate',
    6: 'Strong',
    7: 'Strong',
    8: 'Intense',
    9: 'Intense',
    10: 'Overwhelming',
};

const getColorForIntensity = (intensity) => {
    if (intensity <= 3) return colors.status.success;
    if (intensity <= 5) return colors.status.warning;
    if (intensity <= 7) return '#F97316';
    return colors.status.error;
};

export const CravingSlider = ({ style, onValueChange }) => {
    const themeColors = useColors();
    const [intensity, setIntensity] = useState(1);

    const handleValueChange = (value) => {
        const rounded = Math.round(value);
        setIntensity(rounded);
        onValueChange?.(rounded);
    };

    const sliderColor = getColorForIntensity(intensity);

    return (
        <Card style={[styles.card, style]}>
            <Text style={[styles.question, { color: themeColors.text.primary }]}>Any cravings right now?</Text>

            <View style={styles.sliderContainer}>
                <Slider
                    style={styles.slider}
                    minimumValue={1}
                    maximumValue={10}
                    step={1}
                    value={intensity}
                    onValueChange={handleValueChange}
                    minimumTrackTintColor={sliderColor}
                    maximumTrackTintColor={colors.background.secondary}
                    thumbTintColor={sliderColor}
                />

                <View style={styles.labelsRow}>
                    <Text style={styles.minLabel}>None</Text>
                    <Text style={[styles.intensityValue, { color: sliderColor }]}>
                        {intensity}/10
                    </Text>
                    <Text style={styles.maxLabel}>Max</Text>
                </View>
            </View>

            <Text style={[styles.intensityLabel, { color: sliderColor }]}>
                {CRAVING_LABELS[intensity]}
            </Text>
        </Card>
    );
};

const styles = StyleSheet.create({
    card: {
        padding: spacing.lg,
        marginHorizontal: spacing.screenPadding,
        marginVertical: spacing.sm,
    },
    question: {
        fontSize: typography.size.base,
        fontWeight: typography.weight.medium,
        color: colors.text.primary,
        marginBottom: spacing.md,
        textAlign: 'center',
    },
    sliderContainer: {
        width: '100%',
    },
    slider: {
        width: '100%',
        height: 40,
    },
    labelsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: -spacing.sm,
    },
    minLabel: {
        fontSize: typography.size.xs,
        color: colors.text.muted,
    },
    maxLabel: {
        fontSize: typography.size.xs,
        color: colors.text.muted,
    },
    intensityValue: {
        fontSize: typography.size.lg,
        fontWeight: typography.weight.bold,
    },
    intensityLabel: {
        fontSize: typography.size.sm,
        fontWeight: typography.weight.medium,
        textAlign: 'center',
        marginTop: spacing.sm,
    },
});

export default CravingSlider;

// --- End of CravingSlider.js ---
