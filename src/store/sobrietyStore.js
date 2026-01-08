// Author: -GLOBENXCC-
// OS support: iOS, Android, Web
// Description: Fix for sobrietyStore - corrected typo in getStreak function

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { differenceInDays, differenceInHours, startOfDay } from 'date-fns';

export const useSobrietyStore = create(
    persist(
        (set, get) => ({
            // Sobriety logs per addiction
            // { [userAddictionId]: { logs: [...], currentStreak: {...} } }
            sobrietyData: {},

            // Mood logs
            moodLogs: [],

            // Journal entries
            journalEntries: [],

            // Get streak for a specific addiction
            getStreak: (userAddictionId) => {
                const { sobrietyData } = get();
                const data = sobrietyData[userAddictionId];
                if (!data) return { days: 0, hours: 0, minutes: 0, seconds: 0, isActive: false };

                const lastSlip = data.logs
                    .filter(log => log.status === 'slip')
                    .sort((a, b) => new Date(b.date) - new Date(a.date))[0];

                const startDate = lastSlip
                    ? new Date(lastSlip.date)
                    : new Date(data.startDate);

                const now = new Date();
                const totalSeconds = Math.floor((now - startDate) / 1000);

                const days = Math.floor(totalSeconds / (3600 * 24));
                const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
                const minutes = Math.floor((totalSeconds % 3600) / 60);
                const seconds = totalSeconds % 60;

                return { days, hours, minutes, seconds, isActive: true, startDate };
            },

            // Initialize sobriety tracking for an addiction
            initializeAddiction: (userAddictionId, startDate) => set(state => ({
                sobrietyData: {
                    ...state.sobrietyData,
                    [userAddictionId]: {
                        startDate: startDate || new Date().toISOString(),
                        logs: [],
                    },
                },
            })),

            // Bulk initialize multiple addictions
            initializeMultipleAddictions: (addictions, startDate) => set(state => {
                const newSobrietyData = { ...state.sobrietyData };
                addictions.forEach(addiction => {
                    if (!newSobrietyData[addiction.id]) {
                        newSobrietyData[addiction.id] = {
                            startDate: startDate || new Date().toISOString(),
                            logs: [],
                        };
                    }
                });
                return { sobrietyData: newSobrietyData };
            }),

            // Log daily check-in (clean or slip)
            logDay: (userAddictionId, status, note = '') => {
                const now = new Date().toISOString();
                const log = {
                    id: `log_${Date.now()}`,
                    date: now,
                    status, // 'clean' or 'slip'
                    note,
                };

                set(state => ({
                    sobrietyData: {
                        ...state.sobrietyData,
                        [userAddictionId]: {
                            ...state.sobrietyData[userAddictionId],
                            logs: [...(state.sobrietyData[userAddictionId]?.logs || []), log],
                        },
                    },
                }));

                return log;
            },

            // Log a slip (relapse) - doesn't delete streak, just pauses
            logSlip: (userAddictionId, reason = '', note = '') => {
                const now = new Date().toISOString();
                const slip = {
                    id: `slip_${Date.now()}`,
                    date: now,
                    status: 'slip',
                    reason,
                    note,
                };

                set(state => ({
                    sobrietyData: {
                        ...state.sobrietyData,
                        [userAddictionId]: {
                            ...state.sobrietyData[userAddictionId],
                            logs: [...(state.sobrietyData[userAddictionId]?.logs || []), slip],
                            // Reset start date for new streak
                            lastSlipDate: now,
                        },
                    },
                }));

                return slip;
            },

            // Restart after a slip
            restartStreak: (userAddictionId) => {
                const now = new Date().toISOString();
                set(state => ({
                    sobrietyData: {
                        ...state.sobrietyData,
                        [userAddictionId]: {
                            ...state.sobrietyData[userAddictionId],
                            startDate: now,
                        },
                    },
                }));
            },

            // Log a craving
            logCraving: (userAddictionId, intensity, mood = null, trigger = '') => {
                const craving = {
                    id: `craving_${Date.now()}`,
                    userAddictionId,
                    intensity, // 1-10
                    mood, // 1-5
                    trigger,
                    createdAt: new Date().toISOString(),
                };

                set(state => ({
                    cravingLogs: [...state.cravingLogs, craving],
                }));

                return craving;
            },

            // Log mood
            logMood: (mood, note = '') => {
                const moodEntry = {
                    id: `mood_${Date.now()}`,
                    mood, // 1-5
                    note,
                    createdAt: new Date().toISOString(),
                };

                set(state => ({
                    moodLogs: [...state.moodLogs, moodEntry],
                }));

                return moodEntry;
            },

            // Add journal entry
            addJournalEntry: (content, mood = null) => {
                const entry = {
                    id: `journal_${Date.now()}`,
                    content,
                    mood,
                    createdAt: new Date().toISOString(),
                };

                set(state => ({
                    journalEntries: [entry, ...state.journalEntries], // Newer first
                }));

                return entry;
            },

            // Delete journal entry
            deleteJournalEntry: (id) => set(state => ({
                journalEntries: state.journalEntries.filter(entry => entry.id !== id),
            })),

            // Get recent cravings for an addiction
            getRecentCravings: (userAddictionId, days = 7) => {
                const { cravingLogs } = get();
                const cutoff = new Date();
                cutoff.setDate(cutoff.getDate() - days);

                return cravingLogs.filter(c =>
                    c.userAddictionId === userAddictionId &&
                    new Date(c.createdAt) >= cutoff
                );
            },

            // Get milestone status
            getMilestones: (userAddictionId) => {
                const streak = get().getStreak(userAddictionId);
                const days = streak.days;

                return {
                    day1: days >= 1,
                    day3: days >= 3,
                    week1: days >= 7,
                    week2: days >= 14,
                    month1: days >= 30,
                    month2: days >= 60,
                    month3: days >= 90,
                    month6: days >= 180,
                    year1: days >= 365,
                };
            },

            // Reset all data
            resetSobriety: () => set({
                sobrietyData: {},
                cravingLogs: [],
                moodLogs: [],
                journalEntries: [],
            }),

            // Delete specific addiction data
            deleteSobrietyData: (userAddictionId) => set(state => {
                const newSobrietyData = { ...state.sobrietyData };
                delete newSobrietyData[userAddictionId];

                return {
                    sobrietyData: newSobrietyData,
                    cravingLogs: state.cravingLogs.filter(c => c.userAddictionId !== userAddictionId),
                };
            }),
        }),
        {
            name: 'anchorone-sobriety-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);

export default useSobrietyStore;

// --- End of sobrietyStore.js ---
