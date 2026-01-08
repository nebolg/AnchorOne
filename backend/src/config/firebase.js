// Author: -GLOBENXCC-
// OS support: Windows, Linux, macOS
// Description: Firebase Admin initialization for token verification

const admin = require('firebase-admin');

if (!process.env.FIREBASE_PROJECT_ID) {
    console.warn('⚠️ FIREBASE_PROJECT_ID not set in .env');
}

const serviceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    // Handle escaped newlines in private key
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
};

try {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
    });
    console.log('✅ Firebase Admin initialized');
} catch (error) {
    console.error('❌ Firebase Admin initialization failed:', error.message);
}

module.exports = admin;

// --- End of firebase.js ---
