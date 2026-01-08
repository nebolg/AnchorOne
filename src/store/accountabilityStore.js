// Author: -GLOBENXCC-
// OS support: iOS, Android, Web
// Description: Store for accountability partners and buddy system

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useAccountabilityStore = create(
    persist(
        (set, get) => ({
            partners: [],
            pendingRequests: [],
            checkIns: [],
            lastNotified: null,

            addPartner: (partner) => {
                set(state => ({
                    partners: [...state.partners, {
                        ...partner,
                        addedAt: new Date().toISOString(),
                        status: 'active',
                    }],
                }));
            },

            removePartner: (partnerId) => {
                set(state => ({
                    partners: state.partners.filter(p => p.id !== partnerId),
                }));
            },

            addPendingRequest: (request) => {
                set(state => ({
                    pendingRequests: [...state.pendingRequests, {
                        ...request,
                        requestedAt: new Date().toISOString(),
                        status: 'pending',
                    }],
                }));
            },

            acceptRequest: (requestId) => {
                const { pendingRequests } = get();
                const request = pendingRequests.find(r => r.id === requestId);
                if (request) {
                    set(state => ({
                        pendingRequests: state.pendingRequests.filter(r => r.id !== requestId),
                        partners: [...state.partners, {
                            id: request.fromUserId,
                            username: request.fromUsername,
                            avatarId: request.fromAvatarId,
                            avatarColor: request.fromAvatarColor,
                            addedAt: new Date().toISOString(),
                            status: 'active',
                        }],
                    }));
                }
            },

            declineRequest: (requestId) => {
                set(state => ({
                    pendingRequests: state.pendingRequests.filter(r => r.id !== requestId),
                }));
            },

            logCheckIn: (partnerId, message = '') => {
                const checkIn = {
                    id: `checkin_${Date.now()}`,
                    partnerId,
                    message,
                    timestamp: new Date().toISOString(),
                    type: 'sent',
                };
                set(state => ({
                    checkIns: [checkIn, ...state.checkIns].slice(0, 200),
                }));
                return checkIn;
            },

            receiveCheckIn: (partnerId, message = '') => {
                const checkIn = {
                    id: `checkin_${Date.now()}`,
                    partnerId,
                    message,
                    timestamp: new Date().toISOString(),
                    type: 'received',
                };
                set(state => ({
                    checkIns: [checkIn, ...state.checkIns].slice(0, 200),
                }));
            },

            getCheckInsWithPartner: (partnerId) => {
                const { checkIns } = get();
                return checkIns.filter(c => c.partnerId === partnerId);
            },

            getPartnerById: (partnerId) => {
                const { partners } = get();
                return partners.find(p => p.id === partnerId);
            },

            getActivePartners: () => {
                const { partners } = get();
                return partners.filter(p => p.status === 'active');
            },

            setLastNotified: () => {
                set({ lastNotified: new Date().toISOString() });
            },

            shouldNotifyPartners: () => {
                const { lastNotified, partners } = get();
                if (partners.length === 0) return false;
                if (!lastNotified) return true;

                const hoursSinceNotify = (Date.now() - new Date(lastNotified).getTime()) / (1000 * 60 * 60);
                return hoursSinceNotify >= 24;
            },

            reset: () => set({
                partners: [],
                pendingRequests: [],
                checkIns: [],
                lastNotified: null,
            }),
        }),
        {
            name: 'anchorone-accountability',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);

export default useAccountabilityStore;

// --- End of accountabilityStore.js ---
