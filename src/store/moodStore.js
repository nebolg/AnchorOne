// Author: -GLOBENXCC-
// OS support: iOS, Android, Web
// Description: Store for mood tracking with sleep and energy levels

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const MOODS = [
    { id: 1, label: 'Great', icon: 'happy', color: '#10B981' },
    { id: 2, label: 'Good', icon: 'happy-outline', color: '#34D399' },
    { id: 3, label: 'Okay', icon: 'remove-circle', color: '#FBBF24' },
    { id: 4, label: 'Low', icon: 'sad-outline', color: '#F97316' },
    { id: 5, label: 'Struggling', icon: 'sad', color: '#EF4444' },
];

export const useMoodStore = create(
    persist(
        (set, get) => ({
            moodEntries: [],
            lastCheckIn: null,

            logMood: (moodId, sleepQuality = null, energyLevel = null, notes = '') => {
                const entry = {
                    id: `mood_${Date.now()}`,
                    moodId,
                    sleepQuality,
                    energyLevel,
                    notes,
                    timestamp: new Date().toISOString(),
                    timeOfDay: getTimeOfDay(),
                };

                set(state => ({
                    moodEntries: [entry, ...state.moodEntries].slice(0, 500),
                    lastCheckIn: new Date().toISOString(),
                }));

                return entry;
            },

            getTodaysMoods: () => {
                const { moodEntries } = get();
                const today = new Date().toDateString();
                return moodEntries.filter(e => new Date(e.timestamp).toDateString() === today);
            },

            getWeeklyMoods: () => {
                const { moodEntries } = get();
                const weekAgo = new Date();
                weekAgo.setDate(weekAgo.getDate() - 7);
                return moodEntries.filter(e => new Date(e.timestamp) >= weekAgo);
            },

            getAverageMood: (days = 7) => {
                const { moodEntries } = get();
                const cutoff = new Date();
                cutoff.setDate(cutoff.getDate() - days);

                const recent = moodEntries.filter(e => new Date(e.timestamp) >= cutoff);
                if (recent.length === 0) return null;

                const avg = recent.reduce((sum, e) => sum + e.moodId, 0) / recent.length;
                return avg;
            },

            getAverageSleep: (days = 7) => {
                const { moodEntries } = get();
                const cutoff = new Date();
                cutoff.setDate(cutoff.getDate() - days);

                const recent = moodEntries.filter(e =>
                    new Date(e.timestamp) >= cutoff && e.sleepQuality !== null
                );
                if (recent.length === 0) return null;

                const avg = recent.reduce((sum, e) => sum + e.sleepQuality, 0) / recent.length;
                return avg;
            },

            getAverageEnergy: (days = 7) => {
                const { moodEntries } = get();
                const cutoff = new Date();
                cutoff.setDate(cutoff.getDate() - days);

                const recent = moodEntries.filter(e =>
                    new Date(e.timestamp) >= cutoff && e.energyLevel !== null
                );
                if (recent.length === 0) return null;

                const avg = recent.reduce((sum, e) => sum + e.energyLevel, 0) / recent.length;
                return avg;
            },

            getMoodTrend: () => {
                const { moodEntries } = get();
                if (moodEntries.length < 7) return 'insufficient';

                const thisWeek = get().getAverageMood(7);
                const lastWeek = (() => {
                    const twoWeeksAgo = new Date();
                    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
                    const weekAgo = new Date();
                    weekAgo.setDate(weekAgo.getDate() - 7);

                    const entries = moodEntries.filter(e => {
                        const date = new Date(e.timestamp);
                        return date >= twoWeeksAgo && date < weekAgo;
                    });
                    if (entries.length === 0) return null;
                    return entries.reduce((sum, e) => sum + e.moodId, 0) / entries.length;
                })();

                if (!lastWeek) return 'insufficient';

                const diff = thisWeek - lastWeek;
                if (diff < -0.5) return 'improving';
                if (diff > 0.5) return 'declining';
                return 'stable';
            },

            shouldShowCheckIn: () => {
                const { lastCheckIn } = get();
                if (!lastCheckIn) return true;

                const lastDate = new Date(lastCheckIn);
                const now = new Date();
                const hoursSinceLastCheckIn = (now - lastDate) / (1000 * 60 * 60);

                return hoursSinceLastCheckIn >= 8;
            },

            reset: () => set({ moodEntries: [], lastCheckIn: null }),
        }),
        {
            name: 'anchorone-mood',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);

const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 17) return 'afternoon';
    return 'evening';
};

export default useMoodStore;

// --- End of moodStore.js ---
