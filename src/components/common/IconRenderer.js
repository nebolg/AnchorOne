// Author: -GLOBENXCC-
// OS support: iOS, Android, Web
// Description: Utility component to render icons from different expo-vector-icon libraries

import React from 'react';
import {
    Ionicons,
    MaterialIcons,
    MaterialCommunityIcons,
    FontAwesome,
    FontAwesome5,
    Feather
} from '@expo/vector-icons';

import { StyleSheet, Text } from 'react-native';

export const IconRenderer = ({ library, name, size, color, style }) => {
    // Check if name is a raw emoji
    const isEmoji = name && /\p{Emoji}/u.test(name);

    if (isEmoji) {
        return (
            <Text style={[{ fontSize: size, color: color }, style]}>
                {name}
            </Text>
        );
    }

    const props = { name, size, color, style };

    switch (library) {
        case 'MaterialIcons':
            return <MaterialIcons {...props} />;
        case 'MaterialCommunityIcons':
            return <MaterialCommunityIcons {...props} />;
        case 'FontAwesome':
            return <FontAwesome {...props} />;
        case 'FontAwesome5':
            return <FontAwesome5 {...props} />;
        case 'Feather':
            return <Feather {...props} />;
        case 'Ionicons':
        default:
            return <Ionicons {...props} />;
    }
};

export default IconRenderer;

// --- End of IconRenderer.js ---
