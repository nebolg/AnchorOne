// Author: -GLOBENXCC-
// OS support: Windows, Linux, macOS
// Description: Authentication middleware for Firebase token verification with fallback to local JWT

const admin = require('../config/firebase');
const jwt = require('jsonwebtoken');
const { query } = require('../config/db');

// Check if Firebase is available
const firebaseInitialized = !!(process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_PRIVATE_KEY);

const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'No token provided' });
        }

        const token = authHeader.split('Bearer ')[1];

        let userId;
        let isAnonymous = true;

        // Try Firebase verification first
        if (firebaseInitialized) {
            try {
                const decodedToken = await admin.auth().verifyIdToken(token);
                userId = decodedToken.uid;
                isAnonymous = decodedToken.firebase?.sign_in_provider === 'anonymous';

                // Upsert user in database
                const result = await query(
                    `INSERT INTO users (firebase_uid, anonymous) 
           VALUES ($1, $2) 
           ON CONFLICT (firebase_uid) 
           DO UPDATE SET updated_at = NOW()
           RETURNING id, firebase_uid, username, anonymous`,
                    [userId, isAnonymous]
                );

                req.user = result.rows[0];
                req.firebaseUser = true;
                return next();
            } catch (firebaseError) {
                // Fall through to local JWT
            }
        }

        // Local JWT verification (for development/testing)
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            const result = await query(
                `SELECT id, firebase_uid, username, anonymous FROM users WHERE id = $1`,
                [decoded.userId]
            );

            if (result.rows.length === 0) {
                return res.status(401).json({ error: 'User not found' });
            }

            req.user = result.rows[0];
            req.firebaseUser = false;
            return next();
        } catch (jwtError) {
            return res.status(401).json({ error: 'Invalid token' });
        }
    } catch (error) {
        console.error('Auth middleware error:', error);
        return res.status(500).json({ error: 'Authentication error' });
    }
};

// Optional auth - allows unauthenticated requests but attaches user if token present
const optionalAuth = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next();
    }

    return authMiddleware(req, res, next);
};

module.exports = {
    authMiddleware,
    optionalAuth,
};

// --- End of auth.js ---
