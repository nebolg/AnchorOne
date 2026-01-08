// Author: -GLOBENXCC-
// OS support: iOS, Android, Web
// Description: Store for group challenges with progress tracking

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const CHALLENGE_TEMPLATES = [
    {
        id: '7_day_free',
        name: '7 Days Free',
        description: 'Complete 7 consecutive days without giving in',
        duration: 7,
        icon: 'calendar',
        color: '#10B981',
    },
    {
        id: '30_day_journey',
        name: '30 Day Journey',
        description: 'A full month of recovery progress',
        duration: 30,
        icon: 'trending-up',
        color: '#3B82F6',
    },
    {
        id: 'morning_routine',
        name: 'Morning Routine',
        description: 'Check in every morning for 14 days',
        duration: 14,
        icon: 'sunny',
        color: '#F59E0B',
    },
    {
        id: 'journal_habit',
        name: 'Daily Journal',
        description: 'Write a journal entry for 21 days',
        duration: 21,
        icon: 'document-text',
        color: '#8B5CF6',
    },
    {
        id: 'mindfulness_week',
        name: 'Mindfulness Week',
        description: 'Complete a breathing exercise daily for 7 days',
        duration: 7,
        icon: 'leaf',
        color: '#14B8A6',
    },
];

export const useChallengeStore = create(
    persist(
        (set, get) => ({
            activeChallenges: [],
            completedChallenges: [],
            dailyProgress: {},

            joinChallenge: (templateId, groupId = null) => {
                const template = CHALLENGE_TEMPLATES.find(t => t.id === templateId);
                if (!template) return null;

                const challenge = {
                    id: `challenge_${Date.now()}`,
                    templateId,
                    name: template.name,
                    description: template.description,
                    duration: template.duration,
                    icon: template.icon,
                    color: template.color,
                    groupId,
                    startDate: new Date().toISOString(),
                    endDate: new Date(Date.now() + template.duration * 24 * 60 * 60 * 1000).toISOString(),
                    progress: {},
                    status: 'active',
                };

                set(state => ({
                    activeChallenges: [...state.activeChallenges, challenge],
                }));

                return challenge;
            },

            logDailyProgress: (challengeId, completed = true, notes = '') => {
                const today = new Date().toISOString().split('T')[0];

                set(state => ({
                    activeChallenges: state.activeChallenges.map(c => {
                        if (c.id === challengeId) {
                            return {
                                ...c,
                                progress: {
                                    ...c.progress,
                                    [today]: { completed, notes, loggedAt: new Date().toISOString() },
                                },
                            };
                        }
                        return c;
                    }),
                }));
            },

            getChallengeProgress: (challengeId) => {
                const { activeChallenges, completedChallenges } = get();
                const challenge = [...activeChallenges, ...completedChallenges].find(c => c.id === challengeId);
                if (!challenge) return null;

                const completedDays = Object.values(challenge.progress).filter(p => p.completed).length;
                const percentage = (completedDays / challenge.duration) * 100;
                const remainingDays = challenge.duration - completedDays;

                return {
                    completedDays,
                    totalDays: challenge.duration,
                    percentage,
                    remainingDays,
                    isComplete: completedDays >= challenge.duration,
                };
            },

            completeChallenge: (challengeId) => {
                const { activeChallenges } = get();
                const challenge = activeChallenges.find(c => c.id === challengeId);

                if (challenge) {
                    set(state => ({
                        activeChallenges: state.activeChallenges.filter(c => c.id !== challengeId),
                        completedChallenges: [...state.completedChallenges, {
                            ...challenge,
                            status: 'completed',
                            completedAt: new Date().toISOString(),
                        }],
                    }));
                }
            },

            abandonChallenge: (challengeId) => {
                set(state => ({
                    activeChallenges: state.activeChallenges.filter(c => c.id !== challengeId),
                }));
            },

            getActiveChallenges: () => {
                const { activeChallenges } = get();
                return activeChallenges.filter(c => c.status === 'active');
            },

            getTodaysProgress: () => {
                const { activeChallenges } = get();
                const today = new Date().toISOString().split('T')[0];

                return activeChallenges.map(challenge => ({
                    challengeId: challenge.id,
                    name: challenge.name,
                    completed: challenge.progress[today]?.completed || false,
                }));
            },

            getStreak: (challengeId) => {
                const { activeChallenges } = get();
                const challenge = activeChallenges.find(c => c.id === challengeId);
                if (!challenge) return 0;

                let streak = 0;
                const today = new Date();

                for (let i = 0; i < challenge.duration; i++) {
                    const date = new Date(today);
                    date.setDate(date.getDate() - i);
                    const dateStr = date.toISOString().split('T')[0];

                    if (challenge.progress[dateStr]?.completed) {
                        streak++;
                    } else if (i > 0) {
                        break;
                    }
                }

                return streak;
            },

            reset: () => set({
                activeChallenges: [],
                completedChallenges: [],
                dailyProgress: {},
            }),
        }),
        {
            name: 'anchorone-challenges',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);

export default useChallengeStore;

// --- End of challengeStore.js ---
