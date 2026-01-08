// Author: -GLOBENXCC-
// OS support: Windows, Linux, macOS
// Description: User profile routes

const express = require('express');
const multer = require('multer');
const { query } = require('../config/db');
const { uploadImage } = require('../config/cloudinary');
const { asyncHandler } = require('../middleware/errorHandler');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

// Upload avatar photo
router.post('/me/avatar', upload.single('avatar'), asyncHandler(async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No image file provided' });
    }

    const result = await uploadImage(req.file.buffer, {
        public_id: `avatar_${req.user.id}`,
        overwrite: true
    });

    await query(
        'UPDATE users SET avatar_url = $1, updated_at = NOW() WHERE id = $2',
        [result.secure_url, req.user.id]
    );

    res.json({ avatarUrl: result.secure_url });
}));

// Get current user profile
router.get('/me', asyncHandler(async (req, res) => {
    const result = await query(
        `SELECT id, username, anonymous, intent, intent_reasons, avatar_id, avatar_color, avatar_url, bio, catchphrase, last_username_change, country, created_at 
     FROM users WHERE id = $1 AND deleted_at IS NULL`,
        [req.user.id]
    );

    if (result.rows.length === 0) {
        return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user: result.rows[0] });
}));

// Get public profile of another user
router.get('/:id', asyncHandler(async (req, res) => {
    const { id } = req.params;

    // 1. Get user basic info
    const userResult = await query(
        `SELECT id, username, anonymous, avatar_id, avatar_color, bio, catchphrase, created_at 
     FROM users WHERE id = $1 AND deleted_at IS NULL`,
        [id]
    );

    if (userResult.rows.length === 0) {
        return res.status(404).json({ error: 'User not found' });
    }

    const publicUser = userResult.rows[0];

    // 2. Get streaks
    const streaksResult = await query(
        `SELECT 
       a.name as addiction_name,
       a.icon,
       CURRENT_DATE - COALESCE(last_slips.max_date, ua.start_date) as streak_days
     FROM user_addictions ua
     JOIN addictions a ON ua.addiction_id = a.id
     LEFT JOIN (
       SELECT user_addiction_id, MAX(date) as max_date
       FROM sobriety_logs
       WHERE status = 'slip'
       GROUP BY user_addiction_id
     ) last_slips ON last_slips.user_addiction_id = ua.id
     WHERE ua.user_id = $1 AND ua.active = true`,
        [id]
    );

    // 3. Get recent posts (public ones)
    const postsResult = await query(
        `SELECT 
       p.id, p.content, p.post_type, p.created_at,
       a.name as addiction_name,
       COALESCE(
         (SELECT json_object_agg(type, count) FROM (
           SELECT type, COUNT(*) as count FROM reactions WHERE post_id = p.id GROUP BY type
         ) r), '{}'::json
       ) as reactions,
       (SELECT COUNT(*) FROM comments WHERE post_id = p.id) as comment_count
     FROM posts p
     LEFT JOIN addictions a ON p.addiction_id = a.id
     WHERE p.user_id = $1 AND p.deleted_at IS NULL
     ORDER BY p.created_at DESC
     LIMIT 10`,
        [id]
    );

    res.json({
        user: publicUser,
        streaks: streaksResult.rows,
        posts: postsResult.rows
    });
}));

