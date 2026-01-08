// Author: -GLOBENXCC-
// OS support: Windows, Linux, macOS
// Description: Database seed script - populates predefined addictions

require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

const PREDEFINED_ADDICTIONS = [
    { name: 'Alcohol', icon: 'wine' },
    { name: 'Cigarettes / Vape', icon: 'smoke-free' },
    { name: 'Drugs', icon: 'biotech' },
    { name: 'Porn', icon: 'shield-lock' },
    { name: 'Gambling', icon: 'dice-6' },
    { name: 'Gaming', icon: 'game-controller' },
    { name: 'Social Media', icon: 'phone-portrait' },
    { name: 'Sugar', icon: 'leaf' },
];

const seed = async () => {
    console.log('🌱 Starting database seeding...');

    try {
        for (const addiction of PREDEFINED_ADDICTIONS) {
            await pool.query(
                `INSERT INTO addictions (name, icon, is_custom) 
         VALUES ($1, $2, false) 
         ON CONFLICT (name) DO NOTHING`,
                [addiction.name, addiction.icon]
            );
            console.log(`✅ Added addiction: ${addiction.icon} ${addiction.name}`);
        }

        console.log('\n🎉 Seeding completed successfully!');
    } catch (error) {
        console.error('❌ Seeding failed:', error);
        throw error;
    } finally {
        await pool.end();
    }
};

seed();

// --- End of seed.js ---
