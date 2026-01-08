// Author: -GLOBENXCC-
// OS support: iOS, Android, Web
// Description: Community store for posts, comments, and reactions - integrated with Backend API

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../services/api';

export const useCommunityStore = create(
    persist(
        (set, get) => ({
            posts: [],
            commentsByPost: {},
            userReactions: {}, // { [postId]: ['heart', 'ribbon'] }
            activeFilter: 'all',
            isLoading: false,
            error: null,

            // Fetch posts from backend
            fetchPosts: async (addictionId = null) => {
                // Ensure we have a token before fetching
                if (!api.token) {
                    // Try to wait for init or just return if still no token
                    await api.initPromise;
                    if (!api.token) return;
                }

                set({ isLoading: true, error: null });
                try {
                    // Only pass addictionId if it's a valid UUID format, otherwise fetch all posts
                    const isValidUUID = addictionId && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(addictionId);
                    const data = await api.getPosts(isValidUUID ? addictionId : null);
                    // Map backend field names if they differ from frontend expectations
                    const formattedPosts = data.posts.map(p => ({
                        ...p,
                        id: p.id.toString(),
                        createdAt: p.created_at,
                        postType: p.post_type,
                        addictionName: p.addiction_name,
                        commentCount: parseInt(p.comment_count || p.commentCount || 0),
                        reactions: p.reactions || { hear_you: 0, stay_strong: 0, proud: 0 }
                    }));
                    set({ posts: formattedPosts, isLoading: false });
                } catch (error) {
                    set({ error: error.message, isLoading: false });
                }
            },

            // Create a new post
            createPost: async (content, addictionId = null, postType = 'text', imageUrl = null) => {
                try {
                    const response = await api.createPost(content, addictionId, postType, imageUrl);
                    const newPost = {
                        ...response.post,
                        id: response.post.id.toString(),
                        reactions: { hear_you: 0, stay_strong: 0, proud: 0 },
                        commentCount: 0
                    };
                    set(state => ({
                        posts: [newPost, ...state.posts],
                    }));
                    return newPost;
                } catch (error) {
                    set({ error: error.message });
                    throw error;
                }
            },

            // Add reaction to post (Optimistic Update)
            toggleReaction: async (postId, reactionType) => {
                const { posts, userReactions } = get();
                const post = posts.find(p => p.id === postId);
                if (!post) return;

                const currentPostReactions = userReactions[postId] || [];
                const hasReaction = currentPostReactions.includes(reactionType);

                // Optimistic UI Update
                const newUserReactions = hasReaction
                    ? currentPostReactions.filter(r => r !== reactionType)
                    : [...currentPostReactions, reactionType];

                const newPosts = posts.map(p => {
                    if (p.id !== postId) return p;
                    return {
                        ...p,
                        reactions: {
                            ...p.reactions,
                            [reactionType]: Math.max(0, (p.reactions[reactionType] || 0) + (hasReaction ? -1 : 1))
                        }
                    };
                });

                set({
                    posts: newPosts,
                    userReactions: { ...userReactions, [postId]: newUserReactions }
                });

                try {
                    await api.toggleReaction(postId, reactionType);
                } catch (error) {
                    // Rollback on failure
                    set({ posts, userReactions });
                    set({ error: 'Failed to react. Please try again.' });
                }
            },

            // Add comment to post
            addComment: async (postId, content) => {
                try {
                    const response = await api.addComment(postId, content);
                    const comment = response.comment;

                    set(state => ({
                        commentsByPost: {
                            ...state.commentsByPost,
                            [postId]: [...(state.commentsByPost[postId] || []), comment],
                        },
                        posts: state.posts.map(post =>
                            post.id === postId.toString()
                                ? { ...post, commentCount: (post.commentCount || 0) + 1 }
                                : post
                        ),
                    }));
                    return comment;
                } catch (error) {
                    set({ error: error.message });
                    throw error;
                }
            },

            // Get comments for a post
            fetchComments: async (postId) => {
                try {
                    const response = await api.getComments(postId);
                    // Map snake_case to camelCase
                    const formattedComments = response.comments.map(c => ({
                        ...c,
                        createdAt: c.created_at,
                        reactionCount: parseInt(c.reaction_count || 0),
                        userReacted: c.user_reacted
                    }));

                    set(state => ({
                        commentsByPost: {
                            ...state.commentsByPost,
                            [postId]: formattedComments
                        }
                    }));
                } catch (error) {
                    set({ error: error.message });
                }
            },

            // Toggle reaction on a comment
            toggleCommentReaction: async (commentId, postId) => {
                const { commentsByPost } = get();
                const comments = commentsByPost[postId] || [];
                const commentIndex = comments.findIndex(c => c.id === commentId);
                if (commentIndex === -1) return;

                const comment = comments[commentIndex];
                const hasReacted = comment.userReacted;

                // Optimistic update
                const newComments = [...comments];
                newComments[commentIndex] = {
                    ...comment,
                    userReacted: !hasReacted,
                    reactionCount: Math.max(0, comment.reactionCount + (hasReacted ? -1 : 1))
                };

                set(state => ({
                    commentsByPost: {
                        ...state.commentsByPost,
                        [postId]: newComments
                    }
                }));

                try {
                    await api.toggleCommentReaction(commentId);
                } catch (error) {
                    // Rollback
                    set({ commentsByPost });
                    set({ error: 'Failed to update reaction' });
                }
            },

            // Update an existing post
            updatePost: async (postId, content) => {
                try {
                    const response = await api.updatePost(postId, content);
                    const updatedPost = {
                        ...response.post,
                        id: response.post.id.toString(),
                        createdAt: response.post.created_at,
                        postType: response.post.post_type,
                        addictionName: response.post.addiction_name,
                    };

                    set(state => ({
                        posts: state.posts.map(p => p.id === postId.toString() ? { ...p, ...updatedPost } : p),
                    }));
                    return updatedPost;
                } catch (error) {
                    set({ error: error.message });
                    throw error;
                }
            },

            // Delete a post
            deletePost: async (postId) => {
                try {
                    await api.deletePost(postId);
                    set(state => ({
                        posts: state.posts.filter(p => p.id !== postId.toString()),
                        commentsByPost: {
                            ...state.commentsByPost,
                            [postId]: undefined,
                        },
                    }));
                } catch (error) {
                    set({ error: error.message });
                }
            },

            // Delete a comment
            deleteComment: async (commentId, postId) => {
                try {
                    await api.deleteComment(commentId);
                    set(state => ({
                        commentsByPost: {
                            ...state.commentsByPost,
                            [postId]: (state.commentsByPost[postId] || []).filter(c => c.id !== commentId),
                        },
                        posts: state.posts.map(post =>
                            post.id === postId.toString()
                                ? { ...post, commentCount: Math.max(0, (post.commentCount || 0) - 1) }
                                : post
                        ),
                    }));
                } catch (error) {
                    set({ error: error.message });
                }
            },

            setFilter: (filter) => {
                set({ activeFilter: filter });
                // Only pass filter to API if it's a valid UUID (not built-in filters like 'alcohol', 'cigarettes', etc.)
                const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(filter);
                get().fetchPosts(isUUID ? filter : null);
            },

            // Reset community
            resetCommunity: () => set({
                posts: [],
                commentsByPost: {},
                userReactions: {},
                activeFilter: 'all',
                isLoading: false,
                error: null
            }),
        }),
        {
            name: 'anchorone-community-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);

export default useCommunityStore;

// --- End of communityStore.js ---
