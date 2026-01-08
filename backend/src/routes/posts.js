// Author: -GLOBENXCC-
// OS support: Windows, Linux, macOS
// Description: Community posts routes

const express = require('express');
const { query } = require('../config/db');
const { asyncHandler } = require('../middleware/errorHandler');

const router = express.Router();

// Get posts feed
router.get('/', asyncHandler(async (req, res) => {
    const { addictionId, limit = 20, offset = 0 } = req.query;

    let whereClause = '';
    const params = [parseInt(limit), parseInt(offset)];

    if (addictionId && addictionId !== 'all') {
        whereClause = 'AND p.addiction_id = $3';
        params.push(addictionId);
    }

    const result = await query(
        `SELECT 
       p.id, p.content, p.image_url, p.post_type, p.created_at,
       p.user_id,
       u.username, u.anonymous, u.avatar_id, u.avatar_color,
       a.name as addiction_name, a.icon as addiction_icon,
       COALESCE(
         (SELECT json_object_agg(type, count) FROM (
           SELECT type, COUNT(*) as count FROM reactions WHERE post_id = p.id GROUP BY type
         ) r), '{}'::json
       ) as reactions,
       (SELECT COUNT(*) FROM comments WHERE post_id = p.id) as comment_count
     FROM posts p
     LEFT JOIN users u ON p.user_id = u.id
     LEFT JOIN addictions a ON p.addiction_id = a.id
     WHERE p.deleted_at IS NULL ${whereClause}
     ORDER BY p.created_at DESC
     LIMIT $1 OFFSET $2`,
        params
    );

    res.json({ posts: result.rows });
}));

// Get single post
router.get('/:id', asyncHandler(async (req, res) => {
    const { id } = req.params;

    const result = await query(
        `SELECT 
       p.id, p.content, p.image_url, p.post_type, p.created_at,
       p.user_id,
       u.username, u.anonymous, u.avatar_id, u.avatar_color,
       a.name as addiction_name, a.icon as addiction_icon,
       COALESCE(
         (SELECT json_object_agg(type, count) FROM (
           SELECT type, COUNT(*) as count FROM reactions WHERE post_id = p.id GROUP BY type
         ) r), '{}'::json
       ) as reactions,
       (SELECT COUNT(*) FROM comments WHERE post_id = p.id) as comment_count
     FROM posts p
     LEFT JOIN users u ON p.user_id = u.id
     LEFT JOIN addictions a ON p.addiction_id = a.id
     WHERE p.id = $1 AND p.deleted_at IS NULL`,
        [id]
    );

    if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Post not found' });
    }

    res.json({ post: result.rows[0] });
}));

// Create post
router.post('/', asyncHandler(async (req, res) => {
    const { content, addictionId, postType = 'text', imageUrl } = req.body;

    if (!content || content.trim().length === 0) {
        return res.status(400).json({ error: 'content is required' });
    }

    if (content.length > 2000) {
        return res.status(400).json({ error: 'content must be 2000 characters or less' });
    }

    const result = await query(
        `INSERT INTO posts (user_id, content, addiction_id, post_type, image_url)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
        [req.user.id, content.trim(), addictionId || null, postType, imageUrl || null]
    );

    res.status(201).json({ post: result.rows[0] });
}));

// Update post
router.patch('/:id', asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { content } = req.body;

    if (!content || content.trim().length === 0) {
        return res.status(400).json({ error: 'content is required' });
    }

    const result = await query(
        `UPDATE posts SET content = $1, updated_at = NOW() 
     WHERE id = $2 AND user_id = $3
     RETURNING *`,
        [content.trim(), id, req.user.id]
    );

    if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Post not found or unauthorized' });
    }

    res.json({ post: result.rows[0] });
}));

// Delete post
router.delete('/:id', asyncHandler(async (req, res) => {
    const { id } = req.params;

    const result = await query(
        `UPDATE posts SET deleted_at = NOW() WHERE id = $1 AND user_id = $2 RETURNING id`,
        [id, req.user.id]
    );

    if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Post not found or unauthorized' });
    }

    res.status(204).send();
}));

// Get user's posts
router.get('/user/mine', asyncHandler(async (req, res) => {
    const result = await query(
        `SELECT 
       p.id, p.content, p.image_url, p.post_type, p.created_at,
       COALESCE(
         (SELECT json_object_agg(type, count) FROM (
           SELECT type, COUNT(*) as count FROM reactions WHERE post_id = p.id GROUP BY type
         ) r), '{}'::json
       ) as reactions,
       (SELECT COUNT(*) FROM comments WHERE post_id = p.id) as comment_count
     FROM posts p
     WHERE p.user_id = $1 AND p.deleted_at IS NULL
     ORDER BY p.created_at DESC`,
        [req.user.id]
    );

    res.json({ posts: result.rows });
}));

module.exports = router;

// --- End of posts.js ---
