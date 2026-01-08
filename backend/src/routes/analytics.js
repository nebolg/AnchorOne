// Author: -GLOBENXCC-
// OS support: Windows, Linux, macOS
// Description: Backend analytics API for developers - tracks active users, app usage, and health metrics

const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Admin secret for accessing analytics (same as feedback)
const ADMIN_SECRET = process.env.FEEDBACK_ADMIN_SECRET || 'anchorone-dev-2024';

// Middleware to verify admin access
const verifyAdmin = (req, res, next) => {
    const adminKey = req.headers['x-admin-key'];
    if (adminKey !== ADMIN_SECRET) {
        return res.status(403).json({ error: 'Unauthorized access' });
    }
    next();
};

// Track user activity (called from app)
router.post('/activity', async (req, res) => {
    try {
        const { userId, screen, action, metadata } = req.body;

        await pool.query(
            `INSERT INTO user_activity (user_id, screen, action, metadata, created_at)
             VALUES ($1, $2, $3, $4, NOW())`,
            [userId || 'anonymous', screen, action, JSON.stringify(metadata) || null]
        );

        res.json({ success: true });
    } catch (error) {
        // Silently fail - don't break app if analytics fails
        console.error('[Analytics] Activity error:', error.message);
        res.json({ success: false });
    }
});

// Track app opens / sessions
router.post('/session', async (req, res) => {
    try {
        const { userId, deviceInfo, appVersion } = req.body;

        await pool.query(
            `INSERT INTO app_sessions (user_id, device_info, app_version, started_at)
             VALUES ($1, $2, $3, NOW())
             ON CONFLICT (user_id) 
             DO UPDATE SET 
                last_active = NOW(),
                session_count = app_sessions.session_count + 1,
                device_info = $2,
                app_version = $3`,
            [userId || 'anonymous', JSON.stringify(deviceInfo), appVersion || '1.0.0']
        );

        res.json({ success: true });
    } catch (error) {
        console.error('[Analytics] Session error:', error.message);
        res.json({ success: false });
    }
});

// Get dashboard stats (ADMIN ONLY)
router.get('/dashboard', verifyAdmin, async (req, res) => {
    try {
        // Active users (last 24h, 7d, 30d)
        const activeUsers = await pool.query(`
            SELECT 
                COUNT(DISTINCT user_id) FILTER (WHERE last_active > NOW() - INTERVAL '24 hours') as daily_active,
                COUNT(DISTINCT user_id) FILTER (WHERE last_active > NOW() - INTERVAL '7 days') as weekly_active,
                COUNT(DISTINCT user_id) FILTER (WHERE last_active > NOW() - INTERVAL '30 days') as monthly_active,
                COUNT(*) as total_users
            FROM app_sessions
        `);

        // Session stats
        const sessionStats = await pool.query(`
            SELECT 
                AVG(session_count) as avg_sessions_per_user,
                MAX(session_count) as max_sessions,
                COUNT(*) FILTER (WHERE started_at > NOW() - INTERVAL '24 hours') as new_users_today
            FROM app_sessions
        `);

        // Top screens (from activity)
        const topScreens = await pool.query(`
            SELECT screen, COUNT(*) as visits
            FROM user_activity
            WHERE created_at > NOW() - INTERVAL '7 days'
            GROUP BY screen
            ORDER BY visits DESC
            LIMIT 10
        `);

        // Recent activity
        const recentActivity = await pool.query(`
            SELECT user_id, screen, action, created_at
            FROM user_activity
            ORDER BY created_at DESC
            LIMIT 50
        `);

        // App version distribution
        const versionStats = await pool.query(`
            SELECT app_version, COUNT(*) as users
            FROM app_sessions
            GROUP BY app_version
            ORDER BY users DESC
        `);

        // Feedback summary
        const feedbackStats = await pool.query(`
            SELECT 
                COUNT(*) as total,
                COUNT(*) FILTER (WHERE status = 'pending') as pending
            FROM feedback
        `);

        res.json({
            users: activeUsers.rows[0],
            sessions: sessionStats.rows[0],
            topScreens: topScreens.rows,
            recentActivity: recentActivity.rows,
            appVersions: versionStats.rows,
            feedback: feedbackStats.rows[0] || { total: 0, pending: 0 },
            generatedAt: new Date().toISOString(),
        });
    } catch (error) {
        console.error('[Analytics] Dashboard error:', error);
        res.status(500).json({ error: 'Failed to fetch analytics' });
    }
});

// Get user list (ADMIN ONLY)
router.get('/users', verifyAdmin, async (req, res) => {
    try {
        const { limit = 50, offset = 0 } = req.query;

        const users = await pool.query(`
            SELECT 
                user_id,
                session_count,
                started_at as first_seen,
                last_active,
                app_version,
                device_info
            FROM app_sessions
            ORDER BY last_active DESC
            LIMIT $1 OFFSET $2
        `, [parseInt(limit), parseInt(offset)]);

        const count = await pool.query('SELECT COUNT(*) as total FROM app_sessions');

        res.json({
            users: users.rows,
            total: parseInt(count.rows[0].total),
            limit: parseInt(limit),
            offset: parseInt(offset),
        });
    } catch (error) {
        console.error('[Analytics] Users error:', error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

// Get activity for specific user (ADMIN ONLY)
router.get('/users/:userId/activity', verifyAdmin, async (req, res) => {
    try {
        const { userId } = req.params;
        const { limit = 100 } = req.query;

        const activity = await pool.query(`
            SELECT screen, action, metadata, created_at
            FROM user_activity
            WHERE user_id = $1
            ORDER BY created_at DESC
            LIMIT $2
        `, [userId, parseInt(limit)]);

        res.json({
            userId,
            activity: activity.rows,
        });
    } catch (error) {
        console.error('[Analytics] User activity error:', error);
        res.status(500).json({ error: 'Failed to fetch user activity' });
    }
});

// System health check (ADMIN ONLY)
router.get('/health', verifyAdmin, async (req, res) => {
    try {
        // Database connection check
        const dbCheck = await pool.query('SELECT 1 as connected');

        // Table sizes
        const tableSizes = await pool.query(`
            SELECT 
                relname as table_name,
                n_live_tup as row_count
            FROM pg_stat_user_tables
            ORDER BY n_live_tup DESC
        `);

        res.json({
            status: 'healthy',
            database: {
                connected: dbCheck.rows[0]?.connected === 1,
                tables: tableSizes.rows,
            },
            server: {
                uptime: process.uptime(),
                memory: process.memoryUsage(),
                nodeVersion: process.version,
            },
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        res.status(500).json({
            status: 'unhealthy',
            error: error.message,
        });
    }
});

module.exports = router;

// --- End of analytics.js ---
