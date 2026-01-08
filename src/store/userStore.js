// Author: -GLOBENXCC-
// OS support: iOS, Android, Web
// Description: User store managing profile, addictions, and onboarding state

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PREDEFINED_ADDICTIONS = [
    { id: 'alcohol', name: 'Alcohol', icon: 'wine', library: 'Ionicons', isCustom: false },
    { id: 'cigarettes', name: 'Cigarettes / Vape', icon: 'smoke-free', library: 'MaterialIcons', isCustom: false },
    { id: 'drugs', name: 'Drugs', icon: 'biotech', library: 'MaterialIcons', isCustom: false },
    { id: 'porn', icon: 'shield-lock', name: 'Porn', library: 'MaterialCommunityIcons', isCustom: false },
    { id: 'gambling', icon: 'dice-6', name: 'Gambling', library: 'MaterialCommunityIcons', isCustom: false },
    { id: 'gaming', icon: 'game-controller', name: 'Gaming', library: 'Ionicons', isCustom: false },
    { id: 'socialMedia', icon: 'phone-portrait', name: 'Social Media', library: 'Ionicons', isCustom: false },
    { id: 'sugar', icon: 'leaf', name: 'Sugar', library: 'Ionicons', isCustom: false },
];

const ICON_MIGRATION_MAP = {
    '🍺': { icon: 'wine', library: 'Ionicons' },
    '🚬': { icon: 'smoke-free', library: 'MaterialIcons' },
    '💊': { icon: 'biotech', library: 'MaterialIcons' },
    '🔞': { icon: 'shield-lock', library: 'MaterialCommunityIcons' },
    '🎰': { icon: 'dice-6', library: 'MaterialCommunityIcons' },
    '🎮': { icon: 'game-controller', library: 'Ionicons' },
    '📱': { icon: 'phone-portrait', library: 'Ionicons' },
    '🍭': { icon: 'leaf', library: 'Ionicons' },
};

const migrateAddiction = (addiction) => {
    if (addiction.icon && ICON_MIGRATION_MAP[addiction.icon]) {
        const migration = ICON_MIGRATION_MAP[addiction.icon];
        return { ...addiction, icon: migration.icon, library: migration.library };
    }
    return addiction;
};

