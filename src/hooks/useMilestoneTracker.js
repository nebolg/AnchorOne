// Author: -GLOBENXCC-
// OS support: iOS, Android, Web
// Description: Hook for detecting and tracking milestone achievements

import { useState, useEffect, useRef } from 'react';
import { useSobrietyStore, useUserStore } from '../store';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MILESTONES = [
    { days: 1, label: '1 Day', icon: 'leaf' },
    { days: 3, label: '3 Days', icon: 'water' },
    { days: 7, label: '1 Week', icon: 'shield-checkmark' },
    { days: 14, label: '2 Weeks', icon: 'flame' },
    { days: 30, label: '1 Month', icon: 'medal' },
    { days: 60, label: '2 Months', icon: 'ribbon' },
    { days: 90, label: '3 Months', icon: 'diamond' },
    { days: 180, label: '6 Months', icon: 'trophy' },
    { days: 365, label: '1 Year', icon: 'infinite' },
];

const STORAGE_KEY = 'anchorone-celebrated-milestones';

export const useMilestoneTracker = () => {
    const { userAddictions } = useUserStore();
    const getStreak = useSobrietyStore(state => state.getStreak);
    const sobrietyData = useSobrietyStore(state => state.sobrietyData);

    const [celebratedMilestones, setCelebratedMilestones] = useState({});
    const [pendingMilestone, setPendingMilestone] = useState(null);
    const hasLoadedRef = useRef(false);

    // Load celebrated milestones from storage
    useEffect(() => {
        const loadCelebratedMilestones = async () => {
            try {
                const stored = await AsyncStorage.getItem(STORAGE_KEY);
                if (stored) {
                    setCelebratedMilestones(JSON.parse(stored));
                }
                hasLoadedRef.current = true;
                console.log('[MilestoneTracker] Loaded celebrated milestones');
            } catch (error) {
                console.error('[MilestoneTracker] Error loading milestones:', error);
                hasLoadedRef.current = true;
            }
        };
        loadCelebratedMilestones();
    }, []);

    // Check for new milestones when sobrietyData changes
    useEffect(() => {
        if (!hasLoadedRef.current || userAddictions.length === 0) {
            console.log('[MilestoneTracker] Not ready:', { loaded: hasLoadedRef.current, addictions: userAddictions.length });
            return;
        }

        console.log('[MilestoneTracker] Checking milestones for', userAddictions.length, 'addictions');

        // Check each addiction for new milestones
        for (const addiction of userAddictions) {
            const streak = getStreak(addiction.id);
            console.log('[MilestoneTracker]', addiction.name, '- Days:', streak?.days);

            if (!streak || streak.days === 0) continue;

            // Find the highest milestone reached
            const reachedMilestones = MILESTONES.filter(m => streak.days >= m.days);
            if (reachedMilestones.length === 0) continue;

            const highestMilestone = reachedMilestones[reachedMilestones.length - 1];
            const milestoneKey = `${addiction.id}_${highestMilestone.days}`;

            console.log('[MilestoneTracker] Highest milestone:', highestMilestone.label, 'Key:', milestoneKey);
            console.log('[MilestoneTracker] Already celebrated?', !!celebratedMilestones[milestoneKey]);

            // Check if this milestone has been celebrated
            if (!celebratedMilestones[milestoneKey]) {
                // New milestone reached!
                console.log('[MilestoneTracker] 🎉 NEW MILESTONE:', highestMilestone.label, 'for', addiction.name);
                setPendingMilestone({
                    ...highestMilestone,
                    addictionId: addiction.id,
                    addictionName: addiction.name,
                    key: milestoneKey,
                });
                break; // Only show one at a time
            }
        }
    }, [userAddictions, celebratedMilestones, sobrietyData]);

    // Mark milestone as celebrated
    const celebrateMilestone = async () => {
        if (!pendingMilestone) return;

        const newCelebrated = {
            ...celebratedMilestones,
            [pendingMilestone.key]: new Date().toISOString(),
        };

        try {
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newCelebrated));
            setCelebratedMilestones(newCelebrated);
        } catch (error) {
            console.error('Error saving milestone:', error);
        }

        setPendingMilestone(null);
    };

    // Dismiss without celebrating (for testing or edge cases)
    const dismissMilestone = () => {
        setPendingMilestone(null);
    };

    // Get all milestones for an addiction
    const getMilestonesForAddiction = (addictionId) => {
        const streak = getStreak(addictionId);
        return MILESTONES.map(milestone => ({
            ...milestone,
            achieved: streak && streak.days >= milestone.days,
            celebrated: !!celebratedMilestones[`${addictionId}_${milestone.days}`],
        }));
    };

    return {
        pendingMilestone,
        celebrateMilestone,
        dismissMilestone,
        getMilestonesForAddiction,
        MILESTONES,
    };
};

export default useMilestoneTracker;

// --- End of useMilestoneTracker.js ---
