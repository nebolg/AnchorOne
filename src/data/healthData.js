// Author: -GLOBENXCC-
// OS support: iOS, Android, Web
// Description: Health improvement data by addiction type with scientific milestones

export const HEALTH_TIMELINES = {
    alcohol: {
        name: 'Alcohol',
        milestones: [
            { time: '8 hours', title: 'Blood Sugar Stabilizes', description: 'Blood sugar levels begin to normalize as your body processes the last of the alcohol.', icon: 'water' },
            { time: '24 hours', title: 'Blood Pressure Improves', description: 'Blood pressure starts to reduce. Risk of alcohol-related hypertension decreases.', icon: 'heart' },
            { time: '48 hours', title: 'Detox Begins', description: 'All alcohol has left your bloodstream. Liver begins to recover.', icon: 'fitness' },
            { time: '72 hours', title: 'Better Sleep', description: 'Sleep quality improves as REM cycles normalize.', icon: 'moon' },
            { time: '1 week', title: 'Hydration Restored', description: 'Skin looks healthier. Energy levels improve significantly.', icon: 'sunny' },
            { time: '2 weeks', title: 'Stomach Healing', description: 'Stomach lining begins to regenerate. Digestion improves.', icon: 'nutrition' },
            { time: '1 month', title: 'Liver Fat Reduces', description: 'Liver fat can reduce by up to 15%. Mental clarity improves.', icon: 'pulse' },
            { time: '3 months', title: 'Blood Cells Renew', description: 'Red blood cells fully regenerate. Immune system strengthens.', icon: 'shield-checkmark' },
            { time: '6 months', title: 'Brain Recovery', description: 'Brain grey matter begins to regenerate. Memory and focus improve.', icon: 'brain' },
            { time: '1 year', title: 'Major Organ Recovery', description: 'Risk of heart disease, stroke, and liver disease drops significantly.', icon: 'trophy' },
        ],
    },
    cigarettes: {
        name: 'Cigarettes / Vape',
        milestones: [
            { time: '20 minutes', title: 'Heart Rate Drops', description: 'Your heart rate and blood pressure begin to drop to normal levels.', icon: 'heart' },
            { time: '12 hours', title: 'Carbon Monoxide Clears', description: 'Carbon monoxide levels in blood return to normal. Oxygen levels increase.', icon: 'cloud' },
            { time: '24 hours', title: 'Heart Attack Risk Drops', description: 'Risk of heart attack begins to decrease.', icon: 'shield-checkmark' },
            { time: '48 hours', title: 'Nerve Endings Regenerate', description: 'Sense of smell and taste improve as nerve endings start regrowing.', icon: 'flower' },
            { time: '72 hours', title: 'Breathing Easier', description: 'Bronchial tubes relax, making breathing easier. Energy increases.', icon: 'fitness' },
            { time: '1 week', title: 'Circulation Improves', description: 'Blood circulation improves throughout the body.', icon: 'pulse' },
            { time: '2 weeks', title: 'Lung Function Up 30%', description: 'Lung function increases up to 30%. Physical activity becomes easier.', icon: 'trending-up' },
            { time: '1 month', title: 'Cilia Regrow', description: 'Tiny hair-like structures in lungs regrow, improving mucus clearance.', icon: 'leaf' },
            { time: '3 months', title: 'Circulation Restored', description: 'Circulation greatly improves. Walking becomes easier.', icon: 'walk' },
            { time: '9 months', title: 'Lungs Heal', description: 'Lungs significantly repaired. Coughing and shortness of breath decrease.', icon: 'medical' },
            { time: '1 year', title: 'Heart Disease Risk Halved', description: 'Risk of coronary heart disease is half that of a smoker.', icon: 'trophy' },
        ],
    },
    drugs: {
        name: 'Drugs',
        milestones: [
            { time: '24 hours', title: 'Body Begins Detox', description: 'Your body starts the natural detoxification process.', icon: 'water' },
            { time: '72 hours', title: 'Withdrawal Peak', description: 'Acute withdrawal symptoms may peak. Stay strong - this is temporary.', icon: 'fitness' },
            { time: '1 week', title: 'Sleep Improves', description: 'Natural sleep patterns begin to return.', icon: 'moon' },
            { time: '2 weeks', title: 'Energy Returns', description: 'Natural energy levels start to normalize.', icon: 'sunny' },
            { time: '1 month', title: 'Brain Chemistry Rebalancing', description: 'Dopamine receptors begin to heal. Mood stability improves.', icon: 'happy' },
            { time: '3 months', title: 'Cognitive Clarity', description: 'Memory, focus, and decision-making abilities improve significantly.', icon: 'bulb' },
            { time: '6 months', title: 'Emotional Regulation', description: 'Ability to handle stress and emotions naturally improves.', icon: 'heart' },
            { time: '1 year', title: 'Brain Healing', description: 'Significant brain recovery. New neural pathways strengthen.', icon: 'trophy' },
        ],
    },
    porn: {
        name: 'Porn',
        milestones: [
            { time: '1 week', title: 'Dopamine Reset Begins', description: 'Brain starts recalibrating dopamine sensitivity.', icon: 'refresh' },
            { time: '2 weeks', title: 'Reduced Cravings', description: 'Urges become less intense and less frequent.', icon: 'trending-down' },
            { time: '1 month', title: 'Improved Focus', description: 'Concentration and motivation improve as dopamine normalizes.', icon: 'bulb' },
            { time: '2 months', title: 'Emotional Connection', description: 'Ability to form deeper emotional connections improves.', icon: 'heart' },
            { time: '3 months', title: 'Brain Rewiring', description: 'New, healthier neural pathways become stronger.', icon: 'pulse' },
            { time: '6 months', title: 'Confidence Boost', description: 'Self-esteem and confidence significantly improve.', icon: 'star' },
            { time: '1 year', title: 'Full Recovery', description: 'Brain has significantly rewired. Healthy intimacy patterns established.', icon: 'trophy' },
        ],
    },
    gambling: {
        name: 'Gambling',
        milestones: [
            { time: '24 hours', title: 'First Day Free', description: 'Every moment gamble-free is money and stress saved.', icon: 'wallet' },
            { time: '1 week', title: 'Financial Clarity', description: 'Starting to see clearer picture of financial situation.', icon: 'calculator' },
            { time: '2 weeks', title: 'Reduced Anxiety', description: 'Financial stress begins to decrease. Sleep improves.', icon: 'moon' },
            { time: '1 month', title: 'Dopamine Healing', description: 'Brain reward system starts to recalibrate.', icon: 'happy' },
            { time: '3 months', title: 'Savings Growth', description: 'Noticeable financial recovery. New saving habits forming.', icon: 'trending-up' },
            { time: '6 months', title: 'Trust Rebuilding', description: 'Relationships begin to heal. Self-trust improves.', icon: 'people' },
            { time: '1 year', title: 'Financial Freedom', description: 'Significant financial recovery. Healthy money habits established.', icon: 'trophy' },
        ],
    },
    gaming: {
        name: 'Gaming',
        milestones: [
            { time: '24 hours', title: 'Dopamine Recalibration Begins', description: 'Brain starts adjusting to lower stimulation levels.', icon: 'refresh' },
            { time: '1 week', title: 'Better Sleep', description: 'Sleep quality improves without late-night gaming sessions.', icon: 'moon' },
            { time: '2 weeks', title: 'Real World Engagement', description: 'Finding more interest in offline activities.', icon: 'sunny' },
            { time: '1 month', title: 'Productivity Boost', description: 'More time for work, hobbies, and relationships.', icon: 'bulb' },
            { time: '3 months', title: 'Social Reconnection', description: 'Deeper in-person relationships developing.', icon: 'people' },
            { time: '6 months', title: 'New Hobbies', description: 'Healthy hobbies and interests now established.', icon: 'color-palette' },
            { time: '1 year', title: 'Balanced Life', description: 'Healthy relationship with leisure time. Full life balance achieved.', icon: 'trophy' },
        ],
    },
    socialMedia: {
        name: 'Social Media',
        milestones: [
            { time: '24 hours', title: 'FOMO Fades', description: 'Initial anxiety reduces. Present moment awareness increases.', icon: 'eye-off' },
            { time: '1 week', title: 'Attention Span Improves', description: 'Ability to focus for longer periods starts returning.', icon: 'bulb' },
            { time: '2 weeks', title: 'Better Sleep', description: 'No blue light before bed = improved sleep quality.', icon: 'moon' },
            { time: '1 month', title: 'Comparison Trap Breaks', description: 'Self-esteem improves without constant social comparison.', icon: 'happy' },
            { time: '3 months', title: 'Real Connections', description: 'Deeper, more meaningful in-person relationships.', icon: 'people' },
            { time: '6 months', title: 'Mental Clarity', description: 'Reduced anxiety and depression symptoms. More present.', icon: 'sunny' },
            { time: '1 year', title: 'Authentic Life', description: 'Living fully present. Healthy digital boundaries established.', icon: 'trophy' },
        ],
    },
    sugar: {
        name: 'Sugar',
        milestones: [
            { time: '24 hours', title: 'Blood Sugar Stabilizes', description: 'Blood sugar levels begin to normalize.', icon: 'pulse' },
            { time: '72 hours', title: 'Cravings Peak', description: 'Sugar cravings may peak. This is temporary withdrawal.', icon: 'flame' },
            { time: '1 week', title: 'Energy Levels Even', description: 'No more energy crashes. Stable energy throughout day.', icon: 'battery-charging' },
            { time: '2 weeks', title: 'Taste Buds Reset', description: 'Fruits taste sweeter. Natural flavors more enjoyable.', icon: 'nutrition' },
            { time: '1 month', title: 'Weight Loss', description: 'Reduced inflammation. Possible weight loss begins.', icon: 'fitness' },
            { time: '3 months', title: 'Skin Clears', description: 'Clearer skin. Reduced acne and inflammation.', icon: 'sunny' },
            { time: '6 months', title: 'Metabolic Health', description: 'Insulin sensitivity improves. Energy metabolism optimized.', icon: 'trending-up' },
            { time: '1 year', title: 'Optimal Health', description: 'Significantly reduced risk of diabetes, heart disease, and obesity.', icon: 'trophy' },
        ],
    },
};

export const getTimeInMs = (timeString) => {
    const [value, unit] = timeString.split(' ');
    const num = parseInt(value);
    const unitMap = {
        'minutes': 60 * 1000,
        'hours': 60 * 60 * 1000,
        'week': 7 * 24 * 60 * 60 * 1000,
        'weeks': 7 * 24 * 60 * 60 * 1000,
        'month': 30 * 24 * 60 * 60 * 1000,
        'months': 30 * 24 * 60 * 60 * 1000,
        'year': 365 * 24 * 60 * 60 * 1000,
    };
    return num * (unitMap[unit] || 24 * 60 * 60 * 1000);
};

export const getMilestoneStatus = (timeString, startDate) => {
    const start = new Date(startDate);
    const now = new Date();
    const elapsed = now - start;
    const required = getTimeInMs(timeString);
    return {
        completed: elapsed >= required,
        progress: Math.min(elapsed / required, 1),
    };
};

// --- End of healthData.js ---
