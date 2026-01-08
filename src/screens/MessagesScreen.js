// Author: -GLOBENXCC-
// OS support: iOS, Android, Web
// Description: Anonymous DM messaging screen

import React, { useState, useEffect, useRef } from 'react';
import {
    StyleSheet,
    View,
    Text,
    FlatList,
    TextInput,
    Pressable,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '../components/common';
import { useColors, colors, spacing, typography } from '../theme';
import { formatDistanceToNow } from 'date-fns';

// Mock data for demo (replace with API calls)
const MOCK_CONVERSATIONS = [
    {
        id: '1',
        otherUserId: 'user_1',
        username: null,
        anonymous: true,
        lastMessage: "Hey, I saw your post. How are you doing today?",
        lastMessageAt: new Date(Date.now() - 3600000),
        unreadCount: 2,
    },
    {
        id: '2',
        otherUserId: 'user_2',
        username: 'RecoveryWarrior',
        anonymous: false,
        lastMessage: "Thank you for sharing. It really helped me.",
        lastMessageAt: new Date(Date.now() - 86400000),
        unreadCount: 0,
    },
];

const MOCK_MESSAGES = [
    { id: '1', content: "Hey, I saw your post about day 7. That's amazing!", isMine: false, createdAt: new Date(Date.now() - 7200000) },
    { id: '2', content: "Thank you so much! It's been tough but worth it.", isMine: true, createdAt: new Date(Date.now() - 7000000) },
    { id: '3', content: "I'm on day 3. Any tips for getting through the first week?", isMine: false, createdAt: new Date(Date.now() - 6800000) },
    { id: '4', content: "Take it one hour at a time. And remember, every craving passes. You've got this! 💪", isMine: true, createdAt: new Date(Date.now() - 6600000) },
];

const ConversationItem = ({ conversation, onPress }) => (
    <Pressable style={styles.conversationItem} onPress={onPress}>
        <View style={styles.avatar}>
            <Text style={styles.avatarText}>👤</Text>
        </View>
        <View style={styles.conversationContent}>
            <View style={styles.conversationHeader}>
                <Text style={styles.conversationName}>
                    {conversation.anonymous ? 'Anonymous' : `@${conversation.username}`}
                </Text>
                <Text style={styles.conversationTime}>
                    {formatDistanceToNow(conversation.lastMessageAt, { addSuffix: true })}
                </Text>
            </View>
            <Text style={styles.lastMessage} numberOfLines={1}>
                {conversation.lastMessage}
            </Text>
        </View>
        {conversation.unreadCount > 0 && (
            <View style={styles.unreadBadge}>
                <Text style={styles.unreadCount}>{conversation.unreadCount}</Text>
            </View>
        )}
    </Pressable>
);

const MessageBubble = ({ message }) => (
    <View style={[
        styles.messageBubble,
        message.isMine ? styles.myMessage : styles.theirMessage,
    ]}>
        <Text style={[
            styles.messageText,
            message.isMine ? styles.myMessageText : styles.theirMessageText,
        ]}>
            {message.content}
        </Text>
        <Text style={[
            styles.messageTime,
            message.isMine ? styles.myMessageTime : styles.theirMessageTime,
        ]}>
            {formatDistanceToNow(message.createdAt, { addSuffix: true })}
        </Text>
    </View>
);

const ConversationsList = ({ onSelectConversation }) => (
    <FlatList
        data={MOCK_CONVERSATIONS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
            <ConversationItem
                conversation={item}
                onPress={() => onSelectConversation(item)}
            />
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
            <View style={styles.emptyState}>
                <Text style={styles.emptyEmoji}>💬</Text>
                <Text style={styles.emptyTitle}>No messages yet</Text>
                <Text style={styles.emptyText}>
                    Start a conversation by replying to someone's post
                </Text>
            </View>
        }
    />
);

const ChatView = ({ conversation, onBack }) => {
    const [messages, setMessages] = useState(MOCK_MESSAGES);
    const [newMessage, setNewMessage] = useState('');
    const flatListRef = useRef(null);

    const handleSend = () => {
        if (!newMessage.trim()) return;

        const message = {
            id: Date.now().toString(),
            content: newMessage.trim(),
            isMine: true,
            createdAt: new Date(),
        };

        setMessages([...messages, message]);
        setNewMessage('');
    };

    return (
        <KeyboardAvoidingView
            style={styles.chatContainer}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={100}
        >
            {/* Header */}
            <View style={styles.chatHeader}>
                <Pressable onPress={onBack} style={styles.backButton}>
                    <Text style={styles.backIcon}>←</Text>
                </Pressable>
                <View style={styles.chatAvatar}>
                    <Text style={styles.chatAvatarText}>👤</Text>
                </View>
                <Text style={styles.chatName}>
                    {conversation.anonymous ? 'Anonymous' : `@${conversation.username}`}
                </Text>
            </View>

            {/* Messages */}
            <FlatList
                ref={flatListRef}
                data={messages}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <MessageBubble message={item} />}
                contentContainerStyle={styles.messagesContent}
                onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
            />

            {/* Input */}
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Type a message..."
                    placeholderTextColor={colors.text.muted}
                    value={newMessage}
                    onChangeText={setNewMessage}
                    multiline
                />
                <Pressable
                    style={[
                        styles.sendButton,
                        !newMessage.trim() && styles.sendButtonDisabled,
                    ]}
                    onPress={handleSend}
                    disabled={!newMessage.trim()}
                >
                    <Text style={styles.sendIcon}>➤</Text>
                </Pressable>
            </View>
        </KeyboardAvoidingView>
    );
};

