// Author: -GLOBENXCC-
// OS support: Web
// Description: Placeholder component for future AdSense integration

import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { useColors, spacing } from '../../theme';

// Configuration - Set to true when AdSense is ready
const AD_CONFIG = {
    enabled: false,
    adClient: '', // Your AdSense client ID: ca-pub-XXXXXXXXXXXXXXXX
    adSlot: '', // Your ad slot ID
};

export const AdPlaceholder = ({
    position = 'footer', // 'footer' | 'sidebar' | 'banner'
    showPlaceholder = false, // Set to true during development to see placement
}) => {
    const colors = useColors();

    // If ads are disabled and placeholder is hidden, render nothing
    if (!AD_CONFIG.enabled && !showPlaceholder) {
        return null;
    }

    // If ads are enabled, render the actual AdSense code
    if (AD_CONFIG.enabled) {
        return (
            <View style={[styles.container, styles[position]]}>
                {/* AdSense will be inserted here via script injection */}
                <ins
                    className="adsbygoogle"
                    style={{ display: 'block' }}
                    data-ad-client={AD_CONFIG.adClient}
                    data-ad-slot={AD_CONFIG.adSlot}
                    data-ad-format="auto"
                    data-full-width-responsive="true"
                />
            </View>
        );
    }

    // Development placeholder
    return (
        <View
            style={[
                styles.container,
                styles[position],
                styles.placeholder,
                { borderColor: colors.border, backgroundColor: colors.background.card }
            ]}
        >
            <Text style={[styles.placeholderText, { color: colors.text.muted }]}>
                Ad Placeholder ({position})
            </Text>
            <Text style={[styles.placeholderNote, { color: colors.text.muted }]}>
                Enable in AdPlaceholder.js when AdSense is ready
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    footer: {
        marginTop: spacing.lg,
        marginBottom: spacing.md,
        minHeight: 90,
    },
    sidebar: {
        marginVertical: spacing.md,
        minHeight: 250,
    },
    banner: {
        marginVertical: spacing.sm,
        minHeight: 50,
    },
    placeholder: {
        borderWidth: 1,
        borderStyle: 'dashed',
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing.md,
    },
    placeholderText: {
        fontSize: 12,
        fontWeight: '500',
    },
    placeholderNote: {
        fontSize: 10,
        marginTop: 4,
    },
});

export default AdPlaceholder;

// --- End of AdPlaceholder.js ---
