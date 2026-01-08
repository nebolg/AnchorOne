// Author: -GLOBENXCC-
// OS support: iOS, Android, Web
// Description: Modern Anonymous community feed with real-time API integration

import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, FlatList, View, Text, Pressable, TextInput, Modal, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, Button } from '../components/common';
import { useColors, colors, spacing, typography, lightColors as defaultColors } from '../theme';
import { useUserStore, useCommunityStore } from '../store';
import { formatDistanceToNow } from 'date-fns';

const FILTERS = [
    { id: 'all', label: 'All Feed' },
    { id: 'alcohol', label: 'Alcohol' },
    { id: 'cigarettes', label: 'Nicotine' },
    { id: 'porn', label: 'Porn' },
    { id: 'motivation', label: 'Inspiration' },
];

const REACTIONS = [
    { type: 'hear_you', icon: 'heart', label: 'Support', color: defaultColors.status.error },
    { type: 'stay_strong', icon: 'shield-checkmark', label: 'Strong', color: defaultColors.primary.blue },
    { type: 'proud', icon: 'ribbon', label: 'Proud', color: defaultColors.status.warning },
];

const PostCard = ({ post, onReact, onComment, onProfile, userReactions, currentUserId, onEdit, onDelete, colors }) => {
    let timeAgo = 'recently';
    try {
        if (post.createdAt) {
            timeAgo = formatDistanceToNow(new Date(post.createdAt), { addSuffix: true });
        }
    } catch (e) {
        console.warn('Invalid date in post:', post.createdAt);
    }
    const postReactions = userReactions[post.id] || [];
    const isOwner = currentUserId && post.user_id === currentUserId;

    return (
        <Card style={styles.postCard}>
            <Pressable
                onPress={() => onComment(post.id)}
                style={({ pressed }) => [
                    pressed && { opacity: 0.7, transform: [{ scale: 0.995 }] }
                ]}
            >
                <View style={styles.postHeader}>
                    <Pressable
                        onPress={(e) => {
                            e.stopPropagation();
                            onProfile(post.user_id, post.username);
                        }}
                        style={[styles.avatar, { backgroundColor: (post.avatar_color || colors.background.secondary) + '30', borderColor: post.avatar_color || 'transparent', borderWidth: post.avatar_color ? 1 : 0 }]}
                    >
                        <Ionicons
                            name={post.avatar_id || "person"}
                            size={post.avatar_id ? 20 : 18}
                            color={post.avatar_color || colors.text.muted}
                        />
                    </Pressable>
                    <Pressable
                        onPress={(e) => {
                            e.stopPropagation();
                            onProfile(post.user_id, post.username);
                        }}
                        style={styles.postMeta}
                    >
                        <Text style={[styles.username, { color: colors.text.primary }]}>{post.anonymous ? 'Anonymous Traveler' : `@${post.username || 'user'}`}</Text>
                        <Text style={[styles.timeAgo, { color: colors.text.muted }]}>
                            {post.addictionName ? `${post.addictionName} • ` : ''}{timeAgo}
                        </Text>
                    </Pressable>
                    {post.postType === 'milestone' && (
                        <View style={[styles.milestoneBadge, { backgroundColor: colors.status.warning + '15' }]}>
                            <Ionicons name="trophy" size={12} color={colors.status.warning} style={{ marginRight: 4 }} />
                            <Text style={[styles.milestoneText, { color: colors.status.warning }]}>Milestone</Text>
                        </View>
                    )}

                    {isOwner && (
                        <View style={styles.ownerActions}>
                            <Pressable
                                onPress={(e) => {
                                    e.stopPropagation();
                                    onEdit(post);
                                }}
                                style={styles.ownerActionBtn}
                            >
                                <Ionicons name="create-outline" size={18} color={colors.primary.teal} />
                            </Pressable>
                            <Pressable
                                onPress={(e) => {
                                    e.stopPropagation();
                                    onDelete(post.id);
                                }}
                                style={styles.ownerActionBtn}
                            >
                                <Ionicons name="trash-outline" size={18} color={colors.status.error} />
                            </Pressable>
                        </View>
                    )}
                </View>

                <Text style={[styles.postContent, { color: colors.text.primary }]}>{post.content}</Text>
            </Pressable>

            <View style={[styles.interactionsContainer, { borderTopColor: colors.background.secondary }]}>
                <View style={styles.reactionsRow}>
                    {REACTIONS.map((reaction) => {
                        const isActive = postReactions.includes(reaction.type);
                        const count = post.reactions?.[reaction.type] || 0;

                        return (
                            <Pressable
                                key={reaction.type}
                                onPress={() => onReact(post.id, reaction.type)}
                                style={[
                                    styles.interactionButton,
                                    isActive && { backgroundColor: reaction.color + '15' },
                                ]}
                            >
                                <Ionicons
                                    name={isActive ? reaction.icon : `${reaction.icon}-outline`}
                                    size={18}
                                    color={isActive ? reaction.color : colors.text.muted}
                                />
                                {count > 0 && (
                                    <Text style={[
                                        styles.interactionCount,
                                        { color: colors.text.muted },
                                        isActive && { color: reaction.color, fontWeight: '700' }
                                    ]}>
                                        {count}
                                    </Text>
                                )}
                            </Pressable>
                        );
                    })}
                </View>

                <Pressable style={styles.commentInteraction} onPress={() => onComment(post.id)}>
                    <Ionicons name="chatbubble-ellipses-outline" size={18} color={colors.text.muted} />
                    <Text style={[styles.interactionCount, { color: colors.text.muted }]}>{post.commentCount || 0}</Text>
                </Pressable>
            </View>
        </Card>
    );
};

