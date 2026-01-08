// Author: -GLOBENXCC-
// OS support: Windows, Linux, macOS
// Description: Database migration runner for auto-migrations on server startup

const pool = require('./db');

const migrations = [
    {
        name: 'create_feedback_table',
        sql: `
            CREATE TABLE IF NOT EXISTS feedback (
                id SERIAL PRIMARY KEY,
                type VARCHAR(50) NOT NULL,
                area VARCHAR(50),
                title VARCHAR(255) NOT NULL,
                description TEXT NOT NULL,
                user_id VARCHAR(255),
                device_info JSONB,
                status VARCHAR(50) DEFAULT 'pending',
                response TEXT,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                updated_at TIMESTAMP WITH TIME ZONE
            );
            
            CREATE INDEX IF NOT EXISTS idx_feedback_status ON feedback(status);
            CREATE INDEX IF NOT EXISTS idx_feedback_type ON feedback(type);
            CREATE INDEX IF NOT EXISTS idx_feedback_created ON feedback(created_at DESC);
        `,
    },
    {
        name: 'create_app_sessions_table',
        sql: `
            CREATE TABLE IF NOT EXISTS app_sessions (
                id SERIAL PRIMARY KEY,
                user_id VARCHAR(255) UNIQUE NOT NULL,
                session_count INTEGER DEFAULT 1,
                device_info JSONB,
                app_version VARCHAR(50),
                started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
            
            CREATE INDEX IF NOT EXISTS idx_sessions_last_active ON app_sessions(last_active);
            CREATE INDEX IF NOT EXISTS idx_sessions_user ON app_sessions(user_id);
        `,
    },
    {
        name: 'create_user_activity_table',
        sql: `
            CREATE TABLE IF NOT EXISTS user_activity (
                id SERIAL PRIMARY KEY,
                user_id VARCHAR(255) NOT NULL,
                screen VARCHAR(100),
                action VARCHAR(100),
                metadata JSONB,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
            
            CREATE INDEX IF NOT EXISTS idx_activity_user ON user_activity(user_id);
            CREATE INDEX IF NOT EXISTS idx_activity_screen ON user_activity(screen);
            CREATE INDEX IF NOT EXISTS idx_activity_created ON user_activity(created_at);
        `,
    },
];

async function runMigrations() {
    console.log('📦 Running database migrations...');

    for (const migration of migrations) {
        try {
            await pool.query(migration.sql);
            console.log(`  ✅ ${migration.name}`);
        } catch (error) {
            // Ignore "already exists" errors
            if (error.code === '42P07' || error.code === '42710') {
                console.log(`  ⏭️  ${migration.name} (already exists)`);
            } else {
                console.error(`  ❌ ${migration.name}:`, error.message);
            }
        }
    }

    console.log('📦 Migrations complete!\n');
}

module.exports = { runMigrations };

// --- End of migrations.js ---
