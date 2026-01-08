// Author: -GLOBENXCC-
// OS support: Node.js
// Description: API routes for slip/relapse tracking

const express = require('express');
const router = express.Router();
const { query } = require('../config/db');
const { asyncHandler } = require('../middleware/errorHandler');

// Log a new slip
router.post('/', asyncHandler(async (req, res) => {
    // Debug: log user object
    console.log('[Slips] req.user:', JSON.stringify(req.user, null, 2));

    const userId = req.user?.id;

    if (!userId) {
        console.error('[Slips] No user id in req.user:', req.user);
        return res.status(401).json({ error: 'User authentication required' });
    }

    const {
        addictionId,
        addictionName,
        slipDate,
        severity,
        trigger,
        triggerDetails,
        moodBefore,
        moodAfter,
        location,
        durationMinutes,
        notes,
        streakDaysLost,
        learned
    } = req.body;

    if (!addictionId) {
        return res.status(400).json({ error: 'Addiction ID is required' });
    }

    const result = await query(
        `INSERT INTO slips (
            user_id, addiction_id, addiction_name, slip_date, severity,
            trigger, trigger_details, mood_before, mood_after, location,
            duration_minutes, notes, streak_days_lost, learned
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
        RETURNING *`,
        [
            userId,
            addictionId,
            addictionName || null,
            slipDate || new Date(),
            severity || 3,
            trigger || null,
            triggerDetails || null,
            moodBefore || null,
            moodAfter || null,
            location || null,
            durationMinutes || null,
            notes || null,
            streakDaysLost || 0,
            learned || null
        ]
    );

    res.status(201).json({
        message: 'Slip logged successfully',
        slip: result.rows[0]
    });
}));

// Get all slips for user
router.get('/', asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { addictionId, limit = 50, offset = 0 } = req.query;

    let sql = `SELECT * FROM slips WHERE user_id = $1`;
    const params = [userId];

    if (addictionId) {
        sql += ` AND addiction_id = $2`;
        params.push(addictionId);
    }

    sql += ` ORDER BY slip_date DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(parseInt(limit), parseInt(offset));

    const result = await query(sql, params);

    res.json({
        slips: result.rows,
        count: result.rows.length
    });
}));

// Get slip statistics
router.get('/stats', asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { addictionId, days = 30 } = req.query;
    const daysInt = parseInt(days);

    let whereClause = `user_id = $1 AND slip_date > NOW() - INTERVAL '${daysInt} days'`;
    const params = [userId];

    if (addictionId) {
        whereClause += ` AND addiction_id = $2`;
        params.push(addictionId);
    }

    const countResult = await query(
        `SELECT COUNT(*) as total FROM slips WHERE ${whereClause}`,
        params
    );

    const severityResult = await query(
        `SELECT AVG(severity) as avg_severity FROM slips WHERE ${whereClause}`,
        params
    );

    const triggersResult = await query(
        `SELECT trigger, COUNT(*) as count 
         FROM slips 
         WHERE ${whereClause} AND trigger IS NOT NULL
         GROUP BY trigger 
         ORDER BY count DESC 
         LIMIT 5`,
        params
    );

    const byAddictionResult = await query(
        `SELECT addiction_id, addiction_name, COUNT(*) as count
         FROM slips 
         WHERE user_id = $1 AND slip_date > NOW() - INTERVAL '${daysInt} days'
         GROUP BY addiction_id, addiction_name
         ORDER BY count DESC`,
        [userId]
    );

    res.json({
        period: `${days} days`,
        totalSlips: parseInt(countResult.rows[0].total),
        averageSeverity: parseFloat(severityResult.rows[0].avg_severity) || 0,
        topTriggers: triggersResult.rows,
        byAddiction: byAddictionResult.rows
    });
}));

// Get single slip
router.get('/:id', asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { id } = req.params;

    const result = await query(
        'SELECT * FROM slips WHERE id = $1 AND user_id = $2',
        [id, userId]
    );

    if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Slip not found' });
    }

    res.json(result.rows[0]);
}));

// Update slip
router.patch('/:id', asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { id } = req.params;
    const { notes, learned, severity } = req.body;

    const updates = [];
    const values = [];
    let paramCount = 1;

    if (notes !== undefined) {
        updates.push(`notes = $${paramCount++}`);
        values.push(notes);
    }
    if (learned !== undefined) {
        updates.push(`learned = $${paramCount++}`);
        values.push(learned);
    }
    if (severity !== undefined) {
        updates.push(`severity = $${paramCount++}`);
        values.push(severity);
    }

    updates.push(`updated_at = NOW()`);
    values.push(id, userId);

    const result = await query(
        `UPDATE slips SET ${updates.join(', ')} 
         WHERE id = $${paramCount++} AND user_id = $${paramCount}
         RETURNING *`,
        values
    );

    if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Slip not found' });
    }

    res.json(result.rows[0]);
}));

// Delete slip
router.delete('/:id', asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { id } = req.params;

    const result = await query(
        'DELETE FROM slips WHERE id = $1 AND user_id = $2 RETURNING id',
        [id, userId]
    );

    if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Slip not found' });
    }

    res.json({ message: 'Slip deleted successfully' });
}));

module.exports = router;

// --- End of slips.js ---
