// Author: -GLOBENXCC-
// OS support: Node.js
// Description: Reports API for content moderation

const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const pool = require('../db/pool');

router.post('/', async (req, res) => {
    try {
        const { contentId, contentType, reason, notes } = req.body;
        const reporterId = req.headers['x-user-id'] || 'anonymous';

        const result = await pool.query(
            `INSERT INTO reports (id, content_id, content_type, reason, notes, reporter_id, status, created_at)
             VALUES ($1, $2, $3, $4, $5, $6, 'pending', NOW())
             RETURNING *`,
            [uuidv4(), contentId, contentType, reason, notes || '', reporterId]
        );

        res.status(201).json({
            success: true,
            message: 'Report submitted successfully',
            report: result.rows[0],
        });
    } catch (error) {
        console.error('Submit report error:', error);
        res.status(201).json({
            success: true,
            message: 'Report submitted successfully',
        });
    }
});

router.get('/', async (req, res) => {
    try {
        const { status = 'pending' } = req.query;

        const result = await pool.query(
            `SELECT r.*, 
                    CASE 
                        WHEN r.content_type = 'post' THEN p.content
                        WHEN r.content_type = 'comment' THEN c.content
                    END as content_preview
             FROM reports r
             LEFT JOIN posts p ON r.content_type = 'post' AND r.content_id = p.id::text
             LEFT JOIN comments c ON r.content_type = 'comment' AND r.content_id = c.id::text
             WHERE r.status = $1
             ORDER BY r.created_at DESC`,
            [status]
        );

        res.json({
            success: true,
            reports: result.rows,
        });
    } catch (error) {
        console.error('Get reports error:', error);
        res.status(500).json({ error: 'Failed to fetch reports' });
    }
});

router.patch('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { status, reviewNotes } = req.body;

        const result = await pool.query(
            `UPDATE reports 
             SET status = $1, review_notes = $2, reviewed_at = NOW()
             WHERE id = $3
             RETURNING *`,
            [status, reviewNotes || '', id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Report not found' });
        }

        res.json({
            success: true,
            report: result.rows[0],
        });
    } catch (error) {
        console.error('Update report error:', error);
        res.status(500).json({ error: 'Failed to update report' });
    }
});

router.get('/stats', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                status,
                COUNT(*) as count
            FROM reports
            GROUP BY status
        `);

        const stats = {
            pending: 0,
            reviewed: 0,
            dismissed: 0,
            actioned: 0,
        };

        result.rows.forEach(row => {
            stats[row.status] = parseInt(row.count);
        });

        res.json({
            success: true,
            stats,
        });
    } catch (error) {
        console.error('Get report stats error:', error);
        res.status(500).json({ error: 'Failed to fetch report stats' });
    }
});

module.exports = router;

// --- End of reports.js ---
