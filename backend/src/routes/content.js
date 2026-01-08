// Author: -GLOBENXCC-
// OS support: Windows, Linux, macOS
// Description: Content statistics API for admin dashboard

const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Admin secret for accessing content stats
const ADMIN_SECRET = process.env.FEEDBACK_ADMIN_SECRET || 'anchorone-dev-2024';

const verifyAdmin = (req, res, next) => {
    const adminKey = req.headers['x-admin-key'];
    if (adminKey !== ADMIN_SECRET) {
        return res.status(403).json({ error: 'Unauthorized access' });
    }
    next();
};

// Get content statistics (ADMIN ONLY)
router.get('/stats', verifyAdmin, async (req, res) => {
    try {
        // Posts count
        const postsResult = await pool.query('SELECT COUNT(*) as count FROM posts');
        const posts = parseInt(postsResult.rows[0]?.count || 0);

        // Comments count
        const commentsResult = await pool.query('SELECT COUNT(*) as count FROM comments');
        const comments = parseInt(commentsResult.rows[0]?.count || 0);

        // User addictions count
        const addictionsResult = await pool.query('SELECT COUNT(*) as count FROM user_addictions');
        const addictions = parseInt(addictionsResult.rows[0]?.count || 0);

        // Cravings count
        const cravingsResult = await pool.query('SELECT COUNT(*) as count FROM craving_logs');
        const cravings = parseInt(cravingsResult.rows[0]?.count || 0);

        // Slips count
        const slipsResult = await pool.query('SELECT COUNT(*) as count FROM slip_logs');
        const slips = parseInt(slipsResult.rows[0]?.count || 0);

        // Mood entries count
        const moodsResult = await pool.query('SELECT COUNT(*) as count FROM mood_entries');
        const moods = parseInt(moodsResult.rows[0]?.count || 0);

        // Top addiction types
        const addictionTypesResult = await pool.query(`
            SELECT addiction_type as type, COUNT(*) as count 
            FROM user_addictions 
            GROUP BY addiction_type 
            ORDER BY count DESC 
            LIMIT 10
        `);

        // Recent posts
        const recentPostsResult = await pool.query(`
            SELECT id, title, post_type, created_at 
            FROM posts 
            ORDER BY created_at DESC 
            LIMIT 10
        `);

        // Daily activity (last 7 days)
        const dailyActivityResult = await pool.query(`
            SELECT 
                DATE(created_at) as date,
                COUNT(*) as count
            FROM user_activity
            WHERE created_at > NOW() - INTERVAL '7 days'
            GROUP BY DATE(created_at)
            ORDER BY date ASC
        `);

        res.json({
            stats: {
                posts,
                comments,
                addictions,
                cravings,
                slips,
                moods,
            },
            addictionTypes: addictionTypesResult.rows,
            recentPosts: recentPostsResult.rows,
            dailyActivity: dailyActivityResult.rows,
            generatedAt: new Date().toISOString(),
        });
    } catch (error) {
        console.error('[Content Stats] Error:', error.message);
        // Return zeros if tables don't exist yet
        res.json({
            stats: { posts: 0, comments: 0, addictions: 0, cravings: 0, slips: 0, moods: 0 },
            addictionTypes: [],
            recentPosts: [],
            dailyActivity: [],
            generatedAt: new Date().toISOString(),
        });
    }
});

module.exports = router;

// --- End of content.js ---
