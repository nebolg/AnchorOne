// Author: -GLOBENXCC-
// OS support: iOS, Android, Web
// Description: Store for collecting and managing user feedback

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../services/api';

const FEEDBACK_TYPES = [
    { id: 'bug', label: 'Bug Report', icon: 'bug', color: '#EF4444' },
    { id: 'feature', label: 'Feature Request', icon: 'bulb', color: '#F59E0B' },
    { id: 'improvement', label: 'Improvement', icon: 'trending-up', color: '#10B981' },
    { id: 'content', label: 'Content Issue', icon: 'document-text', color: '#3B82F6' },
    { id: 'other', label: 'Other', icon: 'chatbubble', color: '#8B5CF6' },
];

const FEEDBACK_AREAS = [
    { id: 'home', label: 'Home Screen' },
    { id: 'progress', label: 'Progress Tracker' },
    { id: 'community', label: 'Community' },
    { id: 'insights', label: 'Insights' },
    { id: 'settings', label: 'Settings' },
    { id: 'support', label: 'Support/SOS' },
    { id: 'journal', label: 'Journal' },
    { id: 'challenges', label: 'Challenges' },
    { id: 'general', label: 'General/App-wide' },
];

export const useFeedbackStore = create(
    persist(
        (set, get) => ({
            feedbackList: [],
            isSubmitting: false,
            error: null,
            lastSubmittedAt: null,

            // Get feedback types
            getFeedbackTypes: () => FEEDBACK_TYPES,
            getFeedbackAreas: () => FEEDBACK_AREAS,

            // Submit new feedback
            submitFeedback: async (feedback) => {
                set({ isSubmitting: true, error: null });

                const newFeedback = {
                    id: Date.now().toString(),
                    ...feedback,
                    createdAt: new Date().toISOString(),
                    status: 'pending', // pending, reviewed, implemented, closed
                    deviceInfo: {
                        platform: 'mobile',
                        appVersion: '1.0.0',
                    },
                };

                try {
                    // Send to backend - feedback is stored privately (only devs can view)
                    await api.submitFeedback({
                        type: feedback.type,
                        area: feedback.area,
                        title: feedback.title,
                        description: feedback.description,
                        deviceInfo: newFeedback.deviceInfo,
                    });
                    console.log('[Feedback] Successfully submitted to server');
                } catch (e) {
                    // Backend not available, feedback still saved locally
                    console.log('[Feedback] Backend unavailable, stored locally only');
                }

                // Always save locally for user's history view
                set(state => ({
                    feedbackList: [newFeedback, ...state.feedbackList],
                    isSubmitting: false,
                    lastSubmittedAt: new Date().toISOString(),
                }));

                return newFeedback;
            },

            // Get user's submitted feedback
            getMyFeedback: () => {
                return get().feedbackList;
            },

            // Get feedback by type
            getFeedbackByType: (type) => {
                return get().feedbackList.filter(f => f.type === type);
            },

            // Update feedback status (for admin/dev use)
            updateFeedbackStatus: (feedbackId, status, response = null) => {
                set(state => ({
                    feedbackList: state.feedbackList.map(f =>
                        f.id === feedbackId
                            ? { ...f, status, response, updatedAt: new Date().toISOString() }
                            : f
                    ),
                }));
            },

            // Delete feedback
            deleteFeedback: (feedbackId) => {
                set(state => ({
                    feedbackList: state.feedbackList.filter(f => f.id !== feedbackId),
                }));
            },

            // Get stats
            getStats: () => {
                const { feedbackList } = get();
                return {
                    total: feedbackList.length,
                    pending: feedbackList.filter(f => f.status === 'pending').length,
                    reviewed: feedbackList.filter(f => f.status === 'reviewed').length,
                    implemented: feedbackList.filter(f => f.status === 'implemented').length,
                };
            },

            // Clear all feedback
            clearFeedback: () => set({ feedbackList: [], error: null }),
        }),
        {
            name: 'anchorone-feedback',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);

export { FEEDBACK_TYPES, FEEDBACK_AREAS };
export default useFeedbackStore;

// --- End of feedbackStore.js ---
