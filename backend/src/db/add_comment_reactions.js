// Author: -GLOBENXCC-
// OS support: Windows, Linux, macOS
// Description: Hotfix to add comment_reactions table to database

require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

const run = async () => {
    console.log('🚀 Running database update...');

    try {
        // Comment reactions table
        await pool.query(`
      CREATE TABLE IF NOT EXISTS comment_reactions (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        comment_id UUID REFERENCES comments(id) ON DELETE CASCADE,
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        type TEXT DEFAULT 'hear_you' NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(comment_id, user_id, type)
      );
    `);
        console.log('✅ Created comment_reactions table');

        await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_comment_reactions_comment ON comment_reactions(comment_id);
    `);
        console.log('✅ Created index for comment_reactions');

        console.log('\n🎉 Update completed successfully!');
    } catch (error) {
        console.error('❌ Update failed:', error);
    } finally {
        await pool.end();
    }
};

run();
