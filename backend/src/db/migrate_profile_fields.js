// Author: -GLOBENXCC-
// OS support: Windows, Linux, macOS
// Description: Add profile enhancement fields to users table

require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

const migrate = async () => {
    console.log('🚀 Adding profile enhancement fields...');

    try {
        // Add columns to users table
        await pool.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS avatar_id TEXT,
      ADD COLUMN IF NOT EXISTS avatar_color TEXT,
      ADD COLUMN IF NOT EXISTS avatar_url TEXT,
      ADD COLUMN IF NOT EXISTS bio TEXT,
      ADD COLUMN IF NOT EXISTS catchphrase TEXT,
      ADD COLUMN IF NOT EXISTS last_username_change TIMESTAMP,
      ADD COLUMN IF NOT EXISTS country TEXT;
    `);

        console.log('✅ Added columns to users table');
        console.log('\n🎉 Migration completed successfully!');
    } catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    } finally {
        await pool.end();
    }
};

migrate();

// --- End of migrate_profile_fields.js ---
