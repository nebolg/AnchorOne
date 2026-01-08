// Author: -GLOBENXCC-
// OS support: iOS, Android, Web
// Description: Store for tracking money saved based on addiction costs

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Research-based average daily costs (USD, 2024 data)
// Sources: americanaddictioncenters.org, quitgamble.com, singlecare.com
const DEFAULT_COSTS = {
    alcohol: { daily: 10, label: 'Alcohol', unit: 'per day', description: 'Based on 2-3 drinks/day average' },
    cigarettes: { daily: 10, label: 'Cigarettes / Vape', unit: 'per day', description: 'Based on 1 pack/day average' },
    drugs: { daily: 35, label: 'Drugs', unit: 'per day', description: 'Varies significantly by substance' },
    porn: { daily: 0, label: 'Porn', unit: 'per day', description: 'Set your subscription costs' },
    gambling: { daily: 50, label: 'Gambling', unit: 'per day', description: 'Recreational to problem range' },
    gaming: { daily: 3, label: 'Gaming', unit: 'per day', description: 'In-app purchases & subscriptions' },
    socialMedia: { daily: 0, label: 'Social Media', unit: 'per day', description: 'Time cost, not financial' },
    sugar: { daily: 8, label: 'Sugar/Junk Food', unit: 'per day', description: 'Snacks, candy, sodas' },
    caffeine: { daily: 6, label: 'Caffeine', unit: 'per day', description: 'Coffee, energy drinks' },
    shopping: { daily: 25, label: 'Impulse Shopping', unit: 'per day', description: 'Unnecessary purchases' },
    cannabis: { daily: 15, label: 'Cannabis', unit: 'per day', description: 'Average recreational use' },
    nicotine: { daily: 8, label: 'Nicotine (Other)', unit: 'per day', description: 'Patches, gum, pouches' },
};

export const useMoneySavedStore = create(
    persist(
        (set, get) => ({
            costs: DEFAULT_COSTS,
            currency: 'USD',
            currencySymbol: '$',

            setCost: (addictionId, dailyCost) => set(state => ({
                costs: {
                    ...state.costs,
                    [addictionId]: {
                        ...state.costs[addictionId],
                        daily: dailyCost,
                    },
                },
            })),

            setCurrency: (currency, symbol) => set({
                currency,
                currencySymbol: symbol,
            }),

            calculateSavings: (addictionId, startDate) => {
                const { costs } = get();
                const cost = costs[addictionId]?.daily || 0;
                if (!startDate || cost === 0) return 0;

                const start = new Date(startDate);
                const now = new Date();
                const diffTime = Math.abs(now - start);
                const diffDays = diffTime / (1000 * 60 * 60 * 24);

                return cost * diffDays;
            },

            calculateTotalSavings: (userAddictions) => {
                const { calculateSavings } = get();
                let total = 0;

                userAddictions.forEach(addiction => {
                    total += calculateSavings(addiction.addictionId, addiction.startDate);
                });

                return total;
            },

            formatCurrency: (amount) => {
                const { currencySymbol } = get();
                return `${currencySymbol}${amount.toFixed(2)}`;
            },

            resetCosts: () => set({ costs: DEFAULT_COSTS }),
        }),
        {
            name: 'anchorone-money-saved',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);

export default useMoneySavedStore;

// --- End of moneySavedStore.js ---