export const useUserStore = create(
    persist(
        (set, get) => ({
            // User profile
            userId: null,
            username: null,
            isAnonymous: true,
            createdAt: null,
            avatarId: 'compass',
            avatarColor: '#14B8A6',
            avatarUrl: null,
            bio: '',
            catchphrase: '',
            lastUsernameChange: null,
            country: null,

            // Onboarding state
            hasCompletedOnboarding: false,
            currentOnboardingStep: 0,

            // User's selected addictions
            userAddictions: [],

            // User's intent for quitting
            intent: '',
            intentReasons: [],

            // Available addiction types
            availableAddictions: PREDEFINED_ADDICTIONS,

            // Actions
            setUser: (userId, username = null, isAnonymous = true) => set({
                userId,
                username,
                isAnonymous,
                createdAt: new Date().toISOString(),
            }),

            setUsername: (username) => set({ username, isAnonymous: false }),

            setAnonymous: (isAnonymous) => set({ isAnonymous }),

            addUserAddiction: (addictionId, startDate = new Date()) => {
                const { userAddictions, availableAddictions } = get();
                const addiction = availableAddictions.find(a => a.id === addictionId);
                if (!addiction || userAddictions.find(ua => ua.addictionId === addictionId)) return;

                set({
                    userAddictions: [
                        ...userAddictions,
                        {
                            id: addictionId,
                            addictionId,
                            name: addiction.name,
                            icon: addiction.icon,
                            library: addiction.library || 'Ionicons',
                            startDate: startDate.toISOString(),
                            active: true,
                        },
                    ],
                });
            },

            removeUserAddiction: (userAddictionId) => set(state => ({
                userAddictions: state.userAddictions.filter(ua => ua.id !== userAddictionId),
            })),

            toggleUserAddiction: (addictionId) => {
                const { userAddictions, availableAddictions } = get();
                const existing = userAddictions.find(ua => ua.addictionId === addictionId);

                if (existing) {
                    set({
                        userAddictions: userAddictions.filter(ua => ua.addictionId !== addictionId),
                    });
                } else {
                    const addiction = availableAddictions.find(a => a.id === addictionId);
                    if (addiction) {
                        set({
                            userAddictions: [
                                ...userAddictions,
                                {
                                    id: addictionId,
                                    addictionId,
                                    name: addiction.name,
                                    icon: addiction.icon,
                                    library: addiction.library || 'Ionicons',
                                    startDate: new Date().toISOString(),
                                    active: true,
                                },
                            ],
                        });
                    }
                }
            },

            addCustomAddiction: (name, icon = 'flash') => {
                const id = `custom_${Date.now()}`;
                set(state => ({
                    availableAddictions: [
                        ...state.availableAddictions,
                        { id, name, icon, isCustom: true },
                    ],
                }));
                return id;
            },

            setStartDate: (addictionId, startDate) => set(state => ({
                userAddictions: state.userAddictions.map(ua =>
                    ua.addictionId === addictionId
                        ? { ...ua, startDate: startDate.toISOString() }
                        : ua
                ),
            })),

            setIntent: (intent, reasons = []) => set({ intent, intentReasons: reasons }),

            completeOnboarding: () => set({
                hasCompletedOnboarding: true,
                userId: get().userId || `user_${Date.now()}`,
            }),

            loginWithGoogle: async (idToken) => {
                const { googleLogin } = require('../services/api').api;
                try {
                    const data = await googleLogin(idToken);
                    set({
                        userId: data.user.id,
                        username: data.user.username,
                        isAnonymous: false,
                        createdAt: data.user.createdAt,
                    });
                    return data.user;
                } catch (error) {
                    console.error('Google Login Store Error:', error);
                    throw error;
                }
            },

            setOnboardingStep: (step) => set({ currentOnboardingStep: step }),

            updateProfileStore: (userData) => set({
                username: userData.username,
                isAnonymous: userData.anonymous,
                avatarId: userData.avatar_id || 'compass',
                avatarColor: userData.avatar_color || '#14B8A6',
                avatarUrl: userData.avatar_url || null,
                bio: userData.bio || '',
                catchphrase: userData.catchphrase || '',
                lastUsernameChange: userData.last_username_change,
                country: userData.country || null,
            }),

            setCountry: (countryCode) => set({ country: countryCode }),

            syncProfile: async () => {
                try {
                    const { api } = require('../services/api');
                    const data = await api.getProfile();
                    if (data?.user) {
                        set({
                            username: data.user.username,
                            isAnonymous: data.user.anonymous,
                            avatarId: data.user.avatar_id || 'compass',
                            avatarColor: data.user.avatar_color || '#14B8A6',
                            avatarUrl: data.user.avatar_url || null,
                            bio: data.user.bio || '',
                            catchphrase: data.user.catchphrase || '',
                            lastUsernameChange: data.user.last_username_change,
                            country: data.user.country || null,
                        });
                    }
                } catch (error) {
                    console.log('[UserStore] Profile sync skipped:', error.message);
                }
            },

            resetUser: () => set({
                userId: null,
                username: null,
                isAnonymous: true,
                createdAt: null,
                avatarId: 'compass',
                avatarColor: '#14B8A6',
                avatarUrl: null,
                bio: '',
                catchphrase: '',
                lastUsernameChange: null,
                country: null,
                hasCompletedOnboarding: false,
                currentOnboardingStep: 0,
                userAddictions: [],
                intent: '',
                intentReasons: [],
            }),
        }),
        {
            name: 'anchorone-user-storage',
            storage: createJSONStorage(() => AsyncStorage),
            version: 2,
            migrate: (persistedState, version) => {
                if (version < 2) {
                    if (persistedState.userAddictions) {
                        persistedState.userAddictions = persistedState.userAddictions.map(migrateAddiction);
                    }
                    if (persistedState.availableAddictions) {
                        persistedState.availableAddictions = persistedState.availableAddictions.map(migrateAddiction);
                    }
                }
                return persistedState;
            },
        }
    )
);

export default useUserStore;

// --- End of userStore.js ---
