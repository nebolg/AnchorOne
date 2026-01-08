// Author: -GLOBENXCC-
// OS support: iOS, Android, Web
// Description: Enhanced Public user profile screen with premium visuals and social impact stats

import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable, RefreshControl, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useColors, colors, spacing, typography } from '../theme';
import { Card, Button, GradientBackground } from '../components/common';
import { IconRenderer } from '../components/common/IconRenderer';
import { api } from '../services/api';
import { format, formatDistanceToNow } from 'date-fns';

export const UserProfileScreen = ({ route, navigation }) => {
    const themeColors = useColors();
    const { userId } = route.params;
    const [profile, setProfile] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const scrollY = new Animated.Value(0);

    const fetchProfile = async () => {
        try {
            setIsLoading(true);
            const data = await api.getOtherProfile(userId);
            setProfile(data);
        } catch (error) {
            console.error('Failed to fetch user profile:', error);
        } finally {
            setIsLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, [userId]);

    const onRefresh = () => {
        setRefreshing(true);
        fetchProfile();
    };

    if (isLoading && !refreshing) {
        return (
            <View style={styles.loadingContainer}>
                <GradientBackground style={styles.fullScreen}>
                    <View style={styles.centerContent}>
                        <Ionicons name="compass" size={48} color={colors.text.inverse} style={styles.loadingIcon} />
                        <Text style={styles.loadingText}>Locating Traveler...</Text>
                    </View>
                </GradientBackground>
            </View>
        );
    }

    if (!profile) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.errorContainer}>
                    <Ionicons name="alert-circle-outline" size={64} color={colors.status.error} />
                    <Text style={styles.errorText}>Traveler not found</Text>
                    <Button title="Go Back" onPress={() => navigation.goBack()} style={{ marginTop: spacing.md }} />
                </View>
            </SafeAreaView>
        );
    }

    const { user, streaks, posts } = profile;
    const displayName = user.anonymous ? 'Anonymous Traveler' : `@${user.username || 'user'}`;
    const totalDays = streaks.reduce((acc, curr) => acc + parseInt(curr.streak_days || 0), 0);
    const totalReactions = posts.reduce((acc, curr) => {
        const reactionsObj = curr.reactions || {};
        return acc + Object.values(reactionsObj).reduce((a, b) => a + (parseInt(b) || 0), 0);
    }, 0);

    const headerOpacity = scrollY.interpolate({
        inputRange: [50, 150],
        outputRange: [0, 1],
        extrapolate: 'clamp',
    });

    const headerTranslateY = scrollY.interpolate({
        inputRange: [0, 100],
        outputRange: [-20, 0],
        extrapolate: 'clamp',
    });

    return (
        <View style={[styles.container, { backgroundColor: themeColors.background.primary }]}>
            {/* Nav Header (Floating) */}
            <Animated.View style={[styles.floatingHeader, { backgroundColor: themeColors.background.primary, borderBottomColor: themeColors.background.secondary, opacity: headerOpacity, transform: [{ translateY: headerTranslateY }] }]}>
                <SafeAreaView edges={['top']}>
                    <View style={styles.headerContent}>
                        <Pressable onPress={() => navigation.goBack()} style={styles.headerBackBtn}>
                            <Ionicons name="arrow-back" size={24} color={themeColors.text.primary} />
                        </Pressable>
                        <Text style={[styles.headerTitle, { color: themeColors.text.primary }]} numberOfLines={1}>{displayName}</Text>
                        <View style={{ width: 40 }} />
                    </View>
                </SafeAreaView>
            </Animated.View>

            <ScrollView
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    { useNativeDriver: false }
                )}
                scrollEventThrottle={16}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary.teal} />
                }
                contentContainerStyle={styles.scrollContent}
            >
                {/* Hero Gradient Section */}
                <View style={styles.heroWrapper}>
                    <GradientBackground style={styles.heroGradient}>
                        <SafeAreaView edges={['top']}>
                            <View style={styles.heroHeader}>
                                <Pressable onPress={() => navigation.goBack()} style={styles.heroBackBtn}>
                                    <View style={styles.backBtnInner}>
                                        <Ionicons name="arrow-back" size={24} color={colors.text.inverse} />
                                    </View>
                                </Pressable>
                            </View>

                            <View style={styles.heroMain}>
                                <View style={styles.avatarWrapper}>
                                    <View style={[styles.avatarInner, { backgroundColor: (user.avatar_color || '#FFFFFF') + '30', borderColor: user.avatar_color || '#FFFFFF' }]}>
                                        {user.avatar_id ? (
                                            <Ionicons name={user.avatar_id} size={54} color={user.avatar_color || colors.text.inverse} />
                                        ) : (
                                            <Text style={styles.avatarText}>
                                                {displayName.replace('@', '').charAt(0).toUpperCase()}
                                            </Text>
                                        )}
                                    </View>
                                    {user.anonymous && (
                                        <View style={styles.heroAnonBadge}>
                                            <Ionicons name="eye-off" size={14} color={colors.text.inverse} />
                                        </View>
                                    )}
                                </View>
                                <Text style={styles.heroName}>{displayName}</Text>
                                {user.catchphrase ? (
                                    <Text style={styles.heroCatchphrase}>"{user.catchphrase}"</Text>
                                ) : null}
                                <View style={styles.badgeRow}>
                                    <View style={styles.statusBadge}>
                                        <Text style={styles.statusText}>Compass Operator</Text>
                                    </View>
                                    <Text style={styles.heroMemberSince}>
                                        since {format(new Date(user.created_at || user.createdAt), 'MMM yyyy')}
                                    </Text>
                                </View>
                                {user.bio ? (
                                    <View style={styles.bioContainer}>
                                        <Text style={styles.bioText}>{user.bio}</Text>
                                    </View>
                                ) : null}
                            </View>
                        </SafeAreaView>
                    </GradientBackground>
                </View>

                {/* Growth Stats Row */}
                <View style={styles.statsContainer}>
                    <View style={styles.statsCard}>
                        <Text style={styles.statValue}>{totalDays}</Text>
                        <Text style={styles.statLabel}>Total Days</Text>
                    </View>
                    <View style={styles.statsDivider} />
                    <View style={styles.statsCard}>
                        <Text style={styles.statValue}>{posts.length}</Text>
                        <Text style={styles.statLabel}>Stories</Text>
                    </View>
                    <View style={styles.statsDivider} />
                    <View style={styles.statsCard}>
                        <Text style={styles.statValue}>{totalReactions}</Text>
                        <Text style={styles.statLabel}>Impact</Text>
                    </View>
                </View>

                {/* Momentum Section */}
                <View style={styles.sectionContainer}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Momentum</Text>
                        <Ionicons name="flash" size={18} color={colors.primary.teal} />
                    </View>

                    {streaks && streaks.length > 0 ? (
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.momentumGrid}
                            snapToInterval={160 + spacing.md}
                            decelerationRate="fast"
                        >
                            {streaks.map((streak, index) => (
                                <Card key={index} style={styles.momentumCard}>
                                    <View style={[styles.momentumIconBox, { backgroundColor: colors.primary.teal + '15' }]}>
                                        <IconRenderer
                                            library="Ionicons"
                                            name={streak.icon}
                                            size={20}
                                            color={colors.primary.teal}
                                        />
                                    </View>
                                    <Text style={styles.momentumValue}>{streak.streak_days}</Text>
                                    <Text style={styles.momentumLabel}>Days Free</Text>
                                    <View style={styles.momentumFooter}>
                                        <Text style={styles.momentumName} numberOfLines={1}>{streak.addiction_name}</Text>
                                    </View>
                                </Card>
                            ))}
                        </ScrollView>
                    ) : (
                        <View style={styles.emptyCard}>
                            <Ionicons name="sparkles-outline" size={24} color={colors.text.muted} />
                            <Text style={styles.emptyText}>Sharing momentum soon...</Text>
                        </View>
                    )}
                </View>

                {/* Life Stories Section */}
                <View style={styles.sectionContainer}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Traveler's Path</Text>
                        <Text style={styles.sectionSubtitle}>{posts.length} entries</Text>
                    </View>

                    {posts && posts.length > 0 ? (
                        posts.map((post) => (
                            <Pressable
                                key={post.id}
                                style={styles.pathItem}
                                onPress={() => navigation.navigate('Comments', { postId: post.id })}
                            >
                                <View style={styles.pathHeader}>
                                    <View style={styles.pathMeta}>
                                        <Text style={styles.pathAddiction}>{post.addiction_name || 'General'}</Text>
                                        <View style={styles.pathDot} />
                                        <Text style={styles.pathTime}>
                                            {formatDistanceToNow(new Date(post.created_at || post.createdAt), { addSuffix: true })}
                                        </Text>
                                    </View>
                                    {post.post_type === 'milestone' && (
                                        <View style={styles.pathMilestone}>
                                            <Ionicons name="trophy" size={10} color={colors.status.warning} />
                                            <Text style={styles.milestoneMiniText}>Milestone</Text>
                                        </View>
                                    )}
                                </View>

                                <Text style={styles.pathContent} numberOfLines={3}>{post.content}</Text>

                                <View style={styles.pathFooter}>
                                    <View style={styles.pathEngagement}>
                                        <View style={styles.pathStat}>
                                            <Ionicons name="heart" size={14} color={colors.status.error} />
                                            <Text style={styles.pathStatText}>
                                                {Object.values(post.reactions || {}).reduce((a, b) => a + (parseInt(b) || 0), 0)}
                                            </Text>
                                        </View>
                                        <View style={styles.pathStat}>
                                            <Ionicons name="chatbubble-ellipses" size={14} color={colors.primary.blue} />
                                            <Text style={styles.pathStatText}>{post.comment_count}</Text>
                                        </View>
                                    </View>
                                    <Ionicons name="chevron-forward" size={14} color={colors.text.muted} />
                                </View>
                            </Pressable>
                        ))
                    ) : (
                        <View style={styles.emptyCard}>
                            <Ionicons name="journal-outline" size={24} color={colors.text.muted} />
                            <Text style={styles.emptyText}>No public entries yet.</Text>
                        </View>
                    )}
                </View>

                <View style={{ height: 100 }} />
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background.primary,
    },
    fullScreen: {
        flex: 1,
    },
    centerContent: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    loadingContainer: {
        flex: 1,
    },
    loadingIcon: {
        marginBottom: spacing.md,
        opacity: 0.8,
    },
    loadingText: {
        fontSize: typography.size.sm,
        color: colors.text.inverse,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    errorContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing.xl,
    },
    errorText: {
        fontSize: typography.size.lg,
        color: colors.text.primary,
        marginTop: spacing.lg,
        fontWeight: '900',
    },
    floatingHeader: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: colors.background.primary,
        zIndex: 100,
        borderBottomWidth: 1,
        borderBottomColor: colors.background.secondary,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 5,
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.md,
        height: 56,
    },
    headerTitle: {
        fontSize: typography.size.base,
        fontWeight: '900',
        color: colors.text.primary,
        flex: 1,
        textAlign: 'center',
    },
    headerBackBtn: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    scrollContent: {
        flexGrow: 1,
    },
    heroWrapper: {
        height: 380,
    },
    heroGradient: {
        height: '100%',
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40,
        overflow: 'hidden',
    },
    heroHeader: {
        flexDirection: 'row',
        paddingHorizontal: spacing.md,
        paddingTop: spacing.sm,
    },
    heroBackBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        overflow: 'hidden',
    },
    backBtnInner: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
    },
    heroMain: {
        alignItems: 'center',
        marginTop: spacing.sm,
    },
    avatarWrapper: {
        position: 'relative',
        marginBottom: spacing.md,
    },
    avatarInner: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 4,
        borderColor: 'rgba(255, 255, 255, 0.8)',
    },
    avatarText: {
        fontSize: 48,
        fontWeight: '900',
        color: colors.text.inverse,
    },
    heroAnonBadge: {
        position: 'absolute',
        bottom: 4,
        right: 4,
        backgroundColor: colors.background.primary,
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 3,
        borderColor: colors.primary.teal,
    },
    heroName: {
        fontSize: 32,
        fontWeight: '900',
        color: colors.text.inverse,
        letterSpacing: -1,
    },
    heroCatchphrase: {
        fontSize: 14,
        fontWeight: '600',
        color: 'rgba(255, 255, 255, 0.9)',
        marginTop: 4,
        fontStyle: 'italic',
    },
    badgeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 12,
        gap: 8,
    },
    bioContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        padding: spacing.md,
        borderRadius: 16,
        marginTop: spacing.md,
        marginHorizontal: spacing.xl,
        width: '80%',
    },
    bioText: {
        fontSize: 13,
        color: colors.text.inverse,
        textAlign: 'center',
        lineHeight: 20,
    },
    statusBadge: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingVertical: 4,
        paddingHorizontal: 12,
        borderRadius: 20,
    },
    statusText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: colors.text.inverse,
        textTransform: 'uppercase',
    },
    heroMemberSince: {
        fontSize: 12,
        color: 'rgba(255, 255, 255, 0.7)',
        fontWeight: '500',
    },
    statsContainer: {
        flexDirection: 'row',
        backgroundColor: colors.background.card,
        marginHorizontal: spacing.xl,
        marginTop: -40,
        borderRadius: 24,
        paddingVertical: spacing.lg,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 8,
        alignItems: 'center',
    },
    statsCard: {
        flex: 1,
        alignItems: 'center',
    },
    statValue: {
        fontSize: 24,
        fontWeight: '900',
        color: colors.text.primary,
    },
    statLabel: {
        fontSize: 10,
        fontWeight: 'bold',
        color: colors.text.muted,
        textTransform: 'uppercase',
        marginTop: 2,
    },
    statsDivider: {
        width: 1,
        height: 30,
        backgroundColor: colors.background.secondary,
    },
    sectionContainer: {
        marginTop: spacing.xl,
        paddingHorizontal: spacing.lg,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.md,
        justifyContent: 'space-between',
    },
    sectionTitle: {
        fontSize: typography.size.lg,
        fontWeight: '900',
        color: colors.text.primary,
        letterSpacing: -0.5,
    },
    sectionSubtitle: {
        fontSize: 12,
        color: colors.text.muted,
        fontWeight: '600',
    },
    momentumGrid: {
        paddingRight: spacing.xl,
        paddingBottom: spacing.sm,
        gap: spacing.md,
    },
    momentumCard: {
        width: 160,
        padding: spacing.md,
        borderRadius: 24,
        backgroundColor: colors.background.card,
        borderWidth: 1,
        borderColor: colors.background.secondary,
        alignItems: 'flex-start',
    },
    momentumIconBox: {
        width: 40,
        height: 40,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.md,
    },
    momentumValue: {
        fontSize: 32,
        fontWeight: '900',
        color: colors.text.primary,
        letterSpacing: -1,
    },
    momentumLabel: {
        fontSize: 10,
        fontWeight: 'bold',
        color: colors.text.muted,
        textTransform: 'uppercase',
        marginTop: -4,
    },
    momentumFooter: {
        marginTop: spacing.md,
        paddingTop: spacing.xs,
        borderTopWidth: 1,
        borderTopColor: colors.background.secondary,
        width: '100%',
    },
    momentumName: {
        fontSize: 12,
        fontWeight: '900',
        color: colors.primary.teal,
    },
    emptyCard: {
        backgroundColor: colors.background.secondary + '20',
        borderRadius: 24,
        padding: spacing.xl,
        alignItems: 'center',
        justifyContent: 'center',
        borderStyle: 'dashed',
        borderWidth: 2,
        borderColor: colors.background.secondary,
    },
    emptyText: {
        fontSize: typography.size.xs,
        color: colors.text.muted,
        marginTop: spacing.sm,
        fontWeight: 'bold',
    },
    pathItem: {
        backgroundColor: colors.background.card,
        borderRadius: 24,
        padding: spacing.lg,
        marginBottom: spacing.md,
        borderWidth: 1,
        borderColor: colors.background.secondary,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.03,
        shadowRadius: 10,
        elevation: 2,
    },
    pathHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    pathMeta: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    pathAddiction: {
        fontSize: 12,
        fontWeight: '900',
        color: colors.primary.teal,
        textTransform: 'uppercase',
    },
    pathDot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: colors.text.muted,
        marginHorizontal: 8,
        opacity: 0.3,
    },
    pathTime: {
        fontSize: 12,
        color: colors.text.muted,
        fontWeight: '500',
    },
    pathMilestone: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.status.warning + '15',
        paddingVertical: 2,
        paddingHorizontal: 8,
        borderRadius: 8,
        gap: 4,
    },
    milestoneMiniText: {
        fontSize: 8,
        fontWeight: '900',
        color: colors.status.warning,
        textTransform: 'uppercase',
    },
    pathContent: {
        fontSize: 15,
        color: colors.text.primary,
        lineHeight: 24,
        fontWeight: '400',
    },
    pathFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 16,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: colors.background.secondary,
    },
    pathEngagement: {
        flexDirection: 'row',
        gap: 16,
    },
    pathStat: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    pathStatText: {
        fontSize: 13,
        fontWeight: 'bold',
        color: colors.text.secondary,
    },
});

export default UserProfileScreen;

// --- End of UserProfileScreen.js ---
