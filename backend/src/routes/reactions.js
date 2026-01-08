// Author: -GLOBENXCC-
// OS support: Windows, Linux, macOS
// Description: Empathy reactions routes (🤍💪🌱)

const express = require('express');
const { query } = require('../config/db');
const { asyncHandler } = require('../middleware/errorHandler');

const router = express.Router();

const VALID_REACTIONS = ['hear_you', 'stay_strong', 'proud'];

// Toggle reaction on a post
router.post('/toggle', asyncHandler(async (req, res) => {
    const { postId, type } = req.body;

    if (!postId || !type) {
        return res.status(400).json({ error: 'postId and type are required' });
    }

    if (!VALID_REACTIONS.includes(type)) {
        return res.status(400).json({
            error: `type must be one of: ${VALID_REACTIONS.join(', ')}`
        });
    }

    // Verify post exists
    const post = await query(`SELECT id FROM posts WHERE id = $1`, [postId]);
    if (post.rows.length === 0) {
        return res.status(404).json({ error: 'Post not found' });
    }

    // Check if reaction exists
    const existing = await query(
        `SELECT id FROM reactions WHERE post_id = $1 AND user_id = $2 AND type = $3`,
        [postId, req.user.id, type]
    );

    if (existing.rows.length > 0) {
        // Remove reaction
        await query(
            `DELETE FROM reactions WHERE post_id = $1 AND user_id = $2 AND type = $3`,
            [postId, req.user.id, type]
        );

        res.json({ action: 'removed', type });
    } else {
        // Add reaction
        await query(
            `INSERT INTO reactions (post_id, user_id, type) VALUES ($1, $2, $3)`,
            [postId, req.user.id, type]
        );

        res.json({ action: 'added', type });
    }
}));

// Get user's reactions for a post
router.get('/post/:postId', asyncHandler(async (req, res) => {
    const { postId } = req.params;

    const result = await query(
        `SELECT type FROM reactions WHERE post_id = $1 AND user_id = $2`,
        [postId, req.user.id]
    );

    res.json({ reactions: result.rows.map(r => r.type) });
}));

// Get reaction counts for a post
router.get('/post/:postId/counts', asyncHandler(async (req, res) => {
    const { postId } = req.params;

    const result = await query(
        `SELECT type, COUNT(*) as count 
     FROM reactions 
     WHERE post_id = $1 
     GROUP BY type`,
        [postId]
    );

    const counts = {
        hear_you: 0,
        stay_strong: 0,
        proud: 0,
    };

    result.rows.forEach(row => {
        counts[row.type] = parseInt(row.count);
    });

    res.json({ counts });
}));

module.exports = router;

// --- End of reactions.js ---
