// Author: -GLOBENXCC-
// OS support: Windows, Linux, macOS
// Description: Authentication routes - register, login, logout, delete account, export data

const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { query } = require('../config/db');
const { asyncHandler } = require('../middleware/errorHandler');
const { authMiddleware } = require('../middleware/auth');
const admin = require('../config/firebase');

const router = express.Router();

// Email/Password Register
router.post('/register', asyncHandler(async (req, res) => {
    const { email, password, username } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
    }

    // Validate password strength
    if (password.length < 8) {
        return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }

    // Check if email already exists
    const existing = await query(
        `SELECT id FROM users WHERE email = $1`,
        [email.toLowerCase()]
    );

    if (existing.rows.length > 0) {
        return res.status(409).json({ error: 'Email already registered' });
    }

    // Validate username if provided
    if (username) {
        if (username.length < 3 || username.length > 20) {
            return res.status(400).json({ error: 'Username must be 3-20 characters' });
        }
        if (!/^[a-zA-Z0-9_]+$/.test(username)) {
            return res.status(400).json({ error: 'Username can only contain letters, numbers, and underscores' });
        }

        const existingUsername = await query(
            `SELECT id FROM users WHERE LOWER(username) = LOWER($1)`,
            [username]
        );
        if (existingUsername.rows.length > 0) {
            return res.status(409).json({ error: 'Username already taken' });
        }
    }

    // Hash password
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create user
    const result = await query(
        `INSERT INTO users (email, password_hash, username, anonymous) 
         VALUES ($1, $2, $3, false) 
         RETURNING id, email, username, anonymous, created_at`,
        [email.toLowerCase(), passwordHash, username || null]
    );

    const user = result.rows[0];

    // Generate JWT
    const token = jwt.sign(
        { userId: user.id, anonymous: false },
        process.env.JWT_SECRET,
        { expiresIn: '30d' }
    );

    res.status(201).json({
        user: {
            id: user.id,
            email: user.email,
            username: user.username,
            anonymous: user.anonymous,
            createdAt: user.created_at,
        },
        token,
    });
}));

// Email/Password Login
router.post('/login', asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user by email
    const result = await query(
        `SELECT id, email, password_hash, username, anonymous, created_at 
         FROM users WHERE email = $1`,
        [email.toLowerCase()]
    );

    if (result.rows.length === 0) {
        return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = result.rows[0];

    // Check if user has password (might be Google-only)
    if (!user.password_hash) {
        return res.status(401).json({ error: 'Please sign in with Google' });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
        return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate JWT
    const token = jwt.sign(
        { userId: user.id, anonymous: false },
        process.env.JWT_SECRET,
        { expiresIn: '30d' }
    );

    res.json({
        user: {
            id: user.id,
            email: user.email,
            username: user.username,
            anonymous: user.anonymous,
            createdAt: user.created_at,
        },
        token,
    });
}));

// Verify Google/Firebase token and return user
router.post('/google', asyncHandler(async (req, res) => {
    const { idToken } = req.body;

    if (!idToken) {
        return res.status(400).json({ error: 'idToken is required' });
    }

    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const { uid, email, name, picture } = decodedToken;

        // Upsert user
        const result = await query(
            `INSERT INTO users (firebase_uid, email, username, anonymous) 
             VALUES ($1, $2, $3, false) 
             ON CONFLICT (firebase_uid) 
             DO UPDATE SET email = EXCLUDED.email, updated_at = NOW()
             RETURNING id, firebase_uid, email, username, anonymous, created_at`,
            [uid, email, name || email?.split('@')[0]]
        );

        const user = result.rows[0];

        // Generate local JWT for compatibility
        const token = jwt.sign(
            { userId: user.id, anonymous: false },
            process.env.JWT_SECRET,
            { expiresIn: '30d' }
        );

        res.json({
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
                anonymous: user.anonymous,
                createdAt: user.created_at,
                picture: picture
            },
            token,
        });
    } catch (error) {
        console.error('Google auth error:', error);
        res.status(401).json({ error: 'Invalid Google token' });
    }
}));

// Create anonymous user
router.post('/anonymous', asyncHandler(async (req, res) => {
    const result = await query(
        `INSERT INTO users (anonymous) VALUES (true) RETURNING id, anonymous, created_at`
    );

    const user = result.rows[0];

    const token = jwt.sign(
        { userId: user.id, anonymous: true },
        process.env.JWT_SECRET,
        { expiresIn: '30d' }
    );

    res.status(201).json({
        user: {
            id: user.id,
            anonymous: user.anonymous,
            createdAt: user.created_at,
        },
        token,
    });
}));

