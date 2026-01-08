// Author: -GLOBENXCC-
// OS support: Windows, Linux, macOS
// Description: Comments routes for community posts

const express = require('express');
const { query } = require('../config/db');
const { asyncHandler } = require('../middleware/errorHandler');

const router = express.Router();

router.get('/post/:postId', asyncHandler(async (req, res) => {
    const { postId } = req.params;

    const result = await query(
        `SELECT c.id, c.content, c.created_at,
            c.user_id, u.username, u.anonymous, u.avatar_id, u.avatar_color,
            (SELECT COUNT(*) FROM comment_reactions WHERE comment_id = c.id) as reaction_count,
            EXISTS(SELECT 1 FROM comment_reactions WHERE comment_id = c.id AND user_id = $2) as user_reacted
     FROM comments c
     LEFT JOIN users u ON c.user_id = u.id
     WHERE c.post_id = $1
     ORDER BY c.created_at ASC`,
        [postId, req.user.id]
    );

    res.json({ comments: result.rows });
}));

// Add comment to post
router.post('/', asyncHandler(async (req, res) => {
    const { postId, content } = req.body;

    if (!postId || !content || content.trim().length === 0) {
        return res.status(400).json({ error: 'postId and content are required' });
    }

    if (content.length > 1000) {
        return res.status(400).json({ error: 'content must be 1000 characters or less' });
    }

    // Verify post exists
    const post = await query(`SELECT id FROM posts WHERE id = $1`, [postId]);
    if (post.rows.length === 0) {
        return res.status(404).json({ error: 'Post not found' });
    }

    const result = await query(
        `INSERT INTO comments (post_id, user_id, content)
     VALUES ($1, $2, $3)
     RETURNING *`,
        [postId, req.user.id, content.trim()]
    );

    res.status(201).json({ comment: result.rows[0] });
}));

// Delete comment
router.delete('/:id', asyncHandler(async (req, res) => {
    const { id } = req.params;

    const result = await query(
        `DELETE FROM comments WHERE id = $1 AND user_id = $2 RETURNING id`,
        [id, req.user.id]
    );

    if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Comment not found or unauthorized' });
    }

    res.status(204).send();
}));

module.exports = router;

// --- End of comments.js ---
