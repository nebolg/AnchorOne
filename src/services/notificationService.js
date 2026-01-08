// Author: -GLOBENXCC-
// OS support: iOS, Android
// Description: Notification service for scheduling and managing push notifications

import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { useNotificationStore, NOTIFICATION_TYPES } from '../store/notificationStore';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
    }),
});

export const notificationService = {
    async registerForPushNotifications() {
        let token;

        if (Platform.OS === 'android') {
            await Notifications.setNotificationChannelAsync('default', {
                name: 'Default',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#14B8A6',
            });

            await Notifications.setNotificationChannelAsync('reminders', {
                name: 'Reminders',
                importance: Notifications.AndroidImportance.HIGH,
                sound: 'default',
            });
        }

        if (Device.isDevice) {
            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;

            if (existingStatus !== 'granted') {
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }

            if (finalStatus !== 'granted') {
                console.log('Failed to get push token for push notification!');
                return null;
            }

            token = (await Notifications.getExpoPushTokenAsync()).data;
        } else {
            console.log('Must use physical device for Push Notifications');
        }

        return token;
    },

    async scheduleDailyCheckIn(time = '09:00') {
        const [hours, minutes] = time.split(':').map(Number);

        const trigger = {
            hour: hours,
            minute: minutes,
            repeats: true,
        };

        const id = await Notifications.scheduleNotificationAsync({
            content: {
                title: '☀️ Morning Check-in',
                body: 'How are you feeling today? Take a moment to check in with yourself.',
                data: { type: NOTIFICATION_TYPES.DAILY_CHECKIN },
                sound: 'default',
            },
            trigger,
        });

        return id;
    },

    async scheduleMoodCheckIns(times = ['12:00', '18:00']) {
        const ids = [];

        for (const time of times) {
            const [hours, minutes] = time.split(':').map(Number);

            const id = await Notifications.scheduleNotificationAsync({
                content: {
                    title: '💭 Mood Check-in',
                    body: 'How are you feeling right now?',
                    data: { type: NOTIFICATION_TYPES.MOOD_CHECKIN },
                },
                trigger: {
                    hour: hours,
                    minute: minutes,
                    repeats: true,
                },
            });

            ids.push(id);
        }

        return ids;
    },

    async scheduleChallengeReminder(time = '20:00') {
        const [hours, minutes] = time.split(':').map(Number);

        const id = await Notifications.scheduleNotificationAsync({
            content: {
                title: '🏆 Challenge Reminder',
                body: "Don't forget to log your challenge progress for today!",
                data: { type: NOTIFICATION_TYPES.CHALLENGE_REMINDER },
            },
            trigger: {
                hour: hours,
                minute: minutes,
                repeats: true,
            },
        });

        return id;
    },

    async scheduleWeeklySummary(dayOfWeek = 0, time = '10:00') {
        const [hours, minutes] = time.split(':').map(Number);

        const id = await Notifications.scheduleNotificationAsync({
            content: {
                title: '📊 Weekly Progress',
                body: 'See how far you\'ve come this week. Tap to view your summary.',
                data: { type: NOTIFICATION_TYPES.WEEKLY_SUMMARY },
            },
            trigger: {
                weekday: dayOfWeek + 1,
                hour: hours,
                minute: minutes,
                repeats: true,
            },
        });

        return id;
    },

    async sendMilestoneNotification(milestone) {
        await Notifications.scheduleNotificationAsync({
            content: {
                title: '🎉 Milestone Reached!',
                body: `Congratulations! You've reached ${milestone}. Keep going!`,
                data: { type: NOTIFICATION_TYPES.MILESTONE, milestone },
            },
            trigger: null,
        });
    },

    async sendCravingSupportNotification() {
        await Notifications.scheduleNotificationAsync({
            content: {
                title: '💪 We\'re here for you',
                body: 'Cravings are tough. Open the app for some coping tools.',
                data: { type: NOTIFICATION_TYPES.CRAVING_SUPPORT },
            },
            trigger: null,
        });
    },

    async sendInstantNotification(title, body, data = {}) {
        await Notifications.scheduleNotificationAsync({
            content: {
                title,
                body,
                data,
            },
            trigger: null,
        });
    },

    async cancelNotification(notificationId) {
        await Notifications.cancelScheduledNotificationAsync(notificationId);
    },

    async cancelAllNotifications() {
        await Notifications.cancelAllScheduledNotificationsAsync();
    },

    async getScheduledNotifications() {
        return await Notifications.getAllScheduledNotificationsAsync();
    },

    async setBadgeCount(count) {
        await Notifications.setBadgeCountAsync(count);
    },

    async getBadgeCount() {
        return await Notifications.getBadgeCountAsync();
    },

    addNotificationReceivedListener(callback) {
        return Notifications.addNotificationReceivedListener(callback);
    },

    addNotificationResponseReceivedListener(callback) {
        return Notifications.addNotificationResponseReceivedListener(callback);
    },
};

export default notificationService;

// --- End of notificationService.js ---