export const MessagesScreen = ({ navigation }) => {
    const themeColors = useColors();
    const [activeConversation, setActiveConversation] = useState(null);

    if (activeConversation) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background.primary }]} edges={['top']}>
                <ChatView
                    conversation={activeConversation}
                    onBack={() => setActiveConversation(null)}
                />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background.primary }]}>
            <View style={[styles.header, { borderBottomColor: themeColors.background.secondary }]}>
                <Pressable onPress={() => navigation.goBack()} style={styles.headerBackButton}>
                    <Text style={[styles.backIcon, { color: themeColors.text.primary }]}>←</Text>
                </Pressable>
                <Text style={[styles.title, { color: themeColors.text.primary }]}>Messages</Text>
            </View>

            <View style={styles.privacyNote}>
                <Text style={styles.privacyIcon}>🔒</Text>
                <Text style={[styles.privacyText, { color: themeColors.text.secondary }]}>
                    All messages are anonymous. Be kind and supportive.
                </Text>
            </View>

            <ConversationsList onSelectConversation={setActiveConversation} />
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
        paddingHorizontal: spacing.screenPadding,
        paddingVertical: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.background.secondary,
    },
    headerBackButton: {
        marginRight: spacing.md,
    },
    backIcon: {
        fontSize: 24,
        color: colors.text.primary,
    },
    title: {
        fontSize: typography.size.xl,
        fontWeight: typography.weight.bold,
        color: colors.text.primary,
    },
    privacyNote: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.primary.teal + '10',
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.screenPadding,
    },
    privacyIcon: {
        fontSize: 16,
        marginRight: spacing.sm,
    },
    privacyText: {
        fontSize: typography.size.sm,
        color: colors.text.secondary,
    },
    listContent: {
        padding: spacing.screenPadding,
    },
    conversationItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.background.secondary,
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: colors.background.secondary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarText: {
        fontSize: 24,
    },
    conversationContent: {
        flex: 1,
        marginLeft: spacing.md,
    },
    conversationHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: spacing.xs,
    },
    conversationName: {
        fontSize: typography.size.base,
        fontWeight: typography.weight.semibold,
        color: colors.text.primary,
    },
    conversationTime: {
        fontSize: typography.size.xs,
        color: colors.text.muted,
    },
    lastMessage: {
        fontSize: typography.size.sm,
        color: colors.text.secondary,
    },
    unreadBadge: {
        backgroundColor: colors.primary.teal,
        borderRadius: 12,
        minWidth: 24,
        height: 24,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: spacing.xs,
    },
    unreadCount: {
        fontSize: typography.size.xs,
        color: colors.text.inverse,
        fontWeight: typography.weight.bold,
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: spacing['2xl'],
    },
    emptyEmoji: {
        fontSize: 48,
        marginBottom: spacing.md,
    },
    emptyTitle: {
        fontSize: typography.size.lg,
        fontWeight: typography.weight.semibold,
        color: colors.text.primary,
        marginBottom: spacing.xs,
    },
    emptyText: {
        fontSize: typography.size.sm,
        color: colors.text.secondary,
        textAlign: 'center',
    },
    chatContainer: {
        flex: 1,
    },
    chatHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.screenPadding,
        paddingVertical: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.background.secondary,
    },
    backButton: {
        marginRight: spacing.md,
    },
    chatAvatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: colors.background.secondary,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.sm,
    },
    chatAvatarText: {
        fontSize: 18,
    },
    chatName: {
        fontSize: typography.size.base,
        fontWeight: typography.weight.semibold,
        color: colors.text.primary,
    },
    messagesContent: {
        padding: spacing.screenPadding,
        paddingBottom: spacing.xl,
    },
    messageBubble: {
        maxWidth: '80%',
        padding: spacing.md,
        borderRadius: spacing.radius.lg,
        marginBottom: spacing.sm,
    },
    myMessage: {
        alignSelf: 'flex-end',
        backgroundColor: colors.primary.teal,
    },
    theirMessage: {
        alignSelf: 'flex-start',
        backgroundColor: colors.background.card,
    },
    messageText: {
        fontSize: typography.size.base,
        lineHeight: 22,
    },
    myMessageText: {
        color: colors.text.inverse,
    },
    theirMessageText: {
        color: colors.text.primary,
    },
    messageTime: {
        fontSize: typography.size.xs,
        marginTop: spacing.xs,
    },
    myMessageTime: {
        color: 'rgba(255, 255, 255, 0.7)',
        textAlign: 'right',
    },
    theirMessageTime: {
        color: colors.text.muted,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        padding: spacing.md,
        borderTopWidth: 1,
        borderTopColor: colors.background.secondary,
        backgroundColor: colors.background.primary,
    },
    input: {
        flex: 1,
        backgroundColor: colors.background.card,
        borderRadius: spacing.radius.lg,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        fontSize: typography.size.base,
        color: colors.text.primary,
        maxHeight: 100,
        marginRight: spacing.sm,
    },
    sendButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: colors.primary.teal,
        alignItems: 'center',
        justifyContent: 'center',
    },
    sendButtonDisabled: {
        opacity: 0.5,
    },
    sendIcon: {
        fontSize: 18,
        color: colors.text.inverse,
    },
});

export default MessagesScreen;

// --- End of MessagesScreen.js ---
