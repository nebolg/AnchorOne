// Author: -GLOBENXCC-
// OS support: iOS, Android, Web
// Description: Store for offline data sync and connectivity management

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

export const useSyncStore = create(
    persist(
        (set, get) => ({
            isOnline: true,
            lastSyncTime: null,
            pendingActions: [],
            syncInProgress: false,
            syncError: null,
            autoSyncEnabled: true,

            setOnlineStatus: (isOnline) => {
                set({ isOnline });
                if (isOnline && get().autoSyncEnabled) {
                    get().syncPendingActions();
                }
            },

            addPendingAction: (action) => {
                const pendingAction = {
                    id: `action_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                    ...action,
                    createdAt: new Date().toISOString(),
                    retryCount: 0,
                };

                set(state => ({
                    pendingActions: [...state.pendingActions, pendingAction],
                }));

                if (get().isOnline && get().autoSyncEnabled) {
                    get().syncPendingActions();
                }

                return pendingAction.id;
            },

            removePendingAction: (actionId) => {
                set(state => ({
                    pendingActions: state.pendingActions.filter(a => a.id !== actionId),
                }));
            },

            syncPendingActions: async () => {
                const { pendingActions, syncInProgress, isOnline } = get();

                if (syncInProgress || !isOnline || pendingActions.length === 0) {
                    return;
                }

                set({ syncInProgress: true, syncError: null });

                const results = {
                    synced: [],
                    failed: [],
                };

                for (const action of pendingActions) {
                    try {
                        await get().executeAction(action);
                        results.synced.push(action.id);
                    } catch (error) {
                        console.error(`Failed to sync action ${action.id}:`, error);
                        results.failed.push({ id: action.id, error: error.message });

                        set(state => ({
                            pendingActions: state.pendingActions.map(a =>
                                a.id === action.id
                                    ? { ...a, retryCount: a.retryCount + 1, lastError: error.message }
                                    : a
                            ),
                        }));
                    }
                }

                set(state => ({
                    pendingActions: state.pendingActions.filter(a => !results.synced.includes(a.id)),
                    syncInProgress: false,
                    lastSyncTime: results.synced.length > 0 ? new Date().toISOString() : state.lastSyncTime,
                }));

                return results;
            },

            executeAction: async (action) => {
                switch (action.type) {
                    case 'CREATE_POST':
                    case 'UPDATE_POST':
                    case 'DELETE_POST':
                    case 'CREATE_COMMENT':
                    case 'LOG_CRAVING':
                    case 'LOG_SLIP':
                    case 'LOG_MOOD':
                    case 'UPDATE_PROFILE':
                        console.log(`Syncing action: ${action.type}`);
                        await new Promise(resolve => setTimeout(resolve, 100));
                        break;
                    default:
                        console.log(`Unknown action type: ${action.type}`);
                }
            },

            getPendingActionsCount: () => get().pendingActions.length,

            getLastSyncTimeFormatted: () => {
                const { lastSyncTime } = get();
                if (!lastSyncTime) return 'Never';

                const date = new Date(lastSyncTime);
                const now = new Date();
                const diffMs = now - date;
                const diffMins = Math.floor(diffMs / 60000);

                if (diffMins < 1) return 'Just now';
                if (diffMins < 60) return `${diffMins}m ago`;
                if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
                return `${Math.floor(diffMins / 1440)}d ago`;
            },

            setAutoSyncEnabled: (enabled) => set({ autoSyncEnabled: enabled }),

            clearPendingActions: () => set({ pendingActions: [] }),

            clearSyncError: () => set({ syncError: null }),

            initializeConnectivityListener: () => {
                const unsubscribe = NetInfo.addEventListener(state => {
                    get().setOnlineStatus(state.isConnected);
                });
                return unsubscribe;
            },

            reset: () => set({
                isOnline: true,
                lastSyncTime: null,
                pendingActions: [],
                syncInProgress: false,
                syncError: null,
                autoSyncEnabled: true,
            }),
        }),
        {
            name: 'anchorone-sync',
            storage: createJSONStorage(() => AsyncStorage),
            partialize: (state) => ({
                pendingActions: state.pendingActions,
                lastSyncTime: state.lastSyncTime,
                autoSyncEnabled: state.autoSyncEnabled,
            }),
        }
    )
);

export default useSyncStore;

// --- End of syncStore.js ---
