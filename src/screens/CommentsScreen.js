// Author: -GLOBENXCC-
// OS support: iOS, Android, Web
// Description: Screen to view and add comments to a community post

import React, { useState } from 'react';
import { StyleSheet, View, Text, FlatList, TextInput, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useColors, colors, spacing, typography } from '../theme';
import { Card, Button } from '../components/common';
import { useCommunityStore, useUserStore } from '../store';
import { formatDistanceToNow } from 'date-fns';

const REACTIONS = [
    { type: 'hear_you', icon: 'heart', label: 'Support', color: colors.status.error },
    { type: 'stay_strong', icon: 'shield-checkmark', label: 'Strong', color: colors.primary.blue },
    { type: 'proud', icon: 'ribbon', label: 'Proud', color: colors.status.warning },
];

export const CommentsScreen = ({ route, navigation }) => {
    const themeColors = useColors();
    const { postId } = route.params;
    const {
        posts,
        commentsByPost,
        addComment,
        fetchComments,
        deleteComment,
        toggleCommentReaction,
        userReactions,
        toggleReaction
    } = useCommunityStore();
    const { userId } = useUserStore();

    const post = posts.find(p => p.id === postId);
    const comments = commentsByPost[postId] || [];
    const [newComment, setNewComment] = useState('');

    React.useEffect(() => {
        fetchComments(postId);
    }, [postId]);

    const handleAddComment = () => {
        if (newComment.trim()) {
            addComment(postId, newComment.trim());
            setNewComment('');
        }
    };

    const handleDeleteComment = (commentId) => {
        deleteComment(commentId, postId);
    };

    const handleToggleCommentLike = (commentId) => {
        toggleCommentReaction(commentId, postId);
    };

    const handleProfile = (userId, username) => {
        navigation.navigate('UserProfile', { userId, username });
    };

    const renderComment = ({ item, index }) => {
        const isOwner = userId && item.user_id === userId;
        const hasReacted = item.userReacted;

        return (
            <View
                style={[
                    styles.commentItem,
                    { borderLeftColor: index % 2 === 0 ? themeColors.primary.teal : themeColors.primary.blue }
                ]}
            >
                <View style={styles.commentHeader}>
                    <Pressable
                        onPress={() => handleProfile(item.user_id, item.username)}
                        style={styles.commentUserBox}
                    >
                        <View style={[styles.smallAvatar, { backgroundColor: (item.avatar_color || themeColors.primary.teal) + '30', borderColor: item.avatar_color || 'transparent', borderWidth: item.avatar_color ? 1 : 0 }]}>
                            <Ionicons
                                name={item.avatar_id || "person"}
                                size={12}
                                color={item.avatar_color || themeColors.primary.teal}
                            />
                        </View>
                        <Text style={[styles.commentUser, { color: themeColors.text.primary }]}>
                            {item.anonymous ? 'Anonymous' : `@${item.username || 'user'}`}
                        </Text>
                    </Pressable>
                    <Text style={[styles.commentTime, { color: themeColors.text.muted }]}>
                        {formatDistanceToNow(new Date(item.created_at || item.createdAt), { addSuffix: true })}
                    </Text>
                </View>

                <Text style={[styles.commentContent, { color: themeColors.text.secondary }]}>{item.content}</Text>

                <View style={styles.commentActions}>
                    <Pressable
                        onPress={() => handleToggleCommentLike(item.id)}
                        style={[styles.commentActionBtn, hasReacted && styles.commentActionActive]}
                    >
                        <Ionicons
                            name={hasReacted ? "heart" : "heart-outline"}
                            size={14}
                            color={hasReacted ? themeColors.status.error : themeColors.text.muted}
                        />
                        <Text style={[styles.commentActionText, { color: themeColors.text.muted }, hasReacted && { color: themeColors.status.error, fontWeight: '600' }]}>
                            {item.reactionCount > 0 ? item.reactionCount : 'Like'}
                        </Text>
                    </Pressable>

                    {isOwner && (
                        <Pressable onPress={() => handleDeleteComment(item.id)} style={styles.commentDelete}>
                            <Ionicons name="trash-outline" size={14} color={themeColors.status.error} />
                        </Pressable>
                    )}
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background.primary }]} edges={['top', 'left', 'right']}>
            <View style={[styles.header, { borderBottomColor: themeColors.background.secondary }]}>
                <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color={themeColors.text.primary} />
                </Pressable>
                <Text style={[styles.title, { color: themeColors.text.primary }]}>Story Depth</Text>
                <View style={{ width: 40 }} />
            </View>

            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
            >
                {!post ? (
                    <View style={styles.errorContainer}>
                        <Ionicons name="search-outline" size={48} color={themeColors.background.secondary} />
                        <Text style={[styles.errorText, { color: themeColors.text.muted }]}>Connecting to the story...</Text>
                    </View>
                ) : (
                    <FlatList
                        data={comments}
                        keyExtractor={(item) => item.id}
                        renderItem={renderComment}
                        ListHeaderComponent={
                            <View style={styles.postHero}>
                                <Pressable
                                    onPress={() => handleProfile(post.user_id, post.username)}
                                    style={styles.postAuthorRow}
                                >
                                    <View style={[styles.avatarLarge, { backgroundColor: (post.avatar_color || themeColors.primary.teal) + '20', borderColor: post.avatar_color || themeColors.primary.teal }]}>
                                        <Ionicons name={post.avatar_id || "person"} size={24} color={post.avatar_color || themeColors.primary.teal} />
                                    </View>
                                    <View style={styles.authorMeta}>
                                        <Text style={[styles.authorName, { color: themeColors.text.primary }]}>
                                            {post.anonymous ? 'Anonymous Soul' : `@${post.username || 'user'}`}
                                        </Text>
                                        <Text style={[styles.postDetailTime, { color: themeColors.text.muted }]}>
                                            {post.addictionName ? `${post.addictionName} • ` : ''}
                                            {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                                        </Text>
                                    </View>
                                </Pressable>

                                <Text style={[styles.postHeroContent, { color: themeColors.text.primary }]}>{post.content}</Text>

                                <View style={styles.interactionsDivider}>
                                    <View style={styles.postReactionsRow}>
                                        {REACTIONS.map((reaction) => {
                                            const postReactionsArray = userReactions[post.id] || [];
                                            const isActive = postReactionsArray.includes(reaction.type);
                                            const count = post.reactions?.[reaction.type] || 0;

                                            return (
                                                <Pressable
                                                    key={reaction.type}
                                                    onPress={() => toggleReaction(post.id, reaction.type)}
                                                    style={[
                                                        styles.postReactionBtn,
                                                        { borderColor: themeColors.background.secondary },
                                                        isActive && { backgroundColor: reaction.color + '15', borderColor: reaction.color + '30' },
                                                    ]}
                                                >
                                                    <Ionicons
                                                        name={isActive ? reaction.icon : `${reaction.icon}-outline`}
                                                        size={16}
                                                        color={isActive ? reaction.color : themeColors.text.muted}
                                                    />
                                                    {count > 0 && (
                                                        <Text style={[
                                                            styles.postReactionCount,
                                                            { color: themeColors.text.muted },
                                                            isActive && { color: reaction.color, fontWeight: '700' }
                                                        ]}>
                                                            {count}
                                                        </Text>
                                                    )}
                                                </Pressable>
                                            );
                                        })}
                                    </View>
                                </View>

                                <View style={[styles.statsDivider, { backgroundColor: themeColors.background.secondary }]} />

                                <View style={styles.commentsSectionHeader}>
                                    <Ionicons name="chatbubbles-outline" size={18} color={themeColors.text.secondary} />
                                    <Text style={[styles.commentsCountTitle, { color: themeColors.text.primary }]}>
                                        {comments.length} {comments.length === 1 ? 'Perspective' : 'Perspectives'}
                                    </Text>
                                </View>
                            </View>
                        }
                        contentContainerStyle={styles.listContent}
                        showsVerticalScrollIndicator={false}
                    />
                )}

                <View style={styles.floatingInputWrapper}>
                    <View style={[styles.inputContainer, { backgroundColor: themeColors.background.card, borderColor: themeColors.background.secondary }]}>
                        <TextInput
                            style={[styles.input, { color: themeColors.text.primary }]}
                            placeholder="Add a kind word..."
                            placeholderTextColor={themeColors.text.muted}
                            value={newComment}
                            onChangeText={setNewComment}
                            multiline
                        />
                        <Pressable
                            onPress={handleAddComment}
                            disabled={!newComment.trim()}
                            style={[styles.sendButton, { backgroundColor: themeColors.primary.teal }, !newComment.trim() && { opacity: 0.5 }]}
                        >
                            <Ionicons name="send" size={18} color={themeColors.text.inverse} />
                        </Pressable>
                    </View>
                </View>
            </KeyboardAvoidingView>
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
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: colors.background.secondary,
    },
    backBtn: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: typography.size.lg,
        fontWeight: typography.weight.bold,
        color: colors.text.primary,
        letterSpacing: -0.5,
    },
    listContent: {
        padding: spacing.md,
        paddingBottom: 120, // Space for floating input
    },
    postHero: {
        marginBottom: spacing.xl,
        paddingBottom: spacing.lg,
    },
    postAuthorRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.lg,
    },
    avatarLarge: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: colors.primary.teal + '15',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: colors.primary.teal + '30',
    },
    authorMeta: {
        marginLeft: spacing.md,
    },
    authorName: {
        fontSize: typography.size.base,
        fontWeight: typography.weight.bold,
        color: colors.text.primary,
    },
    postDetailTime: {
        fontSize: typography.size.xs,
        color: colors.text.muted,
        marginTop: 2,
    },
    postHeroContent: {
        fontSize: 22,
        fontWeight: '500',
        color: colors.text.primary,
        lineHeight: 34,
        letterSpacing: -0.2,
        marginBottom: spacing.lg,
    },
    interactionsDivider: {
        marginBottom: spacing.xl,
        paddingTop: spacing.md,
        borderTopWidth: 1,
        borderTopColor: colors.background.secondary,
    },
    postReactionsRow: {
        flexDirection: 'row',
        gap: spacing.sm,
    },
    postReactionBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        backgroundColor: colors.background.secondary,
        borderWidth: 1,
        borderColor: 'transparent',
        gap: 8,
    },
    postReactionCount: {
        fontSize: 14,
        color: colors.text.muted,
        fontWeight: '600',
    },
    statsDivider: {
        height: 1,
        backgroundColor: colors.background.secondary,
        marginBottom: spacing.lg,
    },
    commentsSectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: spacing.md,
    },
    commentsCountTitle: {
        fontSize: typography.size.sm,
        fontWeight: typography.weight.bold,
        color: colors.text.secondary,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    commentItem: {
        backgroundColor: colors.background.card,
        borderRadius: spacing.radius.lg,
        padding: spacing.md,
        marginBottom: spacing.md,
        borderWidth: 1,
        borderColor: colors.background.secondary,
        borderLeftWidth: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    commentHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.sm,
    },
    commentUserBox: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    smallAvatar: {
        width: 24,
        height: 24,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.sm,
    },
    commentUser: {
        fontSize: typography.size.sm,
        fontWeight: typography.weight.bold,
        color: colors.text.primary,
    },
    commentTime: {
        fontSize: 10,
        fontWeight: '500',
        color: colors.text.muted,
        textTransform: 'uppercase',
    },
    commentContent: {
        fontSize: typography.size.sm,
        color: colors.text.secondary,
        lineHeight: 22,
        marginBottom: spacing.md,
    },
    commentActions: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    commentActionBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.background.primary,
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 20,
        gap: 6,
        borderWidth: 1,
        borderColor: colors.background.secondary,
    },
    commentActionActive: {
        backgroundColor: colors.status.error + '10',
        borderColor: colors.status.error + '30',
    },
    commentActionText: {
        fontSize: 12,
        fontWeight: '600',
        color: colors.text.muted,
    },
    commentActionTextActive: {
        color: colors.status.error,
    },
    commentDelete: {
        padding: 6,
    },
    floatingInputWrapper: {
        paddingHorizontal: spacing.md,
        paddingBottom: Platform.OS === 'ios' ? 20 : 10,
        backgroundColor: colors.background.primary,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
        backgroundColor: colors.background.card,
        borderRadius: 28,
        borderWidth: 1,
        borderColor: colors.background.secondary,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 10,
    },
    input: {
        flex: 1,
        paddingHorizontal: spacing.md,
        fontSize: typography.size.sm,
        color: colors.text.primary,
        maxHeight: 100,
    },
    sendButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.primary.teal,
        alignItems: 'center',
        justifyContent: 'center',
    },
    sendDisabled: {
        backgroundColor: colors.background.secondary,
        opacity: 0.6,
    },
    errorContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing.xl,
    },
    errorText: {
        fontSize: typography.size.base,
        color: colors.text.muted,
        marginTop: spacing.md,
        textAlign: 'center',
        fontWeight: '500',
    },
});

export default CommentsScreen;
