// Author: -GLOBENXCC-
// OS support: iOS, Android, Web
// Description: Live Support Groups screen with chat rooms

import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../components/common';
import { useColors, spacing, typography } from '../theme';
import { useLiveSupportStore } from '../store/liveSupportStore';
import { format } from 'date-fns';

export const LiveSupportScreen = ({ navigation }) => {
    const colors = useColors();
    const {
        supportGroups,
        activeGroup,
        joinGroup,
        leaveGroup,
        sendMessage,
        getMessages,
        getGroup,
    } = useLiveSupportStore();

    const [message, setMessage] = useState('');
    const scrollRef = useRef(null);
    const [username] = useState('Anonymous' + Math.floor(Math.random() * 1000));

    const messages = activeGroup ? getMessages(activeGroup) : [];
    const currentGroup = activeGroup ? getGroup(activeGroup) : null;

    useEffect(() => {
        if (scrollRef.current && messages.length > 0) {
            scrollRef.current.scrollToEnd({ animated: true });
        }
    }, [messages.length]);

    const handleSend = () => {
        if (!message.trim() || !activeGroup) return;
        sendMessage(activeGroup, message.trim(), username);
        setMessage('');
    };

    const GroupCard = ({ group }) => (
        <Pressable
            onPress={() => joinGroup(group.id)}
            style={({ pressed }) => [
                styles.groupCard,
                {
                    backgroundColor: colors.background.card,
                    opacity: pressed ? 0.9 : 1,
                    borderLeftColor: group.color,
                },
            ]}
        >
            <View style={[styles.groupIcon, { backgroundColor: group.color + '20' }]}>
                <Ionicons name={group.icon} size={24} color={group.color} />
            </View>
            <View style={styles.groupInfo}>
                <Text style={[styles.groupName, { color: colors.text.primary }]}>{group.name}</Text>
                <Text style={[styles.groupDesc, { color: colors.text.muted }]} numberOfLines={1}>
                    {group.description}
                </Text>
            </View>
            <View style={styles.groupStats}>
                <View style={[styles.activeDot, { backgroundColor: '#10B981' }]} />
                <Text style={[styles.activeText, { color: colors.text.muted }]}>{group.activeUsers}</Text>
            </View>
        </Pressable>
    );

    const MessageBubble = ({ item }) => {
        const isSupport = item.isSupport;
        const isBot = item.isBot;

        return (
            <View style={[styles.messageRow, isSupport && styles.supportRow]}>
                <View
                    style={[
                        styles.messageBubble,
                        {
                            backgroundColor: isBot
                                ? colors.primary.teal + '20'
                                : isSupport
                                    ? colors.primary.violet + '20'
                                    : colors.background.card,
                        },
                    ]}
                >
                    <View style={styles.messageHeader}>
                        <Text
                            style={[
                                styles.messageUsername,
                                {
                                    color: isBot ? colors.primary.teal : isSupport ? colors.primary.violet : colors.text.secondary,
                                },
                            ]}
                        >
                            {item.username}
                            {isBot && ' 🤖'}
                            {isSupport && !isBot && ' ⭐'}
                        </Text>
                        <Text style={[styles.messageTime, { color: colors.text.muted }]}>
                            {format(item.timestamp, 'h:mm a')}
                        </Text>
                    </View>
                    <Text style={[styles.messageText, { color: colors.text.primary }]}>{item.message}</Text>
                </View>
            </View>
        );
    };

    if (activeGroup && currentGroup) {
        return (
            <KeyboardAvoidingView
                style={[styles.container, { backgroundColor: colors.background.primary }]}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
            >
                <SafeAreaView edges={['top']} style={styles.safeArea}>
                    <View style={[styles.chatHeader, { backgroundColor: currentGroup.color, borderBottomColor: colors.border }]}>
                        <Pressable onPress={leaveGroup} style={styles.backButton}>
                            <Ionicons name="arrow-back" size={24} color="#fff" />
                        </Pressable>
                        <View style={styles.chatHeaderInfo}>
                            <Text style={styles.chatHeaderTitle}>{currentGroup.name}</Text>
                            <Text style={styles.chatHeaderSubtitle}>{currentGroup.activeUsers} online</Text>
                        </View>
                        <View style={styles.placeholder} />
                    </View>

                    <FlatList
                        ref={scrollRef}
                        data={messages}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => <MessageBubble item={item} />}
                        contentContainerStyle={styles.messagesList}
                        onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
                    />

                    <View style={[styles.inputContainer, { backgroundColor: colors.background.card, borderTopColor: colors.border }]}>
                        <TextInput
                            value={message}
                            onChangeText={setMessage}
                            placeholder="Type a supportive message..."
                            placeholderTextColor={colors.text.muted}
                            style={[styles.input, { color: colors.text.primary, backgroundColor: colors.background.secondary }]}
                            multiline
                        />
                        <Pressable
                            onPress={handleSend}
                            style={[styles.sendButton, { backgroundColor: message.trim() ? currentGroup.color : colors.background.secondary }]}
                            disabled={!message.trim()}
                        >
                            <Ionicons name="send" size={20} color={message.trim() ? '#fff' : colors.text.muted} />
                        </Pressable>
                    </View>
                </SafeAreaView>
            </KeyboardAvoidingView>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
            <SafeAreaView edges={['top']} style={styles.safeArea}>
                <View style={[styles.header, { borderBottomColor: colors.border }]}>
                    <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
                    </Pressable>
                    <Text style={[styles.headerTitle, { color: colors.text.primary }]}>Live Support Groups</Text>
                    <View style={styles.placeholder} />
                </View>

                <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
                    <View style={[styles.infoCard, { backgroundColor: colors.primary.teal + '10', borderColor: colors.primary.teal }]}>
                        <Ionicons name="shield-checkmark" size={20} color={colors.primary.teal} />
                        <Text style={[styles.infoText, { color: colors.text.primary }]}>
                            All groups are moderated for safety. Be kind, supportive, and respectful.
                        </Text>
                    </View>

                    <Text style={[styles.sectionTitle, { color: colors.text.muted }]}>Join a Group</Text>

                    {supportGroups.map((group) => (
                        <GroupCard key={group.id} group={group} />
                    ))}

                    <View style={styles.bottomPadding} />
                </ScrollView>
            </SafeAreaView>
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
    placeholder: { width: 32 },
    scrollView: { flex: 1 },
    scrollContent: { padding: spacing.md, paddingBottom: 100 },
    infoCard: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
        padding: spacing.md,
        borderRadius: 12,
        borderWidth: 1,
        marginBottom: spacing.lg,
    },
    infoText: { flex: 1, fontSize: typography.size.sm, lineHeight: 20 },
    sectionTitle: {
        fontSize: typography.size.sm,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: spacing.sm,
    },
    groupCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.md,
        borderRadius: 16,
        marginBottom: spacing.sm,
        borderLeftWidth: 4,
    },
    groupIcon: { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
    groupInfo: { flex: 1, marginLeft: spacing.md },
    groupName: { fontSize: typography.size.base, fontWeight: '600' },
    groupDesc: { fontSize: typography.size.xs, marginTop: 2 },
    groupStats: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    activeDot: { width: 8, height: 8, borderRadius: 4 },
    activeText: { fontSize: typography.size.sm },
    bottomPadding: { height: 40 },
    chatHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.md,
    },
    chatHeaderInfo: { flex: 1, alignItems: 'center' },
    chatHeaderTitle: { color: '#fff', fontSize: typography.size.lg, fontWeight: '700' },
    chatHeaderSubtitle: { color: 'rgba(255,255,255,0.8)', fontSize: typography.size.xs },
    messagesList: { padding: spacing.md, paddingBottom: 20 },
    messageRow: { marginBottom: spacing.sm },
    supportRow: {},
    messageBubble: { padding: spacing.md, borderRadius: 16, maxWidth: '85%' },
    messageHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 },
    messageUsername: { fontSize: typography.size.sm, fontWeight: '600' },
    messageTime: { fontSize: 10 },
    messageText: { fontSize: typography.size.base, lineHeight: 22 },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        padding: spacing.md,
        borderTopWidth: 1,
        gap: spacing.sm,
    },
    input: {
        flex: 1,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: 20,
        maxHeight: 100,
        fontSize: typography.size.base,
    },
    sendButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default LiveSupportScreen;

// --- End of LiveSupportScreen.js ---
