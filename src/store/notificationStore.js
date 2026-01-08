// Author: -GLOBENXCC-
// OS support: iOS, Android, Web
// Description: Store for notification preferences and scheduled reminders

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const NOTIFICATION_TYPES = {
    DAILY_CHECKIN: 'daily_checkin',
    MILESTONE: 'milestone',
    CRAVING_SUPPORT: 'craving_support',
    WEEKLY_SUMMARY: 'weekly_summary',
    COMMUNITY_ACTIVITY: 'community_activity',
    CHALLENGE_REMINDER: 'challenge_reminder',
    MOOD_CHECKIN: 'mood_checkin',
};

export const useNotificationStore = create(
    persist(
        (set, get) => ({
            pushEnabled: false,
            permissionGranted: false,
            expoPushToken: null,

            preferences: {
                [NOTIFICATION_TYPES.DAILY_CHECKIN]: {
                    enabled: true,
                    time: '09:00',
                    title: 'Morning Check-in',
                    message: 'How are you feeling today? Take a moment to check in.',
                },
                [NOTIFICATION_TYPES.MILESTONE]: {
                    enabled: true,
                    title: 'Milestone Celebration',
                    message: "You've reached a new milestone!",
                },
                [NOTIFICATION_TYPES.CRAVING_SUPPORT]: {
                    enabled: true,
                    title: 'Here for you',
                    message: 'Feeling a craving? We have tools to help.',
                },
                [NOTIFICATION_TYPES.WEEKLY_SUMMARY]: {
                    enabled: true,
                    dayOfWeek: 0,
                    time: '10:00',
                    title: 'Weekly Progress',
                    message: 'See how far you\'ve come this week.',
                },
                [NOTIFICATION_TYPES.COMMUNITY_ACTIVITY]: {
                    enabled: false,
                    title: 'Community Update',
                    message: 'Someone responded to your post.',
                },
                [NOTIFICATION_TYPES.CHALLENGE_REMINDER]: {
                    enabled: true,
                    time: '20:00',
                    title: 'Challenge Reminder',
                    message: 'Don\'t forget to log your challenge progress!',
                },
                [NOTIFICATION_TYPES.MOOD_CHECKIN]: {
                    enabled: true,
                    times: ['12:00', '18:00'],
                    title: 'Mood Check-in',
                    message: 'How are you feeling right now?',
                },
            },

            notificationHistory: [],
            scheduledNotifications: [],

            setPushEnabled: (enabled) => set({ pushEnabled: enabled }),
            setPermissionGranted: (granted) => set({ permissionGranted: granted }),
            setExpoPushToken: (token) => set({ expoPushToken: token }),

            updatePreference: (type, updates) => {
                set(state => ({
                    preferences: {
                        ...state.preferences,
                        [type]: {
                            ...state.preferences[type],
                            ...updates,
                        },
                    },
                }));
            },

            toggleNotificationType: (type) => {
                set(state => ({
                    preferences: {
                        ...state.preferences,
                        [type]: {
                            ...state.preferences[type],
                            enabled: !state.preferences[type]?.enabled,
                        },
                    },
                }));
            },

            setNotificationTime: (type, time) => {
                set(state => ({
                    preferences: {
                        ...state.preferences,
                        [type]: {
                            ...state.preferences[type],
                            time,
                        },
                    },
                }));
            },

            addToHistory: (notification) => {
                const entry = {
                    id: `notif_${Date.now()}`,
                    ...notification,
                    receivedAt: new Date().toISOString(),
                    read: false,
                };
                set(state => ({
                    notificationHistory: [entry, ...state.notificationHistory].slice(0, 100),
                }));
            },

            markAsRead: (notificationId) => {
                set(state => ({
                    notificationHistory: state.notificationHistory.map(n =>
                        n.id === notificationId ? { ...n, read: true } : n
                    ),
                }));
            },

            markAllAsRead: () => {
                set(state => ({
                    notificationHistory: state.notificationHistory.map(n => ({ ...n, read: true })),
                }));
            },

            getUnreadCount: () => {
                const { notificationHistory } = get();
                return notificationHistory.filter(n => !n.read).length;
            },

            clearHistory: () => set({ notificationHistory: [] }),

            addScheduledNotification: (scheduledId, type, scheduledTime) => {
                set(state => ({
                    scheduledNotifications: [
                        ...state.scheduledNotifications,
                        { scheduledId, type, scheduledTime, createdAt: new Date().toISOString() },
                    ],
                }));
            },

            removeScheduledNotification: (scheduledId) => {
                set(state => ({
                    scheduledNotifications: state.scheduledNotifications.filter(
                        n => n.scheduledId !== scheduledId
                    ),
                }));
            },

            clearScheduledNotifications: () => set({ scheduledNotifications: [] }),

            reset: () => set({
                pushEnabled: false,
                permissionGranted: false,
                expoPushToken: null,
                notificationHistory: [],
                scheduledNotifications: [],
            }),
        }),
        {
            name: 'anchorone-notifications',
            storage: createJSONStorage(() => AsyncStorage),
            partialize: (state) => ({
                pushEnabled: state.pushEnabled,
                preferences: state.preferences,
                notificationHistory: state.notificationHistory.slice(0, 50),
            }),
        }
    )
);

export default useNotificationStore;

// --- End of notificationStore.js ---
