// Author: -GLOBENXCC-
// OS support: Windows, Linux, macOS
// Description: Craving logging routes

const express = require('express');
const { body, validationResult } = require('express-validator');
const { query } = require('../config/db');
const { asyncHandler } = require('../middleware/errorHandler');

const router = express.Router();

const validateCraving = [
    body('userAddictionId').isUUID().withMessage('Invalid addiction ID'),
    body('intensity').isInt({ min: 1, max: 10 }).withMessage('Intensity must be between 1 and 10'),
    body('mood').optional().isInt({ min: 1, max: 5 }).withMessage('Mood must be between 1 and 5'),
    body('trigger').optional().trim().isLength({ max: 200 }),
    body('note').optional().trim().isLength({ max: 1000 }),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

const validateMoodLog = [
    body('mood').isInt({ min: 1, max: 5 }).withMessage('Mood must be between 1 and 5'),
    body('note').optional().trim().isLength({ max: 1000 }),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

// Log a craving
router.post('/', validateCraving, asyncHandler(async (req, res) => {
    const { userAddictionId, intensity, mood, trigger, note } = req.body;

    // Verify ownership
    const ownership = await query(
        `SELECT id FROM user_addictions WHERE id = $1 AND user_id = $2`,
        [userAddictionId, req.user.id]
    );

    if (ownership.rows.length === 0) {
        return res.status(404).json({ error: 'User addiction not found' });
    }

    const result = await query(
        `INSERT INTO craving_logs(user_addiction_id, intensity, mood, trigger, note)
VALUES($1, $2, $3, $4, $5)
RETURNING * `,
        [userAddictionId, intensity, mood, trigger, note]
    );

    res.status(201).json({ craving: result.rows[0] });
}));

// Get cravings for a user addiction
router.get('/:userAddictionId', asyncHandler(async (req, res) => {
    const { userAddictionId } = req.params;
    const { days = 7 } = req.query;

    // Verify ownership
    const ownership = await query(
        `SELECT id FROM user_addictions WHERE id = $1 AND user_id = $2`,
        [userAddictionId, req.user.id]
    );

    if (ownership.rows.length === 0) {
        return res.status(404).json({ error: 'User addiction not found' });
    }

    const result = await query(
        `SELECT * FROM craving_logs 
     WHERE user_addiction_id = $1 
       AND created_at >= NOW() - INTERVAL '1 day' * $2
     ORDER BY created_at DESC`,
        [userAddictionId, parseInt(days)]
    );

    res.json({ cravings: result.rows });
}));

// Get all user's cravings
router.get('/', asyncHandler(async (req, res) => {
    const { days = 30 } = req.query;

    const result = await query(
        `SELECT cl.*, a.name as addiction_name, a.icon
     FROM craving_logs cl
     JOIN user_addictions ua ON cl.user_addiction_id = ua.id
     JOIN addictions a ON ua.addiction_id = a.id
     WHERE ua.user_id = $1
       AND cl.created_at >= NOW() - INTERVAL '1 day' * $2
     ORDER BY cl.created_at DESC`,
        [req.user.id, parseInt(days)]
    );

    res.json({ cravings: result.rows });
}));

// Log mood separately
router.post('/mood', validateMoodLog, asyncHandler(async (req, res) => {
    const { mood, note } = req.body;

    const result = await query(
        `INSERT INTO mood_logs(user_id, mood, note)
VALUES($1, $2, $3)
RETURNING * `,
        [req.user.id, mood, note]
    );

    res.status(201).json({ moodLog: result.rows[0] });
}));

// Get mood logs
router.get('/moods/history', asyncHandler(async (req, res) => {
    const { days = 30 } = req.query;

    const result = await query(
        `SELECT * FROM mood_logs 
     WHERE user_id = $1 
       AND created_at >= NOW() - INTERVAL '1 day' * $2
     ORDER BY created_at DESC`,
        [req.user.id, parseInt(days)]
    );

    res.json({ moods: result.rows });
}));

module.exports = router;

// --- End of cravings.js ---
