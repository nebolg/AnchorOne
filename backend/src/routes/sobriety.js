// Author: -GLOBENXCC-
// OS support: Windows, Linux, macOS
// Description: Sobriety tracking routes - streaks, logs, and slips

const express = require('express');
const { body, validationResult } = require('express-validator');
const { query } = require('../config/db');
const { asyncHandler } = require('../middleware/errorHandler');

const router = express.Router();

const validateLog = [
    body('userAddictionId').isUUID().withMessage('Invalid addiction ID'),
    body('status').isIn(['clean', 'slip']).withMessage('Status must be "clean" or "slip"'),
    body('reason').optional().trim().isLength({ max: 500 }),
    body('note').optional().trim().isLength({ max: 1000 }),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

// Get streak for a specific user addiction
router.get('/streak/:userAddictionId', asyncHandler(async (req, res) => {
    const { userAddictionId } = req.params;

    // Verify ownership
    const ownership = await query(
        `SELECT ua.id, ua.start_date FROM user_addictions ua 
     WHERE ua.id = $1 AND ua.user_id = $2`,
        [userAddictionId, req.user.id]
    );

    if (ownership.rows.length === 0) {
        return res.status(404).json({ error: 'User addiction not found' });
    }

    // Get last slip
    const lastSlip = await query(
        `SELECT date FROM sobriety_logs 
     WHERE user_addiction_id = $1 AND status = 'slip' 
     ORDER BY date DESC LIMIT 1`,
        [userAddictionId]
    );

    const startDate = lastSlip.rows.length > 0
        ? lastSlip.rows[0].date
        : ownership.rows[0].start_date;

    // Calculate streak
    const streakResult = await query(
        `SELECT CURRENT_DATE - $1::date as days`,
        [startDate]
    );

    res.json({
        userAddictionId,
        days: streakResult.rows[0].days || 0,
        startDate,
        lastSlip: lastSlip.rows[0]?.date || null,
    });
}));

// Get all streaks for user
router.get('/streaks', asyncHandler(async (req, res) => {
    const result = await query(
        `SELECT 
       ua.id as user_addiction_id,
       ua.start_date,
       a.name as addiction_name,
       a.icon,
       last_slips.max_date as streak_start,
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
        [req.user.id]
    );

    res.json({
        streaks: result.rows.map(row => ({
            ...row,
            streak_start: row.streak_start || row.start_date
        }))
    });
}));

// Log a day (clean or slip)
router.post('/log', validateLog, asyncHandler(async (req, res) => {
    const { userAddictionId, status, reason, note } = req.body;

    if (!userAddictionId || !status) {
        return res.status(400).json({ error: 'userAddictionId and status are required' });
    }

    if (!['clean', 'slip'].includes(status)) {
        return res.status(400).json({ error: 'status must be "clean" or "slip"' });
    }

    // Verify ownership
    const ownership = await query(
        `SELECT id FROM user_addictions WHERE id = $1 AND user_id = $2`,
        [userAddictionId, req.user.id]
    );

    if (ownership.rows.length === 0) {
        return res.status(404).json({ error: 'User addiction not found' });
    }

    const result = await query(
        `INSERT INTO sobriety_logs (user_addiction_id, status, reason, note)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
        [userAddictionId, status, reason, note]
    );

    res.status(201).json({ log: result.rows[0] });
}));

// Log a slip specifically
router.post('/slip', asyncHandler(async (req, res) => {
    const { userAddictionId, reason, note } = req.body;

    if (!userAddictionId) {
        return res.status(400).json({ error: 'userAddictionId is required' });
    }

    // Verify ownership
    const ownership = await query(
        `SELECT id FROM user_addictions WHERE id = $1 AND user_id = $2`,
        [userAddictionId, req.user.id]
    );

    if (ownership.rows.length === 0) {
        return res.status(404).json({ error: 'User addiction not found' });
    }

    const result = await query(
        `INSERT INTO sobriety_logs (user_addiction_id, status, reason, note)
     VALUES ($1, 'slip', $2, $3)
     RETURNING *`,
        [userAddictionId, reason, note]
    );

    res.status(201).json({
        log: result.rows[0],
        message: "It's okay. Recovery isn't linear. You're still making progress.",
    });
}));

// Get logs for a user addiction
router.get('/logs/:userAddictionId', asyncHandler(async (req, res) => {
    const { userAddictionId } = req.params;
    const { limit = 30 } = req.query;

    // Verify ownership
    const ownership = await query(
        `SELECT id FROM user_addictions WHERE id = $1 AND user_id = $2`,
        [userAddictionId, req.user.id]
    );

    if (ownership.rows.length === 0) {
        return res.status(404).json({ error: 'User addiction not found' });
    }

    const result = await query(
        `SELECT * FROM sobriety_logs 
     WHERE user_addiction_id = $1 
     ORDER BY date DESC 
     LIMIT $2`,
        [userAddictionId, parseInt(limit)]
    );

    res.json({ logs: result.rows });
}));

// Restart streak (after a slip)
router.post('/restart/:userAddictionId', asyncHandler(async (req, res) => {
    const { userAddictionId } = req.params;

    // Verify ownership
    const ownership = await query(
        `SELECT id FROM user_addictions WHERE id = $1 AND user_id = $2`,
        [userAddictionId, req.user.id]
    );

    if (ownership.rows.length === 0) {
        return res.status(404).json({ error: 'User addiction not found' });
    }

    // Log a clean day to mark restart
    const result = await query(
        `INSERT INTO sobriety_logs (user_addiction_id, status, note)
     VALUES ($1, 'clean', 'Streak restarted')
     RETURNING *`,
        [userAddictionId]
    );

    res.json({
        log: result.rows[0],
        message: "Fresh start! Every day is a new opportunity.",
    });
}));

module.exports = router;

// --- End of sobriety.js ---