export const CommunityScreen = ({ navigation }) => {
    const themeColors = useColors();
    const { userId } = useUserStore();
    const {
        posts,
        activeFilter,
        setFilter,
        toggleReaction,
        userReactions,
        createPost,
        updatePost,
        deletePost,
        fetchPosts,
        isLoading,
        error
    } = useCommunityStore();

    const [showNewPost, setShowNewPost] = useState(false);
    const [editingPost, setEditingPost] = useState(null);
    const [newPostContent, setNewPostContent] = useState('');

    useEffect(() => {
        fetchPosts(activeFilter);
    }, [fetchPosts, activeFilter]);

    const onRefresh = useCallback(() => {
        fetchPosts(activeFilter);
    }, [fetchPosts, activeFilter]);

    const handleReact = (postId, reactionType) => {
        toggleReaction(postId, reactionType);
    };

    const handleNewPost = async () => {
        if (newPostContent.trim()) {
            try {
                if (editingPost) {
                    await updatePost(editingPost.id, newPostContent.trim());
                } else {
                    await createPost(newPostContent.trim(), null, 'text');
                }
                setNewPostContent('');
                setEditingPost(null);
                setShowNewPost(false);
            } catch (err) {
                console.error('Failed to save post:', err);
            }
        }
    };

    const handleEdit = (post) => {
        setEditingPost(post);
        setNewPostContent(post.content);
        setShowNewPost(true);
    };

    const handleDelete = (postId) => {
        // Simple confirm for now
        deletePost(postId);
    };

    const handleComment = (postId) => {
        navigation.navigate('Comments', { postId });
    };

    const handleProfile = (userId, username) => {
        navigation.navigate('UserProfile', { userId, username });
    };

    const renderPost = ({ item }) => (
        <PostCard
            post={item}
            onReact={handleReact}
            onComment={handleComment}
            onProfile={handleProfile}
            userReactions={userReactions}
            currentUserId={userId}
            onEdit={handleEdit}
            onDelete={handleDelete}
            colors={themeColors}
        />
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background.primary }]}>
            <View style={styles.header}>
                <View>
                    <Text style={[styles.title, { color: themeColors.text.primary }]}>Community</Text>
                    <Text style={[styles.subtitle, { color: themeColors.text.secondary }]}>You're not alone in this journey.</Text>
                </View>
                <Pressable
                    style={[styles.newPostButton, { backgroundColor: themeColors.primary.teal }]}
                    onPress={() => setShowNewPost(true)}
                >
                    <Ionicons name="add" size={28} color={themeColors.text.inverse} />
                </Pressable>
            </View>

            {/* Filter tabs */}
            <View>
                <FlatList
                    horizontal
                    data={FILTERS}
                    keyExtractor={(item) => item.id}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.filtersContent}
                    renderItem={({ item }) => (
                        <Pressable
                            onPress={() => setFilter(item.id)}
                            style={[
                                styles.filterTab,
                                { backgroundColor: themeColors.background.card, borderColor: themeColors.background.secondary },
                                activeFilter === item.id && { backgroundColor: themeColors.primary.teal, borderColor: themeColors.primary.teal },
                            ]}
                        >
                            <Text style={[
                                styles.filterText,
                                { color: themeColors.text.secondary },
                                activeFilter === item.id && { color: themeColors.text.inverse },
                            ]}>
                                {item.label}
                            </Text>
                        </Pressable>
                    )}
                />
            </View>

            {/* Posts feed */}
            <FlatList
                data={posts}
                keyExtractor={(item) => item.id}
                renderItem={renderPost}
                contentContainerStyle={styles.feedContent}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={isLoading}
                        onRefresh={onRefresh}
                        tintColor={colors.primary.teal}
                        colors={[colors.primary.teal]}
                    />
                }
                ListHeaderComponent={
                    <View style={styles.quickAccessSection}>
                        <Pressable
                            onPress={() => navigation.navigate('LiveSupport')}
                            style={[styles.quickAccessCard, { backgroundColor: '#14B8A6' + '15', borderColor: '#14B8A6' }]}
                        >
                            <View style={[styles.quickAccessIcon, { backgroundColor: '#14B8A6' }]}>
                                <Ionicons name="chatbubbles" size={20} color="#fff" />
                            </View>
                            <View style={styles.quickAccessInfo}>
                                <Text style={[styles.quickAccessTitle, { color: themeColors.text.primary }]}>Live Support Groups</Text>
                                <Text style={[styles.quickAccessSub, { color: themeColors.text.muted }]}>Join moderated chat rooms</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color={themeColors.text.muted} />
                        </Pressable>

                        <Pressable
                            onPress={() => navigation.navigate('SuccessStories')}
                            style={[styles.quickAccessCard, { backgroundColor: '#EC4899' + '15', borderColor: '#EC4899' }]}
                        >
                            <View style={[styles.quickAccessIcon, { backgroundColor: '#EC4899' }]}>
                                <Ionicons name="book" size={20} color="#fff" />
                            </View>
                            <View style={styles.quickAccessInfo}>
                                <Text style={[styles.quickAccessTitle, { color: themeColors.text.primary }]}>Success Stories</Text>
                                <Text style={[styles.quickAccessSub, { color: themeColors.text.muted }]}>Read inspiring recovery stories</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color={themeColors.text.muted} />
                        </Pressable>
                    </View>
                }
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        {isLoading ? (
                            <Text style={styles.emptyText}>Finding your community...</Text>
                        ) : (
                            <>
                                <Ionicons name="planet-outline" size={64} color={colors.background.secondary} />
                                <Text style={styles.emptyText}>The feed is quiet. Start a conversation!</Text>
                                <Button
                                    title="Write First Post"
                                    size="small"
                                    style={{ marginTop: spacing.md }}
                                    onPress={() => setShowNewPost(true)}
                                />
                            </>
                        )}
                    </View>
                }
            />

            {/* New Post Modal */}
            <Modal
                visible={showNewPost}
                animationType="slide"
                presentationStyle="formSheet"
                onRequestClose={() => setShowNewPost(false)}
            >
                <SafeAreaView style={[styles.modalContainer, { backgroundColor: themeColors.background.primary }]}>
                    <View style={styles.modalHeader}>
                        <Pressable onPress={() => setShowNewPost(false)}>
                            <Text style={[styles.modalCancel, { color: themeColors.text.muted }]}>Cancel</Text>
                        </Pressable>
                        <Text style={[styles.modalTitle, { color: themeColors.text.primary }]}>Share Insight</Text>
                        <Pressable
                            onPress={handleNewPost}
                            disabled={!newPostContent.trim() || isLoading}
                            style={({ pressed }) => [
                                styles.postAction,
                                (!newPostContent.trim() || isLoading) && { opacity: 0.5 },
                                pressed && { opacity: 0.7 }
                            ]}
                        >
                            <Text style={styles.postActionText}>Post</Text>
                        </Pressable>
                    </View>

                    <TextInput
                        style={[styles.postInput, { color: themeColors.text.primary, backgroundColor: themeColors.background.card }]}
                        placeholder="What's on your mind? Keep it supportive..."
                        placeholderTextColor={themeColors.text.muted}
                        value={newPostContent}
                        onChangeText={setNewPostContent}
                        multiline
                        autoFocus
                    />

                    <View style={[styles.postHint, { backgroundColor: themeColors.background.card }]}>
                        <Ionicons name="shield-half-outline" size={16} color={themeColors.primary.teal} />
                        <Text style={[styles.hintText, { color: themeColors.text.muted }]}>
                            Your post is encrypted and anonymous. Verified by AnchorOne.
                        </Text>
                    </View>
                </SafeAreaView>
            </Modal>
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
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing.screenPadding,
        paddingVertical: spacing.md,
    },
    title: {
        fontSize: typography.size['2xl'],
        fontWeight: typography.weight.bold,
        color: colors.text.primary,
    },
    subtitle: {
        fontSize: typography.size.xs,
        color: colors.text.secondary,
        marginTop: 2,
    },
    newPostButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: colors.primary.teal,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 4,
        shadowColor: colors.primary.teal,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    filtersContent: {
        paddingHorizontal: spacing.screenPadding,
        paddingVertical: spacing.sm,
        gap: spacing.sm,
    },
    filterTab: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        backgroundColor: colors.background.card,
        borderRadius: spacing.radius.full,
        borderWidth: 1,
        borderColor: colors.background.secondary,
    },
    filterTabActive: {
        backgroundColor: colors.primary.teal,
        borderColor: colors.primary.teal,
    },
    filterText: {
        fontSize: typography.size.sm,
        color: colors.text.secondary,
        fontWeight: typography.weight.medium,
    },
    filterTextActive: {
        color: colors.text.inverse,
    },
    feedContent: {
        padding: spacing.screenPadding,
        paddingBottom: 120,
    },
    postCard: {
        marginBottom: spacing.lg,
        padding: spacing.md,
        borderRadius: spacing.radius.xl,
    },
    postHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    avatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: colors.background.secondary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    postMeta: {
        marginLeft: spacing.sm,
        flex: 1,
    },
    username: {
        fontSize: typography.size.sm,
        fontWeight: typography.weight.bold,
        color: colors.text.primary,
    },
    timeAgo: {
        fontSize: 10,
        color: colors.text.muted,
        marginTop: 1,
    },
    milestoneBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.status.warning + '15',
        paddingVertical: 4,
        paddingHorizontal: 10,
        borderRadius: spacing.radius.full,
    },
    milestoneText: {
        fontSize: 10,
        color: colors.status.warning,
        fontWeight: typography.weight.bold,
        textTransform: 'uppercase',
    },
    postContent: {
        fontSize: typography.size.base,
        color: colors.text.primary,
        lineHeight: 22,
        marginBottom: spacing.lg,
    },
    interactionsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: spacing.md,
        borderTopWidth: 1,
        borderTopColor: colors.background.secondary,
    },
    reactionsRow: {
        flexDirection: 'row',
        gap: spacing.xs,
    },
    interactionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: spacing.radius.md,
    },
    interactionCount: {
        fontSize: typography.size.xs,
        color: colors.text.muted,
        marginLeft: 4,
    },
    commentInteraction: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 6,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: spacing['3xl'],
        opacity: 0.6,
    },
    emptyText: {
        fontSize: typography.size.sm,
        color: colors.text.muted,
        marginTop: spacing.md,
        textAlign: 'center',
    },
    modalContainer: {
        flex: 1,
        backgroundColor: colors.background.primary,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: spacing.screenPadding,
        borderBottomWidth: 1,
        borderBottomColor: colors.background.secondary,
    },
    modalTitle: {
        fontSize: typography.size.base,
        fontWeight: typography.weight.bold,
        color: colors.text.primary,
    },
    modalCancel: {
        fontSize: typography.size.sm,
        color: colors.text.muted,
    },
    postAction: {
        backgroundColor: colors.primary.teal,
        paddingVertical: 6,
        paddingHorizontal: 16,
        borderRadius: spacing.radius.full,
    },
    postActionText: {
        color: colors.text.inverse,
        fontSize: typography.size.sm,
        fontWeight: typography.weight.bold,
    },
    postInput: {
        flex: 1,
        padding: spacing.screenPadding,
        fontSize: typography.size.base,
        color: colors.text.primary,
        textAlignVertical: 'top',
    },
    postHint: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.md,
        backgroundColor: colors.background.secondary,
        margin: spacing.screenPadding,
        borderRadius: spacing.radius.md,
        gap: spacing.sm,
    },
    hintText: {
        fontSize: 10,
        color: colors.text.secondary,
        flex: 1,
    },
    ownerActions: {
        flexDirection: 'row',
        gap: 12,
        marginLeft: 8,
    },
    ownerActionBtn: {
        padding: 4,
    },
    quickAccessSection: {
        marginBottom: spacing.md,
        gap: spacing.sm,
    },
    quickAccessCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.md,
        borderRadius: 16,
        borderWidth: 1,
    },
    quickAccessIcon: {
        width: 40,
        height: 40,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    quickAccessInfo: {
        flex: 1,
        marginLeft: spacing.md,
    },
    quickAccessTitle: {
        fontSize: typography.size.base,
        fontWeight: '600',
    },
    quickAccessSub: {
        fontSize: typography.size.xs,
        marginTop: 2,
    },
});

export default CommunityScreen;

// --- End of CommunityScreen.js ---
