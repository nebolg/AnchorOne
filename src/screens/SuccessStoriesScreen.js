// Author: -GLOBENXCC-
// OS support: iOS, Android, Web
// Description: Success Stories Screen with curated recovery stories

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Image, Modal, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../components/common';
import { useColors, spacing, typography } from '../theme';
import { useSuccessStoriesStore } from '../store/successStoriesStore';

const ADDICTION_FILTERS = [
    { id: null, label: 'All' },
    { id: 'alcohol', label: 'Alcohol' },
    { id: 'smoking', label: 'Smoking' },
    { id: 'gambling', label: 'Gambling' },
    { id: 'drugs', label: 'Drugs' },
    { id: 'phone/social media', label: 'Digital' },
];

const AVATAR_ICONS = {
    shield: 'shield-checkmark',
    leaf: 'leaf',
    flame: 'flame',
    heart: 'heart',
    'phone-portrait': 'phone-portrait',
};

export const SuccessStoriesScreen = ({ navigation }) => {
    const colors = useColors();
    const {
        getFilteredStories,
        getFeaturedStories,
        filters,
        setFilter,
        saveStory,
        isSaved,
        likeStory,
    } = useSuccessStoriesStore();

    const [selectedStory, setSelectedStory] = useState(null);
    const [showSubmit, setShowSubmit] = useState(false);

    const stories = getFilteredStories();
    const featuredStories = getFeaturedStories();

    const StoryCard = ({ story, isFeatured = false }) => (
        <Pressable
            onPress={() => setSelectedStory(story)}
            style={({ pressed }) => [
                styles.storyCard,
                {
                    backgroundColor: colors.background.card,
                    opacity: pressed ? 0.9 : 1,
                    borderLeftColor: isFeatured ? '#F59E0B' : colors.primary.teal,
                },
            ]}
        >
            <View style={styles.storyHeader}>
                <View style={[styles.storyAvatar, { backgroundColor: colors.primary.teal + '20' }]}>
                    <Ionicons
                        name={AVATAR_ICONS[story.avatar] || 'person'}
                        size={20}
                        color={colors.primary.teal}
                    />
                </View>
                <View style={styles.storyAuthorInfo}>
                    <Text style={[styles.storyAuthor, { color: colors.text.primary }]}>
                        {story.author}
                    </Text>
                    <Text style={[styles.storyMeta, { color: colors.text.muted }]}>
                        {story.cleanDays} days clean • {story.addiction}
                    </Text>
                </View>
                {isFeatured && (
                    <View style={[styles.featuredBadge, { backgroundColor: '#F59E0B' }]}>
                        <Ionicons name="star" size={12} color="#fff" />
                    </View>
                )}
            </View>

            <Text style={[styles.storyTitle, { color: colors.text.primary }]}>{story.title}</Text>
            <Text style={[styles.storyExcerpt, { color: colors.text.secondary }]} numberOfLines={2}>
                {story.excerpt}
            </Text>

            <View style={styles.storyFooter}>
                <View style={styles.storyTags}>
                    {story.tags.slice(0, 2).map((tag, i) => (
                        <View key={i} style={[styles.tag, { backgroundColor: colors.background.secondary }]}>
                            <Text style={[styles.tagText, { color: colors.text.muted }]}>#{tag}</Text>
                        </View>
                    ))}
                </View>
                <View style={styles.storyStats}>
                    <Ionicons name="heart" size={16} color={colors.text.muted} />
                    <Text style={[styles.statsText, { color: colors.text.muted }]}>{story.likes}</Text>
                </View>
            </View>
        </Pressable>
    );

    return (
        <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
            <SafeAreaView edges={['top']} style={styles.safeArea}>
                <View style={[styles.header, { borderBottomColor: colors.border }]}>
                    <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
                    </Pressable>
                    <Text style={[styles.headerTitle, { color: colors.text.primary }]}>Success Stories</Text>
                    <Pressable onPress={() => setShowSubmit(true)} style={styles.addButton}>
                        <Ionicons name="add" size={24} color={colors.primary.teal} />
                    </Pressable>
                </View>

                <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
                    {/* Filter Chips */}
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        style={styles.filterScroll}
                        contentContainerStyle={styles.filterContent}
                    >
                        {ADDICTION_FILTERS.map((filter) => (
                            <Pressable
                                key={filter.id || 'all'}
                                onPress={() => setFilter('addiction', filter.id)}
                                style={[
                                    styles.filterChip,
                                    {
                                        backgroundColor: filters.addiction === filter.id
                                            ? colors.primary.teal
                                            : colors.background.card,
                                    },
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.filterText,
                                        {
                                            color: filters.addiction === filter.id
                                                ? '#fff'
                                                : colors.text.secondary,
                                        },
                                    ]}
                                >
                                    {filter.label}
                                </Text>
                            </Pressable>
                        ))}
                    </ScrollView>

                    {/* Featured Section */}
                    {featuredStories.length > 0 && !filters.addiction && (
                        <>
                            <Text style={[styles.sectionTitle, { color: colors.text.muted }]}>
                                ⭐ Featured Stories
                            </Text>
                            {featuredStories.slice(0, 2).map((story) => (
                                <StoryCard key={story.id} story={story} isFeatured />
                            ))}
                        </>
                    )}

                    {/* All Stories */}
                    <Text style={[styles.sectionTitle, { color: colors.text.muted }]}>
                        All Stories ({stories.length})
                    </Text>
                    {stories.map((story) => (
                        <StoryCard key={story.id} story={story} />
                    ))}

                    {stories.length === 0 && (
                        <View style={styles.emptyState}>
                            <Ionicons name="book-outline" size={48} color={colors.text.muted} />
                            <Text style={[styles.emptyText, { color: colors.text.muted }]}>
                                No stories found for this category
                            </Text>
                        </View>
                    )}

                    <View style={styles.bottomPadding} />
                </ScrollView>
            </SafeAreaView>

            {/* Story Detail Modal */}
            <Modal visible={!!selectedStory} animationType="slide">
                <View style={[styles.modalContainer, { backgroundColor: colors.background.primary }]}>
                    <SafeAreaView edges={['top']} style={styles.safeArea}>
                        <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
                            <Pressable onPress={() => setSelectedStory(null)} style={styles.closeButton}>
                                <Ionicons name="close" size={24} color={colors.text.primary} />
                            </Pressable>
                            <View style={styles.modalActions}>
                                <Pressable
                                    onPress={() => selectedStory && saveStory(selectedStory.id)}
                                    style={styles.actionButton}
                                >
                                    <Ionicons
                                        name={selectedStory && isSaved(selectedStory.id) ? 'bookmark' : 'bookmark-outline'}
                                        size={24}
                                        color={colors.primary.teal}
                                    />
                                </Pressable>
                                <Pressable
                                    onPress={() => selectedStory && likeStory(selectedStory.id)}
                                    style={styles.actionButton}
                                >
                                    <Ionicons name="heart-outline" size={24} color="#EC4899" />
                                </Pressable>
                            </View>
                        </View>

                        <ScrollView style={styles.modalScroll} contentContainerStyle={styles.modalContent}>
                            {selectedStory && (
                                <>
                                    <View style={styles.storyDetailHeader}>
                                        <View style={[styles.detailAvatar, { backgroundColor: colors.primary.teal + '20' }]}>
                                            <Ionicons
                                                name={AVATAR_ICONS[selectedStory.avatar] || 'person'}
                                                size={32}
                                                color={colors.primary.teal}
                                            />
                                        </View>
                                        <View>
                                            <Text style={[styles.detailAuthor, { color: colors.text.primary }]}>
                                                {selectedStory.author}
                                            </Text>
                                            <Text style={[styles.detailMeta, { color: colors.text.muted }]}>
                                                {selectedStory.cleanDays} days clean • {selectedStory.addiction}
                                            </Text>
                                        </View>
                                    </View>

                                    <Text style={[styles.detailTitle, { color: colors.text.primary }]}>
                                        {selectedStory.title}
                                    </Text>

                                    <Text style={[styles.detailContent, { color: colors.text.secondary }]}>
                                        {selectedStory.content}
                                    </Text>

                                    <View style={styles.detailTags}>
                                        {selectedStory.tags.map((tag, i) => (
                                            <View key={i} style={[styles.detailTag, { backgroundColor: colors.background.secondary }]}>
                                                <Text style={[styles.detailTagText, { color: colors.text.muted }]}>#{tag}</Text>
                                            </View>
                                        ))}
                                    </View>

                                    <View style={[styles.encouragement, { backgroundColor: colors.primary.teal + '10', borderColor: colors.primary.teal }]}>
                                        <Ionicons name="heart" size={20} color={colors.primary.teal} />
                                        <Text style={[styles.encouragementText, { color: colors.text.primary }]}>
                                            Every story of recovery is a beacon of hope. If they can do it, so can you.
                                        </Text>
                                    </View>
                                </>
                            )}
                        </ScrollView>
                    </SafeAreaView>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    safeArea: { flex: 1 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.md,
        borderBottomWidth: 1,
    },
    backButton: { padding: spacing.xs },
    headerTitle: { fontSize: typography.size.lg, fontWeight: '700' },
    addButton: { padding: spacing.xs },
    scrollView: { flex: 1 },
    scrollContent: { padding: spacing.md, paddingBottom: 100 },
    filterScroll: { marginBottom: spacing.md },
    filterContent: { gap: spacing.sm },
    filterChip: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: 20 },
    filterText: { fontSize: typography.size.sm, fontWeight: '500' },
    sectionTitle: {
        fontSize: typography.size.sm,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: spacing.sm,
        marginTop: spacing.md,
    },
    storyCard: {
        padding: spacing.md,
        borderRadius: 16,
        marginBottom: spacing.sm,
        borderLeftWidth: 4,
    },
    storyHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm },
    storyAvatar: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
    storyAuthorInfo: { flex: 1, marginLeft: spacing.sm },
    storyAuthor: { fontSize: typography.size.base, fontWeight: '600' },
    storyMeta: { fontSize: typography.size.xs },
    featuredBadge: { padding: 4, borderRadius: 10 },
    storyTitle: { fontSize: typography.size.base, fontWeight: '600', marginBottom: 4 },
    storyExcerpt: { fontSize: typography.size.sm, lineHeight: 20 },
    storyFooter: { flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.sm },
    storyTags: { flexDirection: 'row', gap: spacing.xs },
    tag: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
    tagText: { fontSize: 10 },
    storyStats: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    statsText: { fontSize: typography.size.sm },
    emptyState: { alignItems: 'center', paddingVertical: spacing.xl },
    emptyText: { marginTop: spacing.md, fontSize: typography.size.base },
    bottomPadding: { height: 40 },
    modalContainer: { flex: 1 },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.md,
        borderBottomWidth: 1,
    },
    closeButton: { padding: spacing.xs },
    modalActions: { flexDirection: 'row', gap: spacing.md },
    actionButton: { padding: spacing.xs },
    modalScroll: { flex: 1 },
    modalContent: { padding: spacing.lg, paddingBottom: 100 },
    storyDetailHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.lg },
    detailAvatar: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', marginRight: spacing.md },
    detailAuthor: { fontSize: typography.size.lg, fontWeight: '600' },
    detailMeta: { fontSize: typography.size.sm },
    detailTitle: { fontSize: typography.size.xl, fontWeight: '700', marginBottom: spacing.lg, lineHeight: 28 },
    detailContent: { fontSize: typography.size.base, lineHeight: 26, whiteSpace: 'pre-wrap' },
    detailTags: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.lg },
    detailTag: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
    detailTagText: { fontSize: typography.size.sm },
    encouragement: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
        padding: spacing.md,
        borderRadius: 12,
        marginTop: spacing.xl,
        borderWidth: 1,
    },
    encouragementText: { flex: 1, fontSize: typography.size.sm, lineHeight: 20 },
});

export default SuccessStoriesScreen;

// --- End of SuccessStoriesScreen.js ---
