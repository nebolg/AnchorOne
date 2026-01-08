// Author: -GLOBENXCC-
// OS support: Windows, Linux, macOS
// Description: Comment reactions routes

const express = require('express');
const { query } = require('../config/db');
const { asyncHandler } = require('../middleware/errorHandler');

const router = express.Router();

const VALID_REACTIONS = ['hear_you'];

// Toggle reaction on a comment
router.post('/toggle', asyncHandler(async (req, res) => {
    const { commentId, type = 'hear_you' } = req.body;

    if (!commentId) {
        return res.status(400).json({ error: 'commentId is required' });
    }

    if (!VALID_REACTIONS.includes(type)) {
        return res.status(400).json({
            error: `type must be one of: ${VALID_REACTIONS.join(', ')}`
        });
    }

    // Verify comment exists
    const comment = await query(`SELECT id FROM comments WHERE id = $1`, [commentId]);
    if (comment.rows.length === 0) {
        return res.status(404).json({ error: 'Comment not found' });
    }

    // Check if reaction exists
    const existing = await query(
        `SELECT id FROM comment_reactions WHERE comment_id = $1 AND user_id = $2 AND type = $3`,
        [commentId, req.user.id, type]
    );

    if (existing.rows.length > 0) {
        // Remove
        await query(
            `DELETE FROM comment_reactions WHERE comment_id = $1 AND user_id = $2 AND type = $3`,
            [commentId, req.user.id, type]
        );
        res.json({ action: 'removed', type });
    } else {
        // Add
        await query(
            `INSERT INTO comment_reactions (comment_id, user_id, type) VALUES ($1, $2, $3)`,
            [commentId, req.user.id, type]
        );
        res.json({ action: 'added', type });
    }
}));

module.exports = router;

// --- End of commentReactions.js ---
