// Author: -GLOBENXCC-
// OS support: Windows, Linux, macOS
// Description: Global error handler middleware

const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);

    // Validation errors
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            error: 'Validation failed',
            details: err.errors,
        });
    }

    // PostgreSQL errors
    if (err.code) {
        switch (err.code) {
            case '23505': // unique_violation
                return res.status(409).json({ error: 'Resource already exists' });
            case '23503': // foreign_key_violation
                return res.status(400).json({ error: 'Referenced resource not found' });
            case '23502': // not_null_violation
                return res.status(400).json({ error: 'Required field missing' });
            default:
                break;
        }
    }

    // Default error response
    const statusCode = err.statusCode || 500;
    const message = process.env.NODE_ENV === 'production'
        ? 'Internal server error'
        : err.message;

    res.status(statusCode).json({
        error: message,
        ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
    });
};

// Async handler wrapper to catch errors in async routes
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = {
    errorHandler,
    asyncHandler,
};

// --- End of errorHandler.js ---
