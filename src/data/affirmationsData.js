// Author: -GLOBENXCC-
// OS support: iOS, Android, Web
// Description: Daily affirmation data with categories and favorites

export const AFFIRMATION_CATEGORIES = [
    { id: 'strength', name: 'Strength', icon: 'shield', color: '#EF4444' },
    { id: 'hope', name: 'Hope', icon: 'sunny', color: '#F59E0B' },
    { id: 'self_love', name: 'Self Love', icon: 'heart', color: '#EC4899' },
    { id: 'progress', name: 'Progress', icon: 'trending-up', color: '#10B981' },
    { id: 'resilience', name: 'Resilience', icon: 'leaf', color: '#14B8A6' },
    { id: 'peace', name: 'Peace', icon: 'flower', color: '#8B5CF6' },
];

export const AFFIRMATIONS = [
    // Strength
    { id: 1, text: "I am stronger than my cravings. They will pass, and I will remain.", category: 'strength' },
    { id: 2, text: "Every challenge I face makes me stronger. I am building resilience.", category: 'strength' },
    { id: 3, text: "I have the power to choose my responses. I choose recovery.", category: 'strength' },
    { id: 4, text: "My past does not define me. My choices today shape my future.", category: 'strength' },
    { id: 5, text: "I am capable of overcoming any obstacle in my path.", category: 'strength' },

    // Hope
    { id: 6, text: "Each new day is a fresh start. I embrace new beginnings.", category: 'hope' },
    { id: 7, text: "Better days are ahead. I am moving toward a brighter future.", category: 'hope' },
    { id: 8, text: "I believe in my ability to create positive change in my life.", category: 'hope' },
    { id: 9, text: "Hope lives within me. I carry it with me wherever I go.", category: 'hope' },
    { id: 10, text: "My journey has purpose. Every step forward matters.", category: 'hope' },

    // Self Love
    { id: 11, text: "I am worthy of love, happiness, and a life free from addiction.", category: 'self_love' },
    { id: 12, text: "I forgive myself for my past. I am learning and growing.", category: 'self_love' },
    { id: 13, text: "I deserve compassion, especially from myself.", category: 'self_love' },
    { id: 14, text: "I am enough, exactly as I am right now.", category: 'self_love' },
    { id: 15, text: "I treat myself with the same kindness I would show a good friend.", category: 'self_love' },

    // Progress
    { id: 16, text: "Progress, not perfection. Every step forward counts.", category: 'progress' },
    { id: 17, text: "I celebrate my small victories. They add up to big changes.", category: 'progress' },
    { id: 18, text: "I am proud of how far I've come. I keep going.", category: 'progress' },
    { id: 19, text: "Each moment of resistance strengthens my resolve.", category: 'progress' },
    { id: 20, text: "I am making progress even when I can't see it.", category: 'progress' },

    // Resilience
    { id: 21, text: "Setbacks are not failures. They are opportunities to learn.", category: 'resilience' },
    { id: 22, text: "I bounce back from difficulties. I am resilient.", category: 'resilience' },
    { id: 23, text: "I adapt and overcome. Nothing can permanently defeat me.", category: 'resilience' },
    { id: 24, text: "My struggles have made me who I am. I am grateful for my journey.", category: 'resilience' },
    { id: 25, text: "I rise every time I fall. That is my strength.", category: 'resilience' },

    // Peace
    { id: 26, text: "I choose peace over chaos. I create calm in my life.", category: 'peace' },
    { id: 27, text: "I release what I cannot control. I focus on what I can.", category: 'peace' },
    { id: 28, text: "I breathe deeply and find stillness within.", category: 'peace' },
    { id: 29, text: "I am at peace with my journey and its pace.", category: 'peace' },
    { id: 30, text: "In this moment, I am safe. In this moment, I am okay.", category: 'peace' },

    // More affirmations
    { id: 31, text: "I take recovery one moment at a time.", category: 'progress' },
    { id: 32, text: "I am writing a new story. The best chapters are ahead.", category: 'hope' },
    { id: 33, text: "I deserve to be healthy and happy.", category: 'self_love' },
    { id: 34, text: "I have survived 100% of my worst days.", category: 'strength' },
    { id: 35, text: "My cravings are temporary. My commitment is permanent.", category: 'resilience' },
    { id: 36, text: "I am the author of my own story.", category: 'strength' },
    { id: 37, text: "I choose recovery every single day.", category: 'progress' },
    { id: 38, text: "I am becoming the best version of myself.", category: 'hope' },
    { id: 39, text: "I release shame and embrace growth.", category: 'self_love' },
    { id: 40, text: "Peace is my natural state. I return to it often.", category: 'peace' },
];

export const getRandomAffirmation = (category = null) => {
    const filtered = category
        ? AFFIRMATIONS.filter(a => a.category === category)
        : AFFIRMATIONS;
    return filtered[Math.floor(Math.random() * filtered.length)];
};

export const getDailyAffirmation = () => {
    const today = new Date();
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
    return AFFIRMATIONS[dayOfYear % AFFIRMATIONS.length];
};

export const getAffirmationsByCategory = (category) => {
    return AFFIRMATIONS.filter(a => a.category === category);
};

// --- End of affirmationsData.js ---
