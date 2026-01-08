// Author: -GLOBENXCC-
// OS support: iOS, Android, Web
// Description: Store for trigger management with coping strategies

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const DEFAULT_TRIGGERS = [
    { id: 'stress', name: 'Stress', icon: 'flash', color: '#EF4444' },
    { id: 'boredom', name: 'Boredom', icon: 'time', color: '#F97316' },
    { id: 'social', name: 'Social Pressure', icon: 'people', color: '#8B5CF6' },
    { id: 'emotions', name: 'Strong Emotions', icon: 'heart', color: '#EC4899' },
    { id: 'loneliness', name: 'Loneliness', icon: 'person', color: '#6366F1' },
    { id: 'celebration', name: 'Celebration', icon: 'sparkles', color: '#F59E0B' },
    { id: 'tired', name: 'Tired/Exhausted', icon: 'moon', color: '#3B82F6' },
    { id: 'hungry', name: 'Hungry', icon: 'restaurant', color: '#10B981' },
];

export const DEFAULT_COPING_STRATEGIES = [
    { id: 'breathe', name: 'Deep Breathing', icon: 'leaf', duration: '5 min' },
    { id: 'walk', name: 'Take a Walk', icon: 'walk', duration: '10 min' },
    { id: 'call', name: 'Call a Friend', icon: 'call', duration: '15 min' },
    { id: 'journal', name: 'Write in Journal', icon: 'document-text', duration: '10 min' },
    { id: 'music', name: 'Listen to Music', icon: 'musical-notes', duration: '10 min' },
    { id: 'meditation', name: 'Meditate', icon: 'flower', duration: '10 min' },
    { id: 'exercise', name: 'Quick Exercise', icon: 'fitness', duration: '15 min' },
    { id: 'water', name: 'Drink Water', icon: 'water', duration: '2 min' },
    { id: 'distraction', name: 'Play a Game', icon: 'game-controller', duration: '10 min' },
    { id: 'grounding', name: '5-4-3-2-1 Technique', icon: 'hand-left', duration: '5 min' },
];

export const useTriggerStore = create(
    persist(
        (set, get) => ({
            triggers: DEFAULT_TRIGGERS,
            customTriggers: [],
            triggerProfiles: {},
            copingHistory: [],

            addCustomTrigger: (name, icon = 'flag', color = '#6B7280') => {
                const id = `custom_${Date.now()}`;
                const newTrigger = { id, name, icon, color, isCustom: true };
                set(state => ({
                    customTriggers: [...state.customTriggers, newTrigger],
                }));
                return id;
            },

            removeCustomTrigger: (triggerId) => {
                set(state => ({
                    customTriggers: state.customTriggers.filter(t => t.id !== triggerId),
                }));
            },

            setTriggerCopingPlan: (triggerId, strategies, notes = '') => {
                set(state => ({
                    triggerProfiles: {
                        ...state.triggerProfiles,
                        [triggerId]: {
                            strategies,
                            notes,
                            updatedAt: new Date().toISOString(),
                        },
                    },
                }));
            },

            getTriggerProfile: (triggerId) => {
                const { triggerProfiles } = get();
                return triggerProfiles[triggerId] || { strategies: [], notes: '' };
            },

            logCopingAttempt: (triggerId, strategyId, successful) => {
                const entry = {
                    id: `cope_${Date.now()}`,
                    triggerId,
                    strategyId,
                    successful,
                    timestamp: new Date().toISOString(),
                };
                set(state => ({
                    copingHistory: [entry, ...state.copingHistory].slice(0, 500),
                }));
            },

            getStrategySuccessRate: (strategyId) => {
                const { copingHistory } = get();
                const attempts = copingHistory.filter(c => c.strategyId === strategyId);
                if (attempts.length === 0) return null;
                const successful = attempts.filter(c => c.successful).length;
                return (successful / attempts.length) * 100;
            },

            getTriggerFrequency: () => {
                const { copingHistory } = get();
                const weekAgo = new Date();
                weekAgo.setDate(weekAgo.getDate() - 7);

                const frequency = {};
                copingHistory
                    .filter(c => new Date(c.timestamp) >= weekAgo)
                    .forEach(c => {
                        frequency[c.triggerId] = (frequency[c.triggerId] || 0) + 1;
                    });

                return Object.entries(frequency)
                    .sort((a, b) => b[1] - a[1])
                    .map(([triggerId, count]) => ({ triggerId, count }));
            },

            getAllTriggers: () => {
                const { triggers, customTriggers } = get();
                return [...triggers, ...customTriggers];
            },

            reset: () => set({
                customTriggers: [],
                triggerProfiles: {},
                copingHistory: [],
            }),
        }),
        {
            name: 'anchorone-triggers',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);

export default useTriggerStore;

// --- End of triggerStore.js ---
