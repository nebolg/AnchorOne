// Author: -GLOBENXCC-
// OS support: Windows, Linux, macOS
// Description: Insights and analytics routes - craving heatmap, triggers, patterns

const express = require('express');
const { query } = require('../config/db');
const { asyncHandler } = require('../middleware/errorHandler');

const router = express.Router();

// Get craving heatmap data (hour of day vs day of week)
router.get('/craving-heatmap', asyncHandler(async (req, res) => {
    const { days = 30 } = req.query;

    const result = await query(
        `SELECT 
       EXTRACT(DOW FROM cl.created_at) as day_of_week,
       EXTRACT(HOUR FROM cl.created_at) as hour,
       AVG(cl.intensity) as avg_intensity,
       COUNT(*) as count
     FROM craving_logs cl
     JOIN user_addictions ua ON cl.user_addiction_id = ua.id
     WHERE ua.user_id = $1
       AND cl.created_at >= NOW() - INTERVAL '1 day' * $2
     GROUP BY EXTRACT(DOW FROM cl.created_at), EXTRACT(HOUR FROM cl.created_at)
     ORDER BY day_of_week, hour`,
        [req.user.id, parseInt(days)]
    );

    // Transform to heatmap format
    const heatmap = {};
    const days_names = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    days_names.forEach((day, i) => {
        heatmap[day] = Array(24).fill(0);
    });

    result.rows.forEach(row => {
        const dayName = days_names[parseInt(row.day_of_week)];
        heatmap[dayName][parseInt(row.hour)] = parseFloat(row.avg_intensity);
    });

    res.json({ heatmap });
}));

// Get trigger frequency analysis
router.get('/triggers', asyncHandler(async (req, res) => {
    const { days = 30 } = req.query;

    const result = await query(
        `SELECT 
       LOWER(TRIM(cl.trigger)) as trigger,
       COUNT(*) as count,
       AVG(cl.intensity) as avg_intensity
     FROM craving_logs cl
     JOIN user_addictions ua ON cl.user_addiction_id = ua.id
     WHERE ua.user_id = $1
       AND cl.created_at >= NOW() - INTERVAL '1 day' * $2
       AND cl.trigger IS NOT NULL
       AND cl.trigger != ''
     GROUP BY LOWER(TRIM(cl.trigger))
     ORDER BY count DESC
     LIMIT 10`,
        [req.user.id, parseInt(days)]
    );

    // Calculate percentages
    const total = result.rows.reduce((sum, row) => sum + parseInt(row.count), 0);
    const triggers = result.rows.map(row => ({
        trigger: row.trigger,
        count: parseInt(row.count),
        percentage: total > 0 ? Math.round((parseInt(row.count) / total) * 100) : 0,
        avgIntensity: parseFloat(row.avg_intensity).toFixed(1),
    }));

    res.json({ triggers, total });
}));

// Get mood correlation with cravings
router.get('/mood-correlation', asyncHandler(async (req, res) => {
    const { days = 30 } = req.query;

    const result = await query(
        `SELECT 
       cl.mood,
       AVG(cl.intensity) as avg_craving_intensity,
       COUNT(*) as count
     FROM craving_logs cl
     JOIN user_addictions ua ON cl.user_addiction_id = ua.id
     WHERE ua.user_id = $1
       AND cl.created_at >= NOW() - INTERVAL '1 day' * $2
       AND cl.mood IS NOT NULL
     GROUP BY cl.mood
     ORDER BY cl.mood`,
        [req.user.id, parseInt(days)]
    );

    res.json({ correlation: result.rows });
}));

