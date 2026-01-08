// Author: -GLOBENXCC-
// OS support: iOS, Android, Web
// Description: Store for success stories library with curated recovery stories

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CURATED_STORIES = [
    {
        id: 'story_1',
        author: 'Anonymous Warrior',
        avatar: 'shield',
        addiction: 'Alcohol',
        cleanDays: 547,
        title: 'Finding Light in the Darkness',
        excerpt: 'After 15 years of drinking, I never thought I could go a single day without alcohol...',
        content: `After 15 years of drinking, I never thought I could go a single day without alcohol. It started casually in college and slowly consumed my entire life. I lost my marriage, almost lost my kids, and hit rock bottom.

The turning point came when my daughter looked at me with tears in her eyes and said, "Daddy, please stop." That moment broke something inside me and rebuilt it at the same time.

Recovery wasn't linear. I had setbacks. I had moments of weakness. But I learned that each day is a new opportunity. I found a community that understood me without judgment. I discovered that the strength I thought alcohol gave me was actually inside me all along.

Now, 547 days clean, I'm rebuilding my relationship with my kids. I wake up clear-headed. I'm present for the moments that matter. If you're reading this on day 1, know that it gets better. The first week is the hardest, but you're stronger than you think.`,
        tags: ['family', 'hope', 'rebuild'],
        likes: 234,
        featured: true,
        createdAt: '2025-06-15',
    },
    {
        id: 'story_2',
        author: 'Journey2Freedom',
        avatar: 'leaf',
        addiction: 'Smoking',
        cleanDays: 365,
        title: 'One Year Smoke-Free: My Journey',
        excerpt: 'I smoked for 20 years. One pack a day turned into two. Here\'s how I finally quit...',
        content: `I smoked for 20 years. One pack a day turned into two. Every attempt to quit failed within days. The cravings were unbearable, and I convinced myself I was simply someone who couldn't quit.

What changed? I stopped trying to quit "forever" and started focusing on just today. Just this hour. Just this craving. Breaking it down made it manageable.

I replaced the habit with healthier ones. Deep breathing became my new smoke break. Walking replaced the after-meal cigarette. Slowly, my body started healing. My sense of taste returned. I could breathe deeper. My skin looked healthier.

One year later, I've saved over $4,000 and added years to my life. The cravings still come sometimes, but they're whispers now, not screams. You can do this too.`,
        tags: ['health', 'habits', 'savings'],
        likes: 189,
        featured: true,
        createdAt: '2025-08-22',
    },
    {
        id: 'story_3',
        author: 'PhoenixRising',
        avatar: 'flame',
        addiction: 'Gambling',
        cleanDays: 423,
        title: 'Breaking Free from the Betting Trap',
        excerpt: 'I lost everything to gambling—my savings, my home, my self-respect. This is my comeback story...',
        content: `The thrill of the win. The rush of adrenaline. The belief that the next bet would change everything. That's what kept me trapped in gambling addiction for 8 years.

I lost my savings. I borrowed money I couldn't repay. I lied to everyone I loved. The shame was overwhelming, but the compulsion was stronger.

My recovery started when I admitted I had no control. I self-excluded from every casino. I gave control of my finances to someone I trusted. I attended Gamblers Anonymous meetings where, for the first time, I felt understood.

The hardest part was filling the void that gambling left. I realized I had been chasing excitement to escape my feelings. Learning to sit with discomfort, to find joy in simple things—that was the real work.

Today, I'm 423 days free. I'm paying off my debts. I'm rebuilding trust. Most importantly, I've learned that I am not my addiction.`,
        tags: ['finances', 'recovery', 'identity'],
        likes: 156,
        featured: false,
        createdAt: '2025-04-10',
    },
    {
        id: 'story_4',
        author: 'DigitalDetox',
        avatar: 'phone-portrait',
        addiction: 'Phone/Social Media',
        cleanDays: 180,
        title: 'Reclaiming My Time from Screens',
        excerpt: '8 hours a day on my phone. I was missing my life. Here\'s how I unplugged...',
        content: `I didn't think phone addiction was "real" until I realized I was spending 8+ hours a day on social media. I'd pick up my phone unconsciously. I'd scroll during conversations. I was always connected but never present.

The breaking point was missing my son's first steps because I was looking at my phone. That image haunts me, but it also saved me.

I started with small changes: no phones at meals, no screens in the bedroom, app timers. The withdrawal was real—anxiety, FOMO, restlessness. But slowly, I rediscovered hobbies I'd forgotten. I read books. I had real conversations. I was bored sometimes, and that was okay.

180 days into my digital detox, I still use my phone. But now it's a tool, not a crutch. I'm present for my family. I sleep better. I've reclaimed hours of my life. The real world is so much richer than anything on a screen.`,
        tags: ['technology', 'presence', 'family'],
        likes: 312,
        featured: true,
        createdAt: '2025-10-05',
    },
    {
        id: 'story_5',
        author: 'HealingJourney',
        avatar: 'heart',
        addiction: 'Opioids',
        cleanDays: 730,
        title: 'Two Years Clean: A Letter to My Past Self',
        excerpt: 'Dear past self, I know you think you\'ll never make it. But you will...',
        content: `Dear past self,

I know you think you'll never make it. Right now, you're suffering more than anyone knows. The pills have become everything—your comfort, your escape, your prison.

I'm writing from two years in the future to tell you: you survive this. Not just survive—you thrive. I know that seems impossible right now. I know every cell in your body is screaming for relief. But that suffering isn't permanent.

You'll find help. You'll find people who've walked this path before you. You'll learn that medication-assisted treatment isn't weakness—it's a bridge to freedom. You'll cry a lot. You'll have moments of despair. But you'll also have moments of clarity that remind you why you're fighting.

Two years later, you'll wake up without that desperate craving. You'll rebuild relationships you thought were lost forever. You'll help others who are where you were.

Hold on. The version of you writing this letter is proof that there's hope. One day, one hour, one minute at a time.

With love,
Your future self`,
        tags: ['hope', 'healing', 'persistence'],
        likes: 445,
        featured: true,
        createdAt: '2025-01-20',
    },
];

