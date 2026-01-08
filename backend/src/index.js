// Author: -GLOBENXCC-
// OS support: Windows, Linux, macOS
// Description: Main Express server entry point for AnchorOne backend

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');

const authRoutes = require('./routes/auth');
const usersRoutes = require('./routes/users');
const addictionsRoutes = require('./routes/addictions');
const sobrietyRoutes = require('./routes/sobriety');
const cravingsRoutes = require('./routes/cravings');
const postsRoutes = require('./routes/posts');
const commentsRoutes = require('./routes/comments');
const reactionsRoutes = require('./routes/reactions');
const commentReactionsRoutes = require('./routes/commentReactions');
const messagesRoutes = require('./routes/messages');
const insightsRoutes = require('./routes/insights');
const slipsRoutes = require('./routes/slips');
const feedbackRoutes = require('./routes/feedback');
const analyticsRoutes = require('./routes/analytics');
const contentRoutes = require('./routes/content');

const { errorHandler } = require('./middleware/errorHandler');
const { authMiddleware } = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet({
    contentSecurityPolicy: false, // Allow inline scripts for admin dashboard
}));
app.use(cors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
    credentials: true,
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (admin dashboard)
app.use('/admin', express.static(path.join(__dirname, '../public/admin')));

// Health check
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        service: 'AnchorOne API',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
    });
});

// Public routes
app.use('/api/auth', authRoutes);
app.use('/api/feedback', feedbackRoutes); // Feedback - submit is public, admin routes need key
app.use('/api/analytics', analyticsRoutes); // Analytics - activity/session public, dashboard admin-only
app.use('/api/content', contentRoutes); // Content stats - admin only

// Protected routes (require authentication)
app.use('/api/users', authMiddleware, usersRoutes);
app.use('/api/addictions', authMiddleware, addictionsRoutes);
app.use('/api/sobriety', authMiddleware, sobrietyRoutes);
app.use('/api/cravings', authMiddleware, cravingsRoutes);
app.use('/api/posts', authMiddleware, postsRoutes);
app.use('/api/comments', authMiddleware, commentsRoutes);
app.use('/api/reactions', authMiddleware, reactionsRoutes);
app.use('/api/comment-reactions', authMiddleware, commentReactionsRoutes);
app.use('/api/messages', authMiddleware, messagesRoutes);
app.use('/api/insights', authMiddleware, insightsRoutes);
app.use('/api/slips', authMiddleware, slipsRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use(errorHandler);

// Start server - bind to 0.0.0.0 for network access
app.listen(PORT, '0.0.0.0', () => {
    console.log(`
  ⚓ AnchorOne API Server
  ========================
  Status: Running
  Port: ${PORT}
  Host: 0.0.0.0 (accessible from network)
  Environment: ${process.env.NODE_ENV || 'development'}
  Time: ${new Date().toISOString()}
  `);

    // Run database migrations on startup
    const { runMigrations } = require('./config/migrations');
    runMigrations().catch(err => console.error('Migration error:', err));
});

module.exports = app;

// --- End of index.js ---
