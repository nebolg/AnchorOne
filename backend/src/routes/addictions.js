// Author: -GLOBENXCC-
// OS support: Windows, Linux, macOS
// Description: Addiction management routes

const express = require('express');
const { query } = require('../config/db');
const { asyncHandler } = require('../middleware/errorHandler');

const router = express.Router();

// Get all available addictions
router.get('/', asyncHandler(async (req, res) => {
    const result = await query(
        `SELECT id, name, icon, is_custom FROM addictions ORDER BY is_custom, name`
    );
    res.json({ addictions: result.rows });
}));

// Get user's addictions
router.get('/mine', asyncHandler(async (req, res) => {
    const result = await query(
        `SELECT ua.id, ua.start_date, ua.active, ua.created_at,
            a.id as addiction_id, a.name, a.icon, a.is_custom
     FROM user_addictions ua
     JOIN addictions a ON ua.addiction_id = a.id
     WHERE ua.user_id = $1
     ORDER BY ua.created_at`,
        [req.user.id]
    );
    res.json({ userAddictions: result.rows });
}));

// Add addiction to user's list
router.post('/mine', asyncHandler(async (req, res) => {
    const { addictionId, startDate } = req.body;

    if (!addictionId) {
        return res.status(400).json({ error: 'addictionId is required' });
    }

    const result = await query(
        `INSERT INTO user_addictions (user_id, addiction_id, start_date)
     VALUES ($1, $2, $3)
     ON CONFLICT (user_id, addiction_id) DO UPDATE SET active = true, start_date = EXCLUDED.start_date
     RETURNING *`,
        [req.user.id, addictionId, startDate || new Date()]
    );

    // Get full addiction info
    const addiction = await query(
        `SELECT a.id as addiction_id, a.name, a.icon, a.is_custom
     FROM addictions a WHERE a.id = $1`,
        [addictionId]
    );

    res.status(201).json({
        userAddiction: {
            ...result.rows[0],
            ...addiction.rows[0],
        }
    });
}));

// Create custom addiction
router.post('/custom', asyncHandler(async (req, res) => {
    const { name, icon } = req.body;

    if (!name) {
        return res.status(400).json({ error: 'name is required' });
    }

    // Create addiction
    const addictionResult = await query(
        `INSERT INTO addictions (name, icon, is_custom) VALUES ($1, $2, true) RETURNING *`,
        [name, icon || '⚡']
    );

    // Add to user's list
    const userAddictionResult = await query(
        `INSERT INTO user_addictions (user_id, addiction_id, start_date)
     VALUES ($1, $2, CURRENT_DATE)
     RETURNING *`,
        [req.user.id, addictionResult.rows[0].id]
    );

    res.status(201).json({
        addiction: addictionResult.rows[0],
        userAddiction: userAddictionResult.rows[0],
    });
}));

// Update user addiction (e.g., change start date)
router.patch('/mine/:id', asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { startDate, active } = req.body;

    const updates = [];
    const values = [];
    let paramCount = 0;

    if (startDate !== undefined) {
        paramCount++;
        updates.push(`start_date = $${paramCount}`);
        values.push(startDate);
    }

    if (active !== undefined) {
        paramCount++;
        updates.push(`active = $${paramCount}`);
        values.push(active);
    }

    if (updates.length === 0) {
        return res.status(400).json({ error: 'No fields to update' });
    }

    paramCount++;
    values.push(id);
    paramCount++;
    values.push(req.user.id);

    const result = await query(
        `UPDATE user_addictions SET ${updates.join(', ')} 
     WHERE id = $${paramCount - 1} AND user_id = $${paramCount}
     RETURNING *`,
        values
    );

    if (result.rows.length === 0) {
        return res.status(404).json({ error: 'User addiction not found' });
    }

    res.json({ userAddiction: result.rows[0] });
}));

// Remove addiction from user's list
router.delete('/mine/:id', asyncHandler(async (req, res) => {
    const { id } = req.params;

    await query(
        `DELETE FROM user_addictions WHERE id = $1 AND user_id = $2`,
        [id, req.user.id]
    );

    res.status(204).send();
}));

module.exports = router;

// --- End of addictions.js ---
