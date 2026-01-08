// Author: -GLOBENXCC-
// OS support: iOS, Android, Web
// Description: Guided recovery programs with structured daily activities

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RECOVERY_PROGRAMS = [
    {
        id: 'first_30_days',
        name: 'First 30 Days',
        description: 'Build a strong foundation for your recovery journey',
        duration: 30,
        difficulty: 'beginner',
        icon: 'rocket',
        color: '#14B8A6',
        modules: [
            {
                id: 'week1',
                name: 'Week 1: Detox & Stabilize',
                days: [
                    { day: 1, title: 'Setting Intentions', activities: ['Write your why', 'Breathing exercise', 'Create safe space'] },
                    { day: 2, title: 'Understanding Triggers', activities: ['Identify top 3 triggers', '5-4-3-2-1 grounding', 'Journal reflection'] },
                    { day: 3, title: 'Building Support', activities: ['Tell someone you trust', 'Find accountability partner', 'Breathing exercise'] },
                    { day: 4, title: 'Physical Care', activities: ['Stay hydrated', 'Light exercise', 'Healthy meal planning'] },
                    { day: 5, title: 'Managing Cravings', activities: ['Learn HALT technique', 'Practice distraction', 'Evening reflection'] },
                    { day: 6, title: 'Rest & Recovery', activities: ['Sleep hygiene tips', 'Relaxation practice', 'Gratitude list'] },
                    { day: 7, title: 'Week 1 Celebration', activities: ['Reflect on wins', 'Set Week 2 goals', 'Self-care activity'] },
                ],
            },
            {
                id: 'week2',
                name: 'Week 2: Building Habits',
                days: [
                    { day: 8, title: 'Morning Routine', activities: ['Create morning ritual', 'Meditation 5 min', 'Set daily intention'] },
                    { day: 9, title: 'Stress Management', activities: ['Identify stressors', 'Progressive relaxation', 'Healthy outlet'] },
                    { day: 10, title: 'Social Navigation', activities: ['Plan for social situations', 'Practice saying no', 'Support check-in'] },
                    { day: 11, title: 'Emotional Awareness', activities: ['Name your emotions', 'RAIN technique', 'Journal feelings'] },
                    { day: 12, title: 'Physical Activity', activities: ['30-min exercise', 'Mind-body connection', 'Rest well'] },
                    { day: 13, title: 'Mindfulness Day', activities: ['Mindful eating', '10-min meditation', 'Body scan'] },
                    { day: 14, title: 'Two Week Milestone', activities: ['Celebrate progress', 'Update goals', 'Share with support'] },
                ],
            },
            {
                id: 'week3',
                name: 'Week 3: Deepening Practice',
                days: [
                    { day: 15, title: 'Values & Purpose', activities: ['Define core values', 'Vision board', 'Purpose reflection'] },
                    { day: 16, title: 'Trigger Deep Dive', activities: ['Map trigger patterns', 'Create action plans', 'Practice coping'] },
                    { day: 17, title: 'Relationship Healing', activities: ['Amends reflection', 'Healthy boundaries', 'Communication practice'] },
                    { day: 18, title: 'Self-Compassion', activities: ['Self-compassion meditation', 'Inner critic work', 'Kindness practice'] },
                    { day: 19, title: 'Community Connection', activities: ['Attend support group', 'Share your story', 'Help someone else'] },
                    { day: 20, title: 'Future Vision', activities: ['Life goals mapping', 'Sober activities list', 'Dream journaling'] },
                    { day: 21, title: 'Three Week Victory', activities: ['Major milestone!', 'Reward yourself', 'Gratitude practice'] },
                ],
            },
            {
                id: 'week4',
                name: 'Week 4: Sustainable Recovery',
                days: [
                    { day: 22, title: 'Relapse Prevention', activities: ['Warning signs list', 'Emergency plan', 'Support contacts'] },
                    { day: 23, title: 'Life Balance', activities: ['Work-life assessment', 'Hobby exploration', 'Joy list'] },
                    { day: 24, title: 'Financial Recovery', activities: ['Money saved calculation', 'Financial goals', 'Celebrate savings'] },
                    { day: 25, title: 'Health Check', activities: ['Physical health goals', 'Mental health check', 'Schedule self-care'] },
                    { day: 26, title: 'Giving Back', activities: ['Help a newcomer', 'Gratitude letters', 'Service planning'] },
                    { day: 27, title: 'Integration', activities: ['Review all learnings', 'Favorite practices', 'Maintenance plan'] },
                    { day: 28, title: 'Preparation', activities: ['Month 2 planning', 'Long-term goals', 'Support system check'] },
                ],
            },
        ],
    },
    {
        id: 'mindfulness_journey',
        name: 'Mindfulness Journey',
        description: 'Learn meditation and mindfulness for recovery',
        duration: 14,
        difficulty: 'all levels',
        icon: 'flower',
        color: '#8B5CF6',
        modules: [
            {
                id: 'foundations',
                name: 'Foundations',
                days: [
                    { day: 1, title: 'Introduction to Mindfulness', activities: ['What is mindfulness?', '2-min breathing', 'Journal: present moment'] },
                    { day: 2, title: 'Breath Awareness', activities: ['Breath counting', '5-min practice', 'Notice body sensations'] },
                    { day: 3, title: 'Body Scan', activities: ['Full body scan', 'Tension release', 'Mindful movement'] },
                    { day: 4, title: 'Mindful Observation', activities: ['Observe thoughts', 'Clouds metaphor', '10-min sit'] },
                    { day: 5, title: 'Loving-Kindness', activities: ['Metta meditation', 'Self-compassion', 'Extend to others'] },
                    { day: 6, title: 'Mindful Living', activities: ['Mindful eating', 'Walking meditation', 'Daily activities'] },
                    { day: 7, title: 'Week Review', activities: ['Progress reflection', 'Favorite practice', 'Set intentions'] },
                ],
            },
        ],
    },
    {
        id: 'anxiety_toolkit',
        name: 'Anxiety Management',
        description: 'Tools for managing anxiety during recovery',
        duration: 7,
        difficulty: 'beginner',
        icon: 'heart',
        color: '#EC4899',
        modules: [
            {
                id: 'anxiety_week',
                name: 'Anxiety Toolkit',
                days: [
                    { day: 1, title: 'Understanding Anxiety', activities: ['Learn anxiety cycle', 'Identify symptoms', 'Grounding exercise'] },
                    { day: 2, title: 'Breathing Techniques', activities: ['4-7-8 breathing', 'Box breathing', 'Diaphragmatic breath'] },
                    { day: 3, title: 'Cognitive Tools', activities: ['Thought challenging', 'Worry time', 'Reframing practice'] },
                    { day: 4, title: 'Physical Release', activities: ['Progressive relaxation', 'Shake it out', 'Gentle yoga'] },
                    { day: 5, title: 'Grounding Methods', activities: ['5-4-3-2-1 technique', 'Cold water method', 'Safe place visualization'] },
                    { day: 6, title: 'Lifestyle Factors', activities: ['Sleep hygiene', 'Caffeine review', 'Movement plan'] },
                    { day: 7, title: 'Integration', activities: ['Personal toolkit', 'Emergency card', 'Ongoing practice'] },
                ],
            },
        ],
    },
];

