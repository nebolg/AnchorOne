// Author: -GLOBENXCC-
// OS support: iOS, Android, Web
// Description: Centralized notification copy constants for recovery-focused messaging

export const NOTIFICATION_COPY = {
    WELCOME: {
        title: 'Welcome to AnchorOne',
        body: 'This is a space for honesty, progress, and support.\nNo judgment. No pressure. Just one day at a time.',
        button: 'Get started',
    },

    MOOD_CHECKIN: {
        title: 'How are you feeling today?',
        helper: "There's no right or wrong answer. This helps you notice patterns over time.",
    },

    CRAVING_LOG: {
        title: 'Log a craving',
        helper: "This is for awareness, not judgment. You're doing your best.",
    },

    SLIP_LOG: {
        title: 'Had a slip?',
        helper: 'Log it honestly. Slips are part of learning, not failure.',
        confirmButton: 'Save and continue',
        cancelButton: 'Cancel',
    },

    SLIP_CONFIRMED: {
        title: 'Thank you for being honest',
        message: 'Your progress still matters.',
        button: 'Continue',
    },

    MILESTONE: {
        title: 'Milestone reached',
        getBody: (days) => `You've reached ${days} days. One step at a time still counts.`,
        button: 'Keep going',
    },

    WEEKLY_INSIGHT: {
        title: 'Your weekly insight',
        body: 'We noticed a few patterns that may help you understand your habits better.',
        button: 'View insights',
    },

    PATTERN_INSIGHT: {
        title: 'Pattern insight',
        body: "This is based on your recent logs. It's meant for reflection, not medical advice.",
    },

    FEEDBACK_REQUEST: {
        title: 'Help us improve AnchorOne',
        body: 'Would you like to share feedback about your experience so far?',
        primaryButton: 'Share feedback',
        secondaryButton: 'Maybe later',
    },

    RATE_APP: {
        title: 'Finding AnchorOne helpful?',
        body: 'If AnchorOne has supported you, a quick rating can help others find the same support.',
        primaryButton: 'Rate AnchorOne',
        secondaryButton: 'Not now',
    },

    UPDATE_AVAILABLE: {
        title: 'Update available',
        body: "We've made improvements to stability and progress tracking.",
        button: "See what's new",
    },

    CRISIS_SUPPORT: {
        title: 'Need extra support?',
        body: 'If things feel overwhelming, reaching out can help. Support resources are available.',
        button: 'View resources',
    },

    DAILY_REMINDER: {
        text: 'Just checking in. How are you feeling today?',
    },
};

export default NOTIFICATION_COPY;

// --- End of NotificationCopy.js ---
