// Author: -GLOBENXCC-
// OS support: Windows, Linux, macOS
// Description: Anonymous DM messaging routes

const express = require('express');
const { query } = require('../config/db');
const { asyncHandler } = require('../middleware/errorHandler');

const router = express.Router();

// Get conversations (grouped by other user)
router.get('/conversations', asyncHandler(async (req, res) => {
    const result = await query(
        `WITH last_messages AS (
           SELECT DISTINCT ON (
             CASE WHEN sender_id = $1 THEN receiver_id ELSE sender_id END
           )
             CASE WHEN sender_id = $1 THEN receiver_id ELSE sender_id END as other_user_id,
             content as last_message,
             created_at as last_message_at
           FROM messages
           WHERE sender_id = $1 OR receiver_id = $1
           ORDER BY CASE WHEN sender_id = $1 THEN receiver_id ELSE sender_id END, created_at DESC
         ),
         unread_counts AS (
           SELECT sender_id as other_user_id, COUNT(*) as count
           FROM messages
           WHERE receiver_id = $1 AND read = false
           GROUP BY sender_id
         )
         SELECT 
           lm.other_user_id,
           u.username,
           u.anonymous,
           lm.last_message,
           lm.last_message_at,
           COALESCE(uc.count, 0) as unread_count
         FROM last_messages lm
         LEFT JOIN users u ON lm.other_user_id = u.id
         LEFT JOIN unread_counts uc ON lm.other_user_id = uc.other_user_id
         ORDER BY lm.last_message_at DESC`,
        [req.user.id]
    );

    res.json({ conversations: result.rows });
}));

// Get messages with a specific user
router.get('/with/:userId', asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const { limit = 50, before } = req.query;

    let whereClause = `
    WHERE ((sender_id = $1 AND receiver_id = $2) 
       OR (sender_id = $2 AND receiver_id = $1))
  `;
    const params = [req.user.id, userId, parseInt(limit)];

    if (before) {
        whereClause += ` AND created_at < $4`;
        params.push(before);
    }

    const result = await query(
        `SELECT m.*, 
            CASE WHEN m.sender_id = $1 THEN true ELSE false END as is_mine
     FROM messages m
     ${whereClause}
     ORDER BY created_at DESC
     LIMIT $3`,
        params
    );

    // Mark messages as read
    await query(
        `UPDATE messages SET read = true 
     WHERE receiver_id = $1 AND sender_id = $2 AND read = false`,
        [req.user.id, userId]
    );

    res.json({ messages: result.rows.reverse() });
}));

// Send message
router.post('/', asyncHandler(async (req, res) => {
    const { receiverId, content } = req.body;

    if (!receiverId || !content || content.trim().length === 0) {
        return res.status(400).json({ error: 'receiverId and content are required' });
    }

    if (content.length > 1000) {
        return res.status(400).json({ error: 'content must be 1000 characters or less' });
    }

    if (receiverId === req.user.id) {
        return res.status(400).json({ error: 'Cannot message yourself' });
    }

    // Verify receiver exists
    const receiver = await query(`SELECT id FROM users WHERE id = $1`, [receiverId]);
    if (receiver.rows.length === 0) {
        return res.status(404).json({ error: 'Recipient not found' });
    }

    const result = await query(
        `INSERT INTO messages (sender_id, receiver_id, content)
     VALUES ($1, $2, $3)
     RETURNING *`,
        [req.user.id, receiverId, content.trim()]
    );

    res.status(201).json({ message: result.rows[0] });
}));

// Get unread count
router.get('/unread', asyncHandler(async (req, res) => {
    const result = await query(
        `SELECT COUNT(*) as count FROM messages 
     WHERE receiver_id = $1 AND read = false`,
        [req.user.id]
    );

    res.json({ unreadCount: parseInt(result.rows[0].count) });
}));

// Mark all messages from a user as read
router.post('/read/:userId', asyncHandler(async (req, res) => {
    const { userId } = req.params;

    await query(
        `UPDATE messages SET read = true 
     WHERE receiver_id = $1 AND sender_id = $2`,
        [req.user.id, userId]
    );

    res.json({ success: true });
}));

module.exports = router;

// --- End of messages.js ---