export const useGuidedProgramsStore = create(
    persist(
        (set, get) => ({
            programs: RECOVERY_PROGRAMS,
            enrolledPrograms: {},
            completedDays: {},
            currentStreak: 0,

            enrollInProgram: (programId) => {
                set(state => ({
                    enrolledPrograms: {
                        ...state.enrolledPrograms,
                        [programId]: {
                            enrolledAt: new Date().toISOString(),
                            currentDay: 1,
                            lastActivityDate: null,
                        },
                    },
                    completedDays: {
                        ...state.completedDays,
                        [programId]: [],
                    },
                }));
            },

            unenrollFromProgram: (programId) => {
                set(state => {
                    const { [programId]: _, ...remainingEnrolled } = state.enrolledPrograms;
                    const { [programId]: __, ...remainingCompleted } = state.completedDays;
                    return {
                        enrolledPrograms: remainingEnrolled,
                        completedDays: remainingCompleted,
                    };
                });
            },

            completeDay: (programId, dayNumber) => {
                set(state => ({
                    completedDays: {
                        ...state.completedDays,
                        [programId]: [...(state.completedDays[programId] || []), dayNumber],
                    },
                    enrolledPrograms: {
                        ...state.enrolledPrograms,
                        [programId]: {
                            ...state.enrolledPrograms[programId],
                            currentDay: dayNumber + 1,
                            lastActivityDate: new Date().toISOString(),
                        },
                    },
                }));
            },

            isEnrolled: (programId) => !!get().enrolledPrograms[programId],

            isDayCompleted: (programId, dayNumber) => {
                const completed = get().completedDays[programId] || [];
                return completed.includes(dayNumber);
            },

            getProgramProgress: (programId) => {
                const program = get().programs.find(p => p.id === programId);
                const completed = get().completedDays[programId] || [];

                if (!program) return { percentage: 0, daysCompleted: 0, totalDays: 0 };

                return {
                    percentage: Math.round((completed.length / program.duration) * 100),
                    daysCompleted: completed.length,
                    totalDays: program.duration,
                };
            },

            getEnrolledPrograms: () => {
                const { programs, enrolledPrograms } = get();
                return programs.filter(p => enrolledPrograms[p.id]);
            },

            getCurrentDay: (programId) => {
                const enrolled = get().enrolledPrograms[programId];
                return enrolled?.currentDay || 1;
            },

            getDayActivities: (programId, dayNumber) => {
                const program = get().programs.find(p => p.id === programId);
                if (!program) return null;

                for (const module of program.modules) {
                    const day = module.days.find(d => d.day === dayNumber);
                    if (day) return day;
                }
                return null;
            },

            reset: () => set({
                enrolledPrograms: {},
                completedDays: {},
                currentStreak: 0,
            }),
        }),
        {
            name: 'anchorone-guided-programs',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);

export default useGuidedProgramsStore;

// --- End of guidedProgramsStore.js ---