export const useSuccessStoriesStore = create(
    persist(
        (set, get) => ({
            stories: CURATED_STORIES,
            userStories: [],
            savedStories: [],
            filters: {
                addiction: null,
                sortBy: 'likes',
            },

            getFilteredStories: () => {
                const { stories, userStories, filters } = get();
                let allStories = [...stories, ...userStories];

                if (filters.addiction) {
                    allStories = allStories.filter(s =>
                        s.addiction.toLowerCase() === filters.addiction.toLowerCase()
                    );
                }

                switch (filters.sortBy) {
                    case 'likes':
                        return allStories.sort((a, b) => b.likes - a.likes);
                    case 'recent':
                        return allStories.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                    case 'cleanDays':
                        return allStories.sort((a, b) => b.cleanDays - a.cleanDays);
                    default:
                        return allStories;
                }
            },

            getFeaturedStories: () => {
                const { stories, userStories } = get();
                return [...stories, ...userStories].filter(s => s.featured);
            },

            setFilter: (key, value) => {
                set(state => ({
                    filters: { ...state.filters, [key]: value },
                }));
            },

            saveStory: (storyId) => {
                set(state => ({
                    savedStories: state.savedStories.includes(storyId)
                        ? state.savedStories.filter(id => id !== storyId)
                        : [...state.savedStories, storyId],
                }));
            },

            isSaved: (storyId) => get().savedStories.includes(storyId),

            likeStory: (storyId) => {
                set(state => ({
                    stories: state.stories.map(s =>
                        s.id === storyId ? { ...s, likes: s.likes + 1 } : s
                    ),
                    userStories: state.userStories.map(s =>
                        s.id === storyId ? { ...s, likes: s.likes + 1 } : s
                    ),
                }));
            },

            submitStory: (storyData) => {
                const newStory = {
                    id: `user_story_${Date.now()}`,
                    ...storyData,
                    likes: 0,
                    featured: false,
                    createdAt: new Date().toISOString(),
                };
                set(state => ({
                    userStories: [newStory, ...state.userStories],
                }));
                return newStory.id;
            },

            getStoryById: (storyId) => {
                const { stories, userStories } = get();
                return [...stories, ...userStories].find(s => s.id === storyId);
            },

            getSavedStories: () => {
                const { stories, userStories, savedStories } = get();
                const allStories = [...stories, ...userStories];
                return allStories.filter(s => savedStories.includes(s.id));
            },

            reset: () => set({
                userStories: [],
                savedStories: [],
                filters: { addiction: null, sortBy: 'likes' },
            }),
        }),
        {
            name: 'anchorone-success-stories',
            storage: createJSONStorage(() => AsyncStorage),
            partialize: (state) => ({
                userStories: state.userStories,
                savedStories: state.savedStories,
            }),
        }
    )
);

export default useSuccessStoriesStore;

// --- End of successStoriesStore.js ---
