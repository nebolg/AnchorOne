// Author: -GLOBENXCC-
// OS support: iOS, Android, Web
// Description: AI-powered pattern detection service for recovery insights

import { getDay, getHours, differenceInDays, subDays, format } from 'date-fns';

export const patternDetectionService = {
    analyzePatterns(cravingLogs, moodLogs, slipLogs = []) {
        const patterns = {
            peakCravingTimes: this.analyzePeakTimes(cravingLogs),
            triggerCorrelations: this.analyzeTriggerCorrelations(cravingLogs),
            moodCravingLink: this.analyzeMoodCravingLink(cravingLogs, moodLogs),
            weekdayPatterns: this.analyzeWeekdayPatterns(cravingLogs),
            progressTrend: this.analyzeProgressTrend(cravingLogs, slipLogs),
            riskLevel: this.calculateRiskLevel(cravingLogs, moodLogs, slipLogs),
            personalizedInsights: [],
        };

        patterns.personalizedInsights = this.generateInsights(patterns);

        return patterns;
    },

    analyzePeakTimes(cravingLogs) {
        const hourCounts = Array(24).fill(0);
        const hourIntensities = Array(24).fill().map(() => []);

        cravingLogs.forEach(log => {
            const hour = getHours(new Date(log.createdAt));
            hourCounts[hour]++;
            hourIntensities[hour].push(log.intensity);
        });

        const peakHours = hourCounts
            .map((count, hour) => ({
                hour,
                count,
                avgIntensity: hourIntensities[hour].length > 0
                    ? hourIntensities[hour].reduce((a, b) => a + b, 0) / hourIntensities[hour].length
                    : 0,
            }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 3);

        const timeOfDay = (hour) => {
            if (hour >= 5 && hour < 12) return 'morning';
            if (hour >= 12 && hour < 17) return 'afternoon';
            if (hour >= 17 && hour < 21) return 'evening';
            return 'night';
        };

        return {
            peakHours,
            mostDangerousPeriod: peakHours[0] ? timeOfDay(peakHours[0].hour) : null,
            recommendation: this.getTimeBasedRecommendation(peakHours),
        };
    },

    analyzeTriggerCorrelations(cravingLogs) {
        const triggerData = {};

        cravingLogs.forEach(log => {
            if (!log.trigger) return;

            if (!triggerData[log.trigger]) {
                triggerData[log.trigger] = {
                    count: 0,
                    intensities: [],
                    overcame: 0,
                };
            }

            triggerData[log.trigger].count++;
            triggerData[log.trigger].intensities.push(log.intensity);
            if (log.overcame) triggerData[log.trigger].overcame++;
        });

        const triggers = Object.entries(triggerData)
            .map(([name, data]) => ({
                name,
                count: data.count,
                avgIntensity: data.intensities.reduce((a, b) => a + b, 0) / data.intensities.length,
                successRate: data.count > 0 ? (data.overcame / data.count) * 100 : 0,
            }))
            .sort((a, b) => b.count - a.count);

        return {
            topTriggers: triggers.slice(0, 5),
            mostChallenging: triggers.sort((a, b) => b.avgIntensity - a.avgIntensity)[0],
            easiestToOvercome: triggers.filter(t => t.count >= 2).sort((a, b) => b.successRate - a.successRate)[0],
        };
    },

    analyzeMoodCravingLink(cravingLogs, moodLogs) {
        const moodBeforeCraving = [];

        cravingLogs.forEach(craving => {
            const cravingTime = new Date(craving.createdAt);
            const recentMood = moodLogs.find(mood => {
                const moodTime = new Date(mood.createdAt);
                const diffHours = (cravingTime - moodTime) / (1000 * 60 * 60);
                return diffHours >= 0 && diffHours <= 6;
            });

            if (recentMood) {
                moodBeforeCraving.push({
                    mood: recentMood.mood,
                    cravingIntensity: craving.intensity,
                });
            }
        });

        const moodCategories = { low: [], medium: [], high: [] };
        moodBeforeCraving.forEach(item => {
            if (item.mood <= 2) moodCategories.low.push(item.cravingIntensity);
            else if (item.mood <= 4) moodCategories.medium.push(item.cravingIntensity);
            else moodCategories.high.push(item.cravingIntensity);
        });

        const avgByMood = {
            positiveM: moodCategories.low.length > 0
                ? moodCategories.low.reduce((a, b) => a + b, 0) / moodCategories.low.length : 0,
            neutralMood: moodCategories.medium.length > 0
                ? moodCategories.medium.reduce((a, b) => a + b, 0) / moodCategories.medium.length : 0,
            negativeMood: moodCategories.high.length > 0
                ? moodCategories.high.reduce((a, b) => a + b, 0) / moodCategories.high.length : 0,
        };

        return {
            correlation: avgByMood.negativeMood > avgByMood.positiveM ? 'strong' : 'weak',
            insight: avgByMood.negativeMood > avgByMood.positiveM + 1
                ? 'Your cravings are significantly stronger when your mood is low. Focus on mood management.'
                : 'Mood has a moderate impact on your cravings.',
        };
    },

    analyzeWeekdayPatterns(cravingLogs) {
        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const dayCounts = Array(7).fill(0);

        cravingLogs.forEach(log => {
            const day = getDay(new Date(log.createdAt));
            dayCounts[day]++;
        });

        const highestDay = dayCounts.indexOf(Math.max(...dayCounts));
        const lowestDay = dayCounts.indexOf(Math.min(...dayCounts));

        return {
            distribution: dayCounts.map((count, i) => ({ day: dayNames[i], count })),
            highRiskDay: dayNames[highestDay],
            lowestRiskDay: dayNames[lowestDay],
            isWeekendHigher: (dayCounts[0] + dayCounts[6]) / 2 > (dayCounts.slice(1, 6).reduce((a, b) => a + b, 0) / 5),
        };
    },

    analyzeProgressTrend(cravingLogs, slipLogs) {
        const last30Days = subDays(new Date(), 30);
        const recent = cravingLogs.filter(c => new Date(c.createdAt) >= last30Days);
        const recentSlips = slipLogs.filter(s => new Date(s.createdAt) >= last30Days);

        const first15 = recent.filter(c => {
            const days = differenceInDays(new Date(), new Date(c.createdAt));
            return days >= 15;
        });
        const last15 = recent.filter(c => {
            const days = differenceInDays(new Date(), new Date(c.createdAt));
            return days < 15;
        });

        const avgFirst = first15.length > 0
            ? first15.reduce((sum, c) => sum + c.intensity, 0) / first15.length : 0;
        const avgLast = last15.length > 0
            ? last15.reduce((sum, c) => sum + c.intensity, 0) / last15.length : 0;

        let trend = 'stable';
        if (avgLast < avgFirst - 0.5) trend = 'improving';
        if (avgLast > avgFirst + 0.5) trend = 'declining';

        return {
            trend,
            cravingFrequencyChange: last15.length - first15.length,
            slipsInPeriod: recentSlips.length,
            message: this.getTrendMessage(trend, recentSlips.length),
        };
    },

    calculateRiskLevel(cravingLogs, moodLogs, slipLogs) {
        const last7Days = subDays(new Date(), 7);

        const recentCravings = cravingLogs.filter(c => new Date(c.createdAt) >= last7Days);
        const recentMoods = moodLogs.filter(m => new Date(m.createdAt) >= last7Days);
        const recentSlips = slipLogs.filter(s => new Date(s.createdAt) >= last7Days);

        let riskScore = 0;

        if (recentCravings.length > 10) riskScore += 2;
        else if (recentCravings.length > 5) riskScore += 1;

        const avgIntensity = recentCravings.length > 0
            ? recentCravings.reduce((sum, c) => sum + c.intensity, 0) / recentCravings.length : 0;
        if (avgIntensity > 7) riskScore += 2;
        else if (avgIntensity > 5) riskScore += 1;

        const avgMood = recentMoods.length > 0
            ? recentMoods.reduce((sum, m) => sum + m.mood, 0) / recentMoods.length : 3;
        if (avgMood > 4) riskScore += 2;
        else if (avgMood > 3) riskScore += 1;

        if (recentSlips.length > 0) riskScore += 3;

        let level = 'low';
        if (riskScore >= 6) level = 'high';
        else if (riskScore >= 3) level = 'medium';

        return {
            level,
            score: riskScore,
            maxScore: 9,
            factors: {
                cravingFrequency: recentCravings.length,
                avgIntensity: avgIntensity.toFixed(1),
                avgMood: avgMood.toFixed(1),
                recentSlips: recentSlips.length,
            },
        };
    },

    generateInsights(patterns) {
        const insights = [];

        if (patterns.peakCravingTimes.mostDangerousPeriod) {
            insights.push({
                type: 'time',
                icon: 'time',
                title: `${patterns.peakCravingTimes.mostDangerousPeriod.charAt(0).toUpperCase() + patterns.peakCravingTimes.mostDangerousPeriod.slice(1)} Alert`,
                message: `Your cravings tend to peak in the ${patterns.peakCravingTimes.mostDangerousPeriod}. Plan distracting activities for this time.`,
                priority: 'high',
            });
        }

        if (patterns.triggerCorrelations.mostChallenging) {
            insights.push({
                type: 'trigger',
                icon: 'flame',
                title: 'Toughest Trigger',
                message: `"${patterns.triggerCorrelations.mostChallenging.name}" leads to your most intense cravings. Focus on coping strategies for this trigger.`,
                priority: 'high',
            });
        }

        if (patterns.moodCravingLink.correlation === 'strong') {
            insights.push({
                type: 'mood',
                icon: 'happy',
                title: 'Mood-Craving Connection',
                message: patterns.moodCravingLink.insight,
                priority: 'medium',
            });
        }

        if (patterns.weekdayPatterns.isWeekendHigher) {
            insights.push({
                type: 'weekend',
                icon: 'calendar',
                title: 'Weekend Watch',
                message: 'Weekends are higher risk for you. Plan extra support and activities for Saturday and Sunday.',
                priority: 'medium',
            });
        }

        if (patterns.progressTrend.trend === 'improving') {
            insights.push({
                type: 'progress',
                icon: 'trending-up',
                title: 'Great Progress!',
                message: "Your craving intensity has been decreasing. You're building resilience!",
                priority: 'low',
            });
        }

        if (patterns.riskLevel.level === 'high') {
            insights.push({
                type: 'risk',
                icon: 'warning',
                title: 'High Alert Period',
                message: 'Multiple risk factors are elevated. Consider reaching out for extra support.',
                priority: 'urgent',
            });
        }

        return insights.sort((a, b) => {
            const priority = { urgent: 0, high: 1, medium: 2, low: 3 };
            return priority[a.priority] - priority[b.priority];
        });
    },

    getTimeBasedRecommendation(peakHours) {
        if (!peakHours || peakHours.length === 0) return null;

        const hour = peakHours[0].hour;
        const recommendations = {
            morning: 'Start your day with a grounding exercise or brief meditation.',
            afternoon: 'Schedule a walk or call a friend during this high-risk time.',
            evening: 'Have your coping toolkit ready and consider joining a support group.',
            night: 'Create a relaxing bedtime routine to reduce late-night cravings.',
        };

        const timeOfDay = hour >= 5 && hour < 12 ? 'morning'
            : hour >= 12 && hour < 17 ? 'afternoon'
                : hour >= 17 && hour < 21 ? 'evening' : 'night';

        return recommendations[timeOfDay];
    },

    getTrendMessage(trend, slips) {
        if (slips > 2) return "It's been a challenging period. Remember: setbacks are learning opportunities.";
        if (trend === 'improving') return "You're making excellent progress! Your hard work is paying off.";
        if (trend === 'declining') return "Cravings have been tougher lately. Consider adding new coping strategies.";
        return "You're staying steady. Keep up the good work!";
    },
};

export default patternDetectionService;

// --- End of patternDetectionService.js ---
