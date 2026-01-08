// Author: -GLOBENXCC-
// OS support: iOS, Android, Web
// Description: Backend API for private feedback collection (dev-only access)

const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Admin secret for accessing feedback (set this in environment variables)
const ADMIN_SECRET = process.env.FEEDBACK_ADMIN_SECRET || 'anchorone-dev-2024';

// Middleware to verify admin access
const verifyAdmin = (req, res, next) => {
    const adminKey = req.headers['x-admin-key'];
    if (adminKey !== ADMIN_SECRET) {
        return res.status(403).json({ error: 'Unauthorized access' });
    }
    next();
};

// Submit feedback (public - any user can submit)
router.post('/submit', async (req, res) => {
    try {
        const { type, area, title, description, userId, deviceInfo } = req.body;

        if (!type || !title || !description) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const result = await pool.query(
            `INSERT INTO feedback (type, area, title, description, user_id, device_info, status, created_at)
             VALUES ($1, $2, $3, $4, $5, $6, 'pending', NOW())
             RETURNING id, created_at`,
            [type, area, title, description, userId || null, JSON.stringify(deviceInfo) || null]
        );

        const feedback = result.rows[0];
        console.log(`[Feedback] New submission: ${type} - ${title}`);

        res.status(201).json({
            success: true,
            feedbackId: feedback.id,
            message: 'Feedback submitted successfully',
        });
    } catch (error) {
        console.error('[Feedback] Submit error:', error);
        res.status(500).json({ error: 'Failed to submit feedback' });
    }
});

// Get all feedback (ADMIN ONLY)
router.get('/all', verifyAdmin, async (req, res) => {
    try {
        const { status, type, limit = 50, offset = 0 } = req.query;

        let query = 'SELECT * FROM feedback';
        const params = [];
        const conditions = [];

        if (status) {
            params.push(status);
            conditions.push(`status = $${params.length}`);
        }

        if (type) {
            params.push(type);
            conditions.push(`type = $${params.length}`);
        }

        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }

        query += ' ORDER BY created_at DESC';
        params.push(parseInt(limit));
        query += ` LIMIT $${params.length}`;
        params.push(parseInt(offset));
        query += ` OFFSET $${params.length}`;

        const result = await pool.query(query, params);

        // Get counts
        const counts = await pool.query(`
            SELECT 
                COUNT(*) as total,
                COUNT(*) FILTER (WHERE status = 'pending') as pending,
                COUNT(*) FILTER (WHERE status = 'reviewed') as reviewed,
                COUNT(*) FILTER (WHERE status = 'implemented') as implemented,
                COUNT(*) FILTER (WHERE status = 'closed') as closed
            FROM feedback
        `);

        res.json({
            feedback: result.rows,
            stats: counts.rows[0],
            pagination: {
                limit: parseInt(limit),
                offset: parseInt(offset),
                total: parseInt(counts.rows[0].total),
            },
        });
    } catch (error) {
        console.error('[Feedback] Get all error:', error);
        res.status(500).json({ error: 'Failed to fetch feedback' });
    }
});

// Update feedback status (ADMIN ONLY)
router.patch('/:id/status', verifyAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { status, response } = req.body;

        if (!['pending', 'reviewed', 'implemented', 'closed'].includes(status)) {
            return res.status(400).json({ error: 'Invalid status' });
        }

        const result = await pool.query(
            `UPDATE feedback 
             SET status = $1, response = $2, updated_at = NOW()
             WHERE id = $3
             RETURNING *`,
            [status, response || null, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Feedback not found' });
        }

        res.json({
            success: true,
            feedback: result.rows[0],
        });
    } catch (error) {
        console.error('[Feedback] Update status error:', error);
        res.status(500).json({ error: 'Failed to update feedback' });
    }
});

// Delete feedback (ADMIN ONLY)
router.delete('/:id', verifyAdmin, async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            'DELETE FROM feedback WHERE id = $1 RETURNING id',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Feedback not found' });
        }

        res.json({
            success: true,
            message: 'Feedback deleted',
        });
    } catch (error) {
        console.error('[Feedback] Delete error:', error);
        res.status(500).json({ error: 'Failed to delete feedback' });
    }
});

// Export feedback as JSON (ADMIN ONLY)
router.get('/export', verifyAdmin, async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM feedback ORDER BY created_at DESC'
        );

        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', 'attachment; filename=feedback-export.json');
        res.json({
            exportedAt: new Date().toISOString(),
            totalCount: result.rows.length,
            feedback: result.rows,
        });
    } catch (error) {
        console.error('[Feedback] Export error:', error);
        res.status(500).json({ error: 'Failed to export feedback' });
    }
});

module.exports = router;

// --- End of feedback.js ---
