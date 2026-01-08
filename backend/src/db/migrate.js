// Author: -GLOBENXCC-
// OS support: Windows, Linux, macOS
// Description: Database migration script - creates all tables for AnchorOne

require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const migrate = async () => {
  console.log('🚀 Starting database migration...');

  try {
    // Enable UUID extension
    await pool.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);

    // Users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        firebase_uid TEXT UNIQUE,
        username TEXT,
        anonymous BOOLEAN DEFAULT true,
        intent TEXT,
        intent_reasons TEXT[],
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),
        deleted_at TIMESTAMP
      );
    `);
    console.log('✅ Created users table');

    // Addictions table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS addictions (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name TEXT NOT NULL UNIQUE,
        icon TEXT DEFAULT '⚡',
        is_custom BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('✅ Created addictions table');

    // User addictions junction table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS user_addictions (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        addiction_id UUID REFERENCES addictions(id) ON DELETE CASCADE,
        start_date DATE NOT NULL DEFAULT CURRENT_DATE,
        active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(user_id, addiction_id)
      );
    `);
    console.log('✅ Created user_addictions table');

    // Sobriety logs table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS sobriety_logs (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_addiction_id UUID REFERENCES user_addictions(id) ON DELETE CASCADE,
        date DATE NOT NULL DEFAULT CURRENT_DATE,
        status TEXT CHECK (status IN ('clean', 'slip')) NOT NULL,
        reason TEXT,
        note TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('✅ Created sobriety_logs table');

    // Craving logs table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS craving_logs (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_addiction_id UUID REFERENCES user_addictions(id) ON DELETE CASCADE,
        intensity INTEGER CHECK (intensity BETWEEN 1 AND 10) NOT NULL,
        mood INTEGER CHECK (mood BETWEEN 1 AND 5),
        trigger TEXT,
        note TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('✅ Created craving_logs table');

    // Mood logs table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS mood_logs (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        mood INTEGER CHECK (mood BETWEEN 1 AND 5) NOT NULL,
        note TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('✅ Created mood_logs table');

    // Posts table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS posts (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        addiction_id UUID REFERENCES addictions(id) ON DELETE SET NULL,
        content TEXT NOT NULL,
        image_url TEXT,
        post_type TEXT CHECK (post_type IN ('text', 'image', 'milestone')) DEFAULT 'text',
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),
        deleted_at TIMESTAMP
      );
    `);
    console.log('✅ Created posts table');

    // Comments table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS comments (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('✅ Created comments table');

    // Reactions table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS reactions (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        type TEXT CHECK (type IN ('hear_you', 'stay_strong', 'proud')) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(post_id, user_id, type)
      );
    `);
    console.log('✅ Created reactions table');

    // Messages table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS messages (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
        receiver_id UUID REFERENCES users(id) ON DELETE CASCADE,
        content TEXT NOT NULL,
        read BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('✅ Created messages table');

    // Create indexes for better performance
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_user_addictions_user ON user_addictions(user_id);
      CREATE INDEX IF NOT EXISTS idx_sobriety_logs_user_addiction ON sobriety_logs(user_addiction_id);
      CREATE INDEX IF NOT EXISTS idx_craving_logs_user_addiction ON craving_logs(user_addiction_id);
      CREATE INDEX IF NOT EXISTS idx_craving_logs_created ON craving_logs(created_at);
      CREATE INDEX IF NOT EXISTS idx_posts_user ON posts(user_id);
      CREATE INDEX IF NOT EXISTS idx_posts_created ON posts(created_at DESC);
      CREATE INDEX IF NOT EXISTS idx_comments_post ON comments(post_id);
      CREATE INDEX IF NOT EXISTS idx_reactions_post ON reactions(post_id);
      CREATE INDEX IF NOT EXISTS idx_messages_receiver ON messages(receiver_id);
      CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages(sender_id);
      CREATE INDEX IF NOT EXISTS idx_sobriety_logs_compound ON sobriety_logs(user_addiction_id, status, date);
      CREATE INDEX IF NOT EXISTS idx_mood_logs_user_created ON mood_logs(user_id, created_at);
    `);
    console.log('✅ Created indexes');

    console.log('\n🎉 Migration completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    await pool.end();
  }
};

migrate();

// --- End of migrate.js ---