// Get summary statistics
router.get('/summary', asyncHandler(async (req, res) => {
    const { days = 30 } = req.query;
    const userId = req.user.id;

    // Total cravings
    const cravingsResult = await query(
        `SELECT COUNT(*) as total, AVG(intensity) as avg_intensity
     FROM craving_logs cl
     JOIN user_addictions ua ON cl.user_addiction_id = ua.id
     WHERE ua.user_id = $1 AND cl.created_at >= NOW() - INTERVAL '1 day' * $2`,
        [userId, parseInt(days)]
    );

    // Total clean days
    const cleanDaysResult = await query(
        `SELECT COUNT(*) as count
     FROM sobriety_logs sl
     JOIN user_addictions ua ON sl.user_addiction_id = ua.id
     WHERE ua.user_id = $1 
       AND sl.status = 'clean'
       AND sl.created_at >= NOW() - INTERVAL '1 day' * $2`,
        [userId, parseInt(days)]
    );

    // Total slips
    const slipsResult = await query(
        `SELECT COUNT(*) as count
     FROM sobriety_logs sl
     JOIN user_addictions ua ON sl.user_addiction_id = ua.id
     WHERE ua.user_id = $1 
       AND sl.status = 'slip'
       AND sl.created_at >= NOW() - INTERVAL '1 day' * $2`,
        [userId, parseInt(days)]
    );

    // Average mood
    const moodResult = await query(
        `SELECT AVG(mood) as avg_mood
     FROM mood_logs
     WHERE user_id = $1 AND created_at >= NOW() - INTERVAL '1 day' * $2`,
        [userId, parseInt(days)]
    );

    res.json({
        period: `${days} days`,
        totalCravings: parseInt(cravingsResult.rows[0].total) || 0,
        avgCravingIntensity: parseFloat(cravingsResult.rows[0].avg_intensity || 0).toFixed(1),
        cleanDaysLogged: parseInt(cleanDaysResult.rows[0].count) || 0,
        slips: parseInt(slipsResult.rows[0].count) || 0,
        avgMood: parseFloat(moodResult.rows[0].avg_mood || 0).toFixed(1),
    });
}));

// Get AI-safe pattern insights (no diagnosis!)
router.get('/patterns', asyncHandler(async (req, res) => {
    const { days = 30 } = req.query;
    const userId = req.user.id;

    const patterns = [];

    // Peak craving time
    const peakTime = await query(
        `SELECT EXTRACT(HOUR FROM cl.created_at) as hour, COUNT(*) as count
     FROM craving_logs cl
     JOIN user_addictions ua ON cl.user_addiction_id = ua.id
     WHERE ua.user_id = $1 AND cl.created_at >= NOW() - INTERVAL '1 day' * $2
     GROUP BY EXTRACT(HOUR FROM cl.created_at)
     ORDER BY count DESC
     LIMIT 1`,
        [userId, parseInt(days)]
    );

    if (peakTime.rows.length > 0) {
        const hour = parseInt(peakTime.rows[0].hour);
        const timeRange = `${hour}:00 - ${(hour + 2) % 24}:00`;
        patterns.push({
            type: 'peak_time',
            message: `Your cravings tend to peak around ${timeRange}. Consider having a distraction plan ready for this time.`,
            data: { hour, count: peakTime.rows[0].count },
        });
    }

    // Most common trigger
    const topTrigger = await query(
        `SELECT LOWER(TRIM(trigger)) as trigger, COUNT(*) as count
     FROM craving_logs cl
     JOIN user_addictions ua ON cl.user_addiction_id = ua.id
     WHERE ua.user_id = $1 
       AND cl.created_at >= NOW() - INTERVAL '1 day' * $2
       AND trigger IS NOT NULL AND trigger != ''
     GROUP BY LOWER(TRIM(trigger))
     ORDER BY count DESC
     LIMIT 1`,
        [userId, parseInt(days)]
    );

    if (topTrigger.rows.length > 0) {
        patterns.push({
            type: 'top_trigger',
            message: `"${topTrigger.rows[0].trigger}" is your most common trigger. Awareness is the first step to managing it.`,
            data: topTrigger.rows[0],
        });
    }

    // Low mood correlation
    const lowMoodCravings = await query(
        `SELECT AVG(intensity) as avg_intensity
     FROM craving_logs cl
     JOIN user_addictions ua ON cl.user_addiction_id = ua.id
     WHERE ua.user_id = $1 
       AND cl.created_at >= NOW() - INTERVAL '1 day' * $2
       AND cl.mood <= 2`,
        [userId, parseInt(days)]
    );

    if (lowMoodCravings.rows[0].avg_intensity) {
        const avgIntensity = parseFloat(lowMoodCravings.rows[0].avg_intensity);
        if (avgIntensity > 5) {
            patterns.push({
                type: 'mood_correlation',
                message: `When you're feeling low, your cravings tend to be stronger. Self-care during tough times is extra important.`,
                data: { avgIntensity: avgIntensity.toFixed(1) },
            });
        }
    }

    res.json({
        patterns,
        disclaimer: 'These are pattern observations for self-reflection, not medical diagnoses or predictions.',
    });
}));

module.exports = router;

// --- End of insights.js ---
