// Author: -GLOBENXCC-
// OS support: iOS, Android, Web
// Description: Screen for viewing and managing past journal entries

import React from 'react';
import { StyleSheet, View, Text, FlatList, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { useColors, colors, spacing, typography } from '../theme';
import { useSobrietyStore } from '../store';
import { Card } from '../components/common';

export const JournalHistoryScreen = ({ navigation }) => {
    const themeColors = useColors();
    const { journalEntries, deleteJournalEntry } = useSobrietyStore();

    const handleDelete = (id) => {
        Alert.alert(
            "Delete Entry",
            "Are you sure you want to remove this reflection?",
            [
                { text: "Cancel", style: "cancel" },
                { text: "Delete", style: "destructive", onPress: () => deleteJournalEntry(id) }
            ]
        );
    };

    const renderEntry = ({ item }) => (
        <Card style={styles.entryCard}>
            <View style={styles.entryHeader}>
                <View style={styles.dateBadge}>
                    <Text style={styles.dateText}>
                        {format(new Date(item.createdAt), 'MMM d, yyyy')}
                    </Text>
                    <Text style={styles.timeText}>
                        {format(new Date(item.createdAt), 'h:mm a')}
                    </Text>
                </View>
                <Pressable onPress={() => handleDelete(item.id)} style={styles.deleteButton}>
                    <Ionicons name="trash-outline" size={20} color={colors.status.error} />
                </Pressable>
            </View>
            <Text style={styles.content}>{item.content}</Text>
        </Card>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background.primary }]}>
            <View style={styles.header}>
                <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={themeColors.text.primary} />
                </Pressable>
                <Text style={[styles.title, { color: themeColors.text.primary }]}>Reflections</Text>
                <View style={{ width: 40 }} />
            </View>

            {journalEntries.length === 0 ? (
                <View style={styles.emptyState}>
                    <Ionicons name="book-outline" size={64} color={themeColors.text.muted} />
                    <Text style={[styles.emptyTitle, { color: themeColors.text.primary }]}>Your journal is empty</Text>
                    <Text style={[styles.emptySubtitle, { color: themeColors.text.secondary }]}>
                        Start documenting your journey to see your growth over time.
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={journalEntries}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <Card style={[styles.entryCard, { backgroundColor: themeColors.background.card, borderColor: themeColors.background.secondary }]}>
                            <View style={styles.entryHeader}>
                                <View style={[styles.dateBadge, { backgroundColor: themeColors.background.secondary }]}>
                                    <Text style={[styles.dateText, { color: themeColors.text.primary }]}>
                                        {format(new Date(item.createdAt), 'MMM d, yyyy')}
                                    </Text>
                                    <Text style={[styles.timeText, { color: themeColors.text.muted }]}>
                                        {format(new Date(item.createdAt), 'h:mm a')}
                                    </Text>
                                </View>
                                <Pressable onPress={() => handleDelete(item.id)} style={styles.deleteButton}>
                                    <Ionicons name="trash-outline" size={20} color={themeColors.status.error} />
                                </Pressable>
                            </View>
                            <Text style={[styles.content, { color: themeColors.text.primary }]}>{item.content}</Text>
                        </Card>
                    )}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background.primary,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.md,
        paddingBottom: spacing.sm,
    },
    backButton: {
        padding: spacing.xs,
    },
    title: {
        fontSize: typography.size.lg,
        fontWeight: typography.weight.bold,
        color: colors.text.primary,
        letterSpacing: -0.5,
    },
    listContent: {
        padding: spacing.md,
    },
    entryCard: {
        padding: spacing.lg,
        marginBottom: spacing.md,
        borderRadius: 20,
        backgroundColor: colors.background.card,
        borderWidth: 1,
        borderColor: colors.background.secondary,
    },
    entryHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: spacing.md,
    },
    dateBadge: {
        backgroundColor: colors.background.secondary,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    dateText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: colors.text.primary,
    },
    timeText: {
        fontSize: 10,
        color: colors.text.muted,
        marginTop: 2,
    },
    deleteButton: {
        padding: spacing.xs,
    },
    content: {
        fontSize: 16,
        color: colors.text.primary,
        lineHeight: 24,
    },
    emptyState: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: spacing.xl,
    },
    emptyTitle: {
        fontSize: typography.size.xl,
        fontWeight: typography.weight.bold,
        color: colors.text.primary,
        marginTop: spacing.md,
    },
    emptySubtitle: {
        fontSize: typography.size.base,
        color: colors.text.secondary,
        textAlign: 'center',
        marginTop: spacing.sm,
    },
});

export default JournalHistoryScreen;

// --- End of JournalHistoryScreen.js ---