// Set username (upgrade from anonymous)
router.post('/set-username', asyncHandler(async (req, res) => {
    const { userId, username } = req.body;

    if (!userId || !username) {
        return res.status(400).json({ error: 'userId and username are required' });
    }

    if (username.length < 3 || username.length > 20) {
        return res.status(400).json({ error: 'Username must be 3-20 characters' });
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        return res.status(400).json({ error: 'Username can only contain letters, numbers, and underscores' });
    }

    const existing = await query(
        `SELECT id FROM users WHERE LOWER(username) = LOWER($1) AND id != $2`,
        [username, userId]
    );

    if (existing.rows.length > 0) {
        return res.status(409).json({ error: 'Username already taken' });
    }

    const result = await query(
        `UPDATE users SET username = $1, anonymous = false, updated_at = NOW() 
         WHERE id = $2 
         RETURNING id, username, anonymous, created_at`,
        [username, userId]
    );

    if (result.rows.length === 0) {
        return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user: result.rows[0] });
}));

// Refresh token
router.post('/refresh', asyncHandler(async (req, res) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split('Bearer ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET, { ignoreExpiration: true });

        const result = await query(
            `SELECT id, email, username, anonymous FROM users WHERE id = $1`,
            [decoded.userId]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'User not found' });
        }

        const user = result.rows[0];

        const newToken = jwt.sign(
            { userId: user.id, anonymous: user.anonymous },
            process.env.JWT_SECRET,
            { expiresIn: '30d' }
        );

        res.json({ user, token: newToken });
    } catch (error) {
        return res.status(401).json({ error: 'Invalid token' });
    }
}));

// Logout (client-side token removal, but we can log it)
router.post('/logout', authMiddleware, asyncHandler(async (req, res) => {
    // In a more complex system, we'd invalidate the token server-side
    // For now, just acknowledge the logout
    res.json({ message: 'Logged out successfully' });
}));

// Delete account and all data
router.delete('/account', authMiddleware, asyncHandler(async (req, res) => {
    const userId = req.user.id;

    // Delete all user data (cascades handle related tables)
    await query(`DELETE FROM users WHERE id = $1`, [userId]);

    res.json({ message: 'Account deleted successfully' });
}));

// Export user data (GDPR compliance)
router.get('/export', authMiddleware, asyncHandler(async (req, res) => {
    const userId = req.user.id;

    // Gather all user data
    const [user, addictions, slips, cravings, moods, posts, messages] = await Promise.all([
        query(`SELECT id, email, username, anonymous, intent, country, created_at FROM users WHERE id = $1`, [userId]),
        query(`SELECT * FROM user_addictions WHERE user_id = $1`, [userId]),
        query(`SELECT * FROM slips WHERE user_id = $1 ORDER BY created_at DESC`, [userId]),
        query(`SELECT cl.* FROM craving_logs cl JOIN user_addictions ua ON cl.user_addiction_id = ua.id WHERE ua.user_id = $1`, [userId]),
        query(`SELECT * FROM mood_logs WHERE user_id = $1 ORDER BY created_at DESC`, [userId]),
        query(`SELECT id, content, post_type, created_at FROM posts WHERE user_id = $1 ORDER BY created_at DESC`, [userId]),
        query(`SELECT * FROM messages WHERE sender_id = $1 OR receiver_id = $1 ORDER BY created_at DESC`, [userId]),
    ]);

    const exportData = {
        exportDate: new Date().toISOString(),
        user: user.rows[0] || null,
        addictions: addictions.rows,
        slips: slips.rows,
        cravingLogs: cravings.rows,
        moodLogs: moods.rows,
        posts: posts.rows,
        messages: messages.rows,
    };

    res.json(exportData);
}));

// Change password
router.post('/change-password', authMiddleware, asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
        return res.status(400).json({ error: 'Current and new password are required' });
    }

    if (newPassword.length < 8) {
        return res.status(400).json({ error: 'New password must be at least 8 characters' });
    }

    // Get current password hash
    const result = await query(
        `SELECT password_hash FROM users WHERE id = $1`,
        [userId]
    );

    if (result.rows.length === 0) {
        return res.status(404).json({ error: 'User not found' });
    }

    const user = result.rows[0];

    if (!user.password_hash) {
        return res.status(400).json({ error: 'No password set. Use Google sign-in.' });
    }

    // Verify current password
    const isValid = await bcrypt.compare(currentPassword, user.password_hash);
    if (!isValid) {
        return res.status(401).json({ error: 'Current password is incorrect' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(12);
    const newHash = await bcrypt.hash(newPassword, salt);

    await query(
        `UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2`,
        [newHash, userId]
    );

    res.json({ message: 'Password changed successfully' });
}));

module.exports = router;

// --- End of auth.js ---
