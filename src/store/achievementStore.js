// Author: -GLOBENXCC-
// OS support: iOS, Android, Web
// Description: Store for achievement system with badges and milestones

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const ACHIEVEMENTS = [
    // Streak Achievements
    { id: 'first_day', name: 'First Step', description: 'Complete your first day', icon: 'footsteps', color: '#10B981', category: 'streak', requirement: { type: 'streak', days: 1 } },
    { id: 'one_week', name: 'Week Warrior', description: '7 days clean', icon: 'shield', color: '#3B82F6', category: 'streak', requirement: { type: 'streak', days: 7 } },
    { id: 'two_weeks', name: 'Fortnight Fighter', description: '14 days strong', icon: 'medal', color: '#8B5CF6', category: 'streak', requirement: { type: 'streak', days: 14 } },
    { id: 'one_month', name: 'Monthly Milestone', description: '30 days of progress', icon: 'trophy', color: '#F59E0B', category: 'streak', requirement: { type: 'streak', days: 30 } },
    { id: 'three_months', name: 'Quarterly Champion', description: '90 days clean', icon: 'ribbon', color: '#EC4899', category: 'streak', requirement: { type: 'streak', days: 90 } },
    { id: 'six_months', name: 'Half Year Hero', description: '180 days of freedom', icon: 'star', color: '#EF4444', category: 'streak', requirement: { type: 'streak', days: 180 } },
    { id: 'one_year', name: 'Year of Victory', description: '365 days transformed', icon: 'diamond', color: '#14B8A6', category: 'streak', requirement: { type: 'streak', days: 365 } },

    // Activity Achievements
    { id: 'first_journal', name: 'Pen to Paper', description: 'Write your first journal entry', icon: 'document-text', color: '#6366F1', category: 'activity', requirement: { type: 'journals', count: 1 } },
    { id: 'journal_regular', name: 'Reflective Mind', description: '10 journal entries', icon: 'book', color: '#8B5CF6', category: 'activity', requirement: { type: 'journals', count: 10 } },
    { id: 'journal_master', name: 'Journaling Master', description: '50 journal entries', icon: 'library', color: '#A855F7', category: 'activity', requirement: { type: 'journals', count: 50 } },

    { id: 'first_craving', name: 'Awareness Rising', description: 'Log your first craving', icon: 'flame', color: '#F97316', category: 'activity', requirement: { type: 'cravings', count: 1 } },
    { id: 'craving_tracker', name: 'Craving Tracker', description: '20 cravings logged', icon: 'analytics', color: '#EAB308', category: 'activity', requirement: { type: 'cravings', count: 20 } },

    { id: 'first_breathing', name: 'First Breath', description: 'Complete a breathing exercise', icon: 'leaf', color: '#22C55E', category: 'activity', requirement: { type: 'breathing', count: 1 } },
    { id: 'breathing_regular', name: 'Calm Mind', description: '10 breathing sessions', icon: 'flower', color: '#10B981', category: 'activity', requirement: { type: 'breathing', count: 10 } },

    // Community Achievements
    { id: 'first_post', name: 'Voice Found', description: 'Share your first post', icon: 'chatbubble', color: '#3B82F6', category: 'community', requirement: { type: 'posts', count: 1 } },
    { id: 'community_active', name: 'Community Builder', description: '10 posts shared', icon: 'people', color: '#6366F1', category: 'community', requirement: { type: 'posts', count: 10 } },
    { id: 'first_reaction', name: 'Supporting Others', description: 'React to someone\'s post', icon: 'heart', color: '#EC4899', category: 'community', requirement: { type: 'reactions', count: 1 } },
    { id: 'supporter', name: 'Community Supporter', description: '50 reactions given', icon: 'hand-left', color: '#F43F5E', category: 'community', requirement: { type: 'reactions', count: 50 } },

    // Challenge Achievements
    { id: 'first_challenge', name: 'Challenge Accepted', description: 'Join your first challenge', icon: 'flag', color: '#F59E0B', category: 'challenge', requirement: { type: 'challenges_joined', count: 1 } },
    { id: 'challenge_complete', name: 'Challenge Conqueror', description: 'Complete a challenge', icon: 'checkmark-done', color: '#10B981', category: 'challenge', requirement: { type: 'challenges_completed', count: 1 } },
    { id: 'challenge_master', name: 'Challenge Master', description: 'Complete 5 challenges', icon: 'podium', color: '#8B5CF6', category: 'challenge', requirement: { type: 'challenges_completed', count: 5 } },
];

