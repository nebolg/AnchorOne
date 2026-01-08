// Author: -GLOBENXCC-
// OS support: iOS, Android, Web
// Description: Store for live support groups and chat room functionality

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SUPPORT_GROUP_TOPICS = [
    {
        id: 'general',
        name: 'General Support',
        description: 'A safe space to share and connect',
        icon: 'people',
        color: '#14B8A6',
        activeUsers: 42,
        isModerated: true,
    },
    {
        id: 'alcohol',
        name: 'Alcohol Recovery',
        description: 'Support for those recovering from alcohol addiction',
        icon: 'wine',
        color: '#8B5CF6',
        activeUsers: 28,
        isModerated: true,
    },
    {
        id: 'smoking',
        name: 'Smoke-Free Journey',
        description: 'Connect with others quitting nicotine',
        icon: 'flame',
        color: '#F59E0B',
        activeUsers: 35,
        isModerated: true,
    },
    {
        id: 'gambling',
        name: 'Gambling Recovery',
        description: 'Support for gambling addiction recovery',
        icon: 'card',
        color: '#EC4899',
        activeUsers: 19,
        isModerated: true,
    },
    {
        id: 'drugs',
        name: 'Substance Recovery',
        description: 'A supportive community for drug recovery',
        icon: 'medical',
        color: '#EF4444',
        activeUsers: 31,
        isModerated: true,
    },
    {
        id: 'digital',
        name: 'Digital Detox',
        description: 'Breaking free from screen addiction',
        icon: 'phone-portrait',
        color: '#3B82F6',
        activeUsers: 24,
        isModerated: true,
    },
    {
        id: 'first_week',
        name: 'First Week Warriors',
        description: 'Extra support for your first 7 days',
        icon: 'shield-checkmark',
        color: '#10B981',
        activeUsers: 56,
        isModerated: true,
    },
    {
        id: 'parents',
        name: 'Parents in Recovery',
        description: 'Recovery while raising children',
        icon: 'heart',
        color: '#F472B6',
        activeUsers: 15,
        isModerated: true,
    },
];

const SAMPLE_MESSAGES = {
    general: [
        { id: 'm1', username: 'HopeSeeker', message: 'Day 14 here. Feeling stronger every day! 💪', timestamp: Date.now() - 300000, isSupport: false },
        { id: 'm2', username: 'RecoveryCoach', message: 'Amazing progress! What helped you the most?', timestamp: Date.now() - 240000, isSupport: true },
        { id: 'm3', username: 'Anonymous', message: 'Just joined. Feeling nervous but hopeful.', timestamp: Date.now() - 180000, isSupport: false },
        { id: 'm4', username: 'DayByDay', message: 'Welcome! We\'ve all been there. You\'re in the right place. ❤️', timestamp: Date.now() - 120000, isSupport: false },
    ],
};

export const useLiveSupportStore = create(
    persist(
        (set, get) => ({
            supportGroups: SUPPORT_GROUP_TOPICS,
            activeGroup: null,
            messages: SAMPLE_MESSAGES,
            isConnected: false,
            userPresence: {},
            blockedUsers: [],
            mutedGroups: [],

            joinGroup: (groupId) => {
                set({ activeGroup: groupId, isConnected: true });
                if (!get().messages[groupId]) {
                    set(state => ({
                        messages: { ...state.messages, [groupId]: [] },
                    }));
                }
            },

            leaveGroup: () => {
                set({ activeGroup: null, isConnected: false });
            },

            sendMessage: (groupId, message, username = 'Anonymous') => {
                const newMessage = {
                    id: `msg_${Date.now()}`,
                    username,
                    message,
                    timestamp: Date.now(),
                    isSupport: false,
                };

                set(state => ({
                    messages: {
                        ...state.messages,
                        [groupId]: [...(state.messages[groupId] || []), newMessage],
                    },
                }));

                return newMessage;
            },

            getMessages: (groupId) => {
                return get().messages[groupId] || [];
            },

            getGroup: (groupId) => {
                return get().supportGroups.find(g => g.id === groupId);
            },

            getActiveGroups: () => {
                return get().supportGroups.filter(g => g.activeUsers > 0);
            },

            blockUser: (username) => {
                set(state => ({
                    blockedUsers: [...state.blockedUsers, username],
                }));
            },

            unblockUser: (username) => {
                set(state => ({
                    blockedUsers: state.blockedUsers.filter(u => u !== username),
                }));
            },

            isBlocked: (username) => get().blockedUsers.includes(username),

            muteGroup: (groupId) => {
                set(state => ({
                    mutedGroups: state.mutedGroups.includes(groupId)
                        ? state.mutedGroups.filter(id => id !== groupId)
                        : [...state.mutedGroups, groupId],
                }));
            },

            isMuted: (groupId) => get().mutedGroups.includes(groupId),

            addSupportMessage: (groupId, message) => {
                const supportMessage = {
                    id: `support_${Date.now()}`,
                    username: 'RecoveryBot',
                    message,
                    timestamp: Date.now(),
                    isSupport: true,
                    isBot: true,
                };

                set(state => ({
                    messages: {
                        ...state.messages,
                        [groupId]: [...(state.messages[groupId] || []), supportMessage],
                    },
                }));
            },

            clearGroupMessages: (groupId) => {
                set(state => ({
                    messages: { ...state.messages, [groupId]: [] },
                }));
            },

            reset: () => set({
                activeGroup: null,
                isConnected: false,
                messages: SAMPLE_MESSAGES,
                blockedUsers: [],
                mutedGroups: [],
            }),
        }),
        {
            name: 'anchorone-live-support',
            storage: createJSONStorage(() => AsyncStorage),
            partialize: (state) => ({
                blockedUsers: state.blockedUsers,
                mutedGroups: state.mutedGroups,
            }),
        }
    )
);

export default useLiveSupportStore;

// --- End of liveSupportStore.js ---
