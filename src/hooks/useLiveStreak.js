// Author: -GLOBENXCC-
// OS support: iOS, Android, Web
// Description: Custom hook to provide real-time streak updates every second

import { useState, useEffect } from 'react';
import { useSobrietyStore } from '../store';

export const useLiveStreak = (userAddictionId) => {
    const getStreak = useSobrietyStore(state => state.getStreak);
    const [streak, setStreak] = useState(getStreak(userAddictionId));

    useEffect(() => {
        if (!userAddictionId) return;

        // Update immediately
        setStreak(getStreak(userAddictionId));

        // Set up interval for per-second updates
        const interval = setInterval(() => {
            setStreak(getStreak(userAddictionId));
        }, 1000);

        return () => clearInterval(interval);
    }, [userAddictionId, getStreak]);

    return streak;
};

export default useLiveStreak;

// --- End of useLiveStreak.js ---