export const useAchievementStore = create(
    persist(
        (set, get) => ({
            unlockedAchievements: [],
            stats: {
                totalDaysClean: 0,
                journalEntries: 0,
                cravingsLogged: 0,
                breathingSessions: 0,
                postsCreated: 0,
                reactionsGiven: 0,
                challengesJoined: 0,
                challengesCompleted: 0,
            },
            newUnlocks: [],

            updateStats: (statKey, value) => {
                set(state => ({
                    stats: {
                        ...state.stats,
                        [statKey]: value,
                    },
                }));
                get().checkAchievements();
            },

            incrementStat: (statKey, amount = 1) => {
                set(state => ({
                    stats: {
                        ...state.stats,
                        [statKey]: (state.stats[statKey] || 0) + amount,
                    },
                }));
                get().checkAchievements();
            },

            checkAchievements: () => {
                const { stats, unlockedAchievements } = get();
                const newUnlocks = [];

                ACHIEVEMENTS.forEach(achievement => {
                    if (unlockedAchievements.includes(achievement.id)) return;

                    let unlocked = false;
                    const req = achievement.requirement;

                    switch (req.type) {
                        case 'streak':
                            unlocked = stats.totalDaysClean >= req.days;
                            break;
                        case 'journals':
                            unlocked = stats.journalEntries >= req.count;
                            break;
                        case 'cravings':
                            unlocked = stats.cravingsLogged >= req.count;
                            break;
                        case 'breathing':
                            unlocked = stats.breathingSessions >= req.count;
                            break;
                        case 'posts':
                            unlocked = stats.postsCreated >= req.count;
                            break;
                        case 'reactions':
                            unlocked = stats.reactionsGiven >= req.count;
                            break;
                        case 'challenges_joined':
                            unlocked = stats.challengesJoined >= req.count;
                            break;
                        case 'challenges_completed':
                            unlocked = stats.challengesCompleted >= req.count;
                            break;
                    }

                    if (unlocked) {
                        newUnlocks.push(achievement.id);
                    }
                });

                if (newUnlocks.length > 0) {
                    set(state => ({
                        unlockedAchievements: [...state.unlockedAchievements, ...newUnlocks],
                        newUnlocks: [...state.newUnlocks, ...newUnlocks],
                    }));
                }
            },

            clearNewUnlocks: () => set({ newUnlocks: [] }),

            getAchievementProgress: (achievementId) => {
                const { stats } = get();
                const achievement = ACHIEVEMENTS.find(a => a.id === achievementId);
                if (!achievement) return null;

                const req = achievement.requirement;
                let current = 0;
                let total = 0;

                switch (req.type) {
                    case 'streak':
                        current = stats.totalDaysClean;
                        total = req.days;
                        break;
                    case 'journals':
                        current = stats.journalEntries;
                        total = req.count;
                        break;
                    case 'cravings':
                        current = stats.cravingsLogged;
                        total = req.count;
                        break;
                    case 'breathing':
                        current = stats.breathingSessions;
                        total = req.count;
                        break;
                    case 'posts':
                        current = stats.postsCreated;
                        total = req.count;
                        break;
                    case 'reactions':
                        current = stats.reactionsGiven;
                        total = req.count;
                        break;
                    case 'challenges_joined':
                        current = stats.challengesJoined;
                        total = req.count;
                        break;
                    case 'challenges_completed':
                        current = stats.challengesCompleted;
                        total = req.count;
                        break;
                }

                return {
                    current,
                    total,
                    percentage: Math.min((current / total) * 100, 100),
                    isComplete: current >= total,
                };
            },

            getUnlockedCount: () => get().unlockedAchievements.length,

            getTotalCount: () => ACHIEVEMENTS.length,

            getAchievementsByCategory: (category) => {
                return ACHIEVEMENTS.filter(a => a.category === category);
            },

            reset: () => set({
                unlockedAchievements: [],
                stats: {
                    totalDaysClean: 0,
                    journalEntries: 0,
                    cravingsLogged: 0,
                    breathingSessions: 0,
                    postsCreated: 0,
                    reactionsGiven: 0,
                    challengesJoined: 0,
                    challengesCompleted: 0,
                },
                newUnlocks: [],
            }),
        }),
        {
            name: 'anchorone-achievements',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);

export default useAchievementStore;

// --- End of achievementStore.js ---
