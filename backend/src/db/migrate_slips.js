// Author: -GLOBENXCC-
// OS support: Node.js
// Description: Database migration to create slips table for tracking relapses

require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

async function migrate() {
    console.log('🚀 Creating slips table...');

    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS slips (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                user_id VARCHAR(255) NOT NULL REFERENCES users(firebase_uid) ON DELETE CASCADE,
                addiction_id VARCHAR(100) NOT NULL,
                addiction_name VARCHAR(255),
                slip_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                severity INTEGER DEFAULT 3 CHECK (severity >= 1 AND severity <= 5),
                trigger VARCHAR(100),
                trigger_details TEXT,
                mood_before VARCHAR(50),
                mood_after VARCHAR(50),
                location VARCHAR(255),
                duration_minutes INTEGER,
                notes TEXT,
                streak_days_lost INTEGER DEFAULT 0,
                learned TEXT,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
            
            CREATE INDEX IF NOT EXISTS idx_slips_user_id ON slips(user_id);
            CREATE INDEX IF NOT EXISTS idx_slips_addiction_id ON slips(addiction_id);
            CREATE INDEX IF NOT EXISTS idx_slips_slip_date ON slips(slip_date);
        `);

        console.log('✅ Slips table created successfully');

    } catch (error) {
        console.error('❌ Migration failed:', error.message);
        throw error;
    } finally {
        await pool.end();
    }
}

migrate()
    .then(() => {
        console.log('🎉 Migration completed!');
        process.exit(0);
    })
    .catch((error) => {
        console.error('Migration error:', error);
        process.exit(1);
    });

// --- End of migrate_slips.js ---