// Update user profile
router.patch('/me', asyncHandler(async (req, res) => {
    const { username, intent, intentReasons, avatarId, avatarColor, bio, catchphrase, country } = req.body;

    const updates = [];
    const values = [];
    let paramCount = 0;

    // Enforce 1-week username change limit
    if (username !== undefined) {
        const userRes = await query(
            'SELECT username, last_username_change FROM users WHERE id = $1',
            [req.user.id]
        );
        const currentUsername = userRes.rows[0]?.username;
        const lastChange = userRes.rows[0]?.last_username_change;

        // Only check cooldown if username is actually changing
        if (username.trim() !== currentUsername) {
            if (lastChange) {
                const oneWeekAgo = new Date();
                oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
                if (new Date(lastChange) > oneWeekAgo) {
                    return res.status(403).json({
                        error: 'You can only change your username once per week.'
                    });
                }
            }

            paramCount++;
            updates.push(`username = $${paramCount}`);
            values.push(username.trim());
            updates.push(`anonymous = false`);
            updates.push(`last_username_change = NOW()`);
        }
    }

    if (intent !== undefined) {
        paramCount++;
        updates.push(`intent = $${paramCount}`);
        values.push(intent);
    }

    if (intentReasons !== undefined) {
        paramCount++;
        updates.push(`intent_reasons = $${paramCount}`);
        values.push(intentReasons);
    }

    if (avatarId !== undefined) {
        paramCount++;
        updates.push(`avatar_id = $${paramCount}`);
        values.push(avatarId);
    }

    if (avatarColor !== undefined) {
        paramCount++;
        updates.push(`avatar_color = $${paramCount}`);
        values.push(avatarColor);
    }

    if (bio !== undefined) {
        paramCount++;
        updates.push(`bio = $${paramCount}`);
        values.push(bio.trim());
    }

    if (catchphrase !== undefined) {
        paramCount++;
        updates.push(`catchphrase = $${paramCount}`);
        values.push(catchphrase.trim());
    }

    if (country !== undefined) {
        paramCount++;
        updates.push(`country = $${paramCount}`);
        values.push(country);
    }

    if (updates.length === 0) {
        return res.status(400).json({ error: 'No fields to update' });
    }

    updates.push(`updated_at = NOW()`);
    paramCount++;
    values.push(req.user.id);

    const result = await query(
        `UPDATE users SET ${updates.join(', ')} WHERE id = $${paramCount} 
     RETURNING id, username, anonymous, intent, intent_reasons, avatar_id, avatar_color, bio, catchphrase, country, created_at`,
        values
    );

    res.json({ user: result.rows[0] });
}));

// Delete user account (Soft delete)
router.delete('/me', asyncHandler(async (req, res) => {
    await query(`UPDATE users SET deleted_at = NOW() WHERE id = $1`, [req.user.id]);
    res.status(204).send();
}));

// Export user data (GDPR compliance)
router.get('/me/export', asyncHandler(async (req, res) => {
    const userId = req.user.id;

    // Get all user data
    const userData = await query(`SELECT * FROM users WHERE id = $1`, [userId]);
    const userAddictions = await query(
        `SELECT ua.*, a.name as addiction_name, a.icon 
     FROM user_addictions ua 
     JOIN addictions a ON ua.addiction_id = a.id 
     WHERE ua.user_id = $1`,
        [userId]
    );
    const sobrietyLogs = await query(
        `SELECT sl.* FROM sobriety_logs sl 
     JOIN user_addictions ua ON sl.user_addiction_id = ua.id 
     WHERE ua.user_id = $1`,
        [userId]
    );
    const cravingLogs = await query(
        `SELECT cl.* FROM craving_logs cl 
     JOIN user_addictions ua ON cl.user_addiction_id = ua.id 
     WHERE ua.user_id = $1`,
        [userId]
    );
    const moodLogs = await query(
        `SELECT * FROM mood_logs WHERE user_id = $1`,
        [userId]
    );
    const posts = await query(`SELECT * FROM posts WHERE user_id = $1`, [userId]);
    const comments = await query(`SELECT * FROM comments WHERE user_id = $1`, [userId]);

    res.json({
        exportedAt: new Date().toISOString(),
        user: userData.rows[0],
        addictions: userAddictions.rows,
        sobrietyLogs: sobrietyLogs.rows,
        cravingLogs: cravingLogs.rows,
        moodLogs: moodLogs.rows,
        posts: posts.rows,
        comments: comments.rows,
    });
}));

module.exports = router;

// --- End of users.js ---
